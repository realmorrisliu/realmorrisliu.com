# Coventry eFUA 4328：八维有界审阅

**建议 PCS/GSS/ISR/RES/MED/LON/TEC/OPT＝60/null/60/60/40/null/60/60。** 原权重已知加权小计 **42**；GSS15%与LON10%未知，范围 **42–67**，没有完整条件中心，不取中点、不重新归一、不宣称全球入围。31项均审阅：**24 partial、5 context、2 unresolved**，状态不等于测量充分或子项得分。MED60和TEC80等是有明确前提的替代；拒绝地域、通常资格/负担、版本/延续等必要连接，相应维度可撤回null。

画像2026普通British公民、通常长期居民、当地中位收入和通常NHS England保障，证据截止 **2026-10-10**，本轮实际查阅/新原件取回 **2026-10-13**。沿用[共同rubric](cci-global-scoring-rubric.md)、[原权重](cci-research-model-v2.md)、[31项语义](cci-global-indicator-contract.md)及[Grimsby](cci-grimsby-priority-review.md)、[Leicester](cci-leicester-priority-review.md)、[Copenhagen](cci-copenhagen-priority-review.md)/[London LON](cci-london-lon-comparability-review.md)同层判断。按[research技能](/Users/morris/.agents/skills/research/SKILL.md)作为已分派后台研究完成，没有再派代理、联系机构、修改共享文件/旧案例或提交。

本次研究工作宽度由五主场景前20扩大至40，只用于[公开全量探索](cci-unassessed-priority-screening.md)的工作安排。Coventry在冻结表排除已审/已交接者后被安排，不是预测CCI高分、CCI32阈值或“优先入围”。低热/PGA、短模型医疗旅行、快自选测速不能填八维。两轮定向发现后已收口，随后仅读已定位原件/链接及核表；未知最多有限原入口检查，不反复追同页。允许同层明确可撤回的通常取得、净负担和延续推定，不新增完美中位账单、全区质量普测或每节点当年极端测试硬门槛。

## 完整身份、范围与时间

本轮完整读取 **9,031** GHS几何，复算原9,932,800 bytes及SHA256 `9934364827132232df67e8984768fb30865a846f5a786db999d49fc37fb7698d`，来源复用[原候选provenance](data/cci-global-candidates-r2019a.provenance.json)。4328/Coventry/GBR，面积 **556 km²**，旧UC1834，2015模型人口 **583,972.03**只用于识别，非2026居民分母。ESRI:54009 bounds `[-123000,6110000,-97000,6146000]`，目标WKB SHA `68d9c58c5a016a5c5ff4fdfcd2b3b0c0fcf2430b9952eec711cda562fdf921f0`。原字段和全点结果在`/private/tmp/cci-global/coventry/boundary-record.json`。

EPSG4326→ESRI54009、`always_xy`、对全9031 `intersects` 的**分析者近似点**：Coventry centre、UHCW Walsgrave、Warwick Gibbet Hill/WMG、Coventry University、Coventry机场、George Eliot Hospital Nuneaton、中心市场、Allesley/Sowe参考均4328；Hospital St Cross/Rugby centre **4817**，Leamington **4294**，Birmingham Airport/Queen Elizabeth **3799**。不是官方精测、冻结机场目录点、院/厂/机场全足迹、病例居住或历史治疗地/服务区域。外区实际服务可以是普通居民替代，但不能算本区设施或凭名字/短模型旅行证明已接诊/独立备援。

Coventry行政市、UHCW trust（含Rugby）、Coventry and Warwickshire ICB、Science Park多个园区、Severn Trent水系及NGED West Midlands电网均不全等于4328。**Nuneaton不能按行政外名自动排除；Rugby不能因同trust名字全纳。** 文中核心/区域到普通FUA居民的代表性属于明示可撤回推定。医院外地患者、企业外区客户、行政市比例或公用供区人口不移植为全FUA率。

[冻结全9031探索CSV](data/cci-research-priority/priority-all9031-v2.csv)的4328行：GEM参考岩石PGA **0.0103517g**；相交新版UCDB中心4558/4814/5039最大热指标 **5天/年**；医疗机动 **0.8930分钟**、步行 **9.3409分钟**。热为旧ERA5/C3S十年日最高UTCI>32°C年平均的中心指标，不是2026全区热死亡/湿球实测；PGA不含场地/建筑，旅行不含等待/费用/质量。旧UC1834与新版中心ID不混用；派生行身份/bytes/SHA在`screen-context.json`，本轮不是新下载原气候或地震底表，只用PCS方向context。

原响应在截止后取回，仅认证本次bytes；未标首发的当前网页/报告不能借版权2026或URL年度证明截止前公开。S01实际 **Apr2024–Mar2025**，PDF创建 **2025Nov17**非公开日；S14实际FY2024/25、URLApr2026非观察日；CQC **观察2024/2025、发布2025/2026**分开，最新2026妇科也不是所有科已在2026重测。接受原文明确截止前观察/更新及合理版本延续，拒绝则相关能力未知。

## 全31项状态

| 维度/子项                                   | 状态       | 支持、反证与必要连接                                          |
| ------------------------------------------- | ---------- | ------------------------------------------------------------- |
| PCS 热湿 / `heat_humidity`                  | context    | 旧UCDB热5days背景，非2026健康效应                             |
| PCS 洪水/海平面 / `flood_sea_level`         | partial    | S02实际已成SuDS；内陆不能推表水零险                           |
| PCS 地质 / `geophysical`                    | context    | 参考岩石PGA.01035g背景，非建筑验收                            |
| PCS 强天气/野火 / `severe_weather_wildfire` | partial    | S01保温/现场运行，W03真实故障恢复；野火单独效果未核           |
| GSS 组织暴力 / `organized_violence`         | partial    | W01/W02真实刀抢/枪击/剥削及回应，混区数量保留                 |
| GSS 区域冲突 / `regional_conflict`          | context    | 国家/西Midlands背景，未闭真实地区冲突外溢                     |
| GSS 战略暴露 / `strategic_exposure`         | unresolved | 通道/工厂存在与一般公交扰动不能证明战略威胁链                 |
| ISR 治理 / `governance`                     | partial    | S01年度执行/审查/£1.8munderspend，未来赤字非现破产            |
| ISR 适应能力 / `adaptive_capacity`          | partial    | S01实际协作/住房1161预防及节省73%未目标                       |
| ISR 社会凝聚 / `social_cohesion`            | partial    | 低收入/数字等真触达与限领/未申领，非全体信任率                |
| ISR 应急恢复 / `emergency_recovery`         | partial    | 社区/公用恢复有实绩；无全部危机恢复普测                       |
| RES 水 / `water`                            | partial    | S03–05供区风险/现有处理与监管，不造末梢合格率                 |
| RES 食物 / `food`                           | partial    | S01实际5155food户、S06限领/部分开放；非全民食品篮             |
| RES 能源 / `energy`                         | partial    | W03 WestMidlandsCI/CML/HV恢复；S01能源支持/17节费及贫困       |
| RES 供应链 / `supply_chain`                 | partial    | 本地网络/道路实际运行；共同电力/水处理/外部零售依赖           |
| MED 可及性 / `access`                       | partial    | S16合法通常住NHS，与GP/国籍/税不同                            |
| MED 常规质量 / `routine_quality`            | partial    | S09/S12 sepsis/NEWS/IPC等过程和问题，不当全区死亡             |
| MED 专科 / `specialist_capacity`            | partial    | S07/S11真实临床多科/肾移植服务，不由床位分数                  |
| MED 连续性 / `system_continuity`            | partial    | S08/10待床/出院/alternative时段及S13妇科独立改善              |
| LON 转化 / `translation`                    | partial    | W09旧自体cell服务线索，当前真实实施未闭                       |
| LON 试验成熟度 / `trial_maturity`           | context    | 人体成熟有国家/旧机构背景，非当前当地trial结果                |
| LON 监管采用 / `regulatory_adoption`        | context    | S20正式委托/监护仅context，不等本区实际采用                   |
| LON 居民获得 / `resident_access`            | unresolved | 当前具体疗法通常付款/监护与真实得到未闭                       |
| TEC 知识 / `knowledge_output`               | partial    | W07实际制造工具知识；W08研究原年度非排行                      |
| TEC 产业 / `industry_density`               | partial    | S14多个本地/外区企业单元分开，S15大学工厂模式                 |
| TEC 数字 / `digital_infrastructure`         | partial    | S01fullfibre95.7%/4G95.73%为覆盖，非订户                      |
| TEC 扩散 / `diffusion`                      | partial    | 653781sessions/4100devices/509居民课程实际，16%至少一项低信心 |
| OPT 交通 / `transport_redundancy`           | partial    | 本地rail2023/24旅次+W04–06真实BHX外部/公交铁路接续            |
| OPT 法律迁移 / `legal_mobility`             | partial    | S17 CTA具体British国籍/限制；不是全部EU迁居                   |
| OPT 资产 / `asset_portability`              | partial    | S19 £20k日/£1k新payee48h，S18 pension tax单独                 |
| OPT 网络 / `network_continuity`             | partial    | 普通覆盖/设备及能源故障恢复有限推定，非国际独立备援           |

