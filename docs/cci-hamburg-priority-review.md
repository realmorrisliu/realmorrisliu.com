# Hamburg3793：真实运行链支持四维附条件60，医疗等四维保留未知

建议八维为 **[null, null, 60, null, null, 60, 60, 60]**；权重顺序PCS/GSS/ISR/RES/MED/LON/TEC/OPT为15/15/15/10/15/10/10/10。已知加权27，未知权重55，区间 **27–82**，无中心。LON的本地适应证、通常支付与连续监护净资源连接是可撤研究判断，交根独立裁决；撤回LON后为21–86。不是全球排名、概率或入围结论，零排除，全部未评城市继续保留。

固定输入HEAD `2dce2ecae6df1d77f7a87be0b073cc2938c1b993`，70案、16完整。画像为2026普通德国本国公民、通常当地长期居住、中位收入、通常有效保障、无固定年龄，证据截止2026-10-10。没有把筛查推荐当作得分，不从其他德国城市移分。所有工作在本目录，仓库无写入；根可逐城验收发布。

## 先解释最影响方向的连接

### MED：实际帮助与实质余障并存，尚未裁通常必要护理40/60

**实际护理和普通支付确实存在。** H05物理20/印18的2024全住院69717、部分住院10340、门诊337472是case而非去重本地居民或疗效。物理52–53记三级全面急救、24小时心导管/卒中取栓设备和急诊附设门诊。H04物理4/印6–7要求普通医保卡、转诊/住院单及ID，并列自选单间/主任医师等额外服务，因此不是只有国际自费入口；手册有2021停车旧信息，不当全2026价目。

