import { judgmentSupport, eventAdjustment } from "@/cci/judgment";
import {
  DIMENSIONS,
  type DimensionId,
  type PublishedCciRelease,
  type ResultMode,
  type TargetYear,
} from "@/cci/model";

type City = PublishedCciRelease["cities"][number];
type SortKey = "city" | "result" | "confidence" | "tail";

interface UiData {
  currentLang: "en" | "zh";
  selectedYear: TargetYear;
  selectedMode: ResultMode;
  controls: Record<ResultMode, string>;
  dimensions: Record<DimensionId, { name: string; weight: number }>;
  reasons: Record<string, string>;
  labels: Record<string, string>;
  runtime: { loading: string; ready: string; loadError: string };
}

const root = document.querySelector<HTMLElement>("#cci-app");
const dataNode = document.querySelector<HTMLElement>("#cci-ui-data");

if (root && dataNode && root.dataset.releaseUrl) {
  const ui = JSON.parse(dataNode.textContent || "{}") as UiData;
  const status = document.querySelector<HTMLElement>("#cci-runtime-status");
  root.dataset.state = "loading";
  root.setAttribute("aria-busy", "true");

  fetch(root.dataset.releaseUrl, { headers: { Accept: "application/json" } })
    .then(response => {
      if (!response.ok) throw new Error(`CCI release request failed: ${response.status}`);
      return response.json() as Promise<PublishedCciRelease>;
    })
    .then(release => initialize(root, release, ui, status))
    .catch(error => {
      console.error(error);
      root.dataset.state = "error";
      root.removeAttribute("aria-busy");
      if (status) {
        status.textContent = ui.runtime.loadError;
        status.classList.add("cci-runtime-error");
      }
    });
}

