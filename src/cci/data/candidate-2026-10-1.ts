import previous from "./candidate-2026-10";
import asia from "./audits-2026-10-asia.json";
import europe from "./audits-2026-10-europe.json";
import other from "./audits-2026-10-other.json";
import { DIMENSIONS, type CandidateReleaseInput, type CityEvidenceAudit } from "../model";

const audits = [...asia, ...europe, ...other] as Array<
  { slug: string } & Omit<CityEvidenceAudit, "asOf">
>;
if (
  new Set(audits.map(audit => audit.slug)).size !== previous.cities.length ||
  audits.length !== previous.cities.length
) {
  throw new Error("The October evidence review must contain one audit for each pilot city");
}

export default {
  ...previous,
  releaseId: "CCI-2026.10.1",
  status: "published",
  dataVersion: "2026.10.1",
  cities: previous.cities.map(city => {
    const audit = audits.find(item => item.slug === city.slug);
    if (!audit) throw new Error(`Missing October audit for ${city.slug}`);
    return {
      ...city,
      // A completed source search is not a qualified scoring input.
      evidencePacks: Object.fromEntries(
        DIMENSIONS.map(dimension => [dimension.id, true])
      ) as typeof city.evidencePacks,
      audit: {
        asOf: "2026-10-09",
        dimensions: audit.dimensions,
        boundaryReview: audit.boundaryReview,
      },
      boundary:
        city.slug === "basel"
          ? {
              ...city.boundary,
              verificationStatus: "verified" as const,
              note: "Frozen union of Swiss eFUA 935 and German eFUA 2227, both referencing UC 2392. Original 1 km geometries have zero overlapping cells and union area 820 km². This scope excludes any claim to the full trinational metro; administrative evidence still requires a crosswalk.",
              noteZh:
                "冻结范围为瑞士 eFUA 935 与德国 eFUA 2227 的并集，均引用 UC 2392。原始 1 km 几何无重叠单元，并集 820 km²。该范围不声称覆盖完整三国都会区；行政统计仍须独立空间适配。",
            }
          : city.slug === "jakarta"
            ? {
                ...city.boundary,
                verificationStatus: "verified" as const,
                note: "Explicitly limited to eFUA 4897 (5,292 km²). The five Jakarta-named records have zero overlapping 1 km cells; they are distinct segments, not duplicated geometries. The other four segments and the administrative province are not silently merged.",
                noteZh:
                  "范围明确限于 eFUA 4897（5,292 km²）。五条 Jakarta 同名记录的 1 km 单元互不重叠，属于不同分段而非重复几何；不静默合并其他四段，也不等同于行政省。",
              }
            : city.boundary,
    };
  }),
  research: {
    ...previous.research,
    reportUrl:
      "https://github.com/realmorrisliu/realmorrisliu.com/blob/main/docs/cci-release-2026-10.md",
    summary: {
      en: "Published evidence review, 9 October 2026: all 16 cities and 128 dimension reviews now have findings and primary-source records. Publication does not certify a city ranking. Local observations, context and insufficient evidence are distinguished; no city yet meets the full scoring and future-scenario requirements.",
      zh: "2026 年 10 月 9 日正式证据审查版：已完成 16 城、128 项维度核查，公开结论与一手来源。正式发布不等于城市排名已获认证。本地观测、背景与证据不足分别标明；目前仍无城市满足完整评分和未来情景要求。",
    },
  },
} satisfies CandidateReleaseInput;
