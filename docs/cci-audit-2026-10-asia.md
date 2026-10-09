# CCI 亚洲五城证据审计 — 2026-10-09

本次已完成东京、新加坡、深圳、首尔、雅加达全部 40 个「城市 × 维度」检索与证据可采性判断。结果为 **21 项可保留原始观测、15 项仅背景、4 项证据不足**。没有生成任何 CCI 分数，也没有把“资料存在”改写成“该维度合格”。机器可读记录为 [audits-2026-10-asia.json](../src/cci/data/audits-2026-10-asia.json)。

## 判断含义与截止口径

- `usable_observation`：来源中有可明确描述时期和原单位的观测，可保留为证据；**不是**已进入规范化算法、已覆盖全部子指标或已通过正式排名门槛。
- `context_only`：机构评估、政策、计划、注册制度、综合指数、未适配的创新集群等，只用于解释或后续核验线索。
- `insufficient_evidence`：查阅现有一手材料后，仍无法核实该维度需要的当前本地数据。它是本次审计的最终证据判断，不是城市得分为零，也不是“尚未开始”。
- `accessedAt` 是 2026-10-09；`period` 分别记录观测期、发布期或页面检查期。2026 年访问不改变 2024/2025 年观测的年份。没有把 2026 年未完全年累计值当成年值。
- `boundaryReview` 只审查**本地观测辖区 → 冻结 FUA**的适配。它与产品名称—ID 的 `boundary.verificationStatus` 不同，后者即使已验证，前者仍可能未解决。

本地语言优先检索政府、统计机构、气象部门、公共事业运营者和原始注册表。检索工具返回的一手正文可以作为已检查材料；仅有标题或检索命中、下载失败的材料不提供未读数值。最终 JSON 只引一手来源。官方发布不被当作天然无偏，跨页面复述同一行政资料不增加独立证据票数。

## 完整检索与证据记录

下表列出每一项的集中检索主题（不是穷尽式检索日志）、实际检查的一手来源与最终判断。详细原值、范围及不可推导的结论见 JSON；本表不重复堆叠原值。

### tokyo

