# 哥本哈根 eFUA 537：八维优先试点复核

**建议条件档位为 PCS/GSS/ISR/RES/MED/LON/TEC/OPT＝60/60/60/60/60/60/80/60，原权重条件中心62。** 这是统一锚点下的研究判断，不是官方评分、全球入围或排序结论。31子项均记录 `partial`：存在相关原证并有明确适配推定，不表示31项充分测量。MED及PCS的40替代尤其重要；拒绝必要居民、地域、版本或通常交付连接时，相应维度回到 `null`，不填零、不重分配权重。

画像是2026年丹麦公民、通常长期居民、当地中位收入、通常医保；截止 **2026-10-10**，本轮实际查阅及新原响应 **2026-10-13**。按[共同 rubric](cci-global-scoring-rubric.md)和[现行权重](cci-research-model-v2.md)复核，沿用[大阪医疗](cci-osaka-kyoto-priority-completion-review.md)、[南京](cci-nanjing-priority-completion-review.md)、[广州](cci-guangzhou-priority-completion-review.md)同层级通常获得、净负担和持续性推定；LON也允许真实疾病限定转化路线，不额外要求健康人延寿获批或每户完美账单。研究排序及医疗旅行时间、PGA、快网络样本只用于定位，不作为八维高分证明。未改共享数据、旧案例、页面或脚本。

## 冻结地域、机构与时间适配

本轮实际读取原GHS全部 **9,031** 几何并复算SHA。原包9,932,800 bytes，SHA256 `9934364827132232df67e8984768fb30865a846f5a786db999d49fc37fb7698d`；537名称Copenhagen，面积 **3,406 km²**，ESRI:54009 bounds `[815000,6404000,889000,6494000]`，目标几何WKB SHA `460a6ed468395064b665167a01d1017cdab94404d687e2600247f39095e266e3`。2015模型人口1,987,482.45仅识别历史候选，不是2026居民分母。原包来源复用[候选来源记录](data/cci-global-candidates-r2019a.provenance.json)，推导文件 `/private/tmp/cci-global/copenhagen/boundary-record.json`。

EPSG:4326→ESRI:54009、`always_xy`、对全目录 `intersects` 的**分析者近似参考点**结果：中心、CPH、Rigshospitalet Blegdamsvej、Bispebjerg、Herlev、Hvidovre、DTU Lyngby及Risø、Høje Taastrup批发市场、Lejre水厂参考点、Enghaveparken均537；Malmö中心481，Bornholm Rønne点不落旧全集。坐标不是官方精测、冻结机场目录点、院区/厂区足迹、病例发生地或完整服务覆盖。不能因名称含Copenhagen、某参考点落区或行政名外地，就把全部业务纳入或排除。

Københavns Kommune只是行政市；Region Hovedstaden包括Bornholm；HOFOR、Radius/Cerius、DTU和国家调查各有独立范围。下面使用多个适配本区的机构/医院单元和共同国家制度，接受其通常居民路径代表性；不把行政市、大区或全国比例移植为537实测。外区服务仍可提供真实替代，但不能冒充本区产出。医院按治疗机构记的外地患者不是当地受益率。当前网页取回晚于截止，若无截止日字节档案，只接受其明确截止前观察/生效/更新声明并另设版本延续假设；未标首发的网页不伪造日期。

## 31子项与主档

来源编号对应文末直接原URL及日期/bytes/SHA表。`partial`表示有限证据和明确推定，并非样本足够或自动给分；全维整体判读，不对下列子项等权平均。

