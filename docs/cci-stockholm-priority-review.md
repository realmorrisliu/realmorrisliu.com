# Stockholm 1445：优先评估研究交接

本轮已实际审阅八维及 31 项语义，建议五维有条件 60，PCS、GSS、RES 保留未知。该建议尚待统一验收，不能据此称斯德哥尔摩已进入全球前 32。未知表示现有证据还不能合理选择档位，不表示能力低，也不以 50 分补齐。

| 维度                 | 主建议    | 判断要点                                                                     |
| -------------------- | --------- | ---------------------------------------------------------------------------- |
| PCS 自然风险与防护   | 未知      | 有真实遮阳、供水应对和雨洪研究，但缓解后的普通居民余险还不足择档             |
| GSS 组织与区域安全   | 未知      | 网络暴力和阻断有实证；战略、区域影响不能由战备或未发生战争推定为低           |
| ISR 制度与恢复       | 有条件 60 | 真实纠错、参与和危机响应，与信任差异、数据泄漏及待处理赔偿并存               |
| RES 资源净取得       | 未知      | 水、食品、能源、供应链和救助均已读；不能由机构或受助者样本替代中位居民净负担 |
| MED 必要常规医疗     | 有条件 60 | 真实常规交付、质量和通常支付路径；专科等待、院际差异仍重要                   |
| LON 先进治疗取得     | 有条件 60 | 已回输、正式病种建议、人体证据和后续监护路径；适应症、容量及付款连接有条件   |
| TEC 知识产用与扩散   | 有条件 60 | 实际产出、企业转化和运行中的数字服务；数据共享和规模化障碍仍存在             |
| OPT 合法退出与连续性 | 有条件 60 | 已运行交通与芬兰接收端、账户、汇款、通信路径；成本、审核和共同失效仍有限制   |

原权重下主向量为 `[null, null, 60, null, 60, 60, 60, 60]`。已支持的加权小计为 36；未知权重为 40%，故讨论数学域为 **36–76**。它不是成绩、概率区间或入围边界。任一关键条件被拒绝，相应维度撤回未知。

## 固定口径与地域

画像为 **2026 年瑞典本国公民、普通长期居民、当地中位收入、通常公共保障，不固定年龄**；证据截止日为 2026-10-10，原权重为 15/15/15/10/15/10/10/10。当前原件于 2026-10-14 读取；能确认的截止日前发布版本与观察窗逐源列出，未取得截止日历史字节的动态页面保留版本连续性假设。

冻结 GHS-FUA R2019A 中的 Stockholm 为 **1445**，面积 2,536 km²，2015 年人口约 201.1 万。人口是边界识别背景，不作 2026 医疗或社会样本分母。全 9,031 几何重新读取并校验；市中心、Solna/Huddinge 医院、KTH、两处水厂、Arlanda/Bromma 八个近似参考点均落入 1445。点在边界内不能证明整个机构服务域等于该功能区。

市政府报告覆盖 Stockholm 市及集团；水务含 Stockholm/Huddinge 与区域客户；Region Stockholm 和警方数据覆盖全郡；Karolinska 为多院区并接受全国转诊；KTH 是全校汇总。以下推定均保留这些差异，不能把全郡总量当 FUA 实测。

本研究开始时固定输入为已发布 54 案、HEAD `12135029f56f45a0e90f38bc3574b5c1ed1e56e8`。收束时主任务已报告当前发布基线为 56 案、HEAD `57611d5aeeb0887d15db9ebce4fa0204e0f1f610`；前者只保留为历史研究输入，整合不得覆盖或回滚后者。GPCI 仅用于发现线索，其排名及六维分数未转入 CCI。

## 自然防护与组织安全：为何暂不选档

