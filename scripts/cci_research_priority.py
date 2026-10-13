"""Reproduce exploratory work priorities without CCI scores or exclusions."""

import argparse,csv,hashlib,json,math,pathlib,statistics,collections,shutil,sqlite3
def mean(v):return sum(v)/len(v) if v and all(x is not None for x in v) else None
def access(t,w,mt=10,wt=60):return mean([math.exp(-t/mt) if t is not None else None,math.exp(-w/wt) if w is not None else None])
def speed(f,m):return mean([min(1,math.log1p(f/1000)/math.log1p(300)) if f is not None else None,min(1,math.log1p(m/1000)/math.log1p(150)) if m is not None else None])
def weighted_value(vals,weights):return sum(v*w for v,w in zip(vals,weights) if w) if all(v is not None for v,w in zip(vals,weights) if w) else None
def local_ready(r):return all(r[k] is not None for k in ['M','N','E'])
def strict_dominates(z,r):return all(z[k]>=r[k] for k in ['M','N','E']) and any(z[k]>r[k] for k in ['M','N','E'])
def complete_stress_max(ranks):return max(ranks) if len(ranks)==10 and all(x is not None for x in ranks) else None
def self_check():
 assert mean([1,None]) is None and mean([1,0])==.5
 assert access(None,0) is None and access(0,0)==1
 assert weighted_value([1,1,1,None],[.4,.3,.3,0])==1
 assert weighted_value([1,1,1,None],[.35,.25,.25,.15]) is None
 assert speed(300000,150000)==speed(3000000,1500000)==1 and speed(None,150000) is None
 a={'M':.7,'N':.8,'E':.9,'B':None};b=dict(a)
 assert [r for r in [a] if local_ready(r)]==[a] and not all(a[k] is not None for k in ['M','N','E','B'])
 assert not strict_dominates(a,b) and not strict_dominates(b,a)
 c=dict(a,M=.8);assert strict_dominates(c,a) and not strict_dominates(a,c)
 assert complete_stress_max([1]*10)==1 and complete_stress_max([1]*9+[None]) is None and complete_stress_max([1]*9) is None
 print('SELF-CHECK PASS: missing versus zero; zero-weight background; speed saturation; strict Pareto ties; local frontier without B; all-ten stress eligibility')
P=argparse.ArgumentParser(description="Exploratory CCI research priorities; never city scores or exclusions")
P.add_argument("--data-dir",type=pathlib.Path,default=pathlib.Path("docs/data"))
P.add_argument("--climate",type=pathlib.Path)
P.add_argument("--output-dir",type=pathlib.Path)
P.add_argument("--self-check",action="store_true")
args=P.parse_args()
if args.self_check:self_check();raise SystemExit(0)
if args.climate is None or args.output_dir is None:P.error('--climate and --output-dir are required unless --self-check')
D=args.data_dir;R=args.output_dir;R.mkdir(parents=True,exist_ok=True);I=R/"inputs";I.mkdir(exist_ok=True)
names=["cci-global-candidates-r2019a.csv","cci-global-evidence-matrix.csv","cci-global-evidence-matrix.json","cci-healthcare-efua-population.csv","cci-seismic-efua-population.csv","cci-ookla-efua-sampled-measurements.csv","cci-ucdb-efua-overlaps.csv","cci-ucdb-efua-crosswalk.json","cci-wgi-efua-context.csv","cci-wgi-2025-country-aggregates.csv","cci-wgi-context.json","cci-ucdb-r2024a-v1-2.inventory.json","cci-unmatched-centre-review.csv","cci-unmatched-centre-review.json"]
manifest=[]
for name in names+["climate-attributes.csv"]:
 source=args.climate if name=="climate-attributes.csv" else D/name
 target=I/name
 if name=="climate-attributes.csv" and source.suffix==".gpkg":
  inventory=json.loads((I/"cci-ucdb-r2024a-v1-2.inventory.json").read_text())
  with source.open("rb") as original:assert hashlib.file_digest(original,"sha256").hexdigest()==inventory["geoPackageSha256"]
  table=next(t for t in inventory["tables"] if "THEME_CLIMATE" in t["table"])
  with sqlite3.connect(source.resolve().as_uri()+"?mode=ro",uri=True) as db,target.open("w") as out:
   writer=csv.writer(out);writer.writerow(table["columns"])
   query='SELECT '+','.join('"'+x+'"' for x in table["columns"])+' FROM "'+table["table"]+'" ORDER BY ID_UC_G0'
   writer.writerows(db.execute(query))
 elif source.resolve()!=target.resolve():shutil.copyfile(source,target)
 b=target.read_bytes();manifest.append(dict(file=name,source_kind="parameter_climate" if name=="climate-attributes.csv" else "repository_data",bytes=len(b),sha256=hashlib.sha256(b).hexdigest()))