function initialize(
  app: HTMLElement,
  release: PublishedCciRelease,
  ui: UiData,
  status: HTMLElement | null
) {
  const params = new URLSearchParams(window.location.search);
  const cityBySlug = new Map(release.cities.map(city => [city.slug, city]));
  const targetYears = new Set(release.targetYears);
  const resultModes = new Set<ResultMode>(["robust", "median", "upside", "lifetime"]);
  const requestedYear = Number(params.get("year"));
  const requestedMode = params.get("metric") as ResultMode | null;
  const firstCity = release.cities[0];
  if (!firstCity) throw new Error("CCI release has no cities");
  let year = targetYears.has(requestedYear as TargetYear)
    ? (requestedYear as TargetYear)
    : ui.selectedYear;
  let mode = requestedMode && resultModes.has(requestedMode) ? requestedMode : ui.selectedMode;
  const initialSlug = app.dataset.selectedCity;
  let selectedSlug = initialSlug && cityBySlug.has(initialSlug) ? initialSlug : firstCity.slug;
  let compared = (params.get("cities") || "")
    .split(",")
    .filter(slug => cityBySlug.has(slug))
    .slice(0, 3);
  let comparisonOpen = compared.length > 0;
  let sortKey: SortKey = "result";
  let sortDirection: "asc" | "desc" = "desc";
  let weights = readWeights(params.get("weights"), release.officialWeights);

  const rows = new Map<string, HTMLElement>();
  app.querySelectorAll<HTMLElement>("[data-city-slug]").forEach(row => {
    const slug = row.dataset.citySlug;
    if (slug) rows.set(slug, row);
  });

  const score = (city: City) => {
    const distribution =
      mode === "lifetime" ? city.results[year].lifetime : city.results[year].point;
    return mode === "lifetime" ? distribution.median : distribution[mode];
  };
  const dimensionScore = (city: City, dimension: DimensionId) => {
    const result = city.results[year].dimensions[dimension];
    return mode === "lifetime" ? result.lifetime.median : result.point[mode];
  };
  const range = (city: City) => {
    const distribution =
      mode === "lifetime" ? city.results[year].lifetime : city.results[year].point;
    return distribution.robust === null || distribution.upside === null
      ? "—"
      : `${formatScore(distribution.robust)}–${formatScore(distribution.upside)}`;
  };
  const name = (city: City) => (ui.currentLang === "zh" ? city.nameZh : city.name);
  const support = (city: City) =>
    city.judgments ? judgmentSupport(city.judgments, ui.currentLang) : city.confidence.overall;
  const researchModel = release.researchModel;
  const eventEffect = (city: City) =>
    researchModel
      ? DIMENSIONS.reduce(
          (sum, d) => sum + (eventAdjustment(city.slug, d.id, researchModel) * d.weight) / 100,
          0
        ).toFixed(1)
      : tailLabel(city.tailStatus);
  const tailLabel = (value: City["tailStatus"]) => (value ? ui.labels[value] : "—");

  const syncUrl = () => {
    params.set("release", release.releaseId);
    params.set("year", String(year));
    params.set("metric", mode);
    setOrDelete(params, "cities", compared.join(","));
    setOrDelete(
      params,
      "weights",
      weightsMatch(weights, release.officialWeights)
        ? ""
        : DIMENSIONS.map(dimension => weights[dimension.id]).join(",")
    );
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
    );

    const languageLink = app.querySelector<HTMLElement>("[data-language-switch]");
    const languageHref = languageLink?.getAttribute("href");
    if (languageLink && languageHref) {
      const target = new URL(languageHref, window.location.origin);
      target.search = query;
      target.hash = window.location.hash;
      languageLink.setAttribute("href", `${target.pathname}${target.search}${target.hash}`);
    }
  };

  const renderControls = () => {
    app.querySelectorAll<HTMLButtonElement>("[data-year]").forEach(button => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.year) === year));
    });
    app.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
    });
    app.querySelectorAll<HTMLElement>("[data-current-year]").forEach(node => {
      node.textContent = String(year);
    });
    app.querySelectorAll<HTMLElement>("[data-current-mode]").forEach(node => {
      node.textContent = ui.controls[mode];
    });
  };

  const compareRank = (left: City, right: City) => {
    if (sortKey === "city") return name(left).localeCompare(name(right), ui.currentLang);
    if (sortKey === "result") return compareNullable(score(left), score(right));
    if (sortKey === "confidence") {
      if (left.judgments && right.judgments)
        return (
          right.judgments.reduce((sum, d) => sum + d.uncertainty, 0) -
          left.judgments.reduce((sum, d) => sum + d.uncertainty, 0)
        );
      const grades = { A: 4, B: 3, C: 2, D: 1 };
      return grades[left.confidence.overall] - grades[right.confidence.overall];
    }
    if (release.researchModel) return Number(eventEffect(left)) - Number(eventEffect(right));
    const tails = { pass: 3, watch: 2, fail: 1 };
    return (
      (left.tailStatus ? tails[left.tailStatus] : 0) -
      (right.tailStatus ? tails[right.tailStatus] : 0)
    );
  };

  const renderTable = () => {
    const body = mustQuery(app, "[data-city-rows]");
    const ordered = [...release.cities].sort((left, right) => {
      const comparison = compareRank(left, right);
      const orderedComparison = sortDirection === "asc" ? comparison : -comparison;
      return orderedComparison || name(left).localeCompare(name(right), ui.currentLang);
    });

    for (const city of ordered) {
      const row = rows.get(city.slug);
      if (!row) throw new Error(`Missing CCI table row for ${city.slug}`);
      row.setAttribute("aria-selected", String(city.slug === selectedSlug));
      mustQuery(row, "[data-cell-result]").textContent = formatScore(score(city));
      mustQuery(row, "[data-cell-range]").textContent = range(city);
      mustQuery(row, "[data-cell-confidence]").textContent = support(city);
      mustQuery(row, "[data-cell-tail]").textContent = eventEffect(city);
      mustQuery(row, "[data-cell-evidence]").textContent = city.judgments
        ? `${city.judgments.length}/8`
        : city.rankingEligible
          ? `${city.observedCoverage.toFixed(1)}%`
          : city.audit
            ? ui.labels.reviewed
            : ui.labels.inAudit;
      const checkbox = mustQuery<HTMLInputElement>(row, "[data-compare-city]");
      checkbox.checked = compared.includes(city.slug);
      checkbox.disabled = compared.length >= 3 && !checkbox.checked;
      body.append(row);
    }

    app.querySelectorAll<HTMLButtonElement>("[data-sort]").forEach(button => {
      const header = button.closest("th");
      if (!header) return;
      if (button.dataset.sort === sortKey) {
        header.setAttribute("aria-sort", sortDirection === "asc" ? "ascending" : "descending");
      } else {
        header.removeAttribute("aria-sort");
      }
    });
    mustQuery(app, "[data-compare-count]").textContent = String(compared.length);
  };

  const renderCity = () => {
    const city = cityBySlug.get(selectedSlug);
    if (!city) throw new Error(`Unknown CCI city: ${selectedSlug}`);
    mustQuery(app, "[data-city-name]").textContent = `${name(city)} FUA`;
    mustQuery(app, ".cci-tabs").setAttribute("aria-label", name(city));
    mustQuery(app, "[data-boundary-status]").textContent =
      city.boundary.verificationStatus === "verified"
        ? ui.labels.boundaryVerified
        : ui.labels.boundaryPending;
    mustQuery(app, "[data-ranking-status]").textContent = city.rankingEligible
      ? formatScore(score(city))
      : ui.labels.notRanked;
    mustQuery(app, "[data-city-coverage]").textContent = city.judgments
      ? "8/8"
      : `${city.observedCoverage}%`;
    mustQuery(app, "[data-overall-confidence]").textContent = support(city);
    mustQuery(app, "[data-overall-tail]").textContent = eventEffect(city);
    mustQuery(app, "[data-boundary-fua-ids]").textContent = city.boundary.eFuaIds.join(", ");
    mustQuery(app, "[data-boundary-uc-ids]").textContent = city.boundary.urbanCentreIds.join(", ");
    mustQuery(app, "[data-boundary-source-names]").textContent =
      city.boundary.sourceNames.join(", ");
    mustQuery(app, "[data-evidence-languages]").textContent =
      city.localEvidenceLanguages.join(", ");
    mustQuery(app, "[data-boundary-note]").textContent =
      ui.currentLang === "zh" ? city.boundary.noteZh : city.boundary.note;
    mustQuery(app, "[data-observation-boundary]").hidden = !city.audit;
    mustQuery(app, "[data-observation-boundary-note]").textContent =
      city.audit?.boundaryReview[ui.currentLang] ?? "";
    mustQuery(app, "[data-observation-boundary-sources]").replaceChildren(
      ...(city.audit?.boundaryReview.sources.map(source => {
        const item = element("li", "");
        item.append(
          element("a", source.title, {
            href: source.url,
            target: "_blank",
            rel: "noopener noreferrer",
          })
        );
        return item;
      }) ?? [])
    );

    const reasonList = mustQuery(app, "[data-eligibility-reasons]");
    reasonList.replaceChildren(
      ...city.notRankedReasons.map(reason => element("li", ui.reasons[reason] || reason))
    );
    app.querySelectorAll<HTMLElement>("[data-dimension]").forEach(row => {
      const dimension = row.dataset.dimension as DimensionId;
      mustQuery(row, "[data-dimension-result]").textContent = formatScore(
        dimensionScore(city, dimension)
      );
      const judgment = city.judgments?.find(item => item.id === dimension);
      mustQuery(row, "[data-dimension-confidence]").textContent = judgment
        ? judgmentSupport([judgment], ui.currentLang)
        : support(city);
      mustQuery(row, "[data-judgment]").hidden = !judgment;
      mustQuery(row, "[data-judgment-rationale]").textContent =
        judgment?.rationale[ui.currentLang] ?? "";
      mustQuery(row, "[data-judgment-values]").textContent = judgment
        ? `${ui.labels.judgmentValues}: ${judgment.baseline} / ${researchModel ? eventAdjustment(city.slug, dimension, researchModel) : 0} / ±${judgment.uncertainty} / ${judgment.trendPerDecade}`
        : "";
      mustQuery(row, "[data-judgment-sources]").replaceChildren(
        ...(judgment?.sourceUrls.map((url, index) => {
          const item = element("li", "");
          item.append(
            element("a", `${ui.labels.judgmentSource} ${index + 1}`, {
              href: url,
              target: "_blank",
              rel: "noopener noreferrer",
            })
          );
          return item;
        }) ?? [])
      );
      const coverage = city.evidenceCoverage[dimension];
      mustQuery(row, "[data-dimension-evidence]").textContent = judgment
        ? String(judgment.sourceUrls.length)
        : `${coverage.observedSubpillars}/${coverage.totalSubpillars}`;
      const audit = city.audit?.dimensions.find(item => item.id === dimension);
      mustQuery(row, "[data-dimension-audit]").hidden = !audit;
      mustQuery(row, "[data-audit-outcome]").textContent = audit ? ui.labels[audit.outcome] : "";
      mustQuery(row, "[data-audit-summary]").textContent = audit?.summary[ui.currentLang] ?? "";
      mustQuery(row, "[data-audit-sources]").replaceChildren(
        ...(audit?.sources.map(source => {
          const item = element("li", "");
          item.append(
            element("a", source.title, {
              href: source.url,
              target: "_blank",
              rel: "noopener noreferrer",
            })
          );
          item.append(document.createTextNode(` · ${source.period}`));
          return item;
        }) ?? [])
      );
    });
    app.querySelectorAll<HTMLElement>("[data-tail-test]").forEach(row => {
      const test = row.dataset.tailTest;
      const value = test ? (city.tailTests[test as keyof typeof city.tailTests] ?? null) : null;
      mustQuery(row, "[data-tail-status]").textContent = value ? ui.labels[value] : "—";
      mustQuery(row, "[data-tail-note]").textContent = value
        ? ui.labels[value]
        : city.audit
          ? ui.labels.insufficient
          : ui.labels.unassessed;
    });
  };

  const renderComparison = () => {
    const section = mustQuery(app, "[data-comparison]");
    const empty = mustQuery(app, "[data-comparison-empty]");
    const table = mustQuery(app, "[data-comparison-table]");
    section.hidden = !comparisonOpen;
    if (!comparisonOpen) return;

    const cities = compared.flatMap(slug => {
      const city = cityBySlug.get(slug);
      return city ? [city] : [];
    });
    empty.hidden = cities.length > 0;
    table.hidden = cities.length === 0;
    if (cities.length === 0) return;

    const head = mustQuery(app, "[data-comparison-head]");
    head.replaceChildren(element("th", ui.labels.metric, { scope: "col" }));
    cities.forEach(city => head.append(element("th", name(city), { scope: "col" })));
    const body = mustQuery(app, "[data-comparison-body]");
    body.replaceChildren();
    appendComparisonRow(
      body,
      ui.labels.officialResult,
      cities.map(city => formatScore(score(city)))
    );
    appendComparisonRow(body, ui.labels.range, cities.map(range));
    appendComparisonRow(body, ui.labels.confidence, cities.map(support));
    appendComparisonRow(body, ui.labels.tail, cities.map(eventEffect));
    DIMENSIONS.forEach(dimension => {
      appendComparisonRow(
        body,
        `${dimension.id} · ${ui.dimensions[dimension.id].name}`,
        cities.map(city => formatScore(dimensionScore(city, dimension.id)))
      );
    });
  };

  const normalizedWeights = () => {
    const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
    if (total <= 0) weights = { ...release.officialWeights };
    const divisor = Object.values(weights).reduce((sum, value) => sum + value, 0);
    return Object.fromEntries(
      DIMENSIONS.map(dimension => [dimension.id, (weights[dimension.id] / divisor) * 100])
    ) as Record<DimensionId, number>;
  };

  const renderWeights = () => {
    const normalized = normalizedWeights();
    DIMENSIONS.forEach(dimension => {
      const input = mustQuery<HTMLInputElement>(app, `[data-weight="${dimension.id}"]`);
      const output = mustQuery(app, `[data-weight-output="${dimension.id}"]`);
      input.value = String(weights[dimension.id]);
      input.setAttribute("aria-valuetext", `${normalized[dimension.id].toFixed(1)}%`);
      output.textContent = `${normalized[dimension.id].toFixed(1)}%`;
    });
    mustQuery(app, "[data-weight-total]").textContent = "100.0%";

    const city = cityBySlug.get(selectedSlug);
    if (!city) throw new Error(`Unknown CCI city: ${selectedSlug}`);
    const values = DIMENSIONS.map(dimension => dimensionScore(city, dimension.id));
    const personal =
      city.rankingEligible && values.every((value): value is number => value !== null)
        ? values.reduce(
            (total, value, index) => total + value * (normalized[DIMENSIONS[index].id] / 100),
            0
          )
        : null;
    mustQuery(app, "[data-personal-result]").textContent = formatScore(personal);
    mustQuery(app, "[data-personal-unavailable]").hidden = personal !== null;
  };

  const render = () => {
    renderControls();
    renderTable();
    renderCity();
    renderComparison();
    renderWeights();
    syncUrl();
  };

  app.querySelectorAll<HTMLButtonElement>("[data-year]").forEach(button => {
    button.addEventListener("click", () => {
      year = Number(button.dataset.year) as TargetYear;
      render();
    });
  });
  app.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach(button => {
    button.addEventListener("click", () => {
      mode = button.dataset.mode as ResultMode;
      render();
    });
  });
  app.querySelectorAll<HTMLButtonElement>("[data-sort]").forEach(button => {
    button.addEventListener("click", () => {
      const nextKey = button.dataset.sort as SortKey;
      if (nextKey === sortKey) sortDirection = sortDirection === "asc" ? "desc" : "asc";
      else {
        sortKey = nextKey;
        sortDirection = nextKey === "city" ? "asc" : "desc";
      }
      renderTable();
    });
  });
  app.querySelectorAll<HTMLButtonElement>("[data-open-city]").forEach(button => {
    button.addEventListener("click", () => {
      const slug = button.dataset.openCity;
      if (!slug || !cityBySlug.has(slug)) return;
      selectedSlug = slug;
      render();
      app.querySelector("[data-city-detail]")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
  });
  app.querySelectorAll<HTMLInputElement>("[data-compare-city]").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      compared = checkbox.checked
        ? [...compared, checkbox.value].slice(0, 3)
        : compared.filter(slug => slug !== checkbox.value);
      render();
    });
  });
  app.querySelector<HTMLButtonElement>("[data-compare-button]")?.addEventListener("click", () => {
    comparisonOpen = true;
    render();
    app.querySelector("[data-comparison]")?.scrollIntoView({ block: "nearest" });
  });
  app.querySelector<HTMLButtonElement>("[data-clear-comparison]")?.addEventListener("click", () => {
    compared = [];
    comparisonOpen = true;
    render();
  });
  app.querySelectorAll<HTMLInputElement>("[data-weight]").forEach(input => {
    input.addEventListener("input", () => {
      weights[input.dataset.weight as DimensionId] = Number(input.value);
      renderWeights();
      syncUrl();
    });
  });
  app.querySelector<HTMLButtonElement>("[data-reset-weights]")?.addEventListener("click", () => {
    weights = { ...release.officialWeights };
    render();
  });

  const tabs = Array.from(app.querySelectorAll<HTMLButtonElement>("[role=tab]"));
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(app, tabs, index));
    tab.addEventListener("keydown", event => {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? tabs.length - 1
            : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      const nextTab = tabs[next];
      if (!nextTab) return;
      selectTab(app, tabs, next);
      nextTab.focus();
    });
  });

  app.dataset.state = "ready";
  app.removeAttribute("aria-busy");
  if (status) status.textContent = ui.runtime.ready;
  render();
}

