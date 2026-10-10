# Personal Site

This context covers the public personal site and the publication artifacts derived from
its professional profile content.

## Language

**So Far Page**:
The public professional profile page that presents Morris Liu's work history, projects,
education, skills, and contact paths.
_Avoid_: About page, Resume page

**Resume PDF**:
A downloadable, traditional resume artifact derived from the So Far Page content for a
single language.
_Avoid_: Printable page, browser PDF

**Resume Content Source**:
The language-specific structured professional profile content from which both the So Far
Page and Resume PDF select material.
_Avoid_: Typst source, web page copy

**Resume Typst Runtime Artifact**:
A versioned static asset required by the browser-side Typst compiler, such as the WASM
module, JavaScript bridge, or controlled font file.
_Avoid_: PDF asset, Worker code

**Artifact CDN Base URL**:
The public, versioned URL prefix from which the Resume PDF route loads Resume Typst Runtime
Artifacts in production.
_Avoid_: R2 bucket name, local static path

**Collected Edition**:
An optional, book-like reading surface for selected site content rendered with Typst. It
complements the default HTML site instead of replacing or mirroring every route.
_Avoid_: Typst mirror, replacement site, PDF-only site

**Collected Content**:
The content set eligible for the Collected Edition, initially Thoughts entries, Now pages, and
Moments entries.
_Avoid_: Whole site, all pages, resume-only content

**Collected Projection**:
The build-time JSON publication model generated from Collected Content for Typst templates
to consume. It normalizes prose, metadata, notes, code blocks, and photo entries without
becoming a second content source.
_Avoid_: Typst content source, copied Markdown, runtime conversion

**Photography Collection**:
The Collected Edition treatment of Moments entries as a curated photo-book section rather
than as ordinary article prose.
_Avoid_: Image appendix, gallery dump

## Century City Index

**Century City Index (CCI)**:
A public, versioned scenario index for comparing the long-term survival, health, technology,
and exit optionality of urban regions.
_Avoid_: Liveability ranking, exact future forecast

**Functional Urban Area**:
The standardized geographic unit represented by a named city and its economically connected
commuting area under one published boundary version.
_Avoid_: Administrative city, custom city boundary, city corridor

**CCI Release**:
An immutable forecast snapshot containing the evidence and assumptions available at one
`as_of` date.
_Avoid_: Latest score, mutable forecast

**Target Year**:
The future year whose urban conditions a CCI Release assesses.
_Avoid_: Release year, data year

**CCI Scenario**:
A named combination of climate, geopolitical, and medical futures under which CCI scores are
calculated.
_Avoid_: Prediction probability, expected future

**Official CCI**:
The comparable CCI result produced with the fixed weights and governance rules of a published
model version.
_Avoid_: Personalized score, definitive rank

**My CCI**:
A reader-specific view produced by adjusting dimension weights without changing Official CCI
history or claims.
_Avoid_: Official ranking, user forecast

**CCI-Point**:
The assessed condition of a Functional Urban Area at one Target Year.
_Avoid_: Lifetime score, current score

**CCI-Lifetime**:
The cumulative assessed experience and risk from a CCI Release through one Target Year.
_Avoid_: Point forecast, life expectancy

**Evidence Level**:
The provenance role of a CCI input: city observation, national prior, or scenario assumption.
_Avoid_: Confidence score, source quality

**Research City Sample**:
The deliberately diverse set of thirty-two urban regions, retaining the original sixteen
pilot areas and adding sixteen documented comparison cases. Selection covers different
regions and urban conditions; it is not a probability sample or a global qualification ranking.
_Avoid_: Global top thirty-two, statistically representative world sample

**CCI Dimension**:
One of the eight fixed categories that together define the Official CCI value model.
_Avoid_: Data source, scenario, personal preference

**CCI Subpillar**:
A mutually exclusive concept within one CCI Dimension that owns a defined group of indicators.
_Avoid_: Raw indicator, duplicate dimension

**CCI Indicator**:
A traceable observation or estimate that measures one CCI Subpillar and has exactly one owner.
_Avoid_: Source report, reused metric

**Research Preview**:
A public CCI surface that may show evidence and provisional ranges before every urban area is
eligible for an official rank.
_Avoid_: Complete release, placeholder ranking

**Not Ranked**:
The explicit state of an urban area that fails a published evidence or governance gate.
_Avoid_: Zero score, missing city, low rank

**Ranking Eligibility**:
The published evidence, confidence, and governance conditions a CCI result must satisfy before
receiving an official rank.
_Avoid_: Score threshold, editorial approval

**CCI Confidence Profile**:
The separate grades for geographic fit, source independence, freshness, provenance, and horizon
support attached to a CCI result.
_Avoid_: Confidence percentage, score quality bonus

**Source-sensitive**:
A CCI result whose score, rank, tail status, or eligibility changes materially when a qualified
alternative source replaces the canonical source.
_Avoid_: Incorrect result, controversial city

**Weight-sensitive**:
A CCI result whose rank is unstable across the published range of plausible dimension weights.
_Avoid_: Source-sensitive, low confidence

**CCI Candidate**:
A recalculated but unpublished result awaiting evidence review before it may become a CCI Release.
_Avoid_: Draft score, live release

**Normalization Anchor**:
A fixed bad, reference, or good value that maps a raw CCI Indicator onto the shared 0–100 scale.
_Avoid_: Current sample minimum, current sample maximum

**Scenario Delta**:
A bounded, versioned change applied to a CCI Subpillar under one CCI Scenario when no direct
authoritative projection exists.
_Avoid_: Event probability, unlimited trend

**Observed Sensitivity**:
A city-specific exposure or capacity measure owned by one CCI Subpillar that controls how much
of a Scenario Delta applies.
_Avoid_: Editorial adjustment, cross-dimension bonus

**Tail Status**:
The pass, watch, or fail result of a named low-probability, high-impact stress test kept separate
from the compensatory CCI score.
_Avoid_: Score penalty, confidence grade
