# CCI 功能区新版入口复核

复核日期：2026-10-12。评分证据截止日仍为 2026-10-10；本次网页与文件下载属于截止日后的版本核查，不是新增城市评分证据。

**行动结论：停止把下载向导的“2020”当作新版全球 FUA 入口。** 官方向导实际仍下载 R2019A / V1.0 的 2015 年估算通勤区；WUP 的约 1,000 个 Functional Areas 是人口投影的大型区域，也不能替代它。继续统一评分的同时，边界工作应转向可核验的居民覆盖与身份映射；无需等待一个目前没有找到的“新版 FUA”。

## 1. “2020 FUA”是相邻条目混读

[官方向导](https://human-settlement.emergency.copernicus.eu/downloadWizard.php)的源 HTML 中，`Epochs: 2020; Formats: CSV; GPKG; Coordinate systems: WGS84` 属于前面的 GHS-OBAT 建筑属性条目；后面的 `data-select="fua"` 条目没有这些规格。[向导配置](https://human-settlement.emergency.copernicus.eu/script/dldWizardCfg.js)的 `fua` 键指定 `epochs: []`，两步直接下载，目标仍是：

[GHS_FUA_UCDB2015_GLOBE_R2019A_54009_1K_V1_0.zip](https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/GHSL/GHS_FUA_UCDB2015_GLOBE_R2019A/V1-0/GHS_FUA_UCDB2015_GLOBE_R2019A_54009_1K_V1_0.zip)

[FUA 产品页](https://human-settlement.emergency.copernicus.eu/ghs_fua.php)仍标为 R2019A，历元 2015、1 km、Mollweide。模型依据出行时间、中心面积、人口及国家人均 GDP 等估算通勤范围，并非全球实测通勤流。页上的 R2024A 更新横幅明确指 UCDB。[JRC 元数据](https://data.jrc.ec.europa.eu/dataset/347f0337-f2da-4592-87b3-e25975ec2c95)的发布日期是 2019-12-03，修改日期是 2025-02-27，时间覆盖仍是 2015 年；引用栏自动显示的年份不能证明新边界发布。

因此，该入口指向[已冻结全集](cci-global-universe-research.md)的同一产品，不构成把 9,031 个候选迁移到 2020 年的依据。这是对所核验入口的结论，并非声称所有机构均无其他研究。

## 2. CRISP 的 Functional Areas 不是功能城市区

[官方 WUP R2025 数据说明](https://human-settlement.emergency.copernicus.eu/documents/GHSL_WUPProjections_R2025.pdf?t=1764689237)第 1.7 节、印刷页 10—11，将这些 FAs 定义为专为模型建立的大型次国家单位，使用 Functional Rural Areas 方法及更宽参数，把全球土地分成约 1,000 个区域。它们用于把国家人口预测先分配到区域，再下推到 1 km 网格。[产品说明页](https://human-settlement.emergency.copernicus.eu/ghs_wup2025.php)亦区分投影区域与最终城市边界。

因此，FAs 不是城市逐一对应的通勤区；不能按名称近似把它们替换成 CCI 候选。WUP 的多期 Urban Centres 可用于更新中心覆盖检查，但迁移为 UC 口径必须对全部候选统一重算，不能只追加旧 FUA 外的新中心。

## 3. OECD 边界是局部核查资源，不是全球替代

[OECD 官方定义页](https://www.oecd.org/en/data/datasets/oecd-definition-of-cities-and-functional-urban-areas.html)将使用人口密度及通勤流的 OECD FUAs 与全球估算 eFUAs 分开；其全球 eFUA 链接仍指向上述 JRC R2019A 数据集。

该页提供可直接核验的[市镇对应 CSV](https://www.oecd.org/content/dam/oecd/en/data/datasets/oecd-definition-of-cities-and-functional-urban-areas/list_of_municipalities_in_FUAs_and_Cities.csv)与[FUA 边界 ZIP](https://www.oecd.org/content/dam/oecd/en/data/datasets/oecd-definition-of-cities-and-functional-urban-areas/fuas%20%281%29.zip)。本次只下载并解析 CSV：34,941 条市镇行、38 个国家代码、1,254 个非空 FUA ID、1,368 个非空 City ID，包含日本、美国及多国欧洲城市，但没有韩国代码。CSV 中的市镇身份映射不证明几何覆盖，也不能排除未覆盖城市。

[OECD LAU–FUA 数据流 v1.1](https://data-explorer.oecd.org/vis?bp=true&df%5Bag%5D=OECD.CFE.EDS&df%5Bds%5D=dsDisseminateFinalDMZ&df%5Bid%5D=DSD_FUA_TERR%40DF_LAU&df%5Bvs%5D=1.1&fc=Measure&fs%5B0%5D=Topic%2C1%7CRegional%252C+rural+and+urban+development%23GEO%23%7CCities+and+functional+urban+areas%23GEO_URB%23&pg=0&snb=28)的公开说明显示 2025-09-22 更新，报告 1,285 个 FUA / 1,402 个城市；这些是该数据流的说明数量，**不是本次下载 CSV 或未下载几何 ZIP 的实查数量**。不同入口的版本与覆盖不能混用，几何文件还须独立冻结、核验历元、国家与唯一 ID 后才可空间比较。

## 4. 下一步对出榜的实际影响

1. **保持已锁定口径并继续评分。** 已有 9,031 个旧功能区不变；按同一八维规则完成案例与全量候选筛查，不能把边界搜索变成等待条件。
2. **优先做居民覆盖核查。** 对已经进入条件评分的旧功能区，计算新版中心中仍位于旧边界之外的居民人口；“有交集”不代表全部居民覆盖。区外部分若可能改变能力判断，保留为未解决竞争者。
3. **用 OECD 作覆盖范围内的对照。** 在文件版本确认后，将其实际通勤单位与旧 eFUA、新中心作几何比较；市镇 ID 可辅助识别边界变更或独立城市，但不能只按同名继承评分。OECD 之外继续保留未解记录。
4. **迁移与评分分开验收。** 若采用统一新版 UC，需全量切换、重新定位服务和事件、重算居民覆盖及敏感性；若保留 FUA，则新增／合并功能区需要真实通勤或明确可复核的同口径估计。两条路径都不能把相交图的复核组直接当成城市。

以上是本次原始证据支持的下一步工作顺序，不是已完成迁移或排除证明；合格第 32 名门槛仍需统一评分与竞争者审查建立。

## 下载字节与复核记录

原始文件保存在 `/private/tmp/`，未加入站点资源；以下 SHA-256 固定本次读取内容。PDF 已检查为有效 PDF 并完成文字提取；CSV 已用标准库 `csv.DictReader` 校验字段、逐行读取并计算唯一 ID，未对图形或其他入口数量作推断。

| 文件                              | SHA-256                                                            |
| --------------------------------- | ------------------------------------------------------------------ |
| `cci-functional-wizard.html`      | `1b029e0453c68e51895b6399537c5faf9bbfdf2df3dc9b40a7f3891f2e9d8881` |
| `cci-functional-wizard-config.js` | `ceaa756dbe75e091aa9b129c7814cc16507cdd25373d615a7644df9db84f4512` |
| `cci-functional-wup-method.pdf`   | `9549a292d8cb706e9f52b909e74af6a64983b7e4249f45a1affeb0bec369d0ae` |
| `cci-functional-oecd-lau.csv`     | `1775a19b343289f37fbf98528228c7a530267c88f289f69ca4c96f08df4c63e5` |

## 2026-10-12 人口覆盖计算与 OECD 下载实况

[全量人口覆盖计算](cci-wup-population-coverage.md)已完成 12,140 个 WUP 2025 中心原生网格核查：4,936 个中心有模型人口落在旧 FUA 全集之外，含 2,280 个无交集中心及 2,656 个部分覆盖中心。另 59 个虽有区外面积却无抽样区外正人口，不能推成无人居住。模型投影、整格分配、未知处理与全量 SHA 单列，不将几何交集当作居民覆盖，也不改变候选单位或评分。

本日继续读取官方定义页所链同一 OECD FUA ZIP；本地 Python 请求及普通浏览器 UA 的 curl 均返回 HTTP 403，没有有效 ZIP；web 读取也未返回可解析的 ZIP 内容。因此仍未核验其几何、版本、范围或人口覆盖，不把访问失败当来源不存在、城市能力差或信息透明度缺陷。已有市镇 CSV 的身份盘点仍有效，不冒充空间对照。
