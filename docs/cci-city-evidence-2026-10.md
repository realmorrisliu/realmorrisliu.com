# CCI 城市证据核验：2026-10-09

研究范围：新加坡、苏黎世、东京；重点为 PCS、RES、MED、TEC、OPT。以下是本次实际检索到的
一手证据与未解决问题，不是完整的八维地方证据包，也不是评分输入。检索日期为
2026-10-09；统计期单独列出，不能将网页更新时间当作观测年份。英文、德文、日文关键字段
保留原文；中文解释由模型翻译，未经过独立人工复核。

## 结论与发布资格

新加坡的国家统计与城市尺度较接近，适合作为先完成数据管线的城市；这仍不等于其行政国界
已经与项目冻结的 GHSL–OECD FUA 边界完成交叉验证。苏黎世市、苏黎世州、医院服务区、机场
服务区和 ETH 的机构边界不能混用。东京站点、东京都、供水服务区、东京—横滨创新集群及
整个 FUA 也不是同一个地理对象。

根据 `src/cci/model.ts` 和 `docs/cci-data-bias-governance.md`，本次证据不足以让这三座城市
获得正式排名资格：尚缺完整子支柱定义及标准化锚点、逐项完整 provenance、85% 城市观测
覆盖率、八维地方检索记录、独立替代检查、尾部测试及版本化未来转换。原值可以发布为证据；
不能把下表任何一个数直接称为维度得分，也不能用 2025 年单期观测填满 2035—2100 年。

## 新加坡

