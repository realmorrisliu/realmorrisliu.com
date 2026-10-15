# 第21批关键原件恢复核验

2026-10-15。仅恢复蒙特利尔、福冈待发表案例已有有效原 URL；证据截止仍为2026-10-10。本轮不是新增城市评分，不将两个未提交案例计入已发表61案。

**27个已记录原 URL 单次请求全部取得有效原件：26件字节数及SHA与旧记录一致，1件HTML字节不同，0件失败。** 原件、响应头、全文提取、实际目视页图及清单保存在持久目录 `/Users/morris/.local/share/cci-research/2026-10-10/recovery-batch21/`。没有把临时目录作为唯一归档。

## 恢复范围与差异

| 范围                   | 已恢复文件                                                                                         | 比较结果                |
| ---------------------- | -------------------------------------------------------------------------------------------------- | ----------------------- |
| 蒙特利尔主要PDF        | Qmentum2026、患者委员会2025/26、SIM2025                                                            | 3件完全一致             |
| 蒙特利尔临床及公保HTML | IHOT CAR-T、患者服务、转诊；Québec临床路径；HMR费用及健康卡                                        | 6件完全一致             |
| 蒙特利尔供水HTML       | 2025水质入口、Plateau维修解除、铅健康建议                                                          | 前2件一致；健康建议不同 |
| 福冈主要PDF            | 2024医院guide、R6 DX实绩、2026水务危机、DPC2026集计条件、2025采集摘要、HAS2023 Kymriah、R6给付实绩 | 7件完全一致             |
| 福冈临床及公保HTML     | DPC实绩、细胞科、住院收费、初诊、当地高额规则、通常公保                                            | 6件完全一致             |
| 福冈资源及产用HTML     | 双月水费、创业累计实绩                                                                             | 2件完全一致             |

共享HAS原件归在福冈归档，但也可与蒙特利尔案例同URL、同旧SHA的成熟性引用核对；不把复制数量当作独立证据。

唯一差异是 `montreal/lead-health2025.html`：旧55747字节、SHA `f7586757e56f964cdc1057f7c074f2c7ca1ab939b60e2c59f251015f378279b7`；现55747字节、SHA `24c93ba2d7a93fbb5b1a0fa2c65d0ade4bc6c71a4d7c5a04310fc63e2338cd01`。旧文件已不在，不能定位逐字节差异或断言仅为动态字段。当前正文的法定0.005mg/L、取样方法、4—8周配送、每住宅一套及后续滤芯自购与根审一致；行动通知0.002mg/L另由完全一致的水质入口正文复核。保留“different”，不覆写旧哈希或称旧版本已恢复。

逐件原URL、expectedBytes/expectedSha256、现responseBytes/responseSha256、HTTP、请求退出码、持久文件路径、match/different/missing在 `source-manifest.json`；当前取得时间不认证截止日历史版本。

## 关键事实重读

