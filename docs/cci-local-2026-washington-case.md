# 华盛顿功能区：科研交付不抵消居民资源瓶颈

证据截止：2026-10-10；本轮查阅及原始文档核验：2026-10-12。对象为美国公民、通常长期居住、当地中位收入和通常医保，冻结候选 eFUA 7068，沿用[共同口径与档位](cci-local-2026-scoring-calibration.md)。**PCS／ISR／MED／TEC／OPT 条件性 60，RES 条件性 40；GSS／LON 未定，无总分中心。** 全部八维、31 子支柱已审阅，不表示全部测量。这是第七份审阅、第二份部分案例，不是排名或可靠排除界限。

## 研究顺序、边界与时间

按全候选已核验的[OpenAlex 机构目录落点](data/cci-openalex-institution-fua.csv)安排研究顺序：排除已审阅的六个案例后，华盛顿功能区关联记录最多，为 3,098 条。按 `efua_ids` 逐项计数，可从同一全量目录复算。这些不是独立机构数、科研成果或居民受益人数；仅决定补证优先级，不直接给 TEC 分数、不授予名额，也不排除其他候选。

冻结面积 7,446 平方公里，来源城市中心 ID 为 852／855／856／858／859／871／874／877。2015 人口仅用于识别，不作 2026 风险或服务分母。**功能区不等于哥伦比亚特区、CAFB 服务区、都会统计区、MedStar 医院网络或机场腹地。** 本轮没有完成各服务区与冻结边界的统一适配，`boundaryReview` 仍为 unresolved；整维判断依赖明示的区域及居民适用假设。

来源发布、观察和查阅分别记录，下载原件的 SHA-256 见[结构化案例](data/cci-local-2026-washington-case.json)。未明确发布时间的当前网页不冒充截止日前快照：医院网页只作对既有服务的补充核对；McLean 输液网页不用于补出截止日前的长寿治疗实绩。2026 食物调查覆盖过去十二个月，不是全年实时普查；未来扩张和备援计划不当作已交付。

## 八维判断与改变条件

| 维度／权重 | 条件档位 | 支持与反证                                                                                                                 | 必要假设及改变条件                                                                                                                                                                      |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PCS／15%   | 60       | 实际暑热警报、已有避暑场所和无障碍接驳支持保护；其他危险与停电时触达未充分核验                                             | 已见保护通常有效且延续至全功能区，未观察危险没有更广泛未缓解失效。拒绝则未定；重要保护瓶颈可重审 40，多危险实际效果与备援成立才考虑 80                                                  |
| GSS／15%   | 未定     | 两起针对性袭击的伤亡及现场处置已核验；选定事件不是全年全区组织暴力、区域外溢或战略影响测量                                 | 实际响应支持缓解，但尚不能选择整维档位；起诉不是定罪，少数事件不证明总体影响低，仍须补更完整影响、时间及全区适配                                                                        |
| ISR／15%   | 60       | 实际暑热执行、食品接入帮助、数字服务及投诉监督支持制度运作；警务记录缺项和群体触达为反证                                   | 这些执行持续、主要服务通常运作，已见记录缺陷未构成更广泛制度失效。拒绝则未定；证实重要且未缓解的居民问责／服务障碍可重审 40，完整恢复与替代有效才考虑 80                                |
| RES／10%   | 40       | 供水运行及食品帮助仍在，但中等收入群体存在较大食物不安全比例；帮助未证明已解除该瓶颈                                       | 调查的中等收入家庭经验可适配目标本国通常居民、全功能区和截止日，且该基本资源约束仍重要。拒绝代表性或延续假设则未定；证实已解除且其他供给通常可靠才重审 60，不由水质合格自动抵消食物约束 |
| MED／15%   | 60       | 已有本地慢性病实际服务、线下衔接及专科入口；数字障碍、费用条件、常规质量和压力持续性仍不足                                 | 既有服务延续，必要治疗通常可得、质量可接受且通常医保下可承担。拒绝则未定；必要治疗实际阻断可重审 40，服务入口和保险上限不够支持 80                                                      |
| LON／10%   | 未定     | 可信人体结果及国家监管／保险条件明确；当前当地网页列治疗，但截止日前实际交付与普通居民可及未核验                           | 人体结果不证明本地给药，更不证明健康居民寿命延长；本例不凭未注明日期的入口填 60，须补有时间依据的当地采用与适用路径                                                                     |
| TEC／10%   | 60       | 年度实际研究、专利／许可、数字训练和公共网络支持部分产出与扩散；单节点、供应商退出及采用效果为反证                         | 已见能力持续，支持部分产业连接和居民扩散；目录、活动次数及热点数不当作实际普及率。拒绝则未定；重要未缓解采用断层可重审 40，多机构广泛采用与独立节点成立才考虑 80                        |
| OPT／10%   | 60       | 实际航空与机场铁路接驳、附条件居留申请、个人跨境转账服务及本地故障恢复通报支持多类通道；审批、产品限制、费用和通信中断保留 | 已见通道延续且普通居民通常能获得、承担合适的居留目的路径、可转账账户及必要的替代联系手段。资格／负担／全区或时间假设拒绝则未定；重要未缓解阻断才重审 40，独立备援有效才考虑 80          |

