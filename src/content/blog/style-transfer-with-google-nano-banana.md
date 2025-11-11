---
title: "Style Transfer with Google's Nano Banana: A Three-Stage Evolution from Failure to Breakthrough"
description: "Google's nano banana (gemini-2.5-flash-image-preview) promised breakthrough image generation, but family photos revealed critical limitations. Following Google's official prompting guide, I evolved through three technical approaches—from complex prompts to description-first to line art bridging—discovering how to work with AI model strengths rather than against them."
pubDate: 2025-09-05
tags: ["ai", "image-generation", "google-gemini", "style-transfer", "prompt-engineering"]
featured: true
author: "Morris Liu"
readingTime: 10
---

Recently, I've been researching the market for custom decorative artwork from family portraits. There's growing demand for transforming family photos into different artistic styles—watercolor paintings, Simpsons cartoon style, Japanese anime illustrations, and Disney/Pixar 3D animation aesthetics. Different clients gravitate toward different styles, so I wanted to test the feasibility of automated style transfer across these popular formats.

That's when I started researching the latest AI image generation capabilities. Google's newly released `gemini-2.5-flash-image-preview` model had been getting incredible reviews. The AI community had nicknamed it "nano banana" due to its compact model identifier, and everyone was praising its photorealistic results and contextual understanding. Perfect timing.

I figured this would be straightforward: feed it family photos, specify the target style, and get beautiful artistic renderings in return. After half a day and dozens of attempts, the results were consistently disappointing—regardless of whether I asked for watercolor, anime, or Disney style.

## The Nano Banana Promise

The hype around nano banana was justified. Google's `gemini-2.5-flash-image-preview` model represents a significant leap in AI image generation. Unlike previous models that struggle with contextual understanding, nano banana excels at interpreting detailed text descriptions and producing photorealistic results.

But here's what the demo videos don't show you: it has a critical weakness with complex human compositions.

## Stage One: The Complex Prompt Challenge

My first approach seemed logical: feed nano banana a family portrait with detailed style instructions and let it transform the image directly. But achieving consistent results required far more sophisticated prompting than I initially expected.

The prompts that actually worked weren't simple style descriptions—they were comprehensive instruction sets running several thousand words. For Disney-style transformations, the effective prompts included detailed specifications for character appeal, rendering quality, identity preservation, composition requirements, and failure prevention strategies.

These complex prompts covered everything from lighting specifications and character proportions to explicit instructions about maintaining family member recognition while applying cartoon stylization. The level of detail required was extraordinary—essentially providing the AI with a complete artistic direction document for each transformation.

Despite this elaborate prompt engineering, the results revealed a clear and concerning pattern across all styles.

For photos with three or fewer people, nano banana performed remarkably well. I was getting roughly 9 usable results out of every 10 attempts—clean watercolor effects, recognizable anime features, proper Disney-style proportions. The quality was genuinely impressive.

But add a fourth person to any family photo, and the success rate plummeted to nearly zero. Regardless of the target style, the model consistently struggled with tracking multiple human subjects in complex compositions.

The problem wasn't that the prompts were too simple—quite the opposite. Even with meticulously crafted, multi-thousand-word instruction sets that covered every aspect of the transformation process, the fundamental challenge remained unsolved. Each artistic style required its own elaborate prompt architecture, complete with specific technical requirements, artistic guidelines, and failure mitigation strategies.

This created a maintainability nightmare: managing different complex prompt templates for watercolor, anime, Disney, and Simpsons styles, each requiring constant refinement and testing. But more critically, even these sophisticated prompts couldn't overcome nano banana's core limitation with multi-person scene tracking.

The issue wasn't prompt engineering—it pointed to a fundamental architectural limitation in the direct image transformation approach when dealing with complex human compositions.

This realization forced me to step back and question my entire approach. Maybe the problem wasn't that I needed even more complex prompts, but that I was fundamentally misunderstanding how this model was designed to work. Instead of continuing to fight against the model's apparent limitations, perhaps I needed to understand and work with its actual strengths.

## Stage Two: Description-First Approach