| 维度/子项       | 状态    | 支持、反证及必须保留的连接                                                                                                                                                   |
| --------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PCS 热湿        | partial | S01市域历史参考夏温16.6°C、热浪日3/年，属于1981–2010基线；S06是2026实际高温干旱供水压力，不是2026全区热死亡/WBGT。低于严重热暴露的方向推定可用，城市热岛和老年住房条件保留。 |
| PCS 洪水/海平面 | partial | S02已建Enghaveparken与S03仍预计2027投运隧道并读；W04明确海潮防护门/融资与长期建设缺口。既有适配雨洪防护不覆盖海潮共因。                                                      |
| PCS 地质        | partial | S04官方丹麦地震危险原报告，低暴露背景与原筛查低PGA同方向；不是无地震、无地基问题或全区建筑验收。                                                                             |
| PCS 强天气/野火 | partial | S01本区海岸与极端降水背景，S05/S09实际运行及应急反证；降雨防护和现有响应通常可用须推定，未认定大区每地防火/抗风冗余。                                                        |
| GSS 组织暴力    | partial | S08记录本地VaaS雇佣暴力、严重受伤与跨境检控，2025案件较前一年少；现实影响与实际缓解同读，不把一般盗窃当组织暴力或检控当无受害。                                              |
| GSS 区域冲突    | partial | S10 2026-09-24判断俄对NATO有限攻击风险低但上升、全面入侵不再可完全排除；是评估，不是本城已战斗。                                                                             |
| GSS 战略暴露    | partial | S08实际机场关闭/大型国际活动警备，S11 2026调查修正归因及设备训练；政治、通道和混合威胁仍重要，非“俄罗斯已实施本次攻击”。                                                     |
| ISR 治理        | partial | S12 2025申诉逾1,000，约60%选入申诉承认错误/服务不足，90%完全或部分解决；投诉率非全市行政错误率，部分解决非完全纠正。                                                         |
| ISR 适应能力    | partial | S12实际改错渠道、S13已实施数字豁免与纸本服务、S05运营修复；项目延期与数字迁移损失并读，计划不当验收。                                                                        |
| ISR 社会凝聚    | partial | S14 2025-12—2026-02市调查86%邻里安全、78%晚间安全，均较上年下降；街区/性别差异、低答复及原分母冲突保留。安全感不是无歧视/全部群体信任。                                      |
| ISR 应急恢复    | partial | S09 Børsen火灾跨机构救援、2024 IT/电话故障响应与受损同读；已响应不证明无损失或所有危机已有效备援。                                                                           |
| RES 水          | partial | S05年运营中断/合格率和S07 Jan2026出厂数据、S06当季节水压力；多厂不等于独立水源，厂样不等于全末梢。通常末端合格、账单可承担和服务延续须推定。                                 |
| RES 食物        | partial | S15本地市场当前在营业/列经营者、S16 2025实际零售网络和交易、S17截止前价格环境；不从营业额/全国门店数推中位居民负担或全区货架无断供。                                         |
| RES 能源        | partial | S18 Radius2025每客户35.7停电分钟及2021–2025变化，S05实际供热/发电和急停；常态可靠同时老化/气候/维修残余保留。                                                                |
| RES 供应链      | partial | S05燃料来源和实际热电供应、S15批发与S19/S20已运行跨境道路/铁路；同一运营商不算独立上游，通道运行不证明共同冲击下库存天数。                                                   |
| MED 可及        | partial | S21实际公共医院已手术队列，S22/S23公保卡/诊疗、S24快速诊断与择院路径；手续、转诊和重要急性手术延迟保留。急诊不能由30日择院保证替代。                                         |
| MED 常规质量    | partial | S21实际过程、30日死亡及风险调整、再入院和康复计划；多院时效偏低且再入院较高，不用院名/排名填分，不宣称统计不显著＝无伤害。                                                   |
| MED 必要专科    | partial | S21真实骨折手术、多院衔接；S25既有血液/儿科/免疫CAR-T临床程序和W01/W02真实治疗/转诊。只证明这些路线，不覆盖全部稀少专科。                                                    |
| MED 连续性      | partial | S21真实出院/再入院捕获、康复计划，S25故障时文档路径与跨专业程序；计划存在非康复已按时完成，实际安全及接诊压力仍有残余。                                                      |
| LON 转化        | partial | S25 2019起既有儿童/成人临床CAR-T与W01/W03已给药；真实疾病限定人体交付，非健康人抗衰。S26科研商业化仅补生态。                                                                 |
| LON 人体成熟度  | partial | W03真实人类治疗及国际ALL长生存背景、S27/S28正式效益/安全评估；本地旧小样本和长期副作用不确定，不把实验平台或许可当延寿已证。                                                 |
| LON 监管采用    | partial | S27 2025 liso-cel标准采用、S28 2026 cilta-cel资格与渐进容量，S29 lecanemab不推荐和S30 donanemab在审并读；许可、推荐、执行各不同。                                            |
| LON 居民获得    | partial | S22/S23通常公共诊疗支付＋S25/W02本地程序构成有限通常合资格可承担连接；年龄/病种/PS/既往疗法/监护及容量约束保留，未默认普通人符合任何治疗条件。                               |
| TEC 知识产出    | partial | S26 KU与S31 DTU跨年度实际研究/合作，不用排行榜；KU年报所列11,152是2024论文而非2025。大学多地单位不全计本区。                                                                 |
| TEC 产业密度    | partial | S26 2025实际spinout/许可/合作与S31实际商业化，多生产机构；资金和签约不是成品即时可替代，早期失败/供应集中仍可存在。                                                          |
| TEC 数字设施    | partial | S32 2025真实运营网络/光纤和已配备用电，S33 2024H1实际订户迁移；是公司/全国覆盖，非本区实测网速或每室内覆盖。                                                                 |
| TEC 扩散        | partial | S34居民2025生成AI实际使用、S13非数字替代渠道，S26/S31外部合作；全国使用只作共同环境，年龄/数字障碍不是已消失。                                                               |
| OPT 交通冗余    | partial | W05实际CPH航空＋S19 Øresund道路/铁路和S20至德国已运行列车；S11真停航、S20延误与工程并读，不把两种桥上交通当完全独立结构。                                                    |
| OPT 法律迁移    | partial | S35复用已核德国EU公民路径；丹麦公民可合法附条件迁移，非就业者资源/医保、求职期限/资格及安全限制保留，不把免签当无条件长期生活。                                              |
| OPT 资产可携    | partial | S36实际合法国际转账手续，S37支付系统实际使用/故障/缓解；IBAN/BIC、身份核查和渠道限额仍在，国内清算不等于跨境个人钱已到账。                                                   |
| OPT 网络连续    | partial | S32网络在运作/备用发电，S38现行漫游产品；S09真实电话/报警受扰、S37支付共因并读，漫游条件和长居公平使用不默认为无限替代。                                                     |

## 原底表的可判别发现

### 自然、资源与制度

S01市域气候报告v2025a物理15页中 **16.6°C夏季平均、3个热浪日**是1981–2010参考；海潮Køge Bugt/Øresund参考和2071–2100情景也分列。不能用情景高值当2026已发生灾损，也不把温度均值当湿热负担。第14页明确哥本哈根属国内偏暖、密集建成热岛区；海岸缓和温差，内陆更不稳定。这支持相对低热湿暴露的方向与受影响住房/老年群体残余并存。

S02主管气候适应网站确认Enghaveparken **2019-12建成**，22,600 m³设计蓄水；这是已建工程容量，未核实际承受百年暴雨结果。S03当前HOFOR明确Kalvebod Brygge隧道预计 **2027**完成，10,000 m³和20 m³/s是设计，不是现役流量；旧“2025/2026建成”报道不能替代当前延期。W04 2026-02-17行政原说明记海潮全方案需两大防潮门、12–13bn DKK及约30年施工，融资分配/生态许可仍未闭；该PDF直取404，故只使用官方web可读正文，未称有效原件或已投运。

S05 HOFOR2025年报物理26页目视：**32非预警用户中断分钟/邮政地址平均**；**99.5%饮水样本**符合质量要求，非99.5%居民终生安全，报告该页未给完整样本分母。热网有 **75急停**、**1起超过1,000消费者的重要运行事件**，上一年0起；电热块4年初大故障与当年实际热/电交付并存，不能因年产量上升称每个故障消除。改造投入增加但效果尚未显现，这是反证而非已验收缓解。

S07原XLSX是 **10座HOFOR厂＋2个Tårnby供水增压取水点**，Jan5–28 2026各点日期，并非12座厂或消费者随机样。3个表分别化学/微生物/外来物与金属。各点E.coli与总大肠菌群记 **<1/100mL**，不能把“小于检出限”写零。硝酸盐0.9–4.2 mg/L，对照表中≤50；四PFAS合计最高0.0014 µg/L（Thorsbro），≤0.002 µg/L；22项合计另≤0.1，**不同合计/门槛不混用**。出厂表列消费者水龙头标准不把采样位置变成末梢；S05系统样本补有限末端链，但全部住所水龙头仍需适配推定。

S06 **2026-06-25**明确高温干旱使约百万服务客户用水压力大，若高用量继续可能水不足；是实际压力及条件警告，未证明已经限供/停水或节水已成功。多厂、地下水保护/混配是缓解能力，不能独立证明干旱与污染共同风险已冗余。水价S39正文49.57 DKK/m³、明细合计49.56的0.01差保留；含供/排水、税和VAT，另小表2.5m³水表480 DKK/年，不是典型消费量或家庭账单。网页仍保留“待市批准”文字，未仅由2026题名认证正式最终价；只作运营收费声明和价格机制，不算中位收入负担率。

S18物理33页 **Radius35.7、Cerius43.0分钟/客户/年**；2024分别38.6/46.0，2021分别27.2/16.8。2025较2024改善不等于长期无老化约束。报告99.99% uptime不能替代户均停电分布；表脚注专标Cerius2023排风暴潮force-majeure，后部统一方法也写排除这类中断，不能把当前系列当灾时全事件捕获。Nexel风暴时已用临时土堤和现场队伍、事后评估；未来投资和2035目标另列，不当当前可靠性。

