# Fazeley eFUA 4193：两轮既有证据的有界交接

**当前候选 PCS/GSS/ISR/RES/MED/LON/TEC/OPT＝40/null/60/null/null/60/null/60。** 原权重15/15/15/10/15/10/10/10%，已知加权小计 **27**；未知权重50%，未闭范围 **27–77**。没有完整条件中心，不取中点、不重归一、不据优先探索名次宣称全球入围。

画像：2026普通British本国公民、长期通常居民、当地中位收入、通常NHS England保障；证据截止 **2026-10-10**，实际读取/恢复原入口 **2026-10-13**。沿用[共同rubric](cci-global-scoring-rubric.md)、[31语义](cci-global-indicator-contract.md)、[原权重](cci-research-model-v2.md)和[Coventry](cci-coventry-priority-review.md)/[Edinburgh](cci-edinburgh-priority-review.md)根纠偏。按[research技能](/Users/morris/.agents/skills/research/SKILL.md)作为已分派后台任务重接手；旧代理已完成两轮，本次仅读存量原件、共用原件及已知UHB精确href，没有新发现轮、扩搜、联系机构或再派代理。

**31语义键逐项记录，20 partial、6 context、5 unresolved；这不表示31项已经充分审阅或测量。** 本次RES、MED、TEC材料不足以完整判读，GSS区域/战略链未闭。partial可只是旧窗口或局部服务。保留未知不是判低；没有新增完美中位账单、全区质量普测或当年每节点压力测试门槛。

## 身份、9031几何与范围

本次重新完整读取9,031 GHS-FUA几何，原GPKG **9,932,800 bytes**，SHA256 `9934364827132232df67e8984768fb30865a846f5a786db999d49fc37fb7698d`，target WKB SHA `f8efd82fc4b5e2db8d85336bc876268383f8e04312561e8f30435c970264b003`。4193/Fazeley/GBR、**241 km²**、旧UC1828；2015模型人口126,023.82用于识别，非2026分母。原属性及逐点结果在 `/private/tmp/cci-global/fazeley/boundary-record.json`。

EPSG4326→ESRI54009、always_xy、对全9031 covers：Fazeley/Tamworth中心、Sir Robert Peel、Tamworth铁路站、Drayton Manor、Kingsbury、Quiss及Saint-Gobain分析者近似点均4193；Samuel Johnson/Good Hope/QE Birmingham/BHX/Hams Hall点3799，Queen's Burton4261。点不等设施全足迹、行政市全部、居民catchment或实际接诊。Tamworth核心到FUA的代表性为可撤回推定；区外医院可以是真实居民转诊路径，但不会登记成本区设施。Saint-Gobain/Drayton Manor/Hams Hall仅点背景，不凭名称补产业或供应链能力。

冻结[探索CSV](data/cci-research-priority/priority-all9031-v2.csv)4193行：PGA **0.0112173g**，新版UC4370旧热指标 **4天/年**；医疗机动 **1.17993分钟**/步行 **12.82041分钟**；自选测速fixed **322,412.82kbps**、mobile **148,713.02kbps**，11,717/717 tests不是联网居民数。旧UC1828和新版4370不混用。热是旧十年日最高UTCI>32°C年平均、参考岩石地震不含建筑，旅行不含资格/等待/费用/质量。UCDP匹配为0不等低组织暴力或战略安全。派生行原CSV5,064,733 bytes/SHA `036824ac48835ac7e2458ebb530c4e66754e0090b143c50953b8ed86c0575004`保存在screen-context.json，未新取气候/地震底表。

## 31项有限核读与缺口

