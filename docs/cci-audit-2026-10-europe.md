# CCI 欧洲四城证据审核（2026-10-09）

范围：Basel、Zurich、London、Amsterdam，各八个维度，共 **32 格**。检索与访问日期均为
2026-10-09；德语/法语、德语、英语、荷兰语检索分别覆盖四城，研究论文原文补用英语。
结果保存于 [机器可读记录](../src/cci/data/audits-2026-10-europe.json)。没有更改城市分数。

## 审核语义

- `usable_observation`：原发布者有可核实、带时间及具体适用范围的局部观察，值得保留为
  原始证据；**不等于完整 CCI 子支柱已通过 provenance、规范化、FUA 或正式排名门槛**。
- `context_only`：已核实的政策、目录、计划或概念相关材料，不能直接成为当前评分输入。
- `insufficient_evidence`：本次检索及可访问材料不足以证明指标；是已完成审核的结论，
  不是“待检索”，更不是城市表现差。
- 32 格中 16 格有局部观察、14 格仅背景、2 格证据不足。所有材料的适用范围和限制都与
  事实同列；没有用未来计划或全球指标填补本地观察。
- `boundaryReview` 审查的是本地来源辖区到冻结 eFUA 的适配；旧
  `boundary.verificationStatus` 是名称/国家到产品 ID 的匹配，两者不能混同。

## 本轮判定的关键限制

Basel 的跨境 eFUA 候选 935 + 2227 不能由 Basel-Stadt 州级数据代表；也不能因机场为
三国共用就认定包含法国人口的合并已验证。其他三城同样有市域、州/区域、医院及运营者
服务区混用问题。本文件不认证几何，仅记录已查出的适配缺口。

研究项目和大学成果不自动代表本地居民可获得治疗。苏黎世表观遗传时钟变化不等于寿命
延长；阿姆斯特丹 MASH 试验虽然是二期随机研究，也只能支持特定疾病的探索结果。
机场吞吐量是交通活动，不证明长期居留、工作和资本退出权利。

## 逐城、逐维度检索记录

以下保留本次采用的主要检索表达；搜索结果随后打开一手来源核查。精确发布日期未显示
时记录未知，不能把抓取时间或文件路径月份当作发布时间。下列中文为原文机器辅助理解，
未声称经独立人工翻译认证。

### basel

#### PCS — usable_observation

检索：`site.statistik.bs.ch Basel Klima Rhein 2025`。

巴塞尔统计局记录 2024 年莱茵河水温超过 20°C 共 62 天。这是河流测站观察，不是居民热暴露或 eFUA 气候分数；页面的 2025 数字明确为未满年度。

