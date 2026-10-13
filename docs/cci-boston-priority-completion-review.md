# 波士顿优先补审：八维能力、真实交付与剩余限制

证据截止 **2026-10-10**，本轮复核／新增取回 **2026-10-13**。对象为 **Boston eFUA7347** 的美国公民、通常长期居民、当地中位收入与通常医保。复用[既有案例](cci-local-2026-boston-case.md)、[原案例账本](data/cci-local-2026-boston-case.json)的 `sourceSnapshots`、`clinicalSafetyReview` 和边界，原取回2026-10-12保持不变。遵循[共同锚点](cci-global-scoring-rubric.md)与[TEC一致性](cci-technology-tier-consistency.md)，不增加逐户完美测量、完美中位账单或全功能区当年压力测试硬门槛；原件少或研究者取回失败不扣城市能力。

**建议：原PCS／ISR／LON／TEC／OPT条件性60可维持；RES／MED可补条件性60，均保留40替代；GSS主null，条件性60仅作明确假设下的敏感情景。** 完整八维／31项已经逐项审查，但尚不能将GSS敏感情景默认回填。原权重贡献为51，GSS15%未定，数学域 **51—66、无全八维中心**；接受GSS另列的整维推定后才有全八维条件中心60。域不是可信范围或候选排除上界，未知不重归一化，也不管理全球goal。

## 空间、来源与有界停止

全GHS旧FUA9031原包SHA `9934364827132232df67e8984768fb30865a846f5a786db999d49fc37fb7698d`，既有Boston／Cambridge／MIT／MGH／Logan五个近似点均唯一相交7347，见 `/private/tmp/cci-global/boston/boundary-points.json`。它们不认证全市、医院网络、真实输注地块、服务居民或所有厂场。Boston、Dorchester、区域电网、全州抽样、东马萨诸塞食物配送各自范围保留；BMC／Carney的实际机构地点及地域代表性仍为有依据、可撤回的适配推定，不凭机构名统一给全FUA覆盖。

本轮每个待补维度至多两轮有辨别力补查：安全核司法原发布、联邦实际当地反恐、州区域保障；资源核原食物调查／实际仓储交付及电网真实运行；医疗核州原获得／负担调查、医院质量原表与地方关院后的实际运输／邻院变化。沿真实已解析的报告／方法页补读不继续同页重试。GSS三类入口仍未能解决当前整维影响时，交付其最小未知链，而不循环寻找“无风险”证据。旧五维用既有合格原件及此次相关实绩审查，不另重采。

| 维度／权重 | 主判断 | 依据与可撤回替代                                                                                                                                                                                                                    |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PCS／15    | 条件60 | 已建海岸措施、实际可用降温，加区域寒潮期间真实电网运行；不当全户防灾或独立备援。通常保护／空间延续接受，40需重要暴露和实际缓解不足；更强多危险保护可80，必要推定拒绝null。                                                          |
| GSS／15    | null   | 历史实际组织／恐怖暴力、跨机构当前措施与机场战略节点已有依据；当前区域外溢／现实影响适配仍未闭。条件60仅接受有限历史／当前措施对主要风险具有代表性且现实影响通常有限的推定；不能由无UCDP、普通犯罪或获拨款独推。                    |
| ISR／15    | 条件60 | 实际记录流程改善／辅助、关院后实际指挥协作／救护增加；警务排除、群体与医疗残余保留。执行通常运作的推定可维持；不是方案已全部恢复，40需有重要执行失效，80需更强群体触达／恢复结果，拒绝null。                                        |
| RES／10    | 条件60 | 实际处理水／换管、食品仓储配送和真实寒潮bulk运行；铅高风险样本、食物／取暖负担和辅助仍不足的原调查共同保留。通常基本供给及能力代表性可支持60，实际负担在缓解后仍主导可40；多源／通常负担／共因缓解更强可80，拒绝null。              |
| MED／15    | 条件60 | BMC多种必要病种质量比较、通常获得／保险调查、邻院接诊和实增救护路径，补强常规系统；关院与费用、初级护理及压力短板真实存在。接受代表性／延续且一般必要护理通常可得，60；残余形成明显获得断点则40，80须更强质量／连续备援，拒绝null。 |
| LON／10    | 条件60 | 原可信人体／FDA／CMS路径与院方实际采用／本地安全观察可维持疾病限定准备度。此次通常医保调查不补全特药净费、也不将一般费用困难自动降该路径；通常合资格／适当监护／可承担及地点推定拒绝null，具体获得断点可40，多条成熟获得可80。      |
| TEC／10    | 条件60 | 真实许可／创业和居民设备／技能辅助；招聘、网络费用／技能在缓解后仍重要的原假设仍有实际依据。没有高档未知封顶；更强多主体／实际缓解可80，真实产用断层才40，拒绝null。                                                                |
| OPT／10    | 条件60 | 真实接驳／有限远端办理、附条件美国公民居留申请和账户汇出、公共通信可维持。不能默认所有航司／账户／居民已合资格，交通通信及资金通常可承担可用推定必要；真实重要阻断可40，独立备援可80，拒绝null。                                    |

