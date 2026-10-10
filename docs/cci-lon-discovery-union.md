# LON 多路径发现：按干预补查并保留来源

2026-10-10，针对[已验证的 Aging 查询遗漏](cci-lon-regulatory-evidence.md)，沿 FDA 审评总结中的干预名 `lonafarnib` 补查 ClinicalTrials.gov。没有增加城市或国家过滤，也没有只保留早衰、已完成或阳性结果。

## 结果

| 查询路径                | 唯一研究数 | 与原 Aging 集重合 | 新增 |
| ----------------------- | ---------: | ----------------: | ---: |
| `query.cond=Aging`      |      4,041 |                 — |    — |
| `query.intr=lonafarnib` |         39 |                 0 |   39 |
| 按 NCT ID 合并          |      4,080 |                 — |   39 |

干预查询一页完整返回 39 项，无后续令牌。NCT00425607、NCT00916747 两项已知遗漏均找回。两项找回只验证这条补查路径有效，不证明全库召回率或全球覆盖达标。新结果还包括肿瘤等研究；同一药名不是 LON 纳入标准。

[合并索引](data/cci-lon-discovery-union.csv)仅保存 NCT ID、查询出处与未作城市归属的状态，不平均、不叠加研究结果。索引的 `scope_review=not_determined_by_discovery` 表示检索本身不决定相关性，不覆盖既有[八项人工判读记录](data/cci-lon-scope-review.json)。

新增查询的[研究表](data/cci-lon-lonafarnib-studies.csv)与[地点表](data/cci-lon-lonafarnib-locations.csv)另存；原 4,041 项快照保持不变。各查询中同一 ID 重复会报错，不以去重掩盖分页问题；不同查询共有 ID 才合并并保留全部查询名称。以后若同一 ID 的不同查询返回版本不一致，需要保留版本并复核，本轮无交集，未发生该情况。

## 溯源与验证

[官方 API 请求](https://clinicaltrials.gov/api/v2/studies?query.intr=lonafarnib&format=json&pageSize=1000&countTotal=true)；[新增查询来源清单](data/cci-lon-lonafarnib-source.json)；[合并数量及输入输出哈希](data/cci-lon-discovery-union.json)。原始页保存在研究缓存，生成时校验每页 SHA-256、字节数、查询参数及分页令牌链。

```sh
pnpm exec python3 -B scripts/cci_lon_discovery_union.py --source-dir /private/tmp/cci-global
pnpm exec python3 -B scripts/test_cci_lon_discovery_union.py
```

复用原注册记录提取与分页校验，新增跨查询去重测试；41 项 CCI 离线测试通过。重跑原提取器后，原研究表、地点表和清单均无差异。没有修改全候选评分矩阵、历史发布或网站输出。

## 尚未完成

4,080 是两个检索结果的并集，不是 4,080 项已证实的长寿干预。监管引用反查、机制／别名检索及其他注册平台仍需扩展；相关性、结果、监管和居民可及性继续逐项核验。新增研究没有让任何城市自动通过 LON 评估，也不能用于排除没有命中研究的候选城市。
