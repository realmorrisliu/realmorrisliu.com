import { getTranslations, type Language, type TranslationKey } from "@i18n/utils";

type WorkPosition = TranslationKey["soFar"]["work"]["positions"][number];
type WorkProject = TranslationKey["soFar"]["projects"]["workProjects"]["items"][number];
type PersonalProject = TranslationKey["soFar"]["projects"]["personalProjects"]["items"][number];

function visibleForPdf<T extends { showInPdf?: boolean }>(items: T[]): T[] {
  return items.filter(item => item.showInPdf !== false);
}

function projectGithubLabel(project: PersonalProject): string | undefined {
  return project.githubUrl?.replace("https://github.com/", "");
}

function contactLinks() {
  return [
    {
      label: "morrisliu1994@outlook.com",
      url: "mailto:morrisliu1994@outlook.com",
    },
    {
      label: "github.com/realmorrisliu",
      url: "https://github.com/realmorrisliu",
    },
    {
      label: "x.com/realmorrisliu",
      url: "https://x.com/realmorrisliu",
    },
    {
      label: "realmorrisliu.com",
      url: "https://realmorrisliu.com",
    },
  ];
}

export function getResumePdfData(lang: Language) {
  const t = getTranslations(lang);

  const workPositions = visibleForPdf<WorkPosition>([...t.soFar.work.positions]);
  const workProjects = visibleForPdf<WorkProject>([...t.soFar.projects.workProjects.items]);
  const personalProjects = visibleForPdf<PersonalProject>([
    ...t.soFar.projects.personalProjects.items,
  ]);

  return {
    lang,
    name: "Morris Liu",
    title: t.soFar.pdf.pageTitle,
    description: t.soFar.pdf.pageDescription,
    summary: t.soFar.resumeSummary,
    contact: contactLinks(),
    sections: {
      skills: t.soFar.skills.title,
      work: t.soFar.work.title,
      education: t.soFar.education.title,
      workProjects: t.soFar.projects.workProjects.title,
      personalProjects: t.soFar.projects.personalProjects.title,
    },
    skills: t.soFar.skills.categories.map(category => ({
      title: category.title,
      stack: category.stack,
    })),
    work: workPositions.map(position => ({
      title: position.title,
      company: position.company,
      period: position.period,
      description: position.description,
    })),
    education: t.soFar.education.items.map(item => ({
      school: item.school,
      degree: item.degree,
      period: item.period,
      description: item.description,
    })),
    workProjects: workProjects.map(project => ({
      title: project.title,
      company: project.company,
      period: project.period,
      description: project.description,
      github: "",
    })),
    personalProjects: personalProjects.map(project => ({
      title: project.title,
      period: "",
      description: project.description,
      github: projectGithubLabel(project) ?? "",
      githubUrl: project.githubUrl ?? "",
    })),
    counts: {
      workPositions: workPositions.length,
      workProjects: workProjects.length,
      personalProjects: personalProjects.length,
    },
  };
}

export type ResumePdfData = ReturnType<typeof getResumePdfData>;