hs={x["file"]:x["sha256"] for x in manifest}
read=lambda n:list(csv.DictReader((I/n).open()))
def idx(n):
 a=read(n);z={r["efua_id"]:r for r in a};assert len(a)==len(z)==9031,n;return z
ca=idx("cci-global-candidates-r2019a.csv");ma=idx("cci-global-evidence-matrix.csv");he=idx("cci-healthcare-efua-population.csv");se=idx("cci-seismic-efua-population.csv");assert set(ca)==set(ma)==set(he)==set(se)
matrix=json.loads((I/"cci-global-evidence-matrix.json").read_text());assert matrix["csvSha256"]==hs["cci-global-evidence-matrix.csv"]
for n in ["cci-global-candidates-r2019a.csv","cci-healthcare-efua-population.csv","cci-seismic-efua-population.csv","cci-ookla-efua-sampled-measurements.csv","cci-wgi-efua-context.csv"]:assert matrix["inputs"][n]["sha256"]==hs[n],n
inv=json.loads((I/"cci-ucdb-r2024a-v1-2.inventory.json").read_text());ct=next(t for t in inv["tables"] if "THEME_CLIMATE" in t["table"]);assert hs["climate-attributes.csv"]==ct["csvSha256"]
cross=json.loads((I/"cci-ucdb-efua-crosswalk.json").read_text());assert cross["files"]["cci-ucdb-efua-overlaps.csv"]==hs["cci-ucdb-efua-overlaps.csv"]
cl_rows=read("climate-attributes.csv");cl={r["ID_UC_G0"]:r for r in cl_rows};assert len(cl_rows)==len(cl)==11422
edges=read("cci-ucdb-efua-overlaps.csv");assert len(edges)==9743;hits=collections.defaultdict(list)
for e in edges:assert e["efua_id"] in ca and e["ucdb_id"] in cl and float(e["overlap_km2"])>0;hits[e["efua_id"]].append(e)
wg=idx("cci-wgi-efua-context.csv");bgr=read("cci-wgi-2025-country-aggregates.csv");bg={r["source_id"]:r for r in bgr};assert len(bg)==len(bgr)==1279 and all(r["year"]=="2025" for r in bgr)
context=json.loads((I/"cci-wgi-context.json").read_text())
for name in ["cci-wgi-2025-country-aggregates.csv","cci-wgi-efua-context.csv"]:assert context["outputs"][name]==hs[name]
netrows=read("cci-ookla-efua-sampled-measurements.csv");net={(r["efua_id"],r["connection_type"]):r for r in netrows};assert len(net)==len(netrows)
rows=[]
for i in sorted(ca,key=int):
 a,b,m=he[i],se[i],ma[i];f=net.get((i,"fixed"),{});mob=net.get((i,"mobile"),{})
 rows.append(dict(efua_id=i,source_name=ca[i]["source_name"],country_iso=ca[i]["country_iso"],assessed=str(m["local2026_case_status"]!="unassessed"),retention="retained_no_exclusion",motor_minutes=a["motorized_mean_minutes_among_observed"],walking_minutes=a["walking_mean_minutes_among_observed"],pga_g=b["mean_pga_g_among_observed"],fixed_kbps=f.get("centroid_avg_d_kbps_test_weighted_mean",""),mobile_kbps=mob.get("centroid_avg_d_kbps_test_weighted_mean",""),motor_within60_lower=a["motorized_within_60_share_lower"],motor_within60_upper=a["motorized_within_60_share_upper"],motor_missing_population=a["motorized_missing_population"],seismic_observed_share=b["pga_observed_population_share"],fixed_valid_tests=f.get("centroid_avg_d_kbps_valid_tests",""),mobile_valid_tests=mob.get("centroid_avg_d_kbps_valid_tests",""),ucdb_intersecting_centres=m["ucdb_intersecting_centres"],wup_intersecting_centres=m["wup_2025_intersecting_centres"],ucdp_assigned_events_2021_2025=m["ucdp_assigned_events_2021_2025"],ucdp_2026_clear_precise_events=m["ucdp_2026_clear_precise_events"],ucdp_2026_pending_precise_events=m["ucdp_2026_pending_precise_events"],cci_score=None))
