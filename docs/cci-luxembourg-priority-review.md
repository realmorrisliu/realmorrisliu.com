# 主任务验收说明

最终采纳见[八维评分验收](cci-luxembourg-score-completion-review.md)：PCS40、ISR／MED／LON／TEC60，GSS／RES／OPT未知，原权重数学域36—71，无完整总分。根独核103冻结文件、19原件及18页PDF关键原表，补充TEC40替代、住房与设备短板的裁档解释。原80案整文件不变，研究固定79案后的埃因霍温另保留。以下冻结研究原稿不替代根验收，SHA分别记录。

---

# Luxembourg103：有界八维研究，待根独立验收

建议 **PCS40、GSS未知、ISR60、RES未知、MED60、LON60、TEC60、OPT未知**。已知加权小计36，数学域36—71；没有完整总分、中心值、概率或排名。LON60依据有限疾病造血重建路径，不能读成健康人延寿。31项均逐项记录，**没有任何一项完整测量**。

本任务只交接一城。固定 Git `c3844ad2b5378211b9534b01eac9c7c6a46b45c8` 的79原案／18完整，逐整文件字节与SHA在 `fixed-input-guard.json`；未刷新成后续别城增量，未写仓库／提交／部署。所有9,031旧候选、新旧遗漏及未匹配竞争者继续保留，零排除；此案不能证明全球Top32。

## 共同画像和空间

2026普通卢森堡本国公民，通常长期当地居住、当地中位收入、通常有效保障，无固定年龄；证据截止2026-10-10。权重PCS/GSS/ISR/MED各15、RES/LON/TEC/OPT各10。适应证中的年龄／疾病限制属于治疗路径，不替换整城人物画像。只用有限可撤的通常取得、地域、付款、照护及时间延续判断。

独立加载全部9,031几何／136修复，目标LUX103／UC2253／1,055km²，WKB SHA `2b6a479b524567ec3ff529dd9e9ef123ee196352940ca13119e2c07b7a730672`。城市中心、CHL、Belval研究区、机场四个分析者近似点均落103；不把点当正式院区、覆盖足迹或可达证据。市镇、国家、医院患者和跨境通勤区不能整搬FUA；2015人口仅元数据，不作2026分母。共享GPKG实际SHA和全库结果见 `geometry-check.json`。

## 最有辨别力的事实

