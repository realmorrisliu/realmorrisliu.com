"""Audit shortlist identifiability without filling unknown scores or ranking cities."""

import argparse
import csv
import hashlib
import io
import json
import math
from bisect import bisect_left, bisect_right
from collections import Counter
from pathlib import Path

from cci_global_coverage import DIMENSIONS, ROOT
from cci_global_evidence_matrix import indexed, local_cases
from cci_unmatched_centre_review import verify as verify_unmatched_centres


def total(scores, weights):
    if (set(weights) != set(DIMENSIONS) or sum(weights.values()) != 100
            or any(type(w) not in (int, float) or not math.isfinite(w) or w <= 0
                   for w in weights.values()) or not set(scores).issubset(weights)):
        raise ValueError('Invalid dimensions or weights')
    if any(type(v) not in (int, float) or not math.isfinite(v) or not 0 <= v <= 100
           for v in scores.values()):
        raise ValueError('Invalid known score')
    lower = sum(scores[d] * weights[d] / 100 for d in scores)
    missing = sum(weights[d] for d in weights if d not in scores)
    return {'center': None if missing else lower, 'lower': lower, 'upper': lower + missing}


def positions(bounds):
    if any(not math.isfinite(b[k]) for b in bounds for k in ('lower', 'upper')):
        raise ValueError('Nonfinite score domain')
    if any(not 0 <= b['lower'] <= b['upper'] <= 100 for b in bounds):
        raise ValueError('Invalid score domain')
    lowers = sorted(b['lower'] for b in bounds)
    uppers = sorted(b['upper'] for b in bounds)
    # Ties may occupy any position; source order never decides shortlist membership.
    return [{'bestPosition': 1 + len(bounds) - bisect_right(lowers, b['upper']),
             'worstPosition': len(bounds) - bisect_left(uppers, b['lower'])}
            for b in bounds]


def evaluate(candidates, cases, weights, omitted=()):
    expected = {c['efua_id'] for c in candidates}
    if len(expected) != len(candidates) or not set(omitted).issubset(DIMENSIONS):
        raise ValueError('Duplicate candidate or unknown omitted dimension')
    cases = local_cases(cases, expected)
    totals = []
    for c in candidates:
        case = cases.get(c['efua_id'])
        scores = {d['id']: d['score'] for d in case['dimensions']
                  if d['id'] not in omitted and d['score'] is not None} if case else {}
        result = total(scores, weights)
        if case and not omitted and result['center'] != case['expectedConditionalTotal']:
            raise ValueError('Case total disagrees with official weights')
        totals.append(result)
    ranks = positions(totals)
    return [{**c, **t, **r} for c, t, r in zip(candidates, totals, ranks)]


