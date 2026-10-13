# 布拉格优先补审：八维能力、居民获得与可撤回档位

证据截止 **2026-10-10**，新增取回／复核 **2026-10-13**；对象为 **Prague eFUA535** 的捷克公民、通常长期居民、当地中位收入与通常医保。复用[主案例](cci-local-2026-prague-case.md)、[原账本](data/cci-local-2026-prague-case.json)及[临床复核](cci-prague-clinical-review.md)，其原取回2026-10-12保持不变。沿用[共同档位](cci-global-scoring-rubric.md)与[TEC一致性](cci-technology-tier-consistency.md)，不把数学上限、旧排名或资料多少当能力，也不增加逐户完美测量、完美账单、所有当期风险调整结局或全功能区压力测试门槛。

**建议全八维条件性研究中心62：PCS／GSS／ISR／RES／MED／LON／OPT各60，TEC80。** 每维都依下述有依据的空间、时间、通常获得／剩余重要性推定；不是所有子项已经充分测量。MED早期读法保留null，跨城门槛复核后明确 **有条件60可辩**：真实通常护理与支付／优先安排／替代／质量管理支持合理推定，不能单因没有全常规当期结局或压力试验取消该推定。等待和限收仍可支持40敏感，必须说明其在实际替代后形成多重要的必要护理断点。拒绝关键推定恢复null，不能因更谨慎而默认null或为凑完整默认60。

## 范围与有界停止

旧GHS-FUA9031原包SHA `9934364827132232df67e8984768fb30865a846f5a786db999d49fc37fb7698d`已核。535面积2897km²、2015模型人口1879976.61仅作识别；八个近似点中Prague／机场／Troja／Karolinum／Dejvice／Káraný／Říčany为535，Kladno为387，不继承分数。点不是全部校园／医院／运营区、真实历史给药地块或患者住所。此次新行政住户样本、全国安全／食品网络、机构年报及城市项目不能直接等同535全区结果，范围／通常居民适配推定逐维明确。

补查限定两轮定向检索，后续仅沿已解析的原入口读取核心页／方法：PCS核实际洪水部署与适应项目状态；GSS核警察事件及BIS实际当地／区域机制；RES核原住户负担和实际供水／食品网络；MED核VFN年报、旧等待／给付与实际扩容／替代。同页失败不无限重试；正常TLS curl解决了部分本机urllib证书链问题，未关闭证书验证。记录完整公开前时间与当前字节的区别，不联系机构、不改旧case／评分或派子agent。

| 维度／权重 | 主档   | 支持、实际反证和改变条件                                                                                                                                                                                                                 |
| ---------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PCS／15    | 条件60 | 真实洪水架设、局部绿地／雨水交付和可用冷点入口；热／洪水、湿土倒树风险、待完工项目和未核地质脆弱保留。已审保护适配主要风险的推定必要；实际重要暴露／保护不足可40，更强多危险保护可80，拒绝null。                                         |
| GSS／15    | 条件60 | 本地破坏事件／实际威胁处置、2025主管低恐怖威胁观察及实际安全合作；乌战外溢、俄破坏与使馆／交通节点风险持续。国家机制适配本区且现实影响通常有限可60；重要生活／通道约束可40，低现实影响与关键响应更强可80，拒绝null。                     |
| ISR／15    | 条件60 | 已核备电切换／燃料／恢复和实际数字办件可维持；部门整合、停运／热水损害和群体差异保留，不当全部恢复。必要通常运作／适配推定拒绝null，重要执行失效可40，更充分群体触达与恢复可80。                                                         |
| RES／10    | 条件60 | 多源实际水供应／中断备用、食品仓储及帮助、真实能源交付／修复，加住户负担；共同电网冲击和不能负担食物／取暖的少数样本保留。通常资源可得／可承担及帮助适配可60，残余明显取得约束可40，多源及共因有效缓解更强可80，拒绝null。               |
| MED／15    | 条件60 | 公保必要护理、真实常规／专科服务、急重优先、已运行扩容及安全管理／替代支持通常能力；长排期／认知限收仍重要。通常适当护理与有限替代／延续的推定可接受，未独加全当期结局硬门槛；残余必要断点可40，更强质量／转诊／压力备援可80，拒绝null。 |
| LON／10    | 条件60 | 旧真实CAR-T给药／可信人体／EU许可／逐例支付与随访链保持，21／23队列差异、终身风险、制造／审批／配套负担保留。病种代表性及通常合资格获得／监护推定必要；真获得断点可40，多条成熟通常可得可80，拒绝null。                                  |
| TEC／10    | 条件80 | 多机构产出、实际产业产品／部署和真实购票／提交／常规传感收运，新增住户接入反证与能力共同看。按原同尺度高档，真实剩余扩散瓶颈经缓解仍重要可60；必要地域／用户／延续推定拒绝null，未知不封顶。                                             |
| OPT／10    | 条件60 | 真实航空／日常交通、附条件EU居民就业／居留与已用跨境银行、公共数字通道；停电共因和账户／费用／资源／资格仍在。通常能取得承担可用推定必要，实际重要退出约束可40、独立多路径可80，拒绝null。                                               |

