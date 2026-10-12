# Los Angeles 功能区：居民保护瓶颈与实际能力分别判断

证据截止 2026-10-10；查阅日期 2026-10-12。本国公民、通常长期居住、当地中位收入及通常医保，沿用[共同档位](cci-local-2026-scoring-calibration.md)和原权重。**PCS 条件性 40；ISR／MED／LON／TEC／OPT 条件性 60；GSS／RES 未定，总分中心为空。** 八维及全部 31 项有审阅状态，不表示均已充分测量、稳定名次或全球入围。

## 对象与边界

冻结 **eFUA 1642** 源名 Los Angeles，面积 10,407 平方公里、2015 人口约 1,566 万，中心 ID 为 11／12／14／16／41／45。既有十案例之外，全量机构目录关联 1,483 条，为下一研究顺序；不是独立机构数、产出或入围条件。

原件经 SHA 校验，复用全量几何加载与 `always_xy` 投影；Los Angeles、Palisades、Altadena 与 UCLA 校园的四个近似参考点均唯一相交 1642。**这不是完整市／县域、火灾周界、受害家庭或治疗地点的验证。** LA 县、市、供水运营区、医院网络及机构与冻结功能区的覆盖不同；没有增加城市名额、继承旧分数或完成 `boundaryReview`。原件、缺原件说明及点核验见[结构化案例](data/cci-local-2026-los-angeles-case.json)。

## 八维判断

| 维度／权重 | 判断 | 支持、反证与必要假设                                                                                                                                     |
| ---------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PCS／15%   | 40   | 已记录的重大野火损失／防护缺口，与恢复和已实施措施并列；须接受保护瓶颈仍重要、影响画像居民且延续到截止日，不能仅由旧灾难或未完成建议给低档               |
| GSS／15%   | 未定 | 无当年初步归属记录不证明安全；交通一般犯罪、披露与执法工具不覆盖全区组织暴力、外溢和战略影响                                                             |
| ISR／15%   | 60   | 实际恢复执行、已使用流程和培训与协调／触达缺口并列；须接受主要制度通常可运作、延续且未有更广泛未缓解瓶颈                                                 |
| RES／10%   | 未定 | 实际恢复供水供电有支持，毁房与仍存建筑分开；食品／能源当前负担、独立供给及全区触达未解决                                                                 |
| MED／15%   | 60   | 当年实际常规／专科交付与分时期质量、等待和患者体验；须接受必要治疗通常质量可接受、可得／可负担与持续，不用规模或体验代替疗效                             |
| LON／10%   | 60   | 实际现场试验、人体／监管链与区域理赔及实施路径支持有限准备度；须接受路径代表性、当地交付推定、适当新监测、合资格普通居民通常可得／可承担；不把计划当交付 |
| TEC／10%   | 60   | 实际许可收入与有限数字服务、参与分别判读；须接受持续产出、连接与可用扩散，不由机构／外部排名给高档                                                       |
| OPT／10%   | 60   | 实际交通、接驳和共用附条件法律／账户路径；须接受资格、负担、通信替代、延续与全区适用，不计计划列车或默认独立灾时备援                                     |

拒绝任何有分维度的必要假设，就撤回为未知。新增低／高档也需自己的实际支持；未知项不填中点，原权重不重新分配。相同事故没有自动对多维重复扣分：PCS 审居住防护瓶颈，ISR 审实际执行／恢复；资源恢复是否充分则仍须独立验证。

## 旧失效与当年缓解对读