## GSS：有实际历史影响与当前措施，完整主档仍未闭

[DOJ2025-05-22原发布](https://www.justice.gov/usao-ma/pr/ms-13-leader-currently-serving-federal-prison-sentence-rico-conspiracy-pleads-guilty)web正文记录MS-13地方头目对 **Chelsea2010年谋杀**认罪，原已服2018年RICO判刑；2025司法处置不是2025新杀人，认罪与已判刑各自不同，Chelsea行政名也不独自认证7347案发地块。它确有组织暴力及实际处置，不能拿普通犯罪率代此子支柱。本地2534bytes只是挑战，不算有效DOJ新闻哈希。

[FBI Boston2025-04-24原说明](https://www.fbi.gov/contact-us/field-offices/boston/news/the-fbis-joint-terrorism-task-force-turns-45)有Boston／Cambridge等跨机构实体和Logan自2011年机场反恐节点，地方办事处赞助五个JTTF是较广辖区，不全归7347。原文记录2013马拉松爆炸及MIT枪杀、若干已判刑／阻止的涉外国恐怖组织或爆炸图谋；外州城市目标及处置不算本地袭击。机场历史9/11起飞与马拉松真实损害说明战略节点和集会暴露，但不当2026发生频率。日常反恐能力自述与已结个案支持现实缓解，不保证全当前威胁均被阻止。

[州主管区域保障说明](https://www.mass.gov/info-details/homeland-security-regional-advisory-councils)web原文分五区并明确Metro Boston UASI，描述联邦申请／区域项目机制；它是实际制度范围，**每年提出项目不等完成防护或当前低损害**。三个官方入口共同补强组织暴力和战略／跨区合作，但没有足够当前实际外溢影响与措施效果的整维连接。本机403或web一次内部错误均不解释为当地披露／居民服务缺陷。

**主null的缺口是影响和适配，不是必须完美零事件调查**。若接受历史处置、持续当地跨机构能力对主要组织／外溢／战略威胁具有代表性，当前影响通常有限、风险仍受缓解但重要，则 **条件60**是可辩敏感情景；这些是研究推定，不能写成查证了2026全区低影响。40须当前重要组织／外溢／战略风险与生活／通道的显著约束，历史惨剧不直接补该档；80须当前城市与区域的低影响及关键威胁／响应有共同实证，未知不自动封顶。下一最小辨别证据是截止前本区／适配区域实际威胁影响与已实行响应的相连记录，能区别残余通常有限与明显约束；不再追加同类历史案件凑数。

## RES：供给、实际帮助、重要负担与方法冲突

复用[MWRA2025处理水／Boston主管信函](https://www.mwra.com/your-water-system/drinking-water-quality/annual-water-quality-test-results-main/2025full)有效原件：2025秋高风险含铅管住户样本90百分位22.5ppb、4/33超过15ppb行动值；不当全住户铅暴露或疾病率。2025近1001检查、约448公私管替换和免费替换是实交付，2032未来目标不当当前全部完成。水源处理与户内铅是不同链；旧首次公开日仍按既有截止前可用推定，拒绝即相应未知。

[GBFB2025原报告](https://www.gbfb.org/wp-content/uploads/2025/06/GBFB_Food-Access-Report_2025_final.pdf)调查 **2024-11—2025-03**、问此前12个月（题名2025，主要结果标2024），3000多州内成人，在线配额／权重含收入、年龄、地域等，方法与USDA电话／面访不同。全州37%家庭food insecurity、Suffolk49%是各自加权估计，县不等FUA或本画像中位收入／公民；食品短缺程度和全年任一时段也不是持续断供。**原第6页正文62%与Figure4的2024值58%冲突已目视**，不择有利值、不借此算分；第7页图49%食物不安全家庭有取暖／电费困难，而食物安全家庭10%，单位不是所有居民。辅助政策和食品银行配送不是困难自动消失。

沿同一原研究入口补读[2026结果](https://foodaccessreport.gbfb.org/)、[原方法](https://foodaccessreport.gbfb.org/methodology)、[解释页](https://foodaccessreport.gbfb.org/the-state-of-food-insecurity)，观察标2025，40%全州家庭、25% very low security；方法为匿名在线、3000多成人、低收入过抽、ACS配额与加权、清除不完整／质量异常等。2019—2021六项成人量表与2022—2025十八项家庭量表改变，不能全当同一长期序列。**30%家庭虽用辅助仍食物不安全、12%借辅助安全**共同保留，不把前者忽略，也不说援助没有作用；非中位收入本人概率。当前网页标2026但首发具体日／截止历史字节未独核，采用截止前可用假设，不从爬取日期改成新2026观察。未拿健康成本模型外推美元数当实际家庭付款或当地医疗损失。

[GBFB FY25实际原年报](https://annualreport.gbfb.org/fy25)区分南Boston实体仓储与东马萨诸塞服务网络：已配送110多百万磅食物（其中56.8百万易腐、31.4百万新鲜蔬果）、约92百万餐，600伙伴／190市镇不是本区独立居民数或去重账户。实际冷藏／配送与社区网络提供供应链替代；三年未来补助额不当已全部兑现。报告未独标首发日，财年窗口／全州与网络覆盖仍须适配，不拿配送量证明通常可负担或区域危机全部供给独立。

[ISO-NE寒潮原更新](https://isonewswire.com/2026/01/23/iso-ne-issues-cold-weather-watch-ahead-of-winter-storm/) **1月23发表、实际后续更新至1月27**，明确1月25日20,182MW需求峰值期间bulk电网可靠；1月25日仍非系统紧急状态，202(c)临时环境／许可豁免批准至1月31与谨慎预警保留。预计容量是预测，进口／备用是操作工具；批准豁免不等所有机组实际启用。真实运行支持能源能力，但区域bulk可靠不等Boston家庭配电／取暖不断、低票价或全年保障；只有预测的90/10负裕量不作实际停电。前述实际热／电费用困难是另外的负担反证，不能只看供电宏观量。

**条件60**可由实际通常水／食品配送与渠道、电网运行及辅助形成基本供给能力，同时剩余铅管、食物营养／能源费用、冷天气与网络依赖是重要短板；接受这些主要路径对通常中位居民／7347有代表性、延续到截止日及通常可承担的推定。没有要求逐户收入账单或独立全区压力实验。**40**是有依据的替代：调查中援助后仍食物／取暖困难的含义适配通常画像，且该残余对取得必要基本资源已经形成明显约束；不能简单用40%乘权重或默认所有家庭都是困难样本。80须强通常获得与更充分多源／共同失效缓解，拒绝主要代表性／通常负担／时间适配为null。最小补链是通常居民在真实水管／食品／能耗与辅助资格下的实际获得和残余重要性，而非地方GDP／更多仓库吞吐。

## MED：常规质量、支付及压力替代均有具体补链

[BMC自公开原质量页](https://www.bmc.org/vi/node/144982)完整HTML已取：2020-07-01—2023-06-30的五种30日调整死亡与多种再入院比较，有HF better、其余主要死亡及再入院 no different等分类；**12.60%、11.90%等为National Average列，不是BMC本院死亡率**。2023-04-01—2024-03-31感染比较中CLABSI／C.diff better、其余所列no different，**1是National Ratio，不是本院SIR**。这是院方复述CMS/NHSN比较，原观察窗、风险调整分类、选病和未公开本院分母／完整模型保留；不用“A”奖项代临床，也不把no different写成零风险。BMC常规质量、自述每例死亡审查、社区出院衔接、必要卒中／癌症服务与Medicare／Medicaid认证支撑有限真实能力，不把认证单独当治疗结局。旧量表向2026的延续和全FUA通常质量代表性是明确推定，未读取当前CMS底层患者数据或声称全质量已核。

[CHIA2025原医保调查](https://www.chiamass.gov/assets/docs/r/survey/MHIS-2025/2025-MHIS-Report.pdf) **2025年1—4月调查、12月出版**，5365家庭／5365所选居民与家人（518儿童、3032非老年成人、1815老人），总体回复率3.9%（预付手机1.2%／603、地址抽样10.6%／4762），收入为2024家庭口径。97.9%当时有保险、92.3%过去12个月家庭持续保险及近九成有PCP支持通常支付／获得路径；保险不等所有服务或药品已给付、美国公民不等已Medicare，州值不是Boston当前发生率。原物理63／印刷62页 **28.4%本人或家人过去12个月因费用未得自认必要护理**；专科10.3%、医生10.0%、处方9.9%不相加，因为可多选。服务自认为必要不完全等同临床审定的救命护理，但是真实获得反证，不由低回复率全部抹掉；完美账单不是接纳此类证据的前置。

[市Dorchester原工作组2025-04-22报告](https://www.boston.gov/sites/default/files/file/2025/04/Dorchester%20Working%20Group%20Report%204.22.2025.pdf)补必要压力链：Carney **2024-08-31实际关闭急诊／住院**，不是将来计划，2024年12月周边30分钟内3350日均occupied med/surg beds不是3350空床／备用容量；相邻院实际收治与急诊量增加，而非只列医院数量。概括页称transport增加20%，**原物理32／印刷30细分**：Dorchester2024-09-01—2025-03-16事件15905／前期15924，Priority1响应−2.5%、transport+14.1%；Mattapan3043／2876、响应+6.8%、transport+7.6%。不同范围／统计没有统一底表，**不把20%覆盖或修正细分值、不混响应到场与运输到院、不自行加权**。下一页BI Milton月分及“December2024／January2025”表述有时间不完全一致，未将其1073次当单一月份精确变化；报告还明确2025Feb ED量+16%、周边院压力与boarding。

同页确认 **已额外布署24小时救护车、协商保留车库和无线电、实际事故指挥与追踪调整**，对真实失去服务形成缓解；恢复全部Carney服务或所有建议在2026已完成没有依据。现行[州Steward问答](https://www.mass.gov/info-details/steward-health-care-patient-and-community-faqs)web仍明确Carney／Nashoba关闭、六院已转新运营人，指导实际转诊／保险联系及周边设施；Nashoba外区和其他院整体不自动继承7347。急诊替代与保留EMS是真路径，院内工作人员／移交不等每名居民全部无等候。

**条件60**可辩且不要求全当前质量／压力试验：必要常规病种质量原比较、广泛保险／PCP、实际周边接诊及实增EMS与社区路径一起支持系统仍能提供广泛护理，当前持续／可承担及代表性明确。支付、初级护理、boarding与丧失邻近急诊属于重要短板，不能因只有有限质量样本统一记null。**40**须接受费用未得护理和关院后额外运输／群体障碍在具体替代后对通常中位居民仍形成明显必要护理断点；不能由关院一次、复杂风险或调整率单机械降档。**80**需更强常规质量、专科转诊及压力连续备援；**null**只在主要地域、通常支付、历史质量延续或替代有效性推定不被接受时撤回。最小后续不是所有医院完美2026数据，而是已记录短板经实际替代后对通常居民的必要护理获得仍有多重要。

## 其余五项60的再检验

**PCS60可维持**：原海岸清单已经把Langone／Martin’s／McConnell实际完工与待建分开，极端热入口有时间／老人残障交通条件；本轮真实寒潮bulk运行仅补区域基础服务能力，不证明本区所有家庭配电、风暴洪水或停电降温。主要保护通常有效、已审危险不代表全部未缓解大风险及空间延续假设仍必要。不会只因缺全户风险审计撤回既有可辩60；真实主要防护失效须重审40，而非见计划自动80。

**ISR60可维持并保留反证**：City Records2025改善均值和675积压关闭是实绩，警务排除与78费用估计不是完整政府测量或78实际收费。原实际数字辅助是执行触达，本轮关院后跨机构协调／实增救护支持适应和有限服务恢复，**不把医疗压力当已消除的治理成功**。通常制度有效、有限机构／行政区域代表性与日期假设可维持；新实际必要护理残余作为MED主要解释，不重复机械加减多维。

**LON60仍为疾病限定条件判断**：原院方ATP超过1000实际接受两单抗、2023-12-04—2025-10-28回顾性安全队列324识别／318纳入／98 MRI-ARIA，与FDA许可／更新MRI及CMS条件分别支持链。原摘要未独审全部排除／给药坐标，本轮没有声称完成全文审计；公开ARIA不等严重症状全部或不当护理。CHIA基本保险与费用困难不能替代方案净支付，也不自动否定当前适当监测／合资格普通居民通常可承担的原推定；不能悄悄把补充保险已买写入通常画像。共用CMS适应症／登记和共同保险条件不是全民／每药已付。若已有一般费用困难被具体连接成单抗合资格居民重要获得断点，可重审40；必要方案获得／监护／地点推定拒绝null，同杭州40来自具体当前费用放弃证据的逻辑一致。不得拿某研究／试验名气补MED。

**TEC60仍有真实短板依据**：MIT FY25行政原件90许可／47选择权／38新企业与十二招聘空缺／重组不是所有前沿技术只一家，也不把许可当销量。数字原计划有实际100设备、另100进行中、两BHA计算机室重新启用；1109代表抽样与508社区样本不混成1617代表分母，24%家网不负担得起是2024调查自报。招聘、支付／技能在已帮助后仍重要的推定有反证支撑，因此不是因多机构／80未知封顶。若其余产业能力和实际辅助证明残余不再重要，可80；不足以证明产用断层的未知不40。正文10-09但HTML发表／更新10-11的Inclusion Week仍排除，新增汇总不截止后回填。

**OPT60可维持**：六月已开的Framingham远端办理是限定航司／条件试点，2025Logan Express270万旅次是运营事实而非独立居民／备用机场。美国公民德国§41只准附条件境内申请；用途、资源、获批与工作资格须区分，不能借该程序默认为已获长期工作权。Chase2026-06-14费用表提供合资格账户汇出；Secure Checking不支持汇出，交换差价／中间行费和资金合规不消失。真实公共通信、一般交通／账户路径通常可用可承担的必要推定维持，不要求已知每户成功转账；同样不能把公共Wi-Fi当全压力独立路径。医疗费／食品家庭困难是部分人实际资源反证，尚非已核跨境账户禁止或所有普通居民不能退出；如适配后形成显著退出约束则40。

## 全部31项状态与复算界限

| 维度 | 子支柱状态                                                                                                          | 相对既有案例的实质进展／界限                                         |
| ---- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| PCS  | `heat_humidity` partial；`flood_sea_level` partial；`geophysical` context；`severe_weather_wildfire` context        | 增区域真实寒潮电网能力context，不冒作家庭全危险保护。                |
| GSS  | `organized_violence` partial；`regional_conflict` context；`strategic_exposure` partial                             | 实际历史组织／恐怖暴力及当前协作；区域当前影响整维连接未闭，主null。 |
| ISR  | `governance` partial；`adaptive_capacity` partial；`social_cohesion` partial；`emergency_recovery` partial          | 原流程／群体辅助与实际关院冲击响应；不是已彻底恢复社区护理。         |
| RES  | `water` partial；`food` partial；`energy` partial；`supply_chain` partial                                           | 补原食物负担／帮助、仓储配送和真实bulk寒潮运行。                     |
| MED  | `access` partial；`routine_quality` partial；`specialist_capacity` partial；`system_continuity` partial             | 多常规必要病种原比较＋实际关院／替代与通常支付；不从单病试验补系统。 |
| LON  | `translation` partial；`trial_maturity` partial；`regulatory_adoption` partial；`resident_access` partial           | 旧原件与方案假设保留，未伪称新全研究、费用或MR监护审计。             |
| TEC  | `knowledge_output` partial；`industry_density` partial；`digital_infrastructure` partial；`diffusion` partial       | 实际产出、设备／辅助及真实短板保持，截止后记录排除。                 |
| OPT  | `transport_redundancy` partial；`legal_mobility` partial；`asset_portability` partial；`network_continuity` partial | 共用人物法律／账户版本，真实接驳／公共通信，有条件而非全民批准。     |

31项 **28 partial、3 context、0 complete**；状态只标证据充分性，不平均换分。七维60贡献 `9+9+6+9+6+6+6=51`，GSS未定。RES40敏感为49—64、MED40为48—63，两者同时40为46—61；接受GSS60的各条件情景中心分别60／58／57／55，需根代理统一验收，不能先填生产矩阵。任一原五维的必要推定撤回，其贡献移至未知原权重域，不替零、不以数学上界排除其余候选。

## 原件、目视和失败账本

新增 `/private/tmp/cci-global/boston/priority-completion/`，有效原件均2026-10-13取回，正常TLS，无绕过／联系机构。HTML更新时间与观察年度、标题财年、法规有效期分别列；当前字节哈希不证明截止日逐字快照。PDF原页已目视：CHIA物理63／89（印刷62／88），Dorchester物理31／32（印刷29／30），GBFB物理6／7（印刷6／7）；原图文冲突与分母如上。BMC原HTML表的列头及观察窗已经完整读取，没有声称取到了CMS患者底表／当前质量PDF。

| 新有效原件／URL                                                                                                                                       | 身份／发表与观察界限                                                                   |     bytes | SHA-256                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------: | ------------------------------------------------------------------ |
| `mhis2025.pdf`，[原入口](https://www.chiamass.gov/assets/docs/r/survey/MHIS-2025/2025-MHIS-Report.pdf)                                                | 原CHIA报告；2025Jan–Apr调查／Dec出版；州居民与家庭                                     | 2,105,258 | `e63c4bf92251efd8eb1e7429b740a4cdb64dbffaf8ada58e33626ff1bc61f5d7` |
| `food2025.pdf`，[原入口](https://www.gbfb.org/wp-content/uploads/2025/06/GBFB_Food-Access-Report_2025_final.pdf)                                      | 2025第五报告；2024Nov–2025Mar采样、问过去12月／结果标2024；路径2025Jun、确切首发未独核 | 2,288,385 | `119a686fd2773ab94352829cc82fc6a8ff4d6689e7778d783226fe767f8a2414` |
| `food-delivery2025.html`，[原入口](https://annualreport.gbfb.org/fy25)                                                                                | FY25原运营年报；财年与190市镇范围，首发／截止字节未知                                  |    62,955 | `ffa065351b298efd2389180f41829e1cc35a26e3801e524f459047f2a8b2efe2` |
| `bmc-quality-current.html`，[原入口](https://www.bmc.org/vi/node/144982)                                                                              | 当前机构原表，未标更新时间；死亡／再入院2020Jul–2023Jun、感染2023Apr–2024Mar           |    81,218 | `c828e2b1c60f0345e09c3967da59ca1f704dae8577df48eedc7cb36175e3bfb1` |
| `iso-cold2026.html`，[原入口](https://isonewswire.com/2026/01/23/iso-ne-issues-cold-weather-watch-ahead-of-winter-storm/)                             | 2026Jan23发表／更新Jan27；真实Jan25bulk峰值与临时许可                                  |    63,366 | `58175192272fc1260f5726cf9d2aefd4d302c07664f658253f27d98e53b93096` |
| `dorchester-closure2025.pdf`，[原入口](https://www.boston.gov/sites/default/files/file/2025/04/Dorchester%20Working%20Group%20Report%204.22.2025.pdf) | 2025Apr22；关院2024Aug31、EMS2024Sep1–2025Mar16及邻院不同月                            | 1,586,625 | `de4dc982ddc48f07720be665c261cf53500522a4c69e5deedd51ff2b7027860f` |
| `food-current2026.html`，[原入口](https://foodaccessreport.gbfb.org/)                                                                                 | 2026第六报告，观察2025，确切首发／截止字节未知                                         |    33,781 | `71eeac45fdb9d0c2644a8566231ab27924bbf73927ca6a5f2ff66953d567f6e6` |
| `food-methods2026.html`，[原入口](https://foodaccessreport.gbfb.org/methodology)                                                                      | 同2026报告原方法，匿名在线／过抽加权，非全民行政普查                                   |    32,695 | `29180e86963237e3d18ea018748fffa9c31166fde21ac1fa49655f8215e9a7e8` |
| `food-context2026.html`，[原入口](https://foodaccessreport.gbfb.org/the-state-of-food-insecurity)                                                     | 同2026报告原解释；家庭、援助及量表改版分别核                                           |    37,695 | `eff7723e5720aa92f47f65c5b4be2c7912d1affe1930b8086cb0c0455f8fe1e5` |

复用原件不重新下载；下表保留既有首次取回 **2026-10-12**、本轮review10-13，SHA与旧case一致。

| 复用原入口／保存文件                                                                                                                                                                                | 日期／用途                                           |     bytes | SHA-256                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------: | ------------------------------------------------------------------ |
| [原入口](https://dspace.mit.edu/server/api/core/bitstreams/5e900bdc-6594-498f-9593-e7a0d783b01f/content)，`/private/tmp/cci-global/boston/mit-dspace2025.pdf`                                       | 首发2025-08-15；观察窗／范围按旧case及上文           |   911,817 | `3d4fffc232d6e416675646afdf90a0d57f4d95dc7a22629ee0d502d86dfbfb75` |
| [原入口](https://dspace.mit.edu/server/api/core/items/5be27900-1427-4688-9759-a2cca70ee275)，`/private/tmp/cci-global/boston/mit-item.json`                                                         | 首发2025-08-15；观察窗／范围按旧case及上文           |     4,841 | `42f381dbec0c8fd4fb67aefa900e7507413427841a5434bed809f75d708cd444` |
| [原入口](https://www.boston.gov/sites/default/files/file/2025/08/City%20of%20Boston%20-%20Municipal%20Digital%20Equity%20Plan%20-%2020250625.pdf)，`/private/tmp/cci-global/boston/digital2025.pdf` | 首发未知，截止前可用推定；观察窗／范围按旧case及上文 | 4,871,449 | `e3f904886057404f5fb7770a396b3212f7aa980f00d7e6d3a0bd4d237a7d9a0a` |
| [原入口](https://www.boston.gov/news/city-boston-shares-preparations-protect-residents-and-visitors-against-extreme-heat)，`/private/tmp/cci-global/boston/heat2026.html`                           | 首发2026-06-26；观察窗／范围按旧case及上文           |    80,632 | `a43113d8f919cc7acffcd3a1e43f09ed2ca5ae1139663e6f318bffc5198f6387` |
| [原入口](https://www.boston.gov/departments/climate-resilience/coastal-resilience-implementation)，`/private/tmp/cci-global/boston/coastal.html`                                                    | 首发2024-08-01；观察窗／范围按旧case及上文           |   137,511 | `2a069885c2554b5a07650121a46d4f146b607e8d3b3a1a9d18378f67923cf3f5` |
| [原入口](https://content.boston.gov/sites/default/files/file/2026/04/Annual%20Report%202025_1.pdf)，`/private/tmp/cci-global/boston/records2025.pdf`                                                | 首发未知，截止前可用推定；观察窗／范围按旧case及上文 |   796,291 | `a70df93de56aac6f48d91f3a99105453469c9b3dcec901a67910d3682b2980b1` |
| [原入口](https://www.mwra.com/your-water-system/drinking-water-quality/annual-water-quality-test-results-main/2025full)，`/private/tmp/cci-global/boston/water2025.html`                            | 首发未知，截止前可用推定；观察窗／范围按旧case及上文 |   371,764 | `3902f5c171ea5cfaed7e3c9d3eb71a84a54570e9a512e01e1108052831bbf311` |
| [原入口](https://news.massgeneralbrigham.org/en/hope-for-patients-with-alzheimers-disease)，`/private/tmp/cci-global/boston/clinical-hope.html`                                                     | 首发2026-10-09；观察窗／范围按旧case及上文           |    24,222 | `e08a45cb8787fcdd55ff9d56bf3e50cdbdca1fea05da1e464d67536f76ad74c5` |
| [原入口](https://www.prnewswire.com/news-releases/massport-opens-americas-first-remote-airport-terminal-powered-by-sita-302787251.html)，`/private/tmp/cci-global/boston/logan2026.html`            | 首发2026-06-01；观察窗／范围按旧case及上文           |   210,261 | `8e887b6b1c9f8b52222955e82ae6dddb395e8c08a94ab413b6c4583a9dd9f481` |

共用人物法律和监管／支付／资产资料保留来源版次，不复制纽约当地故障、护理或得分。下表实际位置或共享账本指向既有已核原件，不增加独立佐证。

| 共用原入口／位置                                                                                                                                                                                                        | 时间／适用限制                                                       |  bytes | SHA-256                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | -----: | ------------------------------------------------------------------ |
| [CMS](https://www.cms.gov/newsroom/press-releases/statement-broader-medicare-coverage-leqembi-available-following-fda-traditional-approval)，`/private/tmp/cci-global/washington/cms-leqembi.html`及纽约sourceSnapshots | 2023-07-06；Medicare适应症／登记／共同保险条件，不是全部美国公民承保 |  55743 | `4f62e357fbb58b44ae6f7eb238cb3e2a728dc2841245e7127e2bf0e97065c0bf` |
| [FDA更早MRI](https://www.fda.gov/drugs/drug-safety-communications/fda-recommend-additional-earlier-mri-monitoring-patients-alzheimers-disease-taking-leqembi-lecanemab)，同目录`fda-mri2025.html`                       | 2025-08-28；第三次前MRI追加，风险不能当当地发生率                    |  48310 | `a51f461d934676b41a73288137b715d620449d8c37f7a6a0933b22512b71416d` |
| [Chase2026费用原PDF](https://www.chase.com/content/dam/chase-ux/documents/personal/checking/ABSF-en.pdf)，`/private/tmp/cci-global/washington-followup/chase-fees2026.pdf`                                              | 2026-06-14生效；开户／类型／目的／合规及费用条件                     | 488107 | `69836d755532c957e9dab7bd49f8bea6f68b5eb01671bc5b58d803226b2626d1` |
| [AufenthG](https://www.gesetze-im-internet.de/aufenthg_2004/BJNR195010004.html)，`/private/tmp/cci-global/exit-laws/aufenthg-full.html`                                                                                 | 2026-07-22已核版；美国公民§41申请程序及实体条件分开                  | 979856 | `035c430b7411f9bd8bb547aa4d6e0c1ade1e52c89089ba55b553977cf5f831a6` |
| [AufenthV](https://www.gesetze-im-internet.de/aufenthv/BJNR294510004.html)，共享退出法律原件                                                                                                                            | 同版；`section41_citizen_onshore_application_germany`既有规则        | 438245 | `88be848b6960d1a6f4ee61f3f0cde930f9cb5a1c3fe188bf6f937f6872e62938` |

FDA传统批准与可信人体原来源沿[纽约病例共用说明](cci-local-2026-new-york-case.md)，原FDA公告只web有效／bytes和SHA null，不改登记为有效下载。旧临床摘要[PubMed42732414](https://pubmed.ncbi.nlm.nih.gov/42732414/)2026-08-13出版，原观察窗／324→318选择及98 MRI-ARIA沿 `clinicalSafetyReview`，本轮不再打开，不声称已读取完整论文；旧本地 `clinical2026.html`为挑战，不能使用其字节哈希作为论文身份。

| 非有效原件／有限渠道                 | 实际诊断                                                                                                                      | 使用界限                                                                             |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| DOJ原新闻，本目录`doj-ms132025.html` | 10-13，HTTP200／2534bytes，诊断SHA `0fdf688e6f3075f52c9c230c7d44b8c03676d2ec6339954082ff239a3a332272`，JS挑战／apology iframe | web原新闻有效；正文有效bytes／SHA null，不把200壳作原新闻。                          |
| FBI Boston2025原发布                 | 10-13本地HTTP403，无取得正文bytes／SHA                                                                                        | web原文有效；保留原日期／历史事件，失败不扣GSS或透明度。                             |
| 州区域保障／Steward当前原问答        | 10-13本地HTTP403，无正文bytes／SHA；web区域页一次Internal Error，但另次搜索原完整正文／Steward原正文有效                      | web-only有效，确切页更新未知，前述制度和当前关闭条件可撤回；不能说本地居民无法查阅。 |
| GBFB第六报告“完整报告”链接           | 实际解析为嵌入YouTube演示，非PDF                                                                                              | 不声称取得完整PDF；使用同owner有效结果／方法／解释HTML。                             |
| ISO首页一个click                     | 原编号不适配，未返回目标正文                                                                                                  | 不计任何来源；已核实际1月运营页足够，无同页无限重试。                                |

`source-manifest.json`记录原响应，`*.txt`、PDF页PNG、脚本为读取衍生件。事实冲突、观察窗／地域／画像适配及主null与条件敏感情景均保留；不为达到全八维中心而把GSS假设默认为已核低风险，也不要求新的完美资料才允许RES／MED有条件60。