## PCS：实际保护与未来项目分开，低档不由未测量产生

旧[2026-07-02 OICT冷点地图启动](https://operatorict.cz/novinky/praha-spou%C5%A1t%C3%AD-mapu-o%C3%A1z-chladu.-obyvatel%C5%AFm-pom%C5%AF%C5%BEe-naj%C3%ADt-%C3%BAlevu-b%C4%9Bhem-hork%C3%BDch-letn%C3%ADch-dn%C5%AF)是可用指引，不是已测每位居民降温／健康效果。[市2025适应监测原PDF](https://adaptacepraha.cz/wp-content/uploads/2026/02/Vyrocni_zprava_2025.pdf)2026-02、2月9日批准，物理7／印刷6页原表已目视：Praha10绿地／植树与Praha12草地／路径、Praha13部分内庭为已实现；Praha6标realizován却注明大部完成／2026收尾，不提升全部完工。Jezerka水景、Milady Horákové树列、部分排水工程、项目数据库与2026地图在2025仍准备／进行中；拨款和建设合同不当竣工。原七个已实现或近完成项目是状态混合，不能全写七个彻底完成。照片证明具体交付，未给全区降温效应。

[市安全门户2024-09-18原公告](https://bezpecnost.praha.eu/planovane-akce/aktualita-a-planovane-akce_18_9_2024-0)web索引原文给出已在Stromovka／Holešovice／Braník／Troja布设防护、Čertovka闸及部分保护仍保留，随着洪水变化准备翌日撤除。**准备拆除不等已拆完，措施存在不等全区保护效果**。原文有前一天15棵倒树、湿土／河岸与航运限制；是实际强降雨相关危险与缓解，不能只从洪峰降低宣称生活完全无影响。支援Krnov等外地发电机／泵和食品银行运水不能当全部发生在535。2023原安全公告的预测流量／未来架设另作历史context，没有用预测补成功实绩。本地安全网页2121bytes为JS壳，原有效正文bytes／SHA null，未将壳哈希登记为洪水原记录。

**条件60**与Boston等同一粒度：已部署的洪水保护与已交付适应设施、可用热入口共同支持主要风险有适配能力，热、湿土树木和局部河岸仍有重要脆弱。地质暴露／建筑适配此轮未核，不写零；必要假设为已审设施对通常居民／主要危险有代表性、保护一般有效且延续，未审地质／其他强天气未构成未缓解的主导脆弱。拒绝这些推定为null，而不是因缺地质数自动40或60上限。40需要实际重要暴露和缓解后防护缺口；80需要更强多危险暴露／实际保护和替代，不要求低危险城市建无必要工程。下一最小区别是既有防护对实际居民／设施的重要失效或充分作用，不是更多规划金额。

## GSS：真实本地事件、区域外溢和受限证实

复用[警察2025-06-23主站威胁原发布](https://policie.gov.cz/clanek/vyhrozoval-utokem-nejen-na-vlakove-nadrazi.aspx)：实际调查／处置的威胁不等爆炸已发生。新增[BIS2024原报告](https://www.bis.cz/public/site/bis.cz/content/vyrocni-zpravy/2024-vz-cj.pdf)，[正式目录首发2025-07-10](https://www.bis.cz/vyrocni-zpravy/)，记录Prague Klíčov2024实际纵火及BIS协作阻止类似破坏、从Prague组织的影响行动与具体制裁。主体所述归因、调查和司法结论不混淆，不从城市站点推全功能区暴力率。其他欧洲航空／铁路目标也不计本地伤亡。

沿同一机构真实目录取到[2025完整原报告](https://www.bis.cz/public/site/bis.cz/content/vyrocni-zpravy/2025-vz-cj.pdf)，[2026-08-27首发](https://www.bis.cz/vyrocni-zpravy/vyrocni-zprava-bezpecnostni-informacni-sluzby-za-rok-2025-8a6a912d.html)。物理7／印刷10—11、物理14／印刷24—25已目视：主管观察2025国家恐怖威胁仍低，最严重青年个案与警方协作、2—6月五名拘捕；不能把所有被监测者当实施袭击。它同时明确已调查捷境事件 **未可靠证实俄协调破坏或实际作案潜能**，这不是断言没有破坏活动／威胁；俄罗斯招募与对乌援助生产／配送主体的持续风险、Prague外交节点及跨境情报风险仍重要。报告关于欧洲后半年破坏上升不作本城次数，2026制裁／机构观察与2025观察另列，导言2026中东价格影响不倒写为全部2025实绩。

**GSS条件60**有比单纯“无归属事件”更具体的支持：本地实际事件／处置、主管当前已审低威胁观察与实际合作，加仍重要的地区战争、破坏及战略外溢。国家安全评估不是Prague市民风险率；接受该机制与已审本地节点对535通常居民及截止时点有代表性、现实影响通常有限但残余风险仍重要的推定，才能主60。拒绝为null。与Boston仅历史／制度还缺当前影响解释的主null不冲突，这里有2025监测范围和其证实限制，亦不由国家一句“低”自动给80。40需外溢／组织暴力已形成重要生活／通道限制，80需本地与区域低影响及关键威胁／响应更充分实证；未发现当前全市伤亡数不单独支持任一档。最小下一证据为截止前这些节点实际受扰及已用缓解的影响，停止添加同类案件。

## RES：原水务实绩、真实替代与通常负担

复用PVK2025年报／ESG及PRE原件，新增复核PVK原页的具体分母：近7000网络样本是采样量；事故／修理后的 **871样本／25166参数分析，99%参数符合**，不是99%人口全时合规、所有事故样本全部合格。铁／色度／浑浊问题和网络冲洗／改造同时保留；14.82%损耗不是中断率。处理水来源Želivka／Káraný／Podolí构成多源，但流域／共同供电和整个运营覆盖不全独立于535。

年报印刷29页有实绩备用：2025两升袋装水应对 **30次**断供，200容器已生产、**137运至中断区域**，其余有慈善／展示／备用，不能全算库存。残障到户送水仅单位次数，新增6登记不是全部残障覆盖；触发预期超过5小时不等实际每次延误超过5小时。Podolí恢复长期不用的备用进水线路、处理工艺测试可超设计44%不是全市任何情景容量。新增技术2025Nov投入原已核年报观察期，不当截止2026后未来。原96%满意／890混合受访者不代水质或全功能区获得。

[ČSÚ行政Prague住户原PDF](https://csu.gov.cz/docs/107839/2a7effd9-826a-a916-69d7-4e22ea583c4f/Zivotni_podminky_2025_Praha_fin%C3%A1l.pdf?version=1.0) **2026-04-08发布，2025上半年随机住宅抽样／加权，收入观察2024**；不能把630800估计家庭当实际样本n，2026拟调查11300全国家庭也不是2025样本。物理／印刷4页图已目视：住户不能负担每两天肉类一餐4.5%、适当取暖4.9%、突发16800CZK13.7%；不同事项可重叠，不能相加为所有资源失败率。住房月均10872CZK及其电22.3%／热热水15.4%／水污10.0%是住房费用内构成，**不是各项占收入**；18%自述住房大负担与3%收入很困难是另外单位，平均不当当地中位收入账单。原收入分组／网接入也不推人人购买能力。

沿食品联邦真实地域入口读取[Prague／中波希米亚食品银行原页](https://potravinovabankapraha.cz/)，已收集／分类／分发及不能行动者每周送到家支持实有供给／帮助；声称78000人未给统一观察窗／去重规则，不当535居民数。首次持身份证可取包、长期须劳动／社会部门等推荐，是具体居民路径，不默认中位收入画像已获助。全国联邦2025原报告分17,400吨已免费发放和2030未来量；**它们是全国食物加日用品，不当本城食物量**。地域名册列Prague、北／南不同近郊由多个银行服务，Džbánsko／Kladno不直接继承535。网页动画零计数是占位，不当无服务。原入口未标当前整页日期，截止／延续可用推定保留；未用未来厨房岗位／140餐目标当已交付。

PRE2025真实电供应及 **7月4日约三分之二Prague受传输故障、受影响区两小时缩小／其全部地点五小时恢复**，范围504km²不等535逐户；年末另一变电站故障、地铁电车停运和热水控制设备损坏原反证保留。PRE400000客户年末降价是适用客户报价，不证明所有人实际享受或全年费用率；社公备电切换／补充燃料是已交付缓解，热水预期周末修理不当确认完成，也不反向说2026仍断水。

**条件60**可由通常供水和实际替代／食品供给帮助／能源交付恢复，加原住户负担而成立：保留共同电网冲击、费用／营养及特定供水脆弱为重要短板。接受主要运行及家庭／地域资料对普通中位居民有代表性、通常可承担并延续，不要求匹配私人完美账单。40若这些实际不足在帮助和替代后仍对必要基本资源形成明显获得约束；不能按4.5%／4.9%自动换分。80须更强通常获得、多源和共同失效缓解；空间、当前负担／帮助及主要供给代表性拒绝则null。最小后续是已经识别的残余对通常资源获得的影响，非更多总产值或满意度。

## MED：以同层级推定处理广泛护理、等待与安全管理

保留[旧临床复核](cci-prague-clinical-review.md)所有原方法／反证：VFN2026平均等待表未给患者n、观察队列窗或已完成／待诊库存，入口门槛与实际低于门槛表项不完全一致，不当法定延误率。真实较长项目包括胃肠16周、外锥体新诊20—24周、儿童斜视手术48周与特定听检36周；它们确有等待，不能忽略。但按病情的优先 **遗传代谢筛查statim、肿瘤痛1—2周／非肿瘤8—12周、肿瘤会诊2周、白内障4周、记忆2—3周**亦真实公开。非急症排期不是所有必要急重护理被延误。

Motol认知首诊因容量几乎限收，仍留疑难／早期等需要和院外合作转介；VFN记忆2—3周是有限替代线索，**不证明每个被拒者已成功转去同范围服务**。VFN2025-09-29真实日间肿瘤扩容43给药位、每周约250接受输注及配药／营养／康复／姑息与OncoSafety支持已运行服务；不能由量换疗效、医生宣称缩短等候但无前后队列不当已证实等待改善。

新增[VFN2024完整原年报](https://www.vfn.cz/wp-content/uploads/2025/07/VFN-vyrocni-zprava-2024.pdf)，观察2024、路径2025Jul，首发具体日未独核；物理20／印刷38—39页已目视。真实100多内部审计覆盖药物、记录、卫生、安全等，电子登记2400多不良／非预期事件和改善建议、7500多问卷，院方称总体审计质量／安全持续改善。这是**实际安全组织和运行**，不是宣称2400伤害患者或7500人全部满意、风险调整临床结果；认证／排名不作质量分。住院床／占用率、工作量与菌检计数也不偷换疗效或备援空床。

复用VZP直接公保必要基层／住院诊断治疗、慢病、康复、急救与适用住院药物给付规则；合同provider／适应证／审批和自付项目须满足，通常医保不当所有收费均免。急诊90CZK及住院／特定豁免的旧web原规则不当总自付率，收入平均不相除算可负担。病例／全国转诊不等所有535本地居民已经获得治疗。

**跨城门槛一致性复核后的主条件60**：已核广泛通常／必要专科服务，直接公保支付、急重优先安排、实际扩容和质量管理／异常处理，为“通常合资格居民一般能获得并承担适当护理、部分排期／群体和压力仍有短板”提供有依据的联合推定。Osaka／Nanjing／Boston等同样未取得每所医院全部当期风险调整结局，不能这里独加完美门槛。这里接受已运行的审计、安全处理和专业护理体系通常反映可接受常规护理的**研究推定**，未写成量化疗效改善；接受机构／服务对535居民、通常支付及有限替代／延续有代表性，未要求所有患者零等待、所有转介全部成功或全医院当年压力测试。

**40为实质敏感**：若已有长等待／认知限收经过同科替代、合作转诊、优先和扩容后仍对通常必要护理形成明显实际断点，可40，不能由斜视48周或单门诊限收直接升级全维失败。压力备援的独立性没有充分证明，因而这里不是80；亦不能只以80未核固定60。**null**仅在上述通常质量、支付／获得、地域或替代有效性必要推定被拒绝、无法选择40／60时撤回，而非我们缺理想数据默认取消所有通常护理。最小下一事实是这些已经记录瓶颈经实际替代后的临床重要性，或一条有范围的通常质量／持续服务结果，足以改变推定即可，不要求完美全城结局／账单。

## 原ISR／LON／TEC／OPT再审

**ISR60可维持**：原Kundratka／Dubeč／Korunní已自动备电并补燃料、恢复电网与数字提交是实际执行；不能从关键应急组织运行推全部机构／群体均恢复。新增适应项目部分完工和食品到户仅补有限执行，不跨维机械重复奖励。社会凝聚仍多为有限触达推定，现实停运与部门整合不均保留；拒绝范围／通常功能／延续假设为null，重要失效可40。

**LON60可维持疾病限定尺度**：ÚHKT2025实际CAR-T、EU可信人体／许可、逐例保险审医及住院给付、当地ICU／随访组织支持一条有限转化。原21／23不同章节队列和44件分发不合为去重治疗者，Kymriah那一位适应证没有猜测；2024SÚKL继发T细胞肿瘤／终身监测推翻2023“尚无”的风险概括。制造通常22—28天为全国付款方说明，不当Prague精确等待；Ostrava未来给药不当本地。两款抗淀粉样蛋白CAP／合同／当地给药未知不自动40，也不补80。当前适当监护、通常合资格居民获准且能承担配套负担／制造期间等候的原推定保持，同杭州单抗当前费用放弃可支持40的区别在于具体获得断点证据不同，不因一城许可／另一城没有完美账单机械分档。

**TEC80仍可维持**：Charles跨城原43许可／24专利只作本地相关部分；CTU FIT原产业产品与CZ.NIC实际THOR、OICT购票／11666提交、Praha11玻璃试点已结束并常规运行，形成多生产／产业／扩散节点，不把许可证收入或大学数换分。用户超过300万／861619不除以冻结人口。新增ČSÚ2025行政Prague91%家庭上网及90%电脑支持实际采用但仍有未接入者，不等功能区公民率；它与原部门整合和玻璃投放困难反证共同保留。80不要求每人无差异、每产品即时替换；重要技能／费用／整合障碍在已有缓解后仍成立则60，必要地域／用户／延续推定拒绝null。

**OPT60仍可维持**：2025真实航空17750528人次和19新目的地，银行真实跨境支付功能／使用及捷克公民德国EU附条件就业／求职／资源医保路径，支持通常选择。没有把旅客量当独立居民、多个交通方式当独立共同停电备援或将账户功能当全部合法资产转移／到账。住户车8%想要却不能负担与实际公共交通，通常资源／账户／通信可承担推定一起解释；公众有上网不等完整关键国际通信压力连续。停电、AML／账户／费用／时限及身份条件保留，拒绝通常取得承担／空间延续假设则null；真实明显退出断点可40，更强多路径共因缓解可80。

## 全31项与拒绝假设后的原权重域

| 维度 | 子支柱状态                                                                                                          | 仍须区分                                            |
| ---- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| PCS  | `heat_humidity` partial；`flood_sea_level` partial；`geophysical` unresolved；`severe_weather_wildfire` partial     | 地质未核不记零；多危险保护与有限已部署／准备分开。  |
| GSS  | `organized_violence` partial；`regional_conflict` context；`strategic_exposure` partial                             | 全国观察／缓解适配，不伪造城市率或归因。            |
| ISR  | `governance` partial；`adaptive_capacity` partial；`social_cohesion` partial；`emergency_recovery` partial          | 实际组织恢复与全部人群／部门不同。                  |
| RES  | `water` partial；`food` partial；`energy` partial；`supply_chain` partial                                           | 参数、容器、受助者、户与家庭负担不是同分母。        |
| MED  | `access` partial；`routine_quality` partial；`specialist_capacity` partial；`system_continuity` partial             | 实际质量组织／通常护理推定不是全当期结局已核。      |
| LON  | `translation` partial；`trial_maturity` partial；`regulatory_adoption` partial；`resident_access` partial           | 原给药／分发、逐例支付／配套负担及风险不同。        |
| TEC  | `knowledge_output` partial；`industry_density` partial；`digital_infrastructure` partial；`diffusion` partial       | 多节点生产／真实扩散，不把全部跨城大学与用户归535。 |
| OPT  | `transport_redundancy` partial；`legal_mobility` partial；`asset_portability` partial；`network_continuity` partial | 日常实际路径与共同失效／审批／账户条件不同。        |

31项 **29 partial／1 context／1 unresolved／0 complete**，不据状态等权平均。八维原贡献 `9+9+9+6+9+6+8+6=62`；只有根代理采纳每维必要推定时可复算完整条件中心。任一15%维（PCS／GSS／ISR／MED）撤回为 **53—68无中心**，RES／LON／OPT任一撤回为 **56—66**，TEC撤回为 **54—64**。新补四维全部推定拒绝则回原 **29—84**；未知不归零或重归一化，这些域不是可信区间或候选排除界限。

任一15%维实证改40且其余主档接受，中心59；RES／LON／OPT任一改40为60；TEC改60为60。MED采用null是53—68，采用有依据40是59，采用通常适足推定60是62；三者冲突可审，而非更保险null默认优先。更强80每15%维加3、每10%维加2，但必须有该维证据，不按研究顺序、旧案例数学上限或总体声誉加分。

## 原响应、日期与目视

新增根 `/private/tmp/cci-global/prague/priority-completion/`，全部实际取回 **2026-10-13**。`source-manifest.json`保存原URL、实际响应、bytes／SHA、正常TLS方式及失败；`.txt`／渲染PNG为阅读衍生件。当前字节不认证截止历史版本，未标首发的旧年报／当前页沿明确截止前可用假设；报告观察、批准／发布与以后更新分别列。关键目视：适应物理7／印刷6项目表；ČSÚ物理4／印刷4双图；VFN物理20／印刷38—39；BIS2025物理7／14，印刷10—11／24—25；复用PVK年报物理／印刷29备用交付页；全国食品银行物理4原数值页。

### 本轮八项有效新增原件

| 原件／URL                                                                                                                                                   |    bytes | SHA-256                                                            | 观察／发布／适用边界                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------: | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `vfn-annual2024.pdf`；[VFN年报](https://www.vfn.cz/wp-content/uploads/2025/07/VFN-vyrocni-zprava-2024.pdf)                                                  |  2254512 | `47311eed1e8030cff042757fc5b8814da943d1f26dd69888f26fc88a6e6f7bf0` | 观察2024；路径2025-07，首发日未独核；实际审计／异常报告，不作风险调整改善。 实际取回2026-10-13。               |
| `adaptation2025.pdf`；[市适应年报](https://adaptacepraha.cz/wp-content/uploads/2026/02/Vyrocni_zprava_2025.pdf)                                             |  6001851 | `afaa406365dd7ecd30cee94666804b8258ce766eb01be74df1bfe610caf93eb1` | 观察2025；正文2026-02／市议会2026-02-09批准；已完、近完和准备状态分别读。 实际取回2026-10-13。                 |
| `households2025.pdf`；[ČSÚ住户](https://csu.gov.cz/docs/107839/2a7effd9-826a-a916-69d7-4e22ea583c4f/Zivotni_podminky_2025_Praha_fin%C3%A1l.pdf?version=1.0) |   332558 | `a85f90d0a9b1802576f85eef8cc5dd338794ad4ec80fa9d9864f55a00a2fc128` | 发布2026-04-08；抽样2025上半年／收入2024；行政Prague住户加权，不是全535公民／中位账单。 实际取回2026-10-13。   |
| `bis-annual2024.pdf`；[BIS2024](https://www.bis.cz/public/site/bis.cz/content/vyrocni-zpravy/2024-vz-cj.pdf)                                                | 29596315 | `054f565dd15dabf855f5bd334d2920fbd8c2a6a0fce0a296607980ee328e3171` | 观察2024，另含2025事件context；正式目录首发2025-07-10；当地节点及全国机制。 实际取回2026-10-13。               |
| `bis-annual2025.pdf`；[BIS2025](https://www.bis.cz/public/site/bis.cz/content/vyrocni-zpravy/2025-vz-cj.pdf)                                                | 31328669 | `bbd78018dae66fa7258e594f8af100adee74b1e2df816fc01702a7d9fbb4a26d` | 观察2025，2026导言／制裁另列；正式首发2026-08-27；国家低威胁及证实限制，不是当地事件率。 实际取回2026-10-13。  |
| `food-bank-national2025.pdf`；[食品联邦2025](https://www.potravinovebanky.cz/uploads/dms/pdf/6a2004ae277ef699586774.pdf)                                    |  3581100 | `b41f4af0756d99474a304b4d929a5e8203b55a5d5edf666f53096b028478995e` | 观察2025；原入口确实链接，独立首次公开日未核；2026-02-26关联新闻不是PDF时间认证；全国量。 实际取回2026-10-13。 |
| `food-bank-prague-current.html`；[Prague食品银行](https://potravinovabankapraha.cz/)                                                                        |   197980 | `b2a5d6c79034c7f75e59f8ddae2579fd0626a90e1f8d377510838acc15eee65c` | 当前页整页首发／修订日未知；帖子日不等整页日；78000人数窗口／去重未知，覆盖超535。 实际取回2026-10-13。        |
| `food-bank-network-current.html`；[食品联邦地域入口](https://www.potravinovebanky.cz/kontakty)                                                              |   134874 | `4816edd69f9eeb1aef94f246e86e764398d9f3814125a4343595f00605c2a833` | 当前页整页日期未知；多银行服务地域／真实入口，不证明每个家庭已获助。 实际取回2026-10-13。                      |

### 复用原件身份

以下保持原取回 **2026-10-12**，本次读取／解释复核为2026-10-13，未重新抓取合格原件。主原件目录为 `/private/tmp/cci-global/prague/`，临床八项为 `/private/tmp/cci-global/prague-clinical/`；原首次公开未核的年报／当前页仍为未知，不把取回或生成日当首发。观察与版本资格详见上文及[原临床日期表](cci-prague-clinical-review.md#原件与日期核验)。旧入口、直接报告和新闻分别保存，不以入口哈希替代报告。

| 原URL／原件                                                                                                                                                                                                 |    bytes | 原SHA-256                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------: | ------------------------------------------------------------------ |
| [复用原件1](https://www.pvk.cz/o-spolecnosti/zakladni-informace/)                                                                                                                                           |    24309 | `a7c75e86b77285bf445d042addad5ace8e64d2a290e2e2aebdfe7338128143cc` |
| [复用原件2](https://operatorict.cz/informace/vyrocni-zpravy)                                                                                                                                                |   302882 | `449a09fdb7bdc3bd4045a500179c5fc7ce86e6e81efce924c29b0318d2080034` |
| [复用原件3](https://cuni.cz/UK-15927.html)                                                                                                                                                                  |    60854 | `c4f0e594194b2e64097861953888487eec881a1a2504308bbb9942c9f436960c` |
| [复用原件4](https://www.pvk.cz/res/archive/593/266356.pdf?seek=1785753419)                                                                                                                                  |  8585021 | `0a2e61f4ed02f494959374970b2c0ed07b450407d57468306cfaff4796a67e87` |
| [复用原件5](https://www.pre.cz/Files/profil-spolecnosti/o-nas/vyrocni-zpravy/annual-report/annual-report-2025/)                                                                                             |  6653276 | `247f19da02bb25ad22d31e338edbb3adbb8a5d3ebb4371b35fab0f1443988cb3` |
| [复用原件6](https://www.pvk.cz/vse-o-vode/pitna-voda/)                                                                                                                                                      |    72350 | `999b1a7ea804c8dfd6e6336f22cc4fa01e816ec2dd3f6d32143303e961e1b375` |
| [复用原件7](https://framerusercontent.com/assets/9GZirwJg3wXyQTJwbaaT9xGE9w.pdf)                                                                                                                            | 17027617 | `60b90bf221a7e4bebe58013a4811f4a77e1b119fb5ade7af982baad211ff1bec` |
| [复用原件8](https://cuni.cz/UK-15927-version1-084.pdf)                                                                                                                                                      |   450373 | `bcf715196cd08e70ec9c37e62f74b26f7b861cf12f950703ef33cdcf32ac83fb` |
| [复用原件9](https://www.pvk.cz/res/archive/899/266329.pdf?seek=1785142239)                                                                                                                                  | 13533365 | `e0be829e819f68f93a88148c5f4d4e4531b6c03aa5411975d565d366731c2672` |
| [复用原件10](https://fit.cvut.cz/fakulta/informacni-deska/vyrocni-zpravy/vyrocni-zprava-2025.pdf)                                                                                                           | 13322186 | `2bb0f57237c9b82de58d3fdd03ef6d8cc9a60918d0f6e5122c4bc70b8c797f18` |
| [复用原件11](https://www.pvk.cz/aktuality/pruzkum-spokojenosti-se-sluzbami-pvk-je-spokojeno-96-procent-respondentu/)                                                                                        |    22951 | `7ec333a8b804f8159d60b25f954b62bec246f9e2009f2bc25a91f2d0aab96349` |
| [复用原件12](https://www.prg.aero/en/return-record-numbers-prague-airport-handles-close-178-million-passengers-2025)                                                                                        |    54042 | `37ea3d33ba5756afc1ff09f026a5ba9d4278be7374b872b837494c99a3e6f792` |
| [复用原件13](https://www.sshmp.cz/aktuality/vypadek-proudu-v-praze-4-cervence-2025-neohrozil-chod-klicovych-slozek-sshmp-byla-pripravena)                                                                   |    32052 | `ba105e3947e8b3d74994112bf6b8ce6de38dff1679e48a60e390619ab6e26343` |
| [复用原件14](https://www.praha7.cz/vypadek-elektricke-energie-v-praze/)                                                                                                                                     |    56737 | `af382ff4434d6e7b51402d48394375580d10c86bbcea3d90e5b440a152690fc9` |
| [复用原件15](https://www.ptas.cz/aktuality/vypadek-dodavek-teple-vody/)                                                                                                                                     |    29468 | `40a283966a1b0ed2694620f228d7b6256628fe311250eda218a551dc0ff16600` |
| [复用原件16](https://www.csas.cz/en/faqs/how-do-i-send-money-abroad)                                                                                                                                        |   146437 | `3c7bb8e3508a38594e4379f69a7371b58db49e80e4c20d41c7413aaefb55fc38` |
| [复用原件17](https://www.csas.cz/cs/o-nas/pro-media/tiskove-zpravy/2023/05/04/mobilni-george-umi-nove-odeslat-zahranicni-platby-i-v-jine-mene-nez-v-eurech)                                                 |   119318 | `839bc04d2e2c92ce28b7d06623631a4c780b471b35f04ab92dfbbaff7c19e6d7` |
| [复用原件18](https://operatorict.cz/novinky/dynamick%C3%BD-svoz-skla-se-v-praze-11-osv%C4%9Bd%C4%8Dil-hlavn%C3%AD-m%C4%9Bsto-jej-proto-roz%C5%A1i%C5%99uje-i-do-dal%C5%A1%C3%AD-oblasti)                    |   307032 | `f82963247d89eb80956342be8d8bfdda70fe77da8aa2ff4ea9cb1afb36e5d63d` |
| [复用原件19](https://www.vfn.cz/wp-content/uploads/2026/02/Cekaci-doby-2026-v2.pdf)                                                                                                                         |   190878 | `b65858341e56b7ccc46d8311c323ad54fa46fd10105b9260f4466a615d3ba83e` |
| [复用原件20](https://www.vfn.cz/wp-content/uploads/2025/09/TZ-KOC-a-nove-denni-stacionare-Onkologicke-kliniky-29-9-2025.pdf)                                                                                |   314445 | `2082d3413d5bc577466fb85e4ec25d7c31b50b3f9e9ef1e20c9fa2092c13449f` |
| [复用原件21](https://www.vzp.cz/pojistenci/informace-a-zivotni-situace/naroky-pojistence/zdravotni-sluzby-hrazene-ze-zdravotniho-pojisteni)                                                                 |    49501 | `13ac41021acb394ebeb84c72558c960ced35b2727e11203a057ed485ead67d72` |
| [复用原件22](https://www.uhkt.cz/soubory2/vz-25-online.pdf)                                                                                                                                                 | 33591492 | `e4f891b7e9580fd2461e1caf8e35e4c8315da4c5ad953f8b24b3feb0d8f8d6bf` |
| [复用原件23](https://www.hematology.cz/wp-content/uploads/2023/01/20-Bunecna-terapie-CAR-T-verze-01-2023.pdf)                                                                                               |    84287 | `8413dd7ab844c14adde16df95049858b0211bdb173aa719ffdbce5d62dbcab4f` |
| [复用原件24](https://sukl.gov.cz/wp-content/uploads/2024/07/CAR-T-pripravky-Riziko-sekundarnich-malignit-z-T-lymfocytu.pdf)                                                                                 |   141644 | `d607aef1950a7456bb497d02e9398c36ae844514121b20cd424c988f6d3cd6fb` |
| [复用原件25](https://sukl.gov.cz/nezarazene-cs/vyjadreni-statniho-ustavu-pro-kontrolu-leciv-k-moznosti-hrazeni-biologicke-lecby-alzheimerovy-choroby-dle-%C2%A7-16-zakona-o-verejnem-zdravotnim-pojisteni/) |   120148 | `88945791a9aa4346a7ddfbfa0c8a85845e7257d7a2b95e747c1272c521a5cc05` |
| [复用原件26](https://www.czech-neuro.cz/content/uploads/2026/07/bez-kodu_stanovisko-ns-biologicka-lecba-alzheimer_23_6_2026.pdf)                                                                            |   759657 | `37ccaf7507643bea2ea851a5190ac603db0c302299b8812541ec47d19383cb98` |

德国法律路径复用全部公民目录中的 `other_eu_citizen_to_germany`，不是中国技术工作国家签证路径。共享原版法律账本SHA `0213b57c376d2fa07d77127a8a88c147ef5a45e6b791fcdb39ea46ae0e493f6e`，不将随后共享文件修改当原版本：`/private/tmp/cci-global/exit-laws/aufenthg-full.html` 979856bytes／SHA `035c430b7411f9bd8bb547aa4d6e0c1ade1e52c89089ba55b553977cf5f831a6`，[AufenthG](https://www.gesetze-im-internet.de/aufenthg_2004/)；`aufenthv-full.html` 438245bytes／SHA `88be848b6960d1a6f4ee61f3f0cde930f9cb5a1c3fe188bf6f937f6872e62938`，[AufenthV](https://www.gesetze-im-internet.de/aufenthv/)。法律的当前归档／版本与EU公民适用说明保持原法律审阅，不能把德国第三国签证入口要求套给捷克公民，也不能把EU自由流动推成无条件长期居留、福利或所有资产合法汇出。

### web-only与失败诊断

| 入口／读取资格                                                                                                                                                                                                                                                                                                       | 实际日期／诊断                                                                      | 有效原件身份与采用界限                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [市洪水2024-09-18](https://bezpecnost.praha.eu/planovane-akce/aktualita-a-planovane-akce_18_9_2024-0)                                                                                                                                                                                                                | 2026-10-13；web索引有效原正文，curl HTTP200只返JS壳                                 | 正文bytes／SHA null。2121bytes／`c3d162bd2d008a40e8236eafa74ea76ffd8bc5c3ef7a05611637ccce37f58104`仅壳诊断，排除有效原件；部署与未来拆除分开。                    |
| [市河流2023-12-25](https://www.praha.eu/web/praha/w/hladina_vltavy_a_dalsich_rek_se_zvysila_3659743)                                                                                                                                                                                                                 | 2026-10-13；urllib本机issuer校验失败；web原文可读                                   | 正文bytes／SHA null；预测流量、未来架设仅历史context，不当实际成功保护。                                                                                          |
| VFN2024／BIS2024 PDF同上述有效URL                                                                                                                                                                                                                                                                                    | 2026-10-13；urllib分别本机证书链失败／HTTP466；后正常TLS curl完整成功               | 早次失败无有效原件SHA；完整后次以上表身份为准，不视护理／安全／透明度缺口。                                                                                       |
| BIS2024／2025 PDF web读取                                                                                                                                                                                                                                                                                            | 2026-10-13；超过web读取10MiB能力                                                    | 不影响已完整curl取得原PDF；核心页已本地目视，读取工具限制不是公开失败。                                                                                           |
| [内政部2025安全报告候选入口](https://mv.gov.cz/bsmv/soubor/zprava-o-situaci-v-oblasti-verejneho-poradku-a-vnitrni-bezpecnosti-na-uzemi-ceske-republiky-v-roce-2025.aspx)                                                                                                                                             | 2026-10-13；web404，未取得有效原PDF                                                 | bytes／SHA null，不采用其统计、不据失败推安全恶化。                                                                                                               |
| [OICT2026-07-02冷点地图](https://operatorict.cz/novinky/praha-spou%C5%A1t%C3%AD-mapu-o%C3%A1z-chladu.-obyvatel%C5%AFm-pom%C5%AF%C5%BEe-naj%C3%ADt-%C3%BAlevu-b%C4%9Bhem-hork%C3%BDch-letn%C3%ADch-dn%C5%AF)、[警方2025-06-23站点威胁](https://policie.gov.cz/clanek/vyhrozoval-utokem-nejen-na-vlakove-nadrazi.aspx) | 原有效web读取2026-10-12，本轮复用                                                   | bytes／SHA null；真实可用指引／威胁处置，不宣称已测降温或爆炸已发生。                                                                                             |
| [BIS正式年报目录](https://www.bis.cz/vyrocni-zpravy/)、[2025报告首发页](https://www.bis.cz/vyrocni-zpravy/vyrocni-zprava-bezpecnostni-informacni-sluzby-za-rok-2025-8a6a912d.html)                                                                                                                                   | 2026-10-13有效web；首发资格2025-07-10／2026-08-27                                   | 入口bytes／SHA null，PDF正文身份另核，不把入口作另一次独立安全观察。                                                                                              |
| Motol认知入口、VFN质量／等待入口、VZP急诊规则／2026-06-02 CAR-T发布、EMA Kymriah                                                                                                                                                                                                                                     | 原有效web读取2026-10-12；原临床复核记录Motol403、EMA PDF429／读取失败及ÚHKT早次超时 | 保留原[临床读取与失败表](cci-prague-clinical-review.md#原件与日期核验)；无有效字节的页面／早次失败不填SHA。当前页／截止适配推定必要，未把读取失败当患者无法获得。 |

本轮八个有效新增响应、复用26个既有响应和有限web-only原文已达到辨档停止点。保留主档、真实反证及可撤回推定；下一事实只需能改变某条具体通常获得／替代／剩余重要性连接，不要求完美全城市数据，也不再添加同类报告来稀释冲突。
