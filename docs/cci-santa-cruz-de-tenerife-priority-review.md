# Santa Cruz de Tenerife eFUA 395：八维有界审阅

**候选 PCS/GSS/ISR/RES/MED/LON/TEC/OPT＝null/null/60/null/null/null/60/60。** 原权重已知加权小计 **21**；未知65%，范围 **21–86**，没有完整条件中心、不取中点、不重归一、不宣称全球入围。31语义键逐项核已有资料：**23 partial、4 context、4 unresolved**；partial包含旧窗口/局部能力，状态不是充分审阅、子项得分或全人口测量。

评价2026普通Spanish本国公民、通常长期居民、当地中位收入、通常Sistema Nacional de Salud/Servicio Canario de la Salud保障。截止 **2026-10-10**，实际取回和复核 **2026-10-13**。沿用[共同rubric](cci-global-scoring-rubric.md)、[31语义](cci-global-indicator-contract.md)、[权重](cci-research-model-v2.md)及[Coventry](cci-coventry-priority-review.md)/[Edinburgh](cci-edinburgh-priority-review.md)同层根纠偏；不继承国别或其他西班牙城市分数。按[research技能](/Users/morris/.agents/skills/research/SKILL.md)作为已分派后台任务完成，无再派代理、联系机构或提交。

由[冻结全9031探索](data/cci-research-priority/priority-all9031-v2.csv)主五场景≤40且十场景齐全、排除已审/交接者安排：395十场景最差72；这是研究调度，不是CCI名次/CCI32阈值。最多两轮定向发现后收口；随后只沿已定位原件/href跟读。允许明示通常取得/净負担/代表性/时点延续推定，不新增完美中位账单、全人口质量普测或每节点压力测试门槛。

## 身份、全9031与服务范围

重新完整读取9,031 GHS几何，原GPKG **9,932,800 bytes**，SHA256 `9934364827132232df67e8984768fb30865a846f5a786db999d49fc37fb7698d`；395/Santa Cruz de Tenerife/ESP，**385km²**、旧UC1488、2015模型人口464,579.09仅识别非2026分母。ESRI54009 bounds `[-1522000,3445000,-1498000,3477000]`，target WKB SHA `8f4e7e57f92b11054c5feab7628fc59b27c2dc721dfbf1fa08d866d701f75dfd`；原记录在 `/private/tmp/cci-global/santa-cruz-de-tenerife/boundary-record.json`。

EPSG4326→ESRI54009、always_xy，对全9031 covers 的**分析者近似点**：Santa Cruz/La Laguna中心、HUC/Candelaria医院、Tenerife Norte机场、Santa Cruz港、IAC Vía Láctea/IACTEC Mantecas、LaLaguna大学Guajara、CostaSur淡化、SanAndrés均395；**Teide观测台、LosRealejos/Puerto de la Cruz为236，Tenerife Sur机场无旧eFUA匹配**。不是官方设施全足迹、病例catchment/地面接续、行政市全部或全岛。LaLaguna不是按行政名外地而排除；IAC consortium含LaPalma/外区观测站，HUC服务统计含外区北部CAEs，EMMASA限SantaCruz市，不能全归395。

冻结探索行PGA **0.0248287g**，新版UC382旧热指标 **0天/年**；医疗机动 **0.60130分钟**/步行 **7.36237分钟**、缺模型人口16,873.51，不能写全部居民均短旅行。旧UC1488和新版382分开；热是旧十年日最高UTCI>32°C年平均，不是2026低热/夜间湿热；PGA参考岩石不含建筑/火山/坡地。fixed **349,242.55kbps**/mobile **159,788.72kbps**、5,060/1,025自选tests不是联网者分母、零断网或普及率；UCDP未匹配不是GSS安全。CSV原bytes/SHA与原行在screen-context.json，不新取底层气候/地震数据。

2026-10-13取回只证明本次bytes；网页未标首发不借URL/版权年认截止前公开。OCTSI题名2024却含2025新闻/未来项目，保留实际窗口；IAC实际2024、URL2025-12非观察窗。地方PEMU2.0**实际题名2015**，不能称2026新plan。现版截止延续为可撤回连接。

## 全31键及有限覆盖

