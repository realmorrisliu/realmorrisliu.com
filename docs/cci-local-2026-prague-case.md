# 布拉格功能区：多节点技术能力、实际恢复与临床居民链评分

截止 2026-10-10、查阅 2026-10-12；采用[共同口径与原权重](cci-global-scoring-rubric.md)：2026 年当地普通捷克公民、通常长期居民、当地中位收入与通常医保。**ISR／LON／OPT 条件性 60，TEC 条件性 80；PCS／GSS／RES／MED 未定。无总分中心，数学域 29—84。** 八维和 31 子支柱均有审阅状态，不等于充分测量；未知不填低档、中点或默认 60。

## 候选与边界

冻结 **eFUA 535 / Prague / CZE**，UC 2927、面积 2,897 km²、2015 模型人口 1,879,976.61。读取完整 9,031 行科研机构目录并扣除既有十六份案例后，1,122 条目录关联安排本次调查；随后是 Beijing 1,087、Philadelphia 906。目录数只决定调查顺序，不是实力、独立机构、论文数量、准入、排除或优先入围。零记录候选仍保留。

完整 GHS-FUA 原包重新校验哈希及 9,031 几何，八个近似点经 EPSG4326→ESRI54009 相交：Prague、机场、Troja、Charles Karolinum、CTU Dejvice、Káraný、Říčany 落入 **535**，**Kladno 落入另一个功能区 387**。因此不把克拉德诺医工学院全部活动计入布拉格；387 也没有被排除或继承分数。点不是完整机构／市域／运营区、实际给药地点或患者住址，`boundaryReview` 保持 unresolved。Charles 大学跨城汇总不全部分配给 535。

## 八维判读与全部子支柱

| 维度／权重 | 判读 | 支持、反证、判档理由与改变条件                                                                                                                                                                              |
| ---------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PCS／15%   | 未定 | 已发布降温地图及水／洪水材料支持局部缓解，但未形成多类暴露与防护有效性的综合解释；地图存在不证明降温成效，计划不当完工                                                                                      |
| GSS／15%   | 未定 | 主站威胁实际被调查处置，不是已发生爆炸；未充分连通组织暴力、区域与战略影响，不由零归属事件或普通犯罪补高档                                                                                                  |
| ISR／15%   | 60   | 真实应急备电切换、燃料补充、供电恢复与数字提交支持执行／适应；交通及热水中断、部门整合不均保留。接受一般功能、居民／范围及延续假设，拒绝则未知                                                              |
| RES／10%   | 未定 | 供水、损耗及电力恢复与关联热水设备损坏共同保留；食物、供应链备援及通常基本成本未连通，不由恢复速度推全部资源可靠可负担                                                                                      |
| MED／15%   | 未定 | 长等待、认知首诊限收与替代门诊／转诊和已运行扩容并存；质量与压力连续性尚不足判定全维 40／60。接诊数量及单病采用不填常规质量                                                                                 |
| LON／10%   | 60   | 可信人体／监管、2025 真实 CAR-T 给药、条件支付和当地随访支持有限疾病转化；个案批准、制造时间与当前终身安全监测限制保留。合资格居民通常能进入／承担、疾病路径代表性、范围和延续假设拒绝则未知                |
| TEC／10%   | 80   | 多主体持续实际产出、产业部署和广泛使用／已完成服务转化，符合共同高能力锚点；不是目录或许可金额换分。机构范围及用户并非全区居民；必要范围／使用者／延续假设拒绝则未知，已核的重要扩散障碍经缓解仍存在可审 60 |
| OPT／10%   | 60   | 真实航空与日常交通、跨境银行及捷克公民附条件自由流动路径支持选择；停电共因、账户／费用／资源／资格条件保留，交通方式多不等于独立备援                                                                        |

| 维度 | 全部子支柱审阅状态                                                                        |
| ---- | ----------------------------------------------------------------------------------------- |
| PCS  | heat_humidity／flood_sea_level：partial；geophysical／severe_weather_wildfire：unresolved |
| GSS  | organized_violence：partial；regional_conflict／strategic_exposure：unresolved            |
| ISR  | governance／adaptive_capacity／social_cohesion／emergency_recovery：partial               |
| RES  | water／energy：partial；food／supply_chain：unresolved                                    |
| MED  | access／specialist_capacity：partial；routine_quality／system_continuity：unresolved      |
| LON  | translation／trial_maturity／regulatory_adoption／resident_access：partial                |
| TEC  | knowledge_output／industry_density／digital_infrastructure／diffusion：partial            |
| OPT  | transport_redundancy／legal_mobility／asset_portability／network_continuity：partial      |

