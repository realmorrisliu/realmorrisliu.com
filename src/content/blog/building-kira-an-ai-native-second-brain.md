---
title: "Building Kira: An AI-Native Second Brain That Captures Context, Not Just Notes"
description: "Traditional note-taking apps like Notion and Obsidian create too much cognitive overhead. I'm building Kira—an AI assistant that continuously captures context from your digital environment and amplifies your thinking through conversation. Learn how it evolved from a reading app idea into something completely different."
pubDate: 2025-07-20
updatedDate: 2025-07-22
tags: ["ai", "product-design", "knowledge-management", "rust", "productivity"]
featured: true
author: "Morris Liu"
readingTime: 6
---

I can't use Notion. Or Obsidian. Or any of those heavyweight knowledge management apps.

It's not that they're bad—they're incredibly powerful. But every time I try to organize my thoughts in them, I end up spending more time organizing than thinking. The cognitive overhead of deciding "is this a page or a block?" and "should this go in the weekly notes or project notes?" kills the flow of capturing ideas.

I'm not alone in this. There's a whole category of people who have genuine note-taking needs but bounce off these complex systems. We want to remember things, connect ideas, and build knowledge—we just don't want to become database administrators in the process.

That's why I'm building Kira.

## What Kira Actually Is

Kira is an AI assistant focused on one core mission: **capturing as much context as possible from everything you do, then using that rich context to amplify your thinking**.

Most AI tools are context-poor. You ask a question, get an answer, and the AI forgets everything about your situation. But human thinking doesn't work in isolation—every idea builds on what you were just reading, working on, or thinking about.

Kira flips this. It continuously captures context from your digital environment—text you select, files you work with, conversations you have, even your clipboard contents. Then when you need to think through a problem or develop an idea, the AI has the full picture of what you're actually working on.

The result is AI assistance that feels less like talking to a chatbot and more like thinking with an enhanced version of your own mind.

## Context Capture at Three Levels

To make AI assistance truly useful, Kira captures context at three different scales:

**Immediate Context**: What you're doing right now—text you've selected, clipboard contents, the file you're working in. This enables instant, contextual help without you having to explain the situation.

**Cumulative Context**: Your ongoing thoughts, conversations, and projects. Instead of every chat starting from zero, Kira builds on previous discussions and remembers what you're working toward.

**Environmental Context**: The broader flow of your digital life—calendar events, important files, patterns in your work. This helps Kira understand not just what you're asking, but why you might be asking it.

The magic happens when these layers combine. Ask about a coding problem, and Kira sees the error message you selected (immediate), remembers the architecture discussion from yesterday (cumulative), and knows you have a deadline this week (environmental). The response isn't just technically accurate—it's contextually relevant.

## How It Started

Kira evolved from a completely different problem. I wanted to build a better reading app—something that made reading technical books less painful. But good reading requires good note-taking, which led me to the knowledge management problem.

The progression looked like this:

Good reading app → needs good note-taking → why not solve the Notion problem → AI chat feels natural for this → no good desktop AI chat apps exist → combine them → now I have a reading app again

It's funny how product ideas circle back to their origins.

## The Interface That Disappears

Most AI chat apps feel like... well, chat apps. You open them, type a message, wait for a response, repeat. But thinking isn't structured like a chat conversation. It's messy, contextual, and often triggered by something you're already looking at.

Kira's primary interface is designed around this reality. Press a global hotkey (like Option + Space) and you get a context-aware window that adapts to what you're doing:

- If you have text selected, it offers relevant actions (translate, summarize, explain)
- If you don't, it becomes a quick capture box for thoughts and questions
- It automatically detects clipboard content and offers to include it as context

The goal is to make the interface disappear entirely. You shouldn't feel like you're "using an app"—you should feel like you're having a conversation with your own enhanced memory.

## Why Desktop, Why Now

There's no shortage of AI chat apps, but almost all of them are web-based or mobile-first. Desktop apps have different interaction patterns—global hotkeys, drag-and-drop, deeper integration with your workflow.

When you're writing code and hit a problem, you don't want to switch browser tabs and lose context. You want to select the error message, hit a hotkey, and get help without breaking flow.

When you have a random thought while reading, you don't want to open another app. You want to capture it instantly and trust that it'll be there when you need it.

Desktop apps can be ambient in a way web apps can't. They can observe your workflow (with permission) and provide assistance at exactly the right moment.

## The Evolution of Context

The real potential of Kira isn't just better chat—it's what happens when AI truly understands your thinking patterns.

Right now, most AI interactions are like talking to someone who just walked into the room. They're smart, but they don't know what you were working on five minutes ago, let alone what you've been thinking about for weeks.

Kira's long-term vision is an AI that evolves from reactive to proactive context awareness. It starts by capturing what you explicitly share, then learns to recognize patterns in how you think and work. Eventually, it doesn't just respond to your questions—it anticipates the connections you're trying to make.

Imagine an AI that notices you've been reading about distributed systems while working on a microservices project, then naturally weaves relevant concepts into your architecture discussions. Or one that connects a random thought you captured last month to the problem you're debugging today.

This isn't about replacing human thinking—it's about amplifying the connections your mind is already trying to make. The goal is an AI thinking partner that helps you see patterns, make connections, and develop ideas better than you could alone.

## Starting Simple

For now, I'm focused on solving the immediate problem: giving people like me a way to think with AI that doesn't feel like talking to a chatbot. A tool that captures thoughts effortlessly, connects ideas automatically, and surfaces relevant knowledge exactly when you need it.

If you're someone who wants to remember more, think clearer, and organize less, Kira might be exactly what you need too.

The beta is coming soon. Because the best way to build a second brain is to use it every day.

---

_Want to see another example of building simpler tools for developers? Check out [Why I Built Sealbox](/thoughts/why-i-built-sealbox), where I apply similar thinking to secret management._
