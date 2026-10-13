# Grimsby eFUA5518：八维有界优先复核

**建议PCS／GSS／ISR／RES／MED／LON／TEC／OPT＝60／null／60／60／40／null／60／60。** 六个条件档的原权重已知贡献42；GSS与LON未定，数学范围42–67，**没有完整条件中心，不填中点、零或重分配权重**。31子项均记录状态；有字段不等于所有项已测量。这份交接不是高分预测、全球排位或排除其它候选。

画像：2026英国公民、通常长期居民、当地中位收入、通常NHS；cutoff2026-10-10，实际查阅2026-10-13。沿用[共同rubric](cci-global-scoring-rubric.md)、[Copenhagen完整案例](cci-copenhagen-priority-review.md)和[London疾病转化校核](cci-london-lon-comparability-review.md)。最多两轮发现／定向补查，随后仅跟进已定位底表；未知允许停止。短医疗旅行、低地震／热背景及优先队列均不代整维证据。不要求完美家庭账单、全部FUA普测或只有多数受害才可降档。

## 冻结地界与外部服务

原GHS全9031几何实际读取并复核包SHA `9934364827132232df67e8984768fb30865a846f5a786db999d49fc37fb7698d`，9,932,800 bytes。5518记录Grimsby／GBR，612km²，2015模型人口199,722.08（仅历史识别），UC1951；ESRI54009 bounds `[−24000,6218000,11000,6249000]`，目标WKB SHA `755ba60470a141a1a58784396f7106172b6447f0a4bb3debc8e0e640d538d827`。EPSG4326→ESRI54009 always_xy、对全9031逐几何intersects。完整点／方法在本任务 `boundary-record.json`。

| 分析者近似参考点            | 坐标lon／lat     | 全集匹配 | 解释                                                    |
| --------------------------- | ---------------- | -------- | ------------------------------------------------------- |
| Grimsby中心                 | −0.075／53.566   | 5518     | 不是供水／居民覆盖中心。                                |
| Diana Princess of Wales医院 | −0.087／53.545   | 5518     | 点非全部院区、病例居所或服务边界。                      |
| 鱼市场                      | −0.070／53.579   | 5518     | 实际市场流转可适配核心，非家庭全食物。                  |
| Stallingborough             | −0.184／53.587   | 5518     | 非3km海防完整足迹。                                     |
| Immingham港                 | −0.190／53.630   | 无匹配   | 不按行政North East Lincolnshire全纳；仍可提供外部服务。 |
| Humberside机场              | −0.3508／53.5744 | 无匹配   | 本轮近似点；不是冻结机场目录坐标或“没有实际机场”。      |
| Hull Castle Hill医院        | −0.452／53.780   | 5422     | 外部必要专科不能当本区设施／实际转诊结果。              |
| Hull轮渡                    | −0.280／53.741   | 5422     | 对普通居民可接续性需画像／交通假设。                    |
| Sheffield Royal Hallamshire | −1.491／53.379   | 4460     | 国家CAR-T提供方存在不证明本区患者已到达。               |

NELC行政范围、2,785km² Lincolnshire East水资源区、NLaG跨院人口及Northern Powergrid区域均不等于本FUA。机构总量、预测人口和海港范围不换成2026普通居民分母。Oct13响应hash仅认证本次取回字节，不鉴定Oct10当日版本；未标日期的现行服务须延续推定。

## PCS：现役与真实运行支持60，海潮／末端残余重要