def num(x):
 if x is None or x=='':return None
 v=float(x);assert math.isfinite(v);return v
for r in rows:
 i=r['efua_id'];r['assessed']=r['assessed']=='True';r['cci_score']=None
 for k in ['motor_minutes','walking_minutes','pga_g','fixed_kbps','mobile_kbps']:r[k]=num(r[k])
 assert all(r[k] is None or r[k]>=0 for k in ['motor_minutes','walking_minutes','pga_g'])
 assert all(r[k] is None or r[k]>0 for k in ['fixed_kbps','mobile_kbps'])
 h=[num(cl[e['ucdb_id']]['CL_UTC_T32_2020']) for e in hits[i]]
 assert all(v is None or 0<=v<=366 for v in h)
 r['heat_uc_max_days']=max(h) if h and all(x is not None for x in h) else None
 biggest=max(hits[i],key=lambda e:float(e['overlap_km2'])) if hits[i] else None
 r['heat_largest_overlap_uc_days']=num(cl[biggest['ucdb_id']]['CL_UTC_T32_2020']) if biggest else None
 r['heat_uc_ids']=';'.join(e['ucdb_id'] for e in hits[i]);r['M']=access(r['motor_minutes'],r['walking_minutes']);r['Q']=math.exp(-r['pga_g']/.1) if r['pga_g'] is not None else None;r['H']=math.exp(-r['heat_uc_max_days']/30) if r['heat_uc_max_days'] is not None else None;r['E']=mean([r['Q'],r['H']]);r['N']=speed(r['fixed_kbps'],r['mobile_kbps'])
 refs=[wg[i]['ge_country_context_ref'],wg[i]['rl_country_context_ref']];r['background_economy']=wg[i]['lookup_economy_code'];r['B']=mean([num(bg[x]['score'])/100 if x in bg else None for x in refs]);r['B_low']=mean([max(0,num(bg[x]['score_lower90'])/100) if x in bg else None for x in refs]);r['B_high']=mean([min(1,num(bg[x]['score_upper90'])/100) if x in bg else None for x in refs])
 nf=net.get((i,'fixed'),{});nm=net.get((i,'mobile'),{});r['N_interior']=speed(num(nf.get('interior_avg_d_kbps_test_weighted_mean')),num(nm.get('interior_avg_d_kbps_test_weighted_mean')))
 r['missing_families']=';'.join(k for k in ['M','N','E','B'] if r[k] is None);r['full_diagnostic']=r['missing_families']==''
S={'balanced':{'w':(.35,.25,.25,.15)},'medical':{'w':(.5,.2,.15,.15)},'exposure':{'w':(.2,.2,.45,.15)},'context35':{'w':(.25,.2,.2,.35)},'no_context':{'w':(.4,.3,.3,0)},'no_heat':{'w':(.35,.25,.25,.15),'E':'Q'},'interior_network':{'w':(.35,.25,.25,.15),'N':'N_interior'},'background_low90':{'w':(.35,.25,.25,.15),'B':'B_low'},'heat_largest_uc':{'w':(.35,.25,.25,.15),'largest_heat':True},'travel_scales_doubled':{'w':(.35,.25,.25,.15),'travel_double':True}}
eligible_counts={}
for name,s in S.items():
 eligible=[]
 for r in rows:
  vals=[r['M'],r.get(s.get('N','N')),r.get(s.get('E','E')),r.get(s.get('B','B'))]
  if s.get('largest_heat'):vals[2]=mean([r['Q'],math.exp(-r['heat_largest_overlap_uc_days']/30) if r['heat_largest_overlap_uc_days'] is not None else None])
  if s.get('travel_double'):vals[0]=access(r['motor_minutes'],r['walking_minutes'],20,120)
  value=weighted_value(vals,s['w'])
  r['priority_'+name]=value;r['rank_'+name]=None
  if not r['assessed'] and value is not None:eligible.append(r)
 eligible.sort(key=lambda r:(-r['priority_'+name],int(r['efua_id'])))
 for rank,r in enumerate(eligible,1):r['rank_'+name]=rank
 eligible_counts[name]=len(eligible)