## PCS：低背景与实际局部保护共同支持有限60

S02当前Council原页面说明Earlsdon Liveable Neighbourhood整体工程已成，包含20mph/46roads、过街/交通/植栽和 **SuDS**。真实更新 **2025Jul1**及 **2024Sep**分项：地下公用设施调查曾令工程暂缓，中央隔离SuDS已成待植栽、Spencer Park等现场调整。公示“allworkcomplete”及道路安全审核不是每处洪水已测效果，过街/速度项目也不能全当防洪。不是未来Hillfields拟Oct2026完工景观被算已成。

S01 p58–59目视：城市>100,000住宅EPC belowC估计及年报引用 **22.2% fuel poverty**背景，原段未给该贫困估计精确统计年，非2026新调查。SHDF Wave2 April2023开始，**Mar2025 >1,500户完成、>1,800开工**，>2,000到Sep2025是当时目标，未核现已全部交付。保温、门窗、通风真实改善居住条件，不能把节费/保温直接转换为热浪死亡降低；热岛/室内热湿仍有条件。低PGA/旧热天数仅context，未说无地质/野火风险。W03地区实际故障/恢复支持强天气响应但排除异常严重天气的性能值不是压力下全性能。

**条件60**接受已成核心排水/住房措施和普通避险/公用恢复合理适配、持续有效，主要低暴露背景与保护组合可用；仍保留表水/城市热岛、强天气共因与未成项目。**40**若关键暴露与保护缺口在缓解后仍主导；**80**需要同层可信多危险防护/低暴露和冗余解释，不靠低PGA填80。拒绝范围/通常可达/有效性延续则null。2026气候韧性计划入口超时，仅目录摘录表明规划/预期风险，不当实际措施完成或居民安全结果。

## GSS：本地组织暴力闭合，区域/战略链未闭，null

W01 Police第一方 **2026Aug15**回顾Jan–Jun **Coventry+Solihull** Guardian Eastern Taskforce **115部署、87逮捕、68武器、439 stop/search**。不能写全为Coventry/4328或武器对应68唯一罪犯/已定罪；Far Gosford Street刀抢后的迅速查获是本地实际事件及回应，Chelmsley Wood属于另一个地点不移成本区。W02 Operation Authentic原文将 **2025** Gosford/Burges暴力与剥削、September枪响后Section34市中心/FarGosford/Hillfields驱散措施、巡逻/保障被帮派剥削者共同记录。真实枪击/剥削影响和已实施缓解支持organized_violence，逮捕/巡逻并不证明无受害或全部已纠正。

**主null**：当前没有另外闭合 **regional_conflict/strategic_exposure** 的适配实际威胁—通常居民/关键节点后果—实施缓解后残余链。国家Severe、West Midlands背景不能替代地方影响；厂/机场存在、普通公交扰动/治安或枪支武器数不能直接当战略暴露。遵守Dublin/Tampere及Edinburgh根验收的同一撤回尺度，不把组织暴力一个子项补整个GSS60。也不从未取到判40/低安全。下一最小证是具体区域外溢/战略威胁与当地后果/缓解的原记录，停止扩搜；JSON null的`conditionalAlternatives=[]`，未来40/60/80取决于真正连接。

## ISR：现实交付、群体触达与财政残余

S01是行政市实际FY2024/25执行报告，不由国家制度或奖项填分。物理/印刷p34目视 **13,398 individual households**经申请获支持，**5,155 food**、**10,788 energy**、604能源/水相关用品、3,432衣物、471其它不同类别可重叠，不能合计为不同居民或补“每人收到一次”。約44%申请户只一次、24%多于三次是必要复杂性，非全居民依赖救济。识别并autoenrol **772**符合free schoolmeals未获者，£90k补发housing-costs已实现、未来£350k/yr潜在家庭节省不能写全部已到账；Cheylesmore厨房升级资金及“will host”课程不算已上全部课程。特别群体、自动/手动服务与原电话/线下方式支持触达，仍有未申领/复杂处境。

p26目视无家预防/relieved **1,161案件** vs上年1,164、target>1,250；成人照顾服务满意 **67.1%**为服务使用者调查，非全居民信任/治理满意率。carer满意FY24/25未给不能填33.2%旧值。儿童social-care重复转介 **18.6%**与返care **4.5%**均比旧值改善；在care688children/85.5per10k为Mar2025，用人群不同于全居民。儿童低收入 **28.4%（20,404）**为2023/24 provisional，不当2026所得中位或全部儿童实际获帮扶。

p68目视FY24/25 **£1.8m underspend**，vs旧£1.8m overspend；节省目标仅 **73%=£22.18m/£30.38m**，未来年度赤字不是目前破产。数值自报和target不是独立全部行政质量。公共数字渠道实际570,077 transactions与设备/居民培训显示适应和多组织触达，不能用数字化排除线下。区域电力故障回应/赔付是真恢复与补偿结果（W03），不当本市所有危机恢复实战。

**条件60**接受主要制度/服务能交付、通常群体可触达且行政核心实绩对FUA合理适配，财政/住房/特殊群体等残余仍重要。**40**若上述在缓解后实质阻断必要服务、**80**若多组织恢复/普遍触达强且残余较小；当前不因资料缺完美全人群survey封顶。拒绝代表性/通常取得/延续则null，不把CQC临床问题机械重复作为全市政治治理扣分。

## RES：真实援助与恢复，水末端安全仍是必要推定

