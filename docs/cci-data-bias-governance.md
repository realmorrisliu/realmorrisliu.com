# CCI 数据全面性与偏差治理 v1

> 结论：CCI 不把任何国际组织、国家机构、媒体、NGO、商业数据库或遥感产品预设为中立，
> 也不按“西方/非西方”“左/右”给来源配额或取平均。v1 用同一套指标定义审查所有来源，
> 记录完整上游链和已知覆盖缺口；对可能改变结论的来源运行替代重算。最终同时发布
> `score`、`confidence`、`coverage` 和 `source_sensitivity`，数据不足不等于城市表现差。

## 1. 要防的不是一种偏差

CCI 至少要区分下面五种机制；“来源机构位于哪里”不能替代这些判断。

1. **定义偏差**：指标选择本身体现价值判断，或同一词在不同制度中含义不同。
2. **覆盖偏差**：贫困、冲突、非英语或数据能力较弱地区更容易缺失；全球平均可能掩盖城市内部群体。
3. **报告激励**：政府、企业、冲突方、试验申办方、受访者和倡议组织都有选择报告的动机。
4. **发现/话语权偏差**：国际媒体、DOI、英语元数据和主流期刊更容易被全球数据库发现。
5. **模型偏差**：标准化、缺失值、边界、遥感分类和专家聚合会把技术选择转化为排名差异。