core=['balanced','medical','exposure','context35','no_context'];u=[r for r in rows if not r['assessed']];full=[r for r in u if r['full_diagnostic']]
for r in full:r['core_median_rank']=statistics.median(r['rank_'+s] for s in core);r['core_worst_rank']=max(r['rank_'+s] for s in core)
short=sorted([r for r in full if r['core_worst_rank']<=20],key=lambda r:(r['core_median_rank'],r['core_worst_rank'],int(r['efua_id'])))
# Local three-family Pareto is diagnostic only; national background is not a local axis.
local_complete=[r for r in u if local_ready(r)]
front=[]
for r in sorted(local_complete,key=lambda r:(-r['M'],-r['N'],-r['E'],int(r['efua_id']))):
 if not any(strict_dominates(z,r) for z in front):front.append(r)
for r in short:
 r['stress_complete']=all(r['rank_'+s] is not None for s in S)
 r['stress_missing_scenarios']=';'.join(s for s in S if r['rank_'+s] is None)
 r['stress_worst_rank']=complete_stress_max([r['rank_'+s] for s in S])
 r['stress_worst_relative_position']=complete_stress_max([r['rank_'+s]/eligible_counts[s] if r['rank_'+s] is not None else None for s in S])
short.sort(key=lambda r:(not r['stress_complete'],r['stress_worst_rank'] if r['stress_complete'] else math.inf,r['core_median_rank'],int(r['efua_id'])))
stress_complete=[r for r in short if r['stress_complete']]
stress_unchecked=[r for r in short if not r['stress_complete']]
front_ids={r['efua_id'] for r in front}
for r in rows:r['local_pareto_front']=r['efua_id'] in front_ids
# Unknowns have a separate known-profile diagnostic, never ranked by the missing-field upper bound.
unknown=[r for r in u if not r['full_diagnostic']]
for r in unknown:
 local=[(k,r[k]) for k in ['M','N','E'] if r[k] is not None]
 r['unknown_known_family_count']=len(local);r['unknown_observed_profile_mean']=mean([v for k,v in local]) if len(local)>=2 else None;r['unknown_observed_profile_min']=min(v for k,v in local) if len(local)>=2 else None
unknown_priority=sorted([r for r in unknown if r['unknown_observed_profile_mean'] is not None],key=lambda r:(-r['unknown_observed_profile_min'],-r['unknown_observed_profile_mean'],int(r['efua_id'])))
def write(name,data,keys=None):
 keys=keys if keys is not None else list(dict.fromkeys(k for r in data for k in r))
 with (R/name).open('w') as f:w=csv.DictWriter(f,fieldnames=keys);w.writeheader();w.writerows(data)
write('priority-stress-unchecked-v2.csv',stress_unchecked,keys=list(short[0]) if short else ['efua_id','stress_complete','stress_missing_scenarios']);
write('priority-all9031-v2.csv',rows);write('priority-shortlist-v2.csv',short);write('priority-unknown-v2.csv',unknown)
outside=read('cci-unmatched-centre-review.csv');outside_meta=json.loads((I/'cci-unmatched-centre-review.json').read_text());assert hs['cci-unmatched-centre-review.csv']==outside_meta['csvSha256']
assert len(outside)==len({(r['source'],r['source_id']) for r in outside})==4141
for r in outside:
 assert r['cci_center']=='' and r['retention_status']=='retained_unresolved_competitor'
 r['heat_urban_centre_days2020']=num(cl[r['source_id']]['CL_UTC_T32_2020']) if r['source']=='ucdb' and r['source_id'] in cl else None
 r['source_name_if_available']=cl[r['source_id']]['GC_UCN_MAI_2025'] if r['source']=='ucdb' and r['source_id'] in cl else ''