S03 DWI **2024Jan31 SVT2023-00011 v1**，2023Nov9运营者报告Whitacre水厂及Coventry/Nuneaton **SEV15/14**显著潜在风险；hazard是 **algae and supplyoutput restrictions**。现有处理优化、最终出水每周/原水每月监测和catchment/风险复评是要求，并非本轮已取得的实测样表或执行完结。Dissolved Air Floatation/pumping方案 **2026Mar31**审查、2027设计、2028开工、2030投运为期限/未来工程，不算已备援；notice(d)不供水限制 **Not applicable**不等水质保证100%。

S04 Homesford Lead同日v1涉及Coventry/Nuneaton等多个外区及系统，不把水厂点在外区或列多地而自动排除/全纳。维持既有处理、监测/风险复评与陶瓷超滤 **2025Dec31 review、2026Dec31 design、2027Dec31 commence、2030Mar31 commissioned**不同；到期限不等已实现。报告“is or hasbeen risk”不当2026当地每户铅超标、不能推病例，也不能把监管升级目标当风险已解除。

S05 **2024Nov1 v2** PFAS正式undertaking，July3 2024提交；Secretary of State当时满意公司正在履行适当步骤，并要求采样/风险评估/年度报告、必要工程后12月增强监测至2031。是实际受监管/合规行动判断，不是具体2026末梢合格率。Annex Coventry那些**>20%来自GreenLane BPS/MountNod BPS/Strensham WTW**的区域列人口 **13,549 / 原文“16,6434” / 391,170**。已查原HTML，确实`<p>16,6434</p>`，非脚注上标4被抽取合并；不静默改成16,643或166,434、不相加成FUA受影响/患病人口、>20%是水源份额不是20%居民污染。原年度风险/承诺与未来完成期不构成所有当前水已危险或已治愈。

食品不是只有未来储备：S01 **5,155户实际food-network支持**及HAF **约5,580 eligible children/youngpeople**全年服务、Christmas2,114是季节子集，不相加不同去重人群；≈三分一SEND限定受益群。食物援助不等全民食品篮或中位家庭必须领取。S06食品银行当前原响应15distributioncentres、**3 parcels/6months**限制，原文 **“During September26 …slowly returningto fullservice; checktheCentreisopen”**；不是已全部开放。web同URL缓存显示14centres、未带限领段落，保留版本差别，不能择较有利者填一套无条件完整服务。2025impact主体视频未下载/观看，不从标题虚构多少kg/餐/独立市民。运营主体为Feed The Hungry UK，食品只可在centres领取，Halo中央办公室不是领取点。

W03运营者 **FY2024/25 WestMidlands**表现：CI **46.31** vs47.9目标（每100连接客户中断次数，可重复，不是46.31%去重户断电）；CML **34.18min** vs29.5（较目标+18.4%），HV故障Target60 **89.33%**一小时恢复，不扩大到全部LV/24h/严重风暴。常规12h（单次≥5,000premises用24h）标准成功 **99.73%**、严重天气 **7,161 payments**是实际给付而非7,161独立受害家庭。网络性能按≥3min、含普通坏天气/故障与50%计划中断，**排除exceptional events includingsevereweather**；标题仍写2023/24而表24/25，本轮保留表观察窗和例外，不把常规指标当暴风全过程。原NGED集团2025报告描述其它区域风暴、US National Grid150k风灾源明确不适配Coventry，未用于本区。

S01 p58–59实际 **17homes**电池/time-of-use试验降低账单、>1,500住房保温完成、energy-support10,788户和地方districtheat运行说明帮助/供给真实。**22.2%燃料贫困是年报引述、未给精确基准年/净负担法**，非2026中位家庭账单。£30m资金/2,500未来支持不是全部住户改好，公有Heatline能量/市政总量不是普通居民净电费。正常食物零售/受监管水/能源共同通道和道路物流支持通常供给，食品受助与能源/水/通信共因仍重要；没有用机场旅次替代粮食吨位/库存天数。

**条件60、40重要替代**：同Grimsby允许现有地方/区域运行及监管到通常末端、普通零售与必要负担可承担的明示推定；已比Leicester单纯水骨架/货运背景多取得明确Coventry/Nuneaton监管适配及真实food-network交付。**仍未得到当前本区末梢分层样表**，不能称已测“通常安全”。水处理/监测合理延续、受监管日常供给对普通中位居民可靠是较弱的**必要可撤回假设**；若不能接受，即RESnull，不因其它三项丰富而硬填60。实际水风险/限领/能源贫困在帮助后主导可40，不要求多数居民已患病；并非缺完美账单而判低。80需要可信当前替代/通常负担及共因缓解，当前未主张已满足。

## MED：实质临床约束支持40，改善和通常保障也真实

S16可共用NHS England正式通常居住规则：多数服务对ordinaryresident免费；通常居住不由国籍、缴税/NI、GP登记、NHS号码或房产单独决定。本文英国公民长期通常居住画像可适配，仍需证明合法properlysettled、必要转诊和治疗适应证；不是只有公民或注册就全部无等待/所有药牙眼免费。一般保障可支持通常必要净负担推定，但不是医疗质量实绩。

S07/S11当前CQC机构是 **Clifford Bridge Road Walsgrave**，近似点4328。常规医学 **2024Sep25–26**不预告查15wards，审16patientrecords、15patients、41staff/6meetings；药师另外2patients/3nurses/3pharmacists、5peoplecare records、10pieces equipment，可与前者重叠，不相加样本N。选取检查不是随机全FUA居民，oncology/haematology/stroke/oldercare等真实已接诊；S07手术 **2024Sep25–26及2025Mar11**15records/12patients/5relatives/50staff，真实高质量/证据治疗与backlog改善同读，不从1,064床/26theatres或overallGood换算。

S12常规医科safe原文：NEWS2 **Feb–Jul2024 >96%**、IPC审核combined **97.7%或以上**为过程/selectedareas非感染/死亡率。脓毒症individual-risk审计 **Jun/Jul/Aug2024 48%/75%/76%**未收到改进actionplan；“SepsisSeptember” **>150staff培训**是真实施，不等复测已达目标。存在医药储存/MAU药片落地和出院跨服务连续性问题，也有准确NEWS2、患者溝通、boarding风险评估、薬师核对/出院检查与安全药品设施的真缓解。不是整个15ward所有过程同样差，公开异常不能默认无害。

S08急诊成人及儿童ED **两次**检查，初次2天/49staff、24patients、3relatives、19wholeorpartialnotes、6meetings；四周后1天/6partialnotes和重复职工，可重叠不凑25 unique完整记录。Sep2024与约四周后观测，报告Aug15 2025发布；不是2025Aug实际入院窗。CQC描述候诊区有不满意照护、长等结果并非总正面、crowding/系统转出床位限制，**5法律breaches**（safe care/staffing/premises/dignity/person-centred）是具体实质反证，不仅`Requires improvement`评级。

S10等待 **July2024全ED >22% spend12h** 与 **等待入ward者52% >12h**分母不同；不是52%全ED。**Jul–Sep ED <4h** 50.3/48.3/50.4%，与含UTC/minorinjury整个urgentdirectorate **66.1%**不同，后段“nationalaverage”措辞与trust-level上下文混杂，不能当两个同N数。比较England75%、recovery78%和nationalstandard95%也有目标/比较单位，不等比例差都是死亡风险。现场Sep25 14:15最长5人在ED **20–21h**待床；Sep26 14:00最长5人 **21–25h、其中4待床**，是选最长、非平均或10不同患者。个案18h候诊/24h转床不造全院平均。**Aug2024 ambulance80%≤30min**是该流程实际表现，需救命者直接进ED；24hflowcoordinator、尽早在ED开始可以做的治疗、non-emergencyredirect确已运行，但部分替代服务不是24h，不能把导流存在视为所有急症及时可替代。

