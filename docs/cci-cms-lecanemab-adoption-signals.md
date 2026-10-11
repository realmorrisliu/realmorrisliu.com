# 统一理赔检验：登记地址信号不自动成为城市得分

查阅及定位：2026-10-12；评分证据截止仍为 2026-10-10。沿用[当地普通居民口径](cci-local-2026-scoring-calibration.md)，本轮将[华盛顿 LON 实际采用检验](cci-local-2026-washington-case.md)使用的同一份全国理赔推广到全量候选。**新增的是可核验的跨候选研究信号，不是 62 城 LON 60 或入围名单。** 七个既有案例的判断保持不变，全部 9,031 个候选保留。

## 原始范围及统一定位

[CMS 2024 提供者／服务数据](https://catalog.data.gov/dataset/medicare-physician-other-practitioners-by-provider-and-service-2024-12-01)以静态年份 API 统一筛选 `J0174`，全国公开结果 254 条，分页结束已核验；[原始理赔 CSV](data/cci-cms-2024-lecanemab-claims.csv)保留全部字段及记录。该代码为 1 毫克 lecanemab-irmb 计费单位；原值可为小数，不能取整、改为输液次数或患者人数。每行受益人只在 NPI／代码／服务类别内去重，不能跨提供者相加为全国或城市去重人数。

[CMS 随数据附带的方法](https://data.cms.gov/sites/default/files/2025-04/MUP_PHY_RY25_202350312_Methodology_508.pdf)限定 Medicare Part B FFS 非机构理赔，删除涉及十位或更少受益人的汇总记录；不包括 Medicare Advantage、私保／无保险及医院设施账单，也不提供治疗效果或患者住所。按方法规则，2024 服务对应的 NPPES 登记地址来自 2025 年末，不能当作当年治疗地点。目录修改日期不是确切首次公开日，原始来源范围和时间限制见[清单](data/cci-cms-2024-lecanemab-source.json)。

[Census 2026-02 API 文档](https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.pdf)规定五列批量地址及 benchmark；本轮一次提交全部 254 个公开专业登记地址，使用当前 benchmark 4，分别保留[提交文件](data/cci-cms-lecanemab-addresses.csv)、[原始响应](data/cci-cms-lecanemab-geocodes.csv)与[来源哈希](data/cci-cms-lecanemab-geocoding-source.json)。只提交来源 Street 1、城市、州及 ZIP；Street 1 内已有套房信息保留，独立 Street 2 未加入定位请求、仍保留在底表。没有人工修地址、挑医院、补坐标、按城市名字或找最近城市。

返回记录必须恰好包含全部来源 NPI，逐行核对提交地址回显；缺失、重复或未知 ID、变更地址、异常响应形状和无效坐标均报错。236 条为 Match，其中 205 条 Exact、31 条 Non_Exact；另有 16 条 No_Match、2 条 Tie。**Exact 只是地址范围匹配，不是建筑、套房、历史诊所或治疗现场已验证。** 当前定位结果是对历史地址的地理辅助，不冒充截止日前临床观测。

用既有几何读取、原包哈希和同一投影将返回点与冻结 GHS-FUA 相交。只有 Exact、唯一功能区且归属美国的点计入登记信号；非精确、无匹配、多解、多区、国别边界冲突及界外全部保留，不随意挑解。当前结果：

| 提供者 NPI 记录状态      | 数量 | 含义                                                   |
| ------------------------ | ---: | ------------------------------------------------------ |
| 精确、唯一落入美国功能区 |  190 | 关联到 62 个功能区；是登记地址及历史实际理赔的组合信号 |
| 精确但落在冻结功能区外   |   15 | 不分给最近城市，不表示居民无法使用                     |
| 非精确地址匹配           |   31 | 返回点及可能功能区供复核，不计入精确信号               |
| 未匹配                   |   16 | 不靠名称／ZIP 中心点替代，不表示服务不存在             |
| 多解                     |    2 | 不挑第一个解，不删掉提供者                             |

全部 254 条 NPI 记录保留；它们不是 254 个独立机构或诊所。结果见[逐提供者关联](data/cci-cms-lecanemab-provider-fua.csv)、[全部 9,031 个候选覆盖表](data/cci-cms-lecanemab-efua-coverage.csv)与[复算审计](data/cci-cms-lecanemab-fua-audit.json)。候选计数分开保存：62 个有精确登记信号；198 个美国候选无此信号；8,771 个非美国候选不在该医保数据的适用范围。后两类都不是没有长寿治疗、低分或排除依据；不把美国医保制度投射到别国。

## 从信号进入评分的要求

这组关联只推进 LON 的有限转化研究线索。仍须按共同规则核对可信人体结果、适应症及风险、实际当地交付、适当监测和 2026 延续，以及目标居民资格、转诊、等候、覆盖、费用和功能区触达。理赔提供者地址落点本身不满足这些条件，更不证明健康人寿命延长。华盛顿已将诊所开业、转诊／保险和带日期的交付说明交叉核对，给出可撤回的条件性判断；该判断不能复制到其余 61 城。

下一未审候选仍按既有全量机构关联顺序确定，而不是按医保记录数量选名额：排除已审七案例后，纽约 eFUA 7244 的目录关联为 2,730，随后巴黎为 2,724。纽约在本次表中有 28 条精确信号和 2 条待复核地址记录，说明有实际采用链可继续核验，**不说明其得分高于巴黎或无理赔记录的城市**。目录数量也只安排研究，不直接计分。更低目录数量或无该医保数据的候选继续保留，仍须处理可能改变第 32 名结论的竞争者。

统一矩阵的 LON 对上述 62 个候选记 `partial_claims_registered_address_signal`，其他 8,969 个保持未组装并另列医保范围／无信号状态。无分数、无缺失填零、无新的总分中心或排除界限；五份完整条件中心、两份部分案例及零排除保持。

## 复算及验证

```sh
pnpm exec /private/tmp/cci-global/geo-venv/bin/python -B scripts/cci_cms_lecanemab_fua.py \
  --fua /private/tmp/cci-geo/GHS_FUA_UCDB2015_GLOBE_R2019A_54009_1K_V1_0.gpkg
pnpm exec /private/tmp/cci-global/geo-venv/bin/python -B -m unittest discover \
  -s scripts -p test_cci_cms_lecanemab_fua.py
pnpm exec python3 -B scripts/cci_global_evidence_matrix.py
pnpm exec python3 -B scripts/cci_local_rank_audit.py
```

脚本仅使用已安装的地理运行时及既有读取、哈希和 CSV 工具，不增加依赖。源文件、原始请求／响应、冻结候选、几何包、脚本及导出均有校验。测试覆盖全集保留、来源回显、缺失／重复 ID、未知／畸形响应、非有限坐标、边界多解、非精确匹配、国别冲突、计费单位小数和错误药品／医保范围拒绝。统一矩阵另验证候选 ID 全集、非负计数、国别和范围状态一致，信号不变成分数或排除。