| 维度 | 集中检索主题                             | 最终判断       | 已检查的一手来源                                                                                                                                                          |
| ---- | ---------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PCS  | 気象庁 東京 2025 年平均気温              | 可保留原始观测 | [気象庁 — 東京 年ごとの値](https://www.data.jma.go.jp/stats/etrn/view/annually_s.php?prec_no=44&block_no=47662&year=2025&month=&day=&view=)                               |
| GSS  | 東京都 国民保護計画 令和7年 弾道ミサイル | 仅背景         | [東京都国民保護計画（令和7年変更）](https://www.bousai.metro.tokyo.lg.jp/taisaku/torikumi/1000061/1000365.html)                                                           |
| ISR  | 東京都 都民生活 世論調査 令和7年         | 仅背景         | [令和7年度「都民生活に関する世論調査」結果](https://www.metro.tokyo.lg.jp/information/press/2026/01/2026013001)                                                           |
| RES  | Tokyo Waterworks leakage 2025 FY2024     | 可保留原始观测 | [Tokyo Waterworks — Prevention of Leakage in Tokyo 2025](https://www.english.metro.tokyo.lg.jp/documents/d/english/knowledge_and_tech_r07rousui)                          |
| MED  | 東京都 令和6年 医療施設動態調査 病院報告 | 证据不足       | [東京都 — 令和6年 医療施設動態調査・病院報告](https://www.hokeniryo.metro.tokyo.lg.jp/kiban/chosa_tokei/iryosisetsu/reiwa06nen)                                           |
| LON  | jRCT 東京 老化 exosome clinical trial    | 证据不足       | [Japan Registry of Clinical Trials](https://jrct.mhlw.go.jp/)                                                                                                             |
| TEC  | WIPO 2025 Tokyo Yokohama cluster         | 仅背景         | [WIPO GII 2025 — Tokyo–Yokohama cluster profile](https://www.wipo.int/documents/d/global-innovation-index/docs-en-2025-jp-tokyo-yokohama-2.pdf)                           |
| OPT  | Narita airport 2025 annual passengers    | 可保留原始观测 | [Narita International Airport — calendar-year operating statistics](https://www.narita-airport.jp/files/c843886ae837019a5d8d546c9559b91710af7bc8fed0a97b356a5234a52e4cc8) |

辖区适配：行政区、站点、水务服务区、机场和东京—横滨集群观测尚未与冻结 eFUA 5129 做空间适配；产品名称匹配不等于来源辖区适配。

### singapore

| 维度 | 集中检索主题                                        | 最终判断       | 已检查的一手来源                                                                                                                                                                                                                                                    |
| ---- | --------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PCS  | MSS Singapore 2025 annual climate Changi            | 可保留原始观测 | [Meteorological Service Singapore — The Year in Numbers 2025](https://www.weather.gov.sg/wp-content/uploads/2026/01/The-Year-in-Numbers-2025.pdf)                                                                                                                   |
| GSS  | MHA Singapore terrorism threat assessment 2025 2026 | 仅背景         | [MHA — Threat risk level due to the conflict in the Middle East](https://www.mha.gov.sg/media-room/newsroom/threat-risk-level-due-to-the-conflict-in-the-middle-east-and-how-singaporeans-can-safeguard-against-the-threats/)                                       |
| ISR  | IPS 2024 race religion survey 2025 prejudice        | 可保留原始观测 | [IPS Working Paper 64 — Prejudices, Attitudes and Critical Perspectives on Race in Singapore](https://lkyspp.nus.edu.sg/docs/default-source/ips/ips-working-papers-no-64_prejudices-attitudes-and-critical-perspectives-on-race-in-singapore.pdf?sfvrsn=4c64060a_1) |
| RES  | SFA Singapore Food Statistics 2025                  | 可保留原始观测 | [SFA — Singapore Food Statistics 2025](https://www.sfa.gov.sg/docs/default-source/publication/sg-food-statistics/sgfs-2025-publication_060526-fa.pdf)                                                                                                               |
| MED  | MOH Singapore hospital beds 2025                    | 可保留原始观测 | [MOH — Beds in inpatient facilities and places in non-residential long-term care facilities](https://www.moh.gov.sg/others/resources-and-statistics/beds-in-inpatient-facilities-and-places-in-non-residential-long-term-care-facilities/)                          |
| LON  | HSA clinical trials register longevity Singapore    | 仅背景         | [HSA — Clinical Trials Register](https://www.hsa.gov.sg/other-regulations/clinical-trials/clinical-trials-register/)                                                                                                                                                |
| TEC  | IMDA Singapore Digital Economy 2026 2025            | 仅背景         | [IMDA — Singapore Digital Economy Report 2025](https://www.imda.gov.sg/-/media/imda/files/about/resources/corporate-publications/annual-report/imda-sgde-report-fy2024-2025.pdf)                                                                                    |
| OPT  | ICA permanent residence re-entry permit conditions  | 仅背景         | [ICA — Permanent Residence](https://www.ica.gov.sg/reside/pr)                                                                                                                                                                                                       |

辖区适配：城市国家统计具有较好的本地适配潜力，但国家疆域、樟宜站点和部门服务对象尚未与冻结 eFUA 154 相交核验，不能认定等价。

### shenzhen

| 维度 | 集中检索主题                       | 最终判断       | 已检查的一手来源                                                                                                                                                              |
| ---- | ---------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PCS  | 深圳 2025 年 气候公报              | 可保留原始观测 | [深圳市气象局 — 2025年深圳市气候公报](https://weather.sz.gov.cn/qixiangfuwu/qihoufuwu/qihouguanceyupinggu/nianduqihougongbao/content/post_12633879.html)                      |
| GSS  | 深圳 防空警报 2025 应急避难场所    | 仅背景         | [深圳市应急避难场所管理办法政策解读](https://www.sz.gov.cn/zfgb/zcjd/content/post_11958850.html)；[深圳市应急管理局 — 应急避难场所](https://yjgl.sz.gov.cn/yjgl/yjgl/yjbncs/) |
| ISR  | 深圳 2025 政府信息公开年度报告     | 可保留原始观测 | [深圳市人民政府 — 政府信息公开年度报告](https://www.sz.gov.cn/cn/xxgk/ndxxgkbg/content/post_12675915.html)                                                                    |
| RES  | 深圳 2025 统计公报 公共供水        | 可保留原始观测 | [深圳市2025年国民经济和社会发展统计公报](https://www.sz.gov.cn/cn/xxgk/zfxxgj/tjsj/tjgb/content/post_12805133.html)                                                           |
| MED  | 深圳 2025 医院 床位 统计公报       | 可保留原始观测 | [深圳市2025年国民经济和社会发展统计公报](https://www.sz.gov.cn/cn/xxgk/zfxxgj/tjsj/tjgb/content/post_12805133.html)                                                           |
| LON  | 深圳 国际化 临床试验 示范机构 2025 | 仅背景         | [深圳市国际化临床试验示范机构建设方案](https://www.sz.gov.cn/cn/xxgk/zfxxgj/tzgg/content/post_12473369.html)                                                                  |
| TEC  | 深圳 2025 PCT 专利申请             | 可保留原始观测 | [深圳市2025年国民经济和社会发展统计公报](https://www.sz.gov.cn/cn/xxgk/zfxxgj/tjsj/tjgb/content/post_12805133.html)                                                           |
| OPT  | 深圳 2025 机场 旅客吞吐量          | 可保留原始观测 | [深圳市交通运输局 — 2025年交通运输主要指标](https://jtys.sz.gov.cn/zwgk/sjfb/yssj/hyl_179723/content/post_12673405.html)                                                      |

辖区适配：深圳本地观测不能自动视为 eFUA 9725 的观测：该记录来源名称为 Guangzhou，城市中心跨珠三角。深圳／广州别名与深汕覆盖仍需来源辖区到 FUA 的空间适配。

### seoul

| 维度 | 集中检索主题                             | 最终判断       | 已检查的一手来源                                                                                                                                                                                          |
| ---- | ---------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PCS  | 서울 2025 연평균 기온                    | 可保留原始观测 | [서울 열린데이터광장 — 서울 100대 통계](https://data.seoul.go.kr/dataVisual/seoul/seoul100List.do)                                                                                                        |
| GSS  | 서울 민방위 대피시설 비상급수            | 仅背景         | [서울안전누리 — 재난안전시설 지도](https://safecity.seoul.go.kr/distFclt/cfMapDs/cfMapDs.page?menuId=MENU_SSNS_000176)                                                                                    |
| ISR  | 2025 서울서베이 결과                     | 仅背景         | [2025 서울서베이 실시 안내](https://data.seoul.go.kr/together/notice/boardView.do?seq=b4c2f6cfb41cfbb844c76953388f1c3a)；[서울서베이 자료](https://data.seoul.go.kr/dataList/OA-15564/F/1/datasetView.do) |
| RES  | 서울 아리수 2025 수돗물 품질보고서       | 可保留原始观测 | [서울아리수본부 — 수돗물 품질보고서](https://arisu.seoul.go.kr/home/sub?menukey=8302)                                                                                                                     |
| MED  | 서울 2025 의료기관 통계                  | 可保留原始观测 | [서울 열린데이터광장 — 서울 100대 통계](https://data.seoul.go.kr/dataVisual/seoul/seoul100List.do)                                                                                                        |
| LON  | CRIS 서울 노화 임상연구                  | 仅背景         | [질병관리청 — 임상연구정보서비스 CRIS](https://cris.nih.go.kr/cris/index/index.do)                                                                                                                        |
| TEC  | 서울 공공와이파이 2025 2026              | 可保留原始观测 | [서울시, 공공와이파이 확충에서 품질 중심으로](https://www.seoul.go.kr/news/news_report.do?nttNo=455932&srchCtgry=474)                                                                                     |
| OPT  | 서울 지하철 2025 수송 인천공항 2026 통계 | 可保留原始观测 | [서울 열린데이터광장 — 서울 100대 통계](https://data.seoul.go.kr/dataVisual/seoul/seoul100List.do)                                                                                                        |

辖区适配：首尔行政统计和 Arisu 服务证据尚未与包含五个城市中心 ID 的 eFUA 94 适配；名称一致不能证明市域分子覆盖完整功能区。

### jakarta

| 维度 | 集中检索主题                                                            | 最终判断       | 已检查的一手来源                                                                                                                                                                                                                                                                                                                                         |
| ---- | ----------------------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PCS  | BNPB Jakarta banjir Juli 2025                                           | 可保留原始观测 | [BNPB — Terpantau 50 Titik Genangan di Jakarta, Ratusan Jiwa Mengungsi](https://bnpb.go.id/berita/terpantau-50-titik-genangan-di-jakarta-ratusan-jiwa-mengungsi)                                                                                                                                                                                         |
| GSS  | BNPT Jakarta ancaman terorisme 2025                                     | 仅背景         | [BNPT — Ancaman Terorisme Belum Usai Meski JI Telah Bubar](https://www.bnpt.go.id/ancaman-terorisme-belum-usai-meski-ji-telah-bubar-bnpt-fokus-lakukan-balanced-approach)                                                                                                                                                                                |
| ISR  | BPS DKI Jakarta indeks demokrasi 2025                                   | 仅背景         | [BPS — Indeks Demokrasi Indonesia Menurut Provinsi (Metode Baru)](https://www.bps.go.id/id/statistics-table/2/MjE1OSMy/-metode-baru-indeks-demokrasi-indonesia-menurut-provinsi.html)；[Komisi Informasi DKI Jakarta — IDI DKI Capai 82,94](https://kip.jakarta.go.id/idi-dki-capai-8294-ki-dki-dorong-transparansi-kip-jadi-mesin-penggerak-demokrasi/) |
| RES  | PAM Jaya cakupan layanan 2025 80,24                                     | 可保留原始观测 | [Pemprov DKI — PAM Jaya JEKATE Running Series and water-service coverage](https://www.jakarta.go.id/index.php/siaran-pers/6235-SP-HMS-12-2025)                                                                                                                                                                                                           |
| MED  | Dinkes Jakarta 2025 rumah sakit tempat tidur                            | 证据不足       | [Dinas Kesehatan Provinsi DKI Jakarta](https://dinkes.jakarta.go.id/)                                                                                                                                                                                                                                                                                    |
| LON  | INA CRR Jakarta clinical research center longevity                      | 仅背景         | [Kementerian Kesehatan — INA-CRR studies](https://ina-crr.kemkes.go.id/en/studi)；[INA-CRC — Clinical Research Center launch](https://ina-crc.kemkes.go.id/id/artikel/1)                                                                                                                                                                                 |
| TEC  | BPS DKI Jakarta indikator kesejahteraan rakyat 2025 teknologi informasi | 证据不足       | [BPS DKI Jakarta — Indikator Kesejahteraan Rakyat 2025](https://jakarta.bps.go.id/id/publication/2025/12/30/75b5f2691e03874bca316472/indikator-kesejahteraan-rakyat-provinsi-dki-jakarta-2025.html)                                                                                                                                                      |
| OPT  | MRT Jakarta November 2025 penumpang                                     | 可保留原始观测 | [MRT Jakarta — November 2025 ridership](https://www.jakartamrt.co.id/id/info-terkini/lima-stasiun-dengan-jumlah-pelanggan-tertinggi-sepanjang-november-2025)                                                                                                                                                                                             |

辖区适配：DKI 省、PAM Jaya 与 MRT 观测尚未与 eFUA 4897 空间适配。后续[原始几何核查](./cci-boundary-audit-2026-10.md)确认五条 Jakarta 同名记录为互不重叠的分段；本版明确只保留 4897（5,292 km²），这并不认证地方数据的地理适配。

## 失败、冲突与排除记录

1. **东京 MED**：2024 年调查首页可读，关联 PDF 返回 403；不借其他年份补齐，也不从搜索标题猜测床位数。
2. **东京 LON**：检索识别 jRCT1033250410 的东京关联外泌体研究，但 [详情页](https://jrct.mhlw.go.jp/latest-detail/jRCT1033250410)直接打开返回 403；未确认阶段、入组状态、结果及可及性，不能纳入长寿能力原值。
3. **东京 RES**：漏水报告正文与图示维修件数存在不一致，本次只保留核实的配水和漏水字段，排除维修数量。
4. **新加坡 TEC**：发现 [2026 发布页](https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/singapore-digital-economy-2026)及 [2026 报告](https://www.imda.gov.sg/assets/8e4d9951-bc53-4612-80ba-77ee4feaa6da.pdf)，均遇浏览器验证。新闻转述中的新版数字没有回到可读原件，因此不采纳，保留明确标注的旧观测年份。
5. **深圳 GSS**：集中检索「深圳市人民政府关于防空警报试鸣的通告 2025」没有取得可核验的一手正文；不以转载公告替代。已核实应急场所制度与清单，但它们不能转换成战争风险或民防完备率。
6. **首尔 RES**：Arisu 页面正文与注记检测项目总数不一致，排除项目总数，只保留其限定点位合格的表述；不把图书馆采样外推到所有家庭。
7. **首尔 ISR**：2025 调查归档已发布，但没有提取有权重与问题定义的结果，不把样本数量当作制度表现。
8. **雅加达 MED**：卫生门户与统计出版物搜索找到服务入口，未获得可以核验定义、分母、当前年份的城市医疗容量与结局序列；不从服务广告生成绩效。
9. **雅加达 TEC**：[2025 福利报告](https://jakarta.bps.go.id/id/publication/2025/12/30/75b5f2691e03874bca316472/indikator-kesejahteraan-rakyat-provinsi-dki-jakarta-2025.html)元数据确认包含信息技术，但点击官方文件下载失败；不把旧搜索片段当作 2025 网络普及率。
10. **雅加达 RES**：PAM Jaya 首页存在无明确观测期的旧覆盖率，媒体转述又给出不同年末值；不拼接。保留省政府有日期的一手时点值，并明确区分当时实际与年底目标。

## 偏差与适配的最终裁决

[GHSL 的 GHS-FUA R2019A 方法页](https://human-settlement.emergency.copernicus.eu/ghs_fua.php)说明该产品是 2015 年功能城市区模型，利用通行时间、城市中心面积、周边人口及国家 GDP 等估计通勤腹地，不能视为行政区边界。此次五城均没有完成本地统计分子、分母和服务区与冻结 FUA 的空间交叉归属，故 `boundaryReview` 全部为 `unresolved`。这项结论不否定已有产品 ID，只拒绝自动把其他地理单元的数据平移给它。

- **PCS**：站点温度、行政区平均温度和一次洪灾事件都是真实但不同的观测机制；不能直接比较成共同风险分数。缺少人口加权暴露、湿热定义、洪水重现期及未来尾部估计。
- **GSS**：五城找到的国家威胁判断、地方应急计划、地图或设施清单主要是背景。没有可比的城市冲突概率、完整事件与损失序列。没有新闻不等于零事件。
- **ISR**：居民自述、信息公开案件数、官方复合民主指数和调查设计不能当作同一变量。没有把同一调查的不同论文、统计局转引部门数据或国家转载地方事件重复算为独立来源。
- **RES/MED**：供水能力不等于持续供水，水质抽样不等于全覆盖，床位/机构存量不等于有人员配置的床位、质量或公平可及。各城分母与服务范围尚不一致。
- **LON**：五城均没有核实足以支持居民长寿治疗可及性的完整证据链。注册表覆盖、研究中心、试验建设计划与创新公司聚集都不能替代去重试验记录、阶段、结果、监管批准、费用与患者资格。
- **TEC/OPT**：专利、数字经济、Wi-Fi 流量和交通吞吐可描述各自系统；它们不直接代表普遍技术可及、独立退出路径或法律可携性。

因此本批适合发布为**完成的证据审计与明确缺口**，不适合宣称五城八维正式分数已获证据支持。正式评分仍须把原字段接入统一指标注册表，补齐规定覆盖率、独立替代检查、辖区适配、结果/可及性指标与未来情景变换；不能靠“审核完成”绕过这些门槛。
