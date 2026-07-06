#import "resume.typ": render-resume

#let data = json("resume.zh.json")

#render-resume(data, "zh", "Noto Sans CJK SC")