| 维度 | 子项                      | 状态       | 现有证据与未闭连接                                     |
| ---- | ------------------------- | ---------- | ------------------------------------------------------ |
| PCS  | `heat_humidity`           | context    | 旧UC4天context；室内/劳动/持续热防护未核               |
| PCS  | `flood_sea_level`         | partial    | 既有河防、多区河/表水与2024/25高位；改进未成           |
| PCS  | `geophysical`             | context    | PGA参考岩石context，非建筑/全地质安全                  |
| PCS  | `severe_weather_wildfire` | context    | 地方应急指引/预警仅运行入口；风暴/野火实际结果未核     |
| GSS  | `organized_violence`      | partial    | 市报告明确酒店暴乱/响应及已交付凝聚项目                |
| GSS  | `regional_conflict`       | unresolved | 真实区域冲突/外溢及适配缓解未核                        |
| GSS  | `strategic_exposure`      | unresolved | 枢纽/物流/军事情景及影响归因未闭                       |
| ISR  | `governance`              | partial    | 2024/25实际面谈/电话/问责；住房不合规自报              |
| ISR  | `adaptive_capacity`       | partial    | £200k HOME Hub与维修/服务实际；分配不当全部完成        |
| ISR  | `social_cohesion`         | partial    | 酒店暴乱反证、Honest Conversations交付/45机构资助      |
| ISR  | `emergency_recovery`      | partial    | 对酒店暴乱实际快速回应；全灾恢复时长未核               |
| RES  | `water`                   | unresolved | 两个挑战壳，无有效供区运行/末梢原表                    |
| RES  | `food`                    | partial    | 实际£182862食物、转介三日包/不配送；无全群体分母       |
| RES  | `energy`                  | unresolved | 未有实际供区运行/中断/修复材料；EV不替能源可靠性       |
| RES  | `supply_chain`            | context    | 铁路/地方产业点context；来源/库存/替代未闭             |
| MED  | `access`                  | partial    | NHS通常住资格，既有当地社区接诊；等待/普通转诊延续推定 |
| MED  | `routine_quality`         | partial    | 2021 IPC实际观察且未重评级，2015/19社区RI保留          |
| MED  | `specialist_capacity`     | partial    | QE区外实际CAR-T，旧Burton服务，不证明全部必要专科      |
| MED  | `system_continuity`       | partial    | 2021 IPC指挥/跨院流程和问题；2026延续未闭              |
| LON  | `translation`             | partial    | 疾病限定实际Tamworth人体/当前同中心给药，不是健康延寿  |
| LON  | `trial_maturity`          | partial    | FELIX1B/2非随机单臂，112入/94回输；ITT偏差             |
| LON  | `regulatory_adoption`     | partial    | NICE Dec11 2025正式采用/26+及供资，许可18+分开         |
| LON  | `resident_access`         | partial    | 通常住委托/监护+当前外区中心，合资格当地取得推定       |
| TEC  | `knowledge_output`        | unresolved | Quiss服务宣传/个案摘要不闭持续可核知识产出             |
| TEC  | `industry_density`        | partial    | 一Tamworth IT服务企业活动，不作统一科技密度/多节点     |
| TEC  | `digital_infrastructure`  | context    | 自选测速context，公共网站运行不测未联网者/资费         |
| TEC  | `diffusion`               | partial    | 市实际服务台/网站、Quiss外区客户案例摘要，范围受限     |
| OPT  | `transport_redundancy`    | partial    | 实际本地站/公交出租；未核路线容量及独立共因备援        |
| OPT  | `legal_mobility`          | partial    | British CTA居住工作，家庭/禁入等条件保留               |
| OPT  | `asset_portability`       | partial    | GBP365/NI-GB转账及QROPS税；不当全国总上限              |
| OPT  | `network_continuity`      | context    | 通常网络延续可撤回推定；测速不证明断网备援             |

## PCS：既有防护与残余洪水须一起读

S14历史表（文件名2019、原URL目录2024不能改观察期）p1目视：2015 LFRMS曾认Tamworth为Staffordshire表水风险第三、**920 properties at risk**，是旧风险表，不是2026损失或全FUA家庭率。Castle大部河洪区且已有Fazeley–Bitterscote左岸及Lichfield Street/A51右岸堤墙；Mercian也有既有防护，多个其他ward表列None不等“无任何排水”。表水ponding/小水道未入Flood Zones及reservoir inundation等残余保留，旧事件为1992/1995，不造近年来淹户数。

S03明确2024/25高河位，2026Jan拟12周约86钻孔、方案仍very early，不能把公告/调查写成完成新防洪。S04有EA警报/县道路排水报告与prepared入口，同时**不给公众家用sandbags**；业主负责不等没有公共措施，指引不等独立恢复实绩。

**条件40，60可辩替代**：接受既有防护延续、行政核心暴露对普通FUA居民代表性，但多区危险和仍初期改进表示重要未缓解缺口。若既有防护实际有效、普通暴露主要已缓解且剩余局部，则60；拒绝地域/延续或残余重要性推定则null。不是由缺热死亡/全建筑验收而扣20，也不以低热/PGA填80。其他强天气/野火只有context，完整多危险评价尚有限。

