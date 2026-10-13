# Sheffield eFUA 4460：有界优先复核

证据截止 **2026-10-10**；采集/复核 **2026-10-13**。对象为 British 本国公民、通常长期本地居住、当地中位收入及通常 NHS England 保障。没有假定所有人满足某治疗适应证、持某银行账户或有任意迁移预算。按[共同 rubric](cci-global-scoring-rubric.md)、[31 项语义](cci-global-indicator-contract.md)及[原八维模型](cci-research-model-v2.md)，使用 [research 技能](/Users/morris/.agents/skills/research/SKILL.md)的第一方取证规则；最多两轮定向发现已关闭，随后仅跟读已取得原 href。没有联系机构、提交或修改共享数据。

**条件主值：PCS 60 / GSS null / ISR 40 / RES 60 / MED null / LON null / TEC 60 / OPT 60。已知加权小计 33，未定权重 40，范围 33–73。** 原权重 15/15/15/10/15/10/10/10；即 9+6+6+6+6=33。不是完整中心总分或 CCI 名次，不取未知中点、不重标权、不以国家背景补齐。映射八维/31 键，局部结果并不等于完成 31 项实测；缺口逐项保留。

## 冻结调度与功能区

冻结 `priority-all9031-v2.csv` 全表 5,064,733 bytes、SHA256 `036824ac48835ac7e2458ebb530c4e66754e0090b143c50953b8ed86c0575004`，原行4460：主五名次 **19/29/38/30/17**，均≤40；十场景完整，最差 **141（no_heat）**。其他五场景为141/19/19/20/24。队列调度不等能力排名；没有继承其他英国城市分数。

全 **9,031** 几何遍历、EPSG4326→ESRI54009 `always_xy`、`covers` 已核。冻结 GPKG 9,932,800 bytes、SHA256 `9934364827132232df67e8984768fb30865a846f5a786db999d49fc37fb7698d`；4460 fid8436、GBR、旧 UC1838;1845、**1,325km²**、2015 FUA人口约1,145,122，不能当2026人口。目标WKB SHA256 `dfa687e8e393aa560093b3cd2193830478817df1e17ea3165a0bcadf0284d562`。

Sheffield、Rotherham、Northern General、Royal Hallamshire、Jessop/Weston Park、Sheffield大学/Hallam City、AMRC Catcliffe/Factory2050、Meadowhall、Sheffield站、Rotherham医院、Stocksbridge/Lower Don 近似参考点均4460；Barnsley、Doncaster Sheffield机场、Leeds Bradford机场点4159，Manchester机场点3304。点不是正式设施足迹、catchment、病人居住地或运行证明，机场名尤其不能证明当前开放。Council租户/Sheffield市不是全部功能区，Yorkshire Water/Powergrid区域指标也不是4460居民率；Rotherham材料不能因行政市名而排除。

冻结代理：motor1.60658min、walking16.94402min、PGA0.0131596g，模型人口缺失0/within60上下1/seismic观察share1；热为旧ERA5中心UTCI>32 annualdays **2/2**，新版UC4706;4881不混旧UC编号。固定323629.96/mobile160996.07kbps，90,315/6,486自选有效测速；不证明每户技能、负担或通信备援。UCDP2021–25/2026精定位匹配0只是匹配结果，不是全区安全证明。

## 八维与相邻档

### PCS：已得河洪工程与适配恢复，重要残余仍在