| 维度 / 子支柱            | 已核验原值与观测期                                                                                       | 一手来源                                                                                                                                                                                                                                                                | 使用边界                                                                                                                                     |
| ------------------------ | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| PCS / heat_humidity      | 樟宜气候站 2025 年平均气温 **28.1°C**，比长期均值高 **0.3°C**；年平均日最高 / 最低温 **31.8 / 25.4°C**   | MSS，《Singapore Climate 2025: The Year in Numbers》，2026 年 1 月，[PDF 第 1 页](https://www.weather.gov.sg/wp-content/uploads/2026/01/The-Year-in-Numbers-2025.pdf)                                                                                                   | 站点直接测量，非人口加权湿球热暴露；不能据此通过 fatal_heat_humidity 尾部测试。                                                              |
| RES / food               | 2025 年食品进口占比 **超过 90%**，来源为 **超过 180 个国家和地区**                                       | SFA，《Singapore Food Statistics 2025》，[官方发布说明](https://www.sfa.gov.sg/news-publications/newsroom/singapore-food-statistics-2025)、[报告第 6 页](https://www.sfa.gov.sg/docs/default-source/publication/sg-food-statistics/sgfs-2025-publication_060526-fa.pdf) | 部门行政/供应统计；进口依赖和来源数不是供应中断概率，后者也未按品类及份额集中度校正。保留 `>90`、`>180`，不伪造精确值。                      |
| RES / energy             | 2024 年总发电 **60 TWh**，总用电 **58 TWh**；天然气供应 **453,040 TJ**，用于发电 **393,748 TJ（86.9%）** | EMA，Singapore Energy Statistics，[Chapter 4: Energy Balance](https://www.ema.gov.sg/resources/singapore-energy-statistics/chapter4)                                                                                                                                    | **86.9% 的分母是天然气供应量，不是电力燃料占比**；不能写成“86.9% 电力来自天然气”。当前网页亦有 2025 上半年，不能视为全年。                   |
| RES / water              | PUB 当前页面称需水量约 **440 million gallons/day**                                                       | PUB，[Singapore's Water Loop](https://www.pub.gov.sg/public/waterloop)                                                                                                                                                                                                  | 页面未固定原值统计期，不能作为具有完整观测期的 canonical；需求不是断供冗余。页面的 2065 情景不是当前供给实绩。                               |
| MED / capacity           | 2025 年急性医院床位 **12,767**：公立 **10,784**、非营利 **334**、私立 **1,649**；社区医院床位 **2,579**  | MOH，2026-08-19，[Beds in Inpatient Facilities](https://www.moh.gov.sg/others/resources-and-statistics/beds-in-inpatient-facilities-and-places-in-non-residential-long-term-care-facilities/)                                                                           | 床位数量是容量代理，不能同时代表 access、quality、specialist_capacity、continuity；必须加入同年人口、实际开放/人员配备口径及等待时间。       |
| MED / workforce          | 2024 年注册医生 **17,582**，其中不在执业 **1,318**；公布医生密度 **2.9/千人**                            | MOH，[Health Manpower](https://www.moh.gov.sg/others/resources-and-statistics/health-manpower/)                                                                                                                                                                         | 总注册人数不能当成在岗全时当量。页面标题日期早于表中最新年度，使用表内年份并保留快照，不能据标题推断发布时间。                               |
| TEC / economic diffusion | 2025 版报告估计：2024 年数字经济名义增加值 **S$128.1bn**、GDP 占比 **18.6%**                             | IMDA，[Singapore Digital Economy Report 2025，执行摘要](https://www.imda.gov.sg/-/media/imda/files/about/resources/corporate-publications/annual-report/imda-sgde-report-fy2024-2025.pdf)                                                                               | 是包含数字化估算的经济产出，不是居民技术可及性。已发现 2026 版来源入口，但本次正文被 JavaScript 验证阻挡，**不得称此旧版数值为最新修订值**。 |
| OPT / transport          | 2024 年樟宜机场旅客流量 **67.7m**、飞机起降 **366,000**                                                  | CAG，2025-01-22，[2024 year in review](https://www.changiairport.com/en/corporate/our-media-hub/newsroom/2025/2024-year-in-review.html)                                                                                                                                 | 这是本次读取的一手旧期数值；并非最新全年。总流量不证明撤离容量、路线独立性或居民法律迁移权。                                                 |

需要下一步读取的最新 TEC 原文是 IMDA
[2026 版报告](https://www.imda.gov.sg/assets/8e4d9951-bc53-4612-80ba-77ee4feaa6da.pdf)及
[官方发布说明](https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/singapore-digital-economy-2026)。
本次直接打开均返回 JavaScript / robot verification 页面，故不把媒体转述的新值当作已核验。
MOH、SFA、EMA 的数据生产机制和主管责任也不同；共同政府归属既不证明完全独立，也不使其
自动失效。应逐指标追踪底层系统，不能把转载相同行政表格当成第二份验证。

## 苏黎世

| 维度 / 子支柱        | 已核验原值与观测期                                                                                                                           | 一手来源                                                                                                                                                                                                                      | 使用边界                                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| RES / water          | 2024 年向市内供水 **41.08 million m³**，向合作供水区供水 **11.65 million m³**；湖水 / 地下水 / 泉水生产量 **38.35 / 7.63 / 7.31 million m³** | Stadt Zürich，《Geschäftsbericht 2024》，4.3.11 “Kennzahlen Produktion und Leitungsnetz”，[原始报告](https://www.stadt-zuerich.ch/content/dam/web/de/aktuell/publikationen/2025/geschaeftsbericht/geschaeftsbericht-2024.pdf) | 市内与合作区分开，不能相加后配城市人口。三个水源也不等于独立于同一电网的三个备份。                                           |
| MED / long-term care | 州级 2025 统计：**212** 个应报机构；2025-01-01 床位 **17,797**，每千名 65 岁以上人口 **62** 张；2025-12-31 住民 **16,667**                   | Kanton Zürich，[Zahlen und Fakten zur Langzeitpflege](https://www.zh.ch/de/gesundheit/heime-spitex/zahlen-fakten-langzeitpflege.html)                                                                                         | 是州级长期照护，非苏黎世 FUA 急性医疗；数据来自 SOMED / Spitex 及州附加数据。只能先作背景。                                  |
| TEC / translation    | 2025 年 ETH 认可 **46** 家 ventures，分为 **24** 家 spin-offs 和 **22** 家 start-ups                                                         | ETH Zürich，2026-02-25，[德文原文](https://ethz.ch/de/news-und-veranstaltungen/eth-news/news/2026/02/mm-mehr-neugruendungen-neue-regeln-neues-foerderprogramm.html)                                                           | 2025 新规则导致分类断点，部分 start-ups 为早年成立后补认；**不能将 46 对 2024 年 37 当成同口径增长**。机构与都市圈亦未对应。 |
| OPT / transport      | 2025 年机场旅客 **32.6m**、起降 **270,116**、货物 **440,930 tonnes**                                                                         | Flughafen Zürich，2026-01-14，[年度原始公告](https://newsroom.flughafen-zuerich.ch/flughafen-zuerich-mit-neuem-jahreshoechstwert-bei-passagieren/)                                                                            | 运营者记录；不代表法律流动性、资产可携性或系统独立冗余。                                                                     |
| PCS / heat_humidity  | ETH / MeteoSwiss 展示的 Zürich-Kaserne 1991—2020 参考期为每年平均 **16** 个 ≥30°C 日；情景展示 **32—58** 日                                  | ETH focus Terra，[Hitze in der Stadt](https://keep-it-cool.ethz.ch/de/anpassung/hitze-in-der-stadt)                                                                                                                           | 后一个范围是 CH2025 情景展示，不是 2025 实测值，也不能直接映射 CCI 的固定年份。需下载原始网格和情景元数据再做 FUA 暴露。     |

本次检索发现了供水原文内部需解决的字段问题：2024 市政府报告的叙述称 “270 Rohrschäden”，
同章指标表 “Rohrbrüche” 列出 348；不能自行当成同义词合并。应向定义和原表追溯，故未选作
canonical 可靠性指标。该报告与
[WVZ 单独年报](https://www.stadt-zuerich.ch/content/dam/web/de/politik-verwaltung/stadtverwaltung/dib/WVZ_2024_Geschaeftsbericht.pdf)
共享上游，不构成独立互证。

## 东京

| 维度 / 子支柱                  | 已核验原值与观测期                                                                                                      | 一手来源                                                                                                                                                            | 使用边界                                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| RES / water                    | FY2024 配水 **1,528 million m³**、漏水 **53 million m³**、漏损率 **3.5%**                                               | TMG Waterworks，《Prevention of Leakage in Tokyo 2025》，印刷第 2 页，[PDF](https://www.english.metro.tokyo.lg.jp/documents/d/english/knowledge_and_tech_r07rousui) | 原表精度仅 3.5%；按圆整体积重算会产生差异。服务区为 23 区及 Tama 26 市町等业务范围，不是整个跨县 FUA。          |
| RES / water resilience         | FY2024 末配水管抗震接头比例 **52%**；配水管总长度 **27,585 km**                                                         | 同上，印刷第 1、4 页                                                                                                                                                | 是网络措施，不能把 52% 当成“地震安全概率”，也不能据此通过 geophysical_catastrophe。                             |
| PCS / heat_humidity            | JMA 东京站（47662）2025 年平均温度 **17.3°C**、年度极端最高 **38.5°C**、年降水 **1,152.5mm**                            | JMA，[东京年度原始表 2025 行](https://www.data.jma.go.jp/stats/etrn/view/annually_s.php?prec_no=44&block_no=47662&year=2025&month=&day=&view=)                      | 站点不是都市圈人口暴露；2026 行有不完整标记，不能当作完整年度。气温也不是湿球温度。                             |
| MED / observation availability | 已找到 **2024 年医療施設（動態）調査・病院報告**，页面更新 2026-04-16；含按区市町村拆分的病床表 24 及 CSV               | 东京都保健医疗局，[原始目录与下载入口](https://www.hokeniryo.metro.tokyo.lg.jp/kiban/chosa_tokei/iryosisetsu/reiwa06nen)                                            | 本次报告 PDF 请求 403，未完成表内提取；故**没有核验后的 2024 东京床位数**。未用旧的 2022 床位资料冒充最新数据。 |
| TEC / knowledge_output         | WIPO 2025 东京—横滨集群页：最新五年每百万人 **3,707 PCT applications**、**3,176 scientific articles**、**141 VC deals** | WIPO，[Tokyo–Yokohama profile](https://www.wipo.int/documents/d/global-innovation-index/docs-en-2025-jp-tokyo-yokohama-2.pdf)                                       | 集群边界和五年窗口须回到方法文件逐项确认；不是东京都年度观测。排名第 2 不能直接变成 CCI 分数。                  |
| OPT / transport                | 成田机场 2025 年旅客 **42,255,291**、起降 **253,586**，国际货运 **2,039,731 tonnes**                                    | Narita Airport，[Calendar-year statistics，2025 列](https://www.narita-airport.jp/files/c843886ae837019a5d8d546c9559b91710af7bc8fed0a97b356a5234a52e4cc8)           | 单机场运营量；必须再纳入羽田、轨道/公路可达性、共同风险和通行权后才能构造迁移选项。                             |

TMG 2025 漏损报告另有质量提示：正文的 FY2024 修复数为 9,117，而同页图标注为 7,885。
本次不选该计数字段评分，需核对附表及日文原版。JMA 温度直接观测与 TMG 管网行政数据可
支持不同子支柱，但不能互为同一 construct 的替代来源。

## 本地检索记录与下一步

| 城市   | 查询语言 / 关键词例子                                                                                                         | 已访问生产者                                                            | 本轮未完成                                                                                    |
| ------ | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 新加坡 | English: `2025 annual climate assessment`, `Singapore Food Statistics 2025`, `health manpower`, `digital economy report 2026` | MSS、MOH、SFA、EMA、PUB、IMDA、CAG                                      | IMDA 2026 原文访问；水/电实际中断；医疗结果及费用分布；OPT 法律及资产规则；GSS/ISR/LON 全包。 |
| 苏黎世 | Deutsch: `Wasserversorgung Geschäftsbericht`, `Zahlen Fakten Langzeitpflege`, `Hitzetage`, `Mehr Neugründungen`               | Stadt Zürich、Kanton Zürich、ETH、Flughafen Zürich、MeteoSwiss 资料入口 | 城市/FUA 地理联结；2025 市供水原表；急性医疗公平性；热暴露网格；GSS/ISR/LON 全包。            |
| 东京   | 日本語 / English: `令和6年 医療施設 病床数`, `東京 2025 猛暑日`, `Prevention of Leakage`, `Smart Tokyo 2025–2026`             | JMA、TMG、Narita Airport、WIPO                                          | 2024 医疗表提取；跨县服务边界；供水内部字段冲突；羽田及迁移通道；GSS/ISR/LON 全包。           |

建议先冻结指标 construct 与边界映射，再把符合定义的原值加入 registry。对未来转换，PCS 可
接地区气候网格，RES 可接真实容量/需求压力情景；MED/TEC/OPT 不应凭“技术进步”统一加分。
没有直接投影或可审计敏感度时保留缺失，继续显示具体缺口。