适用的[SGB V正式法条](https://www.gesetze-im-internet.de/sgb_5/BJNR024820988.html)第27/39条覆盖必要诊疗、药品、住院护理、食宿与出院衔接；第39(4)/61条规定达到法定年龄的住院自付10欧/日、每年最多28天，第62条是法定自付年收入2%或符合条件慢病1%的限额，仍须符合手续与疾病要求，私人加项/全部支出不因此封顶。该人口画像下，完整住院服务票价通常不直接成为家庭的全额自付；这是有法律、当地普通接诊和实际护理共同支撑的有限通常支付桥，不需要每个病例票据。原件当前整编最后修法2026-10-06，仍不认证Oct10历史同字节。

**较好结果和反证必须同时保留。** 以下是[UKE正式2024质量原件H05](https://www.uke.de/dateien/einrichtungen/qualitaetsmanagement-und-klinisches-prozessmanagement/dokumente/qualit%C3%A4tsberichte/260200013-773675000-2024-xml.pdf)的实际结果，非医院声誉，亦非全部指标已审：

| 物理页／印页     | 实际指标与解释                                                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 394–395／392–393 | 胆囊切除后30日手术引起胆道并发症：N175，观察0、预期2.30，O/E0，CI0–1.09，参考≤1.15。不是全部胆囊结局或零医疗风险。                                       |
| 408–409／406–407 | 住院新发压疮风险调整：N58634，观察360、预期166.14，O/E2.17，CI1.95–2.40，高于模型预期但仍≤报告2.45参考值。不能称全失控，也不能把过参考值当唯一质量定义。 |
| 432–433／430–431 | 骨折后髋关节置换的间接并发症：N90，17观察/12.58预期，O/E1.35，CI0.87–2.02，参考≤2.08。                                                                   |
| 458–459／456–457 | 骨折金属固定术后出院不能行走50米：N24，6观察/1.28预期，O/E4.70，CI2.26–8.44，参考≤2.37；报告代码U62未独立释义，不擅自解释为质量差或已整改。              |
| 498–499／496–497 | 起搏器植入后一年内需再手术问题：N261，18观察/11.07预期，O/E1.63，CI0.99–2.50，仍≤2.54参考。                                                              |
| 690–691／688–689 | 足月新生儿死亡或危重复合项：N2536，36观察/18.43预期，O/E1.95，CI1.41–2.69，≤2.32参考；不是单独婴儿死亡率。                                               |
| 902／900         | StrokeUnit5D护理下限的**班次符合率**白班84.15%、夜班31.69%；相邻骨科/外伤科班次95.90–100%。不是护士人数、患者受伤率、死亡率或2026当前全院比例。          |

前述支付缓解和实际广泛护理使“全部必要护理通常难以取得”的40不能仅凭异常项成立；但功能结局和护理配置是实际重要余障，不能被服务量、若干参考范围内结果或法定保障抵消。**在已读有限材料内部，护理问题经过实际缓解后的通常影响仍有不同合理解释**：可能是总体可用而存在重要局部缺口，也可能已构成通常必要护理的重要限制。这是相邻档位的实质未解，保留null；不是要求全市、全医院、全年龄或2026完美结局后才准评分。没有把U62、统计阈值或旧缺陷当自动40，也不假设这些问题持续/消失于2026。

### LON：同产品人体成熟、本地实际给药与通常净取得的有限连接

H05物理1030/印1028明确2024年已实施OPS `6-00h.0` Axicaptagen ciloleucel **10个编码case**。物理1045/印1043还明确`6-00h.5` Tisagenlecleucel给药行，数量隐私抑制；不能由“Datenschutz”倒推1–3人、当地常住、年龄、病种、治疗结果或付款。另有4/5条Axi编码行未求和为独立病人。物理942/印940的ANT01是本地整个ATMP类资格，列成人及儿童B前体ALL、成人B细胞淋巴瘤/骨髓瘤等，**不直接证明该Tisa行患者就是ALL**。

[H02实际临床叙事](https://www.uke.de/landingpage/zukunftsplan-2050/medizin-der-zukunft/02-lebende-medikamente-car-t-zell-immuntherapie.html)页脚明确最后改于2023-09-27，纠正批29“未署日期”描述；约80自2019治疗不是2025/2026新增人。其实际跨专业输血、重症、神经、血液肿瘤协作和副作用准备是监护连接；送外部厂家制造带来等待且病情可能恶化，是必须保留的反证。未来现场制造/现成细胞未当已完成。

成熟人体资料仅采用已逐字验证的[G-BA Tisa2024正式原件](https://www.g-ba.de/downloads/92-975-7153/2024-02-15_Amendment-G-BA_Tisagenlecleucel_D-976.pdf)，物理6明确获批难治/复发B细胞ALL、≤25岁，phase II与IIIb、长期随访至2022数据截点。物理8的ELIANA N80、6个月内CR/CRi67；48/54月RFS53.7%以响应者为条件，不能说全部80人的治愈率。物理10给药至8周N69的任意不良事件69、3/4级50、严重39，不能说均由药物导致；与后段N60/预处理N63分开。**这些疗效不移给Axi、所有成人淋巴瘤或健康人延寿。**

建议60所用的必要可撤桥是：本地已实施Tisa、具该ATMP类ALL资格和已运行团队，可接到该获批疾病/年龄条件内的成熟路径，并在截止日延续。这个具体适应证运行连接是有限推定，不冒充原件已证明那行患者的病种。普通有效GKV必要住院、药物、护理/食宿和出院衔接使完整药品票价通常不是家庭主要直接门槛；同时接受普通当地人可以安排必要近院照护、交通、陪护/连续随访时间和净资源。原件未证明全部额外家属/近院住宿全报销，也未验证每个远端家庭的资源。**真实交付与已运行监护＋必要医保有方向地支持通常可接；等待恶化、严重毒性和护理压力使其有条件，而非80。**若具体适应证、本地运行、支付或连续监护净资源桥不可接受则null（21–86）；若证据指向重大余障通常主导则40（25–80），不另设逐剂账单/固定成人门槛。

## 其余六维同一尺度判断

**PCS null。** [实际防洪线](https://www.hamburg.de/politik-und-verwaltung/behoerden/bukea/themen/wasser/hochwasser/hochwasserschutz-176712)正文已读，103km公共保护线、主堤平均提高约2.5m及较高历史风暴潮未严重损坏主堤，构成真保护；2050建设尚未全完，HafenCity等堤外住区和不可消除尾险不可省略。[Sep1_2026热旱实绩](https://www.hamburg.de/politik-und-verwaltung/behoerden/bukea/aktuelles/pressemeldungen/klimaanpassung-und-vorsorge-vor-extremwetter-1214752)有June27机场39.1℃、另站39.4℃，夏季11个>30℃日、3热带夜及河流/地下水压力。37%自觉准备充分是委托代表性调查的感受，非实际保护成功率；信息和上报入口已运行，泛称绿化措施不推全部已交付。保护后热旱/洪水通常余险方向未闭，地质未审诚实标，未以零风险或所有人口实测作门槛。

**GSS null。** [May19_2026主管机关2025报告发布正文S03](https://www.hamburg.de/politik-und-verwaltung/behoerden/behoerde-fuer-inneres-und-sport/vsb-2025-1175766)独立raw有效：Oct2025禁Muslim Interaktiv是实际保护行动；各类“暴力倾向人员潜力”不是实际攻击、伤亡人数。俄罗斯等混合威胁、间谍活动与汉堡港口经济设施的目标暴露有具体语义。水务H01物理10–11还明确地区冲突传导到能源、材料及供应链，定期维护是有限匹配保护；不能由没有本地战争、组织禁令或网络单项直接推出通常战略安全60。全文VSB PDF web因18.65MB超限未读，未假装重新获取全部原件；原始TLS机制停止后没有转域绕过。当前保护后主要组织/区域/战略影响尚不能选40/60，并非要求发生攻击或所有国家战略实测。

**ISR 附条件60。** [DigiTAll实际项目S04](https://digitall.hamburg.de/projekt/)明确项目于2025-12-31结束，BauWeiser保留运行；Hamburger Energienetze、Hamburg Wasser、Hamburger Energiewerke自2025-11已把内部生产系统接上接口，协调冲突规则已在相关机构应用，区别于试点和目标。[Jan21_2025居民数字协助W03](https://www.hamburg.de/politik-und-verwaltung/senat/presseservice-des-senats/landespressekonferenz/hamburgs-neue-digitalstrategie-1010996)实际六处免预约账户/eID协助是通常入口。H01实际供水、维护投资和测量采用，及S08过往已实现债务减免，提供跨功能执行的正证。接受它们有限代表日常执行/调整与居民受益、截止延续，可判通常功能可用；理由是生产流程已经协同、真实供给在交付，已知局部破管/排斥未显示其主导通常执行。司法救济/群体排斥未完成评审，老基金不能延至2026；拒代表性/普通受益/延续=>null（18–88），重要净限制主导=>40（24–79）。

**RES null。** [H01正式2025水务原件](https://www.hamburgwasser.de/fileadmin/Redakteur/Downloads/geschaeftsberichte/hamburgwasser-geschaeftsbericht-2025.pdf)物理7供水117.4百万m³、1.99欧/m³＋特定水表7.52欧/月，供区2.2m含都会周边，不是全水污水税费最终账单/中位负担率或整个FUA人口。物理8–9水损3.8%，2025实际地球物理钻探和网络投资；物理3的每次破管警示既有设施压力，10–11保留施工人力不足、洪水/断电/火灾与能源供应成本。16厂分布多州不等16个独立备用。实际供给不能单独裁全部食水能通常净取得。

[S08正式政府作者议会原件22/17371](https://linksfraktion-hamburg-harburg.de/wp-content/uploads/2025/01/Drs.-22_17371_haertefallfonds_energiesperren_vermeiden_abschlussbericht.pdf)是议会党团托管副本：物理3/6记75案105513欧债务处理，其中FHH84410.42、Vattenfall21102.58豁免，不是15m预算全支付。77上报/75批准/2拒绝不等全部申请通过率，报告明确许多预筛拒绝未上报；物理5记结束2024-03-31。当前[提供商分期入口W06](https://www.hamburg.de/politik-und-verwaltung/behoerden/bukea/themen/strom-gas-wasser-158186)、[Jobcenter/社会部门可能援助W07](https://www.hamburg.de/politik-und-verwaltung/behoerden/bukea/themen/beratungsstellen-158182)和节能咨询确能处理问题，但不是已支付2026家庭净资源结果。W05党团Jan23_2026对2025断供数/等待的归纳仅作署名主张；所链Senate答复跳登录页，不能认证为独立官方率。不给下载失败扣能力；也不由少量历史救助推40。缺的是当前帮助后通常重要负担的方向，食品未开始，不能靠国家富裕填；并非要求每个中位家庭全束票据。

**TEC 附条件60。** S04三公用事业已接内部生产系统、协调制度已应用，是非医院的实际跨主体采用。H01实际2025测量钻探/生产管理、W03居民数字入口与已实施临床技术组成多个用途；未来AI愿景、试点、专利或宽带覆盖未实测不当正证。接受真实生产与居民使用对通常扩散有意义、截止延续：已接生产接口可直接做日常工程协调，具普通受益方向，因此可60；企业/就业密度和被数字排斥人群未完整评估，不填0。拒代表性/普通受益/延续=>null（21–86），重要排斥主导=>40（25–80）。

**OPT 附条件60。** [S06机场2025原件](https://www.hamburg-airport.de/resource/blob/93136/92f7c2385fded912bce98dcd17c0c533/geschaeftsbericht-2025-data.pdf)物理2约14.77m客流不是独立居民/单向出境；38–39列多家航司/跨国目的地。页标题“120直飞”未认证120唯一行，ZTH/ZRH实际印重复，不能静默当去重数。未新增完整独立国际地面通道证据，也不因此否定普通出行。

已逐字复用并独立适配的[EU工人居留](https://europa.eu/youreurope/citizens/residence/residence-rights/workers/index_en.htm)（checkedAug19_2026）、[个人跨境付款](https://europa.eu/youreurope/citizens/consumers/financial-products-and-services/payments-transfers-cheques/index_en.htm)（Apr28_2026）直接适用符合条件的德国EU公民；前者非所有人自动无条件定居，后者欧元跨境同价/IBAN规则不排除FX/ATM及鉴权。ING个人账户和App服务、Telekom个人预付充值/漫游是可实际使用的个人路径，企业漫游不代个人。银行价格Oct15版本没有采用，通信当前报价不认证截止同价；只用基础服务事实和可撤延续，不保证永久境外旧账户/无限漫游。

60还要求通常必要资金、初期及后续安置/通信费用可负担，合法目的适格、有效ID/设备/SIM/鉴权且可安排新地址/必要医疗和服务延续。已审工人路径，**未把无固定年龄画像改成固定工人**；其他资格需有限可撤的适格假设，非工人全部权利未独立核完。多个已运行运输/个人付款/通信选择和适用法律使通常可行，不是只看有机场。拒法律适格、资金或连续安排桥=>null（21–86）；重要门槛主导=>40（25–80）。EU指令跟链取回为202挑战页、未作法律实质正证。

## 范围、原件与停止

`coverage-record.json`逐一记录八维31项状态、证据、反证；“有界评估完成”不意味着31项证据全部完成。地质/食品未开始，企业密度未完整评审；未知项不惩罚、不补中点、不重归一。各附条件60必要桥和拒绝敏感性在`candidate-handoff.json`，全撤为0–100。

18份有效raw原件＝13份逐字验证复用（H01–H05、德国/EU共同事实7份、Tisa正式人体1份）＋5份新快照；H03/S09只导航不加能力。原件bytes/SHA、来源版本/观察窗口/抓取日期及范围在`source-manifest.json`，每份Oct15取回不认证Oct10历史同字节。失败5次：市政raw TLS累计3次SSLEOF后停止；议会答复跳登录页非PDF、EU指令202非正文各1次，没有把失败响应当有效原件。市政页面另有已实际读的web正文，raw仍null；VSB超大小、UKE web locator错误另列。未重启批29旧失败的两次UKE click机制或重发请求修合规；无新增越批偏差。

两轮发现各4query，实际分成2+2的批次，之后仅已定位正式原件/原文链接。每次实际source open/find/request/像素批均先本地/JS断言items≤3。15页关键PDF像素已实际看，页号/源/图SHA独立记录`pixels.json`；不是把2284页全部质量结果认证。`web-read-notes.json`与可保存的web工具记录区分于原始bytes。

独立加载shared-geo全9031几何（136处由既有加载器修复、未二次修复），GPKG9932800bytes/SHA9934364827132232df67e8984768fb30865a846f5a786db999d49fc37fb7698d。中心、UKE、机场和DigiLab办公室四个分析者近似点均唯一3793；WKB SHA `20145f19be0eeceb80b95f59c85eb94a52076bf6350324548d3a65bccb0cd866`。近似点非正式坐标或全供区/医院患者范围，水务跨州供区不强配FUA，也不转2015人口为2026结局分母。

最后逐字守卫70原案/16完整维对象、raw与关键图；仅供根独立验收，未改仓库、评分、UI、脚本，未提交部署。未通过根逐条裁决的连接保持私人建议，不记已发表。

## 31项有界覆盖

| 维度 | 子项                    | 状态               | 证据                                                                 |
| ---- | ----------------------- | ------------------ | -------------------------------------------------------------------- |
| PCS  | heat_humidity           | reviewed_partial   | W02                                                                  |
| PCS  | flood_sea_level         | reviewed_partial   | W01;H01:p3,11                                                        |
| PCS  | geophysical             | not_started        |                                                                      |
| PCS  | severe_weather_wildfire | reviewed_partial   | W02;H01:p3,11                                                        |
| GSS  | organized_violence      | reviewed_partial   | S03                                                                  |
| GSS  | regional_conflict       | reviewed_context   | S03;H01:p10-11                                                       |
| GSS  | strategic_exposure      | reviewed_partial   | S03;H01:p11                                                          |
| ISR  | governance              | reviewed_partial   | S04;S08:p1-6;H05                                                     |
| ISR  | adaptive_capacity       | reviewed_partial   | S04;W01;H01:p8-11                                                    |
| ISR  | social_cohesion         | reviewed_partial   | W03;S08:p3,5-6;W06-W07                                               |
| ISR  | emergency_recovery      | reviewed_partial   | W01;H01:p3,11;H05:p52-53                                             |
| RES  | water                   | reviewed_partial   | H01:p7-11                                                            |
| RES  | food                    | not_started        |                                                                      |
| RES  | energy                  | reviewed_partial   | H01:p9-11;S08:p3,5-6;W04-W07                                         |
| RES  | supply_chain            | reviewed_partial   | H01:p8,10-11                                                         |
| MED  | access                  | reviewed_partial   | H04:p4;H05:p20,52-53;R6:27,39,61,62                                  |
| MED  | routine_quality         | reviewed_partial   | H05:p394-395,408-409,432-433,458-459,481,498-499,690-691,860-861,902 |
| MED  | specialist_capacity     | reviewed_partial   | H05:p20,51-53,942,1030,1045;H02                                      |
| MED  | system_continuity       | reviewed_partial   | H04:p4;R6:39;H05:p902;H02                                            |
| LON  | translation             | reviewed_partial   | H05:p1030,1045;H02                                                   |
| LON  | trial_maturity          | reviewed_partial   | R13:p6,8,10                                                          |
| LON  | regulatory_adoption     | reviewed_partial   | H05:p942;R13:p6;R6:27,39                                             |
| LON  | resident_access         | reviewed_partial   | H04:p4;H02;H05:p942,1045;R6:27,39,61,62                              |
| TEC  | knowledge_output        | reviewed_partial   | H01:p8;S04                                                           |
| TEC  | industry_density        | not_fully_reviewed | S04                                                                  |
| TEC  | digital_infrastructure  | reviewed_partial   | S04;W03                                                              |
| TEC  | diffusion               | reviewed_partial   | S04;W03;H05:p1030,1045                                               |
| OPT  | transport_redundancy    | reviewed_partial   | S06:p2,5,38-39                                                       |
| OPT  | legal_mobility          | reviewed_partial   | R11                                                                  |
| OPT  | asset_portability       | reviewed_partial   | R7-R8;R12                                                            |
| OPT  | network_continuity      | reviewed_partial   | R9-R10;R8                                                            |

## 过程自审与冻结守卫

实际网络、web源与像素批均先断言≤3；部分本地单PDF/单文本抽取及compose逐文件完整性循环没有在读前显式写行内items断言，实际每批一源且无超3。该过程偏差照实保留，没有重复请求/重下载来追认合规，不用于扣城市能力。

70原案逐字对固定Git对象及16完整案128个维对象哈希均通过；当前固定案外部漂移[{'path': 'docs/data/cci-local-2026-sydney-case.json', 'fixedSha256': '11218cc9ea3d8c93447cee20464b302ba98c90ab556c3cfb036e2ba6a59f13a6', 'currentSha256': 'a6d9d1c35c58794d64165f213d0dbe9afe4ca29230ad6b936f243876274a2711'}]，外部新增[]。工作树状态为根当前状态，不由本任务修改或回滚。