## GSS：地方酒店暴乱不能闭区域/战略维

S02 p13目视真实酒店寻求庇护者遭暴乱及市快速回应；p8分开确认**commissioning and delivery** Honest Conversations，而非只未来意向。它支持局部组织暴力及缓解，不给全FUA暴力率；报告对LGA 2024 peer challenge为市方转述，同源不算独立第二佐证。

**主null**：按Edinburgh/Coventry根纠偏，区域冲突/外溢和战略威胁影响/缓解没有闭合；国家背景、设施点、一般交通风险不能补整维60。没有忽略真实地方暴力，也不将取证失败当40。未来补具体区域/战略链后才可判40/60，JSON alternatives=[]。

## ISR：真实执行与住房/群体反证

S02 June2025报告观察2024/25：29新council homes/总4300是住房交付/存量，45组织grants是机构数；**£165k allocated**众筹不能全当已发，£200k HOME Hub及其“significant return”无效益数值。p10实际>71k电话、91%平均handling、95%新reception满意、>21,150维修电话/约12,800 jobs不同分母；>95%complaint acknowledgement、>99%FOI/SAR响应是过程，不是投诉全部解决。p13社会住房不合规主动self-referral和initial progress同时保留，没有核到全面整改完结；未来财政压力不写现破产。

**条件60**：主要制度服务实际工作、暴乱回应与凝聚项目真交付；住房合规/财政/少数群体信任残余仍重要。若这些残余在缓解后主导通常服务可40；若实际广泛触达与恢复充分，可80。拒绝核心代表性或截止延续，则null；不凭council自述效益创造全人口成功率。

## RES：食品实际帮助，水和能源仍未知

S05实际 **March2025–March2026 £182,862 food distributed**是价值，不是去重受益家庭、份数或中位食品负担；页面UK贫困比例等国家背景不移植本区贫困率。S11需要agency voucher，三日应急食物/饮食讨论/后续咨询，明确**不配送**；多转介机构与电话是真缓解，也有限时/出行/资格残余。食品援助需求不等普通中位居民普遍挨饿。

水务两个取得文件是915/916-byte JS挑战壳，即使HTTP200也不是原件；没有末梢质量、供区足迹或实际备用给水。能源缺实际运行/停电/恢复，8EV hubs和市车队电化不替代供电可靠性；铁路与Hams Hall点也不能填关键库存/替代。**主null**，普通净负担允许必要推定，但本轮水/能源及供应替代仍不能辨60/40；网站失败不是低分或透明度缺陷。最小待补是适配当地供区的真实水/能源运行与缓解链，不要再找更多企业logo。

## MED：旧检查原范围，当前质量链未闭

S13 CQC当前provider页显示overall Good、publication **16June2021**；成人community/end-of-life **31March2015 RI**，urgent **6June2019 RI**，inpatient **22Oct2020 Good**各自独立。页面仍列不说明2026重新测量或RI已修好，也不能凭旧RI认2026整个维失效。

S16 PDF检查 **19–21April2021**，p2明确focused IPC、**inspected but not rated**；因增加需求未访ICU/aerosol区。访RoyalDerby、Queen'sBurton多个ward与本地SirRobertPeel Andrews ward；六套电子patient notes样本不是全区结局。p3真实dashboard/GoldSilverBronze及跨院协作，浴室存设备缺行动/风险评估反证保留。March2021 commode94.6%、PPEtraining98%为具体过程，不替2026死亡/感染率。

S17通常NHS资格取决于ordinary residence，非国籍/缴税/GP登记本身；处方/牙科等贡献仍可有。允许通常公费净负担及必要转诊推定；区外QE真正专科交付支持有限专科路径。**主null**：本轮没有可信的广泛常规质量/连续性到2026连接，不因没有全人口普测才null。旧IPC和旧RI不能直接填40或60；最小缺口为对应服务当前改善/延续/普通接诊连续性，JSON alternatives=[]。

## LON：疾病转化、人体偏差、当前同中心公费路径

