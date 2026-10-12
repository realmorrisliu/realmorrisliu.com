# 雅加达 RES／MED：到户水质、实际治疗与通常保险复核

审阅 **2026-10-12**，证据截止 **2026-10-10**；对象为冻结 **eFUA 4897** 的印尼公民、通常长期居民、当地中位收入及通常保险。沿用[共同八维档位](cci-global-scoring-rubric.md)与[上海](cci-shanghai-resources-medicine-review.md)、[北京](cci-beijing-resources-medicine-review.md)、[纽约](cci-new-york-resource-review.md)、[大阪医疗](cci-osaka-kyoto-med-reassessment.md)的可撤回判断层级。**研究建议为 RES 条件性 40、MED 条件性 60；不是已接入的分数，必要假设不成立即相应维未知。** 综合整合见[雅加达主案例](cci-local-2026-jakarta-case.md)；本笔记保存原件、反证和全部必要条件，不授予入围或排除资格。

## 范围与时点

父任务以原始 9,031 候选几何核对近似参考点：Jakarta、Tangerang、Bekasi、Depok、Bogor、Cikarang、RSCM、Fatmawati 等相交 4897；Bandung 相交 5107。结果存 `/private/tmp/cci-global/jakarta/reference-points.json`。13 点不是精确历史治疗点、医院整块边界或覆盖率。本功能区跨 DKI、Banten 与 West Java，约 5,292 平方公里、2015 模型人口约 2,975 万；不能把 DKI 行政人口、供水用户或患者分母直接当全 FUA。

2025 卫健报告的官方索引仍沿用旧页面日期，当前 PDF 元数据修改日为 2026-07-31；这支持版本时点线索，**不能证明首公开日或截止日前相同字节**。PAM JAYA 原 API 的 2025 年报记录为 2026-07-24 创建、2026-10-01 更新，当前 PDF 由其 `dokumeninformasi` 的 `data:application/pdf;base64` 严格解码，未用第三方转载冒充原件。记录的 `jenismedia` 却残留“2015”，与文件题名／正文观察 2025 不同，保留元数据错误。接受当前官方历史声明及有限延续推定是研究条件；拒绝则撤回依赖资料的判断。

## RES：真实水质约束与已经运行的缓解

