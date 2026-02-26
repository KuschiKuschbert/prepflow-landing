# PERSONALITY & GAMIFICATION SKILL

## PURPOSE

Load when working on the personality system (PrepFlow voice/character), gamification features (confetti, achievements), skill learning system, or easter eggs.

## HOW IT WORKS IN THIS CODEBASE

**Personality system:**
`lib/personality/` — manages PrepFlow's "personality" — friendly kitchen-themed voice and character.

- `lib/personality/helpers/scheduler-events.ts` — scheduled personality events (e.g., "Good morning, chef!")
- Personality affects toast messages, empty state text, and AI prompts

**Gamification:**

- `components/gamification/` — UI components for achievements, badges
- `canvas-confetti` package — used for celebration effects
- `components/Arcade/` — easter egg arcade games
- `components/EasterEggs/` — easter egg triggers (keyboard combos, etc.)
- `components/ErrorGame/` — game shown on error pages

**Skill learning system:**
`lib/skill-learning/` — internal system that tracks which features users have used, to personalize suggestions and onboarding.

## GOTCHAS

- **Personality voice** should always match the PrepFlow voice guidelines in `dialogs.mdc`
- **Confetti on key actions** — don't add confetti to destructive or error flows
- **Easter eggs** are hidden features — don't document their triggers in user-facing content
- **Skill learning** is advisory only — never gate functionality on whether a skill has been learned

## REFERENCE FILES

- `lib/personality/helpers/scheduler-events.ts` — personality event scheduling
- `lib/skill-learning/index.ts` — skill learning entry point
- `components/gamification/` — gamification UI
- `components/Arcade/` — arcade easter eggs

## RETROFIT LOG

## LAST UPDATED

2025-02-26
