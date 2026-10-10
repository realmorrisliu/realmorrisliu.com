# CCI 全球候选全集：定义、可执行起点与遗漏边界

核查日：2026-10-10（Asia/Shanghai）。本笔记只研究候选全集，不建立城市分数，也不发布前 32。

**建议立即采用仓库已冻结的 GHS-FUA R2019A v1.0 全部 9,031 条 eFUA 作为第一版可复核候选框架。** 这解决“先指定赢家再研究”的选样问题，但只能支持“在该版本全球功能城市区全集中按 CCI 选出的前 32”，不能等同于覆盖当代所有城市。新增人口门槛、洲别配额或外部综合榜单前 N 名都会重新引入未经 CCI 证明的排除规则。

## 三种全球框架并不等价

| 框架     | 本次能确认的版本与数量                                                                                                     | 单位、门槛及时间                                                                                         | 与当前 CCI 的关系                                                |
| -------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| GHS-FUA  | R2019A，v1.0；本地冻结文件实查 **9,031** 条、9,031 唯一 `eFUA_ID`                                                          | 2015 年城市中心及估算通勤范围，1 km 网格；World Mollweide / EPSG:54009                                   | 完全匹配当前发布采用的文件版本，最小改动                         |
| GHS-UCDB | R2024A；官方 overview 报 **11,422** 个经过质量控制的城市中心；产品页仍列 v1.1（2025-07-31），下载页已列 v1.2（2026-06-10） | 基于 GHS-SMOD R2023A、按国家切分的 urban centres；产品参考年 2025；城市中心不是通勤区                    | 较新且有多主题指标，但不能直接替换现有 eFUA ID 或边界            |
| UN WUP   | WUP 2025，2025-11-18 发布；官方 FAQ 确认 **超过 12,000** 个 2025 年人口至少 5 万的城市；国家/地区统计总覆盖 237 个         | DEGURBA：相邻 1 km² 网格形成的密集城市中心，密度至少 1,500 人/km²、总人口至少 5 万；城市表涵盖 1975–2050 | 适合较新候选完整性核对与人口资料；不是通勤区，不能按名称直接拼接 |

