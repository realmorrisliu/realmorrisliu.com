# CCI 制度韧性补证：WGI 国家背景

核验日期：2026-10-10。已下载世界银行 WGI **2026 Update** 官方工作簿，提取其 **2025 观察年**的综合指标及误差。所有候选均保留；国家指标只通过引用关联，未复制成城市实测或 ISR 分数。

## 实际文件与覆盖

下载地址来自 [WGI 首页](https://www.worldbank.org/en/publication/worldwide-governance-indicators)的 Excel 按钮；[官方工作簿](https://www.worldbank.org/content/dam/sites/govindicators/doc/wgidataset_with_sourcedata-2026.xlsx)与[复算清单](data/cci-wgi-context.json)记录版本、校验和及导出字段。不能把发布年份 2026 写成观察年份。

| WGI 维度                        | 2025 年经济体记录数 |
| ------------------------------- | ------------------: |
| Voice and Accountability (`va`) |                 208 |
| Political Stability (`pv`)      |                 215 |
| Government Effectiveness (`ge`) |                 213 |
| Regulatory Quality (`rq`)       |                 213 |
| Rule of Law (`rl`)              |                 215 |
| Control of Corruption (`cc`)    |                 215 |

共 1,279 条经济体—维度记录，保留原始估计、估计标准误及 90% 区间、0–100 分数、分数标准误及 90% 区间、来源数量。[国家综合指标 CSV](data/cci-wgi-2025-country-aggregates.csv)与[9,031 个候选的引用表](data/cci-wgi-efua-context.csv)分开存储：后者没有城市治理分数。

候选关联结果：9,019 个有全部六项国家背景，5 个有五项，1 个有四项，6 个无对应记录。

- R2019A 的 `XKO` 与 WGI 的 `XKX` 均由原数据名称确认是 Kosovo，采用显式代码别名。没有按城市名模糊匹配。
- `MTQ` 的 Fort-de-France 和 `REU` 的四个候选缺 `va`；`NCL` 的 Nouméa 缺 `ge`、`rq`。
- `CUW`、`ESH`、`GLP`、`MYT`、`XNC` 下共六个候选没有对应背景记录。保留空引用，不套用其他司法辖区，也不填零。`XNC` 在冻结 FUA 原表中名称为 NorthernCyprus，不能仅因 Nicosia 名称重合而自动关联 `CYP`。

这些是来源代码与数据覆盖的处理，不改变城市边界或政治归属声明。

## 如何支持 CCI

WGI 是基于调查与专家感知的国家治理研究产品，[官方方法](https://www.worldbank.org/en/publication/worldwide-governance-indicators/documentation)提供估计及其不确定性。因此它可以支持 `governance` 的共同国家背景，但不能单独区分上海与杭州等同国内城市，也不完整测量城市适应能力、社会凝聚力或应急恢复。

没有将六项 WGI 取平均当作 ISR，没有将其 0–100 刻度当作 CCI 的同尺度分值。政治稳定与 CCI GSS、其他公共服务来源与 MED 可能存在概念或上游来源重叠，映射入模型前必须处理重复计权。WGI 置信区间不是 CCI 研究判断的置信区间，也不能用于排除全球其他候选。

WGI 官方工作簿还附带第三方来源的标准化均值。[使用说明](https://www.worldbank.org/en/publication/worldwide-governance-indicators/usage-advisory)对其中五个商业来源值限制再分发，因此脚本只允许导出前 16 列综合结果，所有来源均值列均排除，原始工作簿保留在仓库之外。综合数据按世界银行[开放数据许可政策](https://datacatalog.worldbank.org/public-licenses)保留署名及附加条款；不把包内每列都视为相同许可。

## 复算和验证

复用桌面附带的 `openpyxl 3.1.5`，不改变网站依赖。脚本检查文件及候选哈希、精确表头、观察年份、唯一记录 ID、数值有限性、非负标准误及置信区间次序。负治理估计是合法数值，不按负值过滤；合法零分与未匹配分开。

```sh
pnpm exec /Users/morris/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 \
  -B scripts/cci_wgi_context.py \
  --xlsx /private/tmp/cci-global/wgidataset_with_sourcedata-2026.xlsx
```

26 项离线测试通过，新增测试覆盖零分/负估计、非有限值拒绝、未匹配司法辖区不继承以及代码别名与重复记录拒绝。导出数据只能说明国家背景已取得，不证明城市治理已测量或八维全球排名已具备条件。
