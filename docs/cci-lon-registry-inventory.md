# LON 注册研究发现集：Aging 查询的完整快照

2026-10-10 从 ClinicalTrials.gov API v2 获取 `query.cond=Aging` 的全部分页。未限定城市、国家、申办者、状态或阳性结果；所有研究类型均保留。检索范围仅由该条件查询决定，不代表所有长寿干预，也不是全球所有注册平台的联合库。

## 实取结果

- 5 页共 4,041 个唯一 NCT ID，第一页总数与最终去重数一致，最后一页无后续令牌。
- 3,157 项干预性研究、884 项观察性研究；均尚未判定是否符合 LON 纳入范围。
- 399 项有注册结果模块。其余记录不能据此判成“没有公开结果”，见 [PEARL 反例](cci-lon-intervention-evidence.md)。
- 5,736 条注册地点记录，涉及 80 个非空国家标签；305 项未列地点。无地点不是当地无研究，80 个国家也不是 CCI 国家覆盖率。
- 最大记录更新日期为 2026-10-09。采集日期不是研究观察期，地点不自动证明当前仍招募或仍提供服务。

[研究表](data/cci-lon-registry-studies.csv)和[地点表](data/cci-lon-registry-locations.csv)通过 NCT ID 关联；多站点不会变成多项独立研究。未导出联系人、电话或电子邮件。条件字段原样保留用于相关性审查，不由命中词自动推断干预机制或临床收益。

## 来源与复算

[API 请求](https://clinicaltrials.gov/api/v2/studies?query.cond=Aging&format=json&pageSize=1000&countTotal=true)；[官方 API 文档](https://clinicaltrials.gov/data-api/api)。[来源清单](data/cci-lon-registry-source.json)记录每页 URL、令牌链、字节数及 SHA-256；[汇总清单](data/cci-lon-registry-inventory.json)记录来源清单与两个 CSV 的哈希。原始响应保存在本机研究缓存，未作为网站资源发布。服务器内容会更新，重新下载不保证得到本次快照；复算须使用匹配哈希的原始页。

```sh
pnpm exec python3 -B scripts/cci_lon_registry_inventory.py --source-dir /private/tmp/cci-global
pnpm exec python3 -B scripts/test_cci_lon_registry_inventory.py
```

生成器校验来源字节、查询参数、前后分页令牌、研究 ID 唯一性、总条数及终止页。测试覆盖截断、重复、总数变化、缺失结果／地点不作负面结论，以及同一研究多站点不重复计为研究。分页采集不是注册库事务快照；这些检查能发现若干不一致，不能保证采集期间记录内容绝无变化。

## 对全球评分的限制与下一步

`Aging` 查询包含年龄相关疾病和健康老龄化等条件，既可能混入不符合 CCI 长寿技术含义的项目，也可能漏掉未如此标注的相关干预。本次没有评估检索召回率或精确率，不能以命中数、研究阶段、国家或资料丰富度排名。

全部记录保持 `lon_relevance=not_adjudicated`、`fua_assignment=not_assigned`。地点仅标为注册地点角色；申办者总部、作者机构与受试者覆盖不能替换它，也不能把这些站点直接看作居民服务。全候选证据矩阵的 LON 状态仍为 `not_assembled`。

下一步先将纳入规则落到干预层面：明确针对衰老机制与功能衰退的转化研究范围，区分一般年龄相关疾病治疗与长寿技术；对纳入项链接注册方案、实际结果、监管适应证及居民可及性，并检查其他注册平台的覆盖和重复。现有发现集是审查入口，不能替代这条证据链，更不改变 9,031 个功能区的候选资格。

已用八项真实记录完成[纳入规则 v0 的边界审查](cci-lon-scope-protocol.md)，逐项结果另存而不改写采集时状态；4,033 项仍未经范围审查。这不是全库相关性判定或城市能力测量。

后续[监管反查](cci-lon-regulatory-evidence.md)已确认 NCT00425607、NCT00916747 不在本查询快照内。故查询遗漏不再只是理论风险；原查询计数保持 4,041，新增发现另列，下一步须扩展发现路径并去重。
