# Edinburgh eFUA 2305：八维有界复核

**统一验收 PCS/GSS/ISR/RES/MED/LON/TEC/OPT＝60/null/40/40/60/null/60/60。** 原权重已知加权小计 **40**，GSS／LON未知区间 **40–65**；没有完整条件中心、不取未知中点、不重新归一，也不代表全球入围。31子项全审阅，26项`partial`、3项`context`、2项`unresolved`；PCS热湿／地质和GSS区域为`context`，GSS战略及LON居民获得为`unresolved`，其余26项`partial`。这些状态是证据覆盖与推定程度，不是子项得分。

画像为2026普通British公民、通常长期居民、当地中位收入和通常NHS Scotland保障，截止 **2026-10-10**，本轮实际查阅/新取回 **2026-10-13**。按照[共同rubric](cci-global-scoring-rubric.md)、[原权重](cci-research-model-v2.md)、[31项语义](cci-global-indicator-contract.md)及[哥本哈根](cci-copenhagen-priority-review.md)/[Tampere](cci-tampere-priority-review.md)/[London长寿复核](cci-london-lon-comparability-review.md)的同层级条件判断。采用[research技能](/Users/morris/.agents/skills/research/SKILL.md)，作为已经分派的后台研究执行，未再派代理、联系机构、编辑共享数据/旧案例或提交。

公开全量探索的低热/PGA、短模型医疗旅行与快测速仅安排研究顺序；不称“优先入围”、不由这些代理填八维。**两轮定向发现已结束，随后只读取已定位原件/核心表，不再扩搜。** 未知不低分，也不为完成性填60。通常可负担与延续连接允许明示推定，未新增完美中位家庭账单、全FUA质量普测或每一能力当年压力试验硬门槛。

## 身份、地理和版本

本轮读取完整GHS原包 **9,031** 几何，重算原9,932,800 bytes及SHA256 `9934364827132232df67e8984768fb30865a846f5a786db999d49fc37fb7698d`。2305/Edinburgh/GBR，面积 **1,448 km²**，旧UC1749，2015模型人口666,232.60仅识别历史范围。目标ESRI:54009 bounds `[-238000,6450000,-185000,6493000]`、目标WKB SHA `5a4b17ec5678750df1258acd4478a09231dd6e0f0b3fbc2f6e49e509a2c56dd4`。原来源复用[候选provenance](data/cci-global-candidates-r2019a.provenance.json)，推导 `/private/tmp/cci-global/edinburgh/boundary-record.json`。

全9031点检采用EPSG:4326→ESRI:54009、`always_xy`、`intersects`。**分析者近似参考点**：中心、Royal Infirmary Little France、Western General、Royal Hospital Children and Young People、机场、Leith港、Edinburgh University Old College、Heriot-Watt Riccarton、BioQuarter、Musselburgh均2305；Dunfermline和Forth Queensferry Crossing点2160，Glasgow QEUH点955。不是官方精测坐标、冻结机场目录点、全院区/港区足迹、历史病例地址或服务覆盖。桥/区外医院可提供居民服务，但不能因此算本区产出或已验证独立备援；未把Glasgow CAR-T医院存在继承为Edinburgh居民已取得。

City of Edinburgh行政市不等于2305；NHS Lothian、Scottish Water和SP Energy Networks各跨不同范围。Marchbank原报告明确“serving Edinburgh”，并不说明142,457供区人口都住2305；社区配送明确不含East/West/Midlothian，不能代表Musselburgh等全部FUA食品。其具体运行与共同Scotland资格可合理适配通常居民，但该适配和延续必须可撤回。

[冻结全量探索CSV](data/cci-research-priority/priority-all9031-v2.csv)的2305行：GEM参考岩石PGA **0g**、相交新版UCDB中心2186最高热指标 **0天/年**、模型机动1.8958/步行18.9757分钟、fixed299707.92/mobile165405.60kbps。零源值不等零危险，中心热值不是2026全区热结果、旅行不是等待/质量/费用、自选网络测试不是无连接者。新版2186和旧UC1749不能混用；来源/版本/单位已在[探索方法](cci-unassessed-priority-screening.md)核过，本轮只复用派生行作PCS背景，不当新原始原件或自动高分。该CSV身份与行存于`screen-context.json`。

原响应晚于截止；出版/生效/观察与取回分开。未标首发的当前网页、PDF精确出版日未知者，不借版权年/URL/创建日伪造首公开。PDF元数据：Council年报实际FY2025/26、创建2026-09-29；DWQR2025创建2026-08-27；NSD2024/25创建2025-12-05。元数据支持版本检查但不证明当日公开。接受截止前观察及合理版本延续；拒绝该假设时相关维度撤回未知。

## 全31状态

| 维度/子项                                   | 状态       | 支持、反证与未闭连接                                      |
| ------------------------------------------- | ---------- | --------------------------------------------------------- |
| PCS 热湿 / `heat_humidity`                  | context    | 旧UCDB中心热背景不当2026全区热结果                        |
| PCS 洪水/海平面 / `flood_sea_level`         | partial    | S04已成/缺资工程，S05实际维护；非海潮全覆盖               |
| PCS 地质 / `geophysical`                    | context    | 旧参考岩石PGA0非零地质风险                                |
| PCS 强天气/野火 / `severe_weather_wildfire` | partial    | W06真实风暴影响/修复；野火未单独测量                      |
| GSS 组织暴力 / `organized_violence`         | partial    | W02–03动员指控和人/警公交实际受袭                         |
| GSS 区域冲突 / `regional_conflict`          | context    | W05区域真实暴力和当地和平无逮捕分开                       |
| GSS 战略暴露 / `strategic_exposure`         | unresolved | W04实际侵轨/公交中断与调查；不声称战争归因                |
| ISR 治理 / `governance`                     | partial    | S06实际KPI/福利交付、住房大积压                           |
| ISR 适应能力 / `adaptive_capacity`          | partial    | S06调整协作与延误；新投资未等完成                         |
| ISR 社会凝聚 / `social_cohesion`            | partial    | S06住房/反社会投诉群体、W05差异；非居民犯罪率             |
| ISR 应急恢复 / `emergency_recovery`         | partial    | W06真实跨资源恢复支持、S05现场防护；非全部市危机演练      |
| RES 水 / `water`                            | partial    | S01–03末梢及Marchbank重复失控；W09一次恢复                |
| RES 食物 / `food`                           | partial    | S18实售/配送、S06实际课程；公益非全民食物篮               |
| RES 能源 / `energy`                         | partial    | W06实际206k恢复、多数24h尾部6日；区域非本区分母           |
| RES 供应链 / `supply_chain`                 | partial    | S18服务排除外郡、风暴道路/电力共因；无全户库存推定        |
| MED 可及性 / `access`                       | partial    | W01免费通常NHS路径；登记/转诊/非全项目零费                |
| MED 常规质量 / `routine_quality`            | partial    | S08–09过程和文化/29h延误并读；不是全区风险调整            |
| MED 专科 / `specialist_capacity`            | partial    | S11真实胰岛/肝/胰腺移植及S08急产科                        |
| MED 连续性 / `system_continuity`            | partial    | S09月度审核/持续改进与人员/编码/容量残余                  |
| LON 转化 / `translation`                    | partial    | S11真实人体移植不是健康人延寿                             |
| LON 试验成熟度 / `trial_maturity`           | partial    | 已实际疗法而非仅在研；S14分类/生产验证未闭                |
| LON 监管采用 / `regulatory_adoption`        | partial    | S12临床目录、S13公费委托、S14 HTA审批非替换生产完成       |
| LON 居民获得 / `resident_access`            | unresolved | S11公费住院/终身随访；S13–14设备/成本/延迟令当前取得未定  |
| TEC 知识 / `knowledge_output`               | partial    | S15申请专利/许可、S16企业/资金单位分开                    |
| TEC 产业 / `industry_density`               | partial    | S16真实不同公司、S17本地机器人演示非全面采用              |
| TEC 数字 / `digital_infrastructure`         | partial    | W07–08实际公共设备/帮助但时限/青年Wifi缺口                |
| TEC 扩散 / `diffusion`                      | partial    | S06居民实际数字借阅/下载非去重；融资/接入残余             |
| OPT 交通 / `transport_redundancy`           | partial    | S19实际客流/新路线、S21既有铁路；S20 IT故障恢复日期未知   |
| OPT 法律迁移 / `legal_mobility`             | partial    | S22 British公民CTA可住/工作；家属/限制/资源不自动满足     |
| OPT 资产 / `asset_portability`              | partial    | S24 GBP普通账户/新收款人48h限额与S23 QROPS税              |
| OPT 网络 / `network_continuity`             | partial    | 公共连接和实际故障/恢复支持有限可用；未证国际连接独立备援 |

