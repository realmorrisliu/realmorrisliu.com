# 新加坡154：LON疾病路径的跨城一致性复核

证据截止2026-10-10，实际取回及复核2026-10-13；对象是通常长期居住的新加坡公民、当地中位收入与通常保障条件。只复核 LON，不改共享评分。复用[原八维案例](cci-local-2026-singapore-case.md)、[现行结构化快照](data/cci-local-2026-singapore-case.json)与[共同档位规则](cci-global-scoring-rubric.md)。

**建议 LON 从旧条件40改为条件60。** 新依据是有临床结果、在新加坡实际给药、获本地评估与公共资助并有监护要求的疾病特定 CAR-T 路径。旧一般抗衰可行性及个体研究仍不足以证明普通人的健康寿命获益，但不能继续代表整个转化维度。没有证明健康人能延寿，也没有因为巴黎、伦敦或苏黎世调整便跟随。新判断依赖公共路径在截止日仍运作、合资格通常居民能够完成支付与监护的明确假设；拒绝必要连接则 LON 为 null。

其余七维及反证不变：PCS60/GSS60/ISR60/RES60/MED60/TEC80/OPT60。原权重下，新完整条件演算为62；仅是研究判断，不是入围、城市确定次序或客观精度的证明。

## 人体结果、本地交付与限制

### 可信人体证据不是新加坡全体患者结果