GHS-FUA 的版本、历元和建模输入见 [JRC 产品页](https://human-settlement.emergency.copernicus.eu/ghs_fua.php)。其范围由城市中心、出行时间、人口和国家人均 GDP 等估计；它并不拥有全球逐条实测通勤流。因此 eFUA 不能冒称 OECD 用实际通勤数据界定的 FUA。[JRC 技术报告](https://human-settlement.emergency.copernicus.eu/documents/GHSL_FUA_2019.pdf)

UCDB 数量来自 [官方 overview](https://human-settlement.emergency.copernicus.eu/ucdb2024Overview.php)；版本冲突可在[产品页](https://human-settlement.emergency.copernicus.eu/ghs_ucdb_2024.php)和[下载页](https://human-settlement.emergency.copernicus.eu/download.php?ds=ucdb)复核。可视化页面还注明仍使用 v1.0，不能用地图显示数量证明 v1.2 的精确记录数。本次没有下载 v1.2 全量包，所以 **11,422 是 overview 报告值，不声称是本次实数的最新版记录数**。[可视化版本说明](https://human-settlement.emergency.copernicus.eu/ucdb2024visual.php)

WUP 范围、发布日期和密度/人口定义来自 [UN 官方 FAQ](https://population.un.org/wup/assets/Publications/undesa_pd_2025_faq_wup25.pdf)；使用城市全表 `WUP2025-F21-DEGURBA-Cities_Pop`，不要误用 `F18` 人口前 100。[UN 城市下载目录](https://population.un.org/wup/downloads/?tab=Cities) 本次未下载全量城市 CSV 做去重计数，故不把未经逐行核实的更精确数字写成确数。237 是国家及地区报告覆盖，不代表其中每个地区均有符合门槛的城市。

## 冻结文件实查结果

读取已有缓存 GeoPackage，未重新生成或修改边界。其 SHA-256 与仓库 `src/cci/data/boundary-audit-2026-10-expansion.json` 一致。

- 官方 ZIP：[GHS_FUA_UCDB2015_GLOBE_R2019A_54009_1K_V1_0.zip](https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/GHSL/GHS_FUA_UCDB2015_GLOBE_R2019A/V1-0/GHS_FUA_UCDB2015_GLOBE_R2019A_54009_1K_V1_0.zip)
- GeoPackage SHA-256：`9934364827132232df67e8984768fb30865a846f5a786db999d49fc37fb7698d`。
- 表名：`GHS_FUA_UCDB2015_GLOBE_R2019A_54009_1K_V1_0`。
- `COUNT(*) = COUNT(DISTINCT eFUA_ID) = 9031`；`COUNT(DISTINCT Cntry_ISO) = 188`。
- `SUM(UC_num) = 10338`：一个 eFUA 可以包含多个城市中心，不能把 UC 数当 eFUA 数。
- 最小 `FUA_p_2015` 约 50,079；最小 `UC_p_2015` 约 50,007；本包没有 FUA 人口低于 5 万的记录。这是文件事实，不是新加的 CCI 筛选门槛。
- `Commuting = 0` 有 650 条，`geom IS NULL` 为 0；没有通勤扩展的条目仍在官方全集，不应默默删除。非空几何不代表已经通过有效性、重叠与拓扑检查。

可复核的只读查询：

```sql
SELECT COUNT(*), COUNT(DISTINCT eFUA_ID), COUNT(DISTINCT Cntry_ISO),
       MIN(FUA_p_2015), MIN(UC_p_2015), SUM(UC_num),
       SUM(Commuting = 0), SUM(geom IS NULL)
FROM GHS_FUA_UCDB2015_GLOBE_R2019A_54009_1K_V1_0;
```

## “全球全集”仍会遗漏什么

1. **门槛与年代遗漏。** 五万人以下的小城、低密度但行政上名为城市的地区，以及 2015 年后增长形成的城市，可能不在这个 2015 框架内。名称为“全球”只描述地理覆盖意图，不取消入选定义。不能据此宣布这些地方 CCI 更低。
2. **边界与合并偏差。** 技术报告明确城市中心按国家切分，极大中心另有拆分规则，通勤关联也受国家范围约束。因此跨境生活圈、一个名字对应多个中心或多个名字合成一个区域都需单独解释；原 CCI 展示名不能反向定义源多边形。[GHS-FUA 技术规格](https://human-settlement.emergency.copernicus.eu/documents/GHSL_FUA_2019.pdf)
3. **全球建模并非全球等质量。** 基于部分地区真实 FUA 训练后向全球估算，具有模型迁移与输入人口误差；本包只有 188 个不同代码，不能用“全球”宣称与 WUP 的 237 地区口径一致。代码体系差异与实际缺失须另作交叉表，不直接相减为遗漏国家数。
4. **更大的新框架也不等于所有城市。** UCDB / WUP 的中心口径省略许多外围通勤地带；WUP FAQ 还指出粗粒度人口输入可能把不同聚落过度合并。合并后的大城市不是行政市名次的简单同义词。[UN 定义与聚落合并说明](https://population.un.org/wup/assets/Publications/undesa_pd_2025_faq_wup25.pdf)
5. **指标覆盖偏差独立于候选覆盖。** 将 9,031 个 ID 登记齐全，只证明候选已列出；英语资料多、医疗机构宣传多或现有 32 城研究更充分，不意味着这些地方表现最好。不能把缺少文献的候选计 0 或直接排除。

## 与仓库匹配的最小可执行流程

以下为研究与实现建议。本笔记仅做只读核查；主任务已另行落地[全量候选 CSV](data/cci-global-candidates-r2019a.csv)，本节不表示后续评分或空间交叉已完成。

1. 从已经冻结并验哈希的 GeoPackage 全量导出轻量候选注册表：版本、`eFUA_ID`、源名、国家/地区代码、`UC_IDs`、2015 人口与面积。保留所有 9,031 条，以源 ID 为键；不要求先有人工中文名或 slug 才能入池。城市展示名与别名可后补。
2. 锁定一个排名目标：同一发布日、同一 CCI 八维定义与权重、同一目标年及中心/保守/Lifetime 模式。否则“全球前 32”没有唯一含义。默认可用发布当年的中心总分，但必须明确是 CCI 研究模型下的结果。
3. 对全池建立八维证据覆盖和分数状态。已有 32 城只是已做研究的起点，不享有入围资格。使用统一全球原始层、国家背景和当地原始来源时，分别标明空间范围；同国背景不能伪装成城际差异。UCDB 指标可帮助补充某些 CCI 维度，不能自动填满医疗可及、长寿转化等全部维度。
4. 降低工作量靠可审计的筛选证明，而非先挑知名城市：若采用分阶段研究，任何提前排除都必须有相同 CCI 模型下成立的分数上界，且严格低于至少 32 个候选的可信下界。未知维度保留其理论允许范围；不能用主观半宽或缺测分数制造排除证明。现有模型的 ±8–20 是研究敏感性范围，**并非保证包含真值的上下界**，因此不能直接用作安全剪枝。
5. 没有上述排除证明，就需要继续研究所有可能进入前 32 的候选；若仍无法判断，发布候选状态与“当前已研究范围内前 32”，不能提前称全球前 32。第 32 名附近区间大量重叠时，也应展示排序不稳定性。
6. 作为覆盖复核，另将新版 WUP / UCDB 与旧 eFUA 做空间交叉，记录新增中心、拆分/合并和未匹配项。名称匹配只能提示，不能确立一对一映射。若用户要求涵盖 2025/2026 新形成城市，需要一次显式边界版本迁移与历史复算；不能悄悄混合旧 eFUA 和新 urban centre。

这个最小方案无需引入另一套综合城市榜单，也无需先设计大平台：先得到可信的全量 ID 清单，再按 CCI 八维统一筛选。它不能承诺靠登记清单就完成全球评分；当前 32 城扩展研究不足以证明全球前 32。

本次只核验原始机构说明与本地冻结文件属性；未下载新版 UCDB / WUP 全量包、未完成空间交叉、几何拓扑检查或 9,031 城八维评分。

## 本轮实物补证：UCDB v1.2 已取得

2026-10-10 继续核查并实际下载；此节更新上文初次调查“未下载新版包”的状态，不改变冻结 eFUA 候选框架。

官方 [v1.2 目录](https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/GHSL/GHS_UCDB_GLOBE_R2024A/GHS_UCDB_GLOBE_R2024A/V1-2/)仅提供 ZIP，没有独立 CSV。先核对目录大小 264 MB 后，下载了[全量原包](https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/GHSL/GHS_UCDB_GLOBE_R2024A/GHS_UCDB_GLOBE_R2024A/V1-2/GHS_UCDB_GLOBE_R2024A_V1_2.zip)，实际为 **276,662,440 bytes**。目录文件时间 2026-05-19；包内 readme 数据更新时间 2026-05-15；下载页发布日期 2026-06-10。这三者分别是文件时间、内容更新时间、公开发布标注，不混作同一日期。

缓存目录为 `/private/tmp/cci-global/`，保留原 ZIP、GeoPackage、两份 PDF、readme、许可证，以及本次从 SQLite 导出的 16 份去几何属性 CSV。未解出包内 175 MB 的重复 Excel。官方另提供主题小包：[CLIMATE v1.2](https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/GHSL/GHS_UCDB_GLOBE_R2024A/GHS_UCDB_THEME_GLOBE_R2024A/GHS_UCDB_THEME_CLIMATE_GLOBE_R2024A/V1-2/)约 18 MB，[WATER v1.2](https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/GHSL/GHS_UCDB_GLOBE_R2024A/GHS_UCDB_THEME_GLOBE_R2024A/GHS_UCDB_THEME_WATER_GLOBE_R2024A/V1-2/)约 8.5 MB；全包已完成，未再重复下载主题包。

### 完整性与版本证据

| 缓存文件                                  | SHA-256                                                            |
| ----------------------------------------- | ------------------------------------------------------------------ |
| `GHS_UCDB_GLOBE_R2024A_V1_2.zip`          | `12dc8d366a6057b832a070ba3f7b7b7c601bad191da0417a666851f35f10db2e` |
| `GHS_UCDB_GLOBE_R2024A.gpkg`              | `56e60b7cbfc776b23493d5684aa5d0d7d6940fc3dd9a3881fa52599f20fd80fc` |
| `GHSL_UCDB_R2024_V1_2.pdf`（方法说明）    | `00dbf5ac9a44c59919106cbe01149aea2923e011e9bab0256fd1f9e818546260` |
| `GHS_UCDB_GLOBE_R2024A.pdf`（逐字段字典） | `09546e2713356e7b860a9986db714aee9635b5ae294770b15f88cba458114519` |
| `readme_V1_2.txt`                         | `0ee8fb8e20da515f4b9fd41b28285ffeb596914c699bf7708e7e0a8a4a660a68` |
| `ucdb-copyright.txt`                      | `f20723519a580fb35b3499870f0b1baea54f483195105416e547f0014f1610d2` |

包内 readme 明确 v1.2 替代并废弃 v1.1，主要调整排放字段，同时残留 Alternative name / Acronym / Document version 的 v1.1 文案。以目录、原文件哈希、`Version V1_2` 和变更记录一起识别版本，不从残留标题推断版本。许可证实际下载自[官方 copyright.txt](https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/GHSL/GHS_UCDB_GLOBE_R2024A/copyright.txt)：**CC BY 4.0**，复用需署名并说明修改；仍须保留上游数据来源与字典中的适用限制。

### 全量属性实际计数

本次直接读取 GPKG，普通属性用标准 SQLite 查询，不依赖网页摘要：

- GENERAL_CHARACTERISTICS：**11,422 行、11,422 个唯一 `ID_UC_G0`**，因此 v1.2 的主体数量已得到实物确认。
- CLIMATE、EMISSIONS、EXPOSURE、GEOGRAPHY、GHSL、GREENNESS、HAZARD_RISK、HEALTH、INFRASTRUCTURES、LULC、SDG、SOCIOECONOMIC、WATER 及 UC_centroids 也各有 11,422 行。
- **NATURAL_SYSTEMS 为 11,433 行，但仅 11,422 个唯一 ID**：11 个 ID 各出现两次，不是新增 11 城。重复身份如下，源名和国家文本保持原样。

| ID_UC_G0 | 源名       | 源国家文本  |
| -------- | ---------- | ----------- |
| 67       | Aachen     | Germany     |
| 441      | Ruse       | Bulgaria    |
| 596      | Larnaca    | Cyprus      |
| 1521     | Ramallah   | Palestine   |
| 2289     | Jerusalem  | Israel      |
| 3063     | Maastricht | Netherlands |
| 3345     | Heerlen    | Netherlands |
| 4299     | Constance  | Germany     |
| 4943     | Cúcuta     | Colombia    |
| 5257     | Umm Qasr   | Iraq        |
| 6621     | Reynosa    | MÃ©xico    |

未证明重复原因，也未擅自去重；`MÃ©xico` 是查询得到的源文本，提示还需文字编码核对。该主题不能直接一对一 JOIN 到主表，否则会扩行。

去除 SQLite `fid` 与二进制 `geom` 后导出 CSV，总计 201,452,346 bytes。`ucdb-attributes-manifest.json` 记录每表列名、记录数、唯一 ID 数、导出大小与 SHA；`extract-ucdb.py` 保存导出流程。`ucdb-dictionary-extracted.json` 是从附带 PDF 提取的 **477 个字段模板说明**，保留原字段名、单位、来源、方法与时期；自动提取结果需对照 PDF，不是重新认证的数据字典。跨表去掉 `fid/geom` 后字段名并集为 2,811，包含不同年份和元数据，不能与网页“指标数”直接比较。

### CCI 可用字段与必须保留的限制

以下字段均已在实际表中找到，解释对照包内 `GHS_UCDB_GLOBE_R2024A.pdf`；只是候选输入，不等于已完成 CCI 原始指标映射。

| CCI 方向       | 实际字段例                           | 字典含义与限制                                                                 |
| -------------- | ------------------------------------ | ------------------------------------------------------------------------------ |
| PCS 气候背景   | `CL_B01_CUR_2010`                    | 十年平均温度，再分析资料；不是 2010 单年实测，也不直接测极端热死亡             |
| PCS 洪水暴露   | `EX_100_SHP_2025`                    | 字段描述为百年重现期洪水暴露人口占比；但字典标题误写十年，须回核原层后采用     |
| RES 水资源背景 | `WA_GWR_GWB_2025`、`WA_GWS_SAL_2025` | 含水层类别、咸水标记，源为 WHYMAP；不是供水可及率、断供率或水库储备            |
| RES 设施基础   | `IN_CIS_WAT_2020`、`IN_CIS_ENE_2020` | 水与能源部门基础设施空间指数，非服务稳定性或供给冗余                           |
| MED 设施背景   | `HL_FCL_HOS_2024`                    | 医院设施计数，源自 healthsites / OSM，继承标注完整性差异；不测床位、质量或准入 |
| GSS 历史背景   | `HZ_CON_SBC_2020`、`HZ_CON_FAT_2020` | 确有历史冲突相关字段；本轮未核对其窗口定义，暂不导入 CCI                       |

另一个实际不一致：字典列 `WA_GWR_GWR_XXXX` 为地下水补给类别，但 WATER 表没有 `WA_GWR_GWR_2025`，而有 **`WA_GWR_MMA_2025`**。本轮不猜测二者相等，不自行更名后评分。

数据已到手，下一步应做 `ID_UC_G0` 到冻结 2015 eFUA 的空间交叉及逐字段覆盖、缺失值与语义检查。新 UCDB 的 2025 ID 与旧包 `UC_IDs` 不得因都是整数就直接相连；城市中心属性也不能无条件扩展为整个通勤区数值。

本轮未修改候选 CSV、发布数据或 CCI 分数；未完成空间 crosswalk、NaturalSystems 重复成因调查、全部字段的缺失值/异常值审计。全量下载与字典取得不能证明八维资料已经齐备。