[PAM JAYA 2025 年报官方入口](https://ppid.pamjaya.co.id/pdfviewer/106)及[下载 API](https://ppid.pamjaya.co.id/api/informasipublik/106)，印刷页 12（PDF 第 16 页，已目视）报实际分布水 **712,192,486 m³**、售水 **391,800,884 m³**、接户 **1,178,022**、服务覆盖 **80.24%**、非收益水 NRW **44.99%**。NRW 包含不同损失／计量因素，不直接称全部物理漏水；接户不等于去重人口。表中“水压”35.49%没有在本轮核清合格定义及分母，不当 64.51% 住户完全无水。较早[2025-12-03 官方运营者发布](https://www.jakarta.go.id/siaran-pers/6221-SP-HMS-12-2025)称当时覆盖超过 78%，与年终 80.24% 观察点不同，不机械认定矛盾。增加供水及 2029 全覆盖仍有未来任务。

更直接的反证是[DKI 卫健 2025 原报告](https://drive.google.com/file/d/1UKA6e-G8ZEmAB1elpPCycfhxrDZUqPzH/view)：印刷页 186 及附表 83（PDF 第 205／321 页；附表已目视）记录 SKAMRT 检查 **978 户**，其中 **495 户、50.61%** 的饮用水符合 **E.Coli 与另外四项化学参数**。五个内陆行政市各有样本，南部为 **58／216＝26.85%**，东部 **116／186＝62.37%**；这是抽查合格率，不能写全功能区半数居民喝致病水、实际发病率或水厂出水不合格率。北部129户还低于报告注释的市级至少150户要求，不将五个行政市均有样本写成五个均已满足代表性。采样框、收入／公民交叉、源水与家庭储存贡献未充分给出；主管提出储存、处理和容器行为等替代解释。千岛县表中 0／0 却显示 0.00%，注释称样本不满足代表性要求，**不解释为零户有安全饮水**。相比设施端合格，原报告明确到户质量仍须改善；宣传或扩大管网不等于这批问题已经消失。

运营者年报也保存具体缓解：**2025-03-26 已启用** Tambora 与 Gandaria Utara 社区蓄水设施，面向距离生产设施较远地区的低水压；“将供应超过 2,300 接户”仍是覆盖陈述，未有本轮逐户后测。**2025-01 起已运行** Kartu Air Sehat，面向 2A1／2A2 特定低收入住宅分类，包含价格帮助、优先服务及故障补偿，不需另行注册。年报明确该期为一年，不能默认 2026 仍同条件有效，也不能把面向困难群体的 Rp1,000/m³ 起价改成通常中位居民实际全部账单。库存、储存设施、维护与扩管均有正向作用，仍缺到户问题得到充分处理的对应结果。

[2025-02-19 政府原市场检查](https://www.jakarta.go.id/siaran-pers/5316-SP-HMS-02-2025)记录 Pasar Santa 实际供应及部分肉、蛋、辣椒、米价上涨；主管称 Food Station／Bulog 库存可满足 3.5／6.5 月，未给同口径库存、完整营养及居民分母，不相加为十个月保障。地方运营商、跨区协作与仓储是实际供应链，不能由行政库存声明证明跨区道路、能源与洪灾共同失效都有独立备用。[2025 补贴计划原规则](https://www.jakarta.go.id/index.php/page/program-pangan-bersubsidi-tahun-2025)写 01-22 启动、身份验证、每月一次套餐、不结转、指定网点非现金支付；中位收入不自动合资格，宣布全年发放不证明每人已收到或所有必需食物可负担。[2025-08-01 政府原通报](https://www.jakarta.go.id/siaran-pers/5775-SP-HMS-08-2025)确认 Food Station 三名管理者因涉嫌不符米质标准被列嫌疑人、董事辞任且政府称分销继续；保留质量／问责问题，但不是定罪、临床食物伤害或全市供应中断。

能源方面，[DPR 原监督记录](https://emedia.dpr.go.id/news/2026/06/22/ateng-sutisna-tagih-solusi-jangka-panjang-usai-pln-putuskan-pemadaman-listrik-bergilir-di-jawa)发表于 2026-06-22，引用 06-20 原声明及 06-15 会议，确认 Jamali 互联系统多地轮流停电及 PLN 对煤炭供应、两个 IPP 机组技术问题的解释；修复合同与配送已在推进，不等于已经完全恢复。这是服务本区的共同上游通道上下文，不是所有 4897 家庭停电时数。2025 PLN 统计 PDF 在 web 工具可见 Jakarta Raya SAIDI／SAIFI，但本轮未取得有效原 PDF，故不将检索摘要数字写为已复核城市实测。电价、每户实际食物／能源必要支出和通常中位居民负担仍须独立推定。

**RES 40 的必要推定**：多行政市到户饮水不合格是重要基本资源约束，具有有限目标居民／FUA 代表性并延续到截止；已见扩管、蓄水、价格帮助和合法替代虽有效，尚未充分解除通常居民安全饮水及共同通道约束。不要求多数居民实际患病才审 40，也不由低接管率、供水公司不盈利或资料缺失自动扣分。**60 情景**须支持这些质量与负担约束通常可由有效、可承担替代缓解；**80 情景**须进一步支持安全基本供给、可承担性与共同冲击下实际替代。拒绝重要性、当前延续、空间／画像或替代不足推定即 null；20 缺基本资源严重持续普遍不可得证据。

## MED：实际 JKN 治疗、过程短板与连续资格

[RSPON 2024 原年报](https://rspon.go.id/pdf/PELAPORAN/LAPORANTAHUNAN/LAPORANTAHUNANRSPON2024.pdf)签署 **2025-01-30**，观察 2024：第四季度超急性卒中非增强 CT≤30 分钟 **270／287＝94.08%**；发病<4.5h且有溶栓适应证者 r-TPA **76／76**。已目视 PDF 第 49—50 页，分母是院内适用队列，非所有卒中、全区及时到院或治疗成功。门诊 BPJS **122,914／155,184** 是实际付款路径下就诊次数，非唯一公民或全居民覆盖。

同报告也明确 **NEWSS 早期预警识别未充分运行、重症／终末转诊病例多、急诊≤4h 79.48% 未达院方80%目标**，设中间护理空间已经减少 ICU 候床，但部分急诊路径仍>4h。SISRUTE 登录错误与维护有实际衔接影响，人员已定期检查／刷新及协调；正文 **98.88%** 与表 **98.90%** 不同，不静默合并。NDR 在目标表为 **3.99%**、目标≤2.66%，另一表／正文却报 **39.77** 并同时使用 `%`／`Permil`，GDR 亦有单位矛盾；已目视 PDF 第66页，**不能把39.77写成确定39.77%死亡率**，不擅自换算解释所有差异。病例混合不是抹除预警失效，整改计划和调整目标申请也不证明临床效果已恢复。

[基层 Kemayoran 2025 原年报](https://puskesmaskemayoran.jakarta.go.id/assets/files/LAPTAH2025.pdf)有真实常规就诊和疾病治疗路径，记录高血压门诊 **17,085** 次及 TBC／ARV 服务；次数不等于去重控制患者。SPM多项超过100%，疑似TB项为1567.05%，不作为超过100%居民获得合格治疗；服务目标／算法与病例混合不同。基层和国家专科都实际运行，足以区别于只列医院容量／排名，但少数提供者不是全区风险调整质量。

[2026 六月 DKI Jamkesjak 原仪表板](https://sijaka.jakarta.go.id/dasbor)分开注册 UHC **99.91%**、注册人数 **10,871,643** 与活跃 **95.07%**。原 JS 活跃五分组数量合计 **10,344,600**，与显示的活跃人数一致；除以注册人数得到 **95.15%**，不能称复算出显示的95.07%。后者若沿用行政人口分母可能与99.91%注册覆盖相容，但本轮未确认原总体率算法，不静默修正或把两种分母混用。这不是所有目标公民均实际就诊。报告2025注册覆盖99.85%与本表观察点／行政人口版本不同，不拼成全FUA。地方支付 PBI／PBPU BP Pemda 的援助有实际注册支持，普通本国居民长期居住不自动符合每一地方资助类别。

[BPJS 原管理指引](https://bpjs-kesehatan.go.id/user-manual-mobile-jkn/administrasi%20JKN.html)要求合法 NIK／KK、有效注册与状态验证；账户建成不是参保已激活。[原服务指引](https://bpjs-kesehatan.go.id/user-manual-mobile-jkn/pelayanan%20jkn.html)的排队需要活跃身份、已接入 FKTP 及有效排班，显示电子排队／随访入口但不是实际零等待。[原缴费／REHAB 指引](https://bpjs-kesehatan.go.id/user-manual-mobile-jkn/iuran%20kepesertaan.html)规定 PBPU／BP 欠4—24月可申请分期，当前月缴费仍生成，分期注册本身不证明所有待遇已恢复。未从有效原件核清2026各险种当前精确保费与通常病例净负担；不使用失效PDF检索摘要、旧价或医院总账单来填净自付。

**MED 60 必要推定**：目标公民合法持续活跃的通常 JKN、合格提供者及服务条件成立，实际基层与必要专科服务对4897有有限代表性并延续，通常质量／可承担及时替代成立；已经记录的预警、等待和衔接缺陷没有构成当前重要未缓解必要治疗瓶颈。此项不是称全部整改已完成。**40 情景**是这些具体质量／等待／激活／支付约束在当前仍重要、可承担及时替代不足，无需多数患者受损；**80 情景**须更广质量、转诊、负担及压力下有效备援组合。若不接受当前通常质量、活跃资格、净负担或范围推定，则 null，和大阪一样不为凑八维强填60。

## 全部八子支柱状态

| 子支柱       | 状态    | 直接支持与仍需解决的问题                                                                  |
| ------------ | ------- | ----------------------------------------------------------------------------------------- |
| RES 水       | partial | 原供水年报、五行政市到户采样及现有蓄水／补贴；当前替代充分性、净负担和全FUA代表性须推定。 |
| RES 食物     | partial | 原市场检查、库存声明及实际计划启动；套餐资格／到手与通常营养需求负担不足。                |
| RES 能源     | context | 服务本区的 Jamali 共同上游轮流停电及修复；本区实际受影响分母、原年度平均及当前尾部未核。  |
| RES 供应链   | partial | 水分销、市场／仓储与跨区协作运行；外部能源／道路共同失效的有效替代未证明。                |
| MED 可及性   | partial | 活跃JKN分母、原入口条件、实际BPJS专科就诊；法定注册／活跃不同、通常净负担须假设。         |
| MED 常规质量 | partial | 原卒中适用队列过程与基层服务；预警失效、死亡率单位冲突和全区结果仍有限。                  |
| MED 专科能力 | partial | CT及溶栓实际交付、专科就诊；及时到院与其他必要专科代表性须推定。                          |
| MED 连续性   | partial | 实际ICU候床缓解、衔接检查／协调及REHAB入口；急诊延误、系统错误与待遇恢复效果未知。        |

## 来源存档与失败记录

根目录为 `/private/tmp/cci-global/jakarta/resources-medicine/`，以下均检索2026-10-12；文件名与根拼接为绝对路径。`source-manifest.json` 留存请求／最终URL、状态及字节散列，状态200不自动是有效正文。三份关键PDF及水质附表、供水原运营表和临床原表已文本解析并渲染目视；衍生PNG/TXT不冒充原PDF。

| 原件文件                  | 第一方／观察窗与原URL                                                                                                                                                                      |       字节 | SHA-256                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------: | ------------------------------------------------------------------ |
| `pam2025.pdf`             | PAM原2025年报，解码下载API；记录创建2026-07-24／更新10-01；[原件](https://ppid.pamjaya.co.id/api/informasipublik/106)                                                                      | 12,814,236 | `3a2f0dc405b1c1dde2050d3db44aae6cf6c45c655593e5b8ed4b13c98bc8120c` |
| `pam2025-download.json`   | PAM实际公开下载响应，含完整PDF；[原件](https://ppid.pamjaya.co.id/api/informasipublik/106)                                                                                                 | 18,953,843 | `b02fba15e81622c8c2bc8153cd58f30ed6bd6f0c13ec12c7f51a6fc2a68bc626` |
| `pam2025-detail.json`     | PAM原目录历史声明；[原件](https://ppid.pamjaya.co.id/api/informasipublik/slug/laporan-tahunan-pam-jaya-2025)                                                                               |  1,867,743 | `146a78b2d11fc5a7e2e70de24e8d386ff589276ee411d454b0dedd29111ce702` |
| `pam-viewer.js`           | 官方前端实际使用的下载API调用；[原件](https://ppid.pamjaya.co.id/_next/static/chunks/app/pdfviewer/%5Bid%5D/page-4e0da47ee83588fc.js)                                                      |      1,277 | `b86fe09eb4895c3c1208f2e004398dbb61612f687023c7acf7c98f26066fe955` |
| `pam-dec2025.html`        | 政府原运营者2025-12-03发布；[原件](https://www.jakarta.go.id/siaran-pers/6221-SP-HMS-12-2025)                                                                                              |    275,840 | `c98b7653dd2d8066377de459e5cc9a36e1e55635f7945401400d2eda3537f3ad` |
| `health-index.html`       | DKI卫健官方索引，链接身份确认，旧页面日期非新报告首公开；[原件](https://dinkes.jakarta.go.id/profil-kesehatan)                                                                             |     79,025 | `39383e660ca8c6f6d5f162fc1496d92a738e7a5735173216a1832afbb1307647` |
| `health2025.pdf`          | DKI卫健2025观察，修改2026-07-31，首公开未核；[原件](https://drive.google.com/uc?export=download&id=1UKA6e-G8ZEmAB1elpPCycfhxrDZUqPzH)                                                      | 11,164,088 | `705b3e0e06c45f320b38079c11271337b86103c7fc940ec925c86936e52c18a7` |
| `food-stocks.html`        | 政府原2025-02-19检查；[原件](https://www.jakarta.go.id/siaran-pers/5316-SP-HMS-02-2025)                                                                                                    |    274,550 | `40c0d073426f6a1ce8977bbb43c2c30562303238e253c0bd5d3e271d9d0d45d0` |
| `food-subsidy.html`       | 主管2025-01-23公布，01-22启动声明；[原件](https://www.jakarta.go.id/index.php/page/program-pangan-bersubsidi-tahun-2025)                                                                   |    279,700 | `06bc2d5e4553fe039b3d0513425e3282b0297e6c35a623ccf029e97d4c550c5f` |
| `food-quality.html`       | 政府2025-08-01原问责通报；[原件](https://www.jakarta.go.id/siaran-pers/5775-SP-HMS-08-2025)                                                                                                |    270,913 | `11f933ef98d11abf56d87f89ed3dc0bf0f8960705f714dad6671345b13641cef` |
| `power-dpr-june2026.html` | DPR2026-06-22原监督，06-20声明／06-15会议；[原件](https://emedia.dpr.go.id/news/2026/06/22/ateng-sutisna-tagih-solusi-jangka-panjang-usai-pln-putuskan-pemadaman-listrik-bergilir-di-jawa) |    356,683 | `f652b88b4262543eea669238e4e73897bfcd235ade366144a0db7af84c18b8d6` |
| `rspon2024.pdf`           | RSPON2025-01-30签署，2024观察；[原件](https://rspon.go.id/pdf/PELAPORAN/LAPORANTAHUNAN/LAPORANTAHUNANRSPON2024.pdf)                                                                        |  3,263,795 | `2923511f0858aa0f2fd606f5f65972abd3a31164171d296fc739809e67c0751a` |
| `kemayoran-index.html`    | 基层官方报告入口；[原件](https://puskesmaskemayoran.jakarta.go.id/informasi/laporan.html)                                                                                                  |      6,702 | `813758993b05d136b3eec37ceb8d8807cce211486ac730fafb87f53920f397e7` |
| `kemayoran2025.pdf`       | 基层2025服务，首公开未核；[原件](https://puskesmaskemayoran.jakarta.go.id/assets/files/LAPTAH2025.pdf)                                                                                     |  1,178,211 | `dbed18d6c06da2e22dcf9f2034885396633d8bafffc3ed74d733ccf13f081ca2` |
| `sijaka.html`             | DKI Jamkesjak六月2026注册／活跃资料，首公开未核；[原件](https://sijaka.jakarta.go.id/dasbor)                                                                                               |     72,586 | `f1292b15779387683ad99eb83325226c458e5cb4e9f2009a60ecfc9f6c4685b9` |
| `bpjs-mobile.html`        | BPJS当前原注册／管理指引，未标首公开；[原件](https://bpjs-kesehatan.go.id/user-manual-mobile-jkn/administrasi%20JKN.html)                                                                  |     29,193 | `bb43f9d70ee6f697e175670fc1700644dd4f38fb24b00aa92a3f85c54a01e3ec` |
| `bpjs-service.html`       | BPJS当前原服务入口，未标首公开；[原件](https://bpjs-kesehatan.go.id/user-manual-mobile-jkn/pelayanan%20jkn.html)                                                                           |     14,398 | `814a2f71d040eefe778615fdd6aa357f791e40987df27068dc62aed93637addd` |
| `bpjs-contributions.html` | BPJS当前原缴费／REHAB操作，未标首公开；[原件](https://bpjs-kesehatan.go.id/user-manual-mobile-jkn/iuran%20kepesertaan.html)                                                                |     19,731 | `26ec9592406e766b731f8b1080488efc4a2b9dd9e17213e84a6eb1987c1605d1` |

PLN原域TLS失败，替代www返回HTML而非PDF；BPJS旧PDF403／替代地址与错误缴费地址返回站点HTML；Bogor新闻原接口500，首页本身没有检索到的新闻正文；Ombudsman原站请求关闭，DPR七月原件403。上述均不列有效原件。Bogor运营者九月到户浑水、七月PLN恢复声明与Ombudsman拒诊虽在web工具原站正文可见，当前未完成本地原件／时点核对，保留下一轮线索，不用它们扩张当前评分依据；失败不是城市透明度差。另已保存2024卫健原PDF及2026基层体验扫描件作为待核对材料，尚未把未读扫描件当质量证据。

未核验截止日前历史字节、精确2026保费／通常患者净账单、目标画像交叉抽样、跨三个省区的全FUA质量／费用与关键整改后的效果；没有向运营者、医院或患者发消息。当前建议仍可撤回，不证明任何候选排除或全球入围。
