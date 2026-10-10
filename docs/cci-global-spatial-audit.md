# CCI 全球候选的空间覆盖核查

核查日：2026-10-10。已执行完整多边形相交计算，不是根据城市名称匹配。目标是核对旧候选框架覆盖新版城市中心的程度；结果不是指标适配完成，也不是 CCI 排名。

## 实查结果

| 项目                                   |   数量 |
| -------------------------------------- | -----: |
| 冻结 GHS-FUA R2019A 功能区             |  9,031 |
| UCDB R2024A V1.2 城市中心              | 11,422 |
| 有正面积交集的功能区—城市中心组合      |  9,743 |
| 完全没有与旧功能区相交的新版中心       |  1,861 |
| 只与一个旧功能区相交的新版中心         |  9,408 |
| 与多个旧功能区相交的新版中心           |    153 |
| 有交集但未被旧功能区完整覆盖的新版中心 |  2,595 |
| 没有与新版中心相交的旧功能区           |  1,156 |

“单个相交”不等于一对一：一个旧功能区可以包含多个新版中心。“没有相交”也不证明城市新建、消失或低分。两套数据的年代、城市定义、人口输入及识别方法不同，原因须另查，不能把 1,861 个中心直接从全球竞争范围中排除。

- [全部交集边及双方面积占比](./data/cci-ucdb-efua-overlaps.csv)
- [全部新版中心的旧框架覆盖状态](./data/cci-ucdb-efua-centre-coverage.csv)
- [全部旧功能区的新中心覆盖状态](./data/cci-ucdb-efua-fua-coverage.csv)
- [输入、脚本与输出校验和及几何修复记录](./data/cci-ucdb-efua-crosswalk.json)

## 计算和修复边界

两份 GeoPackage 的几何元数据均声明 World Mollweide SRS 54009；逐条核对二进制几何的 SRS，直接在相同等面积坐标系求交。依据 [OGC GeoPackage 格式](https://www.geopackage.org/spec/#gpb_format)读取头部，再由 Shapely 解析 WKB。使用 [Shapely STRtree](https://shapely.readthedocs.io/en/2.1.2/strtree.html)查找候选相交几何，随后计算真实交集面积。

未使用名称、最近邻、国家、人口阈值过滤；仅边界相触、交集面积为零的组合不计。覆盖面积使用交集的几何并集，不直接相加，以避免重叠部分重复计算。输出面积单位为平方公里，占比为 0—1；占比保留九位小数仅用于可复算，不表示相同精度的地理测量。

原始文件中 136 个 eFUA、22 个新版中心有环自相交。采用 GEOS `make_valid` 生成计算用几何，只有修复结果仍为有效面、面积变化不超过 0.000001 平方米、外包范围完全相同时才继续。本次全部满足；每条修复保存原始原因、前后面积及派生 WKB 校验和。原始数据不改写。此处理不证明所有边界语义或地面通勤范围正确。

## 这些结果不能支持的推论

城市中心面积占某功能区的 30%，不代表覆盖 30% 人口、医院、冲突事件或供水网络。不能用该面积权重直接分摊人数，也不能把中心的平均温度或医院距离指标当作整个功能区的值。此轮保留全部拆分、合并及未匹配关系，未强行挑选一个“最佳匹配”。

因此，旧 9,031 个功能区不足以自动代表新版城市中心覆盖。下一步需对未覆盖中心和多重匹配建立边界迁移规则，并针对具体原始指标确定适配方法；不混合两种单位组成一个未经审查的榜单。研究工作可以同时保留两个候选框架，但任何正式排名必须明确采用哪个一致的地理单位。

## 复算与验证

这是一项离线地理分析；依赖放在独立虚拟环境，不加入网站依赖或构建流程：

```sh
pnpm exec python3 -m venv /private/tmp/cci-global/geo-venv
pnpm exec /private/tmp/cci-global/geo-venv/bin/python -m pip install -r scripts/cci-geo-requirements.txt
pnpm exec /private/tmp/cci-global/geo-venv/bin/python -B scripts/test_cci_global_crosswalk.py
pnpm exec /private/tmp/cci-global/geo-venv/bin/python -B scripts/cci_global_crosswalk.py \
  --fua /private/tmp/cci-geo/GHS_FUA_UCDB2015_GLOBE_R2019A_54009_1K_V1_0.gpkg \
  --ucdb /private/tmp/cci-global/GHS_UCDB_GLOBE_R2024A.gpkg
```

原始下载地址和校验和见候选与 UCDB 清单；本地缓存路径可通过命令参数替换。生成器先验证两份源文件 SHA-256、唯一 ID、数量与坐标系。四项测试覆盖头部与 SRS、修复记录及面积变化拒绝、一对多和相触区别、并集避免重复覆盖。

本轮未计算八维分数，未声称完成原始指标空间适配或全球 Top 32。