## PCS：已有适配防护，低代理不是整体保护

S04法定2016–22最终报告物理/印刷p133目视：Water of Leith Phase1/2 **已完成且在位**；Coltbridge/Gorgie/Saughton拟续建因缺资延期，日期TBC。表水管理高层研究完成不等管网/工程已成。S05当前原页面说明市政府维护Braid Burn/Water of Leith既有防护、日常河畔通道门需关闭、装屏障；部分步道设计允许洪水，不能把设计淹没当居住防护失效，也不能把开放洪门视为已关闭。

W06实际2025Jan风暴100mph区域影响道路/交通/电力、多数24h恢复但尾部6日，证明强天气现实风险与资源调入恢复。是中央/南Scotland运营区，不是2305全户风速/停电率。低热/PGA历史模型只作热湿/地质`context`；本轮未核到海潮所有节点或野火单独实绩。

**条件60**接受既得防洪/适配现场维护与区域响应对通常居民有代表性且继续运行，同时保留海岸/表水、缺资工程和风暴共因脆弱。**40**在上述已缓解后缺口对居住/关键节点仍主导的解释下可辩，**80**需要可信多危险低暴露与有效保护/替代的同层解释，当前不能由PGA0推80。拒绝地域或有效性/延续连接则null；不是为了缺精确热死亡或全户加固表而统一未知。

## GSS：实际组织动员、通道影响与回应

W02原Police Scotland：2023Nov5 Niddrie等烟火骚乱，26人合计51项指控、另1人2项将报告；两成年者被控煽动、拍摄鼓励暴力，另两人被控供应烟火。**被控不等定罪**，不能从年龄/地域给群体贴标签。W03原记录2024Nov5 Calder Road烟火/投射物实际袭向公众、警察及公交，Captain Road处公序警员受袭；后续到报道时13人被控、5住宅搜查、2车辆扣押。调查继续，不等危险已消失。

W04记录2026Sep12–13 Princes Street Gardens周末演出发生破坏、攻击、轨道侵入、公交受扰；8人被捕中周六4人被起诉、周日4人被捕，不能写成8人已定罪/已起诉；大多数参与者无问题。其动因与入场冲突有关，不伪造外战/恐袭归因。W05同读2026Jun9 Scotland示威：Glasgow真实种族攻击、3被捕、2警/3公众受伤；Edinburgh虽扰动但和平且无逮捕。Glasgow观察不当本区受伤率；机构跨地协调/社区工作可作区域响应，拟议互援不当本区已部署结果。

**根代理统一验收：GSS恢复null。** 有组织煽动／供应—地方袭击—调查回应的局部链成立，但Glasgow示威和本地和平集会不足以证明区域冲突／外溢，普通侵轨／公交扰动亦未核战略威胁归因及适配。原代理整维60跨越了这两个未闭连接，经同已有Dublin、Tampere、Helsinki门槛复核后撤回；不是将地方暴力忽略，也不因没有完美事件普测或渠道失败判低档。GSS区域仅context、战略unresolved；未来补到实际区域／战略影响与缓解的适配后才可重判60或40，目前null的conditionalAlternatives为空。

## ISR：实绩与仍重要的住房/触达断点

S06的当前原文件虽保留旧URL名，实际封面/正文 **FY2025/26**。不是2024/25重刊数据。物理/印刷p54目视：已安置无家者案件平均 **768天**，月末临住 **6,521户**，不适当安置 **1,078户**，**1,548案件安置**，advice-only28.2% vs目标35%。是进入服务/已安置案件、月末存量和年度流量，不是所有居民等768天、全FUA户率或跨表可以直接相除的同队列。

p55实际Apr2025–Mar2026预防 **1,658户** 无家、委托服务帮助 **1,112户**保住房，不能相加为去重2,770户。p56正文无家评估 **2,929**、较前 **2,642**增287，原称 **9.8%**，以旧值为分母实算约 **10.86%**（以新值2,929为分母约9.8%）。保留原文及分母冲突，不静默改数字。新£1.6b住宅计划/approved homes不当全部已交付。S07 FY2024/25审计所写Apr2025临住压力比新年报早，不能择较小旧值替代新存量或把旧“failure-to-accommodate”比例移成全居民率。

反证同读实际服务交付：S06福利基金 **£3.8m**、住房支持 **£7.5m**、Council Tax reduction **£30m**；危机补助处理 **2天**，社区照顾补助 **13.3天**（表）/正文概称13；新benefit **19.8天**、变更 **11.9天**、住房酌情补助 **36.9天**。前两主要在目标，后者延误/手动处理增加；不是每户到账净额。ASB投诉 **23.03/10k** vs2023/24 **19.9**，噪音为主要类别；投诉不是犯罪率，范围不是2305。实际调解/household-support和社区司法完成73.3%表明群体介入，未证明解决所有骚扰/信任。W06工程师与福利恢复说明能调入资源，亦有延迟长尾。

