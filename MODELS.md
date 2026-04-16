# Model Usage Rules — Bloom & Brew

These rules govern which Claude model to use for each type of task on this project. The goal is to match capability to task so we don't waste Opus tokens on simple rewrites, and don't under-power complex design work with Haiku.

---

## The rules

| Task type | Model | Model ID |
|---|---|---|
| Planning, architecture, design decisions, multi-step reasoning | **Opus 4.6** | `claude-opus-4-6` |
| Coding (default) | **Sonnet 4.6** | `claude-sonnet-4-6` |
| Coding (complex problems, hard bugs, tricky refactors) | **Opus 4.6** | `claude-opus-4-6` |
| Text and content (copy, docs, marketing, microcopy, short summaries) | **Haiku 4.5** | `claude-haiku-4-5-20251001` |

---

## When to escalate Sonnet to Opus (coding)

Switch to Opus mid-coding when any of these hit:

- Debugging an issue Sonnet has failed on twice
- Cross-file refactors touching 5+ files with interdependent logic
- Performance-critical algorithms or concurrency bugs
- Designing a non-trivial data model or state machine
- Security-sensitive code (auth flows, token handling, RLS policies)
- Tasks requiring integration of multiple unfamiliar APIs at once

Otherwise, stay on Sonnet — it is faster and cheaper, and it is strong enough for the majority of day-to-day implementation.

## When to use Haiku (text & content)

- Recipe descriptions, tasting notes, brewing tips
- UI microcopy (empty states, tooltips, toast messages)
- Glossary entries, fun facts, onboarding copy
- Short summaries, release notes, changelog entries
- Social-style captions for the Community feed

Haiku is not for writing code or making architectural decisions — even small ones.

---

## How to switch models in Claude Code

- In-session: type `/model` and pick from the menu
- CLI flag: `claude --model <model-id>`
- Config: `claude config set model <model-id>`
- Fast mode: `/fast` (faster streaming on the current model — does not change the model)

---

## Quick decision tree

1. Am I writing prose / copy / docs for users? -> **Haiku**
2. Am I planning, designing, or architecting? -> **Opus**
3. Am I writing or modifying code?
   - Straightforward? -> **Sonnet**
   - Complex, cross-cutting, or stuck? -> **Opus**