- [Von Wogen und Wellen: Abfluss und Wassertemperatur im Rhein](https://statistik.bs.ch/artikel/rhein-im-fluss)。观测/报告期：2024 full year; 2025 partial year；访问：2026-10-09。

#### GSS — context_only

检索：`site.bs.ch Basel Gefährdungsanalyse Krieg`。

本地德文检索未找到可比的巴塞尔跨境冲突暴露序列。瑞士 BABS 提供武装冲突情景，不是巴塞尔事件率；国家情景不能证明无战争风险。

- [BABS KNS2025 Gefährdungsdossiers — Bewaffneter Konflikt](https://www.babs.admin.ch/dam/en/sd-web/bie7zUvtan7V/KNS2025-Sammlung-der-Gefaehrdungsdossiers-final-de.pdf)。观测/报告期：2025 scenario catalogue; not observed event frequency；访问：2026-10-09。

#### ISR — usable_observation

检索：`site.bs.ch Basel Bevölkerung Befragung Vertrauen Sicherheit 2025`。

2023 年 Basel-Stadt 居民调查公开公共安全满意度回答数：非常满意 549、比较满意 972。须保留答题资格与无回应；州居民样本不等于跨境 eFUA。

- [Bevölkerungsbefragung 2023](https://www.statistik.bs.ch/artikel/bevoelkerungsbefragung-2023)。观测/报告期：2023；访问：2026-10-09。

#### RES — usable_observation

检索：`site.iwb.ch 2025 Trinkwasser Basel Versorgung Jahresbericht`。

IWB 报告 2025 年饮用水销量 1,770 万立方米。销量是运营者观察，不等于余量、可负担性或停供韧性，供水区域也不等于 eFUA。

- [Erfolgreiches Geschäftsjahr 2025 für IWB](https://www.iwb.ch/ueber-uns/newsroom/medienmitteilungen/artikel~_erfolgreiches-geschaeftsjahr-2025-fuer-iwb~)。观测/报告期：2025; published 2026-04-29；访问：2026-10-09。

#### MED — context_only

检索：`site.unispital-basel.ch Jahresbericht 2025 Patienten`。

USB 的 2025 年报记载收购 Claraspital，并讨论医保规则下的跨州准入。它证明服务机构变化，不证明居民均等准入或整个 eFUA 医疗质量；机构合并影响跨年可比性。

- [Universitätsspital Basel Jahresbericht 2025](https://www.unispital-basel.ch/ueber-uns/publikationen-veranstaltungen-news/jahresbericht)。观测/报告期：2025 report; 2026 integration discussion；访问：2026-10-09。

#### LON — insufficient_evidence

检索：`site.unibas.ch Basel Alterung klinische Studie 2025`。

核查的巴塞尔长寿研究是线虫饮食 RNA 机制研究。尚未建立人体转化和居民准入证据，不能作为本地临床长寿结果。

- [Longevity-Forschung: Gesünder im Alter durch Stress](https://www.biozentrum.unibas.ch/de/news/detail/longevity-research-dietary-stress-supports-healthy-aging)。观测/报告期：2025-09 publication; preclinical study；访问：2026-10-09。

#### TEC — context_only

检索：`site.bs.ch Basel Innovation Digitalisierung Unternehmen 2025`。

BaselTech 于 2025 年 10 月成立、2026 年 3 月正式启动。可核实的是项目启动；公告不测量非医疗技术实际采用、生产率或覆盖率。

- [Innovationsförderprogramme](https://www.bs.ch/ls/node/42842)。观测/报告期：2025 activities; 2026-03 launch；访问：2026-10-09。

#### OPT — usable_observation

检索：`site.euroairport.com 2025 passagers destinations bilan`。

EuroAirport 报告 2025 年旅客吞吐量 960 万。这是三国地区机场流量观察，不测量个人退出权利、可负担性或紧急航路可用性。

- [Rapport Annuel 2025](https://www.euroairport.com/publications/rapports-annuels/rapport-annuel-2025)。观测/报告期：2025; published 2026-05-06；访问：2026-10-09。

**边界适配审核：unresolved。** 后续[原始几何核查](./cci-boundary-audit-2026-10.md)确认 935 与 2227 无重叠，并集为 820 km²，已明确冻结产品范围；它不代表完整三国都会区。仍未解决的是 Basel-Stadt、IWB 和 EuroAirport 的观察范围与冻结并集的对应关系。

### zurich

#### PCS — context_only

检索：`site.stadt-zuerich.ch Stadtklima Zürich 2025`。

城市运行温湿度监测，并区分未来热带夜预测与观察。所核查页面未提供整个 eFUA 固定年度暴露序列；预测频率不计作当前事实。

- [Stadtklima Zürich](https://www.stadt-zuerich.ch/de/gesundheit/gesundheitsschutz/stadtklima.html)。观测/报告期：current monitoring description; future scenarios separately identified；访问：2026-10-09。

#### GSS — context_only

检索：`site.zh.ch Gefährdungsanalyse 2025 bewaffneter Konflikt`。

州风险报告确认 2025 年十项跨部门风险，BABS 提供国家武装冲突情景；两者均不提供苏黎世都市圈已观测战争概率。

- [Integrales Risikomanagement 2025](https://www.zh.ch/de/steuern-finanzen/kantonsfinanzen/geschaeftsbericht-rechnung/geschaeftsbericht-2025/integrales-risikomanagement.html)。观测/报告期：2025；访问：2026-10-09。
- [BABS KNS2025 Gefährdungsdossiers — Bewaffneter Konflikt](https://www.babs.admin.ch/dam/en/sd-web/bie7zUvtan7V/KNS2025-Sammlung-der-Gefaehrdungsdossiers-final-de.pdf)。观测/报告期：2025 scenario catalogue; not observed event frequency；访问：2026-10-09。

#### ISR — usable_observation

检索：`site.stadt-zuerich.ch Bevölkerungsbefragung 2025 Vertrauen`。

2025 年城市居民调查中，68% 认为市政府及议会能良好代表自己。这是含群体差异的市级感知指标，不是 eFUA 1479 的客观治理表现。

- [Hauptergebnisse Bevölkerungsbefragung 2025](https://www.stadt-zuerich.ch/artikel/de/bevoelkerungsbefragung/ergebnisse-bvb-2025.html)。观测/报告期：2025 survey；访问：2026-10-09。

#### RES — context_only

检索：`site.stadt-zuerich.ch Wasserversorgung Jahresbericht 2025 Trinkwasser`。

市饮用水数据集提供自 2023 年起的单项测量及 2025 CSV；元数据于 2026-06-09 更新。目录核查证明可获取，不代表已完成合规、管网韧性或水粮能源充足性验证。

- [Open Data Zürich — Trinkwasserqualität](https://data.stadt-zuerich.ch/dataset/dib_wvz_trinkwasserqualitaet)。观测/报告期：2023–2025 data; metadata 2026-06-09；访问：2026-10-09。

#### MED — usable_observation

检索：`site.usz.ch 2025 Jahresbericht Patienten`。

USZ 报告 2025 年 1—6 月住院患者 20,767 人，同比增长 1.5%。单一三级医疗机构业务量不能证明整个 eFUA 未满足需求、等待时间或公平准入。

- [USZ mit positivem Geschäftsverlauf im ersten Halbjahr 2025](https://www.usz.ch/usz-mit-positivem-geschaeftsverlauf-im-ersten-halbjahr-2025/)。观测/报告期：2025-01 to 2025-06；访问：2026-10-09。

#### LON — usable_observation

检索：`site.uzh.ch 2025 DO HEALTH biologische Alterung omega 3`。

UZH 的 DO-HEALTH 分析涵盖 777 名 70 岁以上人士的三年观察，报告表观遗传时钟变化。这是临床研究生物标志物观察，不是已证实延寿；此处未建立入组年份和都市圈居民准入。

- [Omega-3 kann den Alterungsprozess verlangsamen](https://www.news.uzh.ch/de/articles/media/2025/omega-3-alterungsprozess.html)。观测/报告期：three-year trial; analysis published 2025-02-04；访问：2026-10-09。

#### TEC — usable_observation

检索：`site.ethz.ch 2025 spin offs 2026 Zürich`。

ETH 在 2025 年认定 46 家企业：24 家 spin-offs、22 家 start-ups，含部分追认。定义变化使简单同比无效；还须区分非医疗、本地经营与居民技术扩散。

- [Mehr Neugründungen, neue Regeln, neues Förderprogramm](https://ethz.ch/de/news-und-veranstaltungen/eth-news/news/2026/02/mm-mehr-neugruendungen-neue-regeln-neues-foerderprogramm.html)。观测/报告期：2025 recognitions; published 2026-02-25；访问：2026-10-09。

#### OPT — usable_observation

检索：`site.flughafen-zuerich.ch 2025 destinations`。

苏黎世机场报告 2025 年连接 71 国、163 个目的地。这是实际机场连接，不代表每位居民迁移的法律权利或财力；机场服务范围超出苏黎世。

- [Aviation Development — Flughafen Zürich](https://www.flughafen-zuerich.ch/de/business/airlines-und-handling/aviation-development/markt)。观测/报告期：2025；访问：2026-10-09。

**边界适配审核：unresolved。** 候选 ID 1479 已有仓库名称/国家匹配。来源方法确认这是估计的 2015 eFUA；本次未建立多边形与市、州、医院或机场服务范围的空间映射。名称匹配不能认证指标地理范围。

### london

#### PCS — context_only

检索：`site.london.gov.uk London climate resilience review 2024`。

2024 年 7 月本地气候审查识别高温、洪水和干旱，并区分防御规划日期与已发生危害。它不提供统一核准的 eFUA 暴露指标；2040/2050 工程期限是计划，不是当前防护结果。

- [The London Climate Resilience Review — July 2024](https://www.london.gov.uk/sites/default/files/2024-07/The_London_Climate_Resillience_Review_July_2024_FA.pdf)。观测/报告期：2024 assessment; historical events and future plans distinguished；访问：2026-10-09。

#### GSS — insufficient_evidence

检索：`site.london.gov.uk London risk register war 2025`。

检索找到官方 London Risk Register v14，但全文访问返回 403。UCDP 年度/月度数据仅核查到目录；未建立伦敦冲突空间连接或可比军事暴露指标。

- [UCDP Dataset Download Center](https://ucdp.uu.se/downloads/)。观测/报告期：annual 26.1 through 2025; candidate 26.0.8 through 2026-08；访问：2026-10-09。

#### ISR — usable_observation

检索：`site.london.gov.uk survey London trust police 2025 data`。

GLA 的 PAS 摘要报告 2025 年 4 月 74% 信任伦敦警察；2025/26 第三季度 68% 夜间独行感到安全，女性为 58%。这是调查感知，不是冲突记录或人人安全；共同上游为 MOPAC。

- [State of London 2026 — Crime](https://apps.london.gov.uk/state-of-london/report/crime)。观测/报告期：2025-04 and 2025-10 to 2025-12；访问：2026-10-09。
- [MOPAC Surveys](https://data.london.gov.uk/dataset/mopac-surveys-236kk)。观测/报告期：PAS: 19,200 residents per year; catalogue through 2026 Q2；访问：2026-10-09。

#### RES — usable_observation

检索：`site.thameswater.co.uk annual performance report 2025 leakage supply interruptions`。

Thames Water 在 2025/26 半年报报告三年滚动平均漏损 584 百万升/日。这是区域运营者指标，不仅覆盖大伦敦；水质、停供与可负担性需独立指标，粮食和能源仍无对应观察。

- [Thames Water Half Year Results 2025/26](https://www.thameswater.co.uk/news/2025/dec/thames-water-half-year-results-202526)。观测/报告期：half-year 2025/26; leakage is three-year rolling average；访问：2026-10-09。

#### MED — context_only

检索：`site.england.nhs.uk london waiting list 2025 referral treatment`。

GLA 健康章节区分医疗系统指标、行政区不平等与总体寿命，并链接 NHS 疫苗及 OHID 结果。NHS RTT 原文访问未成功；未建立整个 eFUA 医疗可及、质量和可负担性完整指标。

- [State of London 2026 — Health](https://apps.london.gov.uk/state-of-london/report/health)。观测/报告期：mixed observation periods: 2022–2024, 2024/25 and provisional 2023–2025；访问：2026-10-09。

#### LON — context_only

检索：`site.ucl.ac.uk ageing clinical trial 2025 senolytics`。

UCL 于 2026-06-18 公告筹备首次人体免疫年轻化一期试验。目标是安全性/生物活性，不是已证明临床获益；此处未确认试验已启动、结果或居民常规准入。

- [New trial aims to extend immune system lifespan](https://www.ucl.ac.uk/news/2026/jun/new-trial-aims-extend-immune-system-lifespan)。观测/报告期：2026-06-18 announcement; future trial；访问：2026-10-09。

#### TEC — context_only

检索：`site.london.gov.uk 2025 2026 digital connectivity gigabit London; site.gov.uk London 2025 gigabit Ofcom`。

BDUK 发布 2025 年 1 月伦敦场所级数据，区分已有千兆连接、商业及公共交付计划。已核查目录但未聚合；规划基础设施不能混同实际创新扩散。

- [January 2025 OMR and premises in BDUK plans](https://www.gov.uk/government/publications/january-2025-omr-and-premises-in-bduk-plans-england-and-wales)。观测/报告期：2025-01; published 2025-07-01；访问：2026-10-09。

#### OPT — usable_observation

检索：`site.heathrow.com 2025 annual results destinations 2026`。

希思罗 2025 业绩公告报告超过 8,450 万旅客。它核实单一机场流量，不代表全部伦敦机场或个人退出权利；不采用扩建预测和 2026 预期流量。

- [Heathrow results for year ended 31 Dec 2025](https://mediacentre.heathrow.com/pressrelease/detail/24843)。观测/报告期：2025; published 2026-02-25；访问：2026-10-09。

**边界适配审核：unresolved。** 仓库 ID 5288 已按名称匹配伦敦；本次发现 GLA 行政区、MPS/PAS、区域供水及单机场范围不同。未建立到冻结 2015 eFUA 的人口加权或多边形映射。

### amsterdam

#### PCS — context_only

检索：`site.amsterdam.nl klimaatadaptatie monitor gezondheid 2025`。

市政府识别极端高温、干旱、强降雨内涝与洪灾风险并公开 2025 适应进展。政策与进度文档不量化当前 eFUA 暴露，也不保证未来防护。

- [Beleid Voorbereiden op klimaatverandering](https://www.amsterdam.nl/bestuur-organisatie/beleid/voorbereiden-klimaatverandering/)。观测/报告期：2025 progress documentation; ongoing policy；访问：2026-10-09。

#### GSS — context_only

检索：`site.amsterdam.nl risicoprofiel 2025 oorlog veiligheidsregio`。

Amsterdam-Amstelland 区域风险档案覆盖 2025—2028，市议会于 2025-04-02 审议。它是区域备灾背景，不是都市圈战争发生率或校准的长期战争概率。

- [Regionaal Risicoprofiel 2025–2028](https://openresearch.amsterdam/nl/page/120969/regionaal-risicoprofiel-2025-2028)。观测/报告期：2025–2028 planning horizon; council 2025-04-02；访问：2026-10-09。

#### ISR — usable_observation

检索：`site.onderzoek.amsterdam.nl 2025 vertrouwen bestuur veiligheid`。

O&S 报告 Oost 区自报受害指数从 2024 年 98 升至 2025 年 107。这是区级调查指数，不是犯罪件数或城市治理分数；自报受害与警方登记须区分。

- [Openbare orde en veiligheid in cijfers 2026](https://onderzoek.amsterdam.nl/artikel/openbare-orde-en-veiligheid-in-cijfers-2026)。观测/报告期：2024–2025 observations; 2026 publication；访问：2026-10-09。

#### RES — usable_observation

检索：`site.waternet.nl jaarverslag 2025 drinkwater kwaliteit`。

Leiduin 2025 法定化验表报告四次氯酸盐测量超过当时 1 µg/L 标准并通知监管机构；表内明确 2026 起标准为 250 µg/L。单一生产点与标准变化不能证明整个管网合规或韧性。

- [Waternet Drinkwater Productielocatie Leiduin — Jaar 2025](https://www.waternet.nl/siteassets/ons-water/drinkwater/waterkwaliteit-rapporten/2025/drinkwater-leiduin-wettelijk-2025-jaar.pdf)。观测/报告期：2025 samples; standards distinguished from 2026；访问：2026-10-09。

#### MED — context_only

检索：`site.ggd.amsterdam.nl gezondheidsmonitor 2024 2025 volwassenen`。

GGD 的 2024 成年/老年居民监测于 2025 年 6 月公布，按群体呈现市级健康差异。人群健康监测本身不等于完整医疗交付/准入指标；未建立 eFUA 覆盖与未满足医疗需求字段。

- [Gezondheidsmonitor Volwassenen en Ouderen 2024](https://openresearch.amsterdam/nl/page/125996/gezondheidsmonitor-volwassenen-en-ouderen-2024)。观测/报告期：2024 survey; published 2025-06；访问：2026-10-09。

#### LON — usable_observation

检索：`site.amsterdamumc.org veroudering klinische studie 2025 2026; site.amsterdamumc.org senolytic trial`。

Amsterdam UMC 的 2026-10-01 论文记录报告 NCT05506488：31 人 MASH 衰老细胞清除二期随机试验；主要纤维化终点为 47% 对 7%，不良事件 82% 对 43%。小样本特定疾病试验不是普遍延寿或居民常规准入。

- [Senolytics dasatinib and quercetin in MASH — randomized controlled trial](https://pure.amsterdamumc.nl/en/publications/senolytics-dasatinib-and-quercetin-in-metabolic-dysfunction-assoc-2/)。观测/报告期：published 2026-10-01; three 7-week treatment cycles; enrolment dates not established；访问：2026-10-09。

#### TEC — context_only

检索：`site.onderzoek.amsterdam.nl digitale 2025`。

2025 年 12 月市级数字监测研究 Amsterdam/Weesp 居民设备、技能和障碍。它提供本地扩散来源，但未提取可比非医疗创新/生产率指标；网络犯罪观察归 ISR，不再作为 TEC 重复扣分。

- [Monitor Amsterdammers Digitaal 2025](https://onderzoek.amsterdam.nl/publicatie/monitor-amsterdammers-digitaal-2025)。观测/报告期：published 2025-12; survey fieldwork dates not established；访问：2026-10-09。

#### OPT — usable_observation

检索：`site.schiphol.nl 2025 300 bestemmingen`。

Schiphol 报告 2025 年旅客 6,880 万、全球目的地 300 个（洲际 124 个）。机场指标不证明按国籍区分的迁居权、资产可携带性或紧急撤离选择。

- [Schiphol in 2025: stillere vliegtuigen, meer tevreden reizigers en solide financiële resultaten](https://nieuws.schiphol.nl/schiphol-in-2025-stillere-vliegtuigen-meer-tevreden-reizigers-en-solide-financiele-resultaten/)。观测/报告期：2025 results; 2026 publication；访问：2026-10-09。

**边界适配审核：unresolved。** 仓库 ID 1427 已名称匹配。含 Weesp 的市域、Amsterdam-Amstelland 安全区、Leiduin 供水范围与 Schiphol 服务区域并非同一地理单位；本次未将观察空间统一到冻结的 2015 eFUA。

## 已尝试但不用于事实证明的来源

- London Risk Register v14 官方 PDF、London Risk Assessment 页面：访问返回 403。
  GSS 结论为证据不足；没有把标题当作风险暴露数据。
- 伦敦气候审查网页返回 403，但官方 2024 年 7 月 PDF 成功读取；采用 PDF。
- NHS England RTT 页面及 2025-05-22 伦敦等待名单新闻只返回短页面壳。未采用搜索摘要
  中的 61.1% 作为已验证观察，MED 改保留可读的 GLA 健康章节及其上游链。
- Connected London、数字项目页和部分 GLA PDF 返回 403；改核查 GOV.UK 的 BDUK
  2025 年 1 月场所级数据目录。未下载 45.1 MB London ZIP，故不声称已聚合覆盖率。
- Heathrow 年报 PDF 无法读取，改从其官网新闻列表进入 2026-02-25 年度结果正文。
- USB 的旧 wwwprod 报告路径失败，改用可读的医院正式 Jahresbericht 2025 页面。
- Basel GSS 本地搜索出现受保护的档案目录，不能证明冲突强度；用 BABS 国家情景明确
  标注背景，不制造“零冲突”。

## 原始字段与偏差处理

已保留的数值必须连同其单位解释：Rhine 水温天数属于测站、IWB 售水量属于运营服务区、
MOPAC 属于感知调查、USZ 属于单一医院、ETH 属于认定制度、Schiphol 属于机场网络。
这些源有行政报告、调查选择、运营者自报、研究者发表及商业宣传激励；没有一类天然无偏。

ETH 2025 的 46 家不是 46 家新 spin-offs：官方拆为 24 spin-offs 与 22 start-ups，后者
包含追认。Waternet 表格明示 2025 氯酸盐四次超过当年 1 µg/L 标准并通知监管；2026 年
标准变为 250 µg/L，不能跨标准直接判定趋势。新闻标题里的“更好”“安全”不替代原字段。

已完成本轮 32 格来源与适配审核。未运行跨源替代重算、完整 FUA 指标计算、全球试验去重
或移民身份逐项验证，因此没有产生新评分、正式排名资格或未来生存概率。
