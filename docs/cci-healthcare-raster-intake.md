# CCI 医疗旅行时间栅格接入审查

核验日期：2026-10-10。本轮已从 MAP 官方入口下载并扫描两个完整 GeoTIFF，产物是可复算的输入检查，不是医疗分数或居民覆盖率。

## 来源与时点

[MAP 数据页面](https://malariaatlas.org/project-resources/accessibility-to-healthcare/)提供步行和机动交通下载入口。[来源清单](data/cci-healthcare-map-sources.json)保存实际 ZIP 的地址、大小与 SHA-256，以及官方 WCS 的图层 ID、时间关键词和单位。ZIP 各含一个 GeoTIFF，已完整解压并通过 ZIP CRC 检查；大文件仅缓存于 `/private/tmp/cci-global/`，未提交进仓库。

2020 是论文/地图发布年份，WCS 标注的观察期为 **2019**，设施位置在 2019 年中采集。图层是到最近医院或诊所的模型化最短旅行分钟数；不是实际就诊行程，更不反映 2026 年医院增减、拥堵、资格、费用或临床服务水平。[发布方数据目录](https://developers.google.com/earth-engine/datasets/catalog/projects_malariaatlasproject_assets_accessibility_accessibility_to_healthcare_2019)

MAP 的[地图开放政策](https://malariaatlas.org/open-access-policy/)标注 CC BY 3.0；Earth Engine 的具体数据目录标注 CC BY 4.0。本轮保留两处原始许可说明与论文署名，不擅自把取得的 ZIP 改标为别的许可。

## 实际全量检查

两图网格完全相同：EPSG:4326，43,200 × 17,400，30 角秒，覆盖西经 180° 至东经 180°、南纬 60° 至北纬 85°。文件存储为 Float32，NoData 为 `-9999`。GeoTIFF 单位字段为空，分钟单位来自官方元数据。

| 项目                  |       机动交通 |        步行 |
| --------------------- | -------------: | ----------: |
| 总像元                |    751,680,000 | 751,680,000 |
| NoData 像元           |    530,365,561 | 530,365,561 |
| 有效非负像元          |    221,314,439 | 221,314,439 |
| 有效零值像元          |        373,306 |     373,306 |
| 未掩膜负值 / 非有限值 |          0 / 0 |       0 / 0 |
| 最大分钟值            | 41,504.0859375 |     138,893 |

两图有效掩膜一致。但步行值小于机动交通值的像元有 **2,132,842** 个；差超过 1 分钟的有 **181,576** 个，超过 60 分钟的有 **3,789** 个。因此差异并非全部可由微小舍入解释。本轮没有定位这些像元到候选城市，也未核实其原因，不能将它们直接判成原始数据错误、强行修正为零差值，或据此推算居民选择交通工具的收益。

完整结果与 TIFF 校验和见[扫描输出](data/cci-healthcare-raster-audit.json)。像元数包含无人口区域，NoData 也包含海洋等区域，不能把有效像元占比称为人口覆盖率。经纬度网格的像元面积随纬度变化，像元均值也不是面积或人口加权均值。

## 复算与验证

沿用离线地理环境，新增 `rasterio==1.5.2`，不改变网站依赖。按行窗口扫描，不把两个全球数组一次装入内存；不同投影、网格或尺寸直接拒绝，不隐式重采样。

```sh
pnpm exec /private/tmp/cci-global/geo-venv/bin/python -B scripts/cci_healthcare_raster_audit.py \
  --motorized /private/tmp/cci-global/2020_motorized_travel_time_to_healthcare.geotiff \
  --walking /private/tmp/cci-global/2020_walking_only_travel_time_to_healthcare.geotiff
pnpm exec /private/tmp/cci-global/geo-venv/bin/python -B -m unittest discover -s scripts -p 'test_cci_*.py'
```

17 项离线测试通过，包含新增的缺失/零值区分、不同有效掩膜、网格错位拒绝及真实小 GeoTIFF 的 NoData 读取。测试通过仅说明扫描逻辑符合这些约束，不证明医学效度。

## 下一步边界

输入已可读取且已固定版本，下一步可对完整候选边界检查有效像元覆盖，并定位模式差异。人口加权需要独立固定人口栅格、时点、对齐与边缘像元规则；采用较新人口只能称为“较新人口分布下的 2019 可达性模型”，不能升级设施观察年份。FUA 外医院也可能服务 FUA 内居民，不应在汇总时按医院行政归属截断已有旅行时间表面。

后续已完成[全部 9,031 个候选的像元覆盖检查](cci-healthcare-fua-coverage.md)，保留全缺失候选并定位模式差异。尚未完成人口加权、模式差异归因或 2026 更新，未改变 MED、CCI 分数或线上版本。
