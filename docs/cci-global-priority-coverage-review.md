# 欧洲83城之外：多国城市服务数据入口复核

查阅2026-10-13，证据截止2026-10-10；画像仍为2026当地本国普通长期居民、中位收入、通常保障。[现行调度](cci-research-priority.md)已43审阅／15完整／28部分，9,031全部保留；[此前欧洲83城发现](cci-global-priority-challenger-review.md)没有完成全球同源比较。本轮使用research技能，仅两轮发现，不改评分、旧队列或历史发布。

**取得一个欧洲样本之外的多国实际指标入口：ITU／U4SSC公开核验报告。建议根考虑Daegu2453的一项有界任务，先核观察年／来源／FUA适配，再决定完整八维研究。** Quito、Mashhad是已读对照及保留入口，不在本轮凑成第二／第三优先名次。城市自报经有限核验不是当前普通居民全部可用；本轮仍不能客观选全球最好下一城或形成2026同年比较面板。

## 公开入口、覆盖与完整索引交接

第一轮发现[U4SSC核验索引][index]与世界银行水务入口，第二轮定向核方法／观测时点及IBNET公开性；之后只沿已取得链接核原件，没有第三轮或批量下载未读城市报告。

原索引127,006 bytes／SHA `d3d503f86c14b32ee36d720a826f87d28fd3bfd87e9663e4e69f3a2b28cfa64f`可复算提取：**28报告条目／27地点标签、60唯一按钮链接**，即28 Download、26 Read online、3 Spanish、3 French；Pully保留两个版本。60不是城市数，倡议所称250+采用城市也不是本页公开核验样本。自愿参与、核验费用及材料可得会形成选择偏差；不因未参与、未披露或未匹配降能力。

全索引存 `/private/tmp/cci-global/priority-coverage/u4ssc-verification-index.csv` 与同名JSON，含城市原label、报告href、语种／viewer角色、条目及具体链接读取状态。**3条目读了英文Download PDF，25条目只读索引；恰3个具体URL读了原正文。** 同条目Spanish／French／Read online均仍`index_only_variant_not_read`，没有把英文原件的读取状态移给这些URL。JSON的`entryHasReadEnglishPDF`与`links[].specificLinkReadStatus`、CSV相应字段分开。

索引地点依原顺序为Quito、Pully新版、Anyang、Canton of Geneva、Tromsø、Narvik、Daegu、Larvik、Mashhad、Kristiansand、Stavanger、Esperanza／Province of Santa Fe、Santa Fe、Gjøvik、Asker、Bærum、Bodø、Haugesund、Karmøy、Kristiansund、Molde、Rana、Trondheim、Ålesund、Valencia、Krimpen aan den IJssel、Bizerte、Pully旧版。完整原label／URL在数据文件，**其余未读不采指标**。索引地名不自动成为独立旧FUA；Anyang不能凭名字新建城市，Canton of Geneva不等Geneva29。根代理统一作9031关联，未匹配／多解保留。

## 核验能证明什么

[Daegu][daegu]核验Aug2021、发表Oct2021；[Quito][quito]核验Mar2025、发表Apr2025；[Mashhad][mashhad]核验May2021、发表Aug2021。三份均由城市提交资料、独立认证verifier检查方法符合性、访谈及跟进，以**limited assurance**为目标。它们不是仅设施名／未来计划，实际报告了运行、接入与采用原值；也不是独立抽样覆盖全居民、临床审计或当前服务压力试验。

**未逐KPI列观察年、原提供者、原分子／分母或完整调查边界。** 核验／发表日期不替代测量日期，2025报告也不自动是2025全年实绩；SAIFI／CAIDI方法要求12个月，但实际哪12个月仍未知。已确认公开一手原表及测量对象，尚未取得足以构造当前同年面板的年代连接。

报告“已核验指标比例”统计资料覆盖／符合性，不是居民合格服务率。彩色benchmark按外部目标分档、缺项不进入其分母，本轮全部弃用其分数／轮图，不映射CCI。研究渠道失败、缺项、披露更多异常也不参与能力扣分。

## 已读原值、真实线索及反证

下表只记原Results列；三城PDF **p14／15／21／22（印页6／7／13／14）均已目视**。字段与方法关系核清，不据数值排列城市。

