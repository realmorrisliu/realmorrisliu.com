# 全球医院交通可达性论文：CCI MED 证据审查

审查日期：2026-10-10（Asia/Shanghai）。对象为 Johan Emilsson 的预印本 [Global maps of travel time to emergency and tertiary hospitals](https://arxiv.org/abs/2609.12696)，2026-09-11 提交的 v1；已读[全文](https://arxiv.org/html/2609.12696v1)及作者仓库相关分析代码、数据清单和许可。仓库固定于 [`6ec405f150929810a72591deb92d78b3ac5cb315`](https://github.com/emailsson/global-hospital-travel-time/tree/6ec405f150929810a72591deb92d78b3ac5cb315)（2026-09-10）。本轮没有运行全球路由流水线，也没有计算 32 个 FUA 的覆盖率。

## 对 CCI 的结论

可以将论文作为 MED `access` 的**模型化空间可达性补充证据**，用于发现潜在覆盖缺口和设计敏感性分析；目前不能直接转换为城市得分。论文的国家汇总不是 FUA 统计，自由流驾车覆盖也不是居民实际获得医疗服务的比例。

不能把作者的 `preferred` 层当作已验证的 `specialist_capacity`：其判定依赖 OSM 急诊标签与直升机坪或大学医院名称，未核验临床分类真实性。它最多提供待核对的医院候选清单，不证明创伤中心、卒中取栓、心脏介入、ICU、专科人员或全天候服务能力。论文亦未提供支持 `routine_quality`、`system_continuity`、可负担性或等待时间的直接测量。上述边界来自[全文的方法与局限章节](https://arxiv.org/html/2609.12696v1)，并与仓库的预计算标记处理方式一致。

## 分层规则与测量对象

| 层级        | 作者实际规则                                                                                             | 可支持与不可支持的解释                                             |
| ----------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `all`       | 2026-08-10 OSM planet 中的 `amenity=hospital` 节点或闭合 way；多边形取质心，共 217,841 条记录            | 登记为医院的地点覆盖；不是官方完整医院名录，各地医院标注标准不一致 |
| `emergency` | 上述记录含 `emergency=yes`，25,422 条                                                                    | 有该标签的医院覆盖；没有标签不能判定没有急诊                       |
| `preferred` | `emergency=yes` 且有场内直升机坪/相关航空设施，或名称等字段匹配约 50 种语言的大学/教学医院词根；6,715 条 | 启发式高等级医院代理，不能视为临床能力认证                         |
| `helipad`   | 不要求急诊标签的直升机坪医院，8,287 个不同 `osm_id`                                                      | 独立敏感性层，不是 `emergency` 的子集，也不等同 `preferred`        |

来源：[论文 Methods](https://arxiv.org/html/2609.12696v1)、[设施导出与清单](https://github.com/emailsson/global-hospital-travel-time/tree/6ec405f150929810a72591deb92d78b3ac5cb315/data/medical-proximity-export)、[直升机坪层代码](https://github.com/emailsson/global-hospital-travel-time/blob/6ec405f150929810a72591deb92d78b3ac5cb315/analysis/04_helipad_tier.py)。OSM 的 [emergency 标签说明](https://wiki.openstreetmap.org/wiki/Key:emergency)也不是专科资质认证。

作者报告已用影像审阅 [MapRoulette challenge 227](https://maproulette.org/browse/challenges/227) 的 22,502 项任务，补充直升机坪标记；这只能支持特定设施标记的检查，不能验证临床服务。该页面本次仅返回 JavaScript 页面壳，未独立核验任务历史、数量和完成情况。大学名称词根表及生成原始分类的代码未随本次仓库提供。

记录数还需要注意：本次复算得到 216,889 个不同 `osm_id`，不能把 217,841 行直接称为同等数量的独立医院。原始 flags 有 172 行未满足逐行 `preferred = emergency AND (helipad OR university)`，全部属于重复 ID；按作者代码对同一 ID 的各标记取 OR 后，公式不一致数为零。因此这里不是已确认的分类错误，但逐行数据与设施级统计不可混用，且 ID 去重仍不等于实体医院去重。[对应代码](https://github.com/emailsson/global-hospital-travel-time/blob/6ec405f150929810a72591deb92d78b3ac5cb315/analysis/04_helipad_tier.py)

## 路由、验证与偏差

作者以 osm2po 汽车路网及道路等级默认速度、可用的 `maxspeed` 标签生成 15/30/60 分钟范围，用凹包络连接可达顶点，再与 GHS-POP R2023A 的 2025 年、30 arcsec（约 1 km）人口栅格叠加；国家边界采用 Natural Earth admin-0。以下限制直接影响城市间可比性。[论文 Methods / Limitations](https://arxiv.org/html/2609.12696v1)，[栅格叠加代码](https://github.com/emailsson/global-hospital-travel-time/blob/6ec405f150929810a72591deb92d78b3ac5cb315/analysis/01_prepare.py)

- 路由方向是医院向外，不是居民前往医院；单行道路下两者可能不同。医院吸附到最近路网顶点没有距离上限。
- 自由流模型没有拥堵、边境等待、车辆可得性、道路状况或医疗准入限制；排除渡轮、service roads 等道路类别。世界范围先溶解服务区，可能把跨境医院算入覆盖，香港—深圳等情境需要另行判断。
- 主模型凹包络参数 0.85，可能填入实际不可达空间；约 50 m 简化及人口栅格分辨率也不支持街区级精确解释。1,194 所医院没有 60 分钟多边形。
- OSM 标记缺失可能低估急诊覆盖，乐观车速和包络可能高估覆盖，合并后方向不确定。即使作者使用“下界”表述，也不宜将公布比例当作真实可达性的严格下界。
- 各地标签完整度不同。仓库国家表中中国急诊标签约占 6.7%、日本约 3.1%、印度约 2.5%；这是标记覆盖差异，不能推导这些地方真实急诊供给稀缺，更不能直接赋予相应城市。

验证主要是面积/质心偏移诊断、不同包络参数及约 2% 医院样本的 1.5 km 路网缓冲对照。还与 Weiss 等人的 2020 年可达性模型比较，但医院/诊所口径、数据年份和算法不同。没有真实行程时间验证、官方临床能力名录验证或拥堵速度敏感性验证。[诊断代码](https://github.com/emailsson/global-hospital-travel-time/blob/6ec405f150929810a72591deb92d78b3ac5cb315/analysis/05_diagnostics.py)、[样本敏感性代码](https://github.com/emailsson/global-hospital-travel-time/blob/6ec405f150929810a72591deb92d78b3ac5cb315/analysis/07_sens_sample.py)、[分层敏感性代码](https://github.com/emailsson/global-hospital-travel-time/blob/6ec405f150929810a72591deb92d78b3ac5cb315/analysis/08_sens_scope.py)

本次由作者汇总 CSV 复算全球 60 分钟覆盖：`all` 96.1860%、`emergency` 78.5452%、`preferred` 40.3019%、`helipad` 40.3081%。最后两者都四舍五入为 40.3%，但不是同一设施集合，也不是临床分类准确性的验证。这是对发布表格的内部一致性检查，非独立验证。[发布结果目录](https://github.com/emailsson/global-hospital-travel-time/tree/6ec405f150929810a72591deb92d78b3ac5cb315/derived)

## 实际可获取资产与复算边界

| 资产                                                                                 | 本次访问结果                                                                                           | 用途与限制                                                                 |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `facilities.ndjson.gz`、`facility_flags.csv`、`manifest.json`                        | 已从 git 获取并读取；manifest 生成于 2026-09-04                                                        | 设施位置、预计算标签和计数；不是原始 OSM 属性或分类器                      |
| `derived/unions.gpkg`                                                                | 已获取，53,006,336 字节；EPSG:4326                                                                     | 9 个累计服务区、9 个环带、3 个直升机坪层；可用于后续人口/FUA 叠加          |
| 国家/全球覆盖、marker split、敏感性 CSV                                              | 已获取并读取                                                                                           | 可审计作者汇总；没有现成的 CCI FUA 结果                                    |
| `coarse_pop*.tif`                                                                    | git 中提供                                                                                             | 0.25° 展示栅格，赤道附近约 28 km，不能当作城市精细指标                     |
| `coverage.ndjson.gz`、`coverage_sens-20260909.ndjson.gz`、`medical_coverage.pmtiles` | README 声称为约 97 MB、747 MB、305 MB 的 release 资产，但不在 git；本次 GitHub releases API 返回空数组 | 尚未取得逐医院服务区、完整敏感性几何或 PMTiles；不能宣称完整流水线已可复现 |

来源：[README](https://github.com/emailsson/global-hospital-travel-time/blob/6ec405f150929810a72591deb92d78b3ac5cb315/README.md)、[data 目录](https://github.com/emailsson/global-hospital-travel-time/tree/6ec405f150929810a72591deb92d78b3ac5cb315/data/medical-proximity-export)、[derived 目录](https://github.com/emailsson/global-hospital-travel-time/tree/6ec405f150929810a72591deb92d78b3ac5cb315/derived)、[releases API](https://api.github.com/repos/emailsson/global-hospital-travel-time/releases)（2026-10-10 查询）。README 提到 Zenodo，但未给出具体归档记录链接；本次未验证独立归档资产。

`unions.gpkg` 的 SHA-256 为 `9a5108f86f80059122d94c121ddfebe2a6a9c6fab0746277ca0dbbb56ad52b55`。因此应区分“git 中已有可分析几何”与“承诺的发布资产尚不可获取”，不能笼统称数据未开放。与此同时，仓库从既有 flags 和服务区开始分析，未提供 OSM 提取、名称匹配及路由生产代码；`paper/build.R` 从预计算表格生成论文不是端到端复现。[构建代码](https://github.com/emailsson/global-hospital-travel-time/blob/6ec405f150929810a72591deb92d78b3ac5cb315/paper/build.R)

## 许可证

- 分析代码：实际 [LICENSE](https://github.com/emailsson/global-hospital-travel-time/blob/6ec405f150929810a72591deb92d78b3ac5cb315/LICENSE) 为 MIT。
- 数据、派生结果及发布资产：[DATA_LICENSE](https://github.com/emailsson/global-hospital-travel-time/blob/6ec405f150929810a72591deb92d78b3ac5cb315/DATA_LICENSE) 指定 ODbL 1.0，源于 OpenStreetMap；不能随代码一并视为 MIT。再分发数据库应保留署名并按 [ODbL](https://opendatacommons.org/licenses/odbl/1-0/) 核对适用要求。
- 论文：[arXiv 全文](https://arxiv.org/html/2609.12696v1)显示 CC BY 4.0。
- 上游人口数据：作者 DATA_LICENSE 标注 EC JRC GHS-POP 为 CC BY 4.0；实际采用时仍需保存具体版本、来源和署名。Natural Earth 官方说明其数据为[公有领域](https://www.naturalearthdata.com/about/terms-of-use/)。下载脚本中存在随时间更新的外部入口，不能仅凭脚本存在声称输入全部固定。[下载脚本](https://github.com/emailsson/global-hospital-travel-time/blob/6ec405f150929810a72591deb92d78b3ac5cb315/external/download.sh)

## 下一步可采用的证据

1. 保留论文作为 `access` 的研究背景，并把已有累计服务区作为实验输入。需要固定 FUA 边界、人口版本、栅格方法和边界误差；居民分母来自 FUA，但潜在可服务医院可在 FUA 外，跨境情况需另设准入场景。
2. 先抽查各城市官方医院/急诊名录及位置，再评估标签遗漏。不得把缺失 `emergency=yes` 作为负面医疗证据。采用入院方向、现实交通时间后，才讨论覆盖结果的解释范围。
3. `specialist_capacity` 另取官方专科资质、服务清单、人员/床位及开放时段证据。直升机坪、大学名称或 `preferred` 覆盖只作寻找候选医院的线索，不参与临床能力计分。
4. 本轮不改 MED 模型、城市判断或排序；未完成的本地验证与 FUA 计算保持为明确缺口。