**主40，60替代**：制度在运行、帮助有真交付，但长住房退出与不适当安置、部分支持时效在缓解后仍重要，可符合显著执行/触达障碍。不是认为所有中位住户无房、所有市服务崩溃；也不要求超过多数人受害才认重要。若认为预防/其他普通服务及恢复已足够缓解，通常目标居民的主要制度仍可运作，则**60**成立。拒绝行政核心对FUA/普通群体的代表性或残余重要性判断则null。不能仅由未解决住房倒推出国家治理低分；本轮未给80主张。

## RES：平均合格与反复处理失控必须并读

S03全国2025原表物理p2–3目视：消费者末梢E. coli **14,961检测、1失败、1 zone，99.99%**；coliform **14,961、39失败、34 zones、99.74%**；总细菌 **39,559检测、42失败、37 zone项、99.89%**。不同参数可在同次/同区取样，37不能擅称37去重供区。储水E. coli **48,427/3失败**，出厂另表 **25,585/0失败**（抽文本），不是全部末梢样，也不能合计为去重住户或移植成2305合格率。**Cryptosporidium无规定PCV、非通常合规参数**，99.99% E.coli不能证明无crypto。S01 2025预计划出厂crypto **5,783样**另有运营样；低水平未UV处理检出12个预计划/运营样，Marchbank两次，非全供区12患者。

S01 p12–13正文明确Marchbank **serving Edinburgh**：第一次与投药管沉积/阀失灵导致滤池洗反受限有关，第二次料仓空/混凝过滤差。不能擅将这两crypto检出与所有事件编号一一对应。p44–45目视：**2025Dec12–13**浊度升高且final-water crypto卵囊，polyelectrolyte料斗空；不充分监测、滤况、人员可用、升级与监督不足，DWQR称未充分及时处理，并与 **2024Dec**类似失效平行。已实际制定行动方案，**2026Feb两日技术审计33 actions**，仍考虑执法；不能把讨论整改当33项已完成/风险已解除。

S02事件表p2、7目视：**June15798** disinfectant-dosing-pump失效，Class **Significant**；**Dec16606** coagulant-aid失效，Class **Significant**，两行PopulationAffected均 **142,457**。**关键冲突：S01 p44标题将December列Serious Incident，S02 p7列Significant。** 保存两值，不静默改成统一Serious；无论分类差别，处理失控及监管评语仍明确。142,457是供区受影响人口列，不是感染病例、全FUA去重人数；重复行不能相加为284,914受害者。全国遥测异常列5,408,211也不当所有人饮水不安全。未核Pateshill服务足迹，不按邻近名称全部归入本区。

W09实际EH12运营更新 **2026Sep11 11:55** Stage5供水恢复，可支持一次修复，早阶段移除，不能推全年的时长/零停水，或拿此一般管网修复关闭Marchbank处理整改。原curl403与web正文分列。

食品S18社区运营者当前可购买£10/£15蔬果箱，仓库Leith每周三/四/五市场；原文章2024Oct1市场、2020Dec17配送，本轮重读不当2026新交付测量。明确配送Edinburgh **不含East/West/Midlothian**；市场/商品存在不是家庭全部食物篮/实际订单成交量。S06实际司法服务与社区食物组织协作的健康/预算烹饪课程是现实当地帮助，但不是所有居民已供餐；慈善配送亦不能证明中位家庭必须受救济或完全无负担。已取农贸页正文标更新2020，仅列有效但过旧排除，不借版权2026当新运行。

能源W06运营方 **2025Jan24–30** 中央/南Scotland实际恢复 **206,000客户**，多数24小时内、最迟六日；约 **700工程师**及跨国土资源支援，向脆弱者>1,400现场访问、暖点/食物车/酒店已提供。**270,000是SMS数**，不是额外受影响去重客户。供应恢复后永久修复仍继续；>48h自动补偿是应付规则/后续安排，不当已到账全户。另一运营2024/25摘要的270kaffected与此206k恢复不擅合并，本轮只用有清楚窗口的W06。地区供给/道路/通信共因与有限食品配送范围保留，不以机场旅次证明食品批发吨位或备用库存。

**主40、60替代**：接受通常普通公供/食品/能源路径可用及必要净负担通常可承担（明确推定，不拿机构利润/均价当当地中位账单），但反复关键处理失控、人员/升级不足、实际风暴长尾在已行动后仍重要。对关键资源不要求只有多数已染病才可降档；没有据缺全户账单判40。若接受Marchbank改进/替代实际有效、局部事件已充分隔离，通常日常供给可靠且风暴尾部不主导，则60可辩；当前未核到该完结。否定供区/普通负担/延续推定则null。80需在同层证据上说明真正替代/通常负担/共同冲击缓解，不能凭高合格率填。

## MED：真实整改的进步与仍未消失的安全/等待

W01 NHS Inform的Scotland路径说明通常多数GP、药房、医院、急诊服务免费；牙科/眼镜等可收费，需GP登记及通常转诊，不能用“公民”替代通常居住/登记/必要适应证。未继承NHS England RTT法规/收费当Scotland事实。S11当地provider真实 **12胰岛移植、66肝移植、10 simultaneous kidney/pancreas-pancreas移植**（FY2024/25），包括评估/入院/长期随访，不是医院名气或床位；国家受托院外患者不能当本区居民利用率，三种移植也不擅相加成88去重患者。

S08原HIS检查 **2025Jun23–24**，劳动产房、triage、ward119 antenatal/postnatal、ward211四区域，观察实践/患者及访客/职工访谈和记录审查，Jul22虚拟讨论；非随机全FUA患者样本，报告未给各访谈人数，不造总N。物理p5/印刷p7目视：有真团队合作/关怀，也有人员/skill-mix压力，**诱导分娩延迟最多29h**，MEWS观察/升级迟、员工不信任不愿上报、患者求助铃不足。母/胎评估和CTG真实缓解，但训练不完全，不能说延迟全无害。原要求26requirements+2recommendations、5good-practice；S10政府称26recommendations，术语冲突保留，Level3升级真实而后续任务组不当已全改善。

S09是新于检查的实际整改，不只规划：**Version9 Apr28 2026签署**、Apr27更新，URLMay不是患者日期。p3目视：Jun2025–Mar2026 MEWS入院记载 **80→93%**，按时生命体征 **87→94%**，合并frequency约 **80%**（不能拼成94%总体）；charting median **73→92%**，正确响应升高分 **median42→75%**，仍未 **95%改进目标**。Exec Sponsor/SLWG认为足够于 **Apr1**关闭该action，2026继续项目，不能从关闭状态推所有要求95%已达。

p4目视OTA≤15min **early2022 median31%→June2025 75%→Mar2026 83%**；改进aim>80%与“所有女性15分钟内”规范不能混同。Nov2025审查Jan–Sep **14,034 attendances/93时间戳>12h（0.7%）**，样本发现真正长停留很少且确认案例护理合适；Dec2025–Mar2026 **4,485 attendances/92 flagged>12h（2.1%）**多数管理编码错误、全部临床案例由人员审查，真长停留人数/后果未报。**不能把92全算真实12h临床等待，也不能把多数编码错误推全部无害。** 月度5%抽查，中期midwifery care median **87%**、medical review **73%**，orange patients需优先改善。是过程依从/院内复核，不是风险调整母婴死亡/感染结局或全区常规质量。