| 来源／候选         | 可提出能力假说的原值                                                          | 必须并读的限制／反证                                                                                                                       | 最小下一证据                                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Daegu2453／KOR** | potable供水99.97%；SAIFI0.06、CAIDI30.66分钟；EHR96.64%；医保／公保覆盖96.72% | 授权电力接入88.30%，不等其余户完全无电；住房支出19.10%不代当地中位家庭；原Resilience Plans为NO，不代没有实际保护；观察年及数据来源未闭     | 原提供者年度服务记录及对应地界，验证供水／断电／数字记录的延续和残余；再核通常必要治疗实际完成／质量、资格／自付、实际防护恢复及其余维度 |
| Quito2569／ECU     | potable供水98.35%；医保／公保100%；原EHR19.62%；CAIDI2.51分钟                 | 供水损失29.12%、污水收集原值3.38%、授权电力85.43%、灾害易发人口14.01%；各年／来源未闭，不能擅自把3.38改成93.38，2.51也非全年每户停电总分钟 | 核原户／水量／客户分母、具体年度、污水指标含义及近期运行／恢复；100%制度覆盖不代普通居民及时适当获得                                     |
| Mashhad6030／IRN   | potable供水100%；授权电力100%；SAIFI0.80、CAIDI70.87分钟                      | 供水损失21.76%、公保覆盖69.86%；EHR未报不代没有系统，原Resilience Plans为NO不代零保护；观察年／当地或国家推算未闭                          | 原供水／电力记录与居民服务范围、医保覆盖／通常实际取得及当前剩余负担；不是用伊朗国家政治背景给本地分数                                   |

共同的正面方向是：数字记录采用、资源接入及中断后的运行恢复，比仅到医院距离、热震模型或最快自选测速更接近居民使用。共同断点是年代、来源粒度、通常居民适配和真正剩余障碍。普通犯罪不是组织暴力、灾害死亡0不是零危险，计划YES／NO不是已投用保护／恢复效果；未将其分别搬入GSS／PCS／ISR。医生／床位／寿命不当常规护理适当结局或LON转化。

## 原方法：防止同名指标误读

[2017 Collection Methodology][method]实际PDF p49／54／55／56／101／106／112已目视：

- potable供水分母为**城市户**，衡量安全管理供水，不是化验项次通过率。
- SAIFI为每客户每年中断次数；CAIDI是总客户中断分钟÷客户中断次数。**不是SAIDI全年每客户累计分钟**；不能从Quito2.51分钟宣称全年只停电2.51分钟。
- 电力接入只计**授权连接的户**；未授权不直接等完全没有电。
- EHR分母为城市居民，分子为有电子记录者；不是医院比例、互操作可靠性或临床治愈率。医保／公保也是正式覆盖人口，不等付费、接诊、治疗完成。
- 医保方法允许从国家数据推算，住房方法允许国家统计；住房支出包括租／贷、公共服务及修缮。来源未交代时，不能把19.10%等当城市中位收入家庭／租户实际净负担。

这些原定义让数据增加辨别力，同时限制跨城推定。报告原KPI编码与方法版个别编码不同，不按代码外观机械联结；以已核名称／定义适配，不默认为每城全部本地实测。未从3份材料推30或91项均充分核验CCI31子项。

## 完整9031身份与下一任务

独立核原GPKG9,932,800bytes、SHA `9934364827132232df67e8984768fb30865a846f5a786db999d49fc37fb7698d`，读取完整9031 ESRI:54009几何：Daegu2453／KOR／UC12651／2251km²；Quito2569／ECU／UC467;472／1394km²；Mashhad6030／IRN／UC5916;5918／830km²。原bounds／WKB SHA保留 `boundary-records.json`，不是行政全域或报告2015／2021／2025服务分母；本轮未核报告行政图与旧FUA全面相交、院区／运营商／受益者地块，不能沿国别标签将全国规则／表现全搬本区。

原冻结代理主五工作序位：Daegu **1151／243／2970／576／2034**，Quito **601／454／768／1384／330**；均不会由主五宽度40规则接续。Mashhad缺N，不能当没有网络；三者也不能由新材料自动升工作值／CCI。只建议**Daegu一项有界复核任务**，原因是有RES／TEC实际报告方向及可辨反证，原代理对此不敏感。最先闭合年代、原提供者和范围，失败则继续保留未知；能闭合再按通常居民口径核八维。未获得足够链时不要求完美全人口账单，也不强补60。

不能客观宣布Daegu高于另外两城或全世界未审者。本页不是抽取全球所有城市的同时面板；未读25条目、欧洲之外未入倡议的候选、较新覆盖遗漏均保留，不由公开资料量、参与认证或国别配额产生入选／排除。

## 另一路：IBNET公开性未闭

[世界银行2026复算目录][wb]Feb26创建、Apr6修改，确实列历史IBNET1994—2022及新版2022—2024、KPI／费率／utility映射文件名。但Access policy仍为**forthcoming in Development Data Hub**，且说明部分有限访问数据未包含在包中。**文件名存在不等本轮已经取得可公开城市原表**，没有由报告的国家补贴／城乡比例挑城市或重算负担。旧IBNET入口web502只记录渠道失败，不当水务表现差；不声称所有渠道均不可用。最小待补是合法公开原表及utility服务范围／年份／补助与普通居民账单连接，本轮不继续追登录或第三轮。

## 原件、复算与冻结