[S22 UHB](https://www.uhb.nhs.uk/news-and-events/news/first-patient-in-birmingham-treated-with-newly-approved-therapy-for-aggressive-blood-cancer/?source=research-news)发布 **23March2026**：QE已给Shrewsbury28岁患者常规NHS obe-cel；此前四名试验受治者包括Tamworth39岁Iain McDonalds、**Nov2022**回输并持续缓解。区外QE点3799不是本区机构；真实既有Tamworth患者加同中心当前采用支持有限居民转诊连接。院方77%/3.5y宣传概括不替人体原队列表，也不证明健康人寿命延长。

S08正式NICE TA1116 **11Dec2025** PDF p4/12–14目视：许可18+成人复发/难治B-cell precursor ALL与NHS建议 **26+**不同；须commercial arrangement，最适合者90日内供资。UHB正文称November2025 NHS采用，和NICE正式Dec11日期保留为不同来源称谓，不静默倒移正式发布时间。

FELIX单臂非随机open-label phase1B/2；cohort2A **112 enrolled/94 infused**，不能将94回输者当112全部获益。p13 mITT中位EFS **9.03months**，以首次回输起算、SCT/新疗法删失，OS中位confidential；p14 EAG偏好1A+2A enrolled ITT（133），包括采细胞后未回输者及桥接/制造 **4–6周**造成偏差，January2025数据更新适于决策并非随机比较。S12 p8委员会资料真实黑块删节，不补xx、不从院方宣传反推红删数据。没有把供资仅在回输后支付trust误作患者自费未回输制造全价。

S21 NHS England现成委托原件p4/5目视：ordinary England residents，NICE条件、local MDT→national panels、JACIE/制造许可和毒性管理、critical care/rapid re-admission，28日/100日/长期毒性监护及交通住宿支持。是服务要求，不假称每个流程现场验收；S22当前同中心实施补实际采用。p12目视原表obe-cel **£372,00**缺位与NICE p6 **£372,000 per infusion**、discount confidential分开保留；前者不能当新低价或中位家庭账单。委托泛称one-time infusions与院方eligible two doses10天间隔不强行改成同一个计数单位；本轮不推导疗程费用。

**条件60、40敏感替代**：可信疾病转化和同中心真实当前公费给药、普通资格/监护存在；接受合资格26+当地普通居民可按现有跨区临床转诊通常取得、必要交通住宿净负担通常可承担及截止延续，不能把所有普通居民默认患病/合格。制造等待/桥接和窄适应证仍重要，不能给80。若真实当前制造/资格/费用有显著断点可40；拒绝上述地域/取得/费用延续连接则null，不要求再有完美中位账单或2026Tamworth每户给药证明。

## TEC：局部IT与公共采用，持续知识链仍有限

S06/S10 Quiss真实Tamworth地址，页面100+staff、86%CSAT、36年等无分母/窗口，不作当地统一密度、研究产出或居民质量。Hamlins/BatesWells/Attwaters IT/数字转录案例摘要是外地客户应用，不把客户全归4193；DigitalAcademy/cloud/NetworkOperations等服务栏目不等每项目已交付。S02三新公共网站与service desk >70%first-time-fix是实际市服务采用，18m社会媒体views不等去重市民或技能普及。

**主null**：已有局部产业和扩散，知识产出/产业连接的持续可核链仍缺；自选测速不能补未联网者/资费/广泛扩散。不是因为缺论文榜/AI或每节点压力测试而降档。最小缺口是已有本地节点的实际持续知识/产业输出及群体采用适配，取得后可辨40/60/80；不为完整性填60。

## OPT：通常通道可用，费用/网络连接是推定

S15 NationalRail实际Tamworth站有bus/taxi、工作人员/HelpPoints，公共WiFi **unavailable**，页面列step-free categoryA同时告警1↔4及1↔3 lifts故障；保留真实无障碍反证，不能只抄“all platforms”。告警没有明确首发，截止适配为版本推定；未核具体2026班次/票价/容量/共同洪水下替代。外区BHX近似点不证明已运行本地空铁接续，铁路入口及普通路面bus/taxi构成有限多模式，非独立备用已实测。

S18 **Jan1 2026** CTA British公民Ireland居留/工作、证件/禁入/家属条件保留，不移植EU自由流动。S19银行 **Mar9 2026** GBP365合计 **£20k/day**，newpayee **£1k/day至48h**，可提前添加/咨询；大款NI/GB telegraphic而ROI InterPay不搬来英国。普通账户、审核、币种/目的国资格和手续费仍要适配；单银行不是全民现有账户或全国法律总上限。S20 QROPS及25%/非QROPS至少40%等税条件是养老金资产特有，不认所有现金受同税。

**条件60**：接受普通持证、公民CTA资格、合法常规账户设备、通常地面接续/必要迁移预算可承担及通常网络延续；公共服务/企业网络与测速只支持有限普通连接背景，不能证明危机国际不断网。容量、lift故障、电力/洪水共因、转账时效/养老金条件重要。若实际阻断普通退出可40，独立替代及残余小可80；拒绝预算/网络/版本连接则null。未凭一个机场、CTA法条或高网速填全维。

## 算术与停止

`40*.15+60*.15+60*.10+60*.10=27`；GSS15%、RES10%、MED15%、TEC10%未知，**27–77是完整未知取0–100的范围，不是置信区间或分数估计**。PCS60加3、ISR40减3、LON40/OPT40各减2。若未来四未知都60，中心57；不能在当前填这些值。拒绝任一必要推定，对应分数恢复null并扩大原权重范围。

两轮已收口；本次只恢复旧已知UHB原入口一次（旧研究站redirect失败仍保留）。同机制3次失败停止，UHDB已有三次TLS失败没有再次追取；water200挑战、403和零bytes原记录不删除。不因错误页判能力/透明度差。7失败条逐一保留、16旧有效原件bytes/SHA重新匹配、5共用原件复制/核旧SHA、1已知href恢复原件。全部22有效原件与14目视图、同源分组、派生记录在source-manifest.json；旧23 acquisition entries备份source-manifest-before-finalize.json。

只改本MD和私有tmp；无共享案例/脚本/UI更改、提交或部署。记录31键是未知覆盖清单，不宣称RES/MED/TEC全维证据审阅完成。仅本MD Prettier；不跑与文档无关的全站build/check。最小缺口已逐维列出；缺口保留，交根代理统一校准。

## 原件与失败清单

实际取回/复核日2026-10-13；22有效不等22独立证据。当前未标更新的网页须接受截止版本延续，版权年不是公开日。PDF目视：NICE p4/12/13/14、committee p8、CQC p2/3、city p8/10/13、flood p1、委托p4/5/12。日期/窗口/源身份依上文；URL与SHA如下。

| ID/原件                                                                                                                                                                                                 | bytes   | SHA256                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------ |
| S01 [city-performance.html](https://www.tamworth.gov.uk/council/how-council-run/how-council-performing)                                                                                                 | 40269   | `4a32d43212dce52267941dbb795d9a1969c836ca53d4798caa353520fa70bee3` |
| S02 [city-achievements2025.pdf](https://www.tamworth.gov.uk/sites/default/files/misc_docs/Tamworth-Borough-Council-Achievements-Report-2024-25.pdf)                                                     | 629018  | `0169c175ef38637f2cff5847704a1ceddfb0c17201a62a1da245d0f7c2926707` |
| S03 [flood-investigations.html](https://community.tamworth.gov.uk/flood-investigations)                                                                                                                 | 29436   | `dc73fc5323052c7e894a88bb3262c9ce2557cc33bca840357f57984e3ac01d56` |
| S04 [flooding-current.html](https://www.tamworth.gov.uk/environment/natural-environment/flooding)                                                                                                       | 31624   | `997394eeaafb521f53e8fc78cfe26ba13ae1d43f6dea832b66caad49ec867d06` |
| S05 [foodbank-current.html](https://tamworth.foodbank.org.uk/)                                                                                                                                          | 51260   | `baf610538a39b75689b403674eb80a3f3b02c508de5b61790c615d6932c2da4d` |
| S06 [quiss-current.html](https://www.quiss.co.uk/)                                                                                                                                                      | 166359  | `da85814a3da6e9e21d1595b32ca66078ecfaef59708403ecd9141f507adee270` |
| S07 [nice-ta1116.html](https://www.nice.org.uk/guidance/ta1116)                                                                                                                                         | 18953   | `3720ea97cdfc4ed8777d92c0c0503daa93bddaab44b7874fcd4b62479ddf12ef` |
| S08 [nice-ta1116.pdf](https://www.nice.org.uk/guidance/ta1116/resources/obecabtagene-autoleucel-for-treating-relapsed-or-refractory-bcell-precursor-acute-lymphoblastic-leukaemia-pdf-2973530453903557) | 258153  | `4321f953f22110170d3b68ae8040f89aa74900915e7e5c7755d7fa0a53838f63` |
| S09 [nice-ta1116-evidence.html](https://www.nice.org.uk/guidance/ta1116/evidence)                                                                                                                       | 14758   | `bd1f1eef71c071e070d3f0b3bea848282f0efaa1601a4c30014920147e434be3` |
| S10 [quiss-cases.html](https://www.quiss.co.uk/case-studies/)                                                                                                                                           | 125159  | `7a5cc0d2d8cf8a01fadae13c218dcdd16064cd3c72888d53cc220b44fb7ac2a6` |
| S11 [foodbank-help.html](https://tamworth.foodbank.org.uk/get-help/how-to-get-help/)                                                                                                                    | 50929   | `51fcb84acebdffe483e553e30437af12b558c2cdb8a83fa2711f5fb18bc974af` |
| S12 [nice-ta1116-final-evidence.pdf](https://www.nice.org.uk/guidance/ta1116/evidence/final-draft-guidance-committee-papers-pdf-15543596702)                                                            | 3328636 | `cf0d4e7f808921cf72739c6817dcfa17865eafc59e4ad61ff07cc99ac85dbd09` |
| S13 [cqc-provider.html](https://www.cqc.org.uk/provider/RTG?referer=widget3)                                                                                                                            | 168260  | `bcf3302bc49e8492f315e96683ed6f30737d423f2c351f4cda6ffa55d388ae64` |
| S14 [flood-defences2019.pdf](https://www.sstaffs.gov.uk/sites/default/files/2024-07/appendix_d5_summary_of_flood_risk_in_tamworth_borough.pdf)                                                          | 158349  | `c5fc28f5651e58d681ccb5f422c673aea3821105237ca1d8d5442fc239b27c5b` |
| S15 [rail-current.html](https://www.nationalrail.co.uk/stations/tamworth/)                                                                                                                              | 326760  | `0d0c01fe882bb3ecd658abb1e9565b0b6f8f0b36a5b4e15b8dda14ede3f3a8e6` |
| S16 [cqc-inspection2021.pdf](https://api.cqc.org.uk/public/v1/reports/c884b735-a135-456f-8c2d-8e0621a4a2a8?20210616065514)                                                                              | 255876  | `6882ef79065915647b9dfa5466867831491ba3eee1d3bda6c6537691d141b50d` |
| S17 [shared-nhs-ordinary-residence.html](https://www.nhs.uk/nhs-services/visiting-or-moving-to-england/moving-to-england-from-outside-the-european-economic-area-eea/)                                  | 32656   | `4efb26910573c7f60a7ab193ee4e3091526d3672ce5dd931413ab74c3fd26976` |
| S18 [shared-cta2026.html](https://www.gov.uk/government/publications/common-travel-area-guidance/common-travel-area-guidance)                                                                           | 99582   | `887d27e34913f9d5c239a651507b3b8c5024975798fff618211b5f2d00d0afc6` |
| S19 [shared-bank-transfer-current.html](https://www.bankofireland.com/help-centre/faq/much-can-transfer-365-online/)                                                                                    | 61582   | `a12d06cd5b2f2ba7c8d487fe10c3d9e289055f42eb228698c6078f0362897688` |
| S20 [shared-pension-transfer.html](https://www.gov.uk/transferring-your-pension/transferring-to-an-overseas-pension-scheme)                                                                             | 77116   | `acc30b14955ca0bbd05f5a521d08f4ce319bb94ea4a99ea2fcdade3ad9c2ff91` |
| S21 [shared-cart-commissioning2026.pdf](https://www.england.nhs.uk/wp-content/uploads/2026/04/cart-service-specification-commissioning-guidance-v1.0-1.pdf)                                             | 332621  | `ba97c929f2ca55b7da63a525aa8d0af00f962742e18f91e2b48afabda55da108` |
| S22 [uhb-obecel-restored2026.html](https://www.uhb.nhs.uk/news-and-events/news/first-patient-in-birmingham-treated-with-newly-approved-therapy-for-aggressive-blood-cancer/?source=research-news)       | 48852   | `c158d2c4d1954edf8843d0f2c954ced31158cf228b38a00a0974400df611c059` |

| 失败原入口                                                                                                                                                 | 状态/原诊断                                                                                                                                                                                               | 失败response bytes/SHA                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [water-apr2025.pdf](https://www.south-staffs-water.co.uk/media/fc3bwn4l/annual-performance-report-2024-25.pdf)                                             | 200 https://www.south-staffs-water.co.uk/media/fc3bwn4l/annual-performance-report-2024-25.pdf; exit0;                                                                                                     | 916 / 41bbd169752c71e94c80c04ebf77cb0f6534c0bf801a621959b32923dceba904（非原件）  |
| [uhdb-reports.html](https://www.uhdb.nhs.uk/trust-reports)                                                                                                 | 000 https://www.uhdb.nhs.uk/trust-reports; exit56; curl: (56) LibreSSL SSL_read: LibreSSL/3.3.6: error:06FFF064:digital envelope routines:CRYPTO_internal:bad decrypt, errno 0                            | 0 / null（非原件）                                                                |
| [uhdb-service-scope.html](https://www.uhdb.nhs.uk/our-purpose-vision-and-values)                                                                           | 000 https://www.uhdb.nhs.uk/our-purpose-vision-and-values; exit56; curl: (56) LibreSSL SSL_read: LibreSSL/3.3.6: error:06FFF064:digital envelope routines:CRYPTO_internal:bad decrypt, errno 0            | 0 / null（非原件）                                                                |
| [city-q4-2026.pdf](https://tamworth.moderngov.co.uk/documents/s44451/Appendix%201%20-%20Quarter%204%20202526%20Performance%20Report.pdf)                   | 403 https://tamworth.moderngov.co.uk/documents/s44451/Appendix%201%20-%20Quarter%204%20202526%20Performance%20Report.pdf; exit0;                                                                          | 5738 / 171e08f731c3fd7709441edd0f0cdf385dd502fb40765ba7f10b8354d76d9953（非原件） |
| [uhb-obecel-actual2026.html](https://www.research.uhb.nhs.uk/first-patient-in-birmingham-treated-with-newly-approved-therapy-for-aggressive-blood-cancer/) | 302 https://www.research.uhb.nhs.uk/404; exit47; curl: (47) Maximum (50) redirects followed                                                                                                               | 0 / null（非原件）                                                                |
| [local-hospital-current.html](https://www.uhdb.nhs.uk/about-sir-robert-peel-community-hospital)                                                            | 000 https://www.uhdb.nhs.uk/about-sir-robert-peel-community-hospital; exit56; curl: (56) LibreSSL SSL_read: LibreSSL/3.3.6: error:06FFF064:digital envelope routines:CRYPTO_internal:bad decrypt, errno 0 | 0 / null（非原件）                                                                |
| [water-publications.html](https://south-staffs-water.co.uk/publications/publication-categories?category=Annual)                                            | 200 https://south-staffs-water.co.uk/publications/publication-categories?category=Annual; exit0; HTTP200 915-byte JavaScript challenge shell, not publication body                                        | 915 / bfba6864a4d4422ed0643a9b929ef954920f7df17d910a7ab2193746fb297f34（非原件）  |

## 根代理统一验收

2026-10-13：独立核22份有效原响应bytes/SHA、完整9031目标几何及15个近似参考点，重新读已恢复UHB当前常规给药正文，目视NICE入组／回输与制造偏差及市暴乱回应。接受PCS40、ISR／LON／OPT条件60，GSS／RES／MED／TEC未知，域27—77，无中心。真实Tamworth旧人体路径加同中心当前NHS采用支持有限居民取得推定；不是全居民延寿、当前当地常规医疗质量或完整科技能力。31键覆盖清单不等31项充分测量；旧失败和价格／日期冲突全部保留。

## GSS共同门槛澄清

当前GSS继续未知，分值和其他七维不变。旧文要求补“实际区域／战略影响”的措辞不应解释为先发生战争或成功攻击才可评分；需要补的是有范围的风险／影响观察、相关情景与本地或真实共享服务已运行能力的匹配及残余解释。国家预测、普通设施或一般交通扰动不够，但明确适配的现役保护允许同层条件判断。此澄清没有取得新的城市能力证据，不能据此自动填60。详见[40份冻结输入的同尺度审查](cci-gss-comparability-review.md)。