**条件60、40重要替代**：真实必要当地接诊/专科、人群通常公费资格与量化过程改善支持广泛常规/必要专科通常可得、仍有重要短板；无需完美中位账单或全区临床普查才准60。不能只以有NHS/移植数量给分，质量和真实安全异常共同读。接受有限院科实绩对通常服务的代表性、支付和持续改善假设；若29h等待、人员/上报与73/75%依从的残余足以主导必要服务，可40。没有用择院权当急产科及时可替代。拒绝通常公费路径/代表性/延续则null；不主张80。

## LON：可信疾病转化存在，已知设备断点不能自动忽略或判停

S11 NSS正式委托FY2024/25报告物理p5（双页印刷p7–8）已目视：provider **NHS Lothian、12 transplants、£1,158,000 expenditure**，对>16 Type1严重低血糖无察觉等条件，提供assessment、islet transfusion、inpatient care、**follow-up for life**。12不是12去重普通Edinburgh居民，支出不是患者账单；不能由此推健康人延寿或无免疫抑制/旅费负担。S12 **2025Dec4**原目录明确RIE当前地点/适应证，发表在下述维护截止前。已实际人体疗法及委托监护很强，不能因未获某抗AD药就把整维封顶40；国家其它实际疾病路线可用，但本轮没有把区外CAR-T存在变成当地普通患者已取得。

重要反证S13 **Dec2024 summit**（2025 PAG paper编号）p4目视：所有三个英国islet isolation实验室使用 **COBE2991**，耗材已 **June2023停产**、维护 **December2025终止**，当时无UK certified replacement，每个实验室需要procure和**个别验证**后才live。实际NHS Scotland委托/协同Edinburgh比England的机构review不同，不能都写NHS England payer。UK因KCL关停的offer拒绝率18%/先前7%、候补队列3年移植80%→57%若参考，都是旧UK队列/外区关停，不当2026Edinburgh等待或这12患者结局，本轮未据该百分比评分。

S14 **May1 2025 ratified会议**物理p6目视：Edinburgh已有HTA批准/规制资格，但validation sets仍需；PRISM机器不足会延期，成本也有担忧，访问五中心是计划。SIK可能分类错误需单独区分的行动保留，不将所有figure改成一致既定结果。审批/培训/会议不证明替代机器已验证上线。S12目录存在亦不能证明Dec2025已知设备节点后制造继续；反之旧预警**不证明2026已停服**，库存/维护延长/新设备或替代现实路线可能缓解。

**主null**：这是已知重大依赖经过截止时点后仍未闭的当前生产/居民获得连接，不是资料年限机械判废、缺完美账单或新增当年冲击压力测试门槛。转化/人体成熟/受托采用有partial，resident_access当前链unresolved。若取得已验证替代/库存保障继续实际transfusion及通常NHS终身监护，**条件60**可成立；若真实当前等待/制造/负担形成重要断点，**40**可成立。单靠制造旧警告不能填40，单靠目录/12旧实绩不能填60。最小待补就是该设备缓解/当前交付，已两轮后停止；JSON null的`conditionalAlternatives=[]`，文字40/60是未来辨别条件而非当前填分。

## TEC：真实知识/产业及公共采用，不用排名或演示补全面扩散

S15发布 **2024Nov29**的过去12个月实际 **127新公司**、**140申请专利**、**55许可**；申请不等授权、license不等55本地普通居民或企业，全大学跨地业务不等本区产业密度。S16 **2026Jan19**新的年度公告 **64公司**，投资 **£113m中£56m给spinouts**，102个OCC portfolio公司产生1,236jobs是累积另一分母。不同窗/分类不能说127跌到64就一定产业崩退。相关2024/25impactreview入口提供上下文，正文各年度精确起止未给；全部计数不当论文/融资排行榜评分。CEO呼吁更多proof-of-concept支持是现实资金/转化约束方向，但不证明所有公司缺资。

S17 **2025Jul2**National Robotarium/Riccarton实际移动机器人+5G农业演示，多机构/工业伙伴提供现实技能及应用连接，项目结束Mar2025不等全面商业部署。**private portable5G**不能当一般家庭公共移动网。S06 FY25/26真实公共数字借阅 **453,256**、下载/streaming **>4m**，不是去重居民；**454,655数字学习完成（2025）位于员工章节**，不能变成人口教育覆盖。W07/W08免费公共电脑/无线/办公/扫描、115电脑与技能设备数据帮助支持实际普通接入；通常预约一小时/日、会员/资格限制，青年WiFi暂不可用的未标日期状态须版本假设，未来升级不当现有115全部新设备。

**条件60，80可辩替代**：持续多机构产出和真实公共采用支持较强能力，帮助后技能/设备/时间限制与早期资金需求仍重要。若接受public/help及普遍普通连接已广泛有效、这些残余不再重要，80在统一同层解释下可再审；不因没取家庭网络全分母/更大licensecount而独自封顶。40需确知产业/采用的重要断层，不能由演示非全面商用直接判。拒绝地理/通常接入/延续则null。

## OPT：多类退出手续和实际运输，仍有共同依赖

S19机场 **2025实际16,980,588旅次**，不是去重居民/航班或居民可承担迁移预算；2025已开Montréal、Boston、Philadelphia、Beijing与10easyJet路线，2026将开路线不算实施。S21 **2026Apr24**运营者说明EDI–London服务一直在时刻表，实际Dec2025新运行图，**May18**重排10:00/10:30为将来公告，不能写核过当日出发；接受既有铁路持续作为与本地机场不同模式的接续，不证明风暴时铁路必通。Leith港点2305不证明客运ferry已开，Forth crossing外区点2160不证明两桥独立备援。

S22可共用British公民CTA：Ireland可居住/工作且有附带权利，家属身份、禁入/驱逐/旅行限制不能自动消失；不是欧盟公民迁移全法。S24正式银行 **lastupdatedMar9 2026** GBP365通常 **£20k/day**跨domestic/international合限，新收款人 **£1k至48h**；可以提前添加并咨询相应办理，GB/NI更大款项为telegraphic transfer、**ROI InterPay不移植GB**。合法账户/收款国家/币种/审核与通常费用须适配；单银行不代表全部居民已有BOI账户或所有资金零税。S23养老金QROPS/HMRC税与转移条件独立，不将其作为全资产不能转或每日£20k是法律总上限。

S20原机场未标日期IT事件已恢复；CMS嵌入2024及2025日期/链向旧社媒，不擅定事故为2025Dec5或“当前Oct2026无故障”。真实单节点中断和恢复可检视共因，不能单次故障证明有独立航管备援。W06真实电力/道路/通信影响与SMS/warmhub恢复，W07公共数字可接入但国内帮助不证明国际网络不断。