[患者委员会原PDF](https://muhc.ca/sites/default/files/docs/annual-reports/patients_committee/RA-CU-final-29.05.2026-Anglais.pdf)实际重看物理19/25页：私营手术分流已有改善、人手导致手术室未充分运用、肿瘤手术和MRI等待的具体余障仍在；25页76+43+20+20+17+30合206而印刷总189，30/7%也不相符，原冲突保留。文本另核20页Opal预算撤回及检验接续，没有拿投诉件数替代发生率。

[Qmentum原PDF](https://muhc.ca/sites/default/files/accreditation-canada/AC_seq2_sante-physique_22052026.pdf)实际重看20/65页：29/8/4和35/2/1是评审条件；选定儿科与Cedars实际专科护理、监护及两门诊等待低于政府目标仍是正证，不能推成所有肿瘤服务均超限。[SIM原PDF](https://simsite-public-prd.s3.montreal.ca/s3fs-public/2026-06/rapport-des-activites-2025.pdf?VersionId=0EGMPuzeG-9osBQPLdgmPvBxs0eEEE2)实际重看39页：14启动、241干预阶段日、195恢复阶段日，不改为436个独立历日。

[IHOT当前治疗页](https://ihot.ciusss-estmtl.gouv.qc.ca/fr/traitements/immunotherapie-car-t)、患者/转诊、主管及费用正文重读：2019起成人治疗、当前成人及儿童提供者、有效RAMQ多数必要医疗覆盖，不能扩为所有产品免费；36无菌房仍为干细胞移植服务。未补造具体产品公费、急性监护、照护住宿净负担的直接证明，原有限推定和撤回风险保留。

[福冈医院guide](https://www.hosp.kyushu-u.ac.jp/uploads/ck/files/info/kohoshi/20240718_100936.pdf)实际重看31页/印刷30：截至2022-04保险诊疗血液恶性病CAR-T支援与试验、GMP设施分开。[DPC实绩正文](https://www.hosp.kyushu-u.ac.jp/data/dpc/r08/template_R08.html)重读真实难治非霍奇金淋巴瘤按病型采用CAR-T、将新药试验另列；4,938/5,001分母已用预防药，70/332,773为住院日对应。DPC主管条件PDF实际重看2/17页，退院窗2025-06-01至2026-05-31、相关入院窗及排除项分别保留，不认证医院实际提取分支。

[2026水危机原图](https://www.city.fukuoka.lg.jp/mizu/somu/shisei/documents/2026p19p20.pdf)实际重看物理1：23结构R2完成、256连接至R6完成、90是R7起计划；6车、重力注水、年度训练和已装监控不等全住宅压力测试。[DX原报告](https://www.city.fukuoka.lg.jp/soki/dxsenryaku/shisei/documents/r6jisshijokyo.pdf)实际重看9页：55%是已线上化手续总处理中的使用，63%满意与80%登记分母另列。给付表文本保留R6表中的R7-06-14日期差异，不改为2026新付款。

[HAS原PDF](https://www.has-sante.fr/upload/docs/evamed/CT-20262_KYMRIAH_LDGCB_PIC_REEV_AvisDef_CT20262.pdf)实际重看14/38页：99分析治疗、167纳入、115回输、52未给药及短期毒性、至少4周近中心监护均保留；[本地采集摘要](https://yuketsu.jstmct.or.jp/wp-content/uploads/2025/06/bc70a6c0fc29392aeb356fd725cfe28f.pdf)重看238页/印刷355，248为采集，18名小儿ALL/19次采集不改为回输或成人结局；同页顺天堂76例不归福冈。法国人体证据不移作日本或加拿大付款。

[福冈高额规则](https://www.city.fukuoka.lg.jp/hofuku/hokennenkin/hp/kokuminkenkouhoken/09-00.html)、收费、初诊、公保及现细胞科正文复读，与旧根审一致：资格/同意、年龄所得档、付款/返款、未保食宿、预约和无介绍信¥7,700条件保留；不把一档限额变为全龄全部支出上限或把未来年度返款当已收到。

**本轮未发现与两份既有根审关键事实冲突。** 这只支持上述恢复原件继续可审计；不提升分数、取消未知、填补最弱推定或证明入围。实际重新目视共13个PDF物理页，未宣称所有PDF全页目视。

## 归档、验证与未恢复边界

每个目标仅请求一次；每批最多3个原URL，curl连接15秒/总55秒上限，没有重试、搜索新来源、猜镜像或访问既失败URL。PDF均HTTP200且以`%PDF-`开头，全部成功提取正文；未以HTTP200 HTML错误体充原PDF。27件文件重新计算bytes/SHA与本轮清单吻合。

恢复清单 `source-manifest.json` 与核验记录 `recovery-review-checks.json` 同存上述持久目录。 清单SHA为 `6344a92f9dd14b7b9a838371e793a95d33fe83233d6b4172cdb7138ccc01eeac`，核验记录SHA为 `14b7fc70f92ca2d4508ecf7794031bba908e953c0788b67b0d811759af4ddfc1`。原始65条来源记录、旧失败响应、全部背景/导航、几何及其余61城原件并未由本任务全部恢复；本轮只恢复27个关键有效URL。旧私目录消失带来的整体归档缺口仍需另行处理。

没有修改cases/UI/scripts/其它稿，没有新增评分、提交或部署。未恢复完整边界档案及全部原始证据；当前HTML与PDF原件的取得仍不证明2026-10-10历史版本完整存档。