| 维度 | 子支柱                    | 状态       | 支持/反证或未闭连接                                             |
| ---- | ------------------------- | ---------- | --------------------------------------------------------------- |
| PCS  | `heat_humidity`           | partial    | S09实际Aug2025热/火预防与37°C预测，不替全区暴露；旧热0仅context |
| PCS  | `flood_sea_level`         | partial    | S30旧沟谷/排水危险，S08 Claudia实际解除；主要现防护未闭         |
| PCS  | `geophysical`             | partial    | S30火山灰/坡地及缺catalog旧说明；现保护延续未闭                 |
| PCS  | `severe_weather_wildfire` | partial    | S08真实应急运行/S09禁火；非重大多灾有效性普测                   |
| GSS  | `organized_violence`      | context    | S14普通犯罪拘捕，仅context不等组织动员/受害率                   |
| GSS  | `regional_conflict`       | unresolved | 区域冲突/外溢与地方影响缓解未闭                                 |
| GSS  | `strategic_exposure`      | unresolved | 港口/机场/危险物背景不等战略威胁归因                            |
| ISR  | `governance`              | partial    | S12真实线下/电子交付，S13 admitted投诉135/184结案               |
| ISR  | `adaptive_capacity`       | partial    | S08预警部署解除、S12数字帮助和多渠道真运行                      |
| ISR  | `social_cohesion`         | partial    | S14受害者205新支持、S13未结49，非全社会信任率                   |
| ISR  | `emergency_recovery`      | partial    | S08 storm实际解除及S16断管恢复，强度/人数有限                   |
| RES  | `water`                   | partial    | S01多源/备蓄/S16断管恢复，非全FUA末梢质量率                     |
| RES  | `food`                    | context    | 港货/社会服务背景，普通日常食品负担与实际帮助量未闭             |
| RES  | `energy`                  | partial    | S15实际供给/储存、S25已认缺口及旧在建；现在缓解未闭             |
| RES  | `supply_chain`            | partial    | S17真实海运货量/储燃，来源库存与共同冲击受限                    |
| MED  | `access`                  | partial    | S28 Spanish resident公费认可，S29跨区补偿有资格/时限            |
| MED  | `routine_quality`         | unresolved | 申诉不是结局/独立质量审计，当前有限质量连接未闭                 |
| MED  | `specialist_capacity`     | partial    | S24真实多科、移植/透析/影像；外区CAEs分开                       |
| MED  | `system_continuity`       | partial    | S24实际家庭住院/统一病历，申诉取消/等待保留                     |
| LON  | `translation`             | partial    | S24实际CAR-T采细胞，非回输/获益已成                             |
| LON  | `trial_maturity`          | context    | CAR-T疾病人体背景，不有具体干预队列/终点                        |
| LON  | `regulatory_adoption`     | context    | generic CAR-T服务context，具体批准适应证/付款未核               |
| LON  | `resident_access`         | unresolved | S29通常补偿不闭具体干预实际得到/监护                            |
| TEC  | `knowledge_output`        | partial    | S23 IAC751国际论文，跨区机构总量不作本区率                      |
| TEC  | `industry_density`        | partial    | S23实际DRAGO/实验室/R&D合同，NDA不当售额/统一密度               |
| TEC  | `digital_infrastructure`  | partial    | S21当地metropolitan及区域宽带，不用全省率冒城市                 |
| TEC  | `diffusion`               | partial    | S12 62842电子登记/3180数字凭证与线下帮助，非全居民率            |
| OPT  | `transport_redundancy`    | partial    | S06机场+S17运输客+S26现公交；未实测独立共因                     |
| OPT  | `legal_mobility`          | partial    | S20 EU公民工作居留/三月登记，身份/就业条件保留                  |
| OPT  | `asset_portability`       | partial    | S27普通合法Euro跨境账户规则；不包全部资产/税/危机               |
| OPT  | `network_continuity`      | partial    | S21既有多海缆及老龄反证，普通连接延续推定                       |

## PCS：既得应对真实，旧危险与当前主要防护分开

S09 **6Aug2025**实际封闭LasMesas烧烤点，并实施岛级风险区禁烟、烟火/火花设备限制；>37°C/湿度<30%（500–600m以上）是预测/特定海拔，不是所有市区实测。S08 **13Nov2025 17:00**Claudia风雨后降至prealert、解除先前设施关闭，市方称少incidents并维持部署；不证明最大设计风雨或所有住户无损。两项是实际预防/恢复，不是仅列计划。