[S01 EA](https://www.gov.uk/government/news/humber-defences-project-reaches-new-milestone)2024-12-13实际完成90,000吨护石、3km原护岸保护，并修复另1.5km，称更好保护2,400处物业及工业／关键设施。不是2,400居民、全612km²保护或零洪灾；25年是设计作用期判断，不是已经观察25年。主出水口修复当时暂停至春2025，**未据旧未来承诺断言现在全部完成**。

[S25 NELC/WHS Finalv2.0](https://www.nelincs.gov.uk/assets/uploads/2026/09/202609-WaterCycleStudyv2.pdf)2026-09-21实际范围说明：行政区约30%土地FZ2、27%FZ3a，主要低地海潮／河流及地表水暴露；这是无防御情景风险，不是已淹面积／居民率，未核两区图层互斥，**不相加为57%**。沿海／东北已有堤、闸、可拆卸设施等显著缩小洪水范围；DG5事件最多在Grimsby，但没有本文可用的同窗事件人数及病例损害分母。既有防护与末端／污水洪水一起保留，不以规划的新设施计当前防护。

[S06热预警](https://www.nelincs.gov.uk/tips-to-stay-safe-this-week-as-amber-heat-alerts-hit-north-east-lincolnshire/)2026-06-22为当时Amber及可能Red预警，Public Health已向学校、GP、无家可归、照护及药酒服务等群体发送通知。是实际定向发送，不证明居民全部收到、家中降温有效或热死亡减少；本轮没有给本区热死亡零值。地质／地震原级危险及建筑脆弱本轮未实测，保留unresolved，不让探索队列低PGA替代防护判断。

[S20冬季运行报告](https://www.nelincs.gov.uk/assets/uploads/2025/09/4.-Highway-Winter-Service-Review-2025-26.pdf)2025-09-24回顾Oct2024–Apr2025撒盐60次、1,340吨，99.75%**预防性路线**3h内完成，不是99.75%全部道路安全或居民获救。Jan202523次，报告包含Bert／Éowyn的区域天气背景；UK风暴损失不自动全归Grimsby。正文把季末最后处理写“17th March2024”，同段季节与图指2024–25，另将Jan2025解释夹“2023/24”：**保留冲突，不静默改年份**。未来2025/26作业方案不是又一年已完成实绩。

PCS条件60接受现役海防／处理通常有效、警告和普通避险可实践，且未测地质等不是另一关键无缓解缺口。海潮／地表暴露与防线外末端不足的重要性可支持40替代，不需要多数居民受害；更强现役覆盖／有效备用或低暴露组合可80。拒绝适配／现役／通常保护的必要假设则null。

## GSS：国家风险已核，当地实际影响／缓解未闭，null

[S24 CNC政府说明](https://www.gov.uk/government/news/uk-national-threat-level-raised-to-severe)2026-05-01记JTAC在Apr30把英国威胁上调Severe、国内极端主义与国家关联威胁背景；这是当时国家判断，不是Grimsby攻击、cutoff当天重新测量，亦不把London Golders Green刺伤复制给本区。日常港口／市政活动仍运行不能独自证明组织暴力低影响。第一轮警察／地方来源、第二轮组织犯罪及Grimsby定向检索未取到足以适配三子项的当地原证：移动新闻页不含旧搜索片段所称Grimsby事件，**未把片段的六人逮捕、其它同名Grimsby或普通财产／违禁货犯罪当组织暴力结果**。

organized_violence未定，regional_conflict／strategic_exposure只国家和港口／近海产业背景。没有用UCDP无命中、国家无战争假设或海港名字填60。40／60／80均是待辨选择：需适配本区的现实影响与应对后判断，未取到不判差。最小下一原证是当前警察／地方韧性记录中具体组织威胁、居民／通道后果及已运行缓解；两轮停止，GSSnull。

## ISR：实际执行与触达支持60，自评及容量反证保留

[S02 AGS](https://www.nelincs.gov.uk/assets/uploads/2026/01/Annual-Governance-Statement-2024-2025.pdf)范围FY2024/25，封面October2025、Nov5签署、URLJan2026不同。条例／自治章程／年度内部与外部问责有实际复核；摘要“robust”是自评，不能代独立所有服务无故障。儿童静态投诉2024/2541件、1赞，前年度74件、7赞；原报告解释人员稳定及早纠纷化解改善，**数量下降不证明申诉人体验或每件已解决，也无需要服务人口分母**。容量延迟、儿童超预算、临时住宿和项目许可／公用工程延后仍在报告。首发日未另核。

[S07公共数字帮助](https://www.nelincs.gov.uk/your-council/digital-inclusion/)在Grimsby图书馆临时hub、Municipal Offices等提供免费WiFi、电脑及人员帮助，不需解释使用原因或购买，具体线下／电话入口支持触达；Immingham点不自动算本区。未标网页版本和实际接受帮助人数。社会凝聚只部分社区／组织触达背景，无全居民信任代表调查，不填满意率。热通知与冬季实际执行说明适配和应急处理；它们各有用途，不把相同撒盐事件重复按维度加数值奖励。

条件60是执行、纠错和实际渠道通常能运转但容量／群体尾部仍重要。若临时住房、儿童或纠错实际障碍残余构成明显执行断裂，可40；有效多组织恢复／触达更强可80；拒绝当前延续及核心到全区通常触达推定则null。没有拿NLaG医学警告简单重复处罚全市政治治理。

## RES：水源／实际流转／能源运行支持条件60

S25确认Anglian Water负责行政市供水，现有Lincolnshire East WRZ涵盖Grimsby／Cleethorpes等，主要Chalk／Limestone／Spilsby Sandstone地下水加Covenham储水的地表供给；严重水压力和现有来源集中保留，水体生态Poor不等末梢饮水不安全。供应者／抽水现况不是仅未来水库计划。

S25物理31–32／印刷28–29的**供需表均为forecast**：baseline2025/26 DYAA demand110.47Ml/d、WAFU116.64、计headroom余额0.00；2042/43余额−32.50。Final plan2025/26 demand109.69、WAFU117.25、计headroom余额1.39；2042/43余额1.30。余额不等简单WAFU减需求，不能把新脱盐／回用／转供全算当前投运，不能把未来缺水预测当2026已经断供。表域2025–2043、图示延到2049/50，方法又称“50 years(2025–2050)”；窗口文字冲突保留，不据此扩大成50年保障。headroom薄是脆弱背景，非实际家庭水量／停水率。[S25](https://www.nelincs.gov.uk/assets/uploads/2026/09/202609-WaterCycleStudyv2.pdf)

[S16 DWI](https://www.dwi.gov.uk/what-we-do/annual-report/drinking-water-2024/2024-july-december-interim-report/compliance-events-and-audits/)July–Dec2024实际监管描述Anglian Etton水池侵入／大肠菌群问题、九处technocover修复后才返回供水、井摄像检查逾期及来水50%无采样点等要求。Etton未核为本区来水，**不移植为Grimsby水质事故**。S17事件表ANH17，是1“not an event”、8“not significant”、5“minor”、3“significant”；表头把significant／serious都标4，保留编码冲突，最后serious空白不补作已核0。全国425合规失败按水厂／库／供水点／zone分列，**不是17个当地水样失败或99%当地合格率**。本轮未取得Grimsby有效末梢分层样表，地方运营者监测入口403而非居民无信息；水质适当性仍须区域监管到通常本区末端的明示推定。

[S05市场运营者](https://grimsbyfishmarket.co.uk/milestone-moment-for-grimsby-fish-market-as-it-turns-30/)2026-03-31记上年187,000个50kg鱼箱、其中150,000拍卖，拍卖鱼90%冰岛捕捞、经集装箱运入；两个分母不同，不能说187,000箱全拍卖或90%全部居民食品进口。每天40–60商人、冷藏／分级／物流和挪威／丹麦流转是实际供应链能力，不是居民去重、粮食全供应、库存天数或家庭支付。主要进口和港口冷链集中是残余，不拿未来海港投资抵消。

[S15供电ISG](https://isg.northernpowergrid.com/wp-content/uploads/2025/07/ISG-Annual-Report-2014-25_FINAL-rs.pdf)Apr2024–Mar2025、July2025报告；文件名2014-25与正文2024-25不一致。实际冬季响应／现场支援改善与整体中断表现因坏天气仍恶化同读。电水信息分享和2025拟实施电信韧性计划不是已完成Grimsby独立备用；Boston Spa效率试验不移植本区居民电费。是区域运营／stakeholder复核，不是本区户均停电或现场恢复普测。

RES60接受现有核心与区域供给通常持续、末端水质适当、必要食物与电力通常可取得且中位画像净負担可承担；没有以GDP、总量、平均账单或未知精确账单当判断。水质适配与日常负担是**较弱、可撤回**假设。水源／进口／电水通信共同依赖及坏天气残余重要；若它们经缓解仍构成普通居民必要供给或负担明显约束，可40，不要求多数受害。更强实际末端／普通负担及可替代来源支持80；拒绝关键末端／支付／区域适用推定则null。最小待补是本地末梢／停水与实际缓解，不是再搜更多未来工程。

## MED：最新急诊实质约束，主40而非按评级自动扣分

R01复用NHS通常居住资格（原取回Oct13）：多数服务通常免费，合法妥善定居须可证明，国籍／纳税／GP号码不单独决定资格。S21本地实际Cashiers入口可凭HC5、福利证明、预约和银行信息BACS报交通；不是中位居民必然有此福利或照护／失工全免费。S18当地Amethyst提供血液／肿瘤／风湿、病房、门诊和日间化疗；原发布2021-09-30、更新2022-12-28，现行服务延续是条件推定，不变成2026新增治疗或全专科冗余。[NHS资格](https://www.nhs.uk/nhs-services/visiting-or-moving-to-england/moving-to-england-from-outside-the-european-economic-area-eea/)、[本地办理](https://www.nlg.nhs.uk/contact/)、[Amethyst](https://www.nlg.nhs.uk/services/amethyst/)

CQC2026-07-17公布的检查从Jan20开始，最新急诊actual优先于旧2022／2020服务评分。S11检查前6月平均triage56min、ambulance handover51min，对该文15min目标；需入院者55%等>4h但<12h，30%>12h，**不是全部到院或全居民的30%**。原68%四小时内是trust范围，与单院等待不能默拼同分母；缺精确n、窗口日期和重入院定义，不算稳定风险调整结局。4%未经看诊离开低于所列national5%、unplanned reattendance9%为所列全国水平，是反证／有用服务，不能把全部人描成未治疗。[S11](https://www.cqc.org.uk/location/RJL30/reports/LAP-03031/urgent-and-emergency-services/responsive)

S09 Sep–Dec2025脓毒症审核：41%30min内screen、18%documented escalation、36%按时fluid balance、68%及时血培养、未有两套培养，45%抗菌处方依指南，**未给样本n／纳排，不推全需要抗菌药者45%得到药或患者感染死亡率**。过期转运药品／污染防护器材、感染控制现场缺口、人员不足仍违反安全staffing；ALS medical61%／nursing75%、paediatricALS medical34%等各自培训人群分母，不是居民率。[S09](https://www.cqc.org.uk/location/RJL30/reports/LAP-03031/urgent-and-emergency-services/safe)

同时保留实际缓解：检查现场未见脓毒症问题、即时处理过期物品与PPE、多专业协作／frailty输入、NEWS2工具与转接；S10现场10份记录无错误与前6月risk／nutrition／2h checklist审核50–100%是不同选择样本，不能用10/10抹平历史问题，也不把记录不完整等同已证明实际漏治疗。S03临终从2022 inadequate改善为2026Good；S04NLaG在2026-07-28因治理／incident learning／IPC获S29A警告，跨院范围不是Grimsby感染率，但与当地新急诊残余并读。[S10](https://www.cqc.org.uk/location/RJL30/reports/LAP-03031/urgent-and-emergency-services/effective)、[S03](https://www.cqc.org.uk/location/RJL30/reports)、[S04](https://www.cqc.org.uk/provider/RJL/services)

**MED40**判断已记录安全／及时必要治疗残余在缓解后仍重要，不需要整体所有疾病或多数居民失败；不是CQC评级换算。可接受主要NHS医疗净支付通常可承担而仍40，免费不抵消等待。60是实质替代：若当前改进及专科／跨院转诊通常足以保证及时必要治疗、现场改善代表持续结果，可取60；不以未来整改计划本身证明。更强实效／及时转诊备援可80；拒绝本地队列代表性、当前残余或主要支付适配则null。QualityAccount draft入口403不作临床原件，本轮不再追三种失败版本。最小下一原证为急诊改善后脓毒症／及时性同队列及严重后果／转诊实际替代结果。

## LON：不能复制其它城市CAR-T，主null

R02国家CAR-T委托、R03 NICE人体结果及R04 HGPS lonafarnib共用既核原件，原retrieved日期不改成本地新证。它们说明严格适应证、NHS提供方支付及必要监护：药物excluded from activity tariff不是保障不付，国家提供方可在FUA外；HGPS责任未证明当地已给药。S18只证普通当地化疗服务；两轮Grimsby／NLaG血液和CAR-T定向检索没有闭合本地实际可信先进转化、或本区合资格居民已实际可执行的区外转诊／给药／监护链。[国家委托](https://www.england.nhs.uk/wp-content/uploads/2026/04/cart-service-specification-commissioning-guidance-v1.0-1.pdf)、[NICE](https://www.nice.org.uk/guidance/ta1048/chapter/1-Recommendations)

这里缺的是**地域及真实交付连接**，不是完美中位账单；外地服务可以支持本区居民准备度，但不能只有Sheffield／London病例或NHS规则就升60。本轮不宣称本地没有CAR-T、不以基本基金拒AD或无合同自动40，也不把一般医疗／化疗全当LON。translation／trial_maturity／resident_access未定、regulatory_adoption国家context。下一条最小辨别证据是实际当地可信疾病转化给药，或现行区域转诊中本区居民进入已交付治疗／监护与通常NHS费用连接。成立可60；实际费用／等待／安全监护断裂有证可40；多路线强准备度可80；本轮null而停止。

## TEC：实际示范／研究与公众渠道支持60，不能用私网代普遍扩散

S13 **2023-10-12实际PORTAL启用**：Grimsby港与Lynn/Inner Dowsing海风两端光纤链接、15无线发射器／五处场地及太阳能5G buoy，私网约45km²，非45km²居民公网／独立海外备援。启动现场ABP/HeroTech8无人机、Microsoft live HoloLens、ABP/BT锁闸AI影像、Xocean自主船及JET仪表展示是已实施示范；不是这些产品已大规模居民采用。200岗位／120企业／20新企业是原未来承诺，未算完成。[S13](https://ore.catapult.org.uk/media-centre/press-releases/unique-offshore-wind-living-lab-in-grimsby-is-switched-on-to-launch-new-digital-future)

S14 Impact2024物理11／印刷20–21为Grimsby OMCE研究组合>70项目／£40m创新投入，不是70已商业化成果或论文数；22企业为service未来11GW“planned future capacity”准备，不算11GW当前当地发电。S12当前明确Grimsby dock的5G机器人testbed；Blyth DARE／7MW设备和Levenmouth能力不按整集团并成本区。70组合与S13同上游，不作两份独立统计。[S14](https://cms.ore.catapult.org.uk/wp-content/uploads/2024/06/Our-Impact-Report-2024.pdf)、[S12](https://ore.catapult.org.uk/products-services/robotics-autonomous-systems)

S07公众免费电脑／WiFi与drop-in帮助连接普通居民数字扩散；正文承认家中网、设备、技能／信心障碍，但无全城受影响率或帮助后的效果分母。试验设施、产业合作与公众基础渠道同读支持60的通常能力；私人港网不证明家庭网络强大，行业集中和公众技能／支付残余重要。若知识到商业／普通触达在缓解后明显断裂，可40；多机构产出与实际广泛采用更强可80，非必须所有产品独立备援。拒绝持续运营、地域或通常居民渠道适用则null，不因欠缺大学论文排名打低分。

## OPT：同London层的条件60，区外接续与通信缺口明示

S19现行TPE South正式表有效2026-05-17—12-12，Grimsby经Doncaster／Sheffield到Manchester／Liverpool；物理3页Mon–Fri Grimsby0734→Manchester1005，一条具体时刻不等实际2h31min全户旅程或始终准点。Manchester Airport多数列空白不能说全部直达机场；脚注／换乘及engineering替代保留。S19是实际公布在用服务，非乘客总量和独立共同失效备援。W01仅运营商检索正文的Hull–Rotterdam可订路线、直接原响应403，外部海路不能冒充本区港口；HUY当前运营者入口及查询不把机场数量当冗余。[S19](https://www.tpexpress.co.uk/-/media/PDFs/FINAL-May-26-Timetables/May-26-SouthFINAL.pdf)

S22 CTA updated2026-01-01允许英／爱公民在爱尔兰居住／工作，仍有驱逐、排除／旅行限制及非英爱家属条件，不代所有EU迁居。S23 QROPS退休金转移有认可方案、居住／额度／税条件，非全部资产固定25%或现金转移禁止。本轮没有验证特定银行国际到账；不能拿养老金规则独自证明通常全部资产可携。[CTA](https://www.gov.uk/government/publications/common-travel-area-guidance/common-travel-area-guidance)、[资产规则](https://www.gov.uk/transferring-your-pension/transferring-to-an-overseas-pension-scheme)

network_continuity仍unresolved：公众WiFi支持平时接入，ORe私网／NPG2025电信计划不证明跨境实际持续、独立应急备援或人人符合漫游产品。**OPT60是与London相同层次的通常画像推定**：实际在用交通和合法长期目的地可用，普通居民有有效证件／账户与可承担接续、住房、生活和通信的资源，通常资金及替代网络路径可执行；对此证据尤其薄的现金到账／独立通信不写成已测。必要推定拒绝→null。若港口／铁路共同失效或迁居资源与通信残余足以明显阻断可40；真实有效替代及资金通信覆盖更强可80。没有因为境内有图书馆、单条法律或网页能订票自动给整维。

## 31项状态、复算与交接停止条件

| 维度 | 子项                    | 状态       |
| ---- | ----------------------- | ---------- |
| PCS  | heat_humidity           | partial    |
| PCS  | flood_sea_level         | partial    |
| PCS  | geophysical             | unresolved |
| PCS  | severe_weather_wildfire | partial    |
| GSS  | organized_violence      | unresolved |
| GSS  | regional_conflict       | context    |
| GSS  | strategic_exposure      | context    |
| ISR  | governance              | partial    |
| ISR  | adaptive_capacity       | partial    |
| ISR  | social_cohesion         | context    |
| ISR  | emergency_recovery      | partial    |
| RES  | water                   | partial    |
| RES  | food                    | partial    |
| RES  | energy                  | partial    |
| RES  | supply_chain            | partial    |
| MED  | access                  | partial    |
| MED  | routine_quality         | partial    |
| MED  | specialist_capacity     | partial    |
| MED  | system_continuity       | partial    |
| LON  | translation             | unresolved |
| LON  | trial_maturity          | unresolved |
| LON  | regulatory_adoption     | context    |
| LON  | resident_access         | unresolved |
| TEC  | knowledge_output        | partial    |
| TEC  | industry_density        | partial    |
| TEC  | digital_infrastructure  | partial    |
| TEC  | diffusion               | partial    |
| OPT  | transport_redundancy    | partial    |
| OPT  | legal_mobility          | partial    |
| OPT  | asset_portability       | context    |
| OPT  | network_continuity      | unresolved |

{'partial': 20, 'unresolved': 6, 'context': 5}，合计31。没有子项分数／等权平均。

原权重15／15／15／10／15／10／10／10。六维已知条件贡献 `0.15×60(PCS)+0.15×60(ISR)+0.10×60(RES)+0.15×40(MED)+0.10×60(TEC)+0.10×60(OPT)=42`。GSS15%与LON10%未定→数学42–67，无中点。仅为情景：若两者均60，完整总分57；GSS60/LON40→55；GSS40/LON60→54；两者40→52；两者60且MED60→60。每个补齐情景都须新证或接受明示假设，**不是本轮替未知预填**。其他必要假设拒绝须进一步扩大未知集合，不能继续以上范围；范围非置信区间或入围上界。

有界停止：两个发现／定向补查轮次后跟进已定位原链接，未向机构发送消息；未继续追失败医院draft、Anglian末端入口或轮渡403。一次source获取失败不当居民无法查询，也不当能力低分。最小待补链是本区组织威胁实际影响／缓解、实际先进转化或区外真实衔接；MED改善后必要治疗及时／安全、末端水质和普通跨境资金／通信亦是重要可撤回条件，不以更多设施／计划／完整每户账单代这些辨别。

## 有效原响应及共同来源复用

新有效原响应25件、共同原件复用4件；原bytes／SHA与源身份在下表，实际UTC取回起始时刻、HTTP／exit、具体范围在 `source-manifest.json`。源日期是观察／发表／生效分开的说明，未核首发留空不借URL月份确定精确日期。文件均位于 `/private/tmp/cci-global/grimsby/`；`.txt`／PNG／边界与handoff为派生物。本轮无浏览器解码存档。

PDF关键物理页已目视：AGS5／11，冬季3，电力12，ORE11（另14为全国技能背景，未移植Blyth），TPE1／2／3，WaterCycle22／25／31／32。HTML原表ANH逐cell核对，CQC临床正文／单位／窗口与n未知保留，不伪造PDF目视。共同NHS文件沿用伦敦已核页和源时间，本轮不声称重新目视。

| 原来源／URL                                                                                                                                                                 | 真实日期与范围                                                                                                                                                                                                                                 |     bytes | SHA256                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------: | ------------------------------------------------------------------ |
| [S01 flood-defence2024.html](https://www.gov.uk/government/news/humber-defences-project-reaches-new-milestone)                                                              | 2024-12-13；取回2026-10-13，review10-13；EA已交付3km护石及1.5km修复；2400物业，不是FUA人口覆盖                                                                                                                                                 |    69,374 | `878e82ab9765045cbc2d39f31bfdd469b13c2b960ef7f45e7c8fbeaca4d4b141` |
| [S02 governance2025.pdf](https://www.nelincs.gov.uk/assets/uploads/2026/01/Annual-Governance-Statement-2024-2025.pdf)                                                       | 首发未独核；取回2026-10-13，review10-13；NELC FY2024/25；封面October2025，签署Nov5，URLJan2026；自评、外审与整改分列                                                                                                                           |   374,473 | `f7582a9f97f89fe2b95610b1e068b3b99ebe65968cfe47e655a415d65309e84c` |
| [S03 cqc-hospital-index2026.html](https://www.cqc.org.uk/location/RJL30/reports)                                                                                            | 2026-07-17；取回2026-10-13，review10-13；DPoW当前与旧检查不同窗；临终Good、急诊requires improvement                                                                                                                                            |   261,137 | `8d858ea48be47ab0393d8bdffb4282c9654b739f778f4be846bbbcba44f92a50` |
| [S04 cqc-provider-warning2026.html](https://www.cqc.org.uk/provider/RJL/services)                                                                                           | 首发未独核；取回2026-10-13，review10-13；NLaG多院提供方；2026-07-28 S29A治理／IPC警告，非本区感染发生率                                                                                                                                        |   211,516 | `55597be4a11e68b9bce4c44a2b9b8f3e7f4ac773055f334f5eb14726c2167e4c` |
| [S05 fishmarket2026.html](https://grimsbyfishmarket.co.uk/milestone-moment-for-grimsby-fish-market-as-it-turns-30/)                                                         | 2026-03-31；取回2026-10-13，review10-13；2025实际187000个50kg箱、150000拍卖箱；供应业非家庭膳食／支出                                                                                                                                          |   169,412 | `380fe7273cea26f5aaf7a94a9d8e8d265286b0ed11d202aaec604c9082153ec1` |
| [S06 heat2026.html](https://www.nelincs.gov.uk/tips-to-stay-safe-this-week-as-amber-heat-alerts-hit-north-east-lincolnshire/)                                               | 2026-06-22；取回2026-10-13，review10-13；NELC当时热预警及已发送脆弱群体通知；预警非已发生死亡                                                                                                                                                  |   115,649 | `4685e4afa8fc436a92724a3ab80c1ec5ae77478150e434bcae602f1a89b84792` |
| [S07 digital-inclusion.html](https://www.nelincs.gov.uk/your-council/digital-inclusion/)                                                                                    | 首发未独核；取回2026-10-13，review10-13；当前公共WiFi／电脑／帮助；版本未标，不是居民宽带率或海外备援                                                                                                                                          |   182,416 | `23861267826a24be57007728a609031e3057d91e08f3c52f1716d978b49bc58d` |
| [S08 cqc-emergency2026.html](https://www.cqc.org.uk/location/RJL30/reports/LAP-03031/urgent-and-emergency-services)                                                         | 2026-07-17；取回2026-10-13，review10-13；2026-01-20起急诊检查；概览不能代底层安全问题                                                                                                                                                          |   161,648 | `ab7a02dd60e1c03ae21cf150f299e88c84fadf5abc462b2e5220e65ae9d765e6` |
| [S09 cqc-emergency-safe2026.html](https://www.cqc.org.uk/location/RJL30/reports/LAP-03031/urgent-and-emergency-services/safe)                                               | 2026-07-17；取回2026-10-13，review10-13；2025Sep–Dec脓毒症审核和当次安全检查；n未列，行动不证明整改结果全达标                                                                                                                                  |   182,388 | `59bde9362952d0e80b2104e3b24b314f31f8a1762acff5a07a287b1f6f0c2728` |
| [S10 cqc-emergency-effective2026.html](https://www.cqc.org.uk/location/RJL30/reports/LAP-03031/urgent-and-emergency-services/effective)                                     | 2026-07-17；取回2026-10-13，review10-13；现场10记录与前6月审核50–100%不同样本；过程和结局分开                                                                                                                                                  |   171,197 | `700f394482b5f67a478e3459ceacd440dbe4187d82707ba581b7164d8bb9eac8` |
| [S11 cqc-emergency-responsive2026.html](https://www.cqc.org.uk/location/RJL30/reports/LAP-03031/urgent-and-emergency-services/responsive)                                   | 2026-07-17；取回2026-10-13，review10-13；检查前6月平均分诊56min／交接51min；需入院队列等待，不是全居民率                                                                                                                                       |   169,534 | `e92a4b6317feafccb928ce837c0b8db70ef69262395b23426e3b39df369f6ee7` |
| [S12 ore-current-robotics.html](https://ore.catapult.org.uk/products-services/robotics-autonomous-systems)                                                                  | 首发未独核；取回2026-10-13，review10-13；当前机器人服务；Grimsby／Blyth／Levenmouth单元分开，版本未标                                                                                                                                          |   233,007 | `a1d9a53599744f1c474b7f1f2eb718ef6de4cb08a746a3fbdcbf1dd8a184c231` |
| [S13 ore-live-lab2023.html](https://ore.catapult.org.uk/media-centre/press-releases/unique-offshore-wind-living-lab-in-grimsby-is-switched-on-to-launch-new-digital-future) | 2023-10-12；取回2026-10-13，review10-13；PORTAL实际启用和现场示范；200job／120business／20enterprise为预期                                                                                                                                     |   184,693 | `27717f03d897c1c099ed41c61746ca90ce884b1d1fb6eca1756ccad21dfd98dd` |
| [S14 ore-impact2024.pdf](https://cms.ore.catapult.org.uk/wp-content/uploads/2024/06/Our-Impact-Report-2024.pdf)                                                             | 首发未独核；取回2026-10-13，review10-13；Impact Report2024；OMCE项目组合与全国中心分开；URLJune2024，精确首发未核                                                                                                                              | 5,241,720 | `13dddcc26d05b77699ea1f231c900662f64d726afb5875546b946b3016d5da60` |
| [S15 power-stakeholder2025.pdf](https://isg.northernpowergrid.com/wp-content/uploads/2025/07/ISG-Annual-Report-2014-25_FINAL-rs.pdf)                                        | 首发未独核；取回2026-10-13，review10-13；ISG Apr2024–Mar2025，报告July2025；文件名2014-25不改正文；区域非本FUA停电率                                                                                                                           | 1,681,464 | `7d63763b1f447a19f9e53c1820a7a3841b2da7c2e923a5d27ba08b5234a31273` |
| [S16 dwi-compliance2024.html](https://www.dwi.gov.uk/what-we-do/annual-report/drinking-water-2024/2024-july-december-interim-report/compliance-events-and-audits/)          | 2025-12-09；取回2026-10-13，review10-13；DWI July–Dec2024监管问题及修复；Etton非已核本区供水设施                                                                                                                                               |    87,929 | `fc6f9ef318a8fa675933917cc19e609d97fc05653fbd90f29ca05c1c058d70f3` |
| [S17 dwi-appendix2024.html](https://www.dwi.gov.uk/what-we-do/annual-report/drinking-water-2024/2024-july-december-interim-report/appendix-compliance-and-events/)          | 2025-12-09；取回2026-10-13，review10-13；DWI半年事件表ANH17、全国合规425；非本区样本合格率；两列4冲突保留                                                                                                                                      |    83,393 | `061c7533f7dc75231ee76e9e58946f9ecad5f8c2f14269aaca977038c1dca7c9` |
| [S18 amethyst-unit.html](https://www.nlg.nhs.uk/services/amethyst/)                                                                                                         | 2021-09-30；取回2026-10-13，review10-13；院方本地血液／肿瘤／风湿和化疗；更新2022-12-28，当前延续有条件                                                                                                                                        |    77,336 | `240555b207c7c6e1ed1ee5002d0a7b390529d140523870ca689ff6e1fe5e6148` |
| [S19 tpe-south2026.pdf](https://www.tpexpress.co.uk/-/media/PDFs/FINAL-May-26-Timetables/May-26-SouthFINAL.pdf)                                                             | 首发未独核；取回2026-10-13，review10-13；现行正式时刻表2026-05-17—12-12；日别／脚注，非实到／准点率                                                                                                                                            |   627,356 | `1a13bdcff59b1b1cb61125482f53b02e2c08c2f97ef4b9b385b6dd04194c18c5` |
| [S20 winter-actual2025.pdf](https://www.nelincs.gov.uk/assets/uploads/2025/09/4.-Highway-Winter-Service-Review-2025-26.pdf)                                                 | 2025-09-24；取回2026-10-13，review10-13；NELC实际冬季Oct2024–Apr2025撒盐60次／路线99.75%3h内；正文日期／年份冲突                                                                                                                               | 1,787,399 | `8925118f83a85750d5dcda08a6a640f9fbfeac3152aaa754de23bf9082b4e953` |
| [S21 nhs-cost-help-local.html](https://www.nlg.nhs.uk/contact/)                                                                                                             | 首发未独核；取回2026-10-13，review10-13；Grimsby Cashiers现行HC5＋资格证明／预约／账户BACS；不等中位居民均免交通费                                                                                                                             |    97,418 | `4b31d9a6778264ff76cab3979f87d1172c25ab81690d635fdf50c62c1a120421` |
| [S22 cta2026.html](https://www.gov.uk/government/publications/common-travel-area-guidance/common-travel-area-guidance)                                                      | 首发未独核；取回2026-10-13，review10-13；英／爱公民具体CTA长期居住工作规则；updated2026-01-01，非EU全面权利                                                                                                                                    |    99,582 | `887d27e34913f9d5c239a651507b3b8c5024975798fff618211b5f2d00d0afc6` |
| [S23 pension-transfer.html](https://www.gov.uk/transferring-your-pension/transferring-to-an-overseas-pension-scheme)                                                        | 首发未独核；取回2026-10-13，review10-13；当前QROPS退休金转移、税费／身份条件；非全部资产或银行实际付款                                                                                                                                         |    77,116 | `acc30b14955ca0bbd05f5a521d08f4ce319bb94ea4a99ea2fcdade3ad9c2ff91` |
| [S24 threat2026.html](https://www.gov.uk/government/news/uk-national-threat-level-raised-to-severe)                                                                         | 2026-05-01；取回2026-10-13，review10-13；CNC报道2026-04-30国家Severe及国内／国家关联威胁；不是Grimsby实际攻击或cutoff当日测量                                                                                                                  |    66,296 | `905b42109da2539b41d4a125070c271a30e12f7c2999677bbb0c860582c02d15` |
| [S25 water-cycle2026.pdf](https://www.nelincs.gov.uk/assets/uploads/2026/09/202609-WaterCycleStudyv2.pdf)                                                                   | 2026-09-21；取回2026-10-13，review10-13；WHS为NELC编制Finalv2.0；行政市／2785km²WRZ不等612km²FUA；实况与预测分开                                                                                                                               | 3,509,554 | `2a3e9ce49a70b8f0742e93bee8b866164e41dce611dcc1f133ac91bbf772504b` |
| [R01 reused-nhs-ordinary-residence.html](https://www.nhs.uk/nhs-services/visiting-or-moving-to-england/moving-to-england-from-outside-the-european-economic-area-eea/)      | 首发未独核；取回2026-10-13，review10-13；NHS通常居住资格；page reviewed2023-10-24，nextreview2026-10-24，国家规则非本地及时治疗率; used only UK profile / national adoption, not local actual dosing.                                          |    32,656 | `4efb26910573c7f60a7ab193ee4e3091526d3672ce5dd931413ab74c3fd26976` |
| [R02 reused-nhs-cart-commissioning2026.pdf](https://www.england.nhs.uk/wp-content/uploads/2026/04/cart-service-specification-commissioning-guidance-v1.0-1.pdf)             | 首发未独核；取回2026-10-13，review10-13；官方2026/04目录；封面12 November2025 Version3，内列December2025 TA1116，旧计划日期不可当实际实施；England通常居民委托和提供方支付; used only UK profile / national adoption, not local actual dosing. |   332,621 | `ba97c929f2ca55b7da63a525aa8d0af00f962742e18f91e2b48afabda55da108` |
| [R03 reused-nice-ta1048.html](https://www.nice.org.uk/guidance/ta1048/chapter/1-Recommendations)                                                                            | 2025-03-26；取回2026-10-13，review10-13；NICE正式推荐第1章；适应证/移植适合性/商业安排；总生存证据不确定; used only UK profile / national adoption, not local actual dosing.                                                                   |    20,164 | `7d37836575b240bd2359d0de728c2e937e73a1cc32906576e086a1af57733e3f` |
| [R04 reused-reused-lonafarnib2026.pdf](https://www.england.nhs.uk/wp-content/uploads/2026/07/2402-commissioning-policy-lonafarnib-hgps.pdf)                                 | 2026-07-16；取回2026-10-10，review10-13；England HGPS正式疾病限定责任和监护；未核伦敦给药；复用Oct10原件; used only UK profile / national adoption, not local actual dosing.                                                                   |   227,513 | `6058ab23198d712877f7a303a4e1e328471ce3729276422055c433ebc5e5ed51` |

## web-only、失败与未用于主张的有效材料

| 原URL                                                                                                                                                                | 可用范围                                                         | bytes  | SHA    |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------ | ------ |
| [W01运营商检索正文](https://www.poferries.com/en/routes/hull-to-rotterdam?awc=113130_1757999625_46f2f60bccb6b95b965e5556852b8bec&sv1=affiliate&sv_campaign_id=92204) | 本轮Oct13；仅可订路线／说明，精确发布及已完成航次数未知；直开403 | 未取得 | 未取得 |

| 失败原入口                                                                                                                                    | 响应／实际时刻                               | payload bytes | payload SHA（非有效原文）                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------: | ------------------------------------------------------------------ |
| [ferry-hull-current.html](https://www.poferries.com/en/routes/hull-to-rotterdam)                                                              | 403／exit0／2026-10-13T04:53:12.275698+00:00 |           179 | `1f2e1251b1d5fab2f47bbfe3e09b149064e61571f98a5e02c6ace5f86bacb1d5` |
| [quality-account2026-draft.pdf](https://northlincolnshire.moderngov.co.uk/documents/s27706/Quality%20Account%2025-26%20NLaG%20Draft%20v5.pdf) | 403／exit0／2026-10-13T04:49:22.008517+00:00 |          4548 | `4ccce8ccef170f5371e7a163e2cc08f6121c588b8fd330f579ae7ea1fb3806a6` |
| [water-monitoring-index.html](https://www.anglianwater.co.uk/services/water-supply/monitoring-drinking-water-quality)                         | 403／exit0／2026-10-13T04:49:23.028981+00:00 |          5609 | `b1f31a59f477d09976ed8ccfd591a166f8c83a70d906ee2d20406db584b153ff` |

水质Anglian入口403、临床draft403、轮渡403各保留错误负载；没有将200HTML假PDF／拒绝页当有效原文。已读有效但不作独立主张：NELC本地索引、TPE时刻索引、DWI interim入口及wildfire-advice2026.html；后者全国临时禁令说法未另核法源／本区已烧地点，不当全国新法律或实际本区野火损失。manifest分列，不为来源数加分。搜索中错误haematology／digital猜测路径没有有效原件，未引用其内容。

独占 `candidate-handoff.json`符合现有八维31键形状，expectedConditionalTotal保持null；包含sourceSnapshots／webReadSources／failedSourceReads／referenceBoundaryCheck，仅供根代理验收。未改共享JSON、脚本、矩阵、页面或旧案例，未提交／派子代理／操作goal。
