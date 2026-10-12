# Chicago MED / LON 临床证据复核

口径：冻结 **eFUA 6654，Chicago，USA**；2026 年当地普通美国公民、通常长期居民、当地中位收入、通常医保。证据截止 **2026-10-10**，查阅 **2026-10-12**。沿用[共同评分规则](cci-global-scoring-rubric.md)，与 [Boston](cci-local-2026-boston-case.md)、[首尔](cci-seoul-clinical-review.md) 的判断边界一致。本文提出条件性研究解释，主案例负责采信；不是完整候选比较、量尺客观校准或全球入围结论。

## 建议与相邻档位

| 维度 | 建议               | 判断及可撤回条件                                                                                                                                                                                                                                                                                      |
| ---- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MED  | **unknown / NULL** | 本地确有常规、必要专科、质量监测及已实现的费用／转诊缓解，也有急诊未等就离开、慢病控制、感染指标与保险负担反证。来源没有充分连接通常中位、有通常医保的居民与全功能区的及时性、质量、实际账单及压力连续性；不能只由服务存在填 60，也不能把旧安全网患者结果推广为全区 40。                              |
| LON  | **条件性 60**      | FDA 的可信疾病人体证据、真实 Medicare 理赔及 Northwestern 的已实施处方／监测路径共同支持有限转化；成熟度与普遍可得性有明确限制。须接受疾病路径代表性、本地交付推定、历史实施到截止的延续、当前适当安全监测，以及合资格普通中位居民通常能进入并承担相应保险后的费用。拒绝任一必要假设，恢复 **NULL**。 |

**MED 40 / 60 尚不能稳妥区分。** 已见质量和可及性短板具有临床意义，但没有足够的分母、当期结果及目标居民匹配，证明这些在已实施缓解后仍构成整维显著约束；也没有充分依据把其通常质量、专科及时性和经济负担默认看作适足。下一条有辨别力的证据应是截止前本地多类常规／必要专科实际接诊与结果、等待和通常保险后的总自付资料，覆盖跨州相关人群并说明急救／转诊连续性。若证实重要约束经缓解仍成立，可审 40；若支持广泛通常可得且质量适足、仍有重要短板，可审 60。80 需要更强的质量、转诊和压力连续服务基础，不由机构排名或单项低并发症率支持。[共同规则](cci-global-scoring-rubric.md)

