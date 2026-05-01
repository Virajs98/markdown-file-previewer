# Silent Speak Companion — Amazon PartyRock App Plan

## Overview

Build **Silent Speak Companion** on [Amazon PartyRock](https://partyrock.aws) — a no-code AI productivity app that converts a user's situation and emotion into clear, natural, and confident sentences for real-life communication.

Built entirely using PartyRock's Whiskers AI builder and manually tuned widgets. No coding required.

---

## App Summary

| Property | Detail |
|---|---|
| **App Name** | Silent Speak Companion |
| **Platform** | Amazon PartyRock (partyrock.aws) |
| **Purpose** | Convert situation + emotion → natural, confident sentences |
| **Inputs** | Situation, Emotion or Intent |
| **Outputs** | Suggested Sentence, Polished Version, Confidence Boost |
| **Language** | English |
| **Code Required** | None |

---

## Phase 1: Generate App with Whiskers

**Step 1** — Go to [partyrock.aws/home](https://partyrock.aws/home) and click **"Create an app"** to open Whiskers.

**Step 2** — Paste the following prompt into Whiskers to scaffold all widgets in one shot:

```
Build an app called "Silent Speak Companion".

The app helps users turn their situation and emotions into clear, natural sentences for real-life communication.

Inputs:
1. A text input widget titled "Your Situation" (placeholder: e.g. ordering food, job interview, asking for help)
2. A text input widget titled "Emotion or Intent" (placeholder: e.g. nervous, confident, urgent, polite)

Outputs (three separate AI text widgets):
1. "Suggested Sentence" — Generate one simple, natural sentence the user can say out loud, based on their situation and emotion. Keep it realistic and easy to speak. Adapt tone to the emotion.
2. "Polished Version" — Rewrite the suggested sentence in a more refined, polite, or professional tone. Keep it concise.
3. "Confidence Boost" — Write one short motivational line (1–2 sentences) to help the user feel confident while speaking.

Rules for all AI outputs: keep responses short, human-like, and not robotic. No long paragraphs. Separate each output clearly.
```

---

## Phase 2: Manual Widget Tuning (Edit Mode)

**Step 3** — Open **Edit mode** and refine each widget using the specifications below.

---

### Widget 1 — "Your Situation" (Text Input)

- **Type:** User text input
- **Title:** Your Situation
- **Placeholder:** *e.g. ordering coffee at a café, asking a colleague for help, job interview*

---

### Widget 2 — "Emotion or Intent" (Text Input)

- **Type:** User text input
- **Title:** Emotion or Intent
- **Placeholder:** *e.g. nervous, confident, polite, urgent*

---

### Widget 3 — "Suggested Sentence" (AI Generated Text)

- **Type:** AI text output
- **Title:** Suggested Sentence
- **References:** `Your Situation`, `Emotion or Intent`
- **Prompt template:**

> The user is in this situation: `[Your Situation]`. They feel or want to come across as: `[Emotion or Intent]`. Write ONE short, natural sentence they can say out loud. Keep it simple, realistic, and socially appropriate. Adapt the tone to match their emotion — if nervous, use a gentle tone; if confident, use a strong tone; if urgent, be direct. Do not write more than 1–2 sentences.

---

### Widget 4 — "Polished Version" (AI Generated Text)

- **Type:** AI text output
- **Title:** Polished Version
- **References:** `Suggested Sentence` (chained from Widget 3)
- **Prompt template:**

> Take this sentence: `[Suggested Sentence]`. Rewrite it in a more refined, polite, or professional tone. Keep it natural and concise — no more than 1–2 sentences.

---

### Widget 5 — "Confidence Boost" (AI Generated Text)

- **Type:** AI text output
- **Title:** Confidence Boost ✨
- **References:** `Your Situation`, `Emotion or Intent`
- **Prompt template:**

> The user is about to speak in this situation: `[Your Situation]`. They feel: `[Emotion or Intent]`. Write one short motivational sentence (max 2 sentences) to boost their confidence before they speak. Be warm, genuine, and encouraging — not generic.

---

## Phase 3: Layout & Polish

**Step 4** — Arrange widgets vertically in this order inside the app canvas:

1. Static text banner (app title + description)
2. "Your Situation" input
3. "Emotion or Intent" input
4. "Suggested Sentence" output
5. "Polished Version" output
6. "Confidence Boost" output

**Step 5** — Add a **Static Text widget** at the very top as a banner:

> **Silent Speak Companion** — Type your situation and how you feel. Get a sentence you can say with confidence.

---

## Phase 4: Test & Publish

**Step 6** — Run these test cases to validate output quality:

| Situation | Emotion | Expected Tone |
|---|---|---|
| Ordering food at a restaurant | Nervous | Gentle, simple |
| Asking my manager for a day off | Polite | Courteous, formal |
| Introducing myself at a job interview | Confident | Strong, clear |
| Telling a friend I need help | Anxious | Warm, honest |

**Step 7** — Verify:
- Each widget shows a distinct, short output (no long paragraphs)
- Tone matches the emotion
- "Polished Version" is noticeably more refined than "Suggested Sentence"
- "Confidence Boost" feels personal, not generic

**Step 8** — Click **Share → Publish** to generate a public shareable link.

---

## Widget Dependency Map

```
[Your Situation] ──────┬──→ Widget 3: Suggested Sentence ──→ Widget 4: Polished Version
[Emotion or Intent] ───┤
                       └──→ Widget 5: Confidence Boost
```

---

## Decisions & Scope

- PartyRock only — no code, no external APIs
- "Polished Version" chains from "Suggested Sentence" output for coherence
- "Confidence Boost" uses raw inputs only to stay emotionally grounded
- English only (PartyRock is English-only per documentation)
- No image generation widget needed for this use case
- App is reusable — users can change inputs and regenerate freely