S30 2015原PEMU有跨岛火山灰、滑坡、河沟及排水缺陷等具体适配危险；chapter2 p25（物理43）目视暴雨/排水缺陷，chapter3 p24（物理88）目视火山影响与样本不足，p30（物理94）目视：基础加速度0.04g、研究0.06g/475yr与0.08–0.09g/950yr不同定义/窗口，不能静默改GEM0.0248g；旧报告说缺exposed-elements catalog、建议microzonation。这是2015披露，**不声称2026仍缺或违法**；跨岛灰/旧灾1909/1949/2002/2010/2014不造现受害率，计划要求年simulacro不当已完成结果。

**主null**：真实近期预防支持部分适应，但2015具体主要洪水/地质保护及改进到截止的连接未闭。既有计划/通常避险代表性与有效延续若足够可60；若已核显著危险与保护缺口仍主导可40。不能由旧缺口直接40，或低热/PGA加一次少incidents直接60/80；这是当前主要危险防护适配链的实质连接未知，非要求每建筑普测或每种危险必须同年实测。

## GSS：普通犯罪执法与组织/区域/战略语义

S14 2025警方p31目视 **354拘捕**含道路、伤害25、家暴58、威胁12等，类别是执法活动，不等354暴力组织、受害率或定罪。普通犯罪/港口危险物/机场事故与战略军事攻击不是一类；地方受害支持可用于ISR实际执行，不重复奖励GSS。

**主null**：组织动员/影响，区域冲突外溢、战略目标/影响缓解尚未闭；国家和平/EU背景、UCDP0与保护计划不能填完整60。共同rubric允许从相关威胁情景、覆盖与地方适配的低现实影响/缓解判断，不要求当地已发生战争或战略攻击才评分；本轮这些情景与适配证据仍未闭。未来补到具体适配的三条安全链可辨40/60；JSON alternatives=[]，不把缺资料写低风险或资料环境缺陷。

## ISR：实际多渠道交付与群体/记录缺口

S12 2025 OAIC报告p12目视实际 **100,739 presencial atenciones**、电子登记 **62,842**、发Clave1908/FNMT1272合计 **3180**；记录/凭证/咨询不是去重居民数。市七office、线上帮助让无技术/电子认证者可处理；LaGranja部分现场引导没有文档记录，明确覆盖限度。p12更正2024原65,278为105,504，不将修正当2025新增服务。

**原表冲突保留**：p5总行first-smile4028，逐office列为2715+606+684+530+1093+427+667=**6722**；逐office总回应=**7871**，源总行**7876**；其他三列539/170/440符合行和，源总行四格和=5177。源正文称从13,180下降**59.76%**，但7876/13180≈59.76%是留存比例、算术下降≈40.24%。不静默修成“统一高满意”，不由此直接判治理全失效；这是有限调查/质量记录异常，不把HappyIndex当全市信任。

S13 2025 IMAS p1目视 **185 expedientes=32 Diputado quejas+153用户reclamaciones**，184admitted、135resolved/49inprogress，**73.40%分母184**，不是185、全受助者或困境全部解决。旧124/89/35是2024，网页更新Jan2026不改观察窗。S03列“无服务质量统计”只是该公开栏目，不能认无内部监测/居民无电话线下渠道。S14 GRAMU实际新受害205、咨询2103、其他支持总4773为活动计数、可重复；表明真实少数群体帮助而非全部创伤已消除。

S08真实解除storm关闭、S16真实断管结束支持有限应急恢复，未知灾害强度/末梢人数不造全岛速度。**条件60**接受行政核心/适配地方执行和实际群体渠道对普通FUA居民的代表性、正常持续；投诉办理/统计异常/未结群体残余重要。若在帮助后仍主导可40，广泛触达与恢复强且残余小可80；拒绝代表性/截止延续则null。没有用国家WGI替地方治理。

## RES：多水源/备蓄和海运成立，能源变化不能用旧“在建”判当前