**医疗确有运行，支付也有普通路径。** CHL2024实际列27,372次住院、16,551次手术、12,053次化疗、16,329次透析；这些是机构活动，不是不同居民受益人数。93.76%每日评估疼痛来自PRN住院样本；20,678跌倒风险评估和23,978指导性护理计划是过程，不是死亡率或治愈率。专科接续有多学科会诊、专科护士、移动姑息团队及24/7神经外科。部分科室表把大数标作“hospitalisations stationnaires”，与全院表量级不一致，**不据此重编码成床日，也不相加成独立患者**。[S01](https://www.chl.lu/sites/default/files/2025-10/rapport-annuel-chl-2024.pdf)

CNS页面最后修改20May2026：合资格标准住院医院账单直接CNS；医生可能仍先垫后报，超过三日住院或医生账单超€100可由医生直付申请。普通成人门诊医生目录价88%、未满18岁100%，住院／日间目录医生费100%；标准病房€26.79/开始日、每历年最多30日，未成年人及生育首12日等例外；日间€13.40另有条件。私人舒适／房型、可能66%医生加价和目录外费用不能当全部报销。1Mar2026 CNS合订说明第154bis条：仅所列合资格共付超过上年年化缴费收入2.5%可年度申请补偿，共保家属合并，不含所有私人／未覆盖支出；封面明确合订本为文献说明、没有独立法律价值，未冒已核Legilux原公报。Guichet页面名义最后修改2018，其当下正文的RIB／eDelivery路径与日期分别保留；资格、先垫流动性和申请负担都未消失。[S02](https://cns.public.lu/fr/assure/remboursements/prestations-remboursees/hospitalisation-cure-reeducation.html)[S07](https://cns.public.lu/dam-assets/legislations/statuts/statuts/cns-statuts-01032026.pdf)[S09](https://guichet.public.lu/fr/citoyens/sante/remboursement-frais-medicaux/prestations-sante-resident/prise-en-charge-resident.html)

**细胞治疗既有实际采用，也有安全与资金缺口。** 25Apr2025会议、23May2025成文的CPH记录称CHL2024完成23自体移植、8人CAR-T；自体移植是特定骨髓瘤首线／淋巴瘤二线标准疾病路径，采集、准备、储存、回输、隔离监护已组织。各国内医院至少已转诊1名CAR-T患者，不能当全部患者畅通。1—2周强化监护实际需要与希望加装遥测并存。正式记录指出旧设备／设施不足，需改隔离室、洁净室、实验室、药房、备援车及信息布线；€2.3m项目及将形成有利意见，**不是已拨付／竣工／截止全部合规**。[S04](https://santesecu.public.lu/dam-assets/fr/publications/c/cph-2025/cph-compte-rendu-de-la-cph-du-25-avril-2025-sign.pdf)

CHL年报8人中6“有利反应”未给产品、反应定义或随访窗，不能当长期生存。MEDINLUX43/2025本地团队明确CNS承担CAR-T治疗成本，但物流、专业团队和设备工作未充分计价；数周制造需稳定病情，治疗后神经／炎症密切监护，感染风险可持续数月，免疫球蛋白补充又常短缺。Kite认证特定产品／适应证；J&J骨髓瘤认证当时仍是未来，不把一般列举的适应证当本院全已采用。[S01](https://www.chl.lu/sites/default/files/2025-10/rapport-annuel-chl-2024.pdf)[S12](https://www.chl.lu/sites/default/files/2025-03/ml0495f-digital_0001.pdf)

成熟人体依据采用已核Leuven2024自体造血重建描述和2016—24首自体移植n463的KM长期观察。它证明某类严重血液病的细胞重建已有长期人体经验，**不等RCT因果、不把比利时生存曲线或支付搬成Lux结果**；“graft versus host-disease”原句混杂不解释为有益GVL。LON60的有限桥为同类成熟疾病重建—本地标准自体移植实际23例—通常CNS医院费用及监护，而不是把未注明品牌的8例CAR-T接到别产品成熟结果上。[R04](https://www.uzleuven.be/nl/media/600a8621-93f2-47a9-887c-01d563e9b672/Jaarverslag%20transplantatie%202024%2012%20stamceltransplantaties.pdf)[S02](https://cns.public.lu/fr/assure/remboursements/prestations-remboursees/hospitalisation-cure-reeducation.html)[S04](https://santesecu.public.lu/dam-assets/fr/publications/c/cph-2025/cph-compte-rendu-de-la-cph-du-25-avril-2025-sign.pdf)

**环境有已交付保护，重要防护仍在研究／施工阶段。** 市2024环境报告印Feb2026、当前PDF修改Mar2026，记2023已完成Pétrusse首段再自然化；2024第二阶段是研究后招标，其他河流与暴雨／泥流预防多数仍研究。报告载百年河洪情景1,147人、极端情景2,116人潜在受影响；另一初步分析16,088建筑／4,906高风险的对象与情景不同，不能拼同一人口暴露率，更不是2024实损或FUA2026率。免费逐户专业评估只是已提供入口，不等全部受威胁住房已加固。[S03](https://www.vdl.lu/sites/default/files/media/ni/document/VDL_2024_Grand-Rapport-Environnemental.pdf)

**供水不是只列设施，净取得仍有疑问。** 市2024实际供水含自有泉水／SEBES；新Kirchberg水塔Mar2024投运，38%水表智能化。4,487总化学／细菌检查与132常规+23完整检查内9项不符合的集合不同；后者涉及铁或温度下菌落指标，原报告解释楼内腐蚀／滞水与网络影响，并称这些为指标参数而非公共健康阈值超标。不把9/4487当家庭不安全率，也不自行消除楼内问题。市域可再生生产/最终能源消费4%，行政自身119%是另一口径，不是全城119%自足，也不能由4%推96%能源全进口。[S03](https://www.vdl.lu/sites/default/files/media/ni/document/VDL_2024_Grand-Rapport-Environnemental.pdf)

食品帮助确实收集／分发且有地点和营业时间，需社会办公室需要评估与卡，贡献€2；登记家庭逐增以食物余量为限，不等足量营养覆盖中位居民。2026能源补助需先有国家授予证明，市单人€440／减额€220；2025+团结补助单人€550，均有资格及申请，不是已付款总数或中位收入自动取得。水食能已交付的帮助没有被忽略，但本轮不足以确定资格之外目标家庭净预算方向，RES保留未知。[S08](https://www.vdl.lu/fr/vivre/aides-et-services/aider-les-personnes-en-difficultes/allocation-de-solidarite-et-prime-denergie)[S11](https://www.vdl.lu/fr/vivre/aides-et-services/aider-les-personnes-en-difficultes/epiceries-sociales)

**执行和技术应用真实，不能把计划换实绩。** Tram2025-03-02已延至机场，现役16km+/24站连接Gare、Howald、机场与巴士；国内公共交通普通二等自2020免费，不是跨境列车／机票免费。LIST2025报告有21付费许可、13申请专利和科研产出；MicrObs已能定量测RSV、CEBI共同测试平台、CFL的OHMIO2025启动、城市38%智能水表等提供实际产用连接。GRADEL组件是概念证明，ValueHeat测试／Goodyear合作与Amiens工厂重构方法不等当地全部量产；SMARTSPIRES／6G原型多仍未来。国家／国际项目不能全部划本FUA，许可数不直接换CCI分数。[S03](https://www.vdl.lu/sites/default/files/media/ni/document/VDL_2024_Grand-Rapport-Environnemental.pdf)[S05](https://annual-report2025.list.lu/fileadmin/user_upload/LIST_Annual_Report_2025.pdf)[S06](https://www.luxtram.lu/la-ligne/mise-en-service-du-premier-troncon/)[S14](https://www.luxtram.lu/tarifs/)

**安全和退出不能凭常识补值。** 2024-11-16 CHL确实210+人参加、100模拟伤员的恐袭演练，发现保温毯、设备和通信角色短板；2024测试8/15危机计划，正文“60%每年”不与8/15强行算相等。未来NRBC去污箱／2026演习不当完成，学校碘片储备和持续分发也不能代表组织暴力低影响。真实保护进入GSS讨论，但组织暴力及邻区外溢的有范围实际影响桥仍不足，主null。[S01](https://www.chl.lu/sites/default/files/2025-10/rapport-annuel-chl-2024.pdf)[S10](https://www.vdl.lu/fr/vivre/aides-et-services/securite)

EU原件说明合条件劳动／自营居留与注册、5年合法居住后永久权；欧元跨EU付款同类国内收费与IBAN不歧视、强认证；临时漫游的公平使用与长期使用加费规则。现有真实机场／铁路接驳、RIB支付和EU普通权利不能自己补出已就业、长期目的地资源、维持银行／通信及应对共同断路的个人链。OPT主null不是要求品牌套餐、全目的地交易或固定成年，而是仍未形成通常预算下可启动并延续的有限长居判断。[R01](https://europa.eu/youreurope/citizens/residence/residence-rights/workers/index_es.htm)[R02](https://europa.eu/youreurope/citizens/consumers/financial-products-and-services/payments-transfers-cheques/index_en.htm)[R03](https://europa.eu/youreurope/citizens/consumers/internet-telecoms/mobile-roaming-costs/index_en.htm)[S06](https://www.luxtram.lu/la-ligne/mise-en-service-du-premier-troncon/)[S09](https://guichet.public.lu/fr/citoyens/sante/remboursement-frais-medicaux/prestations-sante-resident/prise-en-charge-resident.html)[S14](https://www.luxtram.lu/tarifs/)

## 八维裁档与撤回条件

### PCS：40

已完成局部河道再自然化、医院洪水/断电实演，但城市报告仍列河洪/暴雨/泥流实际威胁和重要未完成防护；帮助后仍有明显局地安全约束，有限40。不是以研究缺项或少数事件自动扣分。

接受市镇关键河谷/医院风险对FUA能力有重要作用及2024已识别防护缺口至截止仍重要；不称1147/2116为2026实际受害或全FUA率。若新增措施已将主要危险合理缓解可60，拒绝重要性/地域/时点桥则未知。

### GSS：未知

真实恐袭演练与关键医院保护已核；但现有资料未连到有范围的实际组织暴力/邻区外溢影响及城市其他关键通道。局部备灾不能单独判60，未知也不等40。

60需有限窗口低实际影响与匹配保护的可解释地域判断；40需威胁在帮助后仍形成明显生活/通道约束的正证。无须先发生战争或逐节点攻击测试；本轮没有此桥，保留null。

### ISR：60

实际水务、交通和医疗付款/数字加线下入口运行，多组织危机实演识别并反馈缺点，支持普通居民可用服务的有限60。住房供给失配、帮助资格/食物余量及材料通信缺口重要，不被服务量抵消。

接受关键共享服务和市镇/机构实交付对普通长期居民的有限代表性并延续至截止；帮助有实际低价食品/免费交通/通常CNS付款作用，故不能仅由计划存在加分。若住房/触达/交付缺口被有据判断为明显服务约束可40，不要求障碍主导；拒绝有限代表性则未知。

### RES：未知

实际供水双来源、测试/水塔、能源节约生产、低价食品与能源帮助均核；但可得水/食/能在目标中位居民预算中的净方向未定。帮助限资格和余量，4%可再生生产比不等全部进口依赖；未证崩溃不补60。

60可基于有限但有据的通常够用且净可取得桥，不必全户账单；40可基于帮助后重要净负担/来源共同失效约束，不必多数受害。此处既无资格外中位家庭实际负担方向，也不把未证救助成功当失败，主null。

### MED：60

多病种必要治疗/专科和接续实际交付，过程质量有范围证据；通常CNS直接医院付款、受限共付及补偿减轻净费用，有限60。心理急诊等待、需境外协调的紧迫生育保存、设备/人力资金不足和药物短缺均是重要余障。

接受2024服务与2025制度路径到2026截止延续、普通有效保障可使用标准病房和合资格目录、重要专科监护可维持；付款并非所有费用2.5%封顶，医生先垫及私人费用保留。正证为实交付/过程质量及净付款，不是未见全面失败；若重要等待/质量/接续短板在缓解后仍构成明显约束可40，拒必要桥则未知。

### LON：60

有限60主要立在疾病造血细胞重建/自体移植成熟人体路径与CHL实际23例采用、国家转诊/通常付款和严密监护；CAR-T8例6反应仅补充本地执行，不当成熟OS或健康人延寿。设施与计价不足、Ig短缺和严格适应证明显限制普及。

外部自体移植n463描述性长期人体经验仅支持同类疾病重建成熟度，不移植比利时效果/支付或产品。接受本地标准适应证、合资格付款及监护在余障下通常可取得且有限延续；实际治疗发生不证明整改已完成，若安全/资源缺口导致明显转化取得断点可40，拒该平台/作用桥则未知。

### TEC：60

科研/付费许可持续产出、检测平台与CFL实际启动、污水RSV技术及居民共享水表/公共数字取得形成真实产用链，有限60；不由专利或机构声誉换分。大量智能城市/6G/材料仍试验或未来，扩散强度与群体接入未证明广泛冗余。

接受Belval节点及实际合作/城市技术扩散对FUA的有限作用；全国国际输出不全归当地居民，Amiens工厂方法不当本地完成改造。剩余产业扩散/项目阶段限制使60可解释，80需更广实际采用/多节点持续能力；拒代表性/延续则未知。

### OPT：未知

机场/铁路换乘与国内免费交通已运行；EU条件迁居、欧元支付和临时漫游原件可用。此组合尚未有据确定普通画像长期离开后的住居/收入条件及通信接续的净可用方向，保留未知。

不要求每个目的地逐笔交易、品牌手机或固定成人；若接受通常预算下可启动并延续一条EU合法长居/资源和通信路径，可有限60。40须有帮助后重要实际通道约束正证；这里只缺实质个人长期桥，不由未测备援自动40。

## 31项、来源及停止边界

`coverage31.json`逐项列实际／局部／背景／未启动，未以数据量当能力。地质项未启动、其他很多项只部分覆盖；“完整八维研究”指本轮逐维完成有界裁决，不是八个数或31项完整测量。未知维度的alternatives=[]；40/60讨论不塞进主值或中点。原权重36—71只属未知0—100数学域，不是置信区间。

新本地发现严格两轮各4查询；与已关闭的EC83/WHO全局专题分开，未重开全局。旧EC/WHO字节均不在持久目录，旧SHA只定位；旧失败日记缺失计数未知，零新EC/WHO请求。此前EC医疗87.41%、行政69.68%、便宜住房13.78%等只排程／背景，不充当前原件，不把15+任国籍市镇样本变成中位本国公民。

15次normal源提交全部有效、4份持久原件逐bytes/SHA独核，共19份有效原件；每批源／请求／像素显式assert≤3。**S15自动由www.infocrise.lu跳到infocrise.public.lu/fr.html；取证器没留中间redirect链，所以至少16实际normal路径，确切路径次数及含路由18上限不能认证。**已在15次源提交留余量停止，不为补合规重发。HTTP Date/LastModified和中间头也没记录，不能由文件哈希、PDF元数据或当前页面反推。源/观察窗/名义版本/真实请求时间分别留 `source-manifest.json`。

CHL2025德语索引web403一次、VdL sitemap webtimeout一次均保留；成功不清失败，不重试失败具体入口。其他实际已定位原件不同路径的成功不冒停源重开；第三同机制失败停止规则保留。NHS England/UCLH/ING等旧停止未触碰。全部新normal无失败；web导航／计划／预告没有被写成实际评分交付。完整历史web工具正文在`web-transcripts.json`，其原文为本地原工具记录，**不是网站HTTP bytes/SHA**。采集失败不给城市能力或透明度扣分。

18个关键PDF物理页已实际打开目视，源SHA、图SHA、页和判读在`pixels.json`，不是用抽取文本冒目视。原源复用只继承确存的字节和可核旧记录，不伪造原HTTP抓取／响应头或Oct10同字节认证。全部当前抓取Oct15；截止适配是明示的时间判断，不是时间机器证据。

## 敏感性和最小交接

撤任一有值维度的必要桥即恢复未知，不机械改40。PCS40改60，域39—74；ISR/MED任一60改40，域33—68；LON60改40，域34—69；TEC60改80，域38—73。具体撤回域和替代域由case-handoff原权重直接计算。安全、资源和退出未知各自保留，不能把资料少当表现差，不能用已评案例排除未评竞争者。

交接文件：本报告、`case-handoff.json`、`coverage31.json`、`source-manifest.json`、`source-and-stop-ledger.json`、`pixels.json`、`geometry-check.json`、`fixed-input-guard.json`、原件及`frozen-manifest.json`。冻结后停止；由根按同尺度独立验收单城发布，不在本任务自动扩新城。
