# CCI 世界证据更新：GSS / ISR / LON / TEC / OPT

证据截止及检索日：**2026-10-09（Asia/Shanghai）**。只采用一手发布者、数据生产者和
监管者资料。下列全部为 `context_only`：没有完成都市圈边界匹配、逐指标转换和本地证据
包，不是新的城市评分输入。发布日期、观测期和预测期分开记录；网页未给出发布日期时
写明未知，不以搜索引擎抓取日期代替。

本更新遵守 [权重分析](./cci-weight-analysis.md) 和
[数据偏差治理](./cci-data-bias-governance.md)：GSS 不重复计入 ISR 的政治秩序，LON 只看
长寿专项临床转化，TEC 看非医疗创新扩散，电力交付约束归 RES，OPT 必须区分短期旅行与
可执行的长期迁移。世界新闻不能直接生成城市分数或百年战争概率。

## GSS：年度冲突数据已更新，月度候选与定稿须分开

**可核实事实。** 乌普萨拉大学 2026-06-09 发布的 UCDP 结果记录：2025 年有 65 起国家
参与的武装冲突，其中国家间冲突 8 起；13 起达到其年度战斗死亡至少 1,000 人的战争
门槛。这是 2025 年观测，并非截至今天仍在持续的战争数量。
[UCDP 原始新闻发布](https://www.uu.se/en/press/press-releases/2026/2026-06-09-ucdp-record-number-of-conflicts-between-states)

**版本。** 当前下载中心列出年度 GED、UCDP/PRIO Armed Conflict 等 **26.1**，年度序列
覆盖至 2025；检索当日最新可见全球月度候选为 **26.0.8（2026-08）**，另有
2026 年 1—6 月合并包。网页未显示每个下载包的精确发布日期，记为未知。
[下载与版本入口](https://ucdp.uu.se/downloads/)、[API 版本清单](https://ucdp.uu.se/apidocs/)

**边界。** `event_coding`，生产者为学术机构；年度、月度和新闻稿共享 UCDP 上游，属于
同一独立性组。候选数据会修订，公开报道覆盖不是随机样本，未记录事件不是无暴力。
本次没有下载全部事件或做都市圈空间连接。官方链接的论文 DOI
[10.1093/jopres/xjag046](https://doi.org/10.1093/jopres/xjag046) 在本次工具访问中失败，
因此这里的数量只引用已读的大学原始发布。

**CCI 分析判断。** 应将来源版本从旧年度更新到 26.1，并为 2026 月度候选独立标记。
区域战争及关键通道中断仍需独立压力情景；不能按全球冲突增幅给所有城市统一扣分。

## ISR：WGI 当前已到 2026 update，不能混接旧方法历史值

**可核实事实。** 世界银行当前 WGI 首页的推荐引用是 **2026 Update**，涵盖
1996—2025 年；35 个跨国感知来源覆盖超过 200 个经济体，并同时提供统计单位估计和
固定参考点锚定的绝对 0—100 分数。历史值已回算至 1996。网页本身未明示精确发布日；
页面提供的引用示例含 2026-09-25，但它是访问日期，不应当作发布日期。
[WGI 数据生产者主页](https://www.worldbank.org/en/publication/worldwide-governance-indicators)

**方法断点。** 2025 年 12 月方法修订说明调整了来源筛选、映射和聚合模型，使全球
治理平均水平可以随时间变化，并引入绝对分数；该文覆盖到 2024，不能与当前
2026 update 的覆盖期混为一谈。
[2025 年方法修订原文](https://www.worldbank.org/content/dam/sites/govindicators/doc/The%20Worldwide%20Governance%20Indicators%202025%20Methodology%20Revision.pdf)

**边界。** WGI 是居民/企业调查和专家判断的复合估计，不是城市治理直接测量。不同来源
组合、误差和观测滞后必须保留。V-Dem 已于 **2026 年 3 月**发布 **v16**；它可以作为
底层解释或替代证据，不能与已包含其信息的 WGI 再算独立一票。
[V-Dem 数据集](https://www.v-dem.net/data/the-v-dem-dataset/)、
[WGI 文档与上游来源](https://www.worldbank.org/en/publication/worldwide-governance-indicators/documentation)

**CCI 分析判断。** ISR 更新必须锁定整个方法版本与年份，并保留国家先验身份。
国家感知指标不能证明某一都市圈的公共服务连续性，也不能满足城市观测 coverage。

## LON：人体转化出现新信号，但仍不是获批长寿疗法

**可核实事实。** Life Biosciences 在 **2026-01-28** 宣布 ER-100 的 IND 获准推进，
用于视神经疾病的一期试验，注册号 **NCT07290244**。这是申办方关于监管状态的披露。
[申办方 IND 公告](https://www.lifebiosciences.com/life-biosciences-announces-fda-clearance-of-ind-application-for-er-100-in-optic-neuropathies/)

**最新观察。** 申办方 **2026-10-08** 公告提供 3 名开角型青光眼参与者的 56 天中期
观察：报告耐受性良好，其中 2 人出现初步视野改善信号。公告明确称试验为开放标签一期
研究，首要目的为安全性与耐受性；观察窗口为给药后 56 天，没有给出独立数据截止日期。
[原始一期中期数据公告](https://www.lifebiosciences.com/life-biosciences-announces-first-in-human-data-from-ongoing-phase-1-trial-evaluating-er-100-in-optic-neuropathies/)

**边界。** 这是商业申办方自报、极小样本、短期、无盲法的探索结果。注册页
[NCT07290244](https://clinicaltrials.gov/study/NCT07290244) 本次只返回页面壳，API 请求
未获取正文；没有独立复核完整注册字段、站点或结果表。未查得本次公告所对应的同行评审
完整结果，不可把“未查得”写成“不存在”。FDA 说明 IND 是开展人体研究所需的路径，
与产品上市批准不同。
[FDA IND 定义](https://www.fda.gov/drugs/investigational-new-drug-application-ind/ind-applications-clinical-investigations-overview)

**CCI 分析判断。** 可将其列为长寿技术从动物走向人体研究的进展；不能声称已经证明
人体寿命延长、长期安全或居民普遍可及，更不能因总部位于波士顿就给波士顿 LON 加分。
临床试验、上市批准、支付覆盖、居民实际准入必须逐层证明。

## TEC / RES：AI 扩散加快，但收益与电力负荷并不等价

**扩散事实。** OECD **2026-01-28** 发布的 2025 年统计显示：在有数据的 OECD
国家中，20.2% 企业报告使用 AI，2024 年为 14.2%；大型企业为 52.0%，小型企业为
17.4%。这是有覆盖国家和调查企业的采用率，不是全球所有企业比例，也不是生产率增幅。
[OECD 统计发布](https://www.oecd.org/en/about/news/announcements/2026/01/ai-use-by-individuals-surges-across-the-oecd-as-adoption-by-firms-continues-to-expand.html)

**能源事实与预测。** IEA **2026-04-16** 发布的报告估计 2025 年全球数据中心电耗为
485 TWh、较上年增加 17%；其中心预测为 2030 年约 950 TWh。2030 是模型预测，
2025 也是汇总估计而非逐站完整公开计量。IEA 强调电网接入、供应链和未来使用方式的不确定性。
[报告日期](https://www.iea.org/reports/key-questions-on-energy-and-ai)、
[数据与情景原文](https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary)

**边界。** OECD 企业调查和 IEA 能源模型测量不同概念，不能当作两个独立 AI 红利分数。
两者均不提供这里所需的 16 城市边界匹配；数据中心数量或总部投资不能代表居民获得收益。

**CCI 分析判断。** TEC 应优先补实际采用、技能和扩散的本地证据；电力可靠性、峰值余量
和可负担性归 RES。不能把算力投资同时作为 TEC 加分和 RES 无证据扣分，更不能把
AI 技能/基准模型能力外推成 2100 年稳定增长率。

## OPT：数字边检已变化，旅行授权不等于退出能力

**可核实事实。** 欧盟委员会 **2026-04-28** 的说明确认 EES 自 **2026-04-10**
全面运行，针对非欧盟国民短期入境的登记流程；该说明当时仍预计 ETIAS 于 2026 年
第四季度启动，具体日期待公布。
[欧委会 EES 与 ETIAS 说明](https://home-affairs.ec.europa.eu/news/main-differences-between-ees-and-etias-what-travellers-need-know-2026-04-28_en)

**当前核验限制。** [ETIAS 当前官方入口](https://travel-europe.europa.eu/etias) 本次
打开只返回 JavaScript 页面壳；搜索缓存仍出现旧时间表。不能把 4 月计划或缓存当作
10 月已经启动的证据，因此本更新不确认 ETIAS 的当前启动日期，也不采用商业代办网站
作为替代权威。

**CCI 分析判断。** EES 的边检程序变化只可作为 OPT 的规则背景。免签、电子授权和航线
存在均不能证明长期居留、工作、医疗准入或资金转移能力。城市 OPT 的正式输入应按
国籍/居留身份、目的地和生效日核查可执行权利；本次不据此调整城市分数。

## 发布含义

这轮资料足以发布有日期、来源和证据层级的世界观察更新，但不能替代正式城市排名的
85% observed coverage、八维本地证据包、来源替代检查及版本化未来情景。未满足门槛
应明确保留未排名状态；不能把新闻刷新或正式发布标签等同于模型已经通过资格审查。

未完成：全球试验注册表去重、16 城本地证据包、事件空间聚合、治理误差重算及移民身份
逐项验证。主要风险是网页后续修订、月度数据回填，以及将国家/全球资料误用为城市实测。
