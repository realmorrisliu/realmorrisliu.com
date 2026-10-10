# CCI 医疗栅格：全候选空间覆盖

核验日期：2026-10-10。使用上一轮固定的 MAP 2019 医疗旅行时间栅格，以及冻结的 9,031 个 R2019A eFUA。每个候选均保留一行，未按人口、国家、城市名称或旧名单筛选。

## 本轮结果

- **9,030 个候选至少存在有效像元**；这不表示完整覆盖。
- **1 个候选没有有效像元：Malé（马累，eFUA 110）**，选中的 8 个像元全部为 NoData。没有填零，也没有把它解释成医疗差。
- **1,189 个候选含至少一个缺失像元**，包括上述马累。海岸、水面和像元分辨率会影响这一计数，尚不能解释为缺少医疗证据的居民比例。
- **134 个候选含步行估计快于机动交通超过 1 分钟的像元**，共选中 691 个此类像元。Comilla、Ciudad Juárez、Lomé、Jerusalem、Tijuana 等均在其中。这是空间定位结果，尚未证明模式差异的原因，也不能按像元数量推导受影响居民人数。

全部逐候选记录见[覆盖 CSV](data/cci-healthcare-efua-coverage.csv)，来源、输出哈希、软件版本及几何修复记录见[复算清单](data/cci-healthcare-efua-coverage.json)。没有把其转成 MED 得分。

## 边界与统计规则

沿用已核验的 Mollweide eFUA 几何读取与修复规则，原文件不变。先将边界线段细分至不超过 1,000 米，再以明确经纬顺序投影至 EPSG:4326。按像元中心是否在功能区内选择栅格；不是所有接触边界的像元，也不是面积占比分摊。跨越 180° 的异常包围框或投影后无效几何单列为待审查，禁止生成跨全球多边形；本次没有触发该状态。

记录同时保留：两图均有效、仅一图有效、两图均无效和选中像元总数。实际数据两图掩膜一致，但脚本不依赖这一巧合。所有 9,031 行的像元分区等式及唯一 ID 均已核验；没有省略全缺失的候选。

每个候选独立汇总，不能把候选计数之和当作全球唯一像元总量；边界可能相邻或存在重叠。像元中心规则对小岛、细窄区域及城市边缘可能不稳定，进入居民加权或评分前需要边界敏感性检查。

## 复算

```sh
pnpm exec /private/tmp/cci-global/geo-venv/bin/python -B scripts/cci_healthcare_fua_coverage.py \
  --fua /private/tmp/cci-geo/GHS_FUA_UCDB2015_GLOBE_R2019A_54009_1K_V1_0.gpkg \
  --motorized /private/tmp/cci-global/2020_motorized_travel_time_to_healthcare.geotiff \
  --walking /private/tmp/cci-global/2020_walking_only_travel_time_to_healthcare.geotiff
pnpm exec /private/tmp/cci-global/geo-venv/bin/python -B -m unittest discover -s scripts -p 'test_cci_*.py'
```

19 项离线测试通过。新增测试核查了界外像元不入统计、NoData 单列、完全/部分超出栅格和小多边形无像元中心的情形。

## 人口权重的下一步

原计划参考医院论文使用 GHS-POP R2023A 的 2025 层，已下载但未用于计算。进一步核验发现，JRC 已发布 [GHS-WUP-POP R2025A](https://data.jrc.ec.europa.eu/dataset/adba95af-db56-4569-acd3-9513201eba30)，采用 CRISP 与 UN WPP 2024 的人口投影；[官方技术报告](https://publications.jrc.ec.europa.eu/repository/handle/JRC144209)还说明部分国家的历史分布得到修正。因此下一步优先核验新版的 2025 层，不将旧版默认为当前最佳人口估计。

2025 层是模型投影，不是当年完整人口普查。即使成功加权，也只能描述“2025 年投影人口在 2019 年医疗旅行时间表面上的分布”，不能更新医院观察期。人口网格的原点、分辨率、缺失值、像元单位和边界人口分配须在汇总前验证，不能用最近邻重投影人口数量后假定总人口守恒。

本轮尚未计算居民覆盖率、完成模式差异归因或发布排名。全候选有记录不等于全候选八维证据已经齐备。