[2026-09-11 正式发布](https://lacounty.gov/2026/09/11/la-county-releases-second-after-action-review-covering-recovery-and-repopulation-operations-following-2025-wildfires/)的恢复复盘，实际观察 **2025-01-07 至 03-31**。[摘要](https://file.lacounty.gov/SDSInter/lac/1217421_LACountyAARofRecoveryandRepopulationEfforts-ExecutiveSummary.pdf)与[发现／建议](https://file.lacounty.gov/SDSInter/lac/1217422_LACountyAARofRecoveryandRepopulationEfforts-FindingsandRecommendations.pdf)同时记录有效的即时执行、互通通信、清障及服务，与重复奔波、信息／协调和安置缺口。完整原报告未取得；没有声称已读全本，也不把 2026 发表年换成结果观察年。

[2026-08-03 整改文件](https://file.lacounty.gov/SDSInter/bos/bc/1214307_AARBoardMemoSecondReportBack_finalsigned_.pdf)区分已使用的告警辅助工具、实际交付培训及生效的组织调整，与拟议／在审方案、招聘和后续治理。**“Ongoing” 包含已建立的持续任务，不能一概算作未启动。** 批准岗位不等于到岗，完成演练不证明重大灾时有效；原表数字未目视核验，不发布推测的到岗率或整改完成率。

[LADWP 2026 一年更新](https://www.ladwp.com/sites/default/files/2026-01/Palisades%20Fire%20-%20One%20Year%20Anniversary%20Summary%20ADA.pdf)已提取全文并审阅恢复与未来工程：2025 年一月恢复水压，三月恢复安全饮水和**仍存在建筑**的电力，六月水库恢复运行；被毁住宅没有因此恢复。救助期限和后续工程不当作已延续至十月的全面保障。恢复是重要反证，不把过去断水／断电默认成当前全区失效。

PCS 40 是可撤回的研究判断：接受重大暴露与保护缺口仍为画像居民重要瓶颈，且已完成改善尚未充分解除的推定。若新的现状／压力结果证明该瓶颈已消除，须重选档；仅拒绝推定就保持未知。ISR 60 则依据执行与缓解继续发挥主要作用的假设，不能因为发布失效报告而机械惩罚透明度。

## MED：实际交付不等于所有居民同等获得

[官方八月仪表板](https://file.lacounty.gov/SDSInter/dhs/1218651_LAHS_D_A-BoardMotionDashboard-August2026.pdf)十一页原文已审：服务量至八月，患者体验至第二季度，质量实际值为**四月**，另一列是 2026 目标。不同月份不混作当月成绩，也不把目标记作已经达到。

专科按 eConsult 指定期限衡量及时性，晚期又分患者因素／容量因素；不等于跨城市统一等待期限。患者体验的最高档回答比例不是治疗效果。糖尿病指标是控制不佳比例且越低越好，不能用统一“数值高较好”读表；其他指标各有自己的适用人群。脚注称时长为中位数，与部分图题的“Average Cycle Time”并存，汇总口径仍需确认，更不能等同收入中位居民的就医经历。未目视核图，不发布可能错配的数值。

实际医疗能力支持条件性 60，仍要求通常治疗质量、资格、等待、个人支出、连续性和全功能区触达假设；不从规模、奖项、预算或有服务入口给 80。公开系统患者不是全区居民的代表样本，必要可及性推定拒绝则 MED 恢复未知。

## LON：实际试验、实施、批准与商业获得分开

[UCLA 2026-03-27 原文](https://www.uclahealth.org/news/release/fda-approves-gene-therapy-severe-leukocyte-adhesion)明确，九位国际试验参与者中有六位由 UCLA 团队入组和治疗；不把所有九人归本区，也不把六人叫作本地居民。[FDA 批准](https://www.fda.gov/news-events/press-announcements/fda-approves-first-gene-therapy-severe-leukocyte-adhesion-deficiency-type-i)及[原标签](https://www.fda.gov/media/191722/download)是基于标志物的加速批准，儿童疾病／供者条件及确证临床获益要求保留。公告的预期商业供应不能记作已完成治疗。

[Cedars-Sinai 原论文](https://pmc.ncbi.nlm.nih.gov/articles/PMC11368232/)描述已建立审阅、财务和照护协调，以及**拟议的十患者／五开方者试点**。十人不是实际已治疗数；[2024-10-01 机构说明](https://www.cedars-sinai.org/newsroom/a-blueprint-for-managing-complex-therapies/)的已实施流程也不是给药人数或 2026 新 MRI 要求已落实的证明。

[统一公开理赔](cci-cms-lecanemab-adoption-signals.md)在 1642 有六条精确登记地址信号，无非精确待查行。它们不是治疗地址，不归属给 Cedars 或 UCLA，也不跨提供者求居民人数；1 毫克单位不是输液次数。[UCLA 的全国采用研究](https://www.uclahealth.org/news/release/large-disparities-adoption-alzheimers-infusion-therapy-raise)也不是本地样本，其较高社会经济 proxy 不等于本地中位收入。费用、时间负担、患者选择、有限疗效和严重风险作为约束背景保留，不直接转为本地失败率。

可信人体／监管、实际现场试验、有限区域交付推定及实施链支持条件性 LON 60；当前适当监测、合资格普通居民获得／负担及疾病路径代表性仍必须接受。拒绝则未知，不用成熟度局部优势给 80，不保证健康人延寿，更没有把拟议基因治疗供应或试点人数当作商业交付。

## TEC／OPT：实际活动与计划不混

[TDG 原刊](https://tdg.ucla.edu/sites/default/files/2025-12/TDG_Innovation_Magazine_Winter2025_final3.pdf)PDF 第 3 页（印刷 4—5）已目视核表：36 项独占协议含 14 期权／22 许可，不等于 1,592 材料转移；许可收入和研究产业资助分开。数据标记为 2025，但未建立确切会计窗口，不称其为全年／财年实绩；WIPO／Pitchbook 等外部排名不进入 CCI。

[市恢复计划](https://cao.lacity.gov/content/pdf/The%20City%20of%20Los%20Angeles_Annual%20Recovery%20Plan_July2025_vFINAL.pdf)的数字章节（PDF 145—147、印刷 128—130）区分已运行 Wi-Fi、实际参与和注册，与未来推广及预期人数。接触 1,300 多家庭、124 张新卡、232 份问卷是不同、有限且自选的活动指标，不等于家庭宽带覆盖、代表性民调或全区采用；经费支出也不是受益结果。TEC 仅在持续连接和通常有限扩散的假设下为 60。

[Metro 实际开通](https://www.metro.net/about/media-relations/now-boarding-metros-lax-metro-transit-center-station-officially-opens-connecting-communities-bringing-faster-easier-travel-for-angelenos-visitors/)与[现行接驳指引](https://www.metro.net/destinations/lax/)支持多类出行路径，[机场 FY2025 原文](https://www.lawa.org/sites/lawa/files/2025-12/LAX%20-%202025%20Annual%20Continuing%20Disclosure%20Report.pdf)是实际运行，非旧规划的 2025 预测。旅次不是去重居民；曾有[火灾公交取消／改道与部分恢复](https://www.metro.net/about/media-relations/la-metro-kicks-off-2025-with-continued-ridership-growth/)。APM 预期开通、机构无线电或地图不作为普通居民已取得独立备援的证明。

美国公民法律与资产沿用[共用德国申请条件](cci-legal-mobility.md)及已审 Chase 2026 条款；申请／账户／汇款均附资格、审批和成本条件，不是已迁居或转账。接受通常可用、可及、可承担的交通与通信等假设，OPT 条件性 60；独立压力冗余尚未证明。

## 复算与入围检验

六项固定贡献 `6 + 9 + 9 + 6 + 6 + 6 = 42`；GSS／RES 共 25% 权重未知，**数学域 42—67、无总分中心**。不是可靠城市界限、概率或排除依据。

- 撤回 PCS：36—76；撤回 ISR／MED：33—73；撤回 LON／TEC／OPT：36—71，均无中心。
- 仅新的保护结果支持 PCS 60 才为 45—70；仅新证据支持 LON 40 才为 40—65，不是当前赋值。
- 仅同时实际支持 GSS／RES 为 60 才有条件中心 57；不是默认补中档，其他必要假设仍可撤回。
- 当前全量算术位置仍可能为 1—9,031；撤回全部假设为 0—100，无中心。

接入后为十一份八维审阅、五份完整条件中心、六份部分案例，9,020 个尚无此类审阅；所有候选保留、零排除。下一项检验本区保护瓶颈是否仍重要、实际安全影响、必要资源负担及临床获得／监测，同时继续评价其他可能入围竞争者。没有形成真实 80 锚点、合格第 32 名门槛或全球 Top 32。