60 均依赖正向能力依据和可撤回假设，不是缺失的默认值。RES 40 是共同“重要居民约束”规则下的研究判断，**不是为这个城市新设一个百分比阈值**。同一食物约束不顺带给 ISR／MED 扣分，科研优势亦不补偿 RES 或自动提高 LON。

## 居民资源约束：调查分母及缓解决定如何判档

[CAFB／NORC 2026 原始报告](https://hunger-report.capitalareafoodbank.org/report-2026/)的[官方发布入口](https://www.capitalareafoodbank.org/hunger-in-our-region/hunger-report/)明示于 2026 年 9 月发布；网页创建元数据为 8 月、修改为 9 月，不能把创建日冒充报告正式发布日。调查为 05-04 至 05-16，成人样本 3,804，地址抽样、电话／网络完成，加权反映该区域成人。报告称 38% 家庭在过去十二个月有食物不安全；与上年两百分点差异仍在误差范围内，不包装成显著恶化。没有家庭内随机选人，边界和国籍适配也未解决。[原始收入图](https://hunger-report.capitalareafoodbank.org/wp-content/uploads/2026/09/CAFB_HungerReport2026_Charts-Graphs_Final_Food-insecurity-disproportionately-affects-lower-and-middle-income-households-in-the-DMV-scaled.png)说明收入按区域家庭分布三等分；报告文字称中等收入群体约四分之一有食物不安全。它涉及包含中位数的收入层，不是精确中位家庭或本国公民的专门估计。

[DC Health 2026-06-12 通报](https://dchealth.dc.gov/release/dc-health-instacart-and-marthas-table-expand-grocery-access-pilot-program-extending-food)确认自 2025 年 10 月启动后，已向逾 1,000 个家庭提供线上购食品入口；新增最多 1,000 家庭和补助是扩张安排，未当作完成。入口与运输帮助是缓解依据，不证明所有必要食品已可负担。接受上述代表性和延续假设后，研究判断将中等收入群体仍有的重要基本资源困难作为 RES 瓶颈，取条件性 40；这不表示每位中位居民必然遇困，也不因接受援助扣分。拒绝适配假设时恢复未定，不能自动改为 60。

[2026 DC Water 原始报告](https://www.dcwater.com/sites/default/files/document/2026-06/documents/2026_CCR_6.11.26_FINAL.pdf)于 2026-06-16 公开，观察 2025 年。PDF 第 5 页记两个取水口同来自 Potomac，第 17—21 页给检测结果；报告称已检测参数满足标准，但客户龙头铅样本仍有超过行动值的点，不能扩成每户零风险或两个独立河源。[EPA 原始合规报告](https://www.epa.gov/system/files/documents/2026-07/2025-dc-annual-drinking-water-compliance-report.pdf)正文日期 2026-06-30、公开于 07-02，第 18—19 页把违规归属至 Joint Base Anacostia-Bolling、Naval Station Washington-WNY、Naval Observatory 的供水系统。不能将这些记录统归 DC Water 或整个功能区；日常供水能力也不证明食物、能源和供应链备援。

## 制度：证实的记录障碍有信息，资料少本身没有分数

[OPC／PCB 2025-09-29 原始六页报告](https://policecomplaints.dc.gov/sites/default/files/dc/sites/office%20of%20police%20complaints/publication/attachments/Stop%20Reports_FINAL.pdf)第 2—4 页审查 2021-09 至 2025-03 投诉相关停查案件的 77 份随机抽取报告：标准 stop card 栏未完成。**MPD 的回应也保留：这些标准栏在系统中对警员不可见／不可用，警员另填定制栏，并称满足要求。** OPC 认为仍缺搜查理由、同意、扣押及逮捕等法定信息；不是说 77 份完全没有停查数据，更不是全城随机停查普查。[原法 §5–113.01(a)(4B)](https://code.dccouncil.gov/us/dc/council/code/sections/5-113.01)可核对记录义务；本例归属为监督机关判断，未冒充新法院判决。

这里的缺项来自查验实际应记录材料，具有具体问责意义，区别于研究者没有搜到资料。公开监督及替代记录本身是反证的反证；尚未核验整改效果、2026 延续或整个功能区影响，**不能仅因公开缺陷自动将 ISR 改为 40**。结合实际服务执行暂取条件性 60，必要假设拒绝则未定；更广泛且未缓解的问责障碍需要另证，透明披露不成为机械扣分理由。

[2026-06-12 实际暑热警报](https://mayor.dc.gov/release/mayor-bowser-activates-extreme-heat-alert-urges-residents-and-visitors-exercise-caution-and)列既有避暑场所、全天热线和无障碍接驳，支持 PCS 防护及 ISR 执行的不同命题；不把同一设施重复当两份独立证据，也不由警报推出健康损失已经降低、压力恢复有效或全区居民均能到达。

## 医疗、长寿与技术：分别看交付，不能相互补分

[MedStar Washington 2024-05／06 原始刊物](https://www.medstarhealth.org/-/media/project/mho/medstar/newsletters-pdf/medstar-washington-hospital-center/whc-connections-may-june-2024-final-2.pdf)PDF 第 16 页描述已经运行的高血压远程门诊、线下衔接及院方观察到的血压／爽约改善；未给样本数或对照，不视为全城因果效果。原文也记老年人常需技术帮助、部分患者无设备，保留实际可及短板。第 6 页是阿尔茨海默病药物知识说明，**不是当地已给药人数**。MED 的实际慢性病交付与 LON 的特定转化链分别判断。

[MedStar 心血管原刊 Spring 2026](https://www.medstarhealth.org/-/media/project/mho/medstar/newsletters-pdf/mhri/cardiovascular-physician-spring-2026_final_web.pdf)，PDF 第 5—6 页（印刷页 8—11）报告华盛顿中心实际 LVAD 植入，并将巴尔的摩术后照护另列。它补强 MED 专科交付，未给本地受控效果、精确 2026 全年人数或中位居民获得率；国家登记结果不作为当地疗效。封面季期与 PDF 创建／修改元数据 2026-06-08 分开记录，未核验确切公开日或截止日存档。一般晚期心衰专科治疗不自动等于长寿专项转化，亦不在 MED 与 LON 重复奖励；本轮尚未建立它可支持共同 LON 档位的专项链条，LON 继续未定。

[当前医院网页](https://www.medstarhealth.org/locations/medstar-washington-hospital-center)提供急诊、专科及保险核对入口，并称 FY2024 急诊逾 78,000 次；未注明发布时间，只补充核对历史服务，不当作已冻结的截止日快照或全区去重病人数。[2026 Marketplace 自付上限](https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/)为单人 10,600 美元／家庭 21,200 美元，但不含保费、未覆盖项目和网络外等开支，也不适用于所有通常医保。年份明确、网页未注明发布时间；仅作费用规则背景，不直接证明本地中位居民承担能力。MED 60 仍须接受历史服务延续、通常治疗可得、质量与负担假设，拒绝则未定；价格或上限“看起来高”也不是 40 的自动依据。

[FDA 2023-07-06 正式批准](https://www.fda.gov/news-events/press-announcements/fda-converts-novel-alzheimers-disease-treatment-traditional-approval)依据 1,795 人确证试验的 18 个月临床量表减缓；适用早期阿尔茨海默病，保留 ARIA 等严重风险，不承诺健康居民寿命延长。[CMS 同日覆盖说明](https://www.cms.gov/newsroom/press-releases/statement-broader-medicare-coverage-leqembi-available-following-fda-traditional-approval)另有 Medicare、适应证及登记条件，原 Medicare 仍有相应自付；公民不自动满足。[McLean 当前输液入口](https://www.medstarhealth.org/Locations/Infusion-Center-at-McLean)列 lecanemab，但网页未注明日期，未核验截止日前实际给药数量、等待及目标居民获得率。因此本例 LON 未定；它与东京已核验年度实际给药记录的证明强度不同，不能照抄东京 60。

[GW 2026-01-16 原始研究汇报](https://facultysenate.gwu.edu/sites/g/files/zaxdzs6626/files/2026-01/facsen_researchupdate_january2026_final.pdf)PDF 第 11 页列 FY2025 的 53 项披露、19 项美国专利和 8 项许可，第 17 页列资助研究金额 234.9 百万美元；不把资助金额和含内部投入的总研发合并、不把单校推广为全区。联邦资金依赖和 FY2026 半年数据保留，后者不是全年结果。[OCTO FY25—26 原始监督答复](https://dccouncil.gov/wp-content/uploads/2026/02/FY25-26-Performance-Oversight-Pre-Hearing-Response_TO0-01.23.26_Final.pdf.pdf)PDF 第 23 页记 FY2025 已办 177 次数字训练及 823 处室外热点，也记项目唯一供应商 WeLink 于 2025-06 退出。活动和设施存在支持有限扩散，未测居民普及或实际效果；供应商退出不等于全区断网。TEC 60 有实际交付支持，但距离多节点、广泛受益的 80 仍有缺口。

## 安全：实际伤亡和处置仍不足以选择整维档位

[MPD 暂定犯罪表](https://mpdc.dc.gov/dailycrime?os=f)截至 2026-10-07 午夜列当年 homicide 78、ADW 993、violent crime 2,166；原页明示暂定、会修订，且为 DC Code 分类，非 FBI NIBRS。这里保留计数口径，不将 homicide 项擅改为独立死亡人数，不推导全区组织暴力率，亦不因总犯罪下降而填 GSS 60。区域外溢、战略暴露及缓解影响仍未充分核验，GSS 保留未定。

[2025-05-22 原始投诉及宣誓书](https://www.justice.gov/usao-dc/media/1401421/dl)七页记录博物馆外 05-21 袭击、两名死者及警方和急救响应；[DOJ 08-07 通报](https://www.justice.gov/opa/pr/alleged-perpetrator-shooting-washington-dc-charged-hate-crimes)另述两人逃离未受伤、逮捕和调查。两份材料属于同一事件，不重复计数。控方把动机与以巴冲突联系，属于有归属的指控说明，不证明有组织团体成员身份或最终定罪。

[DOJ 2026-01-09 通报](https://www.justice.gov/usao-dc/pr/lakanwal-newly-indicted-shooting-guardsmen-near-white-house-killed-sarah-beckstrom)记 2025-11-26 在 DC 的袭击、Sarah Beckstrom 次日死亡、Andrew Wolfe 重伤，以及两名附近军官实际制伏嫌疑人；[原始起诉书](https://www.justice.gov/usao-dc/media/1422931/dl)五页核对这些指控和日期。华盛顿州是被指旅行起点，不是案发城市。通报日期与 PDF 创建元数据 2026-01-12 分开，未将后者冒充公开日；直接下载通报得到 HTTP 200 的机器人验证页，因此不登记虚假的内容哈希。

上述记录证明具体严重伤害和已发生响应，不证明两起就是全年全部事件、普通居民总体影响低或全功能区安全能力充分。没有受害者居住／国籍分母，不使用 2015 人口算 2026 风险率；现场制伏及事后调查也不等于预防成功或已排除持续威胁。与苏黎世、东京的共同规则一致：少数事件不自动降档，实际处置不自动填 60；华盛顿仍缺足以支持总体影响判断的组合，GSS 保持未定。

## 退出：共同四类通道规则下的条件性 60

[MWAA 2026-02-24 通报](https://www.mwaa.com/news/washingtons-airports-served-record-54-million-passengers-2025)列 2025 年 IAD／DCA 客流约 2,901／2,489 万、年底目的地 164／108；客流是旅次，不是独立居民或压力运力。通报也记 DCA 下滑、停摆及事故后影响，不能只保留正面总量。[2026-06-16 航班调整通知](https://www.mwaa.com/news/flight-schedule-adjustments-expected-summer)是后续空域关闭及航班调整安排，不当作执行完成记录。

[Fairfax 2025-03-25 会议原件](https://www.fairfaxcounty.gov/transportation/sites/transportation/files/Assets/Documents/PDF/dulles%20tax%20advisory%20board/March%2025%202025/Silver%20Line%20Update_Commission2025.pdf)归属 WMATA 的 02-27 数据：机场站自 2022-11 开通累计 323 万旅次，支持已运行的铁路接驳，不是 323 万独立机场用户。[票价第 47 版](https://www.wmata.com/content/dam/wmata-com/migrated-assets/about/records/upload/tariff-47.pdf)于 2025-11-18 生效，第 9—11 页普通铁路单程为 2.25—6.75 美元，另有附加费／差额和支付条件；[2026-04-23 FY2027 预算通报](https://www.wmata.com/news/wmata-board-of-directors-adopts-fy2027-budget-with-expanded-service-and-no-fare-increase.html)保持票价，12 月增班和现代化仍是计划。会议日、生效日和文件元数据不是精确公开日，截止日前存档未核验；历史接驳及条款延续、全区通常可到达及居民可承担均作为必要假设。

[共用法律审阅](cci-legal-mobility.md)已核验德国 AufenthV §41(1)、(3)、(4) 及 AufenthG 的居留／就业要求，并在全量矩阵关联美国公民，包括本例。免签入境后通常 90 日内申请所需许可，是程序路径，不是已获长期居留或工作权；ICT 例外、居留目的、生活保障及技术工作者资格／年龄条件仍保留。法律子项为部分，原籍中位收入不证明德国负担、工作取得或获批；必须接受目标居民通常能取得合适目的路径及承担迁居的假设，否则 OPT 未定。

[Chase 2026-06-14 生效个人账户原件](https://www.chase.com/content/dam/chase-ux/documents/personal/checking/ABSF-en.pdf)第 1—3、13、15 页说明账户须批准，Total Checking 月费及豁免条件；线上美元国际转账 40 美元，外币 5 美元或达到 5,000 美元免该项手续费，但汇差和中间行费用仍在。**Secure Checking 明确不提供汇出电汇**，不能把所有普通账户都当作可用路径。条款支持已提供的个人跨境服务，不是当地居民已转账记录，更不证明资产已变现、审批必过或危机时不冻结。[CFPB 2024-10-03 审阅说明](https://www.consumerfinance.gov/ask-cfpb/if-i-want-to-use-my-bank-or-credit-union-to-send-money-to-someone-in-another-country-do-i-have-any-federal-protection-en-1733/)保留合格汇款及提供者条件；消费者保护不是汇款获批、保证到账或资金转移上限。资产子项改为部分，仍须普通居民能取得合适账户、合规可转资金及目的地接收条件的假设。

[AlertDC 2026-01-14 23:14 最终通报](https://trainingtrack.hsema.dc.gov/NRssV2/RssFeed/AlertDetails/63703)转述 Verizon 服务已恢复，并确认此前部分用户无法拨打 911；仍有问题时建议其他运营商电话、座机或直接到警察／消防站。**恢复为提供者报告，替代建议不是普遍触达或实际使用率。** [FCC 01-28 三页公告](https://docs.fcc.gov/public/attachments/DA-26-94A1.pdf)就该故障征集影响材料：全国持续时间和用户规模不改写为 DC 实测，调查问题不是最终结论，也不证明零伤亡或到截止日调查仍未结案。应急人员专用优先通信不能当作普通居民的直接备援。通信子项改为部分，但压力下可获得替代联系手段仍是必要假设。

接受上述支持和明确假设后，沿用共同 60 档：多类通道有能力依据，但资格、负担、容量及共同失效仍有短板。不同费用产品与真实故障不机械扣成 40，也不由机场数、法律条文、低标价或恢复通报支持 80。拒绝任何必要的普通可获得性、负担、时间或全区适用假设时，OPT 恢复未定，不为了成绩单保留 60。这与东京退出案例采用相同要求，未另设美国专用阈值。

## 复算与下一条有价值的证据

接受六项必要假设时，加权贡献为 `9 + 9 + 4 + 9 + 6 + 6 = 43`；GSS／LON 未定权重合计 25%，所以数学域 **43—68、无中心**。不是把已知维度归一化成总分，也不是城市保证区间或入围概率。撤回 OPT 后恢复此前快照 37—72；撤回 RES 后为 39—74；只有新证据支持其满足 60 条件时才为 45—70。撤回 MED 后为 34—74；单有医院入口不保留 60。暂改 ISR 为 40 的情景是 40—65，暂改 OPT 为 40 时为 41—66，但现有材料不自动赋予这些低档。全部判断撤回仍为 0—100。

最能改变本例结论的补证是：将收入、国籍及供给经历适配到目标居民并核验援助后实际负担；核验警务整改及问责后果；补有时间依据的当地长寿采用和可及路径；补 GSS 更完整实际影响及缓解组合；检验 OPT 普通居民取得资格、账户及故障替代的假设。新证据不能凭更齐的资料量加分。

统一矩阵及[全候选位置演算](cci-local-2026-rank-audit.md)纳入本例后仍保留所有 9,031 个候选：五份完整条件性中心、两份部分案例、9,024 个尚无此类审阅、零有依据排除。华盛顿在给定条件下仍可能位于 1—9,031；这组数学域未证明任何城市入围，也未解决旧范围外竞争者。