**LON 60 不是“治疗过，所以自动 60”。** 这里有真实收费交付信号、院方既有处方及监测安排、明确人体／监管与支付路径；这些共同支持高于纯研究或拟供应的有限准备度。本次没有核到类似首尔队列的实际候补、产能下降和转诊受阻组合，故不能仅凭高标价、当前费用未知或收集不到新队列就给 40。也不能因此宣称没有障碍。若取得当期通常合资格居民的拒保、自付不可承担、实质候补或必要 MRI 无法完成等原始证据，并确认缓解后仍重要，应重审 40；若成本、时间或范围假设只是被拒绝而没有实质反证，应回到 NULL。两种抗淀粉样蛋白药和四个 NPI 不等于多条不同延寿路径，不支持自动 80。[Northwestern 2024 处方说明](https://www.brain.northwestern.edu/docs/Statement-on-Lecanemab.pdf)、[CMS 原始理赔](https://data.cms.gov/data-api/v1/dataset/335e5f35-eca6-482d-87b3-f99883e213e3/data?filter%5BHCPCS_Cd%5D=J0174&size=5000&offset=0)、[共同规则](cci-global-scoring-rubric.md)

## 1. 候选地域、日期与居民适用

[冻结 CSV](data/cci-global-candidates-r2019a.csv) 的 eFUA 6654 为 Chicago，UC 集合 `634;635;644;648;652`，面积 13,185 km²，2015 模型人口约 880 万。不能把别的候选中 UC 编号 6654 当本候选。[主案例点位检查](data/cci-local-2026-chicago-case.json)包含 Gary 近似参考点；这意味着调查不能按 Chicago 市或 Illinois 收口，但点位相交仍不认证完整医疗服务区、实际输注地点和居民覆盖。Cook County、Northwestern 网络、McHenry County、Illinois 与跨州 eFUA 不可互相替换。

下文严格分开 **观察窗、文件／网页标示日期、生成或修订元数据、首次公开资格、此次获取字节**。原件日期均早于截止或未定；未取得 10 月 10 日历史字节存档。题名、路径、生成日期不是首次公开的独立证明；未定来源只在明示截止前可用假设下参与条件解释。查阅日当前服务页不能自己证明截止日所有内容已经存在。[原件表](#原件与日期核验)

“当地中位收入”尚未被转换为某个家庭规模及 NM 家庭收入口径；“通常医保”也不是全民 Original Medicare。年龄、保险类型、网络、补充保险、注册医师和病情资格都改变路径。因此不把美国公民身份、当地居住或法定批准当作每人均获保，更不把 Illinois 的非急诊财援规则当 Gary 居民的当然权利。[CMS 资格与费用](https://www.cms.gov/newsroom/press-releases/statement-broader-medicare-coverage-leqembi-available-following-fda-traditional-approval)、[NM 财援政策第 9、13—14 页](https://www.nm.org/-/media/Northwestern/Resources/patients-and-visitors/billing-and-insurance/financial-assistance/english/nmhc-financial-assistance-policy.pdf?la=en)

## 2. MED：实际质量、已实现缓解与真实约束

### Cook County Health：两个医院和基层样本，不是全区通常居民

[2025-01-17 质量与患者安全委员会有效原 PDF](https://cookcountyhealth.org/wp-content/uploads/01-17-25-QPS-scan-Minutes.pdf)有 **33 页**，附件是 **2024 实绩**与未来目标。PDF 元数据生成 2025-01-21、修改 2025-01-24，不宜把会议日称作已证明的文件公开日。以下页码均为 PDF 页，附件印刷页另列。

| 实际指标                       | 原值／观察窗                                                                                                                       | 能支持及不能支持的解释                                                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Provident，PDF 19 / 附件印刷 3 | 滚动 12 月急诊 **Left Without Being Seen** 从 2024-01 的 **7.17%** 到 2024-12 的 **4.78%**；7 月曾为 7.97%。图例为未达目标但改善。 | 是实际未等到接诊就离开的比例及缓解趋势，不是等待时间中位数、治疗失败或每人原因；没有给出各窗患者数、优先级和目标居民匹配。       |
| Provident，同页                | 滚动 12 月 **SEP-1 过程依从** 2024-11 为 **50%**。                                                                                 | 有真实过程短板，不能等同脓毒症生存率、所有患者只获一半必要治疗或已证明过错。                                                     |
| Stroger，PDF 23 / 印刷 7       | 同院全因再入院 **月值 2024-10 为 8.97%**；含其他医院的 **滚动 12 月值截至 2024-08 为 11.9%**。                                     | 月窗、滚动窗和院际范围不同，不能直接做改善幅度或风险调整死亡结论；病例数、完整纳排和风险调整未给出。                             |
| Stroger，同页                  | 月度 **CAUTI SIR** 2024-06 / 07 为 **2.19 / 2.13**，11 月为 0.51；**CLABSI SIR** 7 / 8 月为 **2.40 / 2.36**，9—11 月为 0。         | 出现过感染质量旗标并有后续降低，不能只选年底值消除反证；SIR 不是百分比，也不是全年所有感染零，未核完整观察／预测病例与暴露分母。 |
| ACHN，PDF 27 / 印刷 11         | `Engaged & Affiliated Rolling 12 Months` 高血压患者 **BP <140/90** 比例 2024-12 为 **55%**；1 月为 57.5%，5 月为 60.1%。           | 是已参与及关联患者的慢病控制样本，支持通常质量仍有缺口；不是全 eFUA 高血压控制率，更没有公民、收入、医保分层。                   |

上述各项及图例均来自[同一原表，第 19、23、27 页](https://cookcountyhealth.org/wp-content/uploads/01-17-25-QPS-scan-Minutes.pdf)。过程、感染比、再入院和慢病控制不能机械相加成医疗分数；潜在风险与改善应共同保留。第 20、24、28 页为 **2025 目标和策略**，其余中长期接诊目标也不是已完成等待结果。没有取得完整最新本地质量队列不证明机构未监测，也不授权把 2024 队列默认为 2026 原样持续。

### Northwestern：2025 专科结局与 2025—2026 已完成辅助

NMH 的[诊断性脑血管造影后 24 小时卒中／死亡指标](https://www.nm.org/about-us/quality/quality-measures/sites-of-care/northwestern-memorial-hospital/medical-care/stroke/24-hour-stroke-and-death-rate-following-diagnostic-cerebral-angiogram)当前原 HTML 图表明确 `Date Updated: Tue Mar 24 2026`，2019—2025 医院系列全为 **0%**，其中 2025 是新近观察年；不是因抓取没有图像而补零。图表标示来源 The Joint Commission，但没有给出各年人数、完整纳排及调整；`national-series` 为 1，未核其是标准、目标还是实测，不宣称全国卒中死亡率为 1%。这支持单一必要专科的有限好结果，不能推出常规医疗均优、所有居民可及时进入或 24 小时以后的结局。

NM [2026-03-06 原发布](https://news.nm.org/northwestern-medicine-and-family-health-partnership-clinic-strengthen-lifeline-for-uninsured-residents-of-mchenry-county/)报告 FHPC 在 **2025 年已使志愿 NM 医师翻倍以上**，服务更多患者而等待没有增加；已有增加人员、服务和远程流程、NM 必要专科转诊与快速财援申请。FHPC 不接收保险，服务 **McHenry County 未保险成年人**，采用滑动收费及无力支付不拒绝服务；并有基层、行为健康、内分泌／骨科、牙科、药房等真实入口。这是费用与转诊缓解，不只是未来预算；但“更多／未增加等待”没有提供患者量、等待天数、分母及比较方法，不能当独立全区效果验证。

同一原发布也报告部分家庭保费、网络与 copay 压力、复杂病情及因贫困和工作安排延误就医；它们是院方／伙伴一手叙述，不是当地中位有保险居民的概率估计。预计 2026 需求激增是预测，宣传性“优于私人保险人群”没有附结果队列，本笔记不以其支持质量高档。Crystal Lake / McHenry 来源的实际人群与 eFUA 对应范围仍需独立核对，不假定整县均在边界内。[同一原发布](https://news.nm.org/northwestern-medicine-and-family-health-partnership-clinic-strengthen-lifeline-for-uninsured-residents-of-mchenry-county/)

这些普通护理质量和辅助证据用于 MED；后文单病新疗法实施用于 LON，不给同一临床采用双份奖励。跨州停电、家庭药品储存损失或通信中断若在主案例保留，不能直接改写为这里每家医院已停止治疗；本次没有核到上述 provider 的当期临床服务中断及备援结果。因此 **system_continuity 仍未解决**，不能从专业入口或急诊不拒绝规则默认压力下连续性。[共同规则](cci-global-scoring-rubric.md)

## 3. 费用缓解：必须读资格、账单范围与例外

[NMHC 财援有效政策](https://www.nm.org/-/media/Northwestern/Resources/patients-and-visitors/billing-and-insurance/financial-assistance/english/nmhc-financial-assistance-policy.pdf?la=en) **25 页**：第 1 页主政策标有效 2025-02-06、下一复核 2026-09-01；当前 PDF 生成／修改 **2026-04-14**，第 11 页已经是 **2026 FPL 表**。这证实当前文件混合主政策及更新附件，不能将 2026 数字倒写为 2025 批准时已公开，也不能从预定复核日推政策已失效。首次公开该当前版本及截止历史字节均未独立归档。

- 第 13—14 页 Appendix B：通常非急诊的已保险 **Illinois 居民**、家庭收入 ≤250% FPL 可获 100% 免除，包含 deductible / coinsurance 和医学必要但保险不付的服务；250%—600% 对非保险必要服务有折扣，合资格 catastrophic 路径的 12 月支付上限为家庭收入 **25%**。第 13 页排除 out-of-network、copay、specialty-pharmacy 等，deductible / coinsurance 除非合资格 free care 否则也排除。故不能把 600% 门槛当所有自付均免。[政策 PDF 第 13—14 页](https://www.nm.org/-/media/Northwestern/Resources/patients-and-visitors/billing-and-insurance/financial-assistance/english/nmhc-financial-assistance-policy.pdf?la=en)
- 第 2—4、9 页：申请、家庭收入／资产、既往或预约关系、其他给付及账单范围有条件；特权但未雇佣／未合约的医师账单不当然覆盖。第 11 页单人 2026 FPL 为 **$15,960**，250% 为 $39,900，600% 为 $95,760；家庭成员与收入口径不同，不从“当地中位收入”自行映射资格。[政策 PDF 第 2—4、9、11 页](https://www.nm.org/-/media/Northwestern/Resources/patients-and-visitors/billing-and-insurance/financial-assistance/english/nmhc-financial-assistance-policy.pdf?la=en)
- 非急诊、外州已保险申请人不符合该 free-care 居民条件；急诊另有例外。第 15—16 页未保险人的另一套 20% catastrophic 上限不能移植给已保险画像。不能从 generic 财援把 lecanemab、MRI、输注、院外医师的全部余款自动认定为已豁免，也不能从排除 specialty-pharmacy 推本地所有输注药必被排除；具体计费路径本次未核。[政策 PDF 第 13—16 页](https://www.nm.org/-/media/Northwestern/Resources/patients-and-visitors/billing-and-insurance/financial-assistance/english/nmhc-financial-assistance-policy.pdf?la=en)

规则是可用缓解的正向证据，**不等于实际获批患者数、申请通过率、居民总费用或费用可承担已测量**。Medicare、私人保险、Medigap、Indiana 资格及网络的实际组合仍须保留；也不能把 $25,000 等随意预算或未经核验城市家庭中位数补入。

## 4. LON：可信人体 → 监管／支付 → 有限本地实施

### 人体与全国直接资格：不是 Chicago 疗效

[FDA 2023-07-06 传统批准原发布](https://www.fda.gov/news-events/press-announcements/fda-converts-novel-alzheimers-disease-treatment-traditional-approval)依据 CLARITY AD 随机、双盲、安慰剂三期试验 **1,795 人**，早期 AD / MCI 且确认淀粉样病理；18 月临床下降较安慰剂减缓。它支持疾病限定的人体证据，不证明 Chicago 居民同等疗效、逆转痴呆或健康人延寿。ApoE ε4 同型合子风险、ARIA、抗凝相关出血及严重过敏限制均在主管说明中。

[CMS 2023-07-06 覆盖原发布](https://www.cms.gov/newsroom/press-releases/statement-broader-medicare-coverage-leqembi-available-following-fda-traditional-approval)要求 Medicare 参保、早期适应证、淀粉样确认，以及合资格登记、临床团队与随访。Original Medicare 在 Part B deductible 后通常付核准金额 **20% coinsurance**，有补充保险或 MA 时不同。该规则不承诺每个普通居民都参加 Medicare、所有账单费用一致或私人保险均覆盖；不得把药物标价乘 20% 作为最终当地实际账单，也不把 Part D 上限套给这条 IV Part B 路径。

[FDA 2025-08-28 安全更新](https://www.fda.gov/drugs/drug-safety-communications/fda-recommend-additional-earlier-mri-monitoring-patients-alzheimers-disease-taking-leqembi-lecanemab)新增第 **3 次输注前 MRI**，与第 5 / 7 / 14 次及基线影像共同使用；有症状须评估、紧急 MRI，必要时延迟／停止治疗。主管分析 **101 例严重 ARIA-E 报告**及触发审查的 **6 例早期死亡**，无全治疗人口分母，不当 Chicago 发生率或绝对用药死亡概率。审慎监管和真实风险应同时保留；主管要求不证明每个当地 provider 已按最新要求实施。

### 本地实施：历史处方、现在服务入口和实际理赔各有边界

NM [2023-08 医师原访谈](https://breakthroughsforphysicians.nm.org/neurosciences-clinical-article-leqembi.html)明确已经开始向 Mesulam 的合资格患者提供 lecanemab，且部分符合用药条件者已有覆盖；同时描述 MRI / 淀粉样检查、风险筛查、成本与低优势人群障碍。其说希望 2024 扩展到别处、预期 MRI 容量足够，是当时计划／预期，不能认作当期等待或已完成扩展。初始 MRI 安排不能证明已实现 2025 的更早检查。

更明确的[**2024-10-03 原签名说明，PDF 第 1 页**](https://www.brain.northwestern.edu/docs/Statement-on-Lecanemab.pdf)说已与 NMH 输注中心建立、优化安全给药和副作用监测安排，**当前只给能够在自己地点输注的患者处方**；需要早期病情、淀粉样检查、频繁 MRI，抗凝患者不建议。它是实际处方流程的正向依据和居民限制，不只是 FDA 批准、研究兴趣或拟建立中心；未给 2025／2026 已给药人数、候补、监测依从及真实 ARIA 队列。

当前 [NM Neuro Infusion Services](https://www.nm.org/conditions-and-care-areas/neurosciences/neuro-infusion-services)列 **Leqembi、Kisunla**，NMH 与 Chicagoland / 郊区的输注服务、与神经科同日安排及附条件财援。它支持现有服务入口，不证明每个地点都给全部药、每人能同日完成、实际候补时长或截止前每句话已公开。网页没有可核的发布日期／修订日，©2026 与其他 2026—2027 页脚项目不是首发依据；本地持续交付仍是可撤回推定。

[CMS 2024 J0174 有效原始查询](https://data.cms.gov/data-api/v1/dataset/335e5f35-eca6-482d-87b3-f99883e213e3/data?filter%5BHCPCS_Cd%5D=J0174&size=5000&offset=0)与[冻结的全量地址关联](cci-cms-lecanemab-adoption-signals.md)在 Chicago 保留 **4 条精确登记信号**：

| NPI／登记地址                                           | 该记录受益人数 | 受益人日 | 1 mg 计费单位 |
| ------------------------------------------------------- | -------------: | -------: | ------------: |
| 1174553580；259 E Erie St Ste 1900, Chicago IL          |             14 |       97 |        72,400 |
| 1508817941；同址                                        |             14 |       56 |        47,200 |
| 1730144882；2101 Waukegan Rd Suite 110, Bannockburn IL  |             21 |      217 |       157,000 |
| 1801852322；22285 Pepper Rd Ste 401, Lake Barrington IL |             11 |      153 |       136,283 |

数字来自上引 CMS 原 JSON；地域关系来自[全部提供者关联 CSV](data/cci-cms-lecanemab-provider-fua.csv)，**没有核实 NPI 雇佣／医院隶属，不把 Erie 地址两人归给 Northwestern**。四行不是四个独立治疗中心，不能相加为 60 名独立居民；同址两个 NPI 也不合并猜患者。服务年为 2024，方法所示登记地址提取规则指向 2025 年末 NPPES，匹配精确的是登记地址而非治疗坐标或患者居住地。存在真正已结算药物理赔是有限采用正向信号，但与院方路径相互补充仍含地域推定。[CMS 方法 PDF 第 3—6 页](https://data.cms.gov/sites/default/files/2025-04/MUP_PHY_RY25_202350312_Methodology_508.pdf)

该数据只含 **非机构 final-action Part B FFS** 公开记录，≤10 受益人记录被抑制；不含 MA、私人保险、未保险、医院机构账单、其他药及 2025／2026 给药。1 mg 是收费单位，受益人日不是完整输注次数。无治疗质量、当前合资格中位居民费用或全区覆盖；目录修改日 2026-05-21 不独立认证首次公开日，截止历史原样仍未定。[CMS 方法](https://data.cms.gov/sites/default/files/2025-04/MUP_PHY_RY25_202350312_Methodology_508.pdf)、[CMS 2024 数据集目录](https://catalog.data.gov/dataset/medicare-physician-other-practitioners-by-provider-and-service-2024-12-01)、[共用日期及字典核验](data/cci-cms-2024-lecanemab-source.json)

### 不能消除的成本与监测反证

2024 NM 签名说明把 lecanemab **$26,500 / 年**及 donanemab $32,000 标成 out-of-pocket，同时又说 Medicare 有条件覆盖；2023 访谈将 $26,500 描述为药价，并称 MRI 和其他照护显著增加成本。因此 **保留原件标签冲突，不称 $26,500 是每个已保险居民真实自付**，也不把旧价当截止最新价格。该说明仍支持重大潜在负担、私人覆盖不一致和频繁到院限制；NM 财援的例外和 CMS 20% 也不证明负担已消失。[2024 原说明](https://www.brain.northwestern.edu/docs/Statement-on-Lecanemab.pdf)、[2023 原访谈](https://breakthroughsforphysicians.nm.org/neurosciences-clinical-article-leqembi.html)、[CMS 费用规则](https://www.cms.gov/newsroom/press-releases/statement-broader-medicare-coverage-leqembi-available-following-fda-traditional-approval)

本次没有取得本地 2025／2026 给药与 MRI 完成队列、目标居民净自付／补充保险分布、输注等候与拒保分母，也没有本地 ARIA 后应急处置结果。不能从未知判“没有实施”、不能把旧 MRI 计划直接说成违反新要求。条件性 60 依靠明确转化与有限交付，再接受通常可进入／可承担和当前适当监测假设；**这些假设没有被测量消除**。最能改变判断的下一事实，是截止前 provider／主管的真实当期队列，连同注册、候补与拒绝原因、完整监测、保险后的药物／MRI／输注净费用及通常居民匹配。明确实质断点支持审 40；通常获得与负担、持续安全交付得到验证可强化 60；多条真正不同且成熟的可信临床路径及居民获得条件才支持审 80。[共同规则](cci-global-scoring-rubric.md)

## 原件与日期核验

新增有效原件保存在 `/private/tmp/cci-global/chicago-clinical/`；CMS / FDA 共用原件沿用下列既有目录。均于 **2026-10-12**取得或在本轮重新读取核验，下载字节的 SHA-256 只认证当前有效内容，不认证截止历史公开或质量代表性。三 PDF 页数与正文均已核；CCH 第 19／23／27 页还已视觉复核，HTML 主体和质量图表属性均实际读取。

| 文件／原始 URL                                                                                                                                                                                                                      |    字节 | SHA-256                                                            | 观察／标示时间及公开资格                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------: | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `cch-qps20250117.pdf`；[CCH](https://cookcountyhealth.org/wp-content/uploads/01-17-25-QPS-scan-Minutes.pdf)                                                                                                                         | 1787922 | `7cf6a8e6ef7f722047b20a3021f0c328479a6ee7f17adc70fdf32566ed9c8a7a` | 33 页；2024 指标，会议 2025-01-17；生成 01-21、修改 01-24；首次公开 NULL，非会议日证明。    |
| `nm-angiogram2026.html`；[NMH](https://www.nm.org/about-us/quality/quality-measures/sites-of-care/northwestern-memorial-hospital/medical-care/stroke/24-hour-stroke-and-death-rate-following-diagnostic-cerebral-angiogram)         |   71086 | `4374b593ae54e288d9b1435933aa5ac7c16765fd0e4b6345f86b457d6d93e220` | 2019—2025；原图表更新 2026-03-24；截止历史字节未归档。                                      |
| `nm-fhpc2026.html`；[NM/FHPC](https://news.nm.org/northwestern-medicine-and-family-health-partnership-clinic-strengthen-lifeline-for-uninsured-residents-of-mchenry-county/)                                                        |  103547 | `5590e1cbf32ae78b8adeb224ae828aeed46cfbfc4d16066bb80dff7c01b3e3c1` | 原发布 2026-03-06；2025 医师增加及当期服务，2026 需求预测分开；历史字节未归档。             |
| `nm-financial-assistance.pdf`；[NMHC](https://www.nm.org/-/media/Northwestern/Resources/patients-and-visitors/billing-and-insurance/financial-assistance/english/nmhc-financial-assistance-policy.pdf?la=en)                        |  629398 | `530a375798e664ddd8a836ec7edda7096e567e1a09c2c760adc2288bd520b44a` | 25 页；主政策有效 2025-02-06，当前 2026 FPL；生成／修改 2026-04-14；当前版本首次公开 NULL。 |
| `nm-leqembi2023.html`；[NM 医师访谈](https://breakthroughsforphysicians.nm.org/neurosciences-clinical-article-leqembi.html)                                                                                                         |   88500 | `189a9313bd9128e813b52ac4c9cb58ab61b4afdae9cff9a8009ac28fa0805195` | 页面标 2023-08；开始提供与后续计划分开；历史字节未归档。                                    |
| `nm-lecanemab-statement.pdf`；[NM 签名说明](https://www.brain.northwestern.edu/docs/Statement-on-Lecanemab.pdf)                                                                                                                     |  167606 | `c6d760c498a68dab3eda7fe9afa09c4bdb5ba4dfc2f10a9b0da16a4ef30473a1` | 1 页；正文和生成／修改 2024-10-03；首次公开 NULL；不是 2026 实施队列。                      |
| `nm-neuro-infusion.html`；[NM 入口](https://www.nm.org/conditions-and-care-areas/neurosciences/neuro-infusion-services)                                                                                                             |   76250 | `639e38f91cce8514a14840f96054361549a13b858a515e037915359e5eceff51` | 当前服务页；发布／修订日 NULL，不能以页脚推截止资格。                                       |
| `fda-traditional2023.html`；[FDA](https://www.fda.gov/news-events/press-announcements/fda-converts-novel-alzheimers-disease-treatment-traditional-approval)                                                                         |   38519 | `307b7e2d5a29aa3a0dc7edc62d3b156bb3e8e03efa8038ce230949faeaef8f63` | 主管发布 2023-07-06；三期观察不是本地结果；历史字节未归档。                                 |
| `/private/tmp/cci-global/washington/cms-leqembi.html`；[CMS 覆盖](https://www.cms.gov/newsroom/press-releases/statement-broader-medicare-coverage-leqembi-available-following-fda-traditional-approval)                             |   55743 | `4f62e357fbb58b44ae6f7eb238cb3e2a728dc2841245e7127e2bf0e97065c0bf` | 主管发布 2023-07-06，医保条件共用；本轮核原 HTML／官方正文。                                |
| `/private/tmp/cci-global/cms-lecanemab2024/fda-mri2025.html`；[FDA 安全](https://www.fda.gov/drugs/drug-safety-communications/fda-recommend-additional-earlier-mri-monitoring-patients-alzheimers-disease-taking-leqembi-lecanemab) |   48310 | `a51f461d934676b41a73288137b715d620449d8c37f7a6a0933b22512b71416d` | 主管发布 2025-08-28；报告病例非人口发生率，无当地全实施证明。                               |
| `/private/tmp/cci-global/cms-lecanemab2024/claims.json`；[CMS J0174](https://data.cms.gov/data-api/v1/dataset/335e5f35-eca6-482d-87b3-f99883e213e3/data?filter%5BHCPCS_Cd%5D=J0174&size=5000&offset=0)                              |  231085 | `166a75d0c50095dd972895c3f5758147a6247df6471a1bec6d1980d2a5df39db` | 有效 254 条；服务 2024，目录修改 2026-05-21；首次公开 NULL。                                |
| `/private/tmp/cci-global/cms-lecanemab2024/methodology.pdf`；[CMS 方法](https://data.cms.gov/sites/default/files/2025-04/MUP_PHY_RY25_202350312_Methodology_508.pdf)                                                                |  319334 | `daf2ddb6ab19a416ce9b0b5165750dca7e90380a03bc77350083b390e913e726` | 8 页，共用方法第 3—6 页；不把 2025 路径称 2026 方法版本；首次公开 NULL。                    |

读取还遇到 ILGA 页面缓存失败／下载超时，以及 Cook County 2025 performance 文件 URL 下载失败；没有取得有效原件，不给有效字节或 SHA，不用它们作为居民服务障碍。浏览器当前 NM FAQ 有旧引言与较新正文并存，已优先采用明确签名日期原 PDF；不因旧引言推断尚未采用获批药，也不把混合网页当完整现行监测协议。截止后或无有效日期的新信息不补为截止实际实施。
