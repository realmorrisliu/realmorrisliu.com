# CCI 2026.10 local evidence audit: seven additional cities

Audit date: **2026-10-09** (Asia/Shanghai). Scope: Boston, San Francisco Bay Area,
Toronto, Melbourne, Dubai, São Paulo and Cape Town, across all eight CCI dimensions.
The machine-readable companion is `src/cci/data/audits-2026-10-other.json`.

## What this audit establishes

Each of the 56 city/dimension cells has a completed **source-discovery and applicability
review**, not a pending label. Eight outcomes are `usable_observation`, 47 are
`context_only`, and Dubai GSS is `insufficient_evidence` after an inaccessible official
statistics endpoint. Here `usable_observation` means a verified original local, facility
or service-area observation was found: **local observation found; scoring adaptation
requirements are not yet met**. It does not certify eFUA scoring or ranking eligibility.
Original observations still lack one or more frozen indicator specifications, geographic
crosswalks, uncertainty checks or complete subpillar coverage. Policies, goals, publication
announcements, institutional existence and undated inventories remain context only.

Sources were inspected through primary-producer search extracts, and selected pages were
opened directly for content and access checks. **A report landing page is only evidence of
availability; it is not a claim that its linked report or every table was read.** Summaries
state when counts were not extracted. Search-engine crawl/publish timestamps were not used
as observation dates. Web excerpts can be stale; the observation period shown in each cell
is retained rather than relabelled 2026. No paywall, robots restriction or authentication
was bypassed. No external messages were sent.

English searches covered English-speaking local producers. São Paulo searches and source
interpretation used Portuguese. Dubai included Arabic municipal and health material plus
English agency searches. Arabic/Portuguese interpretation was model-assisted, **not
independent human translation**; no translated field was admitted to scoring. Cape Town
water reports were found in English, Afrikaans and isiXhosa, but only English source text
was inspected. French, Afrikaans and isiXhosa searches were not completed. This is a
language-coverage limitation, not evidence of absent local data.

## Boundary semantics