function formatScore(value: number | null) {
  return value === null ? "—" : value.toFixed(1);
}

function compareNullable(left: number | null, right: number | null) {
  if (left === null && right === null) return 0;
  if (left === null) return -1;
  if (right === null) return 1;
  return left - right;
}

function setOrDelete(params: URLSearchParams, key: string, value: string) {
  if (value) params.set(key, value);
  else params.delete(key);
}

function readWeights(
  serialized: string | null,
  official: Record<DimensionId, number>
): Record<DimensionId, number> {
  const values = serialized?.split(",").map(Number);
  if (
    !values ||
    values.length !== DIMENSIONS.length ||
    values.some(value => !Number.isFinite(value) || value < 0 || value > 40)
  ) {
    return { ...official };
  }
  return Object.fromEntries(
    DIMENSIONS.map((dimension, index) => [dimension.id, values[index]])
  ) as Record<DimensionId, number>;
}

function weightsMatch(left: Record<DimensionId, number>, right: Record<DimensionId, number>) {
  return DIMENSIONS.every(dimension => left[dimension.id] === right[dimension.id]);
}

function element(
  tag: "li" | "th" | "td" | "a",
  text: string,
  attributes: Record<string, string> = {}
) {
  const node = document.createElement(tag);
  node.textContent = text;
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
  return node;
}

function appendComparisonRow(body: HTMLElement, label: string, values: string[]) {
  const row = document.createElement("tr");
  row.append(element("th", label, { scope: "row" }));
  values.forEach(value => row.append(element("td", value)));
  body.append(row);
}

function mustQuery<T extends HTMLElement = HTMLElement>(root: HTMLElement, selector: string): T {
  const node = root.querySelector<T>(selector);
  if (!node) throw new Error(`Missing CCI element: ${selector}`);
  return node;
}

function selectTab(app: HTMLElement, tabs: HTMLButtonElement[], selectedIndex: number) {
  tabs.forEach((tab, index) => {
    const selected = index === selectedIndex;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = app.querySelector<HTMLElement>(`#${tab.getAttribute("aria-controls")}`);
    if (panel) panel.hidden = !selected;
  });
}