S15本地批发市场列现行经营者/营业时间；S16公司2025实际交易和全国零售门店提供流通证据，**不把全国578 Netto/营业额移植为本区门店或可承担比例**。S17 2026-09-10公布Aug2026 CPI，食品对同比通胀贡献-0.21pp、食品权重10.43%；这是全国消费篮子及贡献，非每户食品涨跌或中位居民剩余预算。Oct12发布的Sep2026数字晚于截止，不纳入。RES60采用通常基本消费可承担推定，实际水源/峰时/热网/电网集中及缓解未消除的约束仍重要；更多生产量不能独自升80。

S12实际申诉解决、S13现行纸本/非数字豁免、S09火灾跨组织投入，支持制度可运作并有替代渠道。S14调查物理4页确写 **18,917邀请、3,987参与、23%响应**；简单3,987/18,917约21.08%，原表的方法/有效邀请分母未在此解释。保留两组数及冲突，**不默改成一致**。86%邻里/78%晚间安全只是行政市问卷估计；不能由安全感推全功能区社会凝聚。低答复/女性与街区差异、申诉错误和IT故障都不是已不存在的问题。

### 地缘安全与连接

S08警察原2025年报记录Holmbladsgade一名22岁者严重枪伤及另一枪未击发、雇佣/跨境网络和实际判刑/引渡合作。对组织暴力的缓解是调查、关聚集点和跨机构工作，非没有组织暴力。S10最新 **2026-09-24**威胁评估替代“2025常规攻击威胁NONE”的简单延续：有限攻击风险低但上升、混合战升级预期与全面入侵不确定并存，国家安全评估不能变本城已遭战事。GSS60接受通常日常影响较低而区域/战略威胁重要的推断；若重要通道/群体反复受暴力且替代不足，可40。

S11 2026-06-25警方声明：2025-09-22观测/报告导致Naviair关空域，全国约7,000报告多数为其他现象；全部调查已结束，部分无法证明或排除无人机。**真实关闭不撤销，俄罗斯归因不成立为本事件已证事实**；后来设备/训练加强不证明每次风险已消除。

W05机场2025实际32.4m旅次、367条路由/191目的地为运营商声明，路由不是191独立出境系统或去重居民；原响应403，无有效原bytes。S19桥2025铁路15.9m旅次和道路逾8m车辆，S20真实Copenhagen–Hamburg列车与全国干线/区域旅客准点 **73.2%**，S40地铁135m旅次、99.3%运行稳定支持日常节点能运作；均不把旅次数当人、全国准点当特定跨境车次准点。桥公路/铁路共结构，航空/陆路/不同方向与潜在外区备援可提供有限替代；机场关闭、海潮/工程与跨境交通耗时仍限制即时离开。

S35复用2026-10-12德国EU法原件并于本轮重算SHA，丹麦国籍适用免签/无需居留许可的**附条件**自由迁移。非就业者足够资源/医保、求职期限与继续求职就业前景、安全与身份审查仍在；未称中位收入自动满足长期生活费用。S36银行当前入口规定IBAN、必要时BIC/SWIFT及认证办理；个人渠道限额/反洗钱和制裁条件未消失，页面未标首发/生效，采用截止前通常路径延续推定。S37中央银行2025清算实绩有2次多小时TARGET事件和Dec数据中心容量不足致许多居民不能即时转账，中央清算当时仍正常；已实施修正、启动应急和目前技术跨币种版本与未来接入分开。金额不是个人出境转移上限或已转账成功率。

S09 2024-11-28 **TDC四小时中断影响报警电话**，2024-07-19 CrowdStrike使自动火警失灵；不是复制他城事故。S32原2025运营报告记真实光纤/5G和备用发电设备，未证明每个用户无停机；S38漫游须匹配套餐/设备/目的地、开通及公平使用，普通DK-only宽带不默认为海外可用。OPT60接受通常可用航空/陆路、合法目的地、资金及通信替代连接，残余共同失效和时效重要；不因没有全区压力普测自动封60，也不由法律资格/路由数单独给80。

### 医疗：真实手术、过程、结局和支付

S21《DrHOFTE年报2025》**2026-05-27公开版本**，记录窗 **2024-12-01—2025-11-30**，不是2025自然年。物理/印刷14、48、50、61、93页本轮目视。队列要求急性主要诊断DS720/721/722、已做有效术式/侧别、**手术日≥65岁**和有效CPR；一年前同类同侧再手术排除等条件保留。其他医院接触4小时内可连病程；未手术者、无侧别或不足65岁不计，故分母**不能估总需要治疗人口未获手术率**。方法估>90%覆盖而无独立同人群全国源，不能提升为100%完整捕获；各指标选择和死亡排除不同。

| 医院单元                 | 24h内手术/已登记合资格  | 手术后30日死亡           | 出院后2–30日急再入院/出院存活队列 |
| ------------------------ | ----------------------- | ------------------------ | --------------------------------- |
| Amager/Hvidovre          | 210/518＝41%（上年54%） | 38/518＝7.3%             | 95/501＝19%                       |
| Bispebjerg/Frederiksberg | 172/369＝47%（上年56%） | 25/369＝6.8%             | 70/361＝19%                       |
| Herlev/Gentofte          | 348/525＝66%（上年37%） | 64/525＝12.2%            | 108/503＝21%                      |
| Rigshospitalet           | 3/27＝11%               | 3/27＝11.1%，CI2.4–29.2% | 4/24＝17%，小样本                 |

延迟是**到院至knife-start**，非仅填写时间或59%从未手术；原临床解释认为重要且首都区十年持续偏低。医学优化/额外影像、组织容量和可能编码是讨论的替代原因，**未证明本区实际低值仅是编码错误或无害**。不能把Herlev改善当全网及时性已改好，也不把很小的Rigshospitalet特殊队列当全院普通手术率。该时效反证对65+急性骨折有实际重要性，无需多数全市居民受害才可以降40。

死亡粗率非风险调整：物理50页按年龄类别/性别/共病调整，与其他医院作比较；Bispebjerg aOR0.63（0.34–1.17）、Hvidovre0.61（0.35–1.07）、Herlev1.33（0.88–2.01）、Rigshospitalet1.05（0.23–4.74）。**全部CI跨1**，不能只摘粗OR“显著较好”、称风险调整优于或无害，也不能把一般无显著差异当达到官方≤8%目标。Bornholm不当本区质量样本。急再入院包括任何原因、至少12h病程并连转院，2–30日而非所有第一天；排住院死亡，全国285例。原粗率是连续性反证，不是全部由护理错误导致。