S09过程：小儿suspectedsepsis **Aug2024 1/4未screen而未antibiotics，75%**，June/July100%各N未报，不能写75%小儿被害或大队列。成人 **每月50records**，**June94%/July92%/August90%**，正文说对应 **3/4/7patients**；前两一致，**August90% of50应为5缺口，7/50则86%通过**，原未说明不同指标/分母。**保留50、90%、7未解冲突，不能择高比例或静默改7。** 成人training100%与小儿77%为另培训分母，非都及时给药。抽8files NEWS2/PEWS算分准确，而ED没有regularNEWS2/PEWSaudit、Sep点时prevalence平均每5h记一次，与头4h至少每小时引导不同；不把“8正确”推总体适时。还有疑心梗者描述ECG迟>2h、CQC引用应10min，不能将患者单例成心梗整体发生率，亦不能默认无人受影响。药aspirin个案后判断non-cardiac，不将此误作确诊心梗漏药死亡。

**较新的改善也计入：** S13正确LAP02128/overall发布 **2026Jul28**为妇科独立inspection，原摘要Gynaecology段updated **2025Oct15**并同页publishedJul28 2026，实际评估日期未据该两日期擅定。19staff/6complete records为摘要方法；新整体说明护理/学习/设备/药物良好、mostly staff enough/响应及时，**1Reg18(2)(a)training breach**仍在。最新whole-hospitalGood由该科与其他旧ratings聚合，不能以2026妇科结果关闭2024急诊/常规问题；不从不同“3–5breaches”数机械跨科加减。

**主40、60实质替代**：通常公费和必要本地交付/部分良好质量成立，但重要等待、sepsis/预警与转出连续性在所见已实施缓解后仍明显，可符合整维必要照护约束。不是说所有医院/大多数中位患者均无好医；Nuneaton另一院参考点同4328且Rugby外部elective服务有潜在选择，但存在/overallGood不证明急症及时可替代。接受主要枢纽约束及2025发布到截止的合理延续；若有效导流/流程/现实替代和2026改进足以减残余，可**60**，不要求完美所有科压力普测才能选60。若不接受旧具体问题仍代表通常目标居民/当前交付，则**null**，不把来源旧/未取新report自动当已修或一直坏；80当前无强主张。

## LON：成熟疾病路径允许，但当前实施/普通取得未闭

不是只搜lecanemab或健康人抗衰。W09 **2020招聘包原站indexedexcerpt**称Level3 haematology为Coventry/Warwickshire实行autologousstemcell，配day/outpatient/住院路径；其原PDF全文403未取得、没有近期具体给药/结局/监护/付款窗。2001/02官方旧报告搜索返回14BoneMarrowTransplantFCE，是很早的episode，未把它下成2026actual患者，也不作本轮当前评分。S11 2024实际检查haematology/oncology有人接诊，但不证明所选cell疗法已经输注；常规良好治疗不自动奖LON。

S20 NHS England正式 **CAR-T commissioning**原件复用：网站Apr2026与封面 **12Nov2025Version3**、内含Dec2025TA更新不同，原国家已核的疾病适应证、publicpayment和监护条件可共用。没有把CAR-T条款施加到autologousHSCT所有方案，也没有从外区Birmingham QE存在/距离就写Coventry居民已取得。厂/大学细胞研发或牌照不等人体/监管采用，不能拿区域startup数补LON。真实成熟疾病限定再生/cell路线若连上人类实施、通常付款/持续监护，也可以同London/Prague/Copenhagen取60，不要求只能geneedited/抗AD/健康人延寿。

**主null**：最近本地实际实施或普通居民真实外区取得、具体方案适应证/费用及监护连续取得连接未闭，**不是因基本NHS不付、未取完美合同/中位账单或缺当年冲击试验**。没有证据判“全部不可得”或40；国法/一般NHS/很旧部门宣称也不足硬填60。最小待补是当前真实实施+明确居民路径，若这类链已成立且成熟/可负担可60；若经缓解仍有重要付款/生产/等待断点可40。两轮后停止；`conditionalAlternatives=[]`是nullschema要求，文字40/60是未来辨别条件。

## TEC：实际制造知识、企业与居民采用，60/80需解释残余

W07 WMG第一方案例原文：SIMPLE由大学/技术/制造组织协同，**正在3制造组织部署**数据工具，不是仅论文/园区存在；TopOriental虽然Birmingham business名，但原文明确 **Coventry facility**，已做leanproduction/ERP实施，**£50k/month export为smoothEUexport条件估计**而非既成交。案例日期混合/有2017起始项目，不能把今日爬取当2026全新产出或把所有partner厂都归4328。W08大学年度截至 **2025Jul31**，科研/innovation真实多年份活动可context；4,328founders等五年地区数不当4328都市当年density。原PDFraw429但web文本可读，本轮截图工具未返回可见像素，**不宣称已目视该PDF，也未用其关键数字表填分**。

S14 FY24/25原PDF p2/3/4/6/8/9实际目视：SciencePark **161tenants**（概称>160）、**704businesses engaged，其中190 substantive support**、**£6.66m finance=£986k grant/debt+£5.674m equity**、160jobs/152events/5271attendees为不同单位，不是160家当地新创或5,271去重居民。多个centres包括Warwick/外区BlytheValley，不能全并4328。**本地VentureCentre94% occupancy**及Coventry BIC真实3newtenants/2expansions/14renewals；CEMEX在Binley新培训设施 **已经举办多个training sessions**，不是只大厂名字/拟建计划。Vanguard27kft²预计Autumn2026及2035 ProjectMADE £44bn/50kjobs/£1.6bn设想不算现成。S15 Coventry University实际AME大学嵌入工厂模式支持另一知识/工业节点；不是用院校名气/排名或项目预算加分。

S01 p68/69/72目视：行政市 **Dec2024 fullfibre95.7%、gigabit97.2%**，99.8%可取得≥10Mbit/s down/1up，95.73%premises室内四运营商4G，均覆盖/可用而非已订购/设备/账单。真实 **653,781 PC/WiFisessions**、**570,077selfservicetransactions**非去重居民；**509居民/1,389digitalcourses**不同单位、313digital events/2365attendees可能重复。**4100devices→150多机构**是设备/中介组织，非4100不同家庭。current技能champions实际140、将offer700更多为将来。2024/25adultsurvey **16%至少四题中一题Notconfidentatall**，不是16%没有互联网/不具所有技能；原报告承认单数不能测复杂数字排斥。迁移/老年/无家等帮助真实，但样本和时点不覆盖全部FUA或证明帮助后所有人已好。

**条件60，80明确可辩**：持续多节点知识/工业应用及实际公共采用支持强能力，技能/设备和早期扩散残余在帮助后仍重要是60的必要解释；不能只缺更高许可/论文数或没有AI而封顶。若上述广泛采用/设备和帮助实绩已经有效使残余较小，可**80**，不新增每节点极端故障独立验证门槛。**40**需实质工业/扩散断点，而非单个未来项目未成；否定当地范围/产出延续/普通接入代表性則null。16%survey不能机械扣20，aid数量不能自动消除残余。

