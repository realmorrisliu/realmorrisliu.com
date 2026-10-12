# Prague MED / LON 临床证据复核

研究口径：冻结 **eFUA 535 / Prague / CZE**；2026 年当地普通捷克公民、通常长期居民、当地中位收入、通常医保。证据截止 **2026-10-10**，查阅 **2026-10-12**。沿用[共同规则](cci-global-scoring-rubric.md)，本文提出可撤回的研究判断，主案例负责采信和演算；不构成完整候选比较或全球入围结论。

## 建议及改变条件

| 维度 | 建议               | 依据、反证与必要假设                                                                                                                                                                                                                                                                                      |
| ---- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MED  | **unknown / NULL** | 已见广泛专科接诊、医保保护、已运行的肿瘤治疗扩容，也有多类长等待与认知首诊限制。但等待表是近似平均、非完整患者队列；限收与替代途径并存。当前证据没有充分判别这些约束在缓解后对通常居民的整维重要性，常规质量结局和压力连续性亦未形成可辩护的综合判断。不是缺公开资料直接给低分，也不由服务存在统一填 60。 |
| LON  | **条件性 60**      | 可信人体／EU 监管、2025 布拉格真实 CAR-T 给药、住院获保及逐例审批路径支持有限疾病转化，风险、适应证、制造时间和普遍可得性限制明确。须接受这条疾病路径的代表性、当地实际交付与服务范围、2025→截止延续、适当安全及长期监测，以及通常合资格中位居民能够进入并承担治疗相关负担。拒绝任一关键假设则 **NULL**。 |

**MED 40 和 60 的区别尚未充分解决。** 40 可以作为接受长等待／接诊限制经合作转诊和扩容后仍重要的敏感情景；60 需要将已运行的通常服务、必要专科、费用保护及适当质量／持续能力综合解释为通常适足且仍有重要短板，不能只因未证明失效便默认。这里不要求完整人口测量或所有病例零等待；关键是现有有限材料是否足以作相同目标居民和全维解释。下一条有辨别力的事实是截止前本地实际等待与完成治疗队列，保留临床优先级、替代转诊结果、通常质量结局和居民资格，证明重要瓶颈仍存在或已充分缓解。80 还需较强的质量、转诊与压力持续服务基础；未测高档不是降档理由。[共同规则](cci-global-scoring-rubric.md)

