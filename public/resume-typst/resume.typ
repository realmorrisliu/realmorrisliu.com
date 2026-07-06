#let ink = rgb("#141414")
#let dim = rgb("#4f4f4f")
#let faint = rgb("#737373")
#let rule-color = rgb("#2a2a2a")

#let body-leading-for(lang) = if lang == "zh" { 0.44em } else { 0.5em }
#let skill-leading-for(lang) = if lang == "zh" { 0.68em } else { 0.64em }
#let skill-after-for(lang) = if lang == "zh" { 5pt } else { 4.2pt }
#let item-leading-for(lang) = if lang == "zh" { 0.48em } else { 0.48em }
#let section-before-for(lang) = if lang == "zh" { 5.6pt } else { 4.8pt }
#let section-after-for(lang) = if lang == "zh" { 3.2pt } else { 2.6pt }
#let item-before-for(lang) = if lang == "zh" { 2.4pt } else { 1.6pt }
#let item-title-gap-for(lang) = if lang == "zh" { 4.8pt } else { 3.4pt }
#let item-after-for(lang) = if lang == "zh" { 7.2pt } else { 4.6pt }

#let heading(title, lang) = [
  #v(section-before-for(lang))
  #text(
    size: if lang == "zh" { 9.45pt } else { 9.35pt },
    weight: "semibold",
    tracking: if lang == "zh" { 0pt } else { 0.6pt },
  )[#title]
  #v(-0.4pt)
  #line(length: 100%, stroke: 0.45pt + rule-color)
  #v(section-after-for(lang))
]

#let row(lhs, rhs) = grid(
  columns: (1fr, auto),
  column-gutter: 10pt,
  align: (left, top),
)[
  #lhs
][
  #text(size: 7.4pt, fill: faint)[#rhs]
]

#let paragraph(body, leading) = [
  #set par(leading: leading, spacing: 0em, justify: true)
  #text(fill: dim)[#body]
]

#let maybe-link(label, url) = if url == "" {
  [#label]
} else {
  link(url)[#label]
}

#let inline-links(items) = {
  for (index, item) in items.enumerate() {
    if index > 0 {
      [ | ]
    }

    if type(item) == str {
      item
    } else {
      maybe-link(item.label, item.url)
    }
  }
}

#let skill-item(category, lang) = [
  #set par(leading: skill-leading-for(lang), spacing: 0em, justify: true)
  #text(weight: "semibold")[#category.title:] #text(fill: dim)[#category.stack]
  #v(skill-after-for(lang))
]

#let work-item(item, lang) = [
  #v(item-before-for(lang))
  #row(
    text(weight: "semibold")[#item.title],
    [#item.company | #item.period],
  )
  #v(item-title-gap-for(lang))
  #paragraph(item.description, item-leading-for(lang))
  #v(item-after-for(lang))
]

#let education-item(item, lang) = [
  #v(item-before-for(lang))
  #row(
    text(weight: "semibold")[#item.degree],
    item.period,
  )
  #v(item-title-gap-for(lang))
  #text(size: 7.6pt, fill: faint)[#item.school]
  #v(0.8pt)
  #paragraph(item.description, item-leading-for(lang))
  #v(item-after-for(lang))
]

#let project-item(project, lang, show-github: false) = [
  #v(item-before-for(lang))
  #if project.period != "" [
    #row(
      text(weight: "semibold")[#project.title],
      project.period,
    )
  ] else [
    #text(weight: "semibold")[#project.title]
  ]
  #if show-github and project.github != "" [
    #linebreak()
    #text(size: 7.4pt, fill: faint)[GitHub: #maybe-link(project.github, project.at("githubUrl", default: ""))]
  ]
  #v(item-title-gap-for(lang))
  #paragraph(project.description, item-leading-for(lang))
  #v(item-after-for(lang))
]

#let render-resume(data, lang, font) = [
  #let is-zh = lang == "zh"
  #let body-size = if is-zh { 8.85pt } else { 8.42pt }
  #let body-leading = body-leading-for(lang)

  #set document(title: data.title, author: "Morris Liu")
  #set page(
    paper: "a4",
    margin: (top: 8mm, bottom: 8mm, left: 12mm, right: 12mm),
  )
  #set text(font: font, lang: lang, size: body-size, fill: ink)
  #set par(leading: body-leading, spacing: 0.18em, justify: true)

  #align(center)[
    #text(size: 17.5pt, weight: "semibold")[#data.name]
    #v(2pt)
    #text(size: 7.7pt, fill: faint)[#inline-links(data.contact)]
    #v(2.5pt)
    #paragraph(data.summary, body-leading)
  ]

  #heading(data.sections.skills, lang)
  #for category in data.skills {
    skill-item(category, lang)
  }

  #heading(data.sections.work, lang)
  #for item in data.work {
    work-item(item, lang)
  }

  #heading(data.sections.education, lang)
  #for item in data.education {
    education-item(item, lang)
  }

  #heading(data.sections.workProjects, lang)
  #for project in data.workProjects {
    project-item(project, lang)
  }

  #heading(data.sections.personalProjects, lang)
  #for project in data.personalProjects {
    project-item(project, lang, show-github: true)
  }
]