市年报指出主要当前自然风险为暴雨洪水和热应激，并报告已做遮阳、脆弱群体场所改造和植树。水务报告记录 2025 年 8 月 Norsborg 原水高温导致部分慢滤池停用；实际运行调整与节水沟通后，学校开学用水没有出现通常上升，节水提示在不足两周后撤销。这是实施和应对证据，但不能把运营商对用水变化的解释当独立因果验证。[市年报，第 11、99 页](https://start.stockholm/globalassets/start/om-stockholms-stad/sa-anvands-dina-skattepengar/arsredovisningar/the-city-of-stockholms-annual-report-2025.pdf)、[水务年报，第 17 页](https://www.stockholmvattenochavfall.se/globalassets/pdfer/rapporter/svoa/ars_och_hallbarhetsredovisning.pdf)

市域暴雨行动计划覆盖为 10%，目标 33%；这是**计划覆盖**，不等于已建成防护覆盖。地质风险与地下设施淹水已纳入分析。机场的风暴、火险、滑坡及降雨情景亦已审阅，但模型明确存在地面不稳定未来情景、极端天气细节和投资配置缺口，Arlanda/Bromma 部分雨洪措施仍在分析阶段。已建遮阳或模型存在不能单独支撑综合 60；目标未达也不能直接改为 40。PCS 保留未知，局地野火实际损害与防护尚无专项核实资料。[市年报，第 99–100 页](https://start.stockholm/globalassets/start/om-stockholms-stad/sa-anvands-dina-skattepengar/arsredovisningar/the-city-of-stockholms-annual-report-2025.pdf)、[Swedavia 年报，第 76–77、81 页](https://www.swedavia.com/globalassets/ahr/2025/swedavias_annual-and-sustainability-report-2025.pdf)

警方 2026-02-03 发布：全郡 2025 年 69 起确认枪击，2020 年为 164 起。2026 年 1 月枪击为 3 起、上年同月 14 起；爆炸 4 起为初步数字，上年同月 20 起。这些不构成全年 2026 下降结论，也不表示每起枪击都属组织犯罪。正文同时确认警方实际提前阻断与犯罪网络关联的严重暴力，未成年招募和重要困难仍存在。[警方原文](https://polisen.se/aktuellt/nyheter/stockholm/2026/februari/kraftig-minskning-av-skjutningar-i-stockholms-lan/)

机场与国防、交通机构合作和人员战时编组已经实施；市政府也报告防护场所工作与信息泄漏后的真实危机响应。但战备部署不是成功阻断攻击，数据泄漏没有被本研究归因外国国家。已定位国家安全报告正文未成功获取，搜索摘录不作证据。当前不足以判断匹配防护后区域、战略风险对画像的综合余障，GSS 保留未知；无需等实际战争才研究该维。[Swedavia 年报，第 28 页](https://www.swedavia.com/globalassets/ahr/2025/swedavias_annual-and-sustainability-report-2025.pdf)、[市年报，第 13、113 页](https://start.stockholm/globalassets/start/om-stockholms-stad/sa-anvands-dina-skattepengar/arsredovisningar/the-city-of-stockholms-annual-report-2025.pdf)

## 制度与资源：真实帮助之后还有什么

2025-08-20 劳动法院判决确认被禁止工作的孕期员工工资补足、赔偿与利息权利，地方雇主和工会随后形成执行协议；市年报估计相关成本约一亿 SEK。它支持纠错机制有实际作用，不能称所有索赔已支付。市政府真实终止不合格护理合同、暂停部分供应商订单，实施七项参与式预算；泄漏发生后启动中央危机组织并报主管机构。市调查信任为 37%，区间 27–45%，与社会经济差异相关；部分赔偿还在调查。ISR 60 依赖这些纠错和交付对普通居民有实质通常作用的有限推定，不能由法院或民主机构名称直接给分。[市年报，第 13、113、116–117 页](https://start.stockholm/globalassets/start/om-stockholms-stad/sa-anvands-dina-skattepengar/arsredovisningar/the-city-of-stockholms-annual-report-2025.pdf)

供水抽样 99.8% 达标；2025 年中断是 **110 千消费者小时**，且标为初步值，不是 110 起中断。常规网络抽样超过 1,200 次，其中三次大肠菌群超限，冲洗和提高周转后复测均达标。年报每连接人 2,820 SEK 是运营成本指标，不是该居民实付水费；不能用它闭合净负担。[水务年报，第 8、17 页](https://www.stockholmvattenochavfall.se/globalassets/pdfer/rapporter/svoa/ars_och_hallbarhetsredovisning.pdf)

食品、能源与供应链也确有审阅：市机构约每周供应百万份餐食，食品采购每千克成本 +3.7%，10,848 项合同商品缺货后订；市域还有运行能源采购、污水生物气、备用机和应急库存。市机构太阳能发电 7,939 MWh，部分设备停用；水务原生物炭装置因运行困难关闭，未来扩大生产尚在研究。这些是真实正反材料，但机构采购、碳排或库存不是居民不断供及可负担证明。[市年报，第 48、97–100、113 页](https://start.stockholm/globalassets/start/om-stockholms-stad/sa-anvands-dina-skattepengar/arsredovisningar/the-city-of-stockholms-annual-report-2025.pdf)、[水务年报，第 25–26 页](https://www.stockholmvattenochavfall.se/globalassets/pdfer/rapporter/svoa/ars_och_hallbarhetsredovisning.pdf)

2025 年市政府实际支付经济援助 10.86 亿 SEK，年内至少一次受助家庭 12,030 户；平均每人每月 7,693 SEK 的口径将成人、儿童等权。全国援助标准 +2.8%，公共住房平均租金 +5%。实际救助与负担变化均保留，但这是受助者和公共租房样本，不能推定中位居民食品能源不足，亦不能推定救助已使其通常可负担。按统一 RES 规则，目前不能合理选 40 或 60，主建议未知。[经济援助报告，物理第 4、15 页；后者印刷第 14 页](https://start.stockholm/globalassets/start/om-stockholms-stad/utredningar-statistik-och-fakta/statistik/ekonomiskt-bistand/2025/ekonomiskt-bistand-2025.pdf)

## 医疗与先进治疗：交付、等待、支付分别核对

Region 2025 年报显示：家庭医疗三日内获医学评估比例 96%；等待专科治疗者中等待不超过 90 日为 78%，上年 76%；等待首次专科访问者中不超过 30 日为 56%，上年 57%，地方目标至少 70%。这是等待者指标，不是全居民分母或全部完成治疗比例。30 日地方目标不能变成所有其余 44% 违反法定 90 日保证；全年聚合的精确队列未独立重建。急诊初次医生评估 56→51 分钟，总停留 254→255 分钟，医院差异真实存在。[Region 年报，第 22、24 页](https://www.regionstockholm.se/49ae8f/contentassets/c4853f1d3efe4d4ebac340a1d7fa56b3/arsredovisning-2025-for-region-stockholm2.pdf)

医院相关感染 4.4→4.2%，仍高于 ≤4.0 目标；精神门诊新患者自杀风险评估 85%。这些未经本研究风险调整，不是普适临床成功率。2025 年出院待转交市护理天数因系统不可比而无法报告，不能写为零或沿用上年 0.5。真实增购、生产、连续服务与质量改进支持有条件 MED 60；等待和余下伤害使 80 不合适。若通常居民在改善后仍有重要必要护理时效余障，40 是相邻实质裁决，而不是“未达目标所以 40”。[Region 年报，第 22、24–25、82 页](https://www.regionstockholm.se/49ae8f/contentassets/c4853f1d3efe4d4ebac340a1d7fa56b3/arsredovisning-2025-for-region-stockholm2.pdf)

通常患者费用中，18–84 岁普通门诊/视频 275 SEK、急诊 400 SEK、住院每日 130 SEK；纳入保护的门诊十二个月上限 1,450 SEK。年龄例外、服务排除和药品必须分别看，不给无固定年龄画像默认单一费率。处方药保护上限在 2025-07-01 从 2,900 提到 3,800 SEK，对新保护周期逐步生效，不能把门诊上限称为一切费用上限。MED 的通常公保净取得仍是有限推定，拒绝即未知。[主管费用页](https://vard.regionstockholm.se/patientavgifter/)、[区域药品报告，第 14、17 页](https://janusinfo.se/download/18.7d54587a19d9a5193393d45f/1777016234802/%C3%85rsber%C3%A4ttelse%20l%C3%A4kemedel%202025.pdf)

Karolinska 报道确认两名多发性骨髓瘤患者已经治疗，首位六月采集、2025 年八月末回输；第三位只是计划。2019 年起已有常规 B 细胞淋巴瘤治疗。团队定期讨论治疗与后续状态，CAST 主管页面明确住院实施及成人门诊后续照护，免疫过激或神经反应可能需要 ICU；细胞持续性检测也有操作路径。后者的“未认证”是该检测项目字段，不等整个治疗项目未认证；婴儿至 75 岁范围指移植患者，不等全部 CAR-T 年龄适用。[真实回输报道](https://www.karolinska.se/om-oss/centrala-nyheter/2025/11/car-t-behandling-mot-multipelt-myelom--ett-lagarbete-pa-sjukhuset/)、[CAST 交付与后续护理](https://www.karolinska.se/vard/tema/tema-cancer/cellterapi-allogen-stamcellstransplantation/cellterapi-och-allogen-stamcellstransplantation/)、[随访检测协议](https://www.karolinska.se/pta/klinisk-immunologitransfusionsmedicin/car-t-cell/)

NT-rådet 的 2025-06-19 正式建议允许特定成人复发难治、来那度胺难治且符合既往治疗条件的 MM 使用 Carvykti；是“可使用”，不是所有患者“必须使用”。地区议价已形成降价合同，属于医院 requisition 药物路径。正式正文报告 CARTITUDE-4 随机三期 419 人，中位随访约 34 月，最长 45 月，并明确长期相对效果和剩余寿命不确定；这里独立核读的是主管原文，未独立重建试验数据或另读 EPAR。约 412.7 万 SEK 是评估成本，不是普通居民账单。[正式建议，第 1–3 页](https://samverkanlakemedel.se/download/18.25c4a46e1976278fa4d3e0e/1750320332778/Carvykti%20vid%20MM%202L%202025-06-19.pdf)

不能由上述正式路径断言那两名患者的具体产品；报道未点名。扩容所需地区资金仍在争取，也不能写成已保证所有合格患者取得。LON 60 来自真实临床交付、人体成熟度、正式病种采用和通常监护/公费路径的组合，仍依赖疾病合格居民通常转诊、付款、容量及 2026 持续实施推定；任何关键连接被拒绝即未知。它不表示健康人可延寿、治愈已证或所有年龄都适用。

## 技术扩散与退出：设施之外的真实连接

KTH 当前年报为 2026-06-04 修订版，修正第 7、17、19 页；索引于 2026-09-07 更新，不能称最初二月版原字节已核。2025 年创新记录为 439 个想法、194 个验证、6 个孵化、20 件专利申请、40 家新企业；2024 年同行评议论文 4,383，最终 2025 数字因登记滞后未定。真实企业博士、生产研究迁移和合作也已阅读，但新企业数量不等 FUA 存续企业、工业密度或普通居民受益。[KTH 年报，第 38、43 页](https://www.kth.se/polopoly_fs/1.962325.1780567346%21/KTH-AR-SWE-25.pdf)、[版本索引](https://www.kth.se/om/fakta/kth-s-arsredovisningar-1.803591)

市评估报告于 2026-05-13 发布，回顾 2017–2025：运营商可使用光纤、LoRaWAN、平台、学校物业传感和 AI 控制已有运行；但多数数据仍留在采集部门，门户利用有限、共享流程和角色未建立完整，法律和互操作障碍还影响实施。已建平台与这些实际扩散余障一起支持有条件 TEC 60。区域 5G 医疗是试验项目，不能写成所有医院通常部署；“24 场论坛”亦不是居民使用绩效。[数字评估，第 6、17–21 页](https://start.stockholm/globalassets/start/om-stockholms-stad/utredningar-statistik-och-fakta/utredningar-och-rapporter/verksamhetsutveckling-innovation-och-digitalisering/stockholm-mot-en-smart-och-innovativ-stad.pdf)、[Region 年报，第 30 页](https://www.regionstockholm.se/49ae8f/contentassets/c4853f1d3efe4d4ebac340a1d7fa56b3/arsredovisning-2025-for-region-stockholm2.pdf)

Arlanda 2025 年实际 24,239,589 人次、138 条国际航线；Bromma 25,191 人次、零国际航线。不能把全国机场 3,330 万人次给 Stockholm，也不能把两个机场写成独立充足的国际冗余。区域轨道、公交、船舶实际运行可以组成不同模式，但区域交通不自动是每种跨境退出的替代线路。[机场年报，第 28–29 页](https://www.swedavia.com/globalassets/ahr/2025/swedavias_annual-and-sustainability-report-2025.pdf)、[Region 年报，第 28 页](https://www.regionstockholm.se/49ae8f/contentassets/c4853f1d3efe4d4ebac340a1d7fa56b3/arsredovisning-2025-for-region-stockholm2.pdf)

瑞典迁移主管的北欧互惠权利与芬兰 DVV 接收端已分别读：抵芬、拟居住至少一年、本人登记、有效护照或照片身份证等；芬兰免费登记与预计 2–4 周办理不是无条件批准保证，不能搬用瑞典入境行政规则。接收银行 Nordea 明确对瑞典等北欧居民可提供日常服务，EEA 基础账户仍保留身份、反洗钱和审核要求；Swedbank 外汇转账需启用和收款人资料。国外重置认证可能需到芬兰分行，移民后并非所有资产或服务都不变。[瑞典主管](https://www.migrationsverket.se/du-vill-ansoka/medborgare-i-eu-ees-eller-norden/nordisk-medborgare.html)、[芬兰北欧资格](https://dvv.fi/sv/hemkommun/norden)、[芬兰登记](https://dvv.fi/sv/registrering-av-utlanningar)、[Nordea 接收账户和认证](https://www.nordea.fi/en/personal/bank-with-us/how-to-bank-with-us/living-abroad.html)、[Swedbank 转账与身份操作](https://www.swedbank.se/privat/kundservice-privat.html)

Telia 消费者规则明确 EU/EEA 临时漫游和接收短信路径，16 周国外使用多于国内可触发公平使用收费，船舶卫星网络另计；本地和接收网络、银行认证存在共同失效。OPT 60 要求中位居民通常能支付普通出行、证件、账户与连接费用并通过正常审核，不能只从规则存在直接给分，也不要求逐个居民完成真实迁移。[Telia 消费者规则](https://www.telia.se/roaming?sok-privat=landsnummer)、[Nordea 身份认证](https://www.nordea.fi/en/personal/our-services/online-mobile-services/access-codes/)

## 八维 31 项审阅覆盖与撤回

每项实际读过的来源范围详见冻结私账 `semantic-coverage.json`。31 项全部为 **reviewed_partial**，不是 31 项完整实测：

| 维度 | 已审语义                               | 明确剩余范围                                                            |
| ---- | -------------------------------------- | ----------------------------------------------------------------------- |
| PCS  | 热湿、洪水海平面、地质、严重天气与野火 | 局地野火专项未取得；地质及风暴主要为机场/市风险分析，当前普通余险未择档 |
| GSS  | 组织暴力、区域冲突、战略暴露           | 全郡枪击不全属组织；国家战略正文未成功核读，机场战备不证阻断            |
| ISR  | 治理、适应、社会凝聚、应急恢复         | 索赔支付、代表性及 2026 持续性有限；不称机构存在即绩效                  |
| RES  | 水、食品、能源、供应链                 | 全部有实际读取，但机构和援助样本尚未闭合中位居民净取得                  |
| MED  | 取得、常规质量、专科容量、连续性       | 分母聚合及风险调整未重建；等待、费用排除和院际差异保留                  |
| LON  | 转化、人体成熟、正式采用、居民取得     | 试验原数据未重建；病种和付款/监护通常路径推定可撤，扩容尚缺资金         |
| TEC  | 知识产出、产业、数字基础、扩散         | 企业/学校/机构不是 FUA 全体密度；数字扩散有真实余障                     |
| OPT  | 交通冗余、合法迁移、资产、网络连续性   | 版本、审核、净成本和认证共同失效均未作无条件保证                        |

五个 60 各改为 40，已支持小计分别下降该维权重的 20%；全部改为 40 时讨论域为 24–64。任一关键桥撤回未知：ISR 或 MED 的域为 27–82；LON、TEC 或 OPT 的域为 30–80。它们说明条件敏感性，不给未知维填中值；未验证谁在第 32 名之前。

## 原件、失败与停止

本城账本保存 **26 个有效原件**（7 个冻结复用、19 个新原件）、3 个新原取失败及 2 个旧 404 未重试；没有单独无原件的已核正文证据。网页工具读取与原件相同的正文不重复计源，搜索摘录不当已读临床或法律材料。每源 URL、版本、观察窗、范围、bytes/SHA256、失败诊断与 13 个关键 PDF 页像素核对记录均在 `source-manifest.json`。

两轮共 16 个定向搜索后关闭发现，只跟随已定位附件。Migri 两次网页 403 与一次原取 403 后停止；国家安全正文 247、网页无可读正文、另一个已定位新闻入口 TLS 失败后停止，未绕过证书验证或循环请求。旧 Region/中期报告 404 未重试。市年报超网页工具容量后独立取得有效原 PDF，不将失败响应当原件。

下一最小连接是：自然防护后的实质普通余险、组织/战略防护后的实际区域影响，以及中位居民资源供给和帮助后的净负担方向。它们可以补证，但本轮不追加发现；没有理由为了凑全分或高分而无限扩搜。
