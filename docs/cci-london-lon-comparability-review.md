# 伦敦 LON 同锚点补审：实际疾病转化路径与旧40的代表性

证据截止2026-10-10；实际查阅2026-10-13。冻结候选 **London／GBR eFUA5288**，2026本国公民、通常长期居民、当地中位收入与通常NHS保障。按[共同rubric](cci-global-scoring-rubric.md)复用[既有八维案例](cci-local-2026-london-case.md)及[结构化记录](data/cci-local-2026-london-case.json)。本轮仅重点复核LON，其他七维原60及其条件保留；没有重新核验每项旧原件或改变权重。

**建议LON由40改为可撤回60，条件总分58→60。** 新原证把实际当地CAR-T给药、可信人体结局评价、疾病限定NHS委托支付和院方监护连接起来，符合Prague／Copenhagen对疾病转化准备度的同一60锚点。旧40可以描述已审阅的一般老龄研究仍有断点，却不能继续用这些有限研究代表整个LON。此处不声称已证明人类普遍延寿，不要求健康居民接受CAR-T，也不把已有普通肿瘤医疗整块重复记为新LON优势。[St George’s实际交付](https://www.stgeorges.nhs.uk/newsitem/first-patients-to-receive-game-changing-cancer-therapy-now-in-remission/)、[NICE正式评价](https://www.nice.org.uk/guidance/ta1048/chapter/1-Recommendations)和[NHS完整委托路径](https://www.england.nhs.uk/wp-content/uploads/2026/04/cart-service-specification-commissioning-guidance-v1.0-1.pdf)分别回答交付、人体证据和居民获得，而非仅有医院或规则。

## 原边界、病例归属与时点

原GHS包SHA `9934364827132232df67e8984768fb30865a846f5a786db999d49fc37fb7698d`，9,932,800 bytes。使用仓库GeoPackage解析读取全9031几何，EPSG4326→ESRI54009、always_xy、逐几何intersects，未只核旧候选名单。分析者近似点St George’s Tooting（−0.1755,51.4269）、UCLH Macmillan Cancer Centre（−0.1377,51.5250）、Grafton Way（−0.1355,51.5250）均匹配5288。具体记录在 `/private/tmp/cci-global/london/lon-comparability/reference-boundary-check.json`。这些不是官方测绘坐标、医院足迹、病人住址或全服务区覆盖。院方服务范围South West London及Surrey、全国England委托均不能当本FUA分母；UCLH狼疮报道的Guildford患者不改写为伦敦居民。

S01是2025-05-28发表的当时实绩；2026延续由已交付项目、当前委托文件和院方路径共同推定，不改成2026新增7例。S02在官方`2026/04`目录，但封面写12 November2025 Version3，文件名含v1.0，内部又列2025-12-11 TA1116，p6计划出版／实施仍为`[November2025]`。S03封面7 May2025 Version1.0，亦存于2026/04目录。**URL上传目录、封面版本、规划生效与实际首次公布不能强行合成一个日期**；本轮没有取得入口有效正文以证明精确首发日。2026取回这些现行官方文件不证明旧计划均已按时实施，也不证明委托修订造成新容量。S02自己说修订不预期改变提供方、服务量或人数。

W01未标版本日期，W02标updated2026-03-18却reviewdue2025-07-31，且有实质过期风险段；只在明确延续假设下使用截至本次查阅的现行路径。所有Oct13原件SHA识别此次响应，不鉴定其Oct10当日字节。本轮两轮定向补查后停止，没有为完整账单或全FUA测量无限扩搜。

## 足以改变旧代表性假设的路径

S01院方原报给出**7人已经接受CAR-T，多数缓解**，未给精确缓解人数；不是7人全缓解，也无全体转诊、排除、未达回输和随访时长分母。74岁Tooting居民Gordon在淋巴瘤后接受治疗、恢复外出活动，是当地居民真实交付例。报道说“September”开始，正文未写年份，本轮不擅自填2024；未列其产品、收入、公民身份和个人账单。细胞在St George’s采集、送药企制造后回输；已有ICU、神经、心脏团队支持，未来更多患者愿景不当已完成容量。新闻选择病例与未风险调整结局不能证明所有患者获益或全伦敦常规质量。页脚CQC“requires improvement”不能被宣传语抹掉，也不能未经单独MED审查就更改旧MED分数。[S01](https://www.stgeorges.nhs.uk/newsitem/first-patients-to-receive-game-changing-cancer-therapy-now-in-remission/)

W01院方说明2016以来已治疗数百名、混合试验与获批治疗；无明确累计观察终点，不当2026新增或居民去重。正文实际两地点承担细胞采集／门诊与强化住院监护，列多种获批CAR-T产品、专门转诊和急症热线；这些与S01、S02同读支持运行延续。其CNS最长15年联系不等于已兑现所有患者终身随访。[W01](https://www.uclh.nhs.uk/our-services/find-service/cancer-services/blood-cancers-clinical-haematology/blood-diseases-types-and-services/car-t-cell-therapy)

S05的liso-cel正式推荐是成人一线后难治或12个月内复发的特定大B细胞淋巴瘤，且自体干细胞移植被认为适合、药企依商业安排供药；不能把年龄当体能代理。NICE认为与标准治疗相比，至下一治疗或进展的时间改善，**总生存证据仍不确定**。这是审慎疾病结局评价，而非单纯标志物研究，也不是全部获准人群都得到此项NHS推荐。[S05](https://www.nice.org.uk/guidance/ta1048/chapter/1-Recommendations)

W03补充真实人体转化但不当主要公保成熟路线：CARLYSLE一期截至2025-11已治疗9名严重难治狼疮成人，低剂量首6名中的5名按标准缓解；这不是全部9名中的“83%”总体有效率。报道2026-06-12，Katie在2024-11实际输注，住Guildford，早期疗效、选择病例及后续二期招募不能证明一般狼疮常规NHS覆盖、长期安全或普通居民已经普遍获得。主60不依赖把此早期研究算成熟给药。[W03](https://www.uclh.nhs.uk/news/i-can-participate-life-now-how-car-t-cell-therapy-transformed-katies-life-severe-lupus)

旧UCL计划一期、KCL30人一周与26人一月标志物研究、HomeHealth388人多中心RCT主要独立功能终点未改善，继续保留[旧病例审查](cci-local-2026-london-case.md)。S06的HGPS lonafarnib正式政策亦保留，年龄／遗传适应证、团队和监护真实，**伦敦实际已给药仍未核**；不能把此国家责任单独视为本区居民通常获得。这些限制不否定已经连接的疾病限定CAR-T路线。

## 通常画像的资格、付款与现实监护

S07明确NHS以通常居住为基础，多数服务对通常居民免费；国籍、纳税、GP登记或NHS号码均不能单独代替资格，实际须合法、妥善定居并能证明。本画像的通常长期居住适配这些条件是明确假设，而非仅凭英国公民身份。S02 p4–5实际委托范围包括England通常居民，治疗需NICE适应证、地方MDT评估、National Clinical CAR-T Panel决定与批准。基本服务资格与治疗适合性不能混同。[S07](https://www.nhs.uk/nhs-services/visiting-or-moving-to-england/moving-to-england-from-outside-the-european-economic-area-eea/)、[S02](https://www.england.nhs.uk/wp-content/uploads/2026/04/cart-service-specification-commissioning-guidance-v1.0-1.pdf)

S02 p8–11给出NHS对提供方的活动支付，2024/25起≥19岁£62,414+MFF、≤18岁£138,456+MFF，至2025-10调整£66,949／£148,517+MFF；**这是提供方活动费，不是药物总价格、居民自付或中位居民账单**。p11表勾选药品excluded from tariff—cost & volume，活动covered entirely by national tariffs：药物与活动分别支付，不是药品被NHS保障排除。结合适应证委托、提供方列表中的St George’s／UCLH及真实当地交付，可合理推定合资格普通居民主要医疗及监护通过NHS路径取得，不需要假定他们能自行购买昂贵细胞产品，也不另加私人保险前提。单例新闻不证明自己的账单为零，福利／处方／交通支持不能当所有间接成本全覆盖。[S02](https://www.england.nhs.uk/wp-content/uploads/2026/04/cart-service-specification-commissioning-guidance-v1.0-1.pdf)

W02实际院方流程：制造至少4–6周，采集或制造可能失败；与转诊医院安排桥接不保证所有进展性疾病可等待。回输后至少住院14天，之后14天回家须距UCLH一小时内且有照护者持续陪护至28天；有的更久。日常神经检查、每日一至两次血检及急症升级提供监护缓解，但交通、临时住宿、照护机会成本仍重要。此链让“有监护”具体可审查，不代表中位收入家庭所有安排都容易落实。[W02](https://www.uclh.nhs.uk/patients-and-visitors/patient-information-pages/car-t-cell-therapy)

S02要求提供方JACIE、GMP/GDP及药商认证，关键药品、EEG、神经／重症、快速再入院、28天／100天／长期登记随访与交通住宿支持。**正式要求不是每例都完成的审计结果**；与两家医院实际路径合用，才构成条件性获得及监护推定。母机构较多不等于有独立无瓶颈替代；对临床不适合CAR-T、评估未批准或制造失败的患者，文献提到评估其他方案，不能保证其能获得同等效力的现实替代。[S02](https://www.england.nhs.uk/wp-content/uploads/2026/04/cart-service-specification-commissioning-guidance-v1.0-1.pdf)

## 不抹掉的等待、安全与分母反证

S03 p7记录药企反映采集capacity overwhelmed及儿科患者团体反映中心限制令患者家庭困难；“No change required”后跟长期扩展／工作组，不是扩容已完成。是利益相关方实际反馈，**并非2026伦敦代表性等待调查，也没有伦敦未达回输的临床损失分母**。S02 p4说既有中心能交付委托治疗，是行政容量判断，不能抵消这些短板。上述反证和桥接、住院、转诊等已运行缓解同读，支持60的重要限制；不能要求只有多数居民受害才可支持降档。[S03](https://www.england.nhs.uk/wp-content/uploads/2026/04/cart-services-specification-engagement-report.pdf)

S02 p7的**London37%是治疗所在region**，观察跨度FY2017/18到FY2025/26 months1–5，原文明确住址地理位置未知；不是伦敦居民37%覆盖、不是本FUA率或2026新增人数。同页23/24 YTD490、24/25 YTD390是England CDF+Baseline治疗计数，未给可比YTD截止月，不能据此证明全年下降或本地短缺。S02 p15列21个提供方条目，其中Manchester／Newcastle合并成人儿科，S03反馈所称23 sites不是同单位，不能默改为23家伦敦医院。[S02](https://www.england.nhs.uk/wp-content/uploads/2026/04/cart-service-specification-commissioning-guidance-v1.0-1.pdf)

S04是2024-07-25由药商发出、EMA/MHRA同意的DHPC：截至2024-04全球约42,500治疗，评审38件报告的继发T细胞恶性肿瘤，发生在数周至数年、含死亡；不足半数有CAR构建体检测，7例检出。**38/42,500不是可用发生率**，被动报告、选择和观察窗与治疗分母并不配对。要求终身继发癌监护，既不是禁用CAR-T也不是仅理论风险。W02却仍称全球尚未报告，实质已过期；其2026更新日期不能替这段文案背书。保留本地实际监护能力，同时承认风险知情／长期执行未全闭合，不能靠15年联系承诺覆盖终身要求。[S04](https://assets.publishing.service.gov.uk/media/66c3596f2e8f04b086cdf3db/UK_DHPC-Final_CAR-T_cell.pdf)、[W02](https://www.uclh.nhs.uk/patients-and-visitors/patient-information-pages/car-t-cell-therapy)

## LON四子项与条件档

| 子项                | 状态    | 支持与限制                                                                                                                    |
| ------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| translation         | partial | St George’s已回输、当地居民活动恢复；UCLH长期交付与人体研究。疾病限定、选例新闻及全转诊分母未知，不能泛化普遍延寿。           |
| trial_maturity      | partial | NICE正式临床获益评价及获批路线超越计划一期／标志物；总生存不确定、狼疮一期和旧一般老龄阴性终点保留。                          |
| regulatory_adoption | partial | NICE明确适应证、商业安排与NHS委托，风险监管要求终身监护；不等所有已许可适应证公保覆盖，HGPS未有当地交付。旧context改partial。 |
| resident_access     | partial | 本区真实交付＋通常居民委托＋完整付款和监护流程共同连接。评估适合性、制造、照护、距离、间接成本与容量仍限制；不是全民用药率。  |

**主60的必要假设**：截至cutoff当地已交付与NHS委托继续运行；本画像满足通常居住证明，出现相应疾病且经临床批准时通常能进入已审流程；主要治疗／监护NHS支付实际适用，照护／距离和等待虽重要，仍通常可安排；过期患者信息不能推定所有临床团队忽视已知风险，也不能默认风险宣教或终身随访已完全补正。这些是与其他案例同层的适用／延续／代表性推定，不要求完美中位账单或当前全区压力测试。

**40替代**：若现有等待、采集／回输损失、照护条件或风险信息／后续监护问题在缓解后仍使合资格普通居民的可信路径明显断裂，可据明确实质重要性选择40；不要求多数受害。当前证据没有把这些残余影响量化到伦敦完整合资格人群，主要判断仍为60。旧40的理由不得直接沿用成“普通人不患罕见病／没有全民抗衰药／国家规则存在但没全账单”。

**80候选而非主档**：须多条成熟可信路径及实际居民获得、审慎安全随访共同支持强准备度；当前疾病范围、制造／照护／容量与安全文案短板使80不如60可辩护。没有用缺一条来源本身封顶。

**null撤回**：拒绝本地运行延续、NHS资格／实际支付适用或通常可实践获得的必要假设，就撤回LON，不在缺失处强留60或自动退回40。最小辨别材料是已运行两中心适合患者从转诊到回输／未达回输的当前队列与具体失去机会原因、及监护／照护实际支援和最新风险告知执行；不是再找更多设施、条款或论文。两轮已完成，暂不继续扩搜。

## 全八维复算与31项完整性

其他七维保留旧条件60。它们本来包含不同范围的机构／国家观察与画像、空间适用假设，本轮不把原60改写为新测量或确认所有假设为真。旧案例若干“广泛障碍”措辞不增加“必须多数失败才能降档”的前提；有重要具体反证仍可重审。新CAR-T事实说明LON的疾病转化能力，与MED常规／必要服务的语义不同，本轮未据同一事实另奖励MED。

| 维度 | 权重 | 本轮条件档 | 复核边界                                                                 |
| ---- | ---- | ---------- | ------------------------------------------------------------------------ |
| PCS  | 15   | 60         | 旧潮汐防护、热／地表洪水／地质与设施故障判断和假设继承。                 |
| GSS  | 15   | 60         | 旧实际攻击、情报应对和战略未定范围继承。                                 |
| ISR  | 15   | 60         | 旧问责、实际服务改进／应急与凝聚限制继承。                               |
| RES  | 10   | 60         | 旧供水、食品、电力恢复与负担／依赖假设继承。                             |
| MED  | 15   | 60         | 旧NHS资格、实际交付、CQC与等待反证继承，未新全区审计。                   |
| LON  | 10   | **60**     | 本轮实际疾病路线改变旧有限路径代表性；必要假设可撤回。                   |
| TEC  | 10   | 60         | 旧实际转化／数字协助与扩散负担判断继承。                                 |
| OPT  | 10   | 60         | 旧航空／法律迁移／金融条件继承；network_continuity仍unresolved，未补分。 |

总分 `60×(15+15+15+10+15+10+10+10)/100=60`。仅LON40为58；仅LON80为62。LONnull时其他七维已知条件贡献54，原0–100参数数学范围54–64，**不输出中点59**；范围不是概率／置信区间。若其余维必要假设也被拒绝，不能继续用上述完整数值。

全部31键状态如下，未新增子分数／子权重。此“完整”是有状态记录与可复算的条件评分，非31项已测量；OPT通信未知保持未知。

| 维度 | 子项                    | 状态       | 本轮处理                                        |
| ---- | ----------------------- | ---------- | ----------------------------------------------- |
| PCS  | heat_humidity           | partial    | 继承旧记录；非新源验证                          |
| PCS  | flood_sea_level         | partial    | 继承旧记录；非新源验证                          |
| PCS  | geophysical             | context    | 继承旧记录；非新源验证                          |
| PCS  | severe_weather_wildfire | partial    | 继承旧记录；非新源验证                          |
| GSS  | organized_violence      | partial    | 继承旧记录；非新源验证                          |
| GSS  | regional_conflict       | context    | 继承旧记录；非新源验证                          |
| GSS  | strategic_exposure      | context    | 继承旧记录；非新源验证                          |
| ISR  | governance              | partial    | 继承旧记录；非新源验证                          |
| ISR  | adaptive_capacity       | partial    | 继承旧记录；非新源验证                          |
| ISR  | social_cohesion         | context    | 继承旧记录；非新源验证                          |
| ISR  | emergency_recovery      | partial    | 继承旧记录；非新源验证                          |
| RES  | water                   | partial    | 继承旧记录；非新源验证                          |
| RES  | food                    | context    | 继承旧记录；非新源验证                          |
| RES  | energy                  | partial    | 继承旧记录；非新源验证                          |
| RES  | supply_chain            | context    | 继承旧记录；非新源验证                          |
| MED  | access                  | partial    | 继承旧记录；非新源验证                          |
| MED  | routine_quality         | partial    | 继承旧记录；非新源验证                          |
| MED  | specialist_capacity     | partial    | 继承旧记录；非新源验证                          |
| MED  | system_continuity       | partial    | 继承旧记录；非新源验证                          |
| LON  | translation             | partial    | 本轮LON复核                                     |
| LON  | trial_maturity          | partial    | 本轮LON复核                                     |
| LON  | regulatory_adoption     | partial    | 本轮复核；regulatory_adoption由context改partial |
| LON  | resident_access         | partial    | 本轮LON复核                                     |
| TEC  | knowledge_output        | partial    | 继承旧记录；非新源验证                          |
| TEC  | industry_density        | context    | 继承旧记录；非新源验证                          |
| TEC  | digital_infrastructure  | partial    | 继承旧记录；非新源验证                          |
| TEC  | diffusion               | partial    | 继承旧记录；非新源验证                          |
| OPT  | transport_redundancy    | partial    | 继承旧记录；非新源验证                          |
| OPT  | legal_mobility          | partial    | 继承旧记录；非新源验证                          |
| OPT  | asset_portability       | partial    | 继承旧记录；非新源验证                          |
| OPT  | network_continuity      | unresolved | 继承旧记录；非新源验证                          |

状态计数：23 partial、7 context、1 unresolved，共31；LON四项均partial不是四项均完备。

## 有效原件与复用身份

原响应采用保留TLS的curl、保存HTTP头；HTML核正文、PDF核格式／文本。此次有效原件6件新取＋1件Oct10复用。表内精确首发未知用“未核”而非取回日替代。实际取回UTC起始时刻、URL、范围和源种类完整保存在 `source-manifest.json`；原件路径均在本任务tmp。PDF物理页：S02 p4／7／9／11／15、S03 p7、S04 p1／2均已渲染PNG目视；与pdftotext核单位、表格勾选、观察期和分母。S06沿用旧审查的p5目视记录，本轮没有声称重新目视该页。

| 来源与原URL                                                                                                                                                     | 日期／范围                                                                                                                                                                         | 原件bytes | SHA256                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------: | ------------------------------------------------------------------ |
| [S01 stgeorges-actual2025.html](https://www.stgeorges.nhs.uk/newsitem/first-patients-to-receive-game-changing-cancer-therapy-now-in-remission/)                 | 2025-05-28；原取回2026-10-13，本次review10-13；7已治疗；多数缓解但未给精确分子，服务South West London及Surrey，不是2026全区治疗率                                                  |    68,858 | `6f96f0e3f361e4f206aadfe9353e53d8ad5e70372d5b6883ad94519ca2732d62` |
| [S02 nhs-cart-commissioning2026.pdf](https://www.england.nhs.uk/wp-content/uploads/2026/04/cart-service-specification-commissioning-guidance-v1.0-1.pdf)        | 精确首发未核；原取回2026-10-13，本次review10-13；官方2026/04目录；封面12 November2025 Version3，内列December2025 TA1116，旧计划日期不可当实际实施；England通常居民委托和提供方支付 |   332,621 | `ba97c929f2ca55b7da63a525aa8d0af00f962742e18f91e2b48afabda55da108` |
| [S03 nhs-cart-engagement2026.pdf](https://www.england.nhs.uk/wp-content/uploads/2026/04/cart-services-specification-engagement-report.pdf)                      | 精确首发未核；原取回2026-10-13，本次review10-13；官方2026/04目录；报告封面7 May2025 Version1.0，stakeholder反馈不是2026伦敦等待抽样                                                |   241,623 | `488d37bb1e7a6ad034fe859164bf6bf1cee1e5132789d001732a4b408cadbdd7` |
| [S04 mhra-safety2024.pdf](https://assets.publishing.service.gov.uk/media/66c3596f2e8f04b086cdf3db/UK_DHPC-Final_CAR-T_cell.pdf)                                 | 2024-07-25；原取回2026-10-13，本次review10-13；EMA/MHRA同意的药商DHPC；截至April2024全球风险信号及终身监护，不是伦敦发生率                                                         |   621,175 | `f476ad963a99ecf5147337756c35104561ff2eb3e780bd0458656ea8c3d9cad0` |
| [S05 nice-ta1048.html](https://www.nice.org.uk/guidance/ta1048/chapter/1-Recommendations)                                                                       | 2025-03-26；原取回2026-10-13，本次review10-13；NICE正式推荐第1章；适应证/移植适合性/商业安排；总生存证据不确定                                                                     |    20,164 | `7d37836575b240bd2359d0de728c2e937e73a1cc32906576e086a1af57733e3f` |
| [S06 reused-lonafarnib2026.pdf](https://www.england.nhs.uk/wp-content/uploads/2026/07/2402-commissioning-policy-lonafarnib-hgps.pdf)                            | 2026-07-16；原取回2026-10-10，本次review10-13；England HGPS正式疾病限定责任和监护；未核伦敦给药；复用Oct10原件                                                                     |   227,513 | `6058ab23198d712877f7a303a4e1e328471ce3729276422055c433ebc5e5ed51` |
| [S07 nhs-ordinary-residence.html](https://www.nhs.uk/nhs-services/visiting-or-moving-to-england/moving-to-england-from-outside-the-european-economic-area-eea/) | 精确首发未核；原取回2026-10-13，本次review10-13；NHS通常居住资格；page reviewed2023-10-24，nextreview2026-10-24，国家规则非本地及时治疗率                                          |    32,656 | `4efb26910573c7f60a7ab193ee4e3091526d3672ce5dd931413ab74c3fd26976` |

## 仅web读到原站正文

未取得有效本地原响应的正文保留web-only身份，bytes／SHA均null。未存浏览器解码UTF8档，不把curl拒绝页当正文或把web输出伪作原HTTP原件。

| 原URL                                                                                                                                                            | 原日期／观察范围                                                                                                                                    | bytes  | SHA256 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------ |
| [W01](https://www.uclh.nhs.uk/our-services/find-service/cancer-services/blood-cancers-clinical-haematology/blood-diseases-types-and-services/car-t-cell-therapy) | 未标版本日期；实际读取10-13；现行未标日期院方服务正文；2016以来数百累计试验+获批给药，实际两院区和随访；非2026数百新增                              | 未取得 | 未取得 |
| [W02](https://www.uclh.nhs.uk/patients-and-visitors/patient-information-pages/car-t-cell-therapy)                                                                | 2026-03-18；实际读取10-13；实际路径；reviewdue2025-07-31与updated日期冲突；继发癌尚未报告说法已过期，非无风险证明                                   | 未取得 | 未取得 |
| [W03](https://www.uclh.nhs.uk/news/i-can-participate-life-now-how-car-t-cell-therapy-transformed-katies-life-severe-lupus)                                       | 2026-06-12；实际读取10-13；Phase1 CARLYSLE actual9截至Nov2025、低剂量first6中5缓解；2024Nov已输注患者Guildford居民，不计为本区居民或标准公保AD/抗衰 | 未取得 | 未取得 |

## 失败读取与派生物

首次6个入口发生curl35 TLS连接错误、无原件（attempt1 meta保留）；随后的有界第二次尝试已分别成功或停止。UCLH三入口最终403、各4546 bytes安全拒绝页，不能作医疗证据。NHS规格入口最终202空正文，web直开亦验证挑战，不能作有效规格正文；正文判读依有效S02/S03，未依入口挑战页。NICE第二次成功200真实建议正文，首次失败不抹除。以下SHA仅识别失败响应，绝非有效证据。

| 尝试URL                                                                                                                                                                                      | 实际时间／响应                                | 失败payload bytes | payload SHA256                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------------: | ------------------------------------------------------------------ |
| [nhs-cart-commissioning2026.pdf attempt1](https://www.england.nhs.uk/wp-content/uploads/2026/04/cart-service-specification-commissioning-guidance-v1.0-1.pdf)                                | 2026-10-13T04:23:11.409336+00:00；exit35；000 |                 0 | 无有效payload                                                      |
| [nhs-cart-index2026.html attempt1](https://www.england.nhs.uk/publication/chimeric-antigen-receptor-t-cell-car-t-therapy-service-specification/)                                             | 2026-10-13T04:23:11.407082+00:00；exit35；000 |                 0 | 无有效payload                                                      |
| [nhs-cart-index2026.html](https://www.england.nhs.uk/publication/chimeric-antigen-receptor-t-cell-car-t-therapy-service-specification/)                                                      | 2026-10-13T04:25:44.531341+00:00；exit0；202  |                 0 | 无有效payload                                                      |
| [nice-ta1048.html attempt1](https://www.nice.org.uk/guidance/ta1048/chapter/1-Recommendations)                                                                                               | 2026-10-13T04:23:11.411193+00:00；exit35；000 |                 0 | 无有效payload                                                      |
| [uclh-cart-pathway.html attempt1](https://www.uclh.nhs.uk/patients-and-visitors/patient-information-pages/car-t-cell-therapy)                                                                | 2026-10-13T04:23:11.402437+00:00；exit35；000 |                 0 | 无有效payload                                                      |
| [uclh-cart-pathway.html](https://www.uclh.nhs.uk/patients-and-visitors/patient-information-pages/car-t-cell-therapy)                                                                         | 2026-10-13T04:25:44.529612+00:00；exit0；403  |              4546 | `a92459be9c39f2bee8ab26370cfd411bbe8c5b02225a83a1e876341d83728bc2` |
| [uclh-current-cart.html attempt1](https://www.uclh.nhs.uk/our-services/find-service/cancer-services/blood-cancers-clinical-haematology/blood-diseases-types-and-services/car-t-cell-therapy) | 2026-10-13T04:23:11.402119+00:00；exit35；000 |                 0 | 无有效payload                                                      |
| [uclh-current-cart.html](https://www.uclh.nhs.uk/our-services/find-service/cancer-services/blood-cancers-clinical-haematology/blood-diseases-types-and-services/car-t-cell-therapy)          | 2026-10-13T04:25:44.527832+00:00；exit0；403  |              4546 | `e71e472acfab40a82ac8036fa949b7526caafee98a22c444ca52fac1f3344583` |
| [uclh-lupus-actual2026.html attempt1](https://www.uclh.nhs.uk/news/i-can-participate-life-now-how-car-t-cell-therapy-transformed-katies-life-severe-lupus)                                   | 2026-10-13T04:23:11.404047+00:00；exit35；000 |                 0 | 无有效payload                                                      |
| [uclh-lupus-actual2026.html](https://www.uclh.nhs.uk/news/i-can-participate-life-now-how-car-t-cell-therapy-transformed-katies-life-severe-lupus)                                            | 2026-10-13T04:25:44.531106+00:00；exit0；403  |              4546 | `e444cf6b921b8ed1114f403e1180dc70bc3e61307a68be11d7a55f846c6cc120` |

`.pdf.txt`、HTML抽取txt、PDF页PNG、研究脚本、边界点JSON均为派生物，不冒充原件。继承案例／共同rubricSHA另列manifest的inheritedInputs，不混进原来源。独占 `priority-handoff.json`仅供根代理验收拷入，包含八维31键、sourceSnapshots、webReadSources、failedSourceReads和referenceBoundaryCheck；本轮未改旧MD／共享JSON、矩阵、脚本、页面或goal，也未提交。