write('priority-outside-centres-v2.csv',outside)
base=[r for r in u if all(r[k] is not None for k in ['motor_minutes','walking_minutes','pga_g','fixed_kbps','mobile_kbps'])];withheat=[r for r in base if r['heat_uc_max_days'] is not None]
summary=dict(status='exploratory_priority_not_CCI_or_prediction',candidate_count=9031,assessed_snapshot=len(rows)-len(u),unassessed=len(u),unassessed_full_diagnostic=len(full),unassessed_partial=len(unknown),all_full_diagnostic=sum(r['full_diagnostic'] for r in rows),missing_base_five=len(u)-len(base),additional_no_heat=len(base)-len(withheat),additional_no_background_after_heat=len(withheat)-len(full),unknown_families=dict(collections.Counter(r['missing_families'] for r in unknown)),scenario_eligible_unassessed=eligible_counts,scenario_weights=S,shortlist=short,local_pareto_diagnostic_count=len(local_complete),local_pareto_count=len(front),unknown_observed_priority_first12=unknown_priority[:12],unknown_below_two_local_families=sum(r['unknown_known_family_count']<2 for r in unknown),recommended_next=dict(efua_id=stress_complete[0]['efua_id'] if stress_complete else None,source_name=stress_complete[0]['source_name'] if stress_complete else None,basis='Core five-scenario top20 intersection, then smallest worst ordinal among rows complete in all ten predeclared sensitivity scenarios; incomplete rows retained separately without a penalty or stress tie-break; final ties by core median then original ID. Exploratory choice, never a unique performance winner'),alternatives=[r for r in sorted(full,key=lambda r:(r['core_median_rank'],r['core_worst_rank']))[:15]],cci_scores_created=False)
(R/'priority-input-manifest-v2.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
summary['stress_complete_shortlist_count']=len(stress_complete);summary['stress_unchecked_shortlist_count']=len(stress_unchecked);summary['stress_unchecked_shortlist']=stress_unchecked
summary['outside_record_count']=len(outside);summary['outside_groups']=len({r['review_group'] for r in outside});summary['outside_indirect_groups']=len({r['review_group'] for r in outside if r['group_has_indirect_fua_link']=='true'});summary['climate_source']={'version':inv['version'],'source_url':inv['sourceUrl'],'raw_gpkg_sha256':inv['geoPackageSha256'],'attribute_csv_sha256':ct['csvSha256']};(R/'priority-summary-v2.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2))
summary['relative_position_order_sensitivity']=[dict(efua_id=r['efua_id'],source_name=r['source_name'],worst_relative_position=r['stress_worst_relative_position']) for r in sorted(stress_complete,key=lambda r:(r['stress_worst_relative_position'],r['core_median_rank'],int(r['efua_id'])))];(R/'priority-summary-v2.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2))
out=[]
for name in ['priority-all9031-v2.csv','priority-shortlist-v2.csv','priority-unknown-v2.csv','priority-outside-centres-v2.csv','priority-stress-unchecked-v2.csv','priority-summary-v2.json']:
 b=(R/name).read_bytes();out.append(dict(file=name,bytes=len(b),sha256=hashlib.sha256(b).hexdigest()))
b=pathlib.Path(__file__).read_bytes();out.append(dict(file=pathlib.Path(__file__).name,bytes=len(b),sha256=hashlib.sha256(b).hexdigest()));(R/'priority-output-manifest-v2.json').write_text(json.dumps(out,indent=2))
print('counts', {k:v for k,v in summary.items() if k in ['candidate_count','assessed_snapshot','unassessed','unassessed_full_diagnostic','unassessed_partial','all_full_diagnostic','missing_base_five','additional_no_heat','additional_no_background_after_heat','local_pareto_diagnostic_count','local_pareto_count','unknown_below_two_local_families']});print('scenario eligible',eligible_counts)
for r in short:print('SHORT',r['efua_id'],r['source_name'],[r['rank_'+s] for s in S],r['local_pareto_front'])
for r in unknown_priority[:8]:print('UNKNOWN',r['efua_id'],r['source_name'],r['missing_families'],r['unknown_observed_profile_min'],r['unknown_observed_profile_mean'])