`candidate.boundary.verificationStatus` records the product's existing name/country-to-ID
match. `audit.boundaryReview` in this supplement instead asks whether the **local observation
geography has been reconciled to the frozen 2015 eFUA polygon**. All seven crosswalks remain
unresolved; this does not undo existing name-ID matches. The [GHSL producer documentation](https://human-settlement.emergency.copernicus.eu/ghs_fua.php)
explains that R2019A eFUAs are modelled commuting areas for 2015. City councils, provinces,
police stations and utilities cannot silently substitute for those areas.

For San Francisco specifically, the candidate associates eFUA 1255 with source name
**San Jose** and urban-centre IDs 10 and 13. This audit supplies no geometry-overlay proof
for the public **San Francisco Bay Area** alias. SF city-only sources, SF–San Mateo labour
statistics, Stanford, SFPUC and BART also cover different areas. None certifies that alias.
A separate source-ID geometry check, if performed, does not resolve these observation
crosswalks automatically.

## Access and extraction exceptions

- Dubai Police's official major-crime statistics endpoint timed out. Search hits from
  Reddit were discarded; no crime rate or zero-event claim was borrowed from them.
- MBTA's policy page was blocked by robots. The retained OPT source is the performance
  office's own OPMI methodology article, not a third-party mirror of MBTA.
- São Paulo SSP's monthly statistics endpoint rendered no table text. The SSP methodology
  page was usable; no monthly number was extracted.
- Melbourne Water's 2024/25 PDF yielded a detailed producer-indexed extract (page 17), but a
  later direct open failed. Percentages and rainfall below are extract-level context only;
  no full-report or original-PDF visual validation is claimed. The extract also contains an
  apparent unit/decimal inconsistency for absolute stored litres, so that value is omitted.
- PTV's indexed June 2025 performance table subsequently redirected to a newer Victorian
  government page. The archived-looking June figures are explicitly June 2025 context;
  this review did not establish a stable immutable copy or current 2026 comparison.
- Annual report portals (TTC, RTA, RMH, Toronto Water, Cape Town, São Paulo Health) are kept
  as discovery/applicability records where individual linked tables were not extracted.

## Findings worth retaining

These values are **original local context, not normalized CCI inputs**. No city receives a
bonus or penalty from these facts alone.

- [Boston's 2025 MWRA/BWSC report](https://www.mwra.com/your-water-system/drinking-water-quality/annual-water-quality-test-results-main/2025full)
  reports a Boston high-risk-home lead 90th percentile of **22.5 ppb** against its stated
  **15 ppb** action level, with **4 of 33** samples above it (September/October 2025).
  Upstream treated-water compliance and targeted premise-plumbing results have different
  universes; both can hold. Targeted high-risk homes are not a representative household sample.
- [Melbourne Water 2024/25 report, indexed page 17](https://www.melbournewater.com.au/media/eyJtZWRpYSI6IjI5ODY2In0%3D/downloads)
  reports storage declining from **86.5%** to **71.5%** over the financial year; catchment
  rainfall **839 mm**, **19.9%** below the 30-year average. Storage is not itself household
  reliability, and the later PDF-open failure limits reproducibility of this extraction.
- [DEWA 2025 operating results](https://www.dewa.gov.ae/en/about-us/media-publications/latest-news/2026/2/dubai-electricity-and-water-authority-pjsc)
  give **62.21 TWh** electricity generation and **161.505 billion imperial gallons** of
  desalinated-water demand. Scale and growing demand do not establish interruption resilience.
- [Toronto Police's 2024 report](https://www.tps.ca/media/filer_public/da/56/da567ea3-47fe-43dc-b268-ef8201a9d297/b8f15a2f-7544-40cb-b2b9-32eba49deb3c.pdf)
  explicitly warns its annual crime counts and public dashboard are not comparable because
  extraction methods differ. No splicing was performed.
- [São Paulo Metrô's reporting scope](https://www.metro.sp.gov.br/pt_BR/metro/sustentabilidade/relatorio-integrado/)
  excludes privately operated metro lines and third parties. Its report cannot serve as a
  complete metropolitan redundancy assessment.

## Local search and disposition ledger

All queries below were run on 2026-10-09. Sources list original producer titles as supplied
by the retrieved pages (some titles shortened for readability), URLs and observation
periods. The result text is the final applicability decision, not a pending task.

### boston

- **PCS — `context_only`**. Query: `site.boston.gov climate ready Boston 2024 heat flooding resilience`.
  Source: [Heat Resilience Solutions for Boston](https://www.boston.gov/departments/climate-resilience/heat-resilience-solutions-boston); period: 2022 plan; historical baseline and 2070s projection.
  The plan projects up to 46 days above 90°F annually in the 2070s versus a historical 10. This is a municipal scenario, not a current eFUA heat observation; humidity, flooding and geophysical inputs are incomplete.
- **GSS — `context_only`**. Query: `site.boston.gov police 2025 crime statistics emergency management`.
  Source: [Crime Statistics: January 1, 2025 – December 21, 2025 vs. 2024](https://police.boston.gov/2025/12/22/crime-statistics-january-1-2025-december-21-2025-vs-2024/); period: 2025-01-01 to 2025-12-21.
  Police publish Part 1 crime and shooting reports for this window. The landing page establishes availability, not extracted counts. Recorded city crime does not measure regional conflict or strategic exposure.
- **ISR — `context_only`**. Query: `site.boston.gov 2025 crime data emergency management`.
  Source: [Climate Resilience](https://www.boston.gov/departments/climate-resilience); period: 2024 institutional change; current programme page.
  The city documents a dedicated climate resilience office created in August 2024 and completed coastal plans for its 47-mile coastline. Institutional arrangements and plans do not establish delivery, social cohesion or recovery outcomes.
- **RES — `usable_observation`**. Query: `site.mwra.com 2025 annual water quality report Boston`.
  Source: [2025 Annual Water Quality Test Results - Full Service](https://www.mwra.com/your-water-system/drinking-water-quality/annual-water-quality-test-results-main/2025full); period: September–October 2025; published June 2026.
  Boston sampled 33 higher-risk homes: lead 90th percentile 22.5 ppb, above the stated 15 ppb action level; 4 samples exceeded it. Targeted premise plumbing results must not be generalized to all homes or contradicted by upstream compliance claims. Food and energy resilience remain unmeasured.
- **MED — `context_only`**. Query: `site.boston.gov health Boston 2025 health equity report`.
  Source: [Boston Community Health Collaborative](https://www.boston.gov/government/cabinets/boston-public-health-commission/racial-justice-and-health-equity/bostonchna); period: 2025 CHNA; 2025–2028 improvement plan.
  The 2025 assessment and improvement plan explicitly retain access to care, housing, food and economic opportunity as priorities. This supports an access-gap review, not a complete normalized metro healthcare score; facility and population denominators were not extracted.
- **LON — `context_only`**. Query: `site.massgeneral.org aging clinical trial older adults research`.
  Source: [Memory Disorders Division](https://www.massgeneral.org/neurology/treatments-and-services/memory-disorders-division); period: 2024 approval reference; current programme page.
  Mass General documents Alzheimer treatment pathways and research recruitment. A provider programme is not a deduplicated geroscience trial inventory, a lifespan benefit, or evidence that all residents can afford treatment.
- **TEC — `context_only`**. Query: `site.boston.gov economy life sciences 2025`.
  Source: [Healthcare and Life Sciences](https://content.boston.gov/government/cabinets/economic-opportunity-and-inclusion/healthcare-and-life-sciences); period: Undated industry snapshot.
  The city publishes a life-sciences industry snapshot. Its undated employment and institution totals were not adopted as 2026 observations; a reproducible industry classification, geographic scope and digital diffusion data are absent.
- **OPT — `context_only`**. Query: `site.mbta.com 2025 annual report service reliability`.
  Source: [The MBTA’s 2024 Service Delivery Policy: Changing how Success is Measured](https://www.opmidatablog.com/latest-posts/the-mbtas-2024-service-delivery-policy-changing-how-success-is-measured); period: 2025-01-24; policy adopted 2024-12-19.
  The MBTA performance office explains changed reliability measures and a Fall 2023 comparison. This is direct methodology evidence; the MBTA policy page itself was robots-blocked. No comparable current network redundancy or legal mobility measure was extracted.

### toronto

- **PCS — `context_only`**. Query: `site.toronto.ca climate risk assessment 2025`.
  Source: [Becoming a Climate-Ready Toronto](https://www.toronto.ca/services-payments/water-environment/environmentally-friendly-city-initiatives/becoming-a-climate-ready-toronto/); period: 2024 climate report; 2025 risk assessment.
  Toronto identifies a warmer, wetter and less predictable climate and publishes a 2025 risk assessment. City scenarios and qualitative hazards require population-weighted eFUA extraction before use; no tail threshold is certified.
- **GSS — `context_only`**. Query: `site.tps.ca 2025 annual report crime`.
  Source: [2024 Toronto Police Service Chief’s Annual Report](https://www.tps.ca/media/filer_public/da/56/da567ea3-47fe-43dc-b268-ef8201a9d297/b8f15a2f-7544-40cb-b2b9-32eba49deb3c.pdf); period: 2024.
  The report explicitly warns that annual Major Crime Indicator counts and the Public Safety Data Portal are not comparable because extraction methods differ. No series was spliced or converted to a conflict score; wider strategic exposure remains unmeasured.
- **ISR — `context_only`**. Query: `site.toronto.ca 2025 emergency management annual report`.
  Source: [Annual Financial Report](https://www.toronto.ca/city-government/budget-finances/city-finance/annual-financial-report/); period: 2025 annual report listing.
  The city publishes 2025 financial statements and annual reporting. Availability supports fiscal accountability review but does not itself establish adaptive capacity, cohesion or disaster recovery performance; no financial ratio was extracted.
- **RES — `context_only`**. Query: `site.toronto.ca 2025 drinking water annual report`.
  Source: [Tap Water Quality & System Reports](https://www.toronto.ca/services-payments/water-environment/tap-water-in-toronto/tap-water-quality-system-reports/); period: 2025 reporting.
  The producer lists 2025 testing, adverse-result, system-compliance and lead-mitigation reports. This establishes a local water evidence trail, not a full eFUA extraction or food/energy supply assessment.
- **MED — `context_only`**. Query: `site.toronto.ca population health profile access primary health care 2025`.
  Source: [Population Health Status Indicators](https://www.toronto.ca/community-people/health-wellness-care/health-inspections-monitoring/population-health-status-indicators/); period: Page modified 2026-05-07; underlying periods vary.
  Toronto Public Health provides geographic and sociodemographic dashboards and warns of inequities. Underlying healthcare-access values, sample uncertainty and alignment to the larger eFUA were not extracted; the 2023 profile is not relabelled 2026.
- **LON — `context_only`**. Query: `site.baycrest.org clinical trials aging Toronto`.
  Source: [Anne & Allan Bank Centre for Clinical Research Trials](https://www.baycrest.org/all-entities/baycrest-academy-for-research-and-education/research-units/anne-allan-bank-centre-for-clinical-research-trials/); period: Undated current programme page.
  Baycrest describes brain-health trials with ethics review and eligibility assessment. This confirms a local research pathway but provides neither deduplicated trial-phase counts nor population access or proven general longevity benefit.
- **TEC — `context_only`**. Query: `site.toronto.ca technology sector 2025 employment`.
  Source: [Toronto Employment Survey](https://www.toronto.ca/city-government/data-research-maps/research-reports/planning-development/toronto-employment-survey/); period: 2025.
  The city employment survey provides sector and location counts. Municipality, downtown and employment-area tables must not be treated as eFUA technology employment; research output and household digital diffusion remain separate missing constructs.
- **OPT — `usable_observation`**. Query: `site.ttc.ca annual report 2025 performance`.
  Source: [CEO’s Report June: Commentary](https://coupler.ttc.ca/news/message-from-the-executives/2026/Jun/CEO-Report-June-Commentary); period: 2025 ridership; April 2026 performance; published 2026-06-30.
  TTC reports roughly 193 million bus riders over 143.5 million kilometres in 2025 and 77% bus on-time performance in April 2026. Operator metrics are useful context but not all-mode metro redundancy, legal mobility or asset portability.

### san-francisco

- **PCS — `context_only`**. Query: `site.sf.gov hazards climate resilience plan earthquake 2025`.
  Source: [Hazards and Climate Resilience Plan](https://onesanfrancisco.org/hazards-and-climate-resilience-plan); period: 2025 plan.
  The city publishes a hazards and climate resilience plan covering buildings, infrastructure and communities. San Francisco city exposure cannot stand for the unresolved San Jose-named Bay Area eFUA; no polygon-weighted hazard observation was extracted.
- **GSS — `context_only`**. Query: `site.sf.gov 2025 police crime dashboard`.
  Source: [San Francisco Police Department Crime Trends - May 7 2025](https://media.api.sf.gov/documents/PoliceCommission5725-_Commission_Crime_Trends_Notes_05.07.25_1X6g5Kl.pdf); period: YTD through 2025-05-04.
  Police identify the series as preliminary crime warehouse data with a fixed weekly window. It covers San Francisco reporting, not the Bay Area or organized-conflict exposure; no absence-of-conflict conclusion follows.
- **ISR — `usable_observation`**. Query: `site.sf.gov 2025 emergency management annual report`.
  Source: [San Francisco Department of Police Accountability — 2025 Annual Report](https://media.api.sf.gov/documents/Annual_Statistical_Report_2025.html); period: 2025.
  The civilian oversight report records 899 complaints and 938 cases closed in 2025. These are administrative flows, not a rights-violation prevalence estimate; reporting access and case timing prevent a simple good/bad score.
- **RES — `usable_observation`**. Query: `site.sfpuc.gov 2025 water quality report`.
  Source: [SFPUC Releases Annual Water Quality Report, Reflecting a Century of Investment in Safe Drinking Water](https://www.sfpuc.gov/about-us/news/sfpuc-releases-annual-water-quality-report-reflecting-century-investment-safe); period: 2025 tests; published 2026-06-08.
  SFPUC reports over 95,000 tests and compliance with federal/state water standards in 2025. Nondetection is method-dependent, not proof of zero contaminant; the SFPUC service area does not cover every Bay Area resident or energy/food system.
- **MED — `context_only`**. Query: `site.sf.gov health 2025 community health needs assessment`.
  Source: [SF CHNA Reports](https://sfhip.org/chna/sf-chna/); period: 2025 CHNA listing; 2022 priorities explicitly distinguished.
  The data-producing health partnership publishes a 2025 CHNA. The page also describes 2022 access, behavioral-health and economic priorities; older priorities are not relabelled as new findings. A complete metro access/quality extraction is unavailable here.
- **LON — `context_only`**. Query: `site.aging.stanford.edu clinical trials`.
  Source: [Clinical Trials Search — Stanford Medicine](https://clinicaltrials.stanford.edu/app/ct.sm.html/); period: Live directory accessed 2026-10-09.
  Stanford supplies condition, NCT ID, recruitment and age filters. A provider directory is a discovery route, not a reconciled Bay Area geroscience registry; trial maturity, outcomes and affordability were not established.
- **TEC — `usable_observation`**. Query: `site.sf.gov economic indicators technology employment 2025`.
  Source: [ECONOMIC INDICATORS – CHANGE IN EMPLOYMENT](https://media.api.sf.gov/documents/WISF_Meeting_Packet_12102025_final.pdf); period: August 2025 preliminary; released September 2025.
  The official packet reports 107,100 information-sector jobs for San Francisco–San Mateo in August 2025. The industry is not equivalent to all technology and the metro division excludes much of the Bay Area; no eFUA score is calculated.
- **OPT — `context_only`**. Query: `site.bart.gov 2025 annual report performance`.
  Source: [Top accomplishments of 2025 usher in the New BART](https://www.bart.gov/news/articles/2025/news20251222); period: 2025 retrospective.
  BART reports fare-gate installation at all 50 stations and service coordination with partner agencies. Operator self-report describes implementation but not complete disruption redundancy, legal mobility or asset portability; the Bay Area boundary is unresolved.

### melbourne

- **PCS — `context_only`**. Query: `site.melbourne.vic.gov.au climate adaptation heat flood`.
  Source: [Water and flooding in Melbourne](https://participate.melbourne.vic.gov.au/amendment-c384/water-and-flooding-melbourne); period: Current planning consultation page.
  The municipality distinguishes coastal, rainfall and river flooding and publishes local flood guides. These planning materials identify mechanisms but do not provide a comparable greater-Melbourne population exposure or geophysical tail test.
- **GSS — `context_only`**. Query: `site.crimestatistics.vic.gov.au Melbourne 2025 recorded offences`.
  Source: [Crime Statistics Agency Data tables - Recorded offences](https://discover.data.vic.gov.au/dataset/data-tables-recorded-offences/historical); period: Year ending December 2025 listed.
  Victoria’s official catalog exposes recorded-offence tables. Police administrative offences require council-to-eFUA mapping, denominator checks and underreporting review; no metro organized-violence or strategic-exposure score was extracted.
- **ISR — `context_only`**. Query: `site.melbourne.vic.gov.au annual report 2024 2025 emergency`.
  Source: [Community Resilience Assessment](https://participate.melbourne.vic.gov.au/community-resilience); period: Prepare Melbourne four-year project; period not explicit on page.
  Prepare Melbourne documents community engagement and preparedness for heat, utility loss and other emergencies. Participation and plans are context, not independently measured metropolitan recovery or governance outcomes.
- **RES — `usable_observation`**. Query: `site.melbournewater.com.au annual report 2025 water storage`.
  Source: [Melbourne Water Annual Report 2024-25](https://www.melbournewater.com.au/media/eyJtZWRpYSI6IjI5ODY2In0%3D/downloads); period: 2024-07-01 to 2025-06-30.
  Storage fell from 86.5% at the start of 2024/25 to 71.5% on 30 June 2025; catchment rainfall was 839 mm, 19.9% below the 30-year average. Utility observations are not household reliability or a food/energy assessment; no normalized score is assigned.
- **MED — `context_only`**. Query: `site.thermh.org.au annual report 2025`.
  Source: [Annual reports — Royal Melbourne Hospital](https://www.thermh.org.au/about/reports-policies/annual-reports); period: 2024–2025 annual report listing.
  The hospital publishes statutory operational, care-volume and financial reports. One tertiary hospital cannot represent access or routine care across the metropolis; no population denominator or systemwide continuity estimate was extracted.
- **LON — `context_only`**. Query: `site.monash.edu ASPREE trial ageing results 2025`.
  Source: [ASPREE Completion Project — Outputs](https://research.monash.edu/en/projects/aspree-completion-project/publications/); period: 2025–2026 research listings.
  Monash’s research repository lists extended ASPREE follow-up on cardiovascular events and bleeding in older adults. Research output is not evidence of a generally approved longevity therapy or equitable resident access; registry reconciliation is incomplete.
- **TEC — `context_only`**. Query: `site.melbourne.vic.gov.au knowledge economy census employment`.
  Source: [Draft Economic Development Strategy 2025–2029](https://participate.melbourne.vic.gov.au/economic-development-strategy-2025-29/draft); period: 2025–2029 draft strategy.
  The city describes a knowledge economy and proposed economic actions. A draft strategy is not a current observation of knowledge output, innovation diffusion or metro industry density; no promotional claim becomes a score.
- **OPT — `usable_observation`**. Query: `site.ptv.vic.gov.au performance metropolitan trains 2025`.
  Source: [Monthly performance — Public Transport Victoria](https://www.ptv.vic.gov.au/footer/data-and-reporting/network-performance/monthly-performance/); period: June 2025.
  Official table reports metropolitan train punctuality of 94.5% and reliability of 99.1% for June 2025. Definitions are contractual and mode-specific; this old month is not 2026 performance or full transport redundancy, and legal/asset mobility remain unmeasured.

### dubai

- **PCS — `context_only`**. Query: `site.dm.gov.ae دبي تصريف مياه الأمطار تصريف 2025`.
  Source: [بلدية دبي تُرسي عقود 4 مشاريع ضمن مراحل مشروع تصريف](https://www.dm.gov.ae/بلدية-دبي-تُرسي-عقود-4-مشاريع-ضمن-مراحل/?lang=ar); period: 2025-04-18 announcement; planned completion 2027.
  Dubai Municipality announced four drainage projects costing AED 1.439 billion, expected by 2027. Planned capacity is not delivered protection; population-weighted heat/humidity and flood exposure were not extracted. Arabic source was machine-assisted read, not independently translated.
- **GSS — `insufficient_evidence`**. Query: `site.dubaipolice.gov.ae annual report 2025 crime; site.dubaipolice.gov.ae major crime statistics`.
  Source: [Dubai Police — Major Crime Statistics (attempted access)](https://www.dubaipolice.gov.ae/wps/portal/home/opendata/majorcrimestatistics/); period: Unavailable on attempted access 2026-10-09.
  English official-domain crime searches and direct access did not yield inspectable current table data; the police endpoint timed out. No numerical crime claim, zero-conflict assumption or geopolitical tail verdict is made.
- **ISR — `context_only`**. Query: `site.dsc.gov.ae Dubai 2025 governance statistics`.
  Source: [Charter of Quality of Statistical Data](https://www.dsc.gov.ae/Public%20Documents/About%20DSC/Charter%20of%20Quality%20of%20Statistical%20Data%20-%20EN.pdf); period: Undated charter accessed 2026-10-09.
  Dubai Statistics Center publishes a statistical quality charter. A formal data-governance commitment is not verification of reporting independence, social cohesion or emergency recovery outcomes; independent comparable outcome evidence was not established.
- **RES — `usable_observation`**. Query: `site.dewa.gov.ae 2025 annual report water electricity reliability`.
  Source: [DEWA 2025 Annual Operating Performance Summary](https://www.dewa.gov.ae/en/about-us/media-publications/latest-news/2026/2/dubai-electricity-and-water-authority-pjsc); period: 2025; published February 2026.
  DEWA reports 62.21 TWh power generation and desalinated-water demand of 161.505 billion imperial gallons in 2025. These show system scale and desalination dependence, not resilience during fuel, power or shipping disruption; operator incentives and service boundaries matter.
- **MED — `context_only`**. Query: `site.dha.gov.ae Dubai health statistical yearbook 2024 2025`.
  Source: [البيانات المفتوحة — Dubai Health Authority](https://dha.gov.ae/opendata); period: 2024 household health survey; 2022–2033 capacity study.
  DHA lists a household health survey and public/private clinical-capacity studies. Listing availability is not a completed sample and access audit; migrant eligibility, financial access and FUA population alignment were not resolved.
- **LON — `context_only`**. Query: `site.dha.gov.ae clinical trials Dubai ageing`.
  Source: [Clinical Trials Policy](https://www.dha.gov.ae/uploads/042023/Clinical%20Trials%20Policy2023415239.pdf); period: Version 1.1; effective 2023-06-12.
  Dubai Law 17/2026, issued 6 June 2026, establishes a Longevity Authority with trial and treatment oversight, alongside the DHA clinical-trials framework. Legal institutions do not prove therapeutic efficacy, mature trial outcomes or affordable resident access; no city trial count is certified.
  Additional directly opened source: [Law No. (17) of 2026 Establishing the Dubai Longevity Authority](https://dlp.dubai.gov.ae/Legislation%20Reference/2026/Law%20No.%20%2817%29%20of%202026%20Establishing%20the%20Dubai%20Longevity%20Authority.html), issued 2026-06-06. The English translation says Arabic prevails; Gazette publication date and operational implementation were not independently established.
- **TEC — `context_only`**. Query: `site.digitaldubai.ae annual report 2025 digital economy`.
  Source: [Dubai State of AI Report 2025](https://www.digitaldubai.ae/knowledge-hub/publications/dubai-state-of-ai-report-2025); period: 2025-04-21.
  Digital Dubai describes government AI use cases and its ecosystem. Selected cases and strategic ambition are producer self-report, not independent household diffusion or knowledge-output measures; no AI reputation bonus is assigned.
- **OPT — `context_only`**. Query: `site.rta.ae 2025 annual ridership 802`.
  Source: [Roads & Transport Authority — Open Data](https://rta.ae/wps/portal/rta/ae/home/open-data); period: 2025 annual report published 2026.
  RTA publishes a 2025 annual report and transport data access. No comparable all-mode disruption redundancy measure was extracted, and local ridership cannot establish immigration rights or asset portability.

### sao-paulo

- **PCS — `context_only`**. Query: `site.prefeitura.sp.gov.br PlanClima São Paulo risco calor inundação`.
  Source: [PLANCLIMA SP](https://prefeitura.sp.gov.br/web/planclimasp); period: Current plan and monitoring portal; underlying periods vary.
  The municipal portal provides climate plans and monitoring reports. Plan existence does not establish completed flood/heat adaptation or population-weighted eFUA risk; no scenario score was inferred from political targets.
- **GSS — `context_only`**. Query: `site.ssp.sp.gov.br dados estatisticos São Paulo município 2025`.
  Source: [Segurança Pública — Transparência](https://www.ssp.sp.gov.br/transparenciassp/Apresentacao.aspx); period: Reporting system description; underlying periods vary.
  SSP describes municipal and police-unit crime publication and separate lethal-violence records. The monthly endpoint yielded no readable table during access; no count was adopted and organized violence, underreporting and strategic exposure remain unquantified.
- **ISR — `context_only`**. Query: `site.prefeitura.sp.gov.br 2025 relatório gestão defesa civil`.
  Source: [CGM-SP apresenta Relatório Anual de Atividades 2025](https://smartsampa.prefeitura.sp.gov.br/web/controladoria_geral/w/cgm-sp-apresenta-relat%C3%B3rio-anual-de-atividades-2025-e-destaca-avan%C3%A7os-em-governan%C3%A7a-integridade-e-transpar%C3%AAncia); period: 2025 reporting; released 2026.
  The municipal comptroller announces its 2025 activity report covering governance and integrity. A self-reported activity inventory does not independently validate governance outcomes, cohesion or disaster recovery; municipal scope differs from the eFUA.
- **RES — `context_only`**. Query: `site.sabesp.com.br 2025 qualidade água São Paulo`.
  Source: [Relatórios Anuais de Qualidade da Água](https://www.sabesp.com.br/o-que-fazemos/fornecimento-agua/qualidade-agua/analises-anuais-qualidade-agua-distribuida); period: Current report portal; no specific municipal series extracted.
  Sabesp describes systematic source-to-meter sampling and accredited laboratories. The portfolio serves many municipalities, and portal claims do not establish São Paulo eFUA household continuity; no unverified corporate total is treated as a city value.
- **MED — `context_only`**. Query: `site.prefeitura.sp.gov.br saúde relatório anual gestão 2025`.
  Source: [Prestação de Contas — Secretaria Municipal da Saúde](https://prefeitura.sp.gov.br/saude/prestacao_de_contas/); period: Portal dated 2025-06-12; annual and four-month reports.
  Municipal health authorities provide annual management and four-month accountability reports. This is a local administrative evidence route; hospital capacity, resident access, denominator and uncertainty were not extracted or reconciled across the eFUA.
- **LON — `context_only`**. Query: `site.usp.br envelhecimento ensaio clinico São Paulo 2025`.
  Source: [Supera cognitive stimulation study with cognitively-unimpaired older adults](https://repositorio.usp.br/item/003296178); period: 2025 publication.
  USP’s repository identifies a randomized cognitive-stimulation trial and names Supera Instituto de Educação as funder. It is not proof of general lifespan extension; sponsor interest, trial registration, outcomes and resident access require separate checks.
- **TEC — `context_only`**. Query: `site.fapesp.br indicadores São Paulo ciência tecnologia 2025`.
  Source: [Sobre os Indicadores de Ciência, Tecnologia e Inovação](https://indicadorescti.fapesp.br/sobre/); period: Current methodology; source periods vary.
  FAPESP explains public administrative/microdata inputs and proprietary publication databases. Indicators primarily concern São Paulo state or Brazil, not the municipal/eFUA boundary; upstream source overlap and publication-language coverage prohibit naive index stacking.
- **OPT — `context_only`**. Query: `site.metro.sp.gov.br relatório integrado 2025`.
  Source: [Relatório Integrado — Metrô](https://www.metro.sp.gov.br/pt_BR/metro/sustentabilidade/relatorio-integrado/); period: 2025 report in associated transparency portal.
  Metrô explicitly excludes private-concession metro lines and supplier/third-party operations from reporting. Operator results therefore cannot represent the whole metropolitan transport network or redundancy; legal and asset mobility remain unmeasured.

### cape-town

- **PCS — `context_only`**. Query: `site.capetown.gov.za climate change hazard 2025`.
  Source: [Climate change — City of Cape Town](https://www.capetown.gov.za/family-and-home/greener-living/why-go-green/lets-act-against-climate-change/climate-change/); period: Current hazard assessment portal; underlying periods vary.
  The city identifies rainfall decline, hotter extremes and wind changes and links a hazard/vulnerability assessment. The portal is not a gridded population-weighted exposure extraction; neither a drought-free future nor tail-risk clearance is supported.
- **GSS — `context_only`**. Query: `site.saps.gov.za Cape Town crime statistics 2025`.
  Source: [Police Recorded Crime Statistics: Fourth Quarter 2024/2025](https://www.saps.gov.za/services/downloads/2024/2024-2025_Q4_crime_stats.pdf); period: January–March 2025.
  SAPS publishes station-level offence tables including Cape Town districts. Station counts and enforcement-driven drug offences cannot be equated to metro organized-violence risk; compatible denominators and independent victimization evidence are missing.
- **ISR — `context_only`**. Query: `site.capetown.gov.za annual report 2024 2025 governance`.
  Source: [Annual reports — City of Cape Town](https://www.capetown.gov.za/work-and-business/city-publications/publications-and-reports/annual-reports/); period: 2024/25 annual and oversight reports.
  The city publishes both an integrated annual report and oversight materials under municipal reporting rules. Publication supports an audit trail, not automatic proof of recovery capacity or equitable governance; no metropolitan outcome score is certified.
- **RES — `context_only`**. Query: `site.capetown.gov.za water 2025 annual report`.
  Source: [Water quality — City of Cape Town](https://www.capetown.gov.za/family-and-home/residential-utility-services/residential-water-and-sanitation-services/water-quality); period: July 2024–June 2025 annual report; quarterly reports through June 2026.
  The city provides annual water tests in English, Afrikaans and isiXhosa plus quarterly updates. Sampling compliance is not equal to reliable access for all households or drought reserve adequacy; food and energy remain separate gaps.
- **MED — `context_only`**. Query: `site.westerncape.gov.za health annual report 2024 2025`.
  Source: [Department of Health and Wellness Annual Report 2024/25](https://www.westerncape.gov.za/health-wellness/files/wcg-blob-files?file=2025-10%2Fwcdhw-annual-report-2024-2025.pdf&type=file); period: 2024/25.
  Western Cape publishes audited health-performance tables with numerator and denominator fields. Provincial and programme-level figures are not Cape Town-wide patient outcomes; geographic allocation, private-sector inclusion and access equity were not resolved.
- **LON — `context_only`**. Query: `site.uct.ac.za ageing clinical trials Cape Town`.
  Source: [Geriatric Medicine — University of Cape Town](https://health.uct.ac.za/department-medicine/division/geriatric-medicine); period: Undated programme page accessed 2026-10-09.
  UCT describes geriatric research and clinical services at Cape Peninsula facilities. Academic capability does not establish mature longevity trials or approved lifespan-extending treatments; city trial-registry reconciliation and affordable access are missing.
- **TEC — `context_only`**. Query: `site.capetown.gov.za technology broadband 2025`.
  Source: [Commercial telecommunications broadband services](https://www.capetown.gov.za/work%20and%20business/Get-online/Commercial-telecommunication-services/Commercial-telecommunications-services); period: Undated network inventory; tariff dated 2026-07-01.
  The city reports 935 km of fibre, 34 switching facilities and 556 connected city buildings. Inventory observation date is unclear and public-building connectivity is not household coverage or affordability; no universal digital-access score is inferred.
- **OPT — `context_only`**. Query: `site.myciti.org.za 2025 annual passengers`.
  Source: [Annual MyCiTi fare adjustments – 1 July 2025](https://www.myciti.org.za/en/contact/media-releases/annual-fare-adjustment-july-2025/); period: 2025-07-01.
  The municipal bus operator publishes fare adjustments. This supplies an affordability-policy observation route, not a complete rail/bus disruption or evacuation redundancy measure; immigration rights and asset portability remain unmeasured.

## Missing evidence and release interpretation

No future scenario deltas, normalization anchors, population-wide longevity benefits,
source-substitution results or weight-sensitivity outputs were fabricated. Police records
require independent victimization/event evidence; LON needs deduplicated original registry
records, phase/outcome/regulatory checks and resident-access evidence. OPT needs legal
mobility, asset portability and disruption alternatives, not merely transport counts.
Every dimension requires complete specified subpillars and the applicable governance gate.

The audit review is complete within this documented discovery scope. **Ranking qualification
is incomplete** and missing evidence must remain missing. Publishing this evidence ledger
is supportable; claiming these seven cities now have validated complete numerical CCI
rankings would not be.