**条件60**接受本国普通公民持证、合格普通账户/设备及常规接续/迁移资金通常可承担，国际通讯可按普通服务继续；现实通道/手续成立而容量/IT电力共因、新收款人时效/税仍重要。**40**若这些在缓解后真实妨碍通常退出，**80**若真正可用独立替代/常规资金/通信共同失效已经检视且残余较小。拒绝通常法定资格、资源/网络延续推定则null；不凭机场量或CTA法条单独填本维。

## 分数复算与最低改变条件

原权重PCS/GSS/ISR/RES/MED/LON/TEC/OPT **15/15/15/10/15/10/10/10%**；已知 `60*.15+40*.15+40*.10+60*.15+60*.10+60*.10=40`。GSS15%与LON10%未知保留完整权重，条件算术域 **40–65**，无中心、无置信区间。MED40替代给37–62；ISR60和RES60合读给45–70；若进一步拒绝必要代表性／延续，对应项回null，不归一化。未来GSS与LON分别有依据60，才可能形成条件中心55，当前不得预填。

下一最小判别仍是区域／战略真实影响与缓解、Marchbank33actions的实际闭环／替代、住房退出与触达的缓解、产科残余与真实长等待后果，以及islet设备替代／继续交付。已核一般地方暴力不等整维安全。没有候选排除、完整排名或新增资料量阈值，不再重复同类总量／规划搜索。

## 有效原响应与同源复用

原缓存根 `/private/tmp/cci-global/edinburgh/`。下表四列URL置首，原响应压缩解码后的实际body保存；`.headers`/`.meta.json`保留HTTP链、UTF8正文/原PDF。bytes/SHA逐文件重核，未把提取txt/PNG或web笔记当原件。S22–24是已核全国/具体GBP手续的**同源复用**，原retrievedAt不改成新读取时点；资格能共用、地方运行不能继承。DWQR正文/表/指数、HIS检查/行动来自各自相同上游，不能算独立研究者三次证明。另有已取索引/摘要/旧市场，manifest列有效但冗余/过旧排除，来源数不评分。

