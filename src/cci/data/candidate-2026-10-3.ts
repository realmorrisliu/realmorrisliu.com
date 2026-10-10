import previous from "./candidate-2026-10-2";
import { makeCity } from "./candidate-2026-08";
import boundaries from "./boundary-audit-2026-10-expansion.json";
import asiaJudgments from "./judgments-2026-10-expansion-asia.json";
import europeJudgments from "./judgments-2026-10-expansion-europe.json";
import otherJudgments from "./judgments-2026-10-expansion-other.json";
import asiaAudits from "./audits-2026-10-expansion-asia.json";
import europeAudits from "./audits-2026-10-expansion-europe.json";
import otherAudits from "./audits-2026-10-expansion-other.json";
import {
  DIMENSIONS,
  type CandidateReleaseInput,
  type CityCandidate,
  type CityEvidenceAudit,
} from "../model";
import type { DimensionJudgment, ResearchModel } from "../judgment";

const asOf = "2026-10-10";
const judgments = [...asiaJudgments, ...europeJudgments, ...otherJudgments] as Array<{
  slug: string;
  dimensions: DimensionJudgment[];
}>;
const audits = [...asiaAudits, ...europeAudits, ...otherAudits] as Array<
  { slug: string } & Omit<CityEvidenceAudit, "asOf">
>;

const additions = [
  ["shanghai", "Shanghai", "上海", "China", "中国", ["zh"]],
  ["hangzhou", "Hangzhou", "杭州", "China", "中国", ["zh"]],
  ["beijing", "Beijing", "北京", "China", "中国", ["zh"]],
  ["hong-kong", "Hong Kong", "香港", "Hong Kong SAR, China", "中国香港", ["zh", "en"]],
  ["taipei", "Taipei urban region", "台北都会区", "Taiwan", "台湾", ["zh"]],
  ["mumbai", "Mumbai", "孟买", "India", "印度", ["mr", "hi", "en"]],
  ["bengaluru", "Bengaluru", "班加罗尔", "India", "印度", ["kn", "en"]],
  ["paris", "Paris", "巴黎", "France", "法国", ["fr"]],
  ["berlin", "Berlin", "柏林", "Germany", "德国", ["de"]],
  ["stockholm", "Stockholm", "斯德哥尔摩", "Sweden", "瑞典", ["sv"]],
  ["new-york", "New York", "纽约", "United States", "美国", ["en"]],
  ["mexico-city", "Mexico City", "墨西哥城", "Mexico", "墨西哥", ["es"]],
  ["santiago", "Santiago", "圣地亚哥", "Chile", "智利", ["es"]],
  ["nairobi", "Nairobi", "内罗毕", "Kenya", "肯尼亚", ["sw", "en"]],
  ["cairo", "Cairo", "开罗", "Egypt", "埃及", ["ar"]],
  ["sydney", "Sydney", "悉尼", "Australia", "澳大利亚", ["en"]],
] as const;

const expectedSlugs = additions
  .map(([slug]) => slug)
  .sort()
  .join(",");
for (const records of [judgments, audits, boundaries.cities]) {
  if (
    records
      .map(record => record.slug)
      .sort()
      .join(",") !== expectedSlugs
  ) {
    throw new Error("Each new city requires exactly one judgment, audit and boundary record");
  }
}

const cities: CityCandidate[] = additions.map(
  ([slug, name, nameZh, country, countryZh, localEvidenceLanguages]) => {
    const boundary = boundaries.cities.find(record => record.slug === slug);
    const audit = audits.find(record => record.slug === slug);
    const judgment = judgments.find(record => record.slug === slug);
    if (!boundary || !audit || !judgment) throw new Error(`Missing expansion record: ${slug}`);
    return {
      ...makeCity({
        slug,
        name,
        nameZh,
        country,
        countryZh,
        localEvidenceLanguages: [...localEvidenceLanguages],
        boundary: {
          eFuaIds: [boundary.eFuaId],
          sourceNames: [boundary.sourceName],
          urbanCentreIds: boundary.urbanCentreIds,
          verificationStatus: "verified",
          note: `Exact ID, source name and country matched in the frozen GHS-FUA R2019A archive. Scope is the 2015 modelled eFUA ${boundary.eFuaId} (${boundary.sourceName}), not the administrative city or a wider innovation cluster. Local observations still require a spatial crosswalk.`,
          noteZh: `已核对冻结 GHS-FUA R2019A 原始产品的精确 ID、源名称及国家／地区。范围是 2015 年模型化 eFUA ${boundary.eFuaId}（${boundary.sourceName}），不等于行政市或更大的创新集群；本地观测仍待空间适配。`,
        },
      }),
      evidencePacks: Object.fromEntries(
        DIMENSIONS.map(dimension => [dimension.id, true])
      ) as CityCandidate["evidencePacks"],
      audit: { asOf, dimensions: audit.dimensions, boundaryReview: audit.boundaryReview },
      judgments: judgment.dimensions,
    };
  }
);

const researchModel: ResearchModel = {
  ...previous.researchModel,
  baselineAsOf: asOf,
  events: previous.researchModel.events.map(event =>
    event.id === "europe-heat-2026-08"
      ? {
          ...event,
          sourceUrls: [
            ...event.sourceUrls,
            "https://climate.copernicus.eu/surface-air-temperature-august-2026",
          ],
          impacts: [
            ...event.impacts,
            {
              city: "paris",
              dimension: "PCS",
              delta: -2,
              reason: {
                en: "Extend the existing regional heat reassessment to Paris: Copernicus identifies pronounced French summer heat. The two-point adjustment follows the existing western-European judgment, not a measured Paris loss; it is excluded from the structural reference. The evidence does not justify automatically applying the same adjustment to Berlin or Stockholm.",
                zh: "将已有区域高温修正扩展至巴黎：Copernicus 明确指出法国夏季显著偏暖。−2 分沿用既有西欧研究判断，不是巴黎损失实测；结构参考值未重复计入。本材料不足以将相同幅度自动套用于柏林或斯德哥尔摩。",
              },
            },
          ],
        }
      : event
  ),
};

export default {
  ...previous,
  releaseId: "CCI-2026.10.3",
  dataVersion: "2026.10.3",
  asOf,
  researchModel,
  cities: [...previous.cities, ...cities],
  research: {
    ...previous.research,
    reportUrl:
      "https://github.com/realmorrisliu/realmorrisliu.com/blob/main/docs/cci-release-2026-10-3.md",
    sampleSelectionUrl:
      "https://github.com/realmorrisliu/realmorrisliu.com/blob/main/docs/cci-sample-32.md",
    summary: {
      en: "Coverage expands from 16 to 32 urban regions, with eight source-informed judgments per city. This is a purposive global research sample, not the world's top 32 or a statistically representative sample. Scores remain revisable research estimates; city, national and regional evidence retain their geographic limits.",
      zh: "研究范围由 16 个扩展为 32 个城市／地区，每城具备八维依据与研究判断。这是全球目的性研究样本，不是全球前 32 名，也不具有统计抽样代表性。分数仍是可修订的研究估计，城市、国家及区域证据保留各自的适用范围。",
    },
  },
} satisfies CandidateReleaseInput;