**LON 60 不是批准或给药量自动换分。** 在同一链中有已交付药物、可信人体与监管、支付路径和本地重症／随访组织，同时承认长期风险、制造及个案准入条件。40 需要已核的重要人体—监管—居民获得断点，不能由查不到 lecanemab 给药直接推广整个本地转化能力。若真实拒批／无法承担、制造等待或安全监测缺口经缓解仍阻断通常合资格居民，应审 40；仅拒绝必要适用假设则回到 NULL。多个 CAR-T 商品、同一药物多个病例和产品分发量不自动等于多条成熟延寿路线，也不支持 80。若多个真正不同的可信临床路径和审慎实际居民获得被核实，可重审 80；不是用未知封顶。[ÚHKT 2025 年报](https://www.uhkt.cz/soubory2/vz-25-online.pdf)、[医保与安全专业原规则](https://www.hematology.cz/wp-content/uploads/2023/01/20-Bunecna-terapie-CAR-T-verze-01-2023.pdf)、[共同规则](cci-global-scoring-rubric.md)

## 1. 地域、人物与截止资格

[冻结候选 CSV](data/cci-global-candidates-r2019a.csv)已核：eFUA 535，UC 2927，面积 **2,897 km²**，2015 模型人口 **1,879,976.61**。本轮医疗样本主要是 Prague 的 VFN、Motol 和 ÚHKT，不是完整 eFUA 的逐人覆盖。医院接收全国转诊、机构网络跨地域，不能将治疗者自动称本地普通居民，也不按整个中波希米亚、都市区或 Kladno 继承分数。地址、主要服务点与全服务区／实际给药地点／患者居住地的核验分开。

人物使用题设的通常公保，但公民、长期居住不单独证明具体病情、保险机构、合同 provider、批准或附加服务资格。家庭／个人收入、旅费和陪护负担本次未与当地中位收入逐项匹配。国家直接医保规则可说明资格／支付，不作为 Prague 治疗质量或全民可得的代理。[VZP 给付范围](https://www.vzp.cz/pojistenci/informace-a-zivotni-situace/naroky-pojistence/zdravotni-sluzby-hrazene-ze-zdravotniho-pojisteni)、[CAR-T 住院支付条件，第 7 页](https://www.hematology.cz/wp-content/uploads/2023/01/20-Bunecna-terapie-CAR-T-verze-01-2023.pdf)

以下区分 **观察年度、文件正文日期、批准、生成／修订元数据、首次公开、当前获取字节**。没有取得截止历史字节；标示早于截止支持明示的当时可用假设，不独立认证原样公开。未标日期的当前网页仅作附条件补充，不能倒写成 10 月 10 日已发生的全部事实。日期资格详列文末。

## 2. MED：实际等待与缓解不能各取一边

### VFN 2026 等待清单：优先级、近似方法和选择分母

[VFN 官方入口](https://www.vfn.cz/pacienti/informace-pro-pacienty/cekaci-doby-ve-vfn/)标最近更新 **2026-02-03**，说公布超过手术 **2 月**、检查 **3 周**门槛的项目，数字为近似、受急诊优先影响。所链接的[有效 7 页原 PDF](https://www.vfn.cz/wp-content/uploads/2026/02/Cekaci-doby-2026-v2.pdf)标题为 **Průměrná čekací doba / 平均等待**，也列有低于门槛项目。入口门槛与实际表项不能被改写为严格一致的全量抽样规则。

| 原表页 | 项目与原值                                                                                                 | 解释边界                                                                                                        |
| ------ | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1      | 非急症、非肿瘤血液首诊 **4 周**；II 内科心超 **8 周**；IV 内科内镜／部分麻醉结肠镜 **4 周**                | 支持通常检查确有排期；机构不同项目和优先级分开，不当所有心脏／肿瘤急症等候。                                    |
| 2      | 慢性痛：肿瘤 **1—2 周**，非肿瘤 **8—12 周**；延迟语言发育的客观预防听检 **36 周**，疑似听损检查 **4—8 周** | 同科按需要有差异，优先安排是缓解；36 周不是全部听力检查或急症。                                                 |
| 3      | 胃肠门诊 **16 周**；代谢门诊 **4 周**，阳性遗传代谢筛查 **statim / 立即**                                  | 真实长排期与筛查优先同时保留；不得把所有代谢患者都称立即可得。                                                  |
| 4      | extrapyramidal 新患者 **20—24 周**；诊断确认后开始 MS 生物治疗 **4 周**；普通神经科 **6—8 周**             | 是具体服务，不等于全神经科长期拒收；药物启动排期不证明同档临床结果。                                            |
| 5      | 儿童斜视手术 **48 周**、白内障 **4 周**；放疗 **4—6 周**、肿瘤会诊 **2 周**；记忆门诊 **2—3 周**           | 不将计划斜视手术等同所有眼科；较短记忆门诊是解释 Motol 限收的重要替代线索，但未核成功转诊、病种与同等诊断范围。 |
| 6      | 标准 MRI **5 周**、CT **3 周**、超声 **2 周**；肿瘤 PET/CT **3 周**                                        | 不是紧急影像上限、lecanemab 特定连续 MRI 完成率，也不证明可替代任意专科。                                       |

上述数值均来自[原 PDF 第 1—6 页](https://www.vfn.cz/wp-content/uploads/2026/02/Cekaci-doby-2026-v2.pdf)。表没有给出各项目病例数、测量期间、已完成者或等待库存、计算方法、收入／医保分层；因此是院方公布的近似平均，**不称完整已完成患者的实测平均／中位数、法定时限违约率或 FUA 等待率**。不能把 `neprovádí se / 不开展` 的关节置换当全城无法获得，也不能以本表之外未列项目认定无等待。

### Motol：容量限制与保留路径

[Motol 神经科官方当前页，认知中心／新患者预约](https://www.fnmotol.cz/kliniky-a-ambulance/neurologicka-klinika-2-lf-uk-a-fn-motol/)明确因容量几乎停止新患者检查，主要保留早期认知缺损、疑难／少见诊断及转诊至大学医院确有必要的患者；很多其他患者由合作院外神经和精神医生观察，有咨询转介。短期诊断床也不承担长期或社会照护。它是真实 provider 指引中的限制与替代，**不是所有患者均被拒绝，也不是本地所有认知服务停摆**。

这页没有核明首次公开／修订日期，当前还含 urolithin A 研究招募，不能凭混合页面倒推各段截止时点或已证明研究疗效。原 HTML 下载遭 403，网页主管正文在 web 读取有效；没有有效原字节哈希。若严格截止时点或其当前限制延续假设被拒绝，相关解释应撤回，而非将网络失败视为居民障碍。另一院记忆门诊 2—3 周不证明所有被拒者成功转去，但足以反对只凭 Motol 一段直接给 MED 全维 40。[Motol 原页](https://www.fnmotol.cz/kliniky-a-ambulance/neurologicka-klinika-2-lf-uk-a-fn-motol/)、[VFN 原表第 5 页](https://www.vfn.cz/wp-content/uploads/2026/02/Cekaci-doby-2026-v2.pdf)

### 已运行的肿瘤扩容和质量机制

[VFN 原发布，2025-09-29，PDF 3 页](https://www.vfn.cz/wp-content/uploads/2025/09/TZ-KOC-a-nove-denni-stacionare-Onkologicke-kliniky-29-9-2025.pdf)第 1 页明确日间治疗已扩为 **43 个给药位**，每周约 **250 患者接受输注**；同址有采样、配药、营养／康复／姑息支持，OncoSafety 已用于数字控制和记录给药。院方说扩容缩短等待，但没有给前后天数、队列或差错率，不能只因程序存在把常规质量当已证实高档；人数也不一定是年度去重人数或 FUA 居民。实际扩容和服务运转应保留，而非把宣传性的排名和“现代”措辞作为评分。

VFN 的[质量监测主管页](https://www.vfn.cz/o-nemocnici/kvalita-ve-vfn/sledovani-kvality-ve-vfn/)描述已实施内部审计和 QMS；它不是风险调整死亡、感染、再入院或常规慢病控制结果。本次没有取得能充分连接通常居民的这些结果及真实压力备援；不以未取得证明没有监测，也不将研究、认证或服务量替代治疗质量。后文 ÚHKT 的 CAR-T 给药和特定监管链用于 LON，不再奖励同一采用至 MED。[共同质量规则](cci-global-scoring-rubric.md)

## 3. 医保：广泛给付不等于新药与每项账单自动全付

[VZP 官方给付范围](https://www.vzp.cz/pojistenci/informace-a-zivotni-situace/naroky-pojistence/zdravotni-sluzby-hrazene-ze-zdravotniho-pojisteni)列基层／住院诊断治疗、康复、慢病、急救、预防等公保项目；符合住院指征的给付药物／设备通常不由患者分担，但具体药物按 48/1997 法及 SÚKL 条件，设备和部分项目有审批／给付规则。这是题设通常医保的直接制度依据，页面首次版本日期未明，不证明 Prague 实际满意度、每个 provider 合同及所有患者免自付。

[VZP 急诊费用说明](https://www.vzp.cz/pojistenci/informace-a-zivotni-situace/regulacni-poplatky-a-ochranne-limity/regulacni-poplatky)列通常门急诊值班服务 **90 CZK**，需住院时不收及特定豁免，且不计入保护上限；不是全部医疗总自付。当前版本日期未明，web 已读取但未保存有效原字节。医保费用保护支持可承担的方向，非給付、合同、旅费／陪护及具体患者条件仍未知，不随意拿统一金额或中位收入算负担率。

[VZP 2025 FOI 原回复，7 月 29 日申请条目](https://www.vzp.cz/o-nas/informace/odpovedi-na-zadosti-o-informace?rok=2025)说明医师根据病情和指南选择，保险机构按合法记录支付；并强调理赔基本诊断人数 **不是已治疗／患病人数**，既未清洗全部诊断，也不能逐人确定所有病程用药。该原回复不是新的 CAR-T 专属治疗队列。申请日不是回复／首次公开日；本笔记不将其诊断人数或行政价格用于居民药费、实际治疗数或 MED / LON 分数。

## 4. LON：真实本地 CAR-T 交付、人体／监管及安全更新

### 本地年报：给药、制造、分发和患者数必须分开

[ÚHKT 2025 有效年报](https://www.uhkt.cz/soubory2/vz-25-online.pdf) **194 页**，观察 2025；当前 PDF 生成／修改 **2026-05-15**，主管[年报入口](https://www.uhkt.cz/o-uhkt/informace/vyrocni-zpravy)确实链接它，但没有独立首次公开日期。本次以下页码 **PDF 与印刷一致**，关键页已原图核验。

- 第 **14 页** Clinical Division 明列 **21 患者接受 CAR-T**；第 **21 页** ICU / Transplant Unit 同样写 2025 **23 患者接受 CAR-T**。这是原件内部不同数量，双语均存在；没有完整病例、部门归属和去重规则，**保留矛盾，不选一数作为全院准确独立人数，不相加、不算增长／覆盖率**。[年报第 14、21 页](https://www.uhkt.cz/soubory2/vz-25-online.pdf)
- 第 **17 页**，2019 起至 2025 年末累计 **131 次 CAR-T 产品给药**；不是 131 个去重居民。第 **62 页**另有明确药物 **Kymriah 给药 1 名 ÚHKT 患者**，比“拟提供”或配送更接近实际商业药交付。[年报第 17、62 页](https://www.uhkt.cz/soubory2/vz-25-online.pdf)
- 第 **62 页**，为 Kymriah 制造采集 10 人、12 次、23 袋，释放 14 袋给 2 名 ÚHKT 和 7 名 Motol 病人；另接收商业及试验产品并分发 **44 件**（18 ÚHKT / 26 VFN）。**采集／制造释放／库存／分发不等于治疗完成或 44 名患者**，也不将 14 袋／9 名获释资料与 10 名采集者简单比较成成功率。同页 MSC 11 批为 4 患者制作只是制造，不冒称全部已给药或获益。[同页](https://www.uhkt.cz/soubory2/vz-25-online.pdf)
- 第 **21 页**显示当地 ICU / TU 实际运行 **225 住院事件**、18 人机械通气及 11 人持续透析，包含血液病、移植与 CAR-T 相关重症；第 **103 页**有细胞治疗跨部门监测与质量协调。它支持真实临床支持组织，**不是所有 CAR-T 患者曾入住 ICU、并发症率或当地全部长期安全要求已完成**。第 19 页移植生存图也不是 CAR-T 疗效，未在这里换成新疗法的本地生存率。[第 19、21、103 页](https://www.uhkt.cz/soubory2/vz-25-online.pdf)

这里的实际人群按疾病和转诊选择，没有公民、居住、收入或保险逐人分母；本地 provider 给药不自动等于 eFUA 全居民可进入。原始数量冲突不消除“确有实施”的正向证据，也不证明常规医疗质量异常已影响所有人。

### 可信人体及 EU 监管：疾病限定、非健康人延寿

[EMA Kymriah 主管入口](https://www.ema.europa.eu/en/medicines/human/EPAR/kymriah)核到 EU AIM **2018-08-23**、当前页面更新 **2026-09-01**。Summary 的 DLBCL 主要研究 **165 人**，既往至少两线且不能移植，≥3 月约 **24% 完全、34% 至少部分缓解**，12 月存活估计 40%。ALL 与 FL 是其他适应证／不同研究，不混作本地总体疗效；本地那 1 名 Kymriah 患者的具体适应证年报未给出。人体证据和监管共同支持成熟疾病路径，不证明每位患者获益、健康人延寿或恢复至无风险。

同一主管资料说明一剂本人细胞、淋巴清除、给药中心专长和急救／tocilizumab、近距离观察等；严重 CRS、细胞减少和感染风险明确。Overview PDF 入口标首次 2018-09-19、修订 2022-05-19；Product Information 标更新 2026-09-01，不能把首发日当当前所有措辞当年存在。网页有效读取；PDF 读取分别遇 429／错误，未取得其有效原字节，不给 SHA。截止历史原样尚未归档。[EMA，Overview / Product Information / Authorisation details](https://www.ema.europa.eu/en/medicines/human/EPAR/kymriah)

### 支付与真实限制：不要用旧指南否认已出现的风险

[捷克血液学会 2023-01 原指南，8 页](https://www.hematology.cz/wp-content/uploads/2023/01/20-Bunecna-terapie-CAR-T-verze-01-2023.pdf)第 **7 页 / 20.5** 明确获批适应证的住院药物全额公保，**仍需每名患者申请相应保险审医批准**，按特别合同及有效给付编码。第 5—7 页要求病情、感染和器官风险评估、住院／近中心观察，描述 CRS、ICANS、细胞减少、感染和失败后的困难；它是专业制定的支付／临床路径，不是 2026 每个病例已获批的主管交易记录。[专业原件第 5—7 页](https://www.hematology.cz/wp-content/uploads/2023/01/20-Bunecna-terapie-CAR-T-verze-01-2023.pdf)

该旧指南第 **6 页**说当时尚未观察到相关继发恶性肿瘤；**不能沿用为 2026 风险不存在**。SÚKL 所发布[2024-07-18 DHPC 原 PDF，第 1 页](https://sukl.gov.cz/wp-content/uploads/2024/07/CAR-T-pripravky-Riziko-sekundarnich-malignit-z-T-lymfocytu.pdf)已明确 T 细胞继发肿瘤和 **终身监测**。截至 2024-04 约 42,500 人全球治疗背景、38 报告和 7 个检出 CAR 构建体的样本是药物警戒资料，不能计算 Prague 发生率、因果风险或用报告比例作绝对发病概率。[SÚKL 原发布入口](https://sukl.gov.cz/farmakovigilance-cs/informacni-dopisy-zdravotnickym-pracovnikum/informacni-dopis-pro-vsechny-lecive-pripravky-obsahujici-car-t-lymfocyty/)

[VZP **2026-06-02 自己的新闻发布**](https://www.vzp.cz/o-nas/aktuality/do-ceska-vstupuje-prelomova-car-t-terapie-prvni-pacient-ji-dostane-jiz-v-cervnu-pomahat-bude-v-hematoonkologii)说明全国 CAR-T 制造／给药通常 **22—28 天**、商业跨境制造物流复杂、容量与成本是实质限制。新进入药物首位正制造、拟 6 月在 **Ostrava**给药及 2028 目标不能写成 Prague 已治疗。数字是付款方全国说明，不是当地实测等待分布；药品 99% 反应宣传也不作本地结局。VZP 的另两篇 `Z médií` 转载没有用作自己采集的病例／支付结果。

本地有实际 ICU / 随访组织与已给药，国家有获保和审慎规则；但当期通常居民净费用、获批／拒批、制造等待中退出与实际终身监测完成状况未充分核明。**条件性 60 保留这些可撤回假设**，不因一个有保险患者或一纸全付规则自动补齐居民链。下一条最有辨别力的事实是本地截止前真实给药队列，连到获批、候补／退出、支付／配套负担和适当长短期安全管理；不是继续增加医院数和研究声誉。

## 5. Alzheimer 路径：全国受控接入已推进，本地交付仍待核

[SÚKL 原发布 **2025-10-17**](https://sukl.gov.cz/nezarazene-cs/vyjadreni-statniho-ustavu-pro-kontrolu-leciv-k-moznosti-hrazeni-biologicke-lecby-alzheimerovy-choroby-dle-%C2%A7-16-zakona-o-verejnem-zdravotnim-pojisteni/)明确 Leqembi AIM **2025-04-15**、Kisunla **2025-09-24**；应先完成 CAP、医生／患者登记与教育风险材料，再考虑 §16 个案支付。批准不是支付或本地实际给药，个案申请可被考虑也不是保证获批。

[CNS 认知神经分会自己提出的 **2026-06-23** CBAN 文件](https://www.czech-neuro.cz/content/uploads/2026/07/bez-kodu_stanovisko-ns-biologicka-lecba-alzheimer_23_6_2026.pdf)第 **1—2、6—9 页**规定能力、MRI／淀粉样检测、输注监测和认证／合同流程；**22 所是初步有兴趣机构，20 人／年是认证过渡后要求，不是已给药数**。截至 **2026-06-15** 只有 donanemab CAP 注册系统已可用，lecanemab 预计随后；第 9 页明确认证不自动有医保合同。这是程序制定者的一手状态／要求，不证明截止 10 月仍未提供 lecanemab 或每个中心已实现要求。

该 PDF 生成／修改 **2026-07-27**，路径 7 月，正文批准 6 月；首次公开并未由批准日独立认证。没有取得截止前 Prague anti-amyloid 实际给药、特定医保合同／个案获批及 MRI 完成原队列，不能硬套其他城市药物分数。Motol 当前研究招募也不是已批准通常给药。此条临床路径保持局部未知；**不将它的未知／六月过渡状态作为全 LON 40，也不把未来要求加成实际 LON 80**。当前 LON 60 主要由上节已交付 CAR-T 链支持。[CBAN 官方入口](https://www.czech-neuro.cz/sekce/sekce-kognitivni-neurologie/doporucene-postupy/)、[共同规则](cci-global-scoring-rubric.md)

## 原件与日期核验

有效原件位于 `/private/tmp/cci-global/prague-clinical/`，获取日 **2026-10-12**。PDF 页数和正文实际核过；ÚHKT 第 14、21、62 页已原图核验，未解析完整全部结局。SHA-256 只认证当前有效字节，不证明首发、截止存档、全范围或结果有效。下面八项是集中采信的有效原件。

| 文件／原始链接                                                                                                                                                                                                                   |     字节 | SHA-256                                                            | 观察／发布日期资格                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------: | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `vfn-waits2026.pdf`；[VFN](https://www.vfn.cz/wp-content/uploads/2026/02/Cekaci-doby-2026-v2.pdf)                                                                                                                                |   190878 | `b65858341e56b7ccc46d8311c323ad54fa46fd10105b9260f4466a615d3ba83e` | 7 页；入口／正文最近更新及生成 2026-02-03；观察队列窗和首次公开 NULL。                        |
| `vfn-oncology2025.pdf`；[VFN](https://www.vfn.cz/wp-content/uploads/2025/09/TZ-KOC-a-nove-denni-stacionare-Onkologicke-kliniky-29-9-2025.pdf)                                                                                    |   314445 | `2082d3413d5bc577466fb85e4ec25d7c31b50b3f9e9ef1e20c9fa2092c13449f` | 3 页；原发布正文 2025-09-29，PDF 生成 09-30；当期已扩容和运行，无历史字节归档。               |
| `vzp-covered-care.html`；[VZP](https://www.vzp.cz/pojistenci/informace-a-zivotni-situace/naroky-pojistence/zdravotni-sluzby-hrazene-ze-zdravotniho-pojisteni)                                                                    |    49501 | `13ac41021acb394ebeb84c72558c960ced35b2727e11203a057ed485ead67d72` | 有效主体，国家直接给付条件；首次／版本日期 NULL，截止可用假设保留。                           |
| `uhkt2025.pdf`；[ÚHKT](https://www.uhkt.cz/soubory2/vz-25-online.pdf)                                                                                                                                                            | 33591492 | `e4f891b7e9580fd2461e1caf8e35e4c8315da4c5ad953f8b24b3feb0d8f8d6bf` | 完整 194 页；观察 2025，生成／修改 2026-05-15；入口有文件，首次公开 NULL。                    |
| `chs-cart2023.pdf`；[CHS](https://www.hematology.cz/wp-content/uploads/2023/01/20-Bunecna-terapie-CAR-T-verze-01-2023.pdf)                                                                                                       |    84287 | `8413dd7ab844c14adde16df95049858b0211bdb173aa719ffdbce5d62dbcab4f` | 8 页；版本 2023-01，生成／修改 01-29；旧风险陈述不作当前结论，首次公开 NULL。                 |
| `sukl-cart-safety2024.pdf`；[SÚKL DHPC](https://sukl.gov.cz/wp-content/uploads/2024/07/CAR-T-pripravky-Riziko-sekundarnich-malignit-z-T-lymfocytu.pdf)                                                                           |   141644 | `d607aef1950a7456bb497d02e9398c36ae844514121b20cd424c988f6d3cd6fb` | 2 页；主管入口及正文 2024-07-18，全球报告截至 04；不是当地率或全实施证明。                    |
| `sukl-adpayment2025.html`；[SÚKL](https://sukl.gov.cz/nezarazene-cs/vyjadreni-statniho-ustavu-pro-kontrolu-leciv-k-moznosti-hrazeni-biologicke-lecby-alzheimerovy-choroby-dle-%C2%A7-16-zakona-o-verejnem-zdravotnim-pojisteni/) |   120148 | `88945791a9aa4346a7ddfbfa0c8a85845e7257d7a2b95e747c1272c521a5cc05` | 正文公开 2025-10-17；监管／个案条件，非支付实绩。                                             |
| `cns-cban2026.pdf`；[CNS](https://www.czech-neuro.cz/content/uploads/2026/07/bez-kodu_stanovisko-ns-biologicka-lecba-alzheimer_23_6_2026.pdf)                                                                                    |   759657 | `37ccaf7507643bea2ea851a5190ac603db0c302299b8812541ec47d19383cb98` | 16 页；正文批准 2026-06-23／CAP 状态 06-15，生成／修改 07-27；首次公开 NULL，非截止全部状态。 |

另有有效 `vzp-foi2025.html`，[原 URL](https://www.vzp.cz/o-nas/informace/odpovedi-na-zadosti-o-informace?rok=2025)，**534338 bytes**，SHA `9518314e7ea4de3e012de4697b23570d2ff41b475b4871ccab4c3b20fd95927e`。仅审 7 月 29 日申请条目的原回复及理赔方法限制，未将整页诊断／行政价格用作临床结果；申请日不是发布日。

Motol 当前页、VFN 质量页／等待入口、VZP 急诊费用／2026-06-02 原发布、EMA 入口属于有效 web 原文读取，未保存原字节，不给它们 PDF／HTML 的有效 SHA。VFN 年报入口及 Motol HTML 下载 403、EMA PDF 429／读取失败、ÚHKT 早次超时的部分文件均不当有效原件；ÚHKT 后次完整下载的长度／页数才入表。错误、网络失败和未找到本地新疗法交付均不是患者无法获得的事实。
