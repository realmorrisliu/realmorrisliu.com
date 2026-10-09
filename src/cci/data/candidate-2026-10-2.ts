import previous from "./candidate-2026-10-1";
import asia from "./judgments-2026-10-asia.json";
import europe from "./judgments-2026-10-europe.json";
import other from "./judgments-2026-10-other.json";
import type { CandidateReleaseInput } from "../model";
import type { DimensionJudgment, ResearchModel } from "../judgment";

const judgments = [...asia, ...europe, ...other] as Array<{
  slug: string;
  dimensions: DimensionJudgment[];
}>;
const methodologyUrl =
  "https://github.com/realmorrisliu/realmorrisliu.com/blob/main/docs/cci-research-model-v2.md";
const climateSource = previous.research.findings.find(
  item => item.title === "Copernicus Climate Change Service"
)?.url;
const medicalSource = previous.research.findings.find(item => item.title.includes("ER-100"))?.url;
if (!climateSource || !medicalSource) throw new Error("Required event sources missing");
const researchModel: ResearchModel = {
  kind: "research_judgment",
  baselineAsOf: "2026-10-09",
  methodologyUrl,
  events: [
    {
      id: "europe-heat-2026-08",
      date: "2026-09-16",
      title: {
        en: "Record European summer heat and low river flows",
        zh: "欧洲夏季高温与低河流流量",
      },
      sourceUrls: [climateSource],
      impacts: ["basel", "zurich", "london", "amsterdam"].map(city => ({
        city,
        dimension: "PCS",
        delta: -2,
        reason: {
          en: "A small negative reassessment of regional heat exposure. The two-point size is our judgment, not a measured city impact; adaptation capacity remains in the structural reference.",
          zh: "对区域热暴露作小幅负向修正。−2 分是研究判断，不是城市损失实测；适应能力仍在结构参考值中表达。",
        },
      })),
    },
    {
      id: "er100-phase1-2026-10",
      date: "2026-10-08",
      title: { en: "ER-100 early human trial update", zh: "ER-100 早期人体试验进展" },
      sourceUrls: [medicalSource],
      impacts: [
        {
          city: "boston",
          dimension: "LON",
          delta: 1,
          reason: {
            en: "A modest signal of the Boston sponsor ecosystem's translational activity. Three participants and short follow-up do not establish lifespan benefit, trial-site coverage or resident access; MED is unchanged.",
            zh: "对波士顿申办方生态的临床转化活动作 +1 分微调。三人短期观察不证明延寿、试验地点覆盖或居民可及性；医疗维度不因此加分。",
          },
        },
      ],
    },
  ],
};
if (
  judgments.length !== previous.cities.length ||
  new Set(judgments.map(city => city.slug)).size !== previous.cities.length
)
  throw new Error("One judgment record per city required");
export default {
  ...previous,
  releaseId: "CCI-2026.10.2",
  modelVersion: "2.0.0",
  dataVersion: "2026.10.2",
  researchModel,
  cities: previous.cities.map(city => {
    const judgment = judgments.find(item => item.slug === city.slug);
    if (!judgment) throw new Error(`Missing judgment: ${city.slug}`);
    return { ...city, judgments: judgment.dimensions };
  }),
  research: {
    ...previous.research,
    reportUrl: methodologyUrl,
    summary: {
      en: "A living research index: 16 cities, eight source-informed dimensions, explicit event adjustments and revisable future assumptions. Scores are model-assisted judgments, not measurements or certified forecasts. Open a dimension to inspect its reference, uncertainty, rationale and sources.",
      zh: "持续演进的研究指数：16 座城市、八维判断、明确的事件调节与可修订的未来假设。分数是模型辅助研究估计，不是实测或认证预测。展开维度可查看结构参考值、判断区间、理由与来源。",
    },
  },
} satisfies CandidateReleaseInput;