复用法国主管 HAS 的 [Kymriah正式再评估原件](https://www.has-sante.fr/upload/docs/evamed/CT-20262_KYMRIAH_LDGCB_PIC_REEV_AvisDef_CT20262.pdf)，本轮重新核验文件并目视第14页。JULIET 为非比较性II期，良好体能、≥2线治疗后复发／难治 DLBCL、移植失败／不适合／拒绝移植者；2020-02-20分析不是2023或2026新观察。

原分母必须分开：入组 ITT167、主队列实际治疗 ITTm99、全部输注115。总体缓解分别为61/167（36.5%）和54/99（54.5%），不能把后者当所有入组者或新加坡治疗成功率；52名入组者未获输注，原因包括早死、进展和研究者决定。115名输注者中104人报告≥3级不良事件。单臂与历史／间接对照不能给可靠随机净生存增益，更不能变成普通健康人的延寿年数。较早二线 BELINDA 的阴性比较也不支持把所有时点、产品和适应证合并为同一疗效。

新加坡 [ACE／MOH Drug Advisory Committee正式指引](<https://isomer-user-content.by.gov.sg/68/0be2d3ca-8012-469e-831f-1406870af7b4/tisagenlecleucel-for-relapsed-or-refractory-dlbcl-after-two-or-more-lines-of-systemic-therapy-(1-aug-24).pdf>)发布2024-08-01，评议2024-03，针对成人≥2线后 DLBCL。当地委员会认可治疗效果方向并推荐资助，同时指出排除未给药者的 FAS 有利偏倚、间接比较与当地适配不确定、严重不良事件更多、长期生存与安全不确定。经济模型44年视野过于乐观；其中外推产生的生命年与QALY不是已观察获益。五份当地患者／照护者陈述中仅一人谈及接受该药，不能当本地队列成功比例。此PDF目前为网络工具可读原文，下载403、关键截图缓存失败，未冒称本地有效PDF；精确临床分母依上面实际取得并目视的 HAS 原表。

### 本地已实施，当前年度容量仍未知

[SingHealth临床团队2021年10月医院刊](https://www.singhealth.com.sg/patient-care/specialties-services/cell-therapy-centre/PublishingImages/newsletters/Defining%20Med%20October%202021%20-%20Cell%20Therapy%20SDDC%20Final.pdf)第7页称 SGH 自上一年起已治疗10名 CAR-T 患者，个案经淋巴瘤肿瘤委员会及移植项目讨论。第7—8页本轮文本及目视一致；图中仍要求有保险／能承担商业费用，海外制造4—6周并可能桥接治疗，保留为当时障碍。附近“完全缓解40%”是治疗介绍，**不是10人的本地结局分母**。十人也未按试验、同情使用、商业给药及公民身份拆分。

[SGH2022-08-31原报道](https://www.sgh.com.sg/news/singapore-health/the-face-of-car-t-cell-therapy)识别实际首名商业患者，支持超出试验许可的当地实施；没有证明其国籍、收入、净账单或代表通常患者。SGH[细胞治疗服务正文](https://www.sgh.com.sg/our-specialties/haematology/cellular-therapy)及 NCIS[CAR-T路径](https://www.ncis.com.sg/our-services/ncis-specialised-programmes/car-t-cell-therapy)提供当地转诊和治疗流程，后者页面日期2024-09-23；SGH现页无明确观察窗，笼统“多名患者控制疾病”不当队列疗效。MM仍在 SGH 的“即将开展”栏，不能算已交付。

这些材料与2024资助决策、2025／2026实际规则和患者材料共同支持服务延续的必要推定。**本轮实际容量只核到历史已给药10人及商业个案，未核2026年名额、实际年度输注数、拒绝数、等待尾部或合资格者转化率。** 不能从约300例年新诊断 DLBCL、预算模型或医院规模推出容量；也不因缺全面容量分母自动撤销已有实际路径。

### 安全监护有具体内容，不能称风险均已消除

HSA[官方安全材料目录](https://www.hsa.gov.sg/other-regulations/product-safety-monitoring/educational-materials-for-hcp/)正文更新2026-10-06，导出的 Kymriah [医师材料](https://go.gov.sg/hsa-edu-kymriah-pem-physician)和[患者材料](https://go.gov.sg/hsa-edu-kymriah-pmg)均为真实PDF：印刷注明HSA批准2025-07-17、更新2026-04-27；不是2026新临床队列。

医师第4页要求合资格中心、受训人员、现场可立即取得 tocilizumab，短缺时有适当替代措施。第29页明确可出现继发性、包括T细胞来源恶性肿瘤并需终身监测，保留其他治疗及基因不稳定等混杂；不是已证明每例由产品导致。患者第2—3页要求前10日每日回院／考虑住院、至少4周在两小时可达范围内，制造可能失败、等待期间可能进展，感染可能致命。上述页已目视。监护规则不等于所有实际患者均完成，照护者、交通和时间负担仍真实。

NCIS2025年[住院手册](https://www.ncis.com.sg/docs/ncislibraries/brochures-document/a5-brochure-car-t-cell-therapy-inpatient-information_final_.pdf?sfvrsn=ba0064b8_1)另提供 ICANS检查、血液及感染照护和出院返回指引；第14页“1—3周且无 CRS／ICANS／感染才出院”已目视，是条件性流程，不是观测到所有人按时出院。2021医院文章将某些毒性描述为可逆，不能覆盖当前正式材料列出的严重／长期风险。

## 公民支付路径：产品清单、上限和自付分开

CAR-T 此路径对应 **CTGTP List**，不能套一般 Cancer Drug List 的按月药额。MOH[清单原文](https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/cell-tissue-and-gene-therapy/product-list-cell-tissue-gene/)更新及清单时点2025-08-01，列 Kymriah 和 Yescarta。为与其他城市同层比较，本轮主路径限定 Kymriah 成人≥18岁、≥2线后复发／难治 DLBCL，并要求移植失败／不适合、ECOG0/1、足够器官功能、无规定的失控感染／中枢病变、此前未用该适应证 CAR-T。2—25岁B-ALL另有条件，不能替普通成年画像默认满足。Yescarta新增部分二线适应证不与 Kymriah JULIET 混用。清单及资助不是一般抗衰许可。

MOH[公立机构补贴条款](https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/cell-tissue-and-gene-therapy/subs-cell-tissue-gene/)正文更新2024-10-26、表自2024-10-01生效，须为补贴公立患者、列明产品及适应证，按家庭月人均总收入 PCHI 自动给予相应补贴：

| 公民PCHI（新元／月） | 补贴比例 | 每疗程补贴上限             |
| -------------------- | -------- | -------------------------- |
| 0—3,600              | 75%      | 150,000                    |
| >3,600—7,000         | 60%      | 120,000                    |
| >7,000—11,400        | 45%      | 90,000                     |
| >11,400              | 0%       | 特殊情形可申诉，非自动获批 |

PCHI为同住家人总收入除以人数，**当地个人中位收入不直接确定PCHI，不能默认75%**。另需援助可由公立医疗社会工作者评估；此入口和原案例已核一般 MediFund 实际交付不证明每个 CAR-T 余额必获救助。

MOH[2026 MediShield Life待遇](https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/medishield-life/medishield-life-benefits/)更新2026-06-03，表适用2026-06-01后治疗／入院：Kymriah及Yescarta各141,000新元／治疗，MediSave可提取4,680新元／治疗，需清单临床条件。前者是赔付上限，后者动用自身医疗储蓄；都不是获批后整账单免费。CTGTP产品赔付不计年度一般200,000上限，不能将该年限额额外叠加为CAR-T保证支付；一般门诊癌药／服务额也不能替产品限额。

[2025正式法规定本](https://www.parliament.gov.sg/docs/default-source/default-document-library/s-l-175of2025.pdf?sfvrsn=5b3e5d08_0)为MediShield Life Scheme (Amendment No.2) Regulations，Gazette S632，2025-10-01生效、2025-10-03公报；议会封面日期与公报日期分开。PDF文本有字体编码乱码，以目视第9—12页（正文7—10页）核关键条款：

- 产品赔付为 `min(T × P × 0.9, 对应产品assured amount)`；T是产品应付费用，P是适用比例。补贴公立公民P=1，非补贴公立P=0.35，私立P=0.3，不能混写为公民任何场景90%全额报销。
- 一适应证终身只可赔一疗程；一般终身不限额不取消此产品限制。
- 产品有年度限额例外及特别算法；辅助诊疗费用仍适用一般服务规则，不能把规则例外搬到整个治疗过程。

仅作**非价格观测的算术**：若产品补贴后应付T=50,000、P=1、限额未触顶，产品赔付45,000、余5,000；MediSave余额充足且可提足时现金余320，尚未加辅助服务、交通、收入损失。若T=200,000，赔付触顶141,000、产品余59,000，再用4,680储蓄仍余54,320。没有官方现行产品报价与通常患者账单，因此这些不是当地真实收费或典型负担。

**未核到患者总自付的绝对封顶保证。** 规则确有实质缓解，也可能在高产品价／补贴触顶、辅助诊疗、照护和制造等待下剩下重要负担。条件60需接受“通常合资格公民使用补贴公立路径后，余额及必要监护一般可完成或获得经评估援助”的推定；不能默认有私保、附加险或无限援助。拒绝这条连接则null；缺全量中位账单本身不是40或null的新增硬门槛。

## 四子项与40／60／80／null

| LON子项             | 状态    | 支持及仍未知                                                                                         |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| translation         | partial | 国际人体临床结果＋本地实际给药／商业个案；不是一般健康人寿命结果，完整当地转化率未知                 |
| trial_maturity      | partial | 已超可行性试验；单臂／间接比较、选择、制造掉队和长期风险限制成熟度，未知不补高档                     |
| regulatory_adoption | partial | 当地正式评估、资助清单、风险材料、受控配送及随访要求；许可／规则不证明实际合规覆盖或所有适应证均成熟 |
| resident_access     | partial | 公民公共资助、保险、储蓄及当地转诊监护；严格资格、上限／自付、照护负担真实，当前容量与费用分布未知   |

**60主判断**来自上述已经存在的转化与公共获得路径；重要限制是疾病／体能资格、仍需数周个体制造、可能无法给药及进展、严重与长期不良反应、带上限的支付和监护负担。它不是“80未知所以60”。不重复把同一 CAR-T 活动加到 MED、TEC或总分。

**40替代**需认定这些限制在已有缓解后仍构成通常合资格居民的重要临床获得断点，例如当前公共报价／费用导致实际拒绝，或制造／排队普遍丧失机会。当前没有核到这一群体后果，不能由旧2021自费图、两家服务网页或未取得新账单直接判40。旧40的“所查一般抗衰路径代表全维”已被本地商业及受资助疾病路径挑战，不能原理由不变地保留。

**80替代**需多条成熟且可实际获得的可信路径和足以缓解主要残余负担的依据；本轮并不以未测所有医院为否决，而是保留已知复杂性与适用限制的实际重要性。目前不主张80。

**null撤回条件**：不接受上述支付及监护通常可完成、历史给药与近期规则能合理支持截止日延续、或服务地域适配。最低待补是一个当前合资格公民成人 DLBCL 的公立费用咨询／结算样例（分清产品、辅助服务、补贴、保险、储蓄、援助和余额）及近期实际转诊／给药或名额／制造时间记录；不用完美全FUA净账单、所有医院事故整改或全面压力测试作60硬门槛。

原候选及边界仍按 eFUA154／GHS-FUA R2019A；原案 `boundaryReview=unresolved` 保留。本轮机构观察限SGH／NCIS，未做院区完整footprint或全部患者居住地交叉；国家法直接适用画像中的公民，服务对本FUA通常居民可使用是明确空间推定，不能将国家医院／产品数当FUA覆盖率。

## 全31项交接及其余七维

以下27项直接继承已核原案状态与反证，4项LON更新解释；不是本轮对七维新增测量。`partial`是局部证据，`context`是背景／模型，`unresolved`是真未知，不是子项分数。

| 维度 | 子项                    | 状态       |
| ---- | ----------------------- | ---------- |
| PCS  | heat_humidity           | partial    |
| PCS  | flood_sea_level         | partial    |
| PCS  | geophysical             | context    |
| PCS  | severe_weather_wildfire | unresolved |
| GSS  | organized_violence      | partial    |
| GSS  | regional_conflict       | context    |
| GSS  | strategic_exposure      | context    |
| ISR  | governance              | partial    |
| ISR  | adaptive_capacity       | partial    |
| ISR  | social_cohesion         | context    |
| ISR  | emergency_recovery      | partial    |
| RES  | water                   | context    |
| RES  | food                    | context    |
| RES  | energy                  | partial    |
| RES  | supply_chain            | context    |
| MED  | access                  | partial    |
| MED  | routine_quality         | partial    |
| MED  | specialist_capacity     | partial    |
| MED  | system_continuity       | partial    |
| LON  | translation             | partial    |
| LON  | trial_maturity          | partial    |
| LON  | regulatory_adoption     | partial    |
| LON  | resident_access         | partial    |
| TEC  | knowledge_output        | partial    |
| TEC  | industry_density        | partial    |
| TEC  | digital_infrastructure  | partial    |
| TEC  | diffusion               | partial    |
| OPT  | transport_redundancy    | partial    |
| OPT  | legal_mobility          | partial    |
| OPT  | asset_portability       | partial    |
| OPT  | network_continuity      | partial    |

保留的主要反证与必要假设：PCS的户外／高龄热暴露、洪水热点及其他危险未知；GSS的恐怖主义外溢、战略通道与覆盖未知；ISR的应急缺员和群体调查范围；RES的进口食物／燃气／淡化用电共同依赖；MED的等待、专科结果代表性以及主管不追踪所问费用导致延迟／放弃治疗指标（不是零障碍）；TEC的融资及技能／群体差异、辅助服务共用后台；OPT的CPF资金条件、短期离境不代长期居留，以及已调查通信备援失效与整改同时保留。原案各维的延续、通常居民可用、剩余障碍未变成广泛失效等假设不被此LON补核消除。

## 原权重敏感性

权重PCS/GSS/ISR/MED各15，RES/LON/TEC/OPT各10，未改权重、未设子项等权平均。

| 情景（其余按原条件）    | 算术结果                            | 含义                                               |
| ----------------------- | ----------------------------------- | -------------------------------------------------- |
| LON60主建议             | 62                                  | 仅此从40到60增加2                                  |
| LON40替代               | 60                                  | 须有上述当前重要断点判断，不能原代表性假设自动沿用 |
| LON80替代               | 64                                  | 尚不主张                                           |
| LONnull                 | 无中心；固定七维贡献56，算术域56—66 | 不覆盖其他七维未知，不是排名／排除界限             |
| LON60、MED40            | 59                                  | MED若有重要未缓解必要治疗障碍；本轮不改MED         |
| LON60、TEC60            | 60                                  | 既有TEC替代；本轮不改TEC                           |
| 仅试将MED5权重点转给LON | 62                                  | 二维主档均60，转移不改结果；正式权重不变           |

结构化建议对象及完整31项在本地 `candidate-handoff.json`；代码核验31项、八维、原七维逐对象完全未改及实际文件SHA。没有新加坡与巴黎／伦敦／苏黎世全城同分或优劣结论。

## 原来源、时点与文件真实性

本地存放 `/private/tmp/cci-global/singapore/lon-comparability/`。`source-manifest.json`保存逐次请求、最终URL、实际取回UTC、bytes、SHA及有效／失败分类；`inherited-inputs.json`冻结复用文档身份。全部实际查阅2026-10-13，公报／政策生效日不是查阅日；网页通用页脚2026-10-12不替文章日期。HTML有效正文已检查，PDF文本与以下页目视；不是仅看HTTP200。

| 原来源URL与本地文件                                                                                                                                                                                                                         | 观察／发布／生效身份                                                                       | bytes   | SHA-256                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------ |
| [SingHealth2021医院刊](https://www.singhealth.com.sg/patient-care/specialties-services/cell-therapy-centre/PublishingImages/newsletters/Defining%20Med%20October%202021%20-%20Cell%20Therapy%20SDDC%20Final.pdf)；`singhealth-cart2021.pdf` | 2021Oct刊；观察自2020起十人；p7—8目视                                                      | 1636572 | `144866e479d3472ffa1b5e7d0394f934b14b00f77502fbec9ba3e40a9511e75b` |
| [SGH首商业患者](https://www.sgh.com.sg/news/singapore-health/the-face-of-car-t-cell-therapy)；`sgh-cart-commercial2022.html`                                                                                                                | 发布2022-08-31；个案实际治疗确切日未单列；非总体队列                                       | 466655  | `04312344bac82400d23be4fa6fe1a5718c2767fb4df7b604f086fba9853d9cd5` |
| [SGH服务](https://www.sgh.com.sg/our-specialties/haematology/cellular-therapy)；`sgh-cellular-therapy.html`                                                                                                                                 | 当前可读，正文无明确观察／发布日；截止日延续须假设                                         | 469345  | `5799e1203649a9b4d64189ab6c808287123a01c20ff9f15da14bdd0f0537b2aa` |
| [NCIS路径](https://www.ncis.com.sg/our-services/ncis-specialised-programmes/car-t-cell-therapy)；`ncis-cart-current.html`                                                                                                                   | 页面2024-09-23；不是输注人数观察窗                                                         | 60197   | `77a53cfa15b358cf6ff9ef40f3df37d52c9288452e4e6646bf25ed75bbc2219a` |
| [NCIS住院手册](https://www.ncis.com.sg/docs/ncislibraries/brochures-document/a5-brochure-car-t-cell-therapy-inpatient-information_final_.pdf?sfvrsn=ba0064b8_1)；`ncis-inpatient-cart.pdf`                                                  | 印刷2025、确切首发日未知；p14目视；患者指引非队列                                          | 2760938 | `fca0a6832d0d39588d3aa68c4cd0a68e272f2e4eb5cf5ddbd58b0e7d126695f1` |
| [HSA目录导出医师材料](https://go.gov.sg/hsa-edu-kymriah-pem-physician)；`hsa-kymriah-physician.pdf`                                                                                                                                         | Novartis制、HSA批准2025-07-17／更新2026-04-27；p4/29目视                                   | 388988  | `c16c053eba5b16efffd4b068525133e05c330d100b116915b64173ed7750469e` |
| [HSA目录导出患者材料](https://go.gov.sg/hsa-edu-kymriah-pmg)；`hsa-kymriah-patient.pdf`                                                                                                                                                     | 同上批准／更新；p2—3目视；实际给药未证明                                                   | 102491  | `91fbe60d7ecfa3e4ab70fb4e8690f69ae21cad370c3fab79db93f356cf1bf209` |
| [议会法规](https://www.parliament.gov.sg/docs/default-source/default-document-library/s-l-175of2025.pdf?sfvrsn=5b3e5d08_0)；`msl-amendments2025.pdf`                                                                                        | S632；2025-10-01生效／10-03公报；p9—12目视，以图纠字体乱码                                 | 132806  | `a1c3e10cd8c638b2a859c91683a22cea51a1d73cd2a61131b60739af8fed1658` |
| [HAS再评估](https://www.has-sante.fr/upload/docs/evamed/CT-20262_KYMRIAH_LDGCB_PIC_REEV_AvisDef_CT20262.pdf)；`inherited-has-kymriah2023.pdf`                                                                                               | 2023-09-06委员会／10-23网页；JULIET2020-02-20观察；本轮p14目视、来自巴黎原件不重计独立研究 | 741078  | `b2612ca8b5c71c90f31608b5819b3ae3d8fde8aa060108db45d5e47bf47f5409` |

网络工具直接可读的一手正文另列，**原响应bytes/SHA为null**，保存的工具摘文不可称原文件：

| 原URL                                                                                                                                                                                                       | 发布／生效／范围                                 | 本地原响应                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| [MOH CTGTP List](https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/cell-tissue-and-gene-therapy/product-list-cell-tissue-gene/)                                                                | 更新／清单2025-08-01；产品及临床条件             | curl403；非政策正文                                  |
| [MOH补贴](https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/cell-tissue-and-gene-therapy/subs-cell-tissue-gene/)                                                                               | 更新2024-10-26／生效10-01；PCHI表及公立资格      | curl403；非政策正文                                  |
| [MOH待遇](https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/medishield-life/medishield-life-benefits/)                                                                                         | 更新2026-06-03／治疗与入院6-01后适用             | curl403；非待遇PDF                                   |
| [ACE正式指引](<https://isomer-user-content.by.gov.sg/68/0be2d3ca-8012-469e-831f-1406870af7b4/tisagenlecleucel-for-relapsed-or-refractory-dlbcl-after-two-or-more-lines-of-systemic-therapy-(1-aug-24).pdf>) | 2024-03评议／8-01发布及资助建议；7页网络解码正文 | 编码／规范URL均403；关键截图缓存失败；不冒称目视原表 |
| [HSA材料目录](https://www.hsa.gov.sg/other-regulations/product-safety-monitoring/educational-materials-for-hcp/)                                                                                            | 正文2026-10-06；导出材料有效日期另核             | 目录为web-only；导出PDF另有真实bytes/SHA             |

失败9次独立保留：MOH三个403、ACE两个403、HSA旧2023PI的403、CPF手册403、HealthXchange2021页404、PubMed42603590的203挑战。其哈希只是失败响应身份。PubMed搜索线索“80人2020—2025”未取得可核正文／本地院区／发表日，**不计实际容量或结局**；2025 SGH转载报纸的安排数不当医院独立已给药记录。未关闭TLS，也不因403、截图缓存或研究入口失败对当地信息环境扣分。

本轮已用两轮定向核查：本地服务／采用／资助，及正式支付／临床限制／监护。同类失败入口达到停止点后转为有效医院刊、HSA导出PDF与议会原件，不重复下载同页。当前已可区分“仅一般抗衰早期研究”与“有疾病临床实施和公共获得路径”；有条件60及最小待补链后结束，不以凑完整成绩为理由扩搜。