康复计划实际登记 Hvidovre488/501＝97.4%、Bispebjerg361/361＝100%、Herlev493/503＝98.0%、Rigshospitalet23/24＝95.8%（物理57页）；同样排住院死亡。**已作康复需要评估/计划不等于患者已获得全部康复或功能恢复**。它与实际再次接诊、公众转诊/择院和S25跨专业临床程序一起支持有限连续路线；并不“抵消”时效/再入院。

S22/S23公共通常路径覆盖GP、急诊及公立医院；登记/医保卡及常用group1契约GP/必要转诊是画像假设，国籍/住址不独自代办理完成。S24明确自2025-01-01起通常躯体治疗扩展择院恢复30日；医学原因不能完全查清时要计划，非所有疾病30日治愈。免费公立必要治疗提供可承担连接，**药物、成人牙科、部分理疗、交通/陪护/失工及自选私立不全免费**。同等允许通常中位居民必要治疗净负担可承担的推定，不要完美账单前置，也不由公共制度存在自动给60。急性骨折24h缺口不能用30日择院规则解释为充分替代。

**MED主60**接受“实际多院必要手术、有限常规结局/护理、真实衔接及通常公保使广泛必要服务一般可获得，但急性时效和连续性仍是重要短板”的条件判断；不是已证明所有治疗及时适当。**40是实质替代**：若认为持续急性骨折延迟、首都区较高再入院及普通居民缺及时替代足以构成明显治疗约束，取40，无需扩大到多数疾病/居民或假定全部迟延造成死亡。更强质量/等待/实际替代改善可以支持重审80；拒绝通常质量、及时替代、支付或地域代表性连接则 `null`。现有单项数据本身不足以精确决定残余重要性，主60须由根跨城校准接受。

W06 LUP2025官方行政评议只web可读、raw为security challenge：部分产科体验下降、接诊压力与未来招聘保留，未把全国493,756答复当本区患者/风险调整结局；MED不依赖此弱获取链才能成立。

### 长寿转化与科技：疾病路径不能由单药封顶

S25 **April2025 v1质量手册**物理5页明确既有2019起HSCT/CAR-T、儿童/成人共同临床单元、采集/处理/免疫和专业职责；第10页IT停机时有专门电脑/应用文档路径，第12页病房HEPA年度维护/24h监控。手册证明已有程序/替代，**不是本轮实际疗效或最新给药计数**。W01医院2021-03-11真实4例9–24岁白血病治疗；W03主管2023-09-21原文记录截至2023-02全国12例均Rigshospitalet。SST原PDF由web读取，curl429，无有效原bytes及本地原PDF目视；不伪装已保存原件。该旧全国12例不能改成2026新病例，也不能把全国/境外来源患者当当地居民覆盖。W02院方2025-09-23实际转诊程序每周委员会，是可操作连接而非人人已准入。

S27 2025-03-26决定推荐liso-cel，限定≥2既往系统疗法后的复发/难治特定淋巴瘤、PS0–1，支持holding/bridging并要求采集至输注时间不能显著长于研究；与axi-cel间比较为两项非对照研究，长期效益不确定保留。S28 2026-06-24 cilta-cel v1.1限定至少一线、含免疫调节药和蛋白酶抑制剂、lenalidomide refractory、PS0–1及既往BCMA条件；**要增加容量，渐进实施**，不当批准即全量及时交付。两个决定支持审慎采用/有限治疗路线，不证明各药本轮已在本区逐一输注。

S29 lecanemab 2025-12-17 v1.0不推荐常规标准：小效应、严重副作用、MRI/输注及容量、>18月不确定；650/年是估计候选而非实际获药。物理2页 **2,074,000 DKK/QALY是ICER**，不是患者账单、自费价格或中位居民年费，谈判价和方案成本被商业保密。S30 **2026-09-21更新** donanemab仍在审，预计2026-11-25；May21–Jul17和Aug20–Sep16 clock-stop各有原因，不能把旧预计May决定或截止后结果当已拒绝/已采用。

**LON条件60**综合实际疾病限定CAR-T人体路线、可信人体效益/不确定、当前正式采用和通常公保/监护连接；保留抗AD采用断点、容量和严格适应证。公共医院治疗支付和有真实历史给药/2025在用流程允许同南京/Prague层级的通常可获得推定，**不是仅公保存在、临床论文或basic基金拒单药就给分**。不能默认画像年龄、癌种、PS符合任何路线，评价的是合资格疾病发生时转化可及准备度。若这些路径的地方/当前延续、通常公保承担及可执行安全监护连接不接受，撤null；若实际生产/候诊/副作用照护障碍使合资格居民通常仍显著受约束且缓解不足，可40。未证健康人延寿不作为独立降档原因。多成熟路径和实际通常交付冗余更强才支持80。

S26 KU年报：2025 7研究spinout、25许可、160商业合作、Lighthouse519用户/355 startup；各口径不相加为独立企业，33专利申请非33实施产品。其11,152 WoS论文观察2024、spring2025才登记，**不是2025新增**。S31 DTU2025实际39售/许可/option协议、涉及56发明与3软件；option不是销售已实现，大学校区/外部合作不全537。8July2026勘误涉及管理薪酬超支披露、称其他年报内容不变，不把补充当科技产出作假或忽略。

S32运营商853,000 home/business光纤footprint、99.7%全国5G及备用发电证明实际基础能力，覆盖统计与Feb–Mar2025网络测评不同，home-passed非已付订户/去重居民。S33发布Mar2025、观察2024H1，51%固定订阅fiber、约250k铜订阅仍需迁移，非2026新订户。S34 2025调查48%居民用生成AI、16–24岁约75%，人群选择/年龄差异和S13豁免纸本服务保留；全国比例不能本区同率。

**TEC条件80**是多机构持续知识、实际商业连接、在运作数字设施与居民/组织扩散的组合，关键知识/产业不由一生产机构独占；没有以排名、投资、网速或一个AI比例换分。80允许实际数字技能和迁移短板；判断它们经已在运作的多渠道和帮助后，尚未形成通常本区知识/产业/接入的关键断层，不独加每节点压力普测。若认为技能/融资/扩散障碍在缓解后仍显著，则60；拒绝国家到本区/跨院校地域代表性、截止前版本和持续实际采用连接则null。网络危机连续性另由OPT解释，不用TEC80证明OPT80。

## 八维可撤回条件、情景和停止边界

