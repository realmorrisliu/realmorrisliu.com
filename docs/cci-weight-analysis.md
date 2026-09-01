# CCI-100 八维权重分析与 v1 建议

> 结论：将官方固定权重改为 **15 / 15 / 15 / 10 / 15 / 10 / 10 / 10**。采用 5% 粒度是
> 为了避免伪精度；权重只表达 CCI 的长期价值取舍，情景概率、尾部厌恶和个人生命阶段
> 分别由 P20、压力测试/生存门槛、Lifetime 和 My CCI 表达。

## 1. 先锁定目标函数

CCI-100 不是一般的“当下宜居度”，而是：对一个标准化都市圈，评价一个人在未来约
100 年内获得基本生存安全、制度和关键服务连续性、医疗与技术红利，以及在失败时保留
退出选择的能力。

因此官方分数应满足四个约束：

1. **保持 CCI 的双重目标。** 生存与系统连续性是底座，医疗和技术红利也是原始目标；高创新
   不能抵消不可居住热暴露、战争或关键服务崩溃，这种不可补偿性由独立生存门槛表达。
2. **区分 hazard、exposure、vulnerability/response。** IPCC 将风险定义为危害、暴露、
   脆弱性以及响应之间的动态交互，并提醒复合、级联和非线性风险不能靠独立效果简单相加。
   [IPCC AR6 WGII Chapter 1](https://www.ipcc.ch/report/ar6/wg2/chapter/chapter-1/)
3. **权重是规范性取舍，不是假装由数据“发现”的客观真理。** 没有文献能证明 15% 比 10%
   或 20%“正确”；文献能支持的是概念边界和验证方法。OECD/JRC 指出，高相关变量会把同一
   潜在维度重复计权；是否重复既要做统计检查，也要回到指标定义判断。
   [OECD/JRC composite-indicator handbook](https://knowledge4policy.ec.europa.eu/sites/default/files/jrc47008_handbook_final.pdf)
4. **百年预测是情景压力测试，不是单一路径外推。** IPCC 对深度不确定性的建议是同时检验
   最可能路径和多种压力情景，并保留未来选择。
   [IPCC AR6 WGII Chapter 17](https://www.ipcc.ch/report/ar6/wg2/chapter/chapter-17/)

## 2. 建议权重

| 维度                     |  v1 权重 | 相对原方案 | 该维度唯一拥有的概念                                   |
| ------------------------ | -------: | ---------: | ------------------------------------------------------ |
| 自然与气候安全 `PCS`     |  **15%** |         -3 | 物理危害强度、频率和空间暴露                           |
| 战争与地缘安全 `GSS`     |  **15%** |         -3 | 战争、跨境冲突、军事升级和邻国冲突外溢                 |
| 制度与社会韧性 `ISR`     |  **15%** |         +3 | 治理、法治、社会信任、公共秩序和通用适应能力           |
| 水、食物与能源安全 `RES` |  **10%** |          0 | 三类关键服务的余量、冗余、可负担性和恢复能力           |
| 医疗体系能力 `MED`       |  **15%** |         +3 | 可及、可负担、优质且有韧性的实际医疗服务               |
| 长寿技术红利 `LON`       |  **10%** |         -2 | 长寿医学的临床转化、监管准入和居民可获得性             |
| 前沿科技红利 `TEC`       |  **10%** |         -2 | 长寿医学以外的创新产出、扩散和生产率红利               |
| 全球连接与退出能力 `OPT` |  **10%** |         +4 | 在其他系统失效时迁移、转移资产和接入外部网络的现实选择 |
| **合计**                 | **100%** |            |                                                        |

基础分保持透明：

```text
CCI_base(city, as_of, target_year, scenario) = Σ weight[d] × score[d] / 100
```

这组权重把 55% 放在四项生存与系统连续性维度，35% 放在医疗和技术红利，10% 放在退出
选择。它保持 CCI 的双重目标，也避免把未来事件发生频率或尾部厌恶暗藏进基准权重。

所有数值采用 5% 粒度。权威方法论支持风险拆分、避免重复计权和开展敏感性分析，但不能
“证明”这组精确权重；它是一个公开、可审计、可通过大版本修订的规范性基准。

曾考虑的 survival-heavy 候选 **20 / 12 / 18 / 12 / 10 / 8 / 10 / 10** 将 62% 放在生存与
韧性、仅 28% 放在医疗与技术。由于官方结果已经用 P20、独立 stress gate 和 Lifetime 表达
下行与累计风险，再用该候选加重韧性会重复表达风险厌恶，并把直接医疗压得过低，因此否决。

### 逐项理由

- **PCS 15%**：百年尺度下，海平面、极热和慢发性土地损失具有路径依赖或不可逆性，且
  2100 风险必须按不同气候路径更新；但不同路径和极端尾部已由 P20 与 stress gate 表达，
  不再通过 20% 的高基准权重重复加码。PCS 只接收物理危害与暴露，不接收治理、供水或能源
  可靠性。ThinkHazard 明确说明其 hazard level 是基于强度、频率阈值的筛查，不能代替详细
  risk analysis；因此不能把 hazard 分数直接当成城市总风险。
  [ThinkHazard FAQ](https://thinkhazard.org/en/faq)、
  [ThinkHazard methodology](https://thinkhazard.org/static/documents/thinkhazard-methodology-report_v2_0.pdf)
- **GSS 15%**：原 18% 容易把同一次政治/暴力信号同时计入 GSS 与 ISR。GPI 的“社会安全”
  域本身包括政治稳定、暴力示威、犯罪和国内流离失所；CCI 不应整包复用 GPI。GSS 只取持续
  国内/国际冲突、军事化和跨境外溢；政治稳定与社会秩序归 ISR。战争尾部情景另行处理，故
  不再用 18% 常规权重代替压力测试；同时战争与地缘安全仍是直接生存条件，保留与 PCS、
  ISR、MED 相同的 15% 基准，而不是降到 survival-heavy 候选的 12%。
  [Global Peace Index methodology](https://www.visionofhumanity.org/understanding-the-global-peace-index-methodology/)、
  [GPI 2026 report](https://www.visionofhumanity.org/wp-content/uploads/2026/06/Global-Peace-Index-2026-Report.pdf)
- **ISR 15%**：制度不是一个短期舒适度指标，而是几十年内把投资、预警和资源转化为适应
  行动的通用能力。ND-GAIN 将 readiness 单独拆为经济、治理和社会准备度；IPCC 也将响应和
  随时间变化的脆弱性纳入风险。因此 ISR 从 12% 上调，但不升至 18%；通用适应能力不得既在
  ISR 计分，又暗中乘入 GSS、RES、MED 的结果指标。
  [ND-GAIN methodology](https://gain.nd.edu/our-work/country-index/methodology/)、
  [ND-GAIN technical report](https://gain.nd.edu/assets/581554/nd_gain_countryindex_technicalreport_2024.pdf)
- **RES 10%**：水、食物和能源不是 PCS 的同义词。PCS 记录“发生什么物理冲击”，RES 记录
  关键服务在冲击下是否有供应余量、网络冗余、替代来源和恢复能力。ND-GAIN 将水、食物、
  基础设施等作为分开的生命支持部门，支持保留这一独立系统维度；清晰分界后无需再为与
  PCS 的潜在重叠增加权重。
  [ND-GAIN technical report](https://gain.nd.edu/assets/581554/nd_gain_countryindex_technicalreport_2024.pdf)
- **MED 15%**：原“当前医疗能力”应改名为“医疗体系能力”，并对每个 target year 预测其
  状态。医疗直接影响当下生存、Lifetime 累计结果和新疗法能否实际交付，不应在一个同时追求
  生存与健康红利的指数中低于通用韧性。WHO 的框架同时考察治理、融资、资源生成和服务
  交付；OECD 也区分资源、可及性、质量、结果与系统韧性。因此 MED 不能只用医生数、医院数
  或寿命结果，也不能把一般政府治理再次计分。
  [WHO Health System Performance Assessment](https://www.who.int/publications/i/item/9789240042476/)、
  [OECD Health at a Glance framework](https://www.oecd.org/en/publications/health-at-a-glance-2023_7a7afb35-en/full-report/reader-s-guide_2b1bc7cc.html)
- **LON 10%**：长寿红利依赖一般创新、医疗交付和制度准入，原 12% 会与 MED、TEC 三次奖励
  同一组富裕度、科研和治理信号。LON 只保留 geroscience/再生医学的本地临床试验、监管
  采用速度、支付覆盖和居民实际准入；基础医疗归 MED，通用研发归 TEC。10% 保留其作为
  CCI 原始目标的独立地位，又不三次奖励相同创新生态。
  [WHO Health System Performance Assessment](https://www.who.int/publications/i/item/9789240042476/)、
  [WIPO GII 2025 conceptual framework](https://www.wipo.int/web-publications/global-innovation-index-2025/en/appendix-i-conceptual-and-measurement-framework-of-the-global-innovation-index.html)
- **TEC 10%**：WIPO GII 将创新投入与产出各占一半，并明确检查共线性；CCI 若在 TEC 使用
  整体 GII，又在 ISR、MED、LON 使用其制度、人力资本或研究数据，会重复计权。TEC 只保留
  非医疗前沿技术的产出、扩散和吸收能力，输入型制度指标留在 ISR。
  [WIPO GII 2025 conceptual framework](https://www.wipo.int/web-publications/global-innovation-index-2025/en/appendix-i-conceptual-and-measurement-framework-of-the-global-innovation-index.html)、
  [JRC audit of GII 2024](https://www.wipo.int/web-publications/global-innovation-index-2024/en/appendix-ii-joint-research-centre-jrc-statistical-audit-of-the-2024-global-innovation-index.html)
- **OPT 10%**：在无法为 2050/2100/2125 分配可信联合概率时，保留选择本身有独立价值。
  IPCC 对深度不确定性的处理包括 keeping options open 和按触发阈值调整路径。因此退出能力
  从 6% 上调；它只计算现实可执行的国际交通、跨境权利/通道、资本与数字网络可携带性，
  不重复计算一般开放度或机场客流。
  [IPCC AR6 WGII Chapter 17](https://www.ipcc.ch/report/ar6/wg2/chapter/chapter-17/)

## 3. 原权重的主要结构问题

1. **GSS 过重且边界过宽**：若直接使用完整 GPI，政治稳定、犯罪、示威和流离失所会与 ISR
   重合；同时把低概率战争升级混入 18% 常规权重，会把“偏好”误装成“概率”。
2. **ISR 过轻**：百年尺度的核心不是今天制度分数高，而是制度能否持续学习、融资、适应和
   纠错。它影响多类风险，但应作为独立能力计一次，而不是暗中乘进所有维度后又单独加分。
3. **PCS 与 RES 的输入边界不清**：干旱是 hazard，供水网络余量是 system resilience；同一
   缺水指标不能两边都出现。UNDRR 同样要求将 exposure 与具体 vulnerability/capacity 结合
   才能估计风险。
   [UNDRR exposure terminology](https://www.undrr.org/terminology/exposure)
4. **MED、LON、TEC 对富裕度/科研能力三重计权**：医院资源、生命科学论文、GII、监管质量
   和 GDP 高度共变。必须按“医疗交付 / 长寿专项转化 / 非医疗创新”重新分配指标所有权。
5. **OPT 过轻**：退出能力不是舒适度，而是其他模型判断失败时的保险；在深度不确定性下，
   它比继续提高某一预测维度的伪精度更有用。

执行时维护一张 `indicator_owner` 表：每个原始指标只能进入一个维度。完整的 ND-GAIN、GPI、
GII 等复合总分不得作为另一个复合分数的多维公共输入；只能选取互斥的底层指标或子域。

## 4. 尾部风险：不用权重吞掉

低概率高影响风险应作为 **独立压力测试与生存门槛**，而不是提高 PCS/GSS 权重。IPCC 明确
要求即使概率低或未知，也要在后果巨大时纳入决策，并建议用 storylines 和多情景压力测试
处理深度不确定性。
[IPCC low-likelihood, high-impact definition](https://www.ipcc.ch/report/ar6/wg2/chapter/annex-i/)、
[IPCC AR6 WGI Summary for Policymakers](https://www.ipcc.ch/report/ar6/wg1/chapter/summary-for-policymakers/)

v1 的最小表达：

- `CCI_base` 仍按上表计算，并在 27 个核心情景内发布 P20 / Median / P80。
- 对极端海平面、湿球热、重大区域战争、长期关键服务中断等另跑 stress test；不伪造发生概率。
- 每个城市另发 `tail_status = pass | watch | fail` 和触发证据。`fail` 城市不进入“长期生存
  推荐集”，但保留原始分数供审计；高 TEC/LON 不得补偿该门槛。
- 只有在获得可审计的事件概率、暴露和损失函数后，才考虑数值化 `tail_penalty`；在此之前
  不用任意扣 5 分或 20 分制造精确感。

## 5. 固定权重、时间与生命阶段

- **官方 v1 权重在所有 `as_of`、target year 和 27 个核心情景中固定。** 变化的是维度输入、
  情景转换和置信区间。否则 2035 的 80 分与 2100 的 80 分不是同一目标函数。
- **Point 与 Lifetime 共用同一组价值权重。** Lifetime 沿年度路径累计分数和风险，不另造一套
  隐形权重；近期/远期重要性的时间处理属于累计公式，而非八维权重。
- **生命阶段只进入 `My CCI`。** 年龄、健康状况、家庭结构、国籍和资产流动性可以生成个人
  权重，但不得改写官方历史版本或官方排名。
- 权重只在 `model_version` 大版本调整；旧版结果永久保留，不回填新权重。

## 6. 最小敏感性验证

在锁定 v1 前只做下面三项，计算量对 16 城 × 目标年份 × 27 情景很低。

### A. 重复计权审计

1. 检查 `indicator_owner`，禁止同一原始序列进入两个维度。
2. 在全部 city × year × scenario 样本上计算八维两两 Spearman 相关；`|ρ| >= 0.85` 标红，
   回看概念和数据来源，不自动删项。WIPO 的正式方法同样检查高共线指标，并在 `|r| > 0.95`
   时降权；CCI 维度更少，先用更保守的 0.85 作为人工复核线。
   [WIPO GII 2025 weights](https://www.wipo.int/web-publications/global-innovation-index-2025/en/appendix-i-conceptual-and-measurement-framework-of-the-global-innovation-index.html#weights)

### B. 5,000 次权重扰动

对每个官方权重独立采样 `[0.75w, 1.25w]`，随后归一化到 100；固定输入和情景，重算 5,000
次。逐城市、逐 target year 发布：

- 分数的 P5–P95；
- 名次的 90% 区间；
- 进入前四名的频率；
- 每对城市保持原先顺序的频率。

WIPO/JRC 对 GII 同样使用 5,000 次扰动权重的 Monte Carlo，并发布 90% 名次区间；GPI 则遍历
三大域的 5,100 多种权重组合来报告两国比较的稳健性。
[JRC GII robustness audit](https://www.wipo.int/web-publications/global-innovation-index-2024/en/appendix-ii-joint-research-centre-jrc-statistical-audit-of-the-2024-global-innovation-index.html)、
[GPI robustness methodology](https://www.visionofhumanity.org/understanding-the-global-peace-index-methodology/)

展示规则：90% 名次区间宽度超过 **3 名**（首批 16 城），或前四名出现率低于 **80%**，就标记
`weight-sensitive`，页面显示名次区间而不是宣称一个稳定的精确名次。这是披露规则，不是为了
调权直到得到喜欢的排序。

### C. 一次删维度检查

依次移除一个维度并将其余权重按比例归一化。若移除任一维度就让多数城市的排序大幅重排，
先检查该维度是否含异常值、缺失值替代或复合指数嵌套；不要用事后改权重掩盖数据问题。
OECD/JRC 将不确定性和敏感性分析列为复合指标正式构建步骤，并强调权重、缺失值、标准化和
聚合方式都可能改变结论。
[JRC sensitivity-analysis guidance](https://knowledge4policy.ec.europa.eu/composite-indicators/toolkit_en/navigation-page/10-step-guide_en/step-8-sensitivity-analysis_en)

## 决策

CCI `model_version = 1.x` 采用 **PCS 15 / GSS 15 / ISR 15 / RES 10 / MED 15 / LON 10 /
TEC 10 / OPT 10**。实现前先完成指标所有权表；有了首批 16 城的真实数据后运行上述敏感性
检查。权重不根据结果“调到好看”，只在发现概念重复或官方目标函数改变时通过大版本修订。
