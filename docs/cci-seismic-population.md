# CCI 全候选地震危险图人口汇总

2026-10-10。将已核验的 GEM 2023.1 参考岩石 PGA 与 GHS-WUP R2025A 的 2025 年投影人口关联到全部 9,031 个冻结 eFUA。原始危险图来源、版本、单位与 CC BY-NC-SA 4.0 许可见[来源清单](data/cci-seismic-source.json)，人口来源及 CC BY 4.0 许可见[人口清单](data/cci-healthcare-population-source.json)。派生数据保留 GEM 的署名、非商业与相同方式共享要求，不将其重标为无限制数据。

## 方法与结果

人口采用原生网格，以像元中心落入功能区为准，不重采样人口数量。边界在 Mollweide 坐标下每 1,000m 加密后转换至 EPSG:4326。以危险图真实仿射变换最近邻采样到人口网格，保留掩膜并排除非有限或负 PGA；原始零值单列所对应人口，不解释为绝对安全。

- **9,023 个功能区**有已知人口落在有效危险图值上；这只是 `geophysical` 的部分危险度证据。
- **7 个功能区**有已知人口但危险图全部缺测：Mindelo、Malé、Port Louis、Le Port、Le Tampon、Saint-Denis、Saint-André。均值留空，没有填零。
- **1 个功能区** Kogimage（7222）选中人口为零；人口份额和均值留空，不声称该地没有居民。
- **175 个功能区**有已知人口落在危险图缺失位置，包含上述 7 个。均值仅对有危险图覆盖的已知人口计算，不冒充全体居民均值。

输出[逐功能区 CSV](data/cci-seismic-efua-population.csv)保留已知人口、有模型人口、缺测人口、覆盖份额、条件 PGA 均值及原始零值对应人口。[计算清单](data/cci-seismic-efua-population.json)固定源文件、代码和结果哈希以及空间方法。这份数据已接入[八维覆盖矩阵](cci-global-evidence-matrix.md)，不新增任何完整 CCI 分数。

PGA 是参考岩石条件下、50 年内超越概率 10% 的危险度，不是年度实际受灾人口。其人口加权均值仅描述居民空间分布对应的模型强度，不能单独解释为损失期望；没有加入局地土壤、建筑脆弱性、海啸、滑坡或应急恢复。粗危险网格、人口投影及整像元归属会影响海岸与小岛；未知人口像元数另列，不假定为零居民。

## 复算与验证

原始文件留在临时目录；长期复算按上述来源清单下载并验哈希。GEM TIFF 从已验证 ZIP 的 `v2023_1_pga_475_rock_3min.tif` 成员解出，脚本再次检查该成员 SHA-256。

```sh
pnpm exec /private/tmp/cci-global/geo-venv/bin/python -B scripts/cci_seismic_population.py --fua /private/tmp/cci-geo/GHS_FUA_UCDB2015_GLOBE_R2019A_54009_1K_V1_0.gpkg --population /private/tmp/cci-global/GHS_WUP_POP_E2025_GLOBE_R2025A_4326_30ss_V1_0.tif --hazard /private/tmp/cci-global/v2023_1_pga_475_rock_3min.tif
pnpm exec python3 -B scripts/cci_global_evidence_matrix.py
```

检查全部 9,031 个唯一 ID；有模型人口与缺测人口之和等于已知人口，条件均值不超出源值范围，零分母或全缺测时留空。测试覆盖未遮罩 NaN、未知人口、零值、全缺失、实际 GDAL 重投影中的 NaN 保留，以及部分地震证据不升级为完整维度分数。34 项离线测试通过，不表示八维全球排名已经成立。