| 维度 | 主档 | 改40/60/80或null的关键辨别                                                                                                                                                                                 |
| ---- | ---: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PCS  |   60 | 雨洪现役/低地震背景有效且通常热防护可用；海潮门和大隧道未投运是重要残余。若关键居民/医院/供应暴露与现役不足形成显著约束，40；更多已运行保护/低暴露组合可80，不要求无危险。拒绝上述代表性/现役作用则null。  |
| GSS  |   60 | 现实日常影响低且检控/缓解有用、区域战略威胁重要；反复暴力/共同通道失效且缓解不足可40，持续低影响＋威胁检视/有效应对可80；拒绝影响/归属推定则null。                                                         |
| ISR  |   60 | 通常执行、投诉救济、纸本和应急有实际路径，群体/纠错/数字共同依赖仍重要；可得结果更广且压力替代有效可80，真实制度触达长期失效可40；不能由申诉60%外推全市。关键触达/恢复假设拒绝则null。                     |
| RES  |   60 | 日常适当水/食品/电热及通常负担可承担、服务续存；干旱峰值/水源和热电维修共因重要。备援/来源可替代且实际负担组合加强可80，必要供给/支出持续约束可40；拒绝通常末端/负担/范围连接则null。                      |
| MED  |   60 | 多院实际交付/有限质量/必要专科、公保和衔接通常可用。急骨折长期时效/再入院可支持40，不能以“免费”抹去。可靠有效备援和通常及时性改善可80；关键质量/净支付/时效适配不能接受则null。                            |
| LON  |   60 | 实际疾病限定CAR-T＋审慎采用＋通常公保/安全监护的可执行持续连接。容量/生产/照护残余显著可40，多路线更强实际普通交付可80；不接受当前衔接则null，AD单药不决定整维。                                           |
| TEC  |   80 | 多机构/产业和实际采用可持续、全国环境适配本区；实际数字/产业扩散障碍缓解不足可60，关键地域/通常持续采用推定拒绝则null。                                                                                    |
| OPT  |   60 | 有效身份/资源、实际交通、账户和匹配通信产品通常可用；共享桥、机场/电话/支付真实故障仍重要。替代在共同失效中通常可执行、资金网络覆盖增强可80；必要离开/携资显著受限可40；撤回资格/范围/通常可用推定则null。 |

全部条件接受：`0.15×60×3 + 0.10×60 + 0.15×60 + 0.10×60 + 0.10×80 + 0.10×60 = 62`。不是31比例平均或自动排名。MED单独40→59；PCS单独40→59；两者40→56；LON单独40→60；TEC单独60→60；OPT单独80→64。MED null保留贡献53、原权重域53–68，无中心；LON null贡献56、56–66，无中心；两者null贡献47、47–72。多个维度缺失须按同权重再算，不用展示半宽容纳任意未知。

有界收束：原PDF临床/网络传输截断仅一次定向重取成功；SST/院方/WAF及当前stroke数字报告不继续穷追。剩余最小辨别链是 **急性骨折时效的现行有效缓解与通常可执行替代、海潮关键暴露和现役作用、CAR-T通常合资格安全交付/监护/容量、国家/机构到537居民的代表性**；不是更多床数、未来资金、论文量或完整家庭账单。MED/PCS主60与40之间的残余重要性允许根进一步校准；拒绝连接可保持null而停止，不为完整评分补中点。

## 原响应、复用和web-only来源

新原响应全在 `/private/tmp/cci-global/copenhagen/`；`source-manifest.json`保存具体UTC获取时间、requested/effective URL、HTTP/content-type、curl退出、bytes和SHA。`.pdf.txt`、`.html.txt`、XLSX `.decoded.json`及图片是提取/目视产物，不是独立原件或新采样。失败响应bytes/SHA只证明所收错误/截断负载，不能作原文hash。本轮没有浏览器解码存档。有效且未采用的索引/误定位资料另记，不为了资料数量加分。