Facing the limitations of complex direct prompts, I turned to Google's official documentation to understand how nano banana was actually designed to work. The breakthrough insight came from Google's [Prompting Guide and Strategies](https://ai.google.dev/gemini-api/docs/image-generation), which emphasizes a fundamental principle:

**"Describe the scene, don't just list keywords."**

The model's core strength isn't processing elaborate instruction sets—it's deep language understanding. A narrative, descriptive paragraph produces better, more coherent results than even the most sophisticated multi-thousand-word prompt templates.

This realization completely reframed my approach. Instead of trying to pack everything into one complex transformation prompt, I could leverage nano banana's natural language strengths by separating the process:

Instead of asking it to transform an existing image, I flipped the entire workflow:

1. **Analysis Phase**: Use Gemini to analyze the photo and generate a comprehensive description
2. **Generation Phase**: Feed that description plus style instructions to nano banana

The analysis prompts I developed were exhaustive:

```
Analyze this image for watercolor painting transformation. Focus on:
- Light source direction, quality, and color temperature
- How light creates mood and atmosphere in the scene
- Areas of bright illumination vs gentle shadows
- Individual person descriptions: facial features, hair, clothing, poses
- Spatial relationships and interaction between people
- Environmental context and background elements
- Color harmony and emotional tone
```

Following Google's guidance to focus on scene description rather than complex instruction sets transformed the results entirely. The description-first method achieved excellent results in terms of artistic style—nano banana consistently delivered beautiful watercolor effects, characteristic anime features, and authentic Disney aesthetics regardless of photo complexity.

The style generation success rate was remarkably high across all target formats. Where stage one's elaborate prompts had struggled with consistency despite their complexity, stage two's narrative approach reliably produced results that matched the intended artistic vision by working with nano banana's natural language strengths rather than against them.

But a critical limitation emerged: scene preservation was unreliable. While the generated images captured the right artistic style, they often failed to accurately reproduce the spatial relationships and positioning from the original photos. Multiple generation attempts would be required to get even approximately correct character placement, and even then, the results were close approximations rather than faithful reproductions of the original scene composition.

## The Description Limitation

Text descriptions, no matter how detailed, struggle with spatial precision. You can describe that "Sarah is standing to the left of Michael, with her hand on his shoulder" but you can't capture the exact angle of that gesture, the specific way her fingers curve, or the precise distance between their faces.

This became especially apparent in intimate family portraits where subtle body language and spatial relationships carry emotional weight. The watercolors were technically correct but emotionally hollow. The anime versions got the style right but lost character positioning. The Disney renders captured the aesthetic but couldn't replicate the natural family interactions that made the original photos special.

Each style suffered differently: watercolor lost subtle gestural relationships, anime struggled with natural pose flow, and Disney-style renders felt artificially staged rather than capturing genuine moments.

I needed something that could preserve the exact spatial relationships while still enabling nano banana's superior style generation capabilities.

## Stage Three: The Line Art Bridge

The solution hit me while debugging a failed generation: what if I used nano banana itself to extract structural information before applying the style?

The third approach introduced an intermediate step:

1. **Line Art Extraction**: Use nano banana to create a minimal line drawing from the original photo
2. **Description Generation**: Analyze the photo for color, lighting, and atmospheric details
3. **Style Generation**: Combine the line art with the description and style instructions

The line art prompt required careful calibration:

```
Transform this photograph into gentle watercolor-ready line art
that supports fluid color application and natural watercolor effects.

Create soft, minimal line work designed specifically to support
watercolor painting techniques, emphasizing areas that need
definition while leaving space for watercolor's natural flow
and transparency.

Use varied line thickness to suggest form and depth naturally:
- Heavier lines (2-3 pixels) for foreground elements
- Lighter lines (1-2 pixels) for background elements
- Broken or interrupted lines that allow color to flow

Focus entirely on creating supportive line work that enhances
watercolor's natural strengths of luminosity, color harmony,
and organic beauty.
```

The final generation step combined all three elements:

```
Using the provided line art as the structural foundation,
transform this drawing into a luminous watercolor painting
that captures the essence and details from: {description}

The line art defines your structural framework - the placement
of elements, their proportions, and the overall composition.
Your task is to breathe life into these pencil strokes through
the fluid, unpredictable beauty of watercolor...
```

The results varied dramatically by target style.

For watercolor transformations, the line art approach was transformative. The combination of structural guidance with artistic freedom produced nearly perfect results—the success rate was essentially 100%. The line art provided exactly the right foundation for watercolor's organic flow while preserving spatial relationships.

However, other styles revealed unexpected complications. Simpsons-style transformations, in particular, produced unsettling results: the line art preserved realistic human proportions, but nano banana would overlay Simpsons elements like yellow skin tones and simplified facial features onto these realistic body structures. The result was an uncanny valley effect—characters that looked disturbingly like real people wearing Simpsons makeup rather than authentic cartoon representations.

## The Technical Implementation

Building this three-stage pipeline required careful coordination between different model capabilities. Here's the simplified implementation architecture:

```python
def transform_image_with_lineart(image_path: str, style: str) -> str:
    """
    Three-stage image style transfer using line art as structural bridge.

    The 'backend' object is an abstraction layer that allows switching between
    different platforms for accessing nano banana (gemini-2.5-flash-image-preview).
    For example, switching between Google AI Studio and OpenRouter endpoints
    without changing the core logic.
    """
    # Stage 1: Extract structural line art
    lineart_prompt = load_lineart_prompt(style)
    lineart_path = backend.transform_image(image_path, lineart_prompt)

    # Stage 2: Generate detailed description
    analysis_prompt = load_analysis_prompt(style)
    description = backend.analyze_image(image_path, analysis_prompt)

    # Stage 3: Generate styled result
    generation_prompt = build_generation_prompt(description, style)
    styled_path = backend.transform_image(lineart_path, generation_prompt)

    return styled_path
```

Each stage leverages nano banana's strengths while compensating for its weaknesses. The line art extraction uses its image-to-image capabilities for structural preservation. The analysis phase uses its vision-language skills for detailed descriptions. The final generation combines both inputs for optimal results.

## Why This Approach Works

The line art acts as a structural skeleton that nano banana can't ignore or distort. Unlike pure text descriptions that leave spatial relationships ambiguous, the line drawing provides exact positioning, proportions, and compositional flow.

But crucially, the lines are minimal and organic—just enough structure to guide the generation without constraining watercolor's natural fluidity.

When nano banana generates the final watercolor, it has three pieces of information:

- **Spatial structure** from the line art
- **Visual details** from the description
- **Style instructions** from the prompt

This trinity enables it to create images that are both spatially accurate and artistically compelling.

## The Performance Reality

Processing time averages around 30 seconds per image, which is completely acceptable for high-quality results. The three-stage approach requires three separate API calls (line art extraction, analysis, and final generation), but the sequential processing doesn't significantly impact the overall workflow.

Most importantly, the approach solved the fundamental multi-person limitation that plagued the direct prompt method. While exact success rates vary by style and specific use case, the improvement in consistency was dramatic enough to make automated family portrait transformation viable for the first time.

## The Simpsons Problem and Further Iteration

While the line art approach solved watercolor transformations beautifully, it revealed a deeper architectural question when applied to other styles. The unsettling Simpsons results weren't a failure of the method—they were exposing a fundamental mismatch between the structural guidance I was providing and the target aesthetic.

The issue was clear: realistic line art fundamentally conflicts with cartoon aesthetics that rely on stylized proportions and simplified forms. I was asking nano banana to apply cartoon styling to realistic human proportions, creating an uncanny valley effect.

This led to a crucial insight: different target styles need different types of structural guidance. The line art approach wasn't wrong—it needed to be style-aware from the beginning.

For the Simpsons style, I developed a modified approach. Instead of extracting realistic line art, I prompted nano banana to create stylized line art that referenced cartoon proportions from the beginning:

```
Transform this photograph into Simpsons-style line art. Don't simply
trace the realistic proportions—instead, interpret the people as if
they were Simpsons characters. Reference the characteristic head sizes,
body proportions, and simplified features from the show. Blend the
actual people's distinctive characteristics with typical Simpsons
character structures.
```

This style-specific line art approach produced much better results. Rather than realistic people with cartoon overlays, the final images looked like authentic Simpsons characters that retained recognizable features from the original family members.

The lesson was architectural: the line art extraction step needs to be calibrated for the target style, not just used generically across all artistic formats.

## The Broader Lesson

This project reinforced something I've learned building developer tools: the obvious solution is often wrong.

Direct image transformation feels intuitive—just tell the AI what you want and let it figure out the details. But complex AI models have nuanced strengths and blind spots that require architectural thinking, not just prompt engineering.

The three-stage approach isn't just about getting better watercolors. It's about understanding how to decompose problems in ways that align with model capabilities rather than fighting against them.

Sometimes the most effective path to your goal isn't the direct one.

---

_Want to see another example of AI solving real-world problems? Check out [Building Kira: An AI-Native Second Brain](/thoughts/building-kira-an-ai-native-second-brain), where I explore how AI can amplify human thinking through contextual understanding—a different approach to the same core challenge of making AI truly useful._