本轮7份原下载全部有效HTTP200：3城市英文PDF、方法PDF、2ITU索引HTML、世界银行目录HTML。web工具曾因PDF超过10MB拒绝解析，原HTTPS正常下载后文本＋目视另核；原件／派生和web-only／失败分列，不关闭TLS。没有把其他语种或viewer当已读，未联系机构、派代理、评分或修改共享文件。

| 原URL／文件                                                        | 日期／身份                             | bytes／SHA                                                                   |
| ------------------------------------------------------------------ | -------------------------------------- | ---------------------------------------------------------------------------- |
| [verification-index.html][index]                                   | ITU公开索引；当前读取Oct13，非观测年   | 127006；`d3d503f86c14b32ee36d720a826f87d28fd3bfd87e9663e4e69f3a2b28cfa64f`   |
| [daegu2021.pdf][daegu]                                             | 城市提交／有限核验Aug2021，发表Oct2021 | 11625860；`ad803798fc5bcb0d690ea033f74a0da469c0672afe2d2954b22e8382d098948d` |
| [quito2025.pdf][quito]                                             | 城市提交／有限核验Mar2025，发表Apr2025 | 16325736；`40a3f76f316b59be4d670c8ffaf07b57a1fe7986d4bed6508c1fc0b4ff3ee09f` |
| [mashhad2021.pdf][mashhad]                                         | 城市提交／有限核验May2021，发表Aug2021 | 11103443；`7c05b796e001b58fb04637076ac82a6127a58f95a3d71ee663e7ab750f4eb46c` |
| [methodology2017.pdf][method]                                      | ITU采集定义／2017版本；非城市实绩      | 18632444；`845eeee143c268b2eb150b48af6f5f8674c979ce417934d610d50743fcac2e98` |
| [methodology-index.html](https://u4ssc.itu.int/u4ssc-methodology/) | 官方方法链接原件；日期未知             | 54663；`475d086afcf48eace084dd13146216eb578970058b5dc17a143d03cde9e16d24`    |
| [worldbank-catalog2026.html][wb]                                   | 世界银行公开目录／2026；表尚未取       | 147532；`ffc430ff7d679289c00215cea28494e8e4496395df89456715e56a5c0a8fc638`   |

全部原件、7份真实响应、图／文本、全索引CSV／JSON、3城原值CSV／JSON、边界／输入快照、提取脚本、`source-manifest.json`与`candidate-handoff.json`在 `/private/tmp/cci-global/priority-coverage/`。运行 `python3 -B /private/tmp/cci-global/priority-coverage/extract-index.py` 可复现28条目／60链接及恰3个英文Download读取状态；未读href不采用任何指标。根代理可复用全索引作身份关联，无需逐城重新发现。两轮已耗尽，文件冻结，不承诺全球同源覆盖完成。

[index]: https://u4ssc.itu.int/verification-reports/
[daegu]: https://www.itu.int/en/ITU-T/ssc/united/Documents/U4SSC%20Publications/Verification%20Reports/October%202021/U4SSC_Daegu-Korea_Verification-Report.pdf
[quito]: https://u4ssc.itu.int/wp-content/uploads/2025/04/2500529_U4SSC-Verification-Report-Quito-Ecuador.pdf
[mashhad]: https://www.itu.int/en/ITU-T/ssc/united/Documents/U4SSC%20Publications/Verification%20Reports/August%202021/U4SSC_Mashhad-Iran_Verification-Report.pdf?csf=1&e=LYe4ib
[method]: https://www.itu.int/en/publications/Documents/tsb/2017-U4SSC-Collection-Methodology/files/downloads/17-00474_Collection-Methodology-for-Key-Performance-Indicators-for-Smart-Sustainable-Cities.pdf
[wb]: https://reproducibility.worldbank.org/catalog/484

## 根代理统一验收

2026-10-13。独立核7原件bytes／SHA、3报告候选的全9031几何；目视Daegu／Quito电力原表及2017方法CAIDI定义页。接受历史原值为研究入口，逐KPI观察窗及实际采集分母仍未闭，不能当2026同年面板。完整索引保留28条目／60链接及恰3已读英文PDF，未读语种／viewer不沿用英文读取状态。根按冻结全9031目录作名称＋国别关联，8条目对应8候选、其余20条目未匹配或地域标签不适配而保留；不是完整边界交叉或新评分。公开[索引](data/cci-u4ssc-verification-index.json)、[全候选来源关联](data/cci-u4ssc-candidate-source-refs.csv)、[审计](data/cci-u4ssc-source-inventory.json)与[复算脚本](../scripts/cci_u4ssc_source_inventory.py)；3份原值另列[历史指标](data/cci-u4ssc-reported-kpis.json)。保险／住房可用国家推算的原方法不冒充实际每城采集过程已核；Daegu仅先核时点／来源／范围，不宣布全球下一名。