| 来源/原URL                                                                                                                                                                                                                    | 观察、发布、生效或版本身份（新取回均2026-10-13）                           |      bytes | SHA256                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------: | ------------------------------------------------------------------ |
| S01 [copenhagen-climateatlas2025.pdf](https://download.dmi.dk/Research_Projects/klimaatlas/latest/kommune_reports/DMI_Klimaatlas_v2025a_Koebenhavn_rapport.pdf)                                                               | DMI市报告v2025a；1981–2010/2006–2015参考与未来情景分开，未标首发           |  1,765,498 | `42203caaebd5edcbd0b2307826b1f6b8dfac1ca51a933101fca10eb39ea31bae` |
| S02 [enghave-completed2020.html](https://eng.klimatilpasning.dk/examples-of-climate-adaptation/the-capital-region-of-denmark/the-enghaveparken-climate-parken-in-copenhagen-now-attracts-both-people-and-stormwater-drainoff) | 主管气候适应网站；2019-12建成，2020-12-22更新                              |    102,004 | `65c18b045dba5ca858b4a7ff017db561dc1be8a0b7b4d689daadb5bfab35a116` |
| S03 [cloudburst-current.html](https://www.hofor.dk/baeredygtige-byer/udviklingsprojekter/skybrudssikring/kalvebod-brygge-skybrudstunnel/)                                                                                     | HOFOR现行项目；2020起施工、预计2027完成，首发/本版本时间未标               |    306,326 | `da325049b12119a1b2a268ad66bc6dba6510ff6f0cb70b6ccde2dc2531e9ba59` |
| S04 [geo-hazard2015.pdf](https://data.geus.dk/pure-pdf/30674_GEUS-R_2015_24_opt.pdf)                                                                                                                                          | GEUS2015/24地震危险报告；历史危险背景，非2026无灾证明                      |  2,501,082 | `600052970769591c42e672da369217b724c8258dacf845cf77cf0004bca386de` |
| S05 [hofor2025.pdf](https://www.hoformedia.dk/pdf/2026/hofor_aar_2025_08-04-2026-a-wcag.pdf)                                                                                                                                  | HOFOR2025观察；文件名2026-04-08非首发认证，报告内2026状态/未来项目分列     | 17,857,616 | `8d6ef9e606e3762e717923319fd4e553150eecd81dc272b7b24b78ab07e4f63a` |
| S06 [drought2026.html](https://www.hofor.dk/nyhed/toerke-vi-bruger-meget-mere-vand-end-normalt-hjaelp-os-med-at-spare-saa-der-er-nok-til-alle/)                                                                               | HOFOR2026-06-25当季压力/节水警告                                           |    295,917 | `9c2c7c42cd7ce1ae22298ed80f562102f2f6be2498e4819b38f39f031971da3e` |
| S07 [water-plants-jan2026.xlsx](https://www.hofor.dk/wp-content/uploads/2026/07/stor_kontrol_januar_2026.xlsx)                                                                                                                | HOFOR；2026-01-05—28各点采样，URL目录July非采样日                          |    133,983 | `9a14117e2ff50b50b24fb04d0d6dfd6251bd46298036c2f8ac63f406e1f02038` |
| S08 [police2025.pdf](https://politi.dk/-/media/mediefiler/kbh/dokumenter/virksomhedsberetninger/vb2025_final_web.pdf)                                                                                                         | Københavns Politi2025实际案件/执行；当前2026年报，首发未独证               | 10,646,554 | `10b9a6f564c1a94af7f665444bf1a337a4077b156009ee9fdd37151e2dda620f` |
| S09 [hbr2024.pdf](https://hbr.dk/wp-content/uploads/2025/04/2025.05.08-bm-pkt.-5-bilag-1-aarsberetning-2024-1.pdf)                                                                                                            | HBR2024观察、2025会议附件；PDF题名/文件2024，搜索旧题名2020不用            |  2,234,744 | `a0a0c4ea4f9dd435ab07ea80f690d45e4941299ad07197ceffbe2346d2c3a10d` |
| S10 [threat2026.pdf](https://www.fe-ddis.dk/globalassets/fe/dokumenter/2026/trusselsvurderinger/-assessment-of-the-threat-from-russia-.pdf)                                                                                   | DDIS2026-09-24当时威胁判断；不是已发生战斗                                 |    169,677 | `ec7d11ebcf6ad30a9962bde3f12dec34057b0ae193ea2ceff4c1e5efbd89a66c` |
| S11 [drone-update2026.html](https://politi.dk/rigspolitiet/nyhedsliste/politiet-har-styrket-indsatsen-paa-droneomraadet/2026/06/25)                                                                                           | Rigspolitiet2026-06-25；回顾2025-09-22关闭/调查和已加强措施                |     45,501 | `b4aac5fe3952b596f7ee3f32cbe37b116c7c3ccabe9b603674601004dfd7c90d` |
| S12 [ombudsman2025.html](https://www.kk.dk/nyheder/borgerraadgiverens-beretning-2025)                                                                                                                                         | 行政市2025申诉结果、2026-05-06委员会审阅；网页首发未标                     |     65,027 | `a559c6c082b2ce3e2cf7b0624c2f3371b9273a2ddbf6cb79c0b344400139cd24` |
| S13 [digital-help.html](https://www.borger.dk/hjaelp-og-vejledning/hvad-har-du-brug-for-hjaelp-til/digital-post/fritagelse-fra-digital-post)                                                                                  | borger现行豁免/纸本办理，页面版本日未标、截止前延续推定                    |     68,947 | `4a3a2f1dcae170a216745291dc8de28a1ac8589d524b0c0e9f4e9d506d823c5d` |
| S14 [safety2026.pdf](https://www.kk.dk/sites/default/files/2026-06/K%C3%B8benhavns%20Kommunes%20Tryghedsunders%C3%B8gelse%202026.pdf)                                                                                         | 行政市；调查2025-12-02—2026-02-03、文件目录June2026；原响应分母冲突保留    |  3,090,391 | `f5241fe0bc92ca1090a682b10d72789dbe41ee1390ca744dca72c8e4be8f88a6` |
| S15 [market.html](https://copenhagenmarkets.dk/da)                                                                                                                                                                            | Copenhagen Markets当前营业/经营者；未标首次发布与观察日                    |     48,806 | `142d6c7fb9523aeaf9217ecd1eadc4f07b8c47d7ac703e8df2e7db0ac82a354b` |
| S16 [salling2025.html](https://sallinggroup.com/nyheder/international-vaekst-loefter-salling-group-til-historisk-niveau/14899554)                                                                                             | Salling第一方；2025实际集团/全国业务，2026-04-27发布                       |    401,850 | `b086019fcfa8a17ddc3c7d978371fd5b168c01c7289562e9e01df763b9a0717f` |
| S17 [cpi-aug2026.html](https://www.dst.dk/da/Statistik/udgivelser/NytHtml?cid=52440)                                                                                                                                          | 统计局Aug2026全国指数；2026-09-10公布，非Sep2026迟发数据                   |    460,685 | `80fffcfa95c09868cffb5c929b37aba82c6350d5a4e9151ea1f449bc4c6045ad` |
| S18 [power2025.pdf](https://aarsrapport.andel.dk/wp-content/uploads/Andel-Baeredygtighedsrapport-2025-tj8.pdf)                                                                                                                | Andel2025集团供电观察、2021–2025趋势/除外；2026报告首发未独证              |  5,463,049 | `bf48fe09d9830c03e0ea5f6922abdb705f3e0ffc0f1be602ace5bf815f4879ad` |
| S19 [bridge2025.pdf](https://downloads.ctfassets.net/20drd9bf6f7p/eqhINaZlNMywie3FXhks5/1ad8f86a27e05a678c6b26e8854a8bb5/9946_%C3%A2__%C3%83_BK_A%C3%A2__%C3%83_rsrapport_UK2_2026-03-20.pdf)                                 | Øresund运营商2025；官网列2026-03-20发布                                    | 12,968,117 | `a925131d0df1f2f71beedc597d74537a99f9d0044983d6195d55f6ce8dab073c` |
| S20 [dsb2025.pdf](https://www.dsb.dk/globalassets/arsrapport/2025/annual-report-2025.pdf)                                                                                                                                     | DSB2025年运行、全国干线/区域与本地国际路线不同范围；2026年报               | 11,763,302 | `3b097ae906136227564c2c98a0cee785409fae10c3110c9220a53c74240bc091` |
| S21 [hip-actual2025.pdf](https://www.sundk.dk/media/iswnxpzm/drhofte-aarsrapport-2025_offentliggjort-version.pdf)                                                                                                             | SundK2026-05-27公开版；2024-12-01—2025-11-30，病例/指标窗口分别核          |  6,578,254 | `1a0b046d3bca6840e4fb7314735a6c18c5ba99d1de4df6b946544f8267809ee0` |
| S22 [healthcare2026.html](https://lifeindenmark.borger.dk/healthcare/health-insurance/healthcare-when-working-in-denmark)                                                                                                     | Udbetaling Danmark/STPS原办理；更新2026-06-11、不是全部居民参保统计        |     80,217 | `51af28c3cf2f6a331cc2fe9c1898c1fd47c3e5b0a05405d77d3c1bf6b3b47d80` |
| S23 [health-card.html](https://lifeindenmark.borger.dk/healthcare/health-insurance/health-insurance-card)                                                                                                                     | borger现行医保卡/GP办理；日期未标，通常资格/延续假设                       |     62,353 | `cc608c06a16403c2247fa64abf2a18b0bef12b2b6643dc3ae6184bcfa8a70caf` |
| S24 [wait-rights.html](https://admin.ism.dk/sundhed/patientrettigheder/ret-til-hurtig-udredning-frit-sygehusvalg-og-udvidet-frit-sygehusvalg-)                                                                                | 主管部现行权利；明确2025-01-01躯体治疗30日恢复，页面日期未标               |     44,211 | `1fadede485b557e7eb2d92493f973ae0d38190cceab7f2486510d1bddad5c608` |
| S25 [cart-quality2025.pdf](https://vip.regionh.dk/VIP/Redaktoer/130110.nsf/vLookupUpload/ATTACH-RHAP-DGBE4F/%24FILE/01-05-25_Shared_QM_Program.pdf)                                                                           | Rigshospitalet程序；April2025 v1，文件01-05-25，2019实际开办与现行单元分列 |    663,053 | `a0c634a44d678604710d907f9761296e2d073d6d46e339fab8f46bd7a0a26c27` |
| S26 [ku2025.pdf](https://om.ku.dk/tal-og-fakta/aarsrapport/Annual_Report_2025.pdf)                                                                                                                                            | KU2025年报；商业化2025、WoS论文2024/spring2025登记；首发未独证             |  1,971,278 | `9bad8c4466c10bf0ad7011c85e521bc360bc5adb3f087a109ed2ffe3fe14e64d` |
| S27 [liso-adoption2025.html](https://medicinraadet.dk/anbefalinger-og-vejledninger/laegemidler-og-indikationsudvidelser/l/lisocabtagene-maraleucel-breyanzi-diffust-storcellet-b-celle-lymfom-dlbcl-3-linje)                  | Medicinrådet批准2025-03-26、更新Mar27；第三线限定推荐                      |    229,453 | `85680ae69a66b29755a7cbb90d32e6070fe8da8b70ef3b3b8c29d2095cd40e1e` |
| S28 [cart-current2026.html](https://medicinraadet.dk/anbefalinger-og-vejledninger/laegemidler-og-indikationsudvidelser/c/ciltacabtagene-autoleucel-carvykti-knoglemarvskraeft-rrmm)                                           | Medicinrådet cilta-cel v1.1批准2026-06-24、更新June25；渐进实施            |    232,947 | `9f66662a7d0af7152d9bf55360fb0e8ad4160519307c99c3ddc7072028e29a4c` |
| S29 [lecanemab-decision.pdf](https://filer.medicinraadet.dk/media/uvbddpg0/medicinradets-anbefaling-vedr-lecanemab-til-alzheimers-sygdom-vers-1-0.pdf)                                                                        | Medicinrådet2025-12-17 v1.0批准；ICER非患者账单                            |    297,297 | `905729b85a1df5bd741d84059fc5ee442db24b4ea6a90d8e7aabd7cd0dff5e78` |
| S30 [donanemab-current.html](https://medicinraadet.dk/igangvaerende-vurderinger/laegemidler-og-indikationsudvidelser/donanemab-kisunla-alzheimers-sygdom)                                                                     | Medicinrådet更新2026-09-21；在审、预计Nov25是未来                          |    222,297 | `b0bdbe728ce6174e3ca3dffff0e956866d7d80616d5ed323721c65dd2000dc12` |
| S31 [dtu2025.pdf](https://www.dtu.dk/-/media/dtudk/om_dtu/strategier-og-politikker/aarsrapporter/web-dtu_aarsrapport_2025.pdf)                                                                                                | DTU2025实绩；2026-04-21公开，July8勘误只薪酬补充                           |  4,973,157 | `5eb5d0277edf4415e3342cdda5558992f7c2ca52e9eda460939088d458cd1e0b` |
| S32 [tdc2025.pdf](https://tdcnet.com/media/ftyfdjmd/tdc-net-annual-report-2025.pdf)                                                                                                                                           | TDC NET2025集团/全国；测评2025-02-26—03-26与年末覆盖/footprint不同         |  8,175,594 | `2ca9a4da20458f8003d6d0c9fb41e0035cc2ea62eb1fb4f014110238e025ea68` |
| S33 [digital-infrastructure2025.html](https://www.digmin.dk/digitalisering/nyheder/nyhedsarkiv/2025/mar/danskerne-vinker-farvel-til-kobbernettet-og-faar-hurtigere-internet-)                                                 | 数字化部2025-03发布，主要观察2024H1、铜网迁移非2026实绩                    |     33,376 | `a9911416b0d0a778f7392d55e2c860046fdd01e8f90ec09593403e165d73e26e` |
| S34 [digital-usage2025.html](https://www.dst.dk/da/Statistik/udgivelser/NytHtml?cid=51815)                                                                                                                                    | 统计局2025居民使用调查、2025发布；人群/年龄选择不移植本区                  |    484,183 | `d121f7bd006198fd820dbedd994b447109d59888f1cf03e0d4027e62de4b35f7` |
| S35 [german-eu-law.reused.html](https://www.gesetze-im-internet.de/freiz_gg_eu_2004/BJNR198600004.html)                                                                                                                       | 德国法最新显示2026-07-16；原取回Oct12、本轮Oct13重核SHA/适配               |     75,349 | `b53478451d8605d7b5b31aeee028542c9d415df2dedfef634e66a0d60433c0fe` |
| S36 [bank-transfer.html](https://danskebank.dk/privat/find-hjaelp/betalinger-og-overfoersler/opret-overfoersel-til-en-udenlandsk-konto)                                                                                       | Danske Bank当前个人跨境手续；首发/本版本未标、截止前延续推定               |    303,995 | `57ea4df3272e86853926aa6ed72d510a28640a544ec74d640cb04086c7c08ba2` |
| S37 [nationalbank2025.html](https://www.nationalbanken.dk/da/viden-og-nyheder/publikationer-og-taler/rapport/2026/overvaagning-af-den-finansielle-infrastruktur-2025)                                                         | 中央银行2025实际清算/故障与2026发布回顾，未来跨币种接入另列                |    239,206 | `f55ac285e0248298a0bbdfc6dd3344e7683c66702ceac2c207b34a6fd9b37456` |
| S38 [roaming.html](https://www.telenor.dk/shop/landingpage/mobil/roaming/)                                                                                                                                                    | Telenor现行消费产品；版本/首发未标、非逐居民海外使用记录                   |    403,556 | `c5556a39361878787440916faa24082fe08f8ce93d2349b34a97ec51bde18e0b` |
| S39 [water-price2026.html](https://www.hofor.dk/privat/priser-paa-forsyninger-privatkunder/priser-paa-vand-2026/priser-paa-vand-i-koebenhavn-2026-privat/)                                                                    | HOFOR声称2026-01-01价、仍待批准文案和49.57/49.56冲突保留                   |    316,705 | `bb4092d09623373bdb7ce1a32cac39179c83baa42a15e5fb2ad7005d73ae0cdf` |
| S40 [metro2025.pdf](https://metroselskabet.euwest01.umbraco.io/media/uighokcz/200426-annual-report.pdf)                                                                                                                       | Metroselskabet2025实际旅次/运行、2026年报，futureM5另列                    |  3,496,322 | `1ffad7e30d9bfaa3f1f00831c0d94fb5cf5064a756c4892798f650565d7749e8` |

DTU勘误原件也有效：`dtu-correction2025.pdf`，2026-07-08，149,090 bytes，SHA256 `c8e6db4c11e5a3e03c51cfb21a4391e00d8469f93963749b780fe9f8c6f33895`；[官网原URL](https://www.dtu.dk/-/media/dtudk/om_dtu/strategier-og-politikker/aarsrapporter/rettelsesblad-til-dtus-aarsrapport-2025.pdf)。不作独立科技产出。

| web-only原出处                                                                                                                                                                        | 真实时点/用途                                                                              | 原bytes | 原SHA  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------- | ------ |
| W01 [Rigshospitalet真实CAR-T](https://www.rigshospitalet.dk/presse-og-nyt/nyheder/nyheder/sider/2021/marts/boern-med-fremskreden-leukaemi-i-car-t-behandling-paa-rigshospitalet.aspx) | 2021-03-11，4例9–24岁实际治疗；当前原站web正文可读                                         | 未取得  | 未取得 |
| W02 [Rigshospitalet转诊](https://www.rigshospitalet.dk/afdelinger-og-klinikker/kraeft-og-organsygdomme/blodsygdomme/for-fagfolk/Sider/henvisning-til-car-t.aspx)                      | 更新2025-09-23，电子转诊与每周委员会；非批准率                                             | 未取得  | 未取得 |
| W03 [SST CAR-T专业计划原PDF](https://www.sst.dk/media/esempdii/regulering-af-car-t-i-specialeplanen.pdf)                                                                              | 2023-09-21；web文本第4页12例至Feb2023，第2页副作用/首月两小时范围，未取得本地有效PDF目视   | 未取得  | 未取得 |
| W04 [行政市海潮原说明](https://www.kk.dk/sites/default/files/agenda/eef2ae6b-2b1f-4285-b704-b2c1f84e9dd1/511818da-1129-488b-80da-fa5314efaf00-bilag-6.pdf)                            | 2026-02-17；主管原文web可读，直取404，规划/资金和现役分开                                  | 未取得  | 未取得 |
| W05 [CPH实际2025交通](https://www.cph.dk/en/about-cph/press/news/2026/03/rising%20passenger%20numbers%20drive%20growth%20at%20copenhagen%20airport)                                   | March2026发布、观察2025；web原运营商正文，直取403                                          | 未取得  | 未取得 |
| W06 [首都区LUP2025评议](https://www.regionh.dk/politik/nye-moeder/Sider/Moede-i-sundhedsudvalget-den-1-juni-2026.aspx)                                                                | 2026-06-01会议，观察2025患者体验；原检索正文可读、直接读取受security challenge，非临床结局 | 未取得  | 未取得 |

| 失败requested URL/保存响应                                                                                                                                                     | 本轮实际读取状态                                                             | 原文bytes/SHA | 处理                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------- | ------------------------------------- |
| [cart-actual2021.html](https://www.rigshospitalet.dk/presse-og-nyt/nyheder/nyheder/sider/2021/marts/boern-med-fremskreden-leukaemi-i-car-t-behandling-paa-rigshospitalet.aspx) | curl exit 0 / HTTP 200；所收响应 60,879 bytes，错误/截断hash另在manifest     | 无有效原文    | 不用于原件认证；停止本轮重复尝试      |
| [cart-referral2025.html](https://www.rigshospitalet.dk/afdelinger-og-klinikker/kraeft-og-organsygdomme/blodsygdomme/for-fagfolk/Sider/henvisning-til-car-t.aspx)               | curl exit 0 / HTTP 200；所收响应 67,595 bytes，错误/截断hash另在manifest     | 无有效原文    | 不用于原件认证；停止本轮重复尝试      |
| [cart-regulation2023.pdf](https://www.sst.dk/media/esempdii/regulering-af-car-t-i-specialeplanen.pdf)                                                                          | curl exit 0 / HTTP 429；所收响应 33,989 bytes，错误/截断hash另在manifest     | 无有效原文    | 不用于原件认证；停止本轮重复尝试      |
| [cph2025.html](https://www.cph.dk/en/about-cph/press/news/2026/03/rising%20passenger%20numbers%20drive%20growth%20at%20copenhagen%20airport)                                   | curl exit 0 / HTTP 403；所收响应 525 bytes，错误/截断hash另在manifest        | 无有效原文    | 不用于原件认证；停止本轮重复尝试      |
| [hip-actual2025.pdf.attempt1](https://www.sundk.dk/media/iswnxpzm/drhofte-aarsrapport-2025_offentliggjort-version.pdf)                                                         | curl exit 28 / HTTP 200；所收响应 4,357,532 bytes，错误/截断hash另在manifest | 无有效原文    | 不用于原件认证；后续同URL完整重取成功 |
| [lup2025.html](https://www.regionh.dk/politik/nye-moeder/Sider/Moede-i-sundhedsudvalget-den-1-juni-2026.aspx)                                                                  | curl exit 0 / HTTP 200；所收响应 62,639 bytes，错误/截断hash另在manifest     | 无有效原文    | 不用于原件认证；停止本轮重复尝试      |
| [stormsurge2026.pdf](https://www.kk.dk/sites/default/files/agenda/eef2ae6b-2b1f-4285-b704-b2c1f84e9dd1/511818da-1129-488b-80da-fa5314efaf00-bilag-6.pdf)                       | curl exit 0 / HTTP 404；所收响应 50,994 bytes，错误/截断hash另在manifest     | 无有效原文    | 不用于原件认证；停止本轮重复尝试      |
| [stroke2024.pdf.attempt1](https://www.sundk.dk/media/c2vlyly0/danstroke_aarsrapport-2024_til-offentliggoerelse_300625.pdf)                                                     | curl exit 28 / HTTP 200；所收响应 2,519,040 bytes，错误/截断hash另在manifest | 无有效原文    | 不用于原件认证；停止本轮重复尝试      |
| [tdc2025.pdf.attempt1](https://tdcnet.com/media/ftyfdjmd/tdc-net-annual-report-2025.pdf)                                                                                       | curl exit 28 / HTTP 200；所收响应 3,148,024 bytes，错误/截断hash另在manifest | 无有效原文    | 不用于原件认证；后续同URL完整重取成功 |

有效但不作为所声称临床底表的材料：`regional2024.pdf`实际是财务审计附件，不是临床年度实绩；`hipfracture2025.pdf`实际题名为**家族性高胆固醇血症**、2024-07—2025-06/15Dec2025版本，误定位名不当骨折证据。二者原响应有效、SHA在manifest，排除本文治疗率主张。`stroke-index2025.html`只是原登记入口；数字年报未读到临床底表，2024 PDF传输截断不采用。索引、`hofor-local2025.pdf`和`climate2025.pdf`保留有效原件但不是额外独立佐证；后者实际October2025气候报告主要回顾2024，未按搜索摘要冒充2025全年气象。

关键目视保存：髋骨折p14/48/50/61/93、HOFOR p26、Andel p33、调查p4、lecanemab p2、CAR-T质量手册p5及DMI气候/海潮图表；所有图片仍为原报告的派生阅图，未修改原字节。XLSX从标准OpenXML直接解码，未将提取JSON当原表。
