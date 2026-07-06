#import "resume.typ": render-resume

#let data = json("resume.en.json")

#render-resume(data, "en", "Noto Sans CJK SC")