| 原来源URL/缓存                                                                                                                                                                                               | 发布/观察/适用范围                                                                                                      | 实际原取回UTC/bytes                               | 原SHA256                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------ |
| S01 [dwqr2025.pdf](https://dwqr.scot/media/ed4lxeno/public-supplies-annual-report-2025.pdf)                                                                                                                  | 2025公共供水；2026Feb Marchbank技术审计。PDF创建2026Aug27仅元数据，不等首公开。；发布/生效 精确日未核                   | 2026-10-13T06:18:41.228889+00:00；2,525,202 bytes | `c86d7cabd692730a51d7addc1f7a4315d977d59102b619d78669c0bd565a6aa0` |
| S02 [dwqr-incidents2025.pdf](https://dwqr.scot/media/ex0psuk4/public-supplies-summary-of-incidents-2025.pdf)                                                                                                 | 2025事件分层表；Marchbank六月/十二月，区域受影响人口非病例。；发布/生效 精确日未核                                      | 2026-10-13T06:18:41.229201+00:00；183,601 bytes   | `988c42757bdcc80d1674e2f9e648e9b57168e822bcff04d031fcf6791a37b2d9` |
| S03 [dwqr-tables2025.pdf](https://dwqr.scot/media/mlmpj55w/performance-tables-2025.pdf)                                                                                                                      | 2025全国出厂/储水/末梢参数不同分母。；发布/生效 精确日未核                                                              | 2026-10-13T06:18:41.229336+00:00；374,894 bytes   | `d8e5c234508aadb3c51d66eb5ba32f8c29d7bc5531260645a75e7ac01fdf8ab6` |
| S04 [flood-existing2022.pdf](https://www.edinburgh.gov.uk/downloads/file/32868/section-38-final-report-2016-2022)                                                                                            | 2016–22法定进展；WaterofLeith p133完成与缺资延迟并存。；发布/生效 精确日未核                                            | 2026-10-13T06:14:34.503902+00:00；3,275,130 bytes | `2670aa98bc730a27d459f2dd8d26cab4243ccce17d9918e1f665fc49e9fed755` |
| S05 [flood-current.html](https://www.edinburgh.gov.uk/flooding/emergency-flood-response/4)                                                                                                                   | 当前未标首发的已建防洪设施维护/洪门说明，须截止延续。；发布/生效 精确日未核                                             | 2026-10-13T06:16:09.867119+00:00；50,523 bytes    | `06c4d4042fee3714349f8f9445abaa1ce1df4af5090b32bdef4f3af5a71d5e43` |
| S06 [council-annual2025.pdf](https://www.edinburgh.gov.uk/downloads/file/32063/public-performance-scorecard-annual-report)                                                                                   | 实际FY2025/26，不是URL旧年度；PDF创建Sep29 2026非公开证明。；发布/生效 精确日未核                                       | 2026-10-13T06:14:32.378997+00:00；2,636,734 bytes | `48738eef2d91d90f844c7306612d991e42332eb5a252ac1fb7694bbf76e001fb` |
| S07 [council-accounts2025.pdf](https://www.edinburgh.gov.uk/downloads/file/38217/audited-annual-accounts-2024-25)                                                                                            | 审计FY2024/25及Apr2025住房/财政压力；不当2026全区率。；发布/生效 精确日未核                                             | 2026-10-13T06:14:32.773060+00:00；7,370,437 bytes | `3867bf0e554e238047fb64fd934409220b1fe4809576360361c095af761085c9` |
| S08 [his-maternity2025.pdf](https://www.healthcareimprovementscotland.scot/wp-content/uploads/2025/10/Edinburgh-Royal-Infirmary-maternity-services-safe-delivery-of-care-inspection-report-October-2025.pdf) | 2025Jun23–24 RIE四产科区域不预告检查，Jul22虚拟讨论；单院选择范围。；发布/生效 2025-10-29                               | 2026-10-13T06:17:00.380958+00:00；584,000 bytes   | `cfd7d12669ce3508284d8013f5468836c802117d43337c782d3ed3f304ba38b5` |
| S09 [his-maternity-actions2026.pdf](https://www.healthcareimprovementscotland.scot/wp-content/uploads/2026/05/ERI-Maternity-Safe-Delivery-of-Care-18-week-action-plan.pdf)                                   | 签署Version9 Apr28、更新Apr27；实际过程观察至Mar2026，URLMay非临床观察日。；发布/生效 2026-04-28                        | 2026-10-13T06:17:00.381422+00:00；460,420 bytes   | `13db894b267490e9822f3ac2347c4f19e4a2303ad602972ee79dbc365afd7d91` |
| S10 [maternity-support2025.html](https://www.gov.scot/news/ensuring-safe-maternity-services/)                                                                                                                | 实际升级Level3/任务组；政府26recommendations与HIS26requirements+2recommendations称谓差别。；发布/生效 2025-10-29        | 2026-10-13T06:14:29.764193+00:00；27,231 bytes    | `05276be87fe41517a9c5d5c20ad18ff62108521da033ba5e9660563f2481f628` |
| S11 [islet-commissioned2025.pdf](https://www.nss.nhs.scot/media/6413/2025-nsd-highlight-report-2024-25.pdf)                                                                                                  | NSD FY2024/25 Version2；物理5/印刷7–8，12移植非12去重本区居民，£1158000机构支出。；发布/生效 精确日未核                 | 2026-10-13T06:14:31.519150+00:00；4,275,196 bytes | `23dcdba0aaa08ffe311f30669b52c910dd4a70a3e0ca8152cd9b1b3dd0027ed7` |
| S12 [islet-current2025.html](https://www.nss.nhs.scot/specialist-healthcare/specialist-services/solid-organ-transplantation/islet-cell-transplantation/)                                                     | RIE成人Type1严重低血糖资格目录；发表于COBE维护停前，不能证明2026生产继续。；发布/生效 2025-12-04                        | 2026-10-13T06:14:29.771578+00:00；22,599 bytes    | `95c0dfb6eeb68f10051f8d9faaecab6022f6f673418e80e1490e96ac5692c03e` |
| S13 [islet-continuity2024.pdf](https://nhsbtdbe.blob.core.windows.net/umbraco-assets-corp/36584/pag-25-12-islet-transplant-summit-report-dec-2024-final.pdf)                                                 | Dec2024 summit，2025PAG文号；所有三个英国实验室COBE依赖与替换需验证。；发布/生效 精确日未核                             | 2026-10-13T06:14:31.534609+00:00；214,745 bytes   | `8160876b9a6fef7cff06a9e8e15561d3fe5e8480c39f7fe0e6285b893f166fcf` |
| S14 [islet-minutes2025.pdf](https://nhsbtdbe.blob.core.windows.net/umbraco-assets-corp/37765/pag-m-25-01-minutes-ratified.pdf)                                                                               | May1 2025 PAG46次会议，ratified版；Edinburgh HTA资格、PRISM机器/成本延期，SIK分类待核。；发布/生效 精确日未核           | 2026-10-13T06:14:31.739937+00:00；238,647 bytes   | `f61ad95666931d753bf0e09b92974423bda4c178c1fb364930a8617076d2d4e9` |
| S15 [ei-output2024.html](https://www.ed.ac.uk/news/2024/university-s-innovation-power-revealed-in-new-repo)                                                                                                  | 发布时past12months实际127公司/140专利申请/55许可；不默认精确会计窗。；发布/生效 2024-11-29                              | 2026-10-13T06:30:09.230994+00:00；32,442 bytes    | `47233bcff3baa037a97294b22e371a162c746cb58a4de9ee6f753cb65b1fc2d5` |
| S16 [ei-commercial2026.html](https://edinburgh-innovations.ed.ac.uk/news/strong-annual-results-for-spinouts-and-mission-driven-innovation)                                                                   | 年度商业化£113m/其中spinouts£56m，64新公司；相关2024/25impactreview不自动给所有数字年份。；发布/生效 2026-01-19         | 2026-10-13T06:14:34.819656+00:00；114,377 bytes   | `24db9ef49928867e302ec230268623778b424be606705bfe388665d76de9566c` |
| S17 [robotarium2025.html](https://www.hw.ac.uk/news/2025/the-national-robotarium-set-to-revolutionise-the-farming-sector-with-5g-robotics)                                                                   | Riccarton实际5G农业机器人演示；私网/原型不是普通公用5G或全面商用。；发布/生效 2025-07-02                                | 2026-10-13T06:14:36.745286+00:00；283,873 bytes   | `c2cde85b7b1d6612516117c692b9cc61d55035dcb8773e8557e9bf33af792a03` |
| S18 [food-current.html](https://www.edinburghcommunityfood.org.uk/)                                                                                                                                          | 当前社区零售/配送网页；2024Oct1仓库市场、2020Dec17配送重刊，限Edinburgh不含East/West/Midlothian。；发布/生效 精确日未核 | 2026-10-13T06:21:39.296515+00:00；91,117 bytes    | `e116e33314dfe0e4b9cb508375441dd6d565e1903f1b5fa5c851a7e399241ade` |
| S19 [airport2025.html](https://corporate.edinburghairport.com/record-year-for-edinburgh-airport-in-2025)                                                                                                     | 观察2025实际16980588旅次、新开航线；2026将新增不当已经执行。；发布/生效 精确日未核                                      | 2026-10-13T06:14:36.969594+00:00；125,666 bytes   | `917816fedf86957485c74849c78657e307e09d6b1490780e0e13d78ddd1f3a70` |
| S20 [airport-it-incident.html](https://www.edinburghairport.com/it-system-issue-important-information-for-passengers)                                                                                        | 未标日期航管IT故障恢复；CMS含2024/2025日期且社媒链2024，不能静默指定2025事故。；发布/生效 精确日未核                    | 2026-10-13T06:14:37.623947+00:00；146,128 bytes   | `09bab8b0e43fbb26691709d2e29cb39b5794ed9634870ee7c421f9c3efc11378` |
| S21 [lner-2026.html](https://news.lner.co.uk/news/lner-restores-flying-scotsman-service-to-historic-mid-morning-time-slot)                                                                                   | 实际既有EDI-London服务及Dec2025新运行图；May18重排公告不是当日实际出发核证。；发布/生效 2026-04-24                      | 2026-10-13T06:16:09.867230+00:00；27,221 bytes    | `411acb318bad5156d9ff6a28b58a5c48843ca84a5670842680956f076966100b` |
| S22 [shared-cta2026.html](https://www.gov.uk/government/publications/common-travel-area-guidance/common-travel-area-guidance)                                                                                | 共用英国公民CTA居留/工作资格；不是所有家庭成员或所有目的地。；发布/生效 2026-01-01                                      | 2026-10-13T04:55:41.678621+00:00；99,582 bytes    | `887d27e34913f9d5c239a651507b3b8c5024975798fff618211b5f2d00d0afc6` |
| S23 [shared-pension-transfer.html](https://www.gov.uk/transferring-your-pension/transferring-to-an-overseas-pension-scheme)                                                                                  | 共用当前QROPS税务/转移规则；不是普通现金转账上限或所有养老金无税。；发布/生效 精确日未核                                | 2026-10-13T04:55:41.680123+00:00；77,116 bytes    | `acc30b14955ca0bbd05f5a521d08f4ce319bb94ea4a99ea2fcdade3ad9c2ff91` |
| S24 [shared-bank-transfer-current.html](https://www.bankofireland.com/help-centre/faq/much-can-transfer-365-online/)                                                                                         | BOI实际365手续，GBP服务NI/GB；普通账户适配假设，不把ROI InterPay当GB路径。；发布/生效 2026-03-09                        | 2026-10-13T05:57:59.991392+00:00；61,582 bytes    | `a12d06cd5b2f2ba7c8d487fe10c3d9e289055f42eb228698c6078f0362897688` |

## Web-only原正文（原件身份未取得）

以下是一手原站正文已由web工具阅读；原bytes/SHA未知，`web-read-notes.json`仅分析者笔记，不能拿该笔记hash冒充原站响应。没有浏览器UTF8解码存档被当原件。某入口curl失败不证明居民路径缺失；不是透明度扣分。日期没有原文声明者保留未知，正文明确事件窗另列。

| 原URL                                                                                                                                                                | 实际事件/规则/限制                                                                                                                               | 查阅与原bytes           | 原SHA/身份                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | --------------------------- |
| W01 [原站正文](https://www.nhsinform.scot/care-support-and-rights/health-rights/access/accessing-and-using-the-nhs-in-scotland)                                      | NHSScotland通常多数GP/药房/医院/急诊免费，牙科/眼镜可收费；GP登记和通常转诊。curl403，web原文已读。；精确首发/更新日未核                         | 2026-10-13；原bytes未知 | 原SHA未知；未取得有效原响应 |
| W02 [原站正文](https://www.scotland.police.uk/what-s-happening/news/2023/december/twenty-six-people-charged-in-connection-with-bonfire-night-disorder-in-edinburgh/) | Nov5 2023；26人51charges，另1人2项待报告；Niddrie煽动/供应烟火指控与实际调查；不是已定罪。；精确首发/更新日未核                                  | 2026-10-13；原bytes未知 | 原SHA未知；未取得有效原响应 |
| W03 [原站正文](https://www.scotland.police.uk/what-s-happening/news/2024/november/four-more-arrests-following-bonfire-night-disorder-in-edinburgh/)                  | Nov5 2024 CalderRoad公众/警察/公交受烟火投射，CaptainRoad公序人员受袭；Nov12–13逮捕及总13charged/5搜家/2扣车。；精确首发/更新日未核              | 2026-10-13；原bytes未知 | 原SHA未知；未取得有效原响应 |
| W04 [原站正文](https://www.scotland.police.uk/what-s-happening/news/2026/september/arrests-following-disorder-in-edinburgh-city-centre/)                             | Sep12–13 2026 PrincesStreetGardens事件：攻击/破坏/侵轨/公交中断，8逮捕中周六4已起诉、周日4被捕；大多数观众良好。；精确首发/更新日未核            | 2026-10-13；原bytes未知 | 原SHA未知；未取得有效原响应 |
| W05 [原站正文](https://www.scotland.police.uk/what-s-happening/news/2026/june/arrests-following-demonstrations-across-scotland/)                                     | Jun9 2026 Glasgow3逮捕、2警3公众受伤/种族袭击；Edinburgh扰动但和平且无逮捕。Glasgow不冒充当地；协调及社区工作。；精确首发/更新日未核             | 2026-10-13；原bytes未知 | 原SHA未知；未取得有效原响应 |
| W06 [原站正文](https://www.spenergynetworks.co.uk/news/pages/power_restored_storm_eowyn.aspx)                                                                        | Jan24–30实际中央/南Scotland206000客户恢复，多数24h内、尾部6日，700工程师/外部支援、食物车/暖点/酒店；SMS270000非户数。原curl403。；2025-01-30    | 2026-10-13；原bytes未知 | 原SHA未知；未取得有效原响应 |
| W07 [原站正文](https://www.edinburgh.gov.uk/using-library/computers-libraries)                                                                                       | 当前免费公共电脑/无线/办公扫描；会员预约通常1小时/天、可追加，有电话；youngpeopleWiFi暂不可用。页面更新窗未知，须截止延续。；精确首发/更新日未核 | 2026-10-13；原bytes未知 | 原SHA未知；未取得有效原响应 |
| W08 [原站正文](https://www.edinburgh.gov.uk/cost-living/support-digital-skills-devices-data)                                                                         | 实际公开115电脑及设备/数据/技能帮助渠道；2026将升级非已全部完成，慈善数据资格不是全民免费家庭网络。；精确首发/更新日未核                         | 2026-10-13；原bytes未知 | 原SHA未知；未取得有效原响应 |
| W09 [原站正文](https://www.scottishwater.co.uk/in-your-area/service-updates/eh12-edinburgh-11092026)                                                                 | web原运营更新Sep11 2026 11:55 Stage5供水恢复；正文早期阶段已移除，时长/全范围未知；FAQ不是每户已清洗证明。；精确首发/更新日未核                  | 2026-10-13；原bytes未知 | 原SHA未知；未取得有效原响应 |

## 失败响应与停止条件

| 原尝试URL/缓存                                                                                                                                                                        | HTTP/工具失败机制                                                                                                                                                                                          | 实际取回UTC/失败bytes                                     | 失败响应SHA（不作原件）                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [digital-current.html](https://www.edinburgh.gov.uk/using-library/computers-libraries)                                                                                                | 000 / / https://www.edinburgh.gov.uk/using-library/computers-libraries；exit35；TLS35；0bytes                                                                                                              | 2026-10-13T06:16:04.803154+00:00；0 bytes（失败响应）     | null（不作原件）                                                               |
| [digital-support-current.html](https://www.edinburgh.gov.uk/cost-living/support-digital-skills-devices-data)                                                                          | 000 / / https://www.edinburgh.gov.uk/cost-living/support-digital-skills-devices-data；exit35；TLS35；0bytes                                                                                                | 2026-10-13T06:16:04.805022+00:00；0 bytes（失败响应）     | null（不作原件）                                                               |
| [islet-pag-index.html](https://www.odt.nhs.uk/transplantation/tools-policies-and-guidance/advisory-committees/)                                                                       | 404 / text/html; charset=utf-8 / https://www.odt.nhs.uk/transplantation/tools-policies-and-guidance/advisory-committees/；exit0；拒绝/非正文                                                               | 2026-10-13T06:17:00.381865+00:00；30435 bytes（失败响应） | `7a8f1923de8a2bbb5c8ad1f10111d12beb45f8876c845fb63a00ef2f6f5841ac`（不作原件） |
| [nhs-qualification-current.html](https://www.nhsinform.scot/care-support-and-rights/health-rights/access/accessing-and-using-the-nhs-in-scotland)                                     | 403 / text/html / https://www.nhsinform.scot/care-support-and-rights/health-rights/access/accessing-and-using-the-nhs-in-scotland；exit0；拒绝/非正文                                                      | 2026-10-13T06:14:29.766159+00:00；38 bytes（失败响应）    | `72bd21fb766d2ca6168439d6f0169623bee9f87b7ff574a48be40f5182e55594`（不作原件） |
| [police-current2026.html](https://www.scotland.police.uk/what-s-happening/news/2026/september/arrests-following-disorder-in-edinburgh-city-centre/)                                   | 000 / / https://www.scotland.police.uk/what-s-happening/news/2026/september/arrests-following-disorder-in-edinburgh-city-centre/；exit35；TLS35；0bytes                                                    | 2026-10-13T06:16:04.799546+00:00；0 bytes（失败响应）     | null（不作原件）                                                               |
| [police-regional2026.html](https://www.scotland.police.uk/what-s-happening/news/2026/june/arrests-following-demonstrations-across-scotland/)                                          | 000 / / https://www.scotland.police.uk/what-s-happening/news/2026/june/arrests-following-demonstrations-across-scotland/；exit35；TLS35；0bytes                                                            | 2026-10-13T06:16:04.801282+00:00；0 bytes（失败响应）     | null（不作原件）                                                               |
| [police-response2024.html](https://www.scotland.police.uk/what-s-happening/news/2024/november/four-more-arrests-following-bonfire-night-disorder-in-edinburgh/)                       | 000 / / https://www.scotland.police.uk/what-s-happening/news/2024/november/four-more-arrests-following-bonfire-night-disorder-in-edinburgh/；exit35；TLS35；0bytes                                         | 2026-10-13T06:16:04.799439+00:00；0 bytes（失败响应）     | null（不作原件）                                                               |
| [police-violence2023.html](https://www.scotland.police.uk/what-s-happening/news/2023/december/twenty-six-people-charged-in-connection-with-bonfire-night-disorder-in-edinburgh/)      | 000 / / https://www.scotland.police.uk/what-s-happening/news/2023/december/twenty-six-people-charged-in-connection-with-bonfire-night-disorder-in-edinburgh/；exit35；TLS35；0bytes                        | 2026-10-13T06:16:04.799143+00:00；0 bytes（失败响应）     | null（不作原件）                                                               |
| [sp-restored2025.html](https://www.spenergynetworks.co.uk/news/pages/power_restored_storm_eowyn.aspx)                                                                                 | 403 / text/html / https://www.spenergynetworks.co.uk/news/pages/power_restored_storm_eowyn.aspx；exit0；拒绝/非正文                                                                                        | 2026-10-13T06:30:09.230748+00:00；450 bytes（失败响应）   | `820d36e9ae88ab7d0733ff59dc45021359fd11880835261e6541fe9062e1ed1c`（不作原件） |
| [sp-vulnerability2025.pdf](https://www.spenergynetworks.co.uk/userfiles/file/46695_SPEN_202425_AVR_submission_AW_V5.pdf)                                                              | 403 / text/html / https://www.spenergynetworks.co.uk/userfiles/file/46695_SPEN_202425_AVR_submission_AW_V5.pdf；exit0；拒绝/非正文                                                                         | 2026-10-13T06:14:38.071176+00:00；477 bytes（失败响应）   | `0cd0f6198565a975d5c938cd66f0723032a365f3b992a3be822cdadbc09e2a8d`（不作原件） |
| [water-repaired2026.html](https://www.scottishwater.co.uk/in-your-area/service-updates/eh12-edinburgh-11092026)                                                                       | 403 / text/html / https://www.scottishwater.co.uk/in-your-area/service-updates/eh12-edinburgh-11092026；exit0；拒绝/非正文                                                                                 | 2026-10-13T06:14:29.769411+00:00；179 bytes（失败响应）   | `1f2e1251b1d5fab2f47bbfe3e09b149064e61571f98a5e02c6ace5f86bacb1d5`（不作原件） |
| [water2025.pdf](https://www.scottishwater.co.uk/-/media/scottishwater/document-hub/key-publications/annual-reports/scw2799-annual-report-2025_interactive-full-v12-not-signed-ag.pdf) | 403 / text/html / https://www.scottishwater.co.uk/-/media/scottishwater/document-hub/key-publications/annual-reports/scw2799-annual-report-2025_interactive-full-v12-not-signed-ag.pdf；exit0；拒绝/非正文 | 2026-10-13T06:14:29.771177+00:00；179 bytes（失败响应）   | `1f2e1251b1d5fab2f47bbfe3e09b149064e61571f98a5e02c6ace5f86bacb1d5`（不作原件） |

Police4入口在同一已排批次内全部TLS35失败，得知同机制后不再重试/新增同origin原抓；没有称前三已失败后仍主动发第四。两次SP原抓403后正文web-only已读，未强补PDF；NHS Inform、Scottish Water403亦原文web-only与raw分开。ODT advisory-index404没有有效PAG索引原件，但直接NHSBT PDF有效；web工具的PAG索引/ECF AGM不可读只作检索失败，不造原bytes或断言服务不存在。三次同入口机制失败上限及两轮发现停止已遵守，无需每未知主动凑三次失败。

## PDF目视与交接

实际`pdftoppm`渲染后`view_image`：HIS检查physical5（printed7）；行动physical3/4；Council annualphysical54；NSDphysical5（spreadprinted7–8）；islet summitphysical4、ratifiedminutesphysical6；S38 floodphysical133；DWQRannualphysical44/45、incidentsphysical2/7、performancephysical2/3。PNG在`pdf-visual/`；其余数字明确来自文本抽取，不声称逐页目视全部原件。抽取与见表单位/分层一致；MarchbankSerious/Significant、住房9.8%分母及政府HISrequirements称谓冲突仍保留，SIK未解分类不修正。

交接 `candidate-handoff.json` 使用既有case字段和全部31键，LON null的conditionalAlternatives空数组；`source-manifest.json`分有效原响应/同源复用/有效排除/web-only/失败/PDF实际目视，`boundary-record.json`与`screen-context.json`单列推导。共享JSON/矩阵/页面/旧案例未改，主代理统一校准/验收；格式仅对本MD执行pnpm Prettier，定稿SHA另交`handoff-hashes.json`。

## 根代理统一验收

2026-10-13独立核28份有效原响应bytes/SHA、完整9031目标几何及13个近似参考点；目视Marchbank实际失控／监管评语、COBE设备连续性、产科改善与住房KPI。原主GSS60在一致性审查后撤回，研究代理确认区域／战略连接未闭；其余七维不变。供水样本合格率不代处理事件消失，较晚真实护理改善与旧检查异常并读，设备旧风险不直接判当前已停服。主档及算术以上为准，原临时交接保留研究过程。

## GSS共同门槛澄清

当前GSS继续未知，分值和其他七维不变。旧文要求补“实际区域／战略影响”的措辞不应解释为先发生战争或成功攻击才可评分；需要补的是有范围的风险／影响观察、相关情景与本地或真实共享服务已运行能力的匹配及残余解释。国家预测、普通设施或一般交通扰动不够，但明确适配的现役保护允许同层条件判断。此澄清没有取得新的城市能力证据，不能据此自动填60。详见[40份冻结输入的同尺度审查](cci-gss-comparability-review.md)。