## OPT：地方实际接续、全国资格与真实手续

S01本地4rail stations **2023/24近7.5m passengerjourneys、83% of2019/20**是实绩，不是2026新测或7.5m居民；交通财务挑战和有补助保留原服务基本水平同读。Coventry机场参考点4328不等有商业国际航班，本轮未给其routes数量/未来batteryfactory当交通备援。

W04第一方BHX（外区3799）**2025实际13,654,108旅次/90,516flights**、新Grenoble/Suceava/Salzburg路线及多目的地可用，普通居民接续适用要凭路径：W06 **X1 Coventry–BHX–Birmingham**、现场cash/contactless、family/group票和W05BirminghamInternational rail/免费AirRail **03:30–00:30**；不是24h所有人无费用。铁路页面CrossCountry分组下还列Euston viaNorthampton等，分组归属有疑义，不擅校正为精确现运营商/timetable；只采用明确站际和模式连接。HS2道路工程/共同机场AirRail节点/区域电力限制同读，多个mode不自动独立共同失效备援；近距离模型不能证明压力时有位可买。

S17 British公民CTA可居住/工作Ireland、特定附带权利，但家属/禁入/驱逐/国际禁令及资源不能默认符合；不是英国人仍有EU全面自由迁移。S19原银行lastupdated **2026Mar9** GBP365通常 **£20k/day**合跨domestic/international，新payee **£1k upto48h**、可预添加/咨询对应NI/GB telegraphic办理；**ROI InterPay不当英国途径**，不是法律禁止全部资产携出或人人持BOI。合法资金/接收国/币种/审核/费用适配，S18 QROPS养老金税/规则另列，不能推全部现金/房产无税可瞬移。

普通国内连接/设备与公共帮助支持有限网络延续推定，但没有核到每户独立国际网络；普通数字覆盖不等国际不中断，能源/设备/合法账户依赖仍有共因。**条件60**接受普通持证、公费/收入画像有常规接续/必要迁移预算、合格合法账户设备，正常通道通常可操作且延续；不是仅机场量+CTA填分。共因/手续实质妨碍可**40**，现实独立替代与通常资金/网络强可**80**；拒绝普通资源/网络延续假设则null。

## 全维算术、相邻档和撤回

原权重PCS/GSS/ISR/RES/MED/LON/TEC/OPT **15/15/15/10/15/10/10/10%**；已知`60*.15+60*.15+60*.10+40*.15+60*.10+60*.10=42`，未知权重25%，完整未知范围 **42–67**不是置信区间。全八维当前**不可复算完整中心**；31状态完整不代表31测量完整。未来GSS60+LON60则中心57；若另MED60则60；TEC80替代加2。未来二未知都40则52；没有因排队较前而预填这些分。PCS/ISR40各减3、RES/TEC/OPT40各减2，必要连接拒绝则对应恢复unknown及原权重范围。

当前最小改变证据：GSS具体区域/战略威胁与影响/缓解；LON当前真实疾病转化实施及居民付款/监护；RES当下适配Coventry/Nuneaton末梢与监管闭环/普通负担；MED已见安全/等待/转出问题的有效改善/现实替代。后两并非新增必须完美普测才能评分条件，已给可撤回方向。**两轮结束，不为资料量继续搜相同规划/公司规模/更多同源摘要。**

## 有效原响应、同源复用

缓存根`/private/tmp/cci-global/coventry/`，`.headers`/`.meta.json`保留响应/错误，原bodybytes/SHA逐一重算；txt/PNG/工具笔记不是原件。S16–20为**同源复用**，原retrievedAt保持原时刻、reviewedOn才是本轮；全国资格/产品规则可共用，地方服务不可继承。CQC多页一个assessment、DWI同水系统多个风险、园区与大学相关报告不算独立研究者多次证明。有效但冗余CQC press只在manifest排除集合，不拿“Good”作为整个MED结果。