def build():
    folder = ROOT / 'docs/data'
    matrix_path = folder / 'cci-global-evidence-matrix.json'
    matrix = json.loads(matrix_path.read_text())
    inputs = {}

    def verified(name, expected):
        path = folder / name
        raw = path.read_bytes()
        digest = hashlib.sha256(raw).hexdigest()
        if digest != expected:
            raise ValueError(f'Stale input hash: {name}')
        inputs[name] = digest
        return raw

    outside = verify_unmatched_centres()
    scope = matrix['outsideFrameReview']
    verified('cci-unmatched-centre-review.json', scope['manifestSha256'])
    verified('cci-unmatched-centre-review.csv', scope['csvSha256'])
    if any(scope[k] != outside[k] for k in ('recordCount', 'reviewGroupCount',
                                           'groupsWithIndirectFuaLink', 'globalRankingEligible')):
        raise ValueError('Outside-frame competitor review disagrees with matrix')

    universe_path = folder / 'cci-global-candidates-r2019a.provenance.json'
    universe = json.loads(universe_path.read_text())
    raw = verified('cci-global-candidates-r2019a.csv', universe['csvSha256'])
    candidates = list(csv.DictReader(io.StringIO(raw.decode())))
    expected = {c['efua_id'] for c in candidates}
    if len(candidates) != universe['rowCount'] or len(expected) != len(candidates):
        raise ValueError('Candidate universe count mismatch')
    raw = verified('cci-global-evidence-matrix.csv', matrix['csvSha256'])
    matrix_rows = indexed(list(csv.DictReader(io.StringIO(raw.decode()))), expected)
    if matrix['candidateCount'] != len(candidates) or any(
            r['local2026_case_status'] not in ('unassessed', 'conditional_calibration_not_ranking')
            for r in matrix_rows.values()):
        raise ValueError('Invalid matrix count or case status')
    cases = []
    reference = matrix['inputs']['cci-legal-mobility-rules.json']
    verified('cci-legal-mobility-rules.json', reference['sha256'])
    review = ROOT / 'docs' / reference['provenance']
    if (review.parent != ROOT / 'docs' or review.name != 'cci-legal-mobility.md'
            or hashlib.sha256(review.read_bytes()).hexdigest() != reference['provenanceSha256']):
        raise ValueError('Stale legal mobility review')
    inputs[review.name] = reference['provenanceSha256']
    for name, reference in matrix['inputs'].items():
        if not name.startswith('cci-local-2026-'):
            continue
        case = json.loads(verified(name, reference['sha256']))
        review = ROOT / 'docs' / case['evidenceReview']
        if (review.parent != ROOT / 'docs' or review.name != reference['provenance']
                or hashlib.sha256(review.read_bytes()).hexdigest() != reference['provenanceSha256']):
            raise ValueError('Stale or invalid case review')
        row = matrix_rows[str(case['candidateId'])]
        if (row['local2026_case_review'] != review.name
                or row['local2026_case_status'] != 'conditional_calibration_not_ranking'):
            raise ValueError('Case and matrix disagree')
        inputs[review.name] = reference['provenanceSha256']
        cases.append(case)
    case_count = sum(r['local2026_case_status'] == 'conditional_calibration_not_ranking'
                     for r in matrix_rows.values())
    if case_count != len(cases) or len(cases) != matrix['local2026Screening']['conditionalCaseCount']:
        raise ValueError('Case inventory mismatch')
    release_path = ROOT / 'src/cci/data/releases/cci-2026.10.3.json'
    release = json.loads(release_path.read_text())
    weights = release['officialWeights']
    inputs[str(release_path.relative_to(ROOT))] = hashlib.sha256(release_path.read_bytes()).hexdigest()
    inputs[matrix_path.name] = hashlib.sha256(matrix_path.read_bytes()).hexdigest()
    inputs[universe_path.name] = hashlib.sha256(universe_path.read_bytes()).hexdigest()
    method_path = ROOT / 'docs/cci-local-2026-scoring-calibration.md'
    inputs[method_path.name] = hashlib.sha256(method_path.read_bytes()).hexdigest()
    base = evaluate(candidates, cases, weights)
    unconditional = evaluate(candidates, cases, weights, DIMENSIONS)
    by_id = {r['efua_id']: r for r in unconditional}
    rows = []
    for row in base:
        other = by_id[row['efua_id']]
        rows.append({
            'efua_id': row['efua_id'], 'source_name': row['source_name'],
            'country_iso': row['country_iso'],
            'conditional_center': '' if row['center'] is None else row['center'],
            'conditional_lower': row['lower'], 'conditional_upper': row['upper'],
            'conditional_best_position': row['bestPosition'],
            'conditional_worst_position': row['worstPosition'],
            'all_assumptions_rejected_center': '',
            'all_assumptions_rejected_lower': other['lower'],
            'all_assumptions_rejected_upper': other['upper'],
            'all_assumptions_rejected_best_position': other['bestPosition'],
            'all_assumptions_rejected_worst_position': other['worstPosition'],
            'membership_status': 'unresolved_not_ranking_eligibility',
        })
    stream = io.StringIO(newline='')
    writer = csv.DictWriter(stream, fieldnames=list(rows[0]), lineterminator='\n')
    writer.writeheader()
    writer.writerows(rows)
    raw_csv = stream.getvalue().encode()
    case_ids = {str(c['candidateId']) for c in cases}
    scenarios = {}
    for omitted in ((), *((d,) for d in DIMENSIONS), DIMENSIONS):
        result = evaluate(candidates, cases, weights, omitted)
        key = 'fixed_conditional_centers' if not omitted else 'omit_' + '_'.join(omitted)
        scenarios[key] = {
            'omittedDimensions': list(omitted),
            'nonexcludedCount': sum(r['bestPosition'] <= 32 for r in result),
            'caseResults': [{k: r[k] for k in ('efua_id', 'source_name', 'center', 'lower',
                                               'upper', 'bestPosition', 'worstPosition')}
                            for r in result if r['efua_id'] in case_ids],
        }
    summary = {
        'status': 'arithmetic_identifiability_audit_not_ranking',
        'targetYear': 2026, 'evidenceCutoff': '2026-10-10',
        'residentPerspective': 'local_citizen_ordinary_resident_median_income_usual_coverage',
        'candidateCount': len(candidates), 'conditionalCaseCount': len(cases),
        'completeConditionalCaseCount': sum(c['expectedConditionalTotal'] is not None for c in cases),
        'partialCaseCount': sum(c['expectedConditionalTotal'] is None for c in cases),
        'unassessedCount': len(candidates) - len(cases), 'weights': weights,
        'supportedExclusionCount': 0, 'qualified32ndPlaceThreshold': None,
        'outsideFrameReview': scope,
        'candidateMembershipCounts': dict(Counter(r['membership_status'] for r in rows)),
        'scenarios': scenarios, 'inputs': inputs,
        'scriptSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        'csvSha256': hashlib.sha256(raw_csv).hexdigest(),
        'limitations': 'Fixed conditional judgments, including partial cases without total centres, are arithmetic assumptions, not reliable city bounds. '
                      'Unknown dimensions retain the full model domain, with no centre or weight redistribution. '
                      'Positions account for every frozen candidate and allow any tie order, but are not probabilities '
                      'or verified global ranks. All case scores require necessary assumptions; rejecting them all '
                      'leaves every candidate unresolved. New unmatched global centres remain outside this old-boundary '
                      'count and are not excluded. No supported exclusion, current 32nd-place threshold or ranking eligibility.',
    }
    return raw_csv, summary


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    raw, summary = build()
    folder = ROOT / 'docs/data'
    csv_path = folder / 'cci-local-2026-rank-audit.csv'
    json_path = folder / 'cci-local-2026-rank-audit.json'
    if args.check:
        if csv_path.read_bytes() != raw or json.loads(json_path.read_text()) != summary:
            raise ValueError('Rank identifiability audit is stale; regenerate it')
    else:
        csv_path.write_bytes(raw)
        json_path.write_text(json.dumps(summary, indent=2) + '\n')
    print({k: summary[k] for k in ('status', 'candidateCount', 'conditionalCaseCount',
                                  'supportedExclusionCount', 'qualified32ndPlaceThreshold')})


if __name__ == '__main__':
    main()