[S03防洪现页](https://www.sheffield.gov.uk/public-health/flooding/flood-protection-schemes)称 Lower Don £21m/8km工程 **Jan2018完工**、九priority culverts **2020完工**；[S04 17Oct2023原公告](https://www.sheffield.gov.uk/news/2023/first-phase-upper-don-flood-alleviation-scheme-complete)确认Loxley首段 £11m/63homes/152businesses。S04历史介绍称LowerDon2017，现页Jan2018，保留不同称谓/时点，不能静默统一。Three Brooks的wetland detention basins与自然滞洪pilots属于真实地方适配，不能用整个计划“6000homes/1700businesses/32000jobs/£1b avoided”的目标当已保护人口。

现页后续 UpperDon phase2设计late2026、建设预期2028、phase3 2030后；BlackburnBrook spring/summer2027；Totley修culvert2025开工后暂停/late2026或early2027预期重启。现页未标更新时间，Oct13抓取不能把这些变动反推Oct10已知版本；**无论版本，未来预期不当已投用，也不推断截止时必然仍未投用**。旧低热/PGA仅危险背景。S14 p6实际区域暴风准备/通信/弱势停电现场支持改善，是适配恢复证据，p12也承认近期表现恶化/天气与水电依赖。

**条件60**：接受已成主要河洪/普通避险与适配区域恢复延续且对通常FUA居民有效，特定流域、老化管线/后续工程和共因残余仍重要。真实主要保护缺口主导可40，多危险低暴露/保护和备用强可80；拒绝空间/持续假设则null。没有加“所有危险同年全区压力普测”门槛。

### GSS：相关威胁/缓解链仍未知

S02租户ASB2639（69/1000homes）及44hate事件（>1/1000homes）是记录类别/住房分母，不足认定全部为组织暴力、全部实际受害或城市暴力率。未核组织/区域战略威胁的充分覆盖、相关当地情景、关键后果及已运行缓解。国家安全背景、制造/医院/机场名字、普通防洪和零UCDP匹配不能自动组成60。

**主null、alternatives=[]**；rubric不要求已经当地战争或战略攻击，只是本轮相应情景和当地适配影响连接未闭。下一条有区分力证据应连接真实组织/区域/战略情景与通常居民、节点后果和缓解，而不是增加一般设施列表；无证不是40。

### ISR：交付真实，但预算适应与服务申诉仍有明显障碍

[S15 KPMG原PDF](https://www.sheffield.gov.uk/sites/default/files/2026-03/2024-2025-auditors-annual-report.pdf) p4目视 **27Mar2026 qualified opinion**，VfM work仍未完成，可变；不等全面违规/财政崩溃。p16目视FY24/25超支 **£34.7m=7%净收入预算**，真实BIPs节省£40.1m，预算contingency原£70m现<£1m；不能说所有储备<£1m。p28/32认定AdultCare需求建模的实际significant weakness，2025–26 Q1该项**预测**超支£34.6m，不能当已证2026全年实绩。建模两年趋势/年中重设等管理响应due1Apr2026，不把到期日当独立已验证有效整改。p31住房Board/dashboard等改善足够使该项未再认定VfM重大弱点，但原HousingRegulator judgement未撤销；同页June2024/结论July2024日期称谓冲突保留。

[S02 FY24/25租户报告](https://haveyoursay.sheffield.gov.uk/year-in-review-a-look-back-at-2024-2025)截至7Sep2026更新：gaschecks99.3%、fireassessments92.8%（同比降7.2点），nonDecent5.4%（升3.1点，旧存量调查不完备也影响变动）。>80%首次修好、nonemergency71%/emergency91%按时；不是所有房屋安全已恢复。stage1投诉2523、stage2 185，按Code期限处理 **64%/22%**，投诉不是已证明医疗/住房损害率。约4000租户调查80%公平/尊重非全市信任。Holly实际家暴受害多机构帮助3个月从暂居到永久住所、志愿数字帮助和飞倾>99%24h清除支持适应/凝聚/恢复，非所有受害已恢复。

S12 p17目视CitizensAdvice约40地点/电话/视频及BSL/精神健康支持，11,000Council tenants水socialtariff实际减少£2,379,766；是交付/受助量不是全部居民净负担。旧HSF“24h付款”为报告操作概括、无全账底表。[S19 25Feb2026](https://www.sheffield.gov.uk/news/2026/new-crisis-and-resilience-fund-provide-financial-support-sheffield-residents)批准April CRF替HSF、£10m/年3年，无wrongdoor是新方案而非三年已实现；当时现有收入增益平均£2,628.50/household未给分母，保留。其评价承认stigma/confusion/情绪负担，解释为什么听取居民与线下/电话缓解还不足简单判障碍已消失。

**条件40，替代60**：地方服务运行和缓解确实成立，但接受主要行政核心的成人照护适应预算与住房申诉障碍对FUA通常制度能力有代表性且残余仍显著。没有把普通中位居民等同贫困租户或把会计qualifier直接评分；若已实施治理/社区/住房缓解已充分减轻残余，60可辩护。拒绝代表性/截至日延续则null；不凭缺额外组织数量封顶。

### RES：日常供给与地方工程可用，共因/负担残余并读

[S05 YorkshireWater APR2025](https://www.yorkshirewater.com/media/o04ihtpd/47811_yw_apr_report_2025_digi_aw-1.pdf) p55原表calendar2024 **CRI3.61 vs9.27/target0**；这是风险指数非3.61%患病/全部水不安全，受DWI确认可修订。p57 FY24/25 **8:27 vs5:00target**，指≥3h失供公司按物业加权年度指标，非每户最长8分27秒。p106 **19 ≥12h events vs18/target12**，含计划/非计划/第三方，公司事件不是19次Sheffield全区停供。p105 2024 look/taste/odor 5177=9.4/10k population，非感染率；实际2024干管调理完成，约450,000 Sheffield周边customers**预期受益**，不是已独立验证450k人末梢改善。未来>1m/33WSZ工程不当已成。

p66 **12%**是未来25年平均、1-in200旱情、解决方案前baseline模型风险，去年4%；不是2025真实限水人口。实际leak reduction维持supply-demand surplus与将来预计分开。S06 Longwood July2024 coagulant/coliform监管事件保留供水公司治理背景，位置未核4460，**不移植本FUA事件或当Sheffield居民感染**；Doncaster2024水事件亦外区4159。11k租户水费降低支持地方可负担缓解，不能除以全区人口。

S12/S13食品/燃料/现金支持与实绩表明基本资源渠道运行；S19替换旧HSF不把旧once/6months规则机械移到新基金。S14区域停电支持实际改善，但p12水设施电力依赖、performance恶化、未来telecom计划仍重要；“计划2025实施”不能当2026已完成或仍未完成。多类日常供应和通常零售食品取得/中位收入必要净负担可承担，是明确可撤回推定，未取全户账单也不因此另造门槛。

**条件60，40/80替代**：接受地方/适配区域运营到截止延续、末端受监管与通常支付；旱情/水电物流共因和弱势净负担仍重要。残余主导可40，真实独立供给/备用强可80；拒绝末端/费用/通常取得推定则null。

### MED：旧整改与反证，近期过程样本不能补广泛常规质量

S21同国通常居住NHS England资格原件可复用，British国籍本身不是免费住院充分条件。点已核的两市医院实际多内外科/急诊/必要专科与本区服务范围成立，但模型极短旅行不证明等候/质量。

[S09 CQC22Dec2022原PDF](https://api.cqc.org.uk/public/v1/reports/cdd4ac7a-fdb4-4827-afb3-7edebb3aa071?20221222100655=)是20–22Sep2022六核心及部分wellled跟进，不是全服务新检查。p4目视safe从inadequate→RI、effective/caring→Good，未有核心仍inadequate，real改善与warningnotice遵守并列；combinedGood混Useofresources，不能说医疗overallGood。p89实际NEWS升级改进同时sepsis training医学89%/护理96%对target90%，**训练不是及时抗菌药依从**；审核没分sepsis项目/抗菌药1h落实、dashboard无时限/合规底表，不能说已测全部治疗失效。p111过去12月SSI<1%及防治audit100%不是风险调整/2026结局，C4/F8/F9手卫生及PPE仍真实不合规。p95五incident reports有candour/家属参与/行动学习，但反馈调查延误仍在。以上不能反推2026一定已修复或仍完全一样。

S20 Rotherham CQC10June2022主要观察29Sep2021，也是旧RI。W01 [Healthwatch原index](https://nds.healthwatch.co.uk/reports-library/enter-and-view-acute-medical-unit)9Oct2025发布，4July2025 **一次announced AMU访问、20人views**：病人安全感/诊疗理解、忙中照护与高温下舒适成立；staff abuse、偶发staffing pressure、AIS知识弱和新餐饮teethingissues仍见。患者体验/观察过程不是广泛风险调整临床获益，也不足单凭20人关闭两市主要医疗整改。

**主null、alternatives=[]**。STH2024/25年报原href403、Healthwatch原PDF410/webtimeout是研究渠道失败，非当地质量低/透明度差。下一条最小证据为已有主要单元近期质量/有效整改及通常接诊/连续性，允许有限适配过程+临床结果，不要求完美全人口或所有科同年实测。

### LON：真实MS人体回输，成熟采用/通常取得尚未闭

[S16 NIHR本地第一方](https://www.sheffieldbrc.nihr.ac.uk/news-events/first-sheffield-car-t-ms-patient-hails-best-birthday-gift-ever)描述Rotherham的Numan Unees在RoyalHallamshire obe-cel MS回输、Sheffield首位/全球第7位。**Phase1 AUTO1-MS1、4UKsites、全球计划up18，18–60 progressiveMS在最佳药物后仍恶化**是试验资格/计划，不是18已治疗、疗效分母或普遍居民适应证。患者体验与希望停止进展不是测得成熟终点。该正文未标发布/回输日期，页尾copyright2018不是事件年份，不能凭当前抓取把全部实施日期锁在截止前。

同分子“certain blood cancers NHS approved”只是院方概括，不能扩为MS批准。S22 April2026国家CAR-T委托的NICE/MDT/普通居住、公费及28/100day和长期毒性监护规则可复用；这不证明本地MS常规供资或该试验外居民现在取得。HSCT/算法入口202/JS失败只保留线索，不把标题/一般专科能力当成熟人体证据。

**主null、alternatives=[]**，并非要求健康人延寿/新型geneediting。最小下一证为当地或本区居民外区的可信成熟疾病转化路径、人类结果/版本、当前适应证供资与监护取得；不把旧试验当当前已付款，也不因未见广泛批准就40。

### TEC：真实产出/制造节点与数字扩散，群体连接仍条件性

[S10大学AMRC原文](https://sheffield.ac.uk/research/features/growing-ambitions-amrc)有>125企业（全球/SME混合，不是125家本地企业），Sheffield/Rotherham边界Boeing/McLaren工厂及Factory2050真实研发/产业连接。英国其他区RollsRoyce/Airbus项目/6000jobs不合并本区；未来项目不当已运营。S11实际是 **Senate11Dec2024校长报告**，非FY2025财报，p9目视大学portfolio2023/24 privateinvestment **£30.8m vs16m**（并非FUA全部VC），工业叶片视觉检测获奖申请/研发不当已全面工厂应用；AMRC技能培训和产业节点对本区能力有意义，大学/AMRC同源不伪装两独立知识机构。

S17 p8 2025–March2026成员电脑free、visitor£2.10/h、欠费>£20每次至少£2条件真实，不能说2026Oct同费未核即已免费无门槛。S18 FACES多地点/电话实际入口，digital无formalqualification可免费；19+低收入/means-tested其他课程与basicEnglish/assessment条件不默认中位收入都免费。S02有真实租户/志愿者数字教学案例，S12约40地点视频帮助是实际扩散渠道，课程存在不等所有居民已获得技能；测速自选样本不补全覆盖。

**条件60，40/80替代**：接受异年产出/当前渠道持续适配、实际多产业节点和通常数字取得。知识主来源集中、技能/资格及群体采用限制在缓解后仍重要，是档位假设；不是由缺更高许可数、没有AI或未搜Hallam产出封顶。若实际广泛采用/多知识来源使残余较小可80；真实断层主导可40；拒绝空间/持续/采用假设则null。

### OPT：具体铁路/身份/转移可用，共同节点仍存在

W02 [Northern Sheffield站](https://www.northernrailway.co.uk/stations/sheffield)有WiFi、stepfreeA级/lifts、railreplacement E5/E6接续；staffing MonSat04:20–midnight/Sun07:30与同页MonSun24h表述冲突，不能认全天每渠道有专员。W04 [N23原PDF](https://www.northernrailway.co.uk/sites/default/files/templates/N23/2026-05-17-to-2026-12-12-1775569706.pdf)May17–Dec12 2026双向HopeValley，正文EM/TP等运营标识支持实际交通；W03 [运营时刻入口](https://www.northernrailway.co.uk/travel/timetables)有Leeds/Doncaster接续和当前Sunday conductor availability警示，未标警示首发，不锁定Oct10同样中断。不同运营商共用轨道，不等独立物理备援；区外机场点仅几何，不评分为当前可用航班。Oct13实时departure不反填Oct10。

S23 **1Jan2026 CTA British/Irish**具体Ireland自由居住/工作等共用规则；不是全球任意迁居。S24 **9Mar2026 BOI GBP365 £20k/day、新收款人£1k/48h**及NI/GB telegraphic路径，不混ROI InterPay、不是所有Sheffield居民持该账户。S25 QROPS/适用25%海外转移税及非QROPS40%等条件，不能把养老金当即时免税现金。通常合法账户/证件设备、必要出行/迁移净负担可承担与办理条件延续是明确假设，无必要完整个人账单门槛。

**条件60，40/80替代**：多类通道可用，共同轨道/电网/电信与容量/税/时效残余仍重要。真实共同失效或资金/身份阻断主导可40，独立替代强可80；拒绝通常资源或当前连接推定则null。

## 31语义键覆盖台账

`partial`表示局部证据，`context`只是相关背景，`unresolved`是能力链未知；均不等完成全区测量。八维整体判断，不对子项等权机械平均。

| 维度 | 语义键                    | 状态       | 依据与最小边界                                                   |
| ---- | ------------------------- | ---------- | ---------------------------------------------------------------- |
| PCS  | `heat_humidity`           | context    | 旧热2日背景；没有当前全区暴露/冷却结果。                         |
| PCS  | `flood_sea_level`         | partial    | 2018/2023实际河洪防御、2020culverts；后续计划/范围及持续推定。   |
| PCS  | `geophysical`             | context    | PGA低旧代理，非设施抗灾结论。                                    |
| PCS  | `severe_weather_wildfire` | partial    | 区域storms实际支持/准备改善；非FUA火灾全险普测。                 |
| GSS  | `organized_violence`      | context    | ASB/hate住房分母不可全归组织暴力；覆盖未闭。                     |
| GSS  | `regional_conflict`       | unresolved | 相关区域情景/地方外溢缓解未知。                                  |
| GSS  | `strategic_exposure`      | unresolved | 重要节点名称不等威胁链，相关适配未知。                           |
| ISR  | `governance`              | partial    | 2026审计真实weakness/住房Board改善，VfM未完。                    |
| ISR  | `adaptive_capacity`       | partial    | 预算需求建模/储备压力与已交付节省、未来改革。                    |
| ISR  | `social_cohesion`         | partial    | 真实家暴/社区/BSL帮助与调查/投诉触达限制。                       |
| ISR  | `emergency_recovery`      | partial    | 真实社区恢复/租户维修和区域storm支持，代表性条件。               |
| RES  | `water`                   | partial    | 真实Sheffield工程/socialtariff、公司质量/中断与规划风险分母。    |
| RES  | `food`                    | partial    | 旧真实现金/食品支持和通常零售取得推定；新CRF未来交付不冒充实绩。 |
| RES  | `energy`                  | partial    | 区域支持/恢复真实，连续/普通负担假设，waterpower共因。           |
| RES  | `supply_chain`            | partial    | 现有水电/零售物流通常运行推定，无独立共同冲击备援保证。          |
| MED  | `access`                  | partial    | NHS通常居住规则和本区医院；等待/实际居民路径有限。               |
| MED  | `routine_quality`         | unresolved | 2022临床反证/改善+2025 AMU体验不足2026链。                       |
| MED  | `specialist_capacity`     | partial    | 两市真实内外科/急诊专科，规模不当疗效。                          |
| MED  | `system_continuity`       | partial    | 旧incident/升级/岗位改进与现在残余未知。                         |
| LON  | `translation`             | partial    | 真实Rotherham受试者MS回输，未标日期保留。                        |
| LON  | `trial_maturity`          | context    | Phase1安全/最多18计划；未取得成熟终点。                          |
| LON  | `regulatory_adoption`     | context    | 血癌概括/国家NICE委托不能扩为MS批准。                            |
| LON  | `resident_access`         | unresolved | 具体成熟干预当前通常付款/监护链未闭。                            |
| TEC  | `knowledge_output`        | partial    | 实际大学融资/研发，观察2023/24与2024报告。                       |
| TEC  | `industry_density`        | partial    | 本地多工厂/AMRC；125伙伴混区，不全本地。                         |
| TEC  | `digital_infrastructure`  | partial    | 冻结测速自选与library实际电脑/条件。                             |
| TEC  | `diffusion`               | partial    | 真实数字案例/服务+课程；资格/技能/规模仍有限。                   |
| OPT  | `transport_redundancy`    | partial    | 2026双向rail多运营商，共轨道/区域weather非独立。                 |
| OPT  | `legal_mobility`          | partial    | British CTA目的Ireland/具体资格，不全球任意。                    |
| OPT  | `asset_portability`       | partial    | GBP365/telegraphic及QROPS税/额度，普通账户假设。                 |
| OPT  | `network_continuity`      | partial    | 实际WiFi/数字/通信支持；水电电信共同依赖与未来计划。             |

## 原件、失败与冻结交接

25份有效原件（20新取得、5复用具体英国规则），逐一复算bytes/SHA256；不是25个独立机构/独立结论。原下载机制9条失败全部保留；另外原web年报403、算法JS、Healthwatch PDF timeout及Northern PDF截图无可见图块分别记录。Northern同curl机制station/timetable/N23三入口连续403后停止；既有web正文保留为W01–W04，**bytes/SHA=null，不冒充下载原件**。Healthwatch与rail PDF未目视；网站失败不是当地能力低分。审计最初SSL零bytes失败未覆盖，成功retry另名保存。

19张PDF页已实际目视：KPMG p4/16/28/31/32；YW p55/57/66/105/106；DPH p17；CQC p4/89/95/111；Senate p9；libraries p8；ISG p6/12。页码均按PDF物理页（这些亦印刷页）；图/表数字与文本核，其他页读文本不冒称目视。NIHR无日期/新CRF未完成、旧fee表过期、Council与供应商范围、旧医疗观察及原表冲突均保留。

原件清单如下；完整response/error/timestamps及全SHA在 `/private/tmp/cci-global/sheffield/source-manifest.json`，失败raw bytes在 `acquisition-manifest.json`；几何 `boundary-record.json`、冻结队列 `screen-context.json`、schema交接 `candidate-handoff.json`、图页 `visual-review.json`。不再扩搜补分。

| ID  | 原件/入口                                                                                                                                                                                                 |    bytes | SHA256                                                             | 时点与范围                                                                                             |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------: | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| S01 | [council-audit-index.html](https://www.sheffield.gov.uk/your-city-council/budgets-spending-funding/statement-accounts)                                                                                    |   163021 | `f0dd2cffb60d73ae39f8da29f47b753a3fcafa0a865c6419e272ee12a2a8372b` | 当前主管入口，审计与statement年份分开，网页无首发日期。                                                |
| S02 | [housing2025.html](https://haveyoursay.sheffield.gov.uk/year-in-review-a-look-back-at-2024-2025)                                                                                                          |   113501 | `9ca46f43e7a0321771b08dd4ae47138ed1522f21cc8421b5a2129da9002b5479` | FY24/25 Council租赁住房；页面更新7Sep2026，非全部FUA/全人口。                                          |
| S03 | [flood-current.html](https://www.sheffield.gov.uk/public-health/flooding/flood-protection-schemes)                                                                                                        |   168876 | `ea62419687577982fcbfe37c23e9a41f43339aca2e563009cf7f7f3aa14f6c9a` | 现网页历史完工2018/2020/2023及当前未来分项；未标更新时间，Oct13抓取规划不反推Oct10已知版本。           |
| S04 | [flood-don2023.html](https://www.sheffield.gov.uk/news/2023/first-phase-upper-don-flood-alleviation-scheme-complete)                                                                                      |   173561 | `1ab97b3f7752061dc01f058fb6019e106ba1b2d2be77b66e13f377ec7bcc14bc` | 17Oct2023 firstphase实际Loxley63homes/152businesses，历史LowerDon2017称谓与现页Jan2018并列。           |
| S05 | [yw-apr2025.pdf](https://www.yorkshirewater.com/media/o04ihtpd/47811_yw_apr_report_2025_digi_aw-1.pdf)                                                                                                    | 19918518 | `d7e0b6768b59370ccccc69e59f17b46bac0e7aec03acfb5e7908e7a2e0642891` | FY截至31Mar2025，质量/contacts为calendar2024，供应商全区不是4460；p105实际Sheffield干管工程。          |
| S06 | [dwi-events2024.html](https://www.dwi.gov.uk/what-we-do/annual-report/drinking-water-2024/drinking-water-2024-summary-of-the-chief-inspectors-report-for-drinking-water-in-england/water-quality-events/) |   195277 | `b0f46d0c49aab36c5579f967ff3788795c9514d75f93ffe5861aca99fe32e4a3` | DWI2024公司事件监管；Longwood未核4460且不移植本区事件。                                                |
| S07 | [cqc-provider.html](https://www.cqc.org.uk/provider/RHQ)                                                                                                                                                  |   173937 | `1e11671b97b3ad053bc5b701a78374a32bb4dddac94775f2d2f84f1fd27e46cc` | 当前发布入口含22Dec2022评级，不是2026新检查。                                                          |
| S08 | [cqc-reports.html](https://www.cqc.org.uk/provider/RHQ/reports)                                                                                                                                           |   250235 | `ddf5a5b78acae771b301b9f29cf14c9f36d806d2f71f8226a316787d3c576499` | 历史检查聚合入口，service/window需原PDF。                                                              |
| S09 | [cqc2022.pdf](https://api.cqc.org.uk/public/v1/reports/cdd4ac7a-fdb4-4827-afb3-7edebb3aa071?20221222100655=)                                                                                              |  1068669 | `0ab43a637a5deb616b450e5a32246935018e29d891a9160de71641c745a30fd8` | 22Dec2022发布，20–22Sep2022六核心跟进；旧病人记录/SSI/过程与现时点分开。                               |
| S10 | [amrc-impact2026.html](https://sheffield.ac.uk/research/features/growing-ambitions-amrc)                                                                                                                  |    91789 | `c5144611c06618e6b507c4f31046b3171ce4888d2480a986d92b021dd9bded2b` | 大学当前Growingambitions原文未标首发；机构本地/全国伙伴/未来项目分开。                                 |
| S11 | [university2024.pdf](https://sheffield.ac.uk/media/84381/download?attachment=)                                                                                                                            |   489981 | `00923fea74b76ac4c4c8de5162cab09b623dd8fb329a1105d5bb617f49dbe764` | 实际Senate11Dec2024校长报告，不是2025财报；2023/24大学portfolio融资。                                  |
| S12 | [poverty2024.pdf](https://health-wellbeing.sheffield.gov.uk/sites/default/files/16605160/2025-03/DPH%20report%202024%20-%20Ending%20poverty%20together_1.pdf)                                             |  1938888 | `db56e270db930c5d06b08a5bdca2bc56e78882d0e8091f5abe4de6ecb6fbd232` | 2024DPH年度报告，路径March2025；地方支持实际收效与受助计数，非全居民。                                 |
| S13 | [support-winter2025.html](https://www.sheffield.gov.uk/news/2025/support-available-sheffield-residents-winter)                                                                                            |   170928 | `c6c1553225a7272f2fac048f72f99c570e4ccf3c92cda8b217842643efa8ea9e` | 12Nov2025旧HSF支持政策/eligibility，2026由CRF替代，不当旧规则仍相同。                                  |
| S14 | [power-isg2025.pdf](https://isg.northernpowergrid.com/wp-content/uploads/2025/07/ISG-Annual-Report-2014-25_FINAL-rs.pdf)                                                                                  |  1681464 | `7d63763b1f447a19f9e53c1820a7a3841b2da7c2e923a5d27ba08b5234a31273` | 独立stakeholderJuly2025报告FY24/25，区域运行/改进及未来电信计划，非Sheffield断电率。                   |
| S15 | [council-audit2025-retry.pdf](https://www.sheffield.gov.uk/sites/default/files/2026-03/2024-2025-auditors-annual-report.pdf)                                                                              |   385252 | `bf349370af2dff9d0fd4e5b3bb0534d738db3f9f15ab6e20c85cc5abc8354948` | KPMG FY24/25审计，27Mar2026 qualifiedopinion；VfM未完成，实际重大weakness与未来改善分开。              |
| S16 | [car-ms-current.html](https://www.sheffieldbrc.nihr.ac.uk/news-events/first-sheffield-car-t-ms-patient-hails-best-birthday-gift-ever)                                                                     |   252942 | `2aef6d94bade46de695e7338e72845666712054b135db8757dbd5788e8ca148e` | NIHR地方研究第一人MS CAR-T；正文无publicationdate，Phase1最多18全球/4UKsites，截止前实施日期未完全闭。 |
| S17 | [libraries-fees2025.pdf](https://www.sheffield.gov.uk/sites/default/files/2025-05/sheffield_libraries_archives_information_fees_and_charges_2025_2026.pdf)                                                |   230382 | `5799d9c21b071f5160ab712cc971265a5b95880a0d9fc84c4a4954b1303f0325` | April2025–March2026费表，免费成员/visitor2.10/h/欠费条件；Oct10是否同费未核。                          |
| S18 | [digital-skills-current.html](https://lifelong-learning.sheffield.gov.uk/skills-life-and-work)                                                                                                            |    67607 | `a394124406c6c67e19f9be18bcc288844357f2d20f425a0e2b8f08cedc41ca15` | 当前FACES课程资格/地点/电话路径，未标首发与毕业采用结果。                                              |
| S19 | [support-crf2026.html](https://www.sheffield.gov.uk/news/2026/new-crisis-and-resilience-fund-provide-financial-support-sheffield-residents)                                                               |   174084 | `624fce10a785d1d9f76e9b40ece0102cbd39d5a79a374bce944a26c6e11a4b71` | 25Feb2026批准AprilCRF替HSF/3years£10mperyear；新基金未来效果不当已完成。                               |
| S20 | [rotherham-cqc.html](https://www.cqc.org.uk/location/RFRPA)                                                                                                                                               |   176165 | `2856435afb1d1fe94296745cbc7b18dfd338c71be3ab9002941d26d5f3288412` | 10June2022发布评级，29Sep2021所检查观察窗；本FUA但不代表2026恢复。                                     |
| S21 | [shared-nhs-ordinary-residence.html](https://www.nhs.uk/nhs-services/visiting-or-moving-to-england/moving-to-england-from-outside-the-european-economic-area-eea/)                                        |    32656 | `4efb26910573c7f60a7ab193ee4e3091526d3672ce5dd931413ab74c3fd26976` | 同国画像通常居住资格，可共用具体规则，24Oct2023审阅，NHS England不按国籍自动接诊。                     |
| S22 | [shared-cart-commissioning2026.pdf](https://www.england.nhs.uk/wp-content/uploads/2026/04/cart-service-specification-commissioning-guidance-v1.0-1.pdf)                                                   |   332621 | `ba97c929f2ca55b7da63a525aa8d0af00f962742e18f91e2b48afabda55da108` | NHS England April2026 v1.0，公费资格/MDT/毒性监护/费用规则，非MS已常规批准或本地已供资。               |
| S23 | [shared-cta2026.html](https://www.gov.uk/government/publications/common-travel-area-guidance/common-travel-area-guidance)                                                                                 |    99582 | `887d27e34913f9d5c239a651507b3b8c5024975798fff618211b5f2d00d0afc6` | 1Jan2026 CTA具体British/Irish自由居住/工作规则，目的地Ireland非任意全球。                              |
| S24 | [shared-bank-transfer-current.html](https://www.bankofireland.com/help-centre/faq/much-can-transfer-365-online/)                                                                                          |    61582 | `a12d06cd5b2f2ba7c8d487fe10c3d9e289055f42eb228698c6078f0362897688` | 9Mar2026 GBP365/NI-GB telegraphic真实规则，非所有居民持BOI账户，不能移植ROI InterPay。                 |
| S25 | [shared-pension-transfer.html](https://www.gov.uk/transferring-your-pension/transferring-to-an-overseas-pension-scheme)                                                                                   |    77116 | `acc30b14955ca0bbd05f5a521d08f4ce319bb94ea4a99ea2fcdade3ad9c2ff91` | QROPS及税条件不是任意养老金立即全额提取；通常资格与现金通道分开。                                      |

最小缺口集中在GSS相关威胁适配、MED近期主要单元质量/整改连续、LON成熟干预当前供资/监护。已知条件档的费用/通常取得/范围和持续假设拒绝时恢复null；不要求完美全户账单、同年全险普测，不把两轮未取得资料转成40。

## 根代理统一验收

2026-10-13。独立核25有效原件bytes／SHA、全9031目标几何及19近似参考点，目视KPMG物理p16／32及CQC2022物理p4。接受PCS／RES／TEC／OPT条件60、ISR40，GSS／MED／LON未知，域33—73，无中心。财政预测不当已发生超支、预算contingency不当全部储备；ISR40依实际适应／申诉余障及代表性和延续推定，60替代域36—76。旧临床整改不自动证明当前好或坏，试验回输不补成熟公费路径。