| 原来源URL/缓存                                                                                                                                                         | 发布/观察/实际范围                                                                                                                     | 原取回UTC/bytes                                    | 原SHA256                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------ |
| S01 [council-performance2025.pdf](https://www.coventry.gov.uk/downloads/file/46064/one-coventry-plan-annual-performance-report-202425)                                 | 观察April2024–March2025；PDF创建Nov17 2025非首公开证明；行政Coventry不是全4328。；出版/更新 精确日未核                                 | 2026-10-13T06:57:00.070637+00:00；20,738,499 bytes | `8e39cc5166093eb2d424e53b713d23d659b86307d7782ded8de3b9060b1ac5fc` |
| S02 [flood-earlsdon-current.html](https://www.coventry.gov.uk/roads-highways-pavements/earlsdon-liveable-neighbourhood-1)                                              | 实际July1 2025更新及2024分项已成SuDS/道路；当前未标首发，完成与植栽计划分开。；出版/更新 精确日未核                                    | 2026-10-13T07:00:01.570320+00:00；46,529 bytes     | `b0e2737afe1d33f1e33c79562165becc7e564f539f8ab15b363f6cd23c74c34b` |
| S03 [water-whitacre-notice2024.html](https://www.dwi.gov.uk/water-companies/improvement-programmes/severn-trent-water-improvement-programmes/svt-2023-00011/)          | DWI SVT2023-00011 v1，Coventry/Nuneaton；实际2023Nov9风险报告，2026–2030改进期限不是已投运。；出版/更新 2024-01-31                     | 2026-10-13T07:00:00.651543+00:00；67,453 bytes     | `094ba8ecfc4f3042b65d271d7991bf4b26175ff15c05132f6977d414b51f4e34` |
| S04 [water-lead-notice2024.html](https://www.dwi.gov.uk/water-companies/improvement-programmes/severn-trent-water-improvement-programmes/svt-2023-00012/)              | DWI Homesford lead v1，Coventry/Nuneaton与多个外区；报告风险/受监管现有处理，非当前全居民超标。；出版/更新 2024-01-31                  | 2026-10-13T07:00:00.651891+00:00；68,906 bytes     | `cd6189e1bca407cc52ef0af3e65649a88e843fb59c051a4f42f8a246dd86bdd7` |
| S05 [water-pfas-notice2024.html](https://www.dwi.gov.uk/water-companies/improvement-programmes/severn-trent-water-improvement-programmes/svt-2023-00014/)              | DWI PFAS undertaking v2：July3 2024给承诺，Annex供水份额/人口与16,6434原HTML疑值；非暴露病人。；出版/更新 2024-11-01                   | 2026-10-13T07:00:00.652081+00:00；76,616 bytes     | `62e3bc1a52d50b0ef92fe08714aed4846b412bbe843cb45123474e37163ac49e` |
| S06 [food-impact2025.html](https://coventry.foodbank.org.uk/your-impact-in-2025/)                                                                                      | 2025impact视频入口未下载媒体；原响应当前15centres/3parcels6months/September26限服务；web缓存14centres冲突。；出版/更新 精确日未核      | 2026-10-13T07:00:00.654663+00:00；52,761 bytes     | `48fa8552887d456593669057e7d571220a7322d49d162c5fa943ad104cd75b03` |
| S07 [cqc-summary2026.html](https://www.cqc.org.uk/location/RKB01/inspection-summary)                                                                                   | 汇集不同年代/服务；最新gynaecology，旧ED/医疗2025发布，aggregateGood不能当全院无问题。；出版/更新 2026-07-28                           | 2026-10-13T07:02:21.328263+00:00；215,992 bytes    | `12bf68f31e96c50d5c64820902763f1cc0195a3e63db5ab6e16115fc101c3ed0` |
| S08 [cqc-ed2025.html](https://www.cqc.org.uk/location/RKB01/reports/LAP-01960/urgent-and-emergency-services)                                                           | LAP01960 adult/childrenED两次检查，重点等待/压力；具体2024窗口/抽样见原文。；出版/更新 2025-08-15                                      | 2026-10-13T07:03:50.233169+00:00；166,554 bytes    | `e8d48e25ee886c7da122e0d0b351f90efbdd83cc78cfe7929228c7528293c1e3` |
| S09 [cqc-ed-safe2025.html](https://www.cqc.org.uk/location/RKB01/reports/LAP-01960/urgent-and-emergency-services/safe)                                                 | 急诊真实sepsis/NEWS2/ECG/safeguarding与实施缓解；每月50/90%/7人冲突保留。；出版/更新 2025-08-15                                        | 2026-10-13T07:04:43.273478+00:00；201,483 bytes    | `e8233466f24c0f03ce48537c442c565e0cb1e1e6a031965d09c78f25ecff755c` |
| S10 [cqc-ed-responsive2025.html](https://www.cqc.org.uk/location/RKB01/reports/LAP-01960/urgent-and-emergency-services/responsive)                                     | July–Sep2024等待；ED与wholeurgentdirectorate不同分母；少数现场个案不是居民率。；出版/更新 2025-08-15                                   | 2026-10-13T07:04:43.275025+00:00；177,425 bytes    | `f911387ac03086357316c825ffd1bbd73c2e859e610ad758f055575a085a7f47` |
| S11 [cqc-medical2025.html](https://www.cqc.org.uk/location/RKB01/reports/LAP-01960/medical-care-including-older-people-s-care)                                         | Sep25–26 2024查15wards，16记录/15患者/41staff，药学另5 records可重叠。；出版/更新 2025-08-15                                           | 2026-10-13T07:03:50.233444+00:00；164,691 bytes    | `5c94b49c25f0c8ddc873a9fca0fa142c798d8978dd05275f965c563bcacb17a0` |
| S12 [cqc-medical-safe2025.html](https://www.cqc.org.uk/location/RKB01/reports/LAP-01960/medical-care-including-older-people-s-care/safe)                               | 常规医疗真实sepsis48/75/76%、NEWS>96%、IPC97.7及配药/出院问题；过程不当死亡率。；出版/更新 2025-08-15                                  | 2026-10-13T07:04:43.276534+00:00；201,788 bytes    | `38c1e4b88cf34ab5ccf23204cd605d63f23787ace0228137e20e28b160a6afb2` |
| S13 [cqc-gyn-correct2026.html](https://www.cqc.org.uk/location/RKB01/reports/LAP-02128/overall)                                                                        | LAP02128/overall最新妇科良好与1trainingbreach，不能闭合旧ED问题；摘要Oct15 2025更新与Jul28 2026publication不同。；出版/更新 2026-07-28 | 2026-10-13T07:04:43.276841+00:00；162,737 bytes    | `3db5eced89e00b24e0a7bedbad6397b5b88b0e0041636b0dc608480e55f1e9a4` |
| S14 [sciencepark-impact2025.pdf](https://www.warwicksciencepark.co.uk/wp-content/uploads/2026/04/UWSP_impact_report_2024-25.pdf)                                       | FY2024/25原报告，URLApril2026不当观察日；园区多个本地/外区centres不全4328，实际支持/financing/培训。；出版/更新 精确日未核             | 2026-10-13T06:57:00.070929+00:00；7,313,441 bytes  | `ed3eec9b489c8c4b7ac2459a4fc14ce83b1d194e1dabb2e45d4d87db224f4060` |
| S15 [covuni-made2026.html](https://www.coventry.ac.uk/news/2026/project-made/)                                                                                         | AME university-within-factory实际模式；£44bn/50kjobs/£1.6bn至2035为设想非本地已产出。；出版/更新 2026-05-27                            | 2026-10-13T06:57:01.478171+00:00；62,099 bytes     | `041606eabea137698e0081c5546b337da14e35628f40f4566a207b3067e43ab8` |
| S16 [shared-nhs-ordinary-residence.html](https://www.nhs.uk/nhs-services/visiting-or-moving-to-england/moving-to-england-from-outside-the-european-economic-area-eea/) | NHS England通常居住资格，reviewedOct24 2023/nextreviewOct24 2026；与国籍/税/GP登记不同。；出版/更新 精确日未核                         | 2026-10-13T04:31:14.732347+00:00；32,656 bytes     | `4efb26910573c7f60a7ab193ee4e3091526d3672ce5dd931413ab74c3fd26976` |
| S17 [shared-cta2026.html](https://www.gov.uk/government/publications/common-travel-area-guidance/common-travel-area-guidance)                                          | 共用British公民CTA，Jan1 2026是更新，不是权利始于该日；亲属/限制和资源条件保留。；出版/更新 2026-01-01                                 | 2026-10-13T04:55:41.678621+00:00；99,582 bytes     | `887d27e34913f9d5c239a651507b3b8c5024975798fff618211b5f2d00d0afc6` |
| S18 [shared-pension-transfer.html](https://www.gov.uk/transferring-your-pension/transferring-to-an-overseas-pension-scheme)                                            | 共用QROPS/养老金税务，不等现金转账额度/全资产不可携。；出版/更新 精确日未核                                                            | 2026-10-13T04:55:41.680123+00:00；77,116 bytes     | `acc30b14955ca0bbd05f5a521d08f4ce319bb94ea4a99ea2fcdade3ad9c2ff91` |
| S19 [shared-bank-transfer-current.html](https://www.bankofireland.com/help-centre/faq/much-can-transfer-365-online/)                                                   | BOI真实GBP365/NI-GB telegraphic路径，新收款人48h；非英国法总上限或全民已有该账户。；出版/更新 2026-03-09                               | 2026-10-13T05:57:59.991392+00:00；61,582 bytes     | `a12d06cd5b2f2ba7c8d487fe10c3d9e289055f42eb228698c6078f0362897688` |
| S20 [shared-cart-commissioning2026.pdf](https://www.england.nhs.uk/wp-content/uploads/2026/04/cart-service-specification-commissioning-guidance-v1.0-1.pdf)            | 共用NHS England正式委托，URL2026Apr/封面Nov12 2025v3含Dec2025TA；仅制度/监护context，不证明Coventry已输注。；出版/更新 精确日未核      | 2026-10-13T04:24:23.969404+00:00；332,621 bytes    | `ba97c929f2ca55b7da63a525aa8d0af00f962742e18f91e2b48afabda55da108` |

## Web-only及明确indexed excerpt

下面来源为原责任机构网页可读，或明确旧原站索引摘录；两者身份在scope分开。原bytes/SHA未知，不用`web-read-notes.json`或`cov_*web-transcript.json`的辅助hash冒充HTTP原件。没有下载媒体绕过呈现限制，也没有浏览器解码存档被当原PDF。原站403/WAF与web工具缓存正文可并存，缓存/日期差别保留。

| 原URL                                                                                                                                                                                                                      | 实际正文/索引范围/时间                                                                                                                                | 查阅/原bytes            | 原SHA/身份 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------- |
| W01 [原站正文/明确索引摘录](https://www.westmidlands.police.uk/news/west-midlands/news/news/2026/august/guardian-taskforce-achieve-excellent-results-across-coventry-and-solihull/)                                        | 原Police正文：Jan–Jun2026 Coventry+Solihull115deployments/87arrests/68weapons/439stopsearch，FarGosford刀抢真实；混区非4328率。；2026-08-15           | 2026-10-13；原bytes未知 | 原SHA未知  |
| W02 [原站正文/明确索引摘录](https://www.westmidlands.police.uk/police-forces/west-midlands-police/areas/campaigns/campaigns/operation-authentic---keeping-you-safe-in-the-city-centre-and-across-the-wider-coventry-area/) | 原Police正文：2025枪响后Section34/巡逻/帮派脆弱人保障；不证明区域冲突/战略后果。；精确日未核                                                          | 2026-10-13；原bytes未知 | 原SHA未知  |
| W03 [原站正文/明确索引摘录](https://customer.nationalgrid.co.uk/advice-and-guidance/key-performance-targets)                                                                                                               | 原运营正文FY24/25 WestMidlandsCI46.31/CML34.18/HV1h89.33%；排除exceptionalsevere，header2023/24与表24/25不同。；精确日未核                            | 2026-10-13；原bytes未知 | 原SHA未知  |
| W04 [原站正文/明确索引摘录](https://www.birminghamairport.co.uk/latest-news/birmingham-airport-ends-record-2025-with-busiest-december-ever/)                                                                               | 原运营观察2025旅次13654108/90516flights、实际新路线；BHX3799可外部接续但非4328本机场。；2026-01-13                                                    | 2026-10-13；原bytes未知 | 原SHA未知  |
| W05 [原站正文/明确索引摘录](https://www.birminghamairport.co.uk/transport-links/by-train/)                                                                                                                                 | 原运营当前AirRail免费03:30–00:30、国际站接续Coventry/London等；正文CrossCountry组含Euston viaNorthampton，不擅纠正/作为精确运营商时刻表。；精确日未核 | 2026-10-13；原bytes未知 | 原SHA未知  |
| W06 [原站正文/明确索引摘录](https://www.birminghamairport.co.uk/transport-links/by-bus-or-coach/)                                                                                                                          | 原运营当前X1 Coventry–BHX–Birmingham、现场现金/非接触，coach接续；HS2路工通知与共同节点保留。；精确日未核                                             | 2026-10-13；原bytes未知 | 原SHA未知  |
| W07 [原站正文/明确索引摘录](https://warwick.ac.uk/fac/sci/wmg/news-and-events/industry-success-stories/success-story-assetbank/)                                                                                           | 原大学web正文SIMPLE部署3制造组织、TopOriental在Coventry工厂ERP已采用；案例日期混合/未标，£50k月出口为条件预期。；精确日未核                           | 2026-10-13；原bytes未知 | 原SHA未知  |
| W08 [原站正文/明确索引摘录](https://warwick.ac.uk/services/finance/resources/accounts/annual-report-24_25_v24singlepages.pdf)                                                                                              | 原PDF文本web可读，FY截至Jul31 2025，innovation5年区域累积；raw429，web截图未返回可见pixels，本轮未宣称目视该PDF/未取原bytesSHA。；精确日未核          | 2026-10-13；原bytes未知 | 原SHA未知  |
| W09 [原站正文/明确索引摘录](https://www.uhcw.nhs.uk/download/clientfiles/files/Generic%20Recruitment%20Pack%2013_01_20%281%29.pdf)                                                                                         | 2020招聘包仅原站indexed excerpt：Level3 performsautologousstemcell路径，非近期实际患者/支付/效果；全文403，不当有效PDF。；精确日未核                  | 2026-10-13；原bytes未知 | 原SHA未知  |

## 失败与有限停止

| 原尝试URL/缓存                                                                                                                                                                                                             | HTTP/失败机制与解释                                                                                                                                                                                                                                               | 取回UTC/失败bytes                                 | 失败响应SHA（不作原件）                                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------- |
| [airport-bhx-bus-current.html](https://www.birminghamairport.co.uk/transport-links/by-bus-or-coach/)                                                                                                                       | 403 / text/html; charset=UTF-8 / https://www.birminghamairport.co.uk/transport-links/by-bus-or-coach/；exit0；拒绝/限流/超时，非有效正文                                                                                                                          | 2026-10-13T07:02:21.334699+00:00；5503失败bytes   | `b57fb7a7cd8d5d3005ada95fc0310a09da59b9b73642ea873878b197f53d8e00`（非原件） |
| [airport-bhx-train-current.html](https://www.birminghamairport.co.uk/transport-links/by-train/)                                                                                                                            | 403 / text/html; charset=UTF-8 / https://www.birminghamairport.co.uk/transport-links/by-train/；exit0；拒绝/限流/超时，非有效正文                                                                                                                                 | 2026-10-13T07:02:21.333142+00:00；5482失败bytes   | `caff2709126bc563ec1c9456e51de955ad0b7d89a7a7767fd33ac5af8c0c0466`（非原件） |
| [airport-bhx2025.html](https://www.birminghamairport.co.uk/latest-news/birmingham-airport-ends-record-2025-with-busiest-december-ever/)                                                                                    | 403 / text/html; charset=UTF-8 / https://www.birminghamairport.co.uk/latest-news/birmingham-airport-ends-record-2025-with-busiest-december-ever/；exit0；拒绝/限流/超时，非有效正文                                                                               | 2026-10-13T07:00:01.770153+00:00；5696失败bytes   | `5ab8cba92d465e2652b3b9eb3b031d0eac5b5fbc72102d4e99b04a5c859763ce`（非原件） |
| [climate-cabinet2026.html](https://edemocracy.coventry.gov.uk/ieListDocuments.aspx?CId=124&MeetingId=13485)                                                                                                                | 000 / / https://edemocracy.coventry.gov.uk/ieListDocuments.aspx?CId=124&MeetingId=13485；exit28；拒绝/限流/超时，非有效正文                                                                                                                                       | 2026-10-13T07:00:03.060419+00:00；0失败bytes      | null（非原件）                                                               |
| [cqc-gyn2026.html](https://www.cqc.org.uk/location/RKB01/reports/LAP-03583)                                                                                                                                                | 404 / text/html; charset=UTF-8 / https://www.cqc.org.uk/location/RKB01/reports/LAP-03583；exit0；analyst_incorrect_locator_LAP03583; not service disappearance; actualobservedLAP02128 valid                                                                      | 2026-10-13T07:03:50.233555+00:00；136333失败bytes | `539fe3addf450fe5f10141ef15838bc5040136f066f8653cf058fbf293ab55b2`（非原件） |
| [energy-performance2025.html](https://customer.nationalgrid.co.uk/advice-and-guidance/key-performance-targets)                                                                                                             | 403 / text/html; charset=UTF-8 / https://customer.nationalgrid.co.uk/advice-and-guidance/key-performance-targets；exit0；拒绝/限流/超时，非有效正文                                                                                                               | 2026-10-13T07:00:00.649817+00:00；5642失败bytes   | `97821ae968a3ba204011114509b11c4969091d8293cc70456dd636964ecd1309`（非原件） |
| [energy-westmidlands2025.pdf](https://www.nationalgrid.com/document/562361/download)                                                                                                                                       | 403 / text/html; charset=UTF-8 / https://www.nationalgrid.com/document/562361/download；exit0；拒绝/限流/超时，非有效正文                                                                                                                                         | 2026-10-13T07:00:00.650056+00:00；5450失败bytes   | `e0e2cc926a142ce283db01851b9e60875563088202b810e8007f2d7ed1bf4947`（非原件） |
| [police-authentic2025.html](https://www.westmidlands.police.uk/police-forces/west-midlands-police/areas/campaigns/campaigns/operation-authentic---keeping-you-safe-in-the-city-centre-and-across-the-wider-coventry-area/) | 403 / text/html; charset=UTF-8 / https://www.westmidlands.police.uk/police-forces/west-midlands-police/areas/campaigns/campaigns/operation-authentic---keeping-you-safe-in-the-city-centre-and-across-the-wider-coventry-area/；exit0；拒绝/限流/超时，非有效正文 | 2026-10-13T06:57:00.075727+00:00；6081失败bytes   | `8ca064a97af303941ab50d5e0d1578eb7b5a505000ae8102dce9198a46cbd95a`（非原件） |
| [police-taskforce2026.html](https://www.westmidlands.police.uk/news/west-midlands/news/news/2026/august/guardian-taskforce-achieve-excellent-results-across-coventry-and-solihull/)                                        | 403 / text/html; charset=UTF-8 / https://www.westmidlands.police.uk/news/west-midlands/news/news/2026/august/guardian-taskforce-achieve-excellent-results-across-coventry-and-solihull/；exit0；拒绝/限流/超时，非有效正文                                        | 2026-10-13T06:57:00.073766+00:00；5900失败bytes   | `52a36ce94aa991e1d5d2b812298ad9bc586500771cc8512fe9c3475c0877b3a2`（非原件） |
| [uhcw-haematology2020.pdf](https://www.uhcw.nhs.uk/download/clientfiles/files/Generic%20Recruitment%20Pack%2013_01_20%281%29.pdf)                                                                                          | 403 / text/html / https://www.uhcw.nhs.uk/download/clientfiles/files/Generic%20Recruitment%20Pack%2013_01_20%281%29.pdf；exit0；拒绝/限流/超时，非有效正文                                                                                                        | 2026-10-13T07:02:21.331659+00:00；919失败bytes    | `d2ecfeb09c88b67600050d6a0db347f65efb06277fec9fa18d33021fc3431fd1`（非原件） |
| [uhcw-quality2025.pdf](https://www.uhcw.nhs.uk/download/clientfiles/files/UHCW%20Final%20Quality%20Account%20PV%202024-25%20AW.pdf)                                                                                        | 403 / text/html / https://www.uhcw.nhs.uk/download/clientfiles/files/UHCW%20Final%20Quality%20Account%20PV%202024-25%20AW.pdf；exit0；拒绝/限流/超时，非有效正文                                                                                                  | 2026-10-13T06:57:00.070375+00:00；919失败bytes    | `59d5b19b9b665701dd6b4c20dafac4a8159c4547b425d53b1087db8fe9a9f7be`（非原件） |
| [warwick-accounts2025.pdf](https://warwick.ac.uk/services/finance/resources/accounts/annual-report-24_25_v24singlepages.pdf)                                                                                               | 429 / / https://warwick.ac.uk/services/finance/resources/accounts/annual-report-24_25_v24singlepages.pdf；exit0；拒绝/限流/超时，非有效正文                                                                                                                       | 2026-10-13T06:57:00.070733+00:00；17失败bytes     | `3850dfdbf4489250268b5f0740240a9f4445e7c5c29e1d03aa0c5446808d7507`（非原件） |
| [wmg-actual-current.html](https://warwick.ac.uk/fac/sci/wmg/news-and-events/industry-success-stories/success-story-assetbank/)                                                                                             | 429 / / https://warwick.ac.uk/fac/sci/wmg/news-and-events/industry-success-stories/success-story-assetbank/；exit0；拒绝/限流/超时，非有效正文                                                                                                                    | 2026-10-13T06:57:01.475393+00:00；17失败bytes     | `3850dfdbf4489250268b5f0740240a9f4445e7c5c29e1d03aa0c5446808d7507`（非原件） |

UHCW质量PDF原403、主页web403、旧招聘PDF403后同机制停止，不从招聘索引宣称有效PDF或当前输注。Warwick原账户/WMG案例429不复爬，web-only已足够作有限scope。BHX三个原请求403后停止、web原正文已读；NGED两原403，正文有限表可读未冒充原报告。Council eDemocracy原TLSconnectiontimeout/webtimeout，主体Council公报原PDF则有效；没有把网络失败当市民无法申请/机构隐瞒。CQC初次gyn locator使用了错误LAP03583而404，是**分析者定位错误**，不是报告失踪/服务不存在；已从原摘要href核 **LAP02128/overall**并取得有效原件，保留失败响应未覆盖消失。没有为每未知凑满三次失败、也没有超过边界无限新源。

## PDF核查和交接

实际`pdftoppm`→`view_image`目视：Council性能报告physical/printed **26/34/58/59/68/69/72**；Science Park physical **2/3/4/6/8/9**。PNG在`pdf-visual/`。国家CAR-T同一原件沿用London已经目视的关键页/条款，不逐城重复法律核查；本轮未声称新重看。WarwickwebPDF截图工具只有引用、无可见pixels，未算目视或有效原件，不以其未目视关键表的数值评分。

保留成人50/90%/7冲突、食品银行raw15 vscached14与限领差异、DWI“16,6434”原HTML疑值、NGED年度标题/表及异常排除、CQCupdated/publication/观察窗与aggregateGood不同服务。没有修成一套看似一致的好数字。完整`candidate-handoff.json`使用现case字段8维/31键，GSS/LONnull的alternatives为空；`source-manifest.json`分有效/同源/冗余/web-only/失败/实际目视，边界/探索派生另列。仅pnpm Prettier本MD，哈希交`handoff-hashes.json`，主代理统一验收/校准。

## 根代理统一验收

2026-10-13：独立核21份有效原响应bytes/SHA、完整9031目标几何及15个近似参考点，目视市执行和科技园实际交付，重读CQC急诊实际失控／缓解。接受PCS／ISR／RES／TEC／OPT条件60、MED40，GSS／LON未知，域42—67，无中心。RES末梢常态及净负担为较弱必要推定，拒绝即回未知；治理与医疗日期／分母冲突保留，较晚妇科改善不修复全部旧急诊问题。

## GSS共同门槛澄清

当前GSS继续未知，分值和其他七维不变。旧文要求补“实际区域／战略影响”的措辞不应解释为先发生战争或成功攻击才可评分；需要补的是有范围的风险／影响观察、相关情景与本地或真实共享服务已运行能力的匹配及残余解释。国家预测、普通设施或一般交通扰动不够，但明确适配的现役保护允许同层条件判断。此澄清没有取得新的城市能力证据，不能据此自动填60。详见[40份冻结输入的同尺度审查](cci-gss-comparability-review.md)。