[UN 官方统计基本原则](https://unstats.un.org/fpos/)要求专业独立、透明方法和公开元数据；
[UN 国际统计活动原则](https://unstats.un.org/unsd/methods/statorg/principles_stat_activities/principles_stat_activities.asp)
还要求公开原始来源、国家统计机构参与、展示缺口/重复并纠正误用。这些是治理要求，不是“UN
数据天然正确”的证明。

## 2. 一手方法文档给出的边界

| 数据家族       | 提供方自己承认或处理的问题                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 对 CCI 的直接规则                                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 人权与社会事件 | OHCHR 指出，投诉或事件数会受认知、申诉渠道可信度和获得补偿的可能性影响；上升不必然表示侵害增加，非代表性事件数据也不能直接推广到全体。其框架同时要求上下文适配、互补数据机制和必要的群体/地域拆分。[OHCHR 指标指南](https://www.ohchr.org/sites/default/files/documents/issues/HRIndicators/AGuideMeasurementImplementationCompleteGuide_en.pdf.pdf)                                                                                                                                                                     | “零报告”不等于“零事件”；报告渠道改善不能自动扣分。事件、调查、行政记录和本地定性证据分开保存，不先混成一个数。                           |
| 治理感知       | WGI 是调查与专家感知的复合结果；其官方说明明确说感知会受期望、意识形态和近期事件影响，不同国家还可能依赖不同来源组合，点估计应结合误差范围和底层变量使用。其当前来源清单本身包含 V-Dem 和 WJP。[WGI 方法与来源](https://www.worldbank.org/en/publication/worldwide-governance-indicators/documentation)、[FAQ](https://www.worldbank.org/en/publication/worldwide-governance-indicators/frequently-asked-questions)、[使用提示](https://www.worldbank.org/en/publication/worldwide-governance-indicators/usage-advisory) | 不把 WGI 总分当 ISR 的唯一输入；保存底层来源组合、误差和年份。若使用 WGI，V-Dem/WJP 不是额外两票，只能作底层解释或来源替代。             |
| 冲突事件       | UCDP 只收录公开可报告、满足其定义的事件；它明确说报道不是随机的、冲突区可能漏报，且会追溯最初消息源并评估其误报利益。[UCDP 方法](https://www.uu.se/en/department/peace-and-conflict-research/research/ucdp/ucdp-methodology)                                                                                                                                                                                                                                                                                             | `0 events` 只能表示“未收录”，不能证明安全；保留 low/best/high、公开性限制、消息源利益和本地来源检查。                                    |
| 专家编码       | V-Dem 说明专家对量表的理解和判断可能系统性不同，因此用重叠编码、锚定情景和测量模型校正，并发布 credible regions。[V-Dem 方法](https://v-dem.net/about/v-dem-project/methodology/)                                                                                                                                                                                                                                                                                                                                        | 专家指标必须携带区间、编码人数/年份和方法版本；不能把点估计当客观观测，也不能以“专家数量多”代替上游独立性。                              |
| 法治调查       | WJP 同时使用居民与本地专业人士，公开各国调查年份、样本和方法；它也承认部分国家样本并非全国代表、专家数量有限、调查并非每年进行，并发布置信区间。[WJP 2025 方法](https://worldjusticeproject.org/rule-of-law-index/downloads/Index-Methodology-2025.pdf)                                                                                                                                                                                                                                                                  | 不把旧调查值伪装成当年观测；记录样本地域、方式、语言、年份和代表性，居民经验与专家意见分别保留。                                         |
| 健康统计       | WHO 要求从人口调查、出生死亡登记、机构数据等多机制监测健康，并为医疗机构数据提供独立质量评估；其 GHO 为指标提供逐项元数据。[WHO 数据来源工具](https://www.who.int/data/data-collection-tools)、[WHO 数据质量保障](https://www.who.int/data/data-collection-tools/health-service-data/data-quality-assurance-dqa)、[GHO 元数据注册表](https://www.who.int/data/gho/indicator-metadata-registry/)                                                                                                                          | MED 不能只看卫生部门自报床位/医生数；每项数据保存定义、分母、设施覆盖、质量审查和是否为模型估计。                                        |
| 跨国医疗可比性 | OECD 会为每项健康指标公开定义、来源和方法，并在图表中标注不可比性；官方指南明确说国家问题措辞、测量方式和年份会不同。[OECD Health Statistics 元数据](https://www.oecd.org/content/dam/oecd/en/data/datasets/oecd-health-statistics/Table-of-Content-Metadata-OECD-Health-Statistics-2025.pdf)、[Health at a Glance 阅读指南](https://www.oecd.org/en/publications/health-at-a-glance-2023_7a7afb35-en/full-report/reader-s-guide_2b1bc7cc.html)                                                                          | 相同字段名不代表可比；不满足统一定义的值只能作背景或替代敏感性，不可直接并表排名。                                                       |
| 遥感与人口网格 | GHSL 曾公开警告 R2022A 多时点产品存在变化率正偏差、农村地区尤甚，并不建议用于相应时间序列；新版本也用独立样本和人工判读报告误差。[GHSL R2022A 警告](https://human-settlement.emergency.copernicus.eu/ghs_buS2022.php)、[GHSL 2023 数据包](https://human-settlement.emergency.copernicus.eu/documents/GHSL_Data_Package_2023.pdf)                                                                                                                                                                                         | 遥感不是无偏“真值”；固定产品版本和分辨率，保存区域/城乡验证误差，版本撤回后停止新发布但不静默改写旧版。                                  |
| 临床试验注册   | ClinicalTrials.gov 只对特定法律/政策范围强制注册，其他研究可自愿提交；记录由责任方保证准确，NLM 质检不评价科学设计，也不保证内容真实无误。[覆盖说明](https://clinicaltrials.gov/about)、[报告要求](https://clinicaltrials.gov/policy/reporting-requirements)、[质检边界](https://clinicaltrials.gov/submit-studies/prs-help/protocol-registration-quality-control-review-criteria)                                                                                                                                       | LON 不用 ClinicalTrials.gov 数量代表全球研发。使用 WHO ICTRP 去重后的多注册表数据，并检查国家/本地注册表、试验阶段、状态、结果和申办方。 |
| 全球试验聚合   | WHO ICTRP 接收多个国家/地区注册表的数据，并保留注册表标识；门户聚合数据为英语，但部分原注册表可用中文、日语、韩语、波斯语等检索。[ICTRP 数据提供方](https://www.who.int/tools/clinical-trials-registry-platform/network/data-providers)、[搜索门户](https://www.who.int/tools/clinical-trials-registry-platform/the-ictrp-search-portal)、[注册表标准](https://www.who.int/tools/clinical-trials-registry-platform/network/registry-criteria)                                                                            | 查询全球聚合页后仍须回到原注册表；通过注册号桥接重复记录，保存原语言字段，不能把一项多重注册算成多个试验。                               |
| 学术与创新索引 | OpenAlex 由 Crossref、DataCite、PubMed、MAG 和仓储等上游合并；默认 core 会排除未匹配的仓储记录，匹配又依赖 DOI、标题和作者元数据，citation 也只能链接已识别作品。[构建方法](https://help.openalex.org/data/how-its-built/)、[仓储覆盖说明](https://help.openalex.org/data/sources/repositories/)、[core/expansion 区别](https://help.openalex.org/data/works/corpus/)                                                                                                                                                    | TEC/LON 不以 core 论文数或引用数直接代表创新；记录语料范围，运行 core/all 与本地仓储替代检查，并将论文、临床转化和居民可及性分开。       |

## 3. 来源分类：按生产机制，不按阵营

`source_class` 与 `producer_type` 必须分开。前者描述数字怎样产生，后者描述谁发布；任何一类
都不自动获得加分或否决权。

| `source_class`          | 定义                                       | 典型偏差                                          |
| ----------------------- | ------------------------------------------ | ------------------------------------------------- |
| `official_statistic`    | 普查或统计机构按公开统计程序生产           | 统计能力、口径变化、政治干预、发布滞后            |
| `administrative_record` | 部门、监管者、医院、公共事业或运营系统记录 | 只覆盖进入系统的人/机构，绩效与资金激励，自报质量 |
| `population_survey`     | 概率或配额抽样的居民/企业调查              | 抽样框、无回应、恐惧/期望、问题翻译和访问方式     |
| `expert_assessment`     | 专家按量表判断不可直接观测的概念           | 专家选择、共同叙事、尺度理解和近期事件            |
| `event_coding`          | 从媒体、证词、机构报告编码事件             | 未报道事件、媒体可达性、重复、冲突方宣传          |
| `direct_measurement`    | 传感器、遥感或现场测量                     | 分辨率、分类误差、云层/地形、城乡性能差异         |
| `self_report_registry`  | 申办方/机构向法定或自愿注册表提交          | 法律覆盖、漏登/迟报、重复注册、利益冲突           |
| `scholarly_index`       | 聚合论文、专利、仓储、引用或机构元数据     | 语言、DOI/期刊/仓储覆盖、消歧和引用网络优势       |
| `modelled_estimate`     | 由其他观测与假设估算、插值或预测           | 上游误差、结构假设、平滑和版本回填                |

`producer_type` 最少记录：`local_authority`、`national_statistics`、`national_agency`、
`international_organization`、`academic_or_civil_society`、`commercial`、`community`。这只是
披露字段，不进入权重。

## 4. 最小 provenance 与 bias schema

每一个进入算法的数值都必须能回到一个原字段；只给报告首页链接不算 provenance。

```yaml
indicator_id: med.healthcare_access
evidence_role: canonical # canonical | alternative | context_only
evidence_level: city_observation # city_observation | national_prior | scenario_assumption

source_id: string
source_class: administrative_record
producer: string
producer_type: national_agency
title: string
url: https://...
source_version: string
retrieved_at: 2026-08-23
license_or_access: string
original_field: string
upstream_source_ids: []
independence_group: string

value: 0
unit: string
observation_period: { start: YYYY-MM-DD, end: YYYY-MM-DD }
geography_id: string
boundary_version: string
universe_and_inclusion_rule: string
collection_method: string
uncertainty: { low: null, high: null, method: null }
transformation: { formula: string, code_version: string }

bias:
  selection_mechanism: mandatory # mandatory | voluntary | probability_sample | expert_recruitment | media_discovery | algorithmic
  reporting_control: string
  reporting_incentives: []
  known_coverage_gaps: []
  missingness_risk: unknown # low | medium | high | unknown
  verification: string
  source_language: string
  translation_status: original # original | machine | human_checked
```

必填校验：缺少 `source_version`、观测期、边界、原字段、上游来源、覆盖缺口或转换公式之一，
该值只能是 `context_only`。未知要写 `unknown`，不能留空制造“没有偏差”的假象。

## 5. 选源、地方证据与独立性

### 5.1 规范先于来源

每个指标先锁定 construct、单位、目标人群、地理分辨率、观测窗口和允许的估算方法，再找
数据。候选来源按以下顺序选择 canonical：

1. 与指标定义及人群是否一致；
2. 与 GHSL–OECD FUA 边界、观测期是否一致；
3. 原始数据、方法、修订和不确定性是否可审计；
4. 覆盖与独立验证是否充分；
5. 更新时间与连续性；
6. 在前五项相当时，选开放且可长期复现者。

发布机构的国家、意识形态标签或声望不在排序条件内。同一规则既适用于国家官方统计，也适用
于国际组织、NGO、商业数据和遥感产品。

### 5.2 每座城市必须完成本地证据包

正式排名前，八个维度都要留下本地检索记录，即使结果为“未找到”：

- 当地语言的都市圈/市政府统计、开放数据、规划和法规；
- 国家统计局、部门、监管机构及法定公告；
- 水电、交通、医院网络、应急机构等实际运营者；
- 国家/地区临床试验注册表、科研仓储和监管批准；
- 对 GSS/ISR 等易漏报领域，再查当地研究机构、全国性民调和可追溯的民间事件记录。

保存查询语言、关键词、日期、原文标题、URL 和未采用理由。机器翻译可用于发现来源；进入
评分的关键字段必须保留原文，并标明是否人工复核。本地官方数据仍需记录报告激励；本地来源
缺失只降低 coverage/confidence，不扣城市分。若本地口径不符合统一指标定义，它只作
`alternative` 或 `context_only`，不能为了“代表性”破坏可比性。

两个品牌不等于两个独立来源。共享同一普查、媒体报道、专家或注册表的产品使用同一个
`independence_group`；复合指数及其底层来源不能被当作两票。例如 WGI 当前直接使用 V-Dem
和 WJP，三者不能作为三份独立的 ISR 证据。

## 6. 交叉验证、分歧与来源替代敏感性

### 6.1 最小交叉验证

- `bias.missingness_risk = medium | high` 或足以改变一个维度 10 分的输入，必须有一个不同
  `independence_group` 的 alternative；找不到时降为 low confidence。
- alternative 只有在 construct、人群、地理和时间足够一致时才可替代重算；不同概念只能
  作为上下文，不能平均。
- 优先让不同生产机制互证，例如事件编码 + 居民调查、行政记录 + 设施抽查、遥感 + 地方
  地籍；不要求机械地“一份西方、一份非西方”。

### 6.2 分歧处理顺序

1. 先检查定义、分母、边界、时点、修订版和重复上游；能解释的差异不叫冲突。
2. 无法解释时仍按 5.1 的预注册规则选 canonical，不按结果好坏挑来源。
3. alternative 原值和理由一起发布；不做阵营平均，也不以发布者声望裁决。
4. 分歧进入 uncertainty/confidence；若会改变尾部门槛或排名资格，则暂不发布精确名次。

### 6.3 一次替代重算即可

对每个合格 alternative 做 one-at-a-time substitution，重跑固定模型：

```text
source_delta_score = max(abs(CCI_alternative - CCI_canonical))
source_delta_rank  = max(abs(rank_alternative - rank_canonical))
```

v1 标记 `source-sensitive` 的门槛：`source_delta_score >= 2.0`、16 城原型中
`source_delta_rank >= 3`，或 Median/Robust 分档、`tail_status`、正式排名资格发生变化。门槛是
公开的产品政策，不是假装来自统计定律；有真实分布后只能通过模型大版本调整。页面显示最不利
和最有利替代结果，不把它们压成一个伪精确平均值。

## 7. coverage 与正式排名门槛

`coverage` 与分数完全分开。缺失不填 0，也不把剩余指标重新归一化来隐藏缺口。确需先验或
估算时仍保留原权重，并标记 `national_prior` 或 `scenario_assumption`。

```text
observed_coverage = Σ(满足规范且 provenance 完整的子支柱权重) / Σ(全部子支柱权重)
```

`model_version = 1.x` 的正式排名必须同时满足：

1. 八个维度及注册表中的每个子支柱均可计算，且每个评分输入 provenance 完整；缺失不得通过
   剩余指标重归一化而被隐藏。
2. 全指数 `observed_coverage >= 85%`；低于要求的国家先验、插值和过期数据不计入分子。
3. 八维本地证据包均完成；“检索后无结果”可以通过，但必须公开。
4. 所有 medium/high missingness 输入完成替代检查，且没有会翻转 `tail_status` 或排名资格的
   未解决冲突。
5. 未来年份继承合格基线；每个未来转换均有版本化情景假设，禁止静默沿用当前值。

85%、2 分和 3 名都是 v1 的治理阈值，不声称具有普适科学性。未过门槛的城市仍显示
原始证据、范围和 `not_ranked_reason`；不从页面删除，避免只展示数据富裕地区形成幸存者偏差。

对人群结果还要发布可得的地区、收入、年龄、性别等拆分覆盖。没有拆分时标记
`distribution-blind` 并降低 confidence，不能用都市圈平均值声称所有居民获得同等安全或医疗。
OHCHR 的方法明确要求在可行时超越全国平均并披露被边缘化群体，且提醒拆分同时要保护隐私。

## 8. 纠错、申诉与不可变版本

每个城市、维度和原始指标旁提供“提交纠错/异议”，接受任何语言，最少要求：城市与边界、
指标、受影响的 `as_of`/数据版本、具体主张、直接来源和建议处理。处理结果公开为
`accepted | rejected | needs_more_evidence`，附理由；来源地或政治立场不能成为驳回理由。

版本分别记录：

- `model_version`：指标定义、权重、标准化、聚合或门槛；改变语义才升大版本。
- `data_version`：数据添加、纠错或上游修订。
- `boundary_version`：FUA 边界。
- `as_of`：当时可获得证据的不可变预测快照。

上游常规修订进入新的 `as_of`，不回写旧预测。纯录入/解析错误可发 `data_version` patch，
但旧文件仍可下载，并公布变更字段、原因、来源、前后值及分数/名次影响。GHSL 产品撤回、
ClinicalTrials.gov 记录更新等都按此规则处理；页面默认最新，历史链接永久指向原快照。

## 9. v1 实施闭环

首版不需要“意识形态校正模型”。最小闭环只有六步：

1. 锁定 indicator specification 和 `indicator_owner`；
2. 为 16 城建立来源清单、本地证据包及完整 provenance/bias metadata；
3. 按预注册规则确定 canonical 与 alternative；
4. 运行 coverage gate 和一次来源替代重算；
5. 同时发布分数、区间、coverage、source sensitivity 和未采用来源；
6. 冻结 `as_of` 快照，开放纠错并在下一数据版本处理。

这套治理不保证消除意识形态或话语权偏差；它保证任何单一来源的覆盖、利益、口径或版本选择
都不能在不留痕、无替代检验的情况下决定 CCI 排名。
