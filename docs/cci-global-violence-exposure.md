# 全球候选的 UCDP 历史暴力记录

计算日：2026-10-10。来源为 [UCDP GED 26.1](https://ucdp.uu.se/downloads/)，许可证 CC BY 4.0。年度版覆盖至 2025 年；本次统一选择 2021—2025 年窗口，不声称覆盖 2026 年实时情况。

这是 GSS `organized_violence` 的部分原始证据，不是 GSS 分数、治安排名或未来冲突概率。使用原始事件而非 UCDB 中存在单位歧义的死亡数字段。

## 已执行的全候选计算

冻结 ZIP 校验后读取全部 417,968 条事件，检查唯一 ID；窗口内 121,587 条。全部 9,031 个 eFUA 均保留一行结果，未按原 32 城名单筛选。

| 处理结果                       |  事件数 |
| ------------------------------ | ------: |
| 唯一归属且通过输入检查         |  33,099 |
| 定位精度不足，未归属城市       |  65,349 |
| 编码地点在候选功能区之外       |  23,114 |
| 可定位但死亡上下界不一致，隔离 |      25 |
| 合计                           | 121,587 |

993 个功能区有本次可归属记录。其他功能区的零只表示在这套来源、窗口和处理条件下没有记录，不能解释为没有暴力、没有遗漏事件或安全性高。未归属记录可能影响候选；不能按已有精确记录排除其他城市。

- [全候选按年事件数、事件类型和原始死亡估计汇总](./data/cci-ucdp-2021-2025-efua.csv)
- [事件 ID 到功能区的归属记录](./data/cci-ucdp-2021-2025-assignments.csv)
- [未归属事件 ID 与原因](./data/cci-ucdp-2021-2025-unassigned.csv)
- [版本、输入输出校验和、运行环境及统计](./data/cci-ucdp-2021-2025.json)

## 归属与限制

依据[官方代码簿](https://ucdp.uu.se/downloads/ged/ged261.pdf)，仅采用 `where_prec=1` 的编码地点；这种地点仍可能是聚落中心，不是现场 GPS。其余精度不按代表点直接归城。事件日期须完全落在窗口内；坐标由经纬度转换到功能区使用的 Mollweide，只有唯一多边形覆盖时才归属。

死亡估计分别保留 `low/best/high`；不符合 `0 ≤ low ≤ best ≤ high` 或三者全零的可归属事件进入隔离表，不交换上下界、不自行补值。空间与数据异常都不转化为城市低分。事件的来源收录门槛、报道偏差与不确定性仍然存在。

功能区几何处理复用[空间核查](./cci-global-spatial-audit.md)的修复规则与固定源版本。本次没有用 2015 人口除以 2021—2025 事件生成伪装成同期的居民发生率，也没有把历史城内事件量代替区域战争外溢或战略暴露。

## 复算

使用既有隔离环境，按 `scripts/cci-geo-requirements.txt` 安装依赖后执行：

```sh
pnpm exec /private/tmp/cci-global/geo-venv/bin/python -B scripts/test_cci_ucdp_exposure.py
pnpm exec /private/tmp/cci-global/geo-venv/bin/python -B scripts/cci_ucdp_exposure.py \
  --ged /private/tmp/cci-global/ged261-csv.zip \
  --fua /private/tmp/cci-geo/GHS_FUA_UCDB2015_GLOBE_R2019A_54009_1K_V1_0.gpkg
```

官方原 ZIP 下载地址及 SHA-256 在计算清单中；源文件保留于缓存，不将报道全文复制进仓库。四项测试检查模糊边界、空间精度、日期窗口、坐标投影、无效坐标和死亡上下界异常。

引用：Sundberg & Melander (2013), _Introducing the UCDP Georeferenced Event Dataset_；Högbladh (2026), _UCDP GED Codebook version 26.1_；Davies, Pettersson & Öberg (2026), _Organized violence 1989–2025, and violent political protests_。
