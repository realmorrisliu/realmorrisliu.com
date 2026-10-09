import { cciCopy } from "./copy";

export function judgmentCopy(lang: "en" | "zh") {
  const t = cciCopy[lang];
  const zh = lang === "zh";
  return {
    ...t,
    runtime: {
      ...t.runtime,
      officialResult: zh ? "研究估计" : "Research estimate",
      confidence: zh ? "判断把握" : "Support",
      tail: zh ? "事件调节" : "Event effect",
      range: zh ? "研究区间" : "Judgment range",
    },
    controls: {
      ...t.controls,
      robust: zh ? "保守估计" : "Lower estimate",
      median: zh ? "中心估计" : "Central estimate",
      upside: zh ? "上行估计" : "Upper estimate",
    },
    compare: {
      ...t.compare,
      title: zh ? "城市指数" : "City index",
      intro: zh
        ? "在同一尺度上比较城市的结构性能力、风险与未来选择。重要事件推动判断更新，每一分都能追溯到理由。"
        : "Compare structural capacity, risks and future options on one scale. Material events update the assessment, with a rationale behind every score.",
      notice: zh
        ? "研究判断型指数 · 0–100 分，越高越好。区间表示判断与长期假设的敏感范围，不是统计置信区间；小分差不代表确定的优劣。"
        : "Research judgment · 0–100, higher is better. Ranges express judgment and horizon sensitivity, not statistical confidence intervals; small gaps are not decisive.",
      why: zh ? "如何理解分数？" : "How to read scores",
      columns: {
        ...t.compare.columns,
        confidence: zh ? "判断把握" : "Support",
        tail: zh ? "事件调节" : "Event effect",
        evidence: zh ? "依据" : "Basis",
      },
    },
    city: {
      ...t.city,
      confidence: zh ? "判断把握" : "Support",
      evidenceStatus: zh ? "依据" : "Basis",
      noEvidence: zh
        ? "本维度采用公开资料支持的研究估计；来源支持判断理由，不直接给出此分数。"
        : "This dimension is a source-informed research estimate; the sources support the rationale, not the numerical score itself.",
      audit: zh ? "原始资料与范围说明" : "Source observations and scope",
      usable_observation: zh ? "本地观察" : "Local observations",
      context_only: zh ? "背景与国家先验" : "Context and national priors",
      insufficient_evidence: zh
        ? "以结构性先验估计，保留较宽区间"
        : "Structural prior with a wider range",
    },
    method: {
      ...t.method,
      intro: zh
        ? "公开数据与事件 → 模型辅助研究判断 → 可复算分数。我们明确表达判断，也保留修正判断的路径。"
        : "Public evidence and events → model-assisted research judgment → reproducible scores. Make the assessment explicit and keep it revisable.",
      steps: [
        {
          number: "01",
          title: zh ? "研究" : "Research",
          note: zh ? "城市资料、国家背景与事件" : "Local records, national context and events",
        },
        {
          number: "02",
          title: zh ? "判断" : "Assess",
          note: zh
            ? "八维参考值，5 分档位与逐项理由"
            : "Eight anchored dimensions, five-point steps and rationales",
        },
        {
          number: "03",
          title: zh ? "调节" : "Update",
          note: zh ? "事件按城市、维度单独加减" : "Explicit event effects by city and dimension",
        },
        {
          number: "04",
          title: zh ? "展望" : "Extend",
          note: zh
            ? "长期方向假设与逐渐扩大的区间"
            : "Directional assumptions with widening ranges",
        },
        {
          number: "05",
          title: zh ? "复盘" : "Revisit",
          note: zh ? "保留快照，按新证据修订" : "Preserve snapshots and revise with new evidence",
        },
      ],
      scenariosTitle: zh ? "共同的评分锚点" : "Common scoring anchors",
      confidenceTitle: zh ? "把握程度不决定城市好坏" : "Support is separate from performance",
      weakest: zh
        ? "判断把握来自基线估计的平均半宽：≤10 分为较强，≤15 分为中等，其余为探索性。单项证据薄弱只扩大该维度区间，不取消整体分数；这是研究者的自评，不是经验校准的准确率。"
        : "Support follows the mean baseline half-width: ≤10 stronger, ≤15 moderate, otherwise exploratory. A weak dimension widens its range without vetoing the city. This is self-assessed support, not calibrated accuracy.",
      lifetime: zh
        ? "未来中心 = 参考值 + 事件调节 + 每十年方向假设 × 时间；每十年额外扩大 2 分半宽，上限 40 分。Lifetime 是中心轨迹的时间加权平均。所有范围都截断在 0–100 内。"
        : "Future center = reference + event effects + directional change per decade. Half-width grows by 2 points per decade, capped at 40. Lifetime is the time-weighted central trajectory. All estimates are clipped to 0–100.",
    },
    governance: {
      ...t.governance,
      principles: zh
        ? [
            "来源事实、研究解释与评分假设分别披露。",
            "国家先验与地方观察都可使用，明确地理适用范围。",
            "模型辅助给出初始判断；发布、质疑与复盘均留下版本记录。",
            "同一事件只计一次；弱信号小幅调节，重大变化重新审视基线。",
          ]
        : [
            "Separate source facts, interpretations and scoring assumptions.",
            "Use national priors and local records with explicit geographic scope.",
            "Model-assisted initial judgments remain versioned and open to challenge.",
            "Count each event once; small signals receive small changes and structural breaks prompt a new baseline.",
          ],
    },
  };
}
