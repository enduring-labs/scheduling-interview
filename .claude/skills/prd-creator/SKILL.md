---
name: prd-creator
description: "Use when the user asks to write, create, or draft a PRD (Product Requirements Document). Guides structured product thinking from problem through solution."
---

<overview>
Write PRDs that define **what** to build and **why**, without prescribing implementation or technology details. The PRD should give any engineer enough context to design the system architecture independently.
</overview>

## Process

Before writing, gather the following from the user (ask clarifying questions if any are missing):

1. **What is the product/feature?** — One-sentence description
2. **Who is it for?** — Target users and their context
3. **What problem does it solve?** — Current pain points
4. **What does success look like?** — Measurable outcomes

## PRD Structure

Write the document in this exact order. Use `docs/prd.md` in this repo as a reference for tone, depth, and formatting.

### 1. Overview
A single paragraph explaining what the product is and its core value proposition. Be specific — name the users, the domain, and the key differentiator. Avoid vague language like "a tool that helps with X." Instead: "An AI-powered due diligence tool for [org] that [specific mechanism] to deliver [specific outcome]."

### 2. Problem
Bulleted list of concrete pain points the target users face today. Each bullet should be:
- A specific, observable problem — not a restatement of "they don't have this tool yet"
- Grounded in the user's real workflow
- Something the product directly addresses

Aim for 3-5 bullets.

### 3. Solution
Explain the product's central mechanism — the "how it works" at a conceptual level. This is the section that makes the product unique. Describe:
- The mental model the user should have
- If the product has a novel approach (e.g., adversarial debate, collaborative filtering), explain it here in detail
- The high-level structure of any agents, pipelines, or multi-step processes (name each component and its role, describe hierarchy and specializations)
- How phases connect: inputs, processing, outputs, parallelism, and sequencing

Do NOT include technology choices — describe the system in terms of what it does, not what it's built with.

### 4. User Stories
List user stories in the format: **As a [role], I want to [action], so that [outcome].**

Group related stories under sub-headings if there are many. Each story should be:
- Tied to a specific user need from the Problem section
- Testable — you can tell when it's done
- Independent enough to be built and shipped on its own

### 5. Core Features
Describe each major feature as a numbered section with a descriptive name (e.g., "### 1. Upload a pitch deck"). For each feature:
- Walk through exactly what the user sees and does, screen by screen
- Describe the UI layout in enough detail that a designer could wireframe it (specify layouts like side-by-side, stepper, sidebar — be opinionated, don't leave it ambiguous)
- Mention what happens in the background (e.g., "the system extracts and structures the content")
- Note any real-time, live-updating, or async behavior the user observes

### 6. Out of Scope
Bulleted list of things the product explicitly does NOT do in this version. This prevents scope creep and sets expectations. Include:
- Features that are tempting but not essential for v1
- Adjacent problems the product won't solve
- Integrations or platforms not supported yet

### 7. Success Criteria
3-5 measurable outcomes that define whether the product is working. Each should be:
- Specific and observable
- Tied to the Problem section
- Achievable and testable

## Writing Guidelines

- **Be opinionated**: Make design decisions. Don't say "could show a list or cards" — pick one and describe it.
- **Be concrete**: Replace "the user can view results" with "the analysis page shows bull and bear cases side by side in a two-column layout."
- **No implementation details**: Don't mention databases, frameworks, API routes, or data models. That belongs in the SRS/architecture doc.
- **Use plain language**: Write for a smart person who isn't technical. Avoid jargon unless it's domain-specific (e.g., "TAM/SAM/SOM" in a VC context is fine).
- **Keep it scannable**: Use headers, bullets, and bold text. Avoid long paragraphs.

## Output

Save the PRD to `docs/prd.md`. After writing, update `CLAUDE.md` if a new doc entry is needed.