S01 EMMASA运营者原文：**30%外购/70%自有，约62%总产来自EDAM**，不是70%全地下水；38在用reservoir/**204000m³**及“平均>4天”是运营者容量/平均自治主张，非独立共同停电实测或每FUA户4天。40氯化点telecontrol、约40k m³/day及维护是运营路径，不创造末梢合格率；查漏到2020、排水清洁到2019的累计数不能当2026新测量。

S16 **14Sep2026**通知结束13Sep AvenidaVeinticincoDeJulio干管故障/停供，范围Rambla/Numancia/MéndezNúñez/Robayna，不是全市停水。标题写结束planned interruption，正文称avería；两者保留，没精确时间不能断言24h内/全部人恢复。水库/淡化/井及实际恢复是缓解，淡化/泵对岛网电力有共同依赖。

S15 2024能源原件按岛/municipio给真实供给、燃料存储结构；p54目视storage定义排除加油站/日罐/自用等，Tenerife柴油/燃料/煤油等占储存结构比例不是应急天数/已满库存。真实企业表不是全部在395。S25 **10Oct2025**原文承认Tenerife deficit并展示Granadilla应急备用施工，四组已装但仍construction；**8×1.8MW=14.4MW，正文总14.8MW**冲突保留，不择有利值。计划临时备用/未来移除不是现在已启动，亦不能当**2026仍未启动**。没有把LaGomera/LaPalma停电移植本区。

S17 **5Feb2026**报告2025港口真实12.4m吨traffic total、8.1m general/4.4m containerized/3.1m液体等不同层级可重叠，不相加、不是12.4m食品或本FUA库存。港口运行与多水源支持日常供给，普通食品/负担仅有限背景；未取得当地通常食品路径与补助交付净负担。**主null**：现在已知能源缺口如何缓解、通常资源负担/食品及共同依赖未闭；不是因无完美账单null。有效备用/通常可负担延续可60，已核共因或能源残余显著可40，当前不从旧施工公告猜档。

## MED：公费/服务/申诉原范围，不能以行政结案当临床获益

S28主管页面 **26May2025**更新，Spanish resident的public healthcare认可由国家机关负责；国籍/居住画像不替已完成认可/登记。允许普通合格保障和必要转诊净负担推定，非游客/所有外国人的自动资格。

S24 **27Feb2026**观察2025HUC真实23,480 admissions/19,176 surgery/588,136 face consultations。后者拆分本院377,202、四CAEs195,810、外部mentalhealth15,124合等588,136；**LaOrotava/PuertoCruz/HospitalNorte**服务不全395，不把全部作local病例或居民可及率。移植/光采血/透析/影像和家庭住院/统一临床病历是真实服务与专科/连续性；服务量及lab绿色认证不代替感染/死亡/安全合规或wait终点。

S05 ODDUS2025实际医院投诉：CHUC **12711**，consult-wait3850/surgery-wait1158/diagnostic-wait3019是申诉动机，不是全部候诊者/天数；HUNSC **15783**，对应7842/912/3426。chapterp27/p42（物理34/49）目视 **11845行政resolved+866pending**及**12226resolved+3557pending**，93.19%/77.46%是申诉处理，不是已得到治疗/治愈率。月表2months ontime分母是该月resolved，不是全部提交或所有诊疗及时；不把December pending当逾期两个月的已证数量。

申诉原因含诊断/配药/取消/罢工，是真实居民表达/服务压力，**未裁定控诉不作已证损害**。正文改录入/结案日期/归属规则和主动催>两月未答是实际问责缓解；81,953 vs70,340跨年投诉受记录方法影响，不机械推临床恶化百分比。S29 **6Oct2026**更新的跨区住宿/伙食补偿有预先授权/报销期/不足资源才预付，不假称一切搬院费用无负担。

**主null**：许可/通常净负担、实际专科和部分连续性成立，但当前常规质量/有效整改连接仍未知；不能用多服务量/短模型旅行填60，或把投诉数变整维40。需要一个有辨别力的当前质量/安全过程及相应改善适配，不要求全居民结局普查或完美个人账单。

## LON：本地采细胞不等具体干预当前回输/付款/监护

S24 HUC2025真实第一次oncohematology CAR-T linfoaféresis，以及photoaféresis治疗活动；不是只trial locator。前者是采细胞阶段，未给具体产品/适应证/人体终点、回输地点/患者普通居民公费资格及当前随访。第二轮已定位DrNegrín在GranCanaria的CAR-T背景，**未完成其原队列及到当地居民当前取得的验证，不将搜索摘要入分**。邻岛中心或采购计划不能直接当395实际采用。

S29主管现行跨区补偿适配residenceÁrea，需授权/必要过夜；2026住宿 **€106.94/person/day**、伙食 **€39**，第三月起上限 **€1900/month/person**，住宿/餐食已补助则对应不重复领取；不足资源及估计≥5days才可advance，报销三月内提交、15day/2month处理窗口是手续条件，不是实际每人按时收到。其存在支持潜在跨区资源缓解，**不等具体CAR-T已被批准、付费、生产回输和长期监护**。

**主null**：最小缺口为具体干预可信人体证据/采用与当前居民真实回输、付款/监护连接；不是因没有健康人延寿或全人口账单。闭通常合格公费跨区实施可60，实际重要制造/负担/资格断点可40，当前JSON alternatives=[]，不以采细胞/普通SNS补完整链。

## TEC：本地科研/工程真实，机构统计与广泛采用分开

S23 IAC2024原件物理p4、14、48目视（印刷p4–5、24–25、92–93）：**751国际期刊论文**是consortium年度总量、非全部本区/独立作者；期刊拆分103+334+175+7+9+123=751可复算，不按排名换分。LaLaguna总部/IACTEC在395，Teide/LaPalma等不全在；接受当地实际科研/工程节点代表持续能力而非给395全部论文归属量。

ALISIO-1在Dec2023发射后于2024完成commission/operation并产 **>50000 SWIR images**，DRAGO2技术与原型实验室2024设备已购/启用，是actual应用；DRAGO3 announced、IACSAT1 preliminary/SRR阶段不当已上线。12NDA/专利portfolio管理/R&Dcontracts说明合作/转化活动，NDA不是12商业产品、许可收入或所有企业已用；不把实验室环境测试能力当普通家用网络压力验证。

S21 OCTSI actual June2024 broadband：省FTTH89%/5GSA19%、岛FTTH92%不是395全覆盖；metropolitan3.5GHz及capitalSA/LaLaguna较限分开，p82实际地图只分75–100档不虚构精确城市率。p34旧海缆运营与理论年龄反证用于OPT共同依赖，TEC不因需要通信而重复加冗余分。题名2024但正文2025context/未完项目保留。

S12 actual 62,842电子登记、3180Clave/FNMT、线下帮助是真公共采用，不以高测速/网站存在代替；调查异常/未记帮助/技能认证依赖仍重要。**条件60，80可辩**：接受实际研究/工程节点和普通公共使用的代表性及延续；企业广泛采用/知识产业连接与群体设备技能残余仍重要。若实际扩散/帮助更广且残余小可80，重大产业/扩散断点可40；拒绝地域/通常接入延续则null。不能仅因主要源是IAC、缺更高许可额或AI封顶。

## OPT：真实海空出口、EU资格/Euro普通转移与海缆残余

S06 AENA **13Jan2026**原PDF目视2025 **Tenerife Norte7,174,977 passenger movements**，TenerifeSur13,969,678在旧区外，不把总Canary54m当本地或全部国际航次。S17本地port **3,042,731旅次**含约1.8m运输客与>1.1mcruise；cruise游客不当常规居民退出/移民名额。实际空气/海运多模式成立，未核灾时容量、天气共因或每条目的地班次；南机场点无匹配不等普通居民不能使用，但本轮未用其假定已接续。S26 **27Feb2026**主管说明Jan1实际免费地面公共transport，审核/资金待支付与未来承诺分开，不认全年已完成或民航/船票都免费。

S20 EU正式指南 **19Aug2026 lastchecked**：Spanish EU公民可在工作所在成员国居留，三月后登记需worker/self-employed证明、非保证马上就业/所有家属自动身份。S27 **28Apr2026 lastchecked** Euro跨境支付应与国内同类收费、SEPA IBAN非本国不能拒收、SCA/币种转换条件保留；**不称全部资产零税、危机无限提款或所有银行实际已办**。通常合法Euro账户、必要资金/设备/可承担接续支出是必要可撤回推定；不需完美中位账单才判断。

S21 p34目视既存Tenerife–GranCanaria/LaPalma多系统及2011Canalink等，历史commission日期是既存版本，不是2025全部新开；七Telefonica理论寿命超期、未来十年十二links>25yr，是年龄/依赖而非已坏/不再可用。与电网的共因保留；GranCanaria–Peninsula PENCAN-X、EllaLink资助或新环网计划不冒充本FUA已全独立路径。普通家庭接入可基于现地方/区域覆盖与公共使用作有限延续推定，不把机构网络直接当每户独立备援。

**条件60**接受通常Spanish公民身份/合法迁移情形、普通账户/网络/设备及可承担预算与正常海空/地面接续延续；法律、金融和通信链分别说明，没有用机场量+护照身份两项填全维。若共因/实际资金与手续显著阻断可40，真实独立替代有效且残余小可80；拒绝资格/资源/网络延续连接则null。

## 算术、最小缺口与停止

`60*.15+60*.10+60*.10=21`；PCS15%、GSS15%、RES10%、MED15%、LON10%未知，完整unknown0–100范围 **21–86**，不是置信区间/中心估计。ISR40减3、TEC/OPT40各减2；TEC/OPT80各加2。未来五未知皆60，中心60，不在当前代填。撤回任何通常/地域/版本推定，相应恢复null及原权重范围。

最小有辨别力缺口：PCS旧已知河洪/地质防护现在的适配与有效延续；GSS组织/区域/战略真实影响/缓解；RES已知岛网改变后的实际备用/食品通常负担；MED有限当前常规质量/整改；LON具体干预到合资格当地居民当前公费实施/监护。两轮后不无限搜更多规划、同源公司规模或病例宣传。剩余未知仍逐项记录，不称31项充分完成。

30有效原件bytes/SHA核过；IAC前两次40s截断 **6,423,891/7,528,731 bytes**完整失败记录仍留，第三次同href完整 **14,580,115 bytes**，没有覆盖旧文件/哈希，之后不再追。web两个timeout独立记录且后来curl原件成功；无能力/透明度扣分。同机制三失败即停；本次IAC是2fail后成功。18关键PDF图片已目视；索引/同源/冗余/失败/派生分开，不把原件数量当独立佐证。

仅自有MD和私有tmp，Prettier单文件；没有改共享caseJSON/UI/脚本、提交或部署，没有跑全站check/build。交接candidate-handoff.json沿Coventry现schema、8维/31键、所有null alternatives=[]；source-manifest.json及handoff-hashes.json在私有目录，等待根统一验收。

## 有效原件与窗口清单

实际取得/复核2026-10-13；具体观察/发布日期见正文。未标首次公开的当前网页以截止版本延续推定使用；索引并非单独能力证据。

| ID / 原件                                                                                                                                                                                                       | bytes    | SHA256                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| S01 [water-cycle.html](https://emmasa.es/sobre-nosotros/que-hacemos/ciclo-integral-del-agua)                                                                                                                    | 172496   | `47d5f46eee78d942682aa6b3f320e6d5946cd93306508e5ada43432e7385cfc3` |
| S02 [water-current.html](https://emmasa.es/)                                                                                                                                                                    | 714555   | `f9121e25708d2e6bb73d8ca01c14dc3bafb054dbc2be9dd14c3bbf3a5889fc73` |
| S03 [council-social.html](https://www.santacruzdetenerife.es/gobiernoabierto/transparencia/organizacion/atencion-social)                                                                                        | 176392   | `3ac91853dcb876ad228617d5ae72032287f1e6af88fd949fe64a673eaaadba86` |
| S04 [council-stats.html](https://www.santacruzdetenerife.es/gobiernoabierto/transparencia/estadistica)                                                                                                          | 27385    | `87203dbff3b0f1b48e4ff016e93a99e59228fb1c63740a86313c5ab4f1f43745` |
| S05 [user-rights2025.pdf](https://www.gobiernodecanarias.org/cmsgob2/export/sites/sanidad/oddus/documentacion/memoria-2025-TOTAL.pdf)                                                                           | 806140   | `522ced9c498df547f935d94c2022b850b6c9211e95d4b27f92289c1ebd3a81e1` |
| S06 [airport2025.pdf](https://www.aena.es/doc/detalleprensa/260113-can-estadisticas-2025.pdf)                                                                                                                   | 403829   | `b2f34595e0bc1f51cfc35bcbad5a536c88b30d56995d980e05f6e6dc3499e56b` |
| S07 [civil-protection.html](https://www.santacruzdetenerife.es/web/servicios-municipales/seguridad-ciudadana/proteccion-civil)                                                                                  | 126916   | `159f5ab606437931d1f3b211e915987b5b0742818eb84cfff869a72effd132c1` |
| S08 [storm-response2025.html](https://www.santacruzdetenerife.es/web/distritos-de-la-ciudad/distrito-suroeste/noticias/noticia/santa-cruz-actualiza-su-plan-de-emergencias-pasando-a-la-situacion-de-prealerta) | 83887    | `ac777d44ac7477bb959c28752bd215bc75173fe8dce9660116e337dae117d739` |
| S09 [heat2025.html](https://www.santacruzdetenerife.es/web/servicios-municipales/atencion-ciudadana/omic/noticias/noticia/santa-cruz-pide-extremar-las-precauciones-ante-el-aumento-de-las-temperaturas)        | 86959    | `9408c096af5e8cb299a16c281f8e168e8b38100370736cd6b4bd5d7ed40ca637` |
| S10 [police-index.html](https://www.santacruzdetenerife.es/web/servicios-municipales/seguridad-ciudadana/policia-local)                                                                                         | 85377    | `8bedf1a977796c2e1a9b0fa665e31d9f7bfb02abcc4e682919741c1303496dc6` |
| S11 [energy-index.html](https://www.gobiernodecanarias.org/energia/)                                                                                                                                            | 65726    | `aa2d1869544bc0c9bf12ef72309766a04b52fc1af3fcac92e9c0f8af994e80b0` |
| S12 [oaic2025.pdf](https://www.santacruzdetenerife.es/gobiernoabierto/transparencia/fileadmin/user_upload/web/Transparencia/estadisticas/OAIC_ESTADISTICAS_2025.pdf)                                            | 583150   | `0e3291223b61c1ba4a34669cfb6e19aa0323bf9b792bbcc4218936659fee66ed` |
| S13 [imas-complaints2025.pdf](https://www.santacruzdetenerife.es/gobiernoabierto/transparencia/fileadmin/user_upload/web/Transparencia/organizativa/imas/Sugerencia_reclamaciones_2025.pdf)                     | 208553   | `fa3fc3ec0283ba31f24458cf20b8fe6dc8e304acf3b20197ab28079bf84ea773` |
| S14 [police2025.pdf](https://www.santacruzdetenerife.es/web/fileadmin/user_upload/web/Servicios_Municipales/Seguridad_Ciudadana_y_Movilidad/Memoria_Anual_2025_Policia_Local.pdf)                               | 14870300 | `88f8f8f9076ef0268d75d5e5ec2fef83469456dca4001a8bb3c550a517e74ea1` |
| S15 [energy2024.pdf](https://www.gobiernodecanarias.org/energia/descargas/SDE/Portal/Publicaciones/AnuarioEnergeticodeCanarias-2024.pdf)                                                                        | 13083774 | `54a6910272254b06cc2a0fabbb0769893af537e27edc4af183eef8ed8217d0f8` |
| S16 [water-repaired2026.html](https://emmasa.es/-/averia-en-la-red-de-distribuci%C3%B3n-de-agua-potable-15)                                                                                                     | 146950   | `1df2f71f1198b7bde1e469f8865c111a75fc386d96b843c17c1e12274a4de1a2` |
| S17 [port2025.html](https://www.puertosdetenerife.org/el-puerto-de-santa-cruz-de-tenerife-cierra-2025-con-tres-millones-de-pasajeros-y-doce-de-toneladas-de-mercancias/)                                        | 84067    | `5b3ce142963bf1ff347c9189382fdc20f3eb42304674a975ddf750c1505dfcfc` |
| S18 [health-activity-index2026.html](https://www3.gobiernodecanarias.org/noticias/2026/02/27/page/2/)                                                                                                           | 140977   | `1131a321e054b06211a70022123dbe1c55f886d2674235b3d6170bb2b9bc8196` |
| S19 [energy-projects-index2026.html](https://www3.gobiernodecanarias.org/noticias/tag/emergencia-energetica/)                                                                                                   | 146827   | `dd98ed126bbb70fdda11ae12cb50bf6ba675d222501bb1cf374c14cefcb6a7bf` |
| S20 [eu-workers.html](https://europa.eu/youreurope/citizens/residence/residence-rights/workers/index_es.htm?expandable=3)                                                                                       | 153773   | `54562b9a16478edc915ec94f22aa2253378b04d90d5225ceac9576722387a5c3` |
| S21 [broadband2024.pdf](https://www.octsi.es/images/documentos/2025/informe_banda_ancha_canarias_2024_edicion_2025.pdf)                                                                                         | 12890906 | `9e44b79618d39725ffdbbdc65959d7f956d90b9fb748dc01802ec25c56abb5ab` |
| S22 [health-eligibility.html](https://www3.gobiernodecanarias.org/sanidad/scs/tematica.jsp?idCarpeta=ae273cd1-b385-11e9-82f7-8d5cff9227e6)                                                                      | 34485    | `94689d7317eb4020e4aea7cefa32ada5015cf7f2d94b124c5b21919cbc54c111` |
| S23 [iac2024-final-attempt.pdf](https://iac.es/system/files/documents/2025-12/memoria-anual-del-IAC-2024-ES.pdf)                                                                                                | 14580115 | `0223894a3f78e4cc9909d27c464faeed0b4235d4b14466934c7f3cbc809c721b` |
| S24 [huc-activity2025.html](https://www3.gobiernodecanarias.org/noticias/el-huc-atendio-mas-de-588-000-consultas-en-2025-mil-mas-que-el-ano-anterior/)                                                          | 83141    | `0792093ec4804cebcf670a8fdc6f407fd4a7983e88f70c7449c778ff86953fd1` |
| S25 [energy-project2025.html](https://www3.gobiernodecanarias.org/noticias/zapata-comprueba-los-avances-del-primer-proyecto-de-generacion-de-emergencia-de-disa-para-evitar-apagones/)                          | 82752    | `d180bcdc042bd78b8565282c624f1887bd6713c3638d63d00eef1ec798dfcf71` |
| S26 [public-transport2026.html](https://www3.gobiernodecanarias.org/noticias/canarias-presenta-al-ministerio-la-documentacion-para-garantizar-el-100-de-bonificacion-del-transporte-publico/)                   | 82785    | `acf0e8ef97a6b408f7171b9cf42f877bf0138b1444afffecbc492e361131a456` |
| S27 [eu-payment.html](https://europa.eu/youreurope/citizens/consumers/financial-products-and-services/payments-transfers-cheques/index_es.htm)                                                                  | 159632   | `8f0ff809d03f90531f7d8522f7eb2de9548d2ef20512e32dad800ef62473516c` |
| S28 [health-right.html](https://www3.gobiernodecanarias.org/sanidad/scs/contenidoGenerico.jsp?idDocument=00ffcea2-44ff-11e2-a5ba-c162420e469e&idCarpeta=ae273cd1-b385-11e9-82f7-8d5cff9227e6)                   | 36616    | `e511ddf5efbfc35e71ddb8926d392e7f21896465ec807270dc9946932c7c21c9` |
| S29 [health-travel-reimbursement.html](https://www3.gobiernodecanarias.org/sanidad/scs/contenidoGenerico.jsp?idDocument=69bab29c-3a3e-11de-ac1c-2ff2cc426c4d&idCarpeta=ae273cd1-b385-11e9-82f7-8d5cff9227e6)    | 35501    | `feb7e210eb5119fcd5d7f90967ed52679a86fe6858baf58f216a2c0ec4e80432` |
| S30 [pemu2.pdf](https://www.santacruzdetenerife.es/web/fileadmin/user_upload/web/Servicios_Municipales/Seguridad_Ciudadana_y_Movilidad/PEMU_2.0.pdf)                                                            | 5935027  | `1103437c5ac41461eaef98fc66f8b2b99d1a8e1bddb1d7cfec7a2c66234c95ea` |

| 失败原件                                                                                             | 原响应/诊断                                                                                                                                                                                          | 失败bytes/SHA（不作原件）                                                    |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [iac2024.pdf](https://iac.es/system/files/documents/2025-12/memoria-anual-del-IAC-2024-ES.pdf)       | 200 / application/pdf / https://iac.es/system/files/documents/2025-12/memoria-anual-del-IAC-2024-ES.pdf；exit28；curl: (28) Operation timed out after 40005 milliseconds with 6423891 bytes received | 6423891 / `df8187fbc15f62fe0770460488698270ebaf3083c2915d899fa0cbf69f92c4b6` |
| [iac2024-retry.pdf](https://iac.es/system/files/documents/2025-12/memoria-anual-del-IAC-2024-ES.pdf) | 200 / application/pdf / https://iac.es/system/files/documents/2025-12/memoria-anual-del-IAC-2024-ES.pdf；exit28；curl: (28) Operation timed out after 40006 milliseconds with 7528731 bytes received | 7528731 / `205a0baea6a9759caf2d710ba8c8842f4236b9a8d4b7b837bd8a4daaf98c3294` |

web-only失败：市estadistica及atencion-social初次open timeout400；不设原件bytes/SHA，后续curl有效原件另列S03/S04，不擦失败。

## 根代理统一验收

2026-10-13独立核30份有效原件bytes/SHA、完整9031目标几何及15个近似参考点；目视2015地震保护缺口原范围与ODDUS2025投诉月表。接受ISR／TEC／OPT条件60，其余五维未知，域21—86，无中心。旧防灾缺口不自动持续为2026失效、旧在建能源不自动已运行或仍停用；行政结案不等治疗完成、本地采细胞不代实际回输／普通支付监护。科研工程与公共数字实际采用保留空间／通常居民推定；GSS未知是本轮情景与适配未闭，不要求先发生战争。