## TEC：按同一高档锚点判断，未知不能自动封顶

Charles [2025 官方目录](https://cuni.cz/UK-15927.html)链接的[8.4 原表](https://cuni.cz/UK-15927-version1-084.pdf)已读取并目视核表：24 个授予专利、43 份新许可、196 项合同研究／咨询及 71 项企业定制培训；这是大学年度活动，**不是全部发生在布拉格的成果**。许可收入 48,000 Kč 不等于合同研究收入，也不因低于其他大学而自动低档。跨境专利不是额外本地节点。

[CTU FIT 2025 原年报](https://fit.cvut.cz/fakulta/informacni-deska/vyrocni-zpravy/vyrocni-zprava-2025.pdf)PDF 第 32 页记 56 篇期刊文章和 86 篇会议贡献，保留发表／入库延迟；不能相加冒充去重全球数据库输出。第 47 页实际部署包括 CZ.NIC 的 THOR 安全系统、工业 AI 合作及已经提供产品的企业。其海外客户／下载数不是本地居民采用，但与大学许可一起支持多主体持续知识—产业能力，而非拟设公司。

OICT [2025 官方目录](https://operatorict.cz/informace/vyrocni-zpravy)链接[有效完整年报](https://framerusercontent.com/assets/9GZirwJg3wXyQTJwbaaT9xGE9w.pdf)PDF 第 15—16 页记录 PID Lítačka 年度超过 300 万用户及实际购票，Portál Pražana 861,619 个独立用户、11,666 次提交。用户不等于去重居民；应用覆盖中波希米亚及访客，**不除以冻结人口作普及率**。部门新表单／测试和未来功能不当全部整合。

[2026-09-22 完成公告](https://operatorict.cz/novinky/dynamick%C3%BD-svoz-skla-se-v-praze-11-osv%C4%9Bd%C4%8Dil-hlavn%C3%AD-m%C4%9Bsto-jej-proto-roz%C5%A1i%C5%99uje-i-do-dal%C5%A1%C3%AD-oblasti)记录 Praha 11 的 199 个慢填玻璃容器试点结束、8 月起转常规并扩至 Praha 15；传感器—平台—收运确实交付，不是只获奖或拨款。较满容器放入平板玻璃更困难的使用反证保留；不能把这项改善当所有服务无障碍。

**80 的理由**是多机构产出、产业实际部署和广泛实际数字使用／服务转化的组合；关键知识／产业与扩散能力没有由单一生产主体独占。按[新加坡同一锚点](cci-singapore-technology-calibration.md)，不要求每项产品可立即替换、每人采用或每节点独立压力测试。通信共因另在 OPT 核查，不能跨维增加硬门槛。

这仍是有条件研究判断：接受大学能力的布拉格相关部分、用户中目标居民具有实质使用，以及当前延续／截止前材料可用的适用推定；没有把全部大学结果或全部应用用户直接归属本区。若部门整合、技能、费用或接入障碍经缓解仍实质妨碍广泛扩散，60 可作为有依据替代；若无法接受必要适用假设则恢复未知。没有查到群体障碍不证明没有障碍，也不能仅因资料缺少便封顶 60。拒绝全部大学本地相关性时仍须重新评估，不自动保留 80。

## ISR／RES／OPT：恢复、依赖与居民选择分开

[PRE 2025 原年报](https://www.pre.cz/Files/profil-spolecnosti/o-nas/vyrocni-zpravy/annual-report/annual-report-2025/)PDF 第 19／52 页记录 2025-07-04 传输故障影响约三分之二 Prague，运营商称影响区两小时明显缩小、其全部地点五小时内恢复；服务范围为 504 km²，**不是 2,897 km² 功能区逐户结果**。没有用无数值的 SAIDI／SAIFI 概括推全区可靠率。年终另有变电站技术故障。

[SSHMP 当日原报告](https://www.sshmp.cz/aktuality/vypadek-proudu-v-praze-4-cervence-2025-neohrozil-chod-klicovych-slozek-sshmp-byla-pripravena)记 Kundratka、Dubeč、Korunní 应急组织自动转备用供电并补充燃料；是实际运行，不是演习／计划。与此同时 [Praha 7 原通知](https://www.praha7.cz/vypadek-elektricke-energie-v-praze/)记地铁／有轨电车停运和当日 18 时供电恢复更新。[热力运营商](https://www.ptas.cz/aktuality/vypadek-dodavek-teple-vody/)记控制系统／传感器受损、局部维修可能延续周末；预测不是实际完工日期，也不说截止仍无热水。

这些结果支持 ISR 60 的实际执行／恢复，保留群体与部门差异；不是据一次停电给所有维度扣同分。该维一般功能和社会凝聚的适用仍是有限推定，服务反馈不能直接测社会凝聚。PVK [2025 年报](https://www.pvk.cz/res/archive/899/266329.pdf?seek=1785142239)及[ESG 原刊](https://www.pvk.cz/res/archive/593/266356.pdf?seek=1785753419)供水原值与 14.82% 损耗支持水务实绩，不推无人缺水；[890 混合受访者调查](https://www.pvk.cz/aktuality/pruzkum-spokojenosti-se-sluzbami-pvk-je-spokojeno-96-procent-respondentu/)2025-09-07 至 10-28 的 96% 满意不当全区居民水质／供水合规率。食物、供应链、通常费用及共同冲击备用没有连通，RES 保持未定。

[机场 2026-01-21 原发布](https://www.prg.aero/en/return-record-numbers-prague-airport-handles-close-178-million-passengers-2025)报告 2025 实际 17,750,528 人次和 19 个新目的地，不是同等数量居民、独立机场或 2026 预测已实现。[银行 2023 原发布](https://www.csas.cz/cs/o-nas/pro-media/tiskove-zpravy/2023/05/04/mobilni-george-umi-nove-odeslat-zahranicni-platby-i-v-jine-mene-nez-v-eurech)记录实际跨境功能与使用，[当前原说明](https://www.csas.cz/en/faqs/how-do-i-send-money-abroad)保留账户、AML、时限／额外条件；不作所有人当前费用收入比。[共用德国原法](cci-legal-mobility.md)给捷克公民的是受雇／求职／资源医保条件下路径，不等于无条件迁居。

OPT 60 将实际日常通道、通常取得／承担的推定与共因／资格短板合并；没有给全区独立家庭通信备援盖章。拒绝通常取得／负担、时间或范围等必要假设则未知。

## MED／LON：实际给药不填常规医疗

[临床原件复核](cci-prague-clinical-review.md)经主任务独立核验关键原件字节／哈希、支付与当前安全条款及原图后，采纳 MED 未定、LON 条件性 60。VFN 的近似平均等待清单不是全部完成／待诊队列；较长等待和 Motol 认知限收，与替代门诊、合作转诊和真实肿瘤扩容一起判断。未核常规结局和压力连续性不默认无问题，也不把一个门诊限制升级为整维失败。

ÚHKT 2025 年报实际给药与专业支付／监管链证明有限疾病转化；21 与 23 名患者的队列差异未解决，44 件产品分发不是 44 名治疗居民。旧学会文中“尚无继发肿瘤”的说法已由 2024 主管警示更新为须终身监测，不能当当前无风险；本地当前全部监测实施仍为可撤回假设。住院获保仍须适应证、逐例批准及合同 provider，国家规则不证明本地人级实际支付／附加负担。

LON 60 取决于疾病路径代表性、当地交付与延续、适当当前安全以及通常合资格居民能够进入和承担；拒绝关键假设则未知。多个药品／病例数不自动成为多条延寿路线，既不直接给 80，也不因未查到另一药给药给 40。MED 另待通常质量、实际等待／转诊结果、费用与压力连续性的综合判档。

## 演算、发布资格和下一条证据

给定贡献为 `ISR9 + LON6 + TEC8 + OPT6 = 29`；其他四维未知权重 55%，故无中心、域 **29—84**。撤回 ISR 为 **20—90**，LON／OPT 各为 **23—88**，TEC 为 **21—86**。有依据将 TEC 改 60 才为 **27—82**；新证据支持 MED 60／40 才分别为 **38—78／35—75**，不默认补任一档。

现为十七份八维审阅、五完整条件中心／十二部分、9,014 未审，全部 9,031 保留、零有依据排除；新旧覆盖和合格第 32 名门槛仍未解决。上述是给定条件数学域，不是可信排除界限、实际名次或入围概率。布拉格当前可能位置仍为 1—9,031，不授予名额，也未推翻既有案例的给定位置。

下一条有辨别力的事实是 MED 实际等待／替代转诊的完成队列与通常结局、居民负担和压力连续性；同时核验 TEC 普通居民扩散、LON 当前监测／获保及全功能区适用。达到何种发布名称仍遵从共同规则，不能把又增加一份部分案例当作已完成全球 Top 32。

有效原始字节与哈希保存在[案例 JSON](data/cci-local-2026-prague-case.json)，临床原件详见独立复核。当前哈希不认证首次公开、截止历史版本、患者居住或指标效度；不稳定／未标版本材料仅在明示可用假设下使用，网页读取失败不当当地能力或透明度缺失。未向外发送资料请求。
