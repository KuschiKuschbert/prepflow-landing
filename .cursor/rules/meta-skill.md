# Meta-Skill — Self-Improvement Protocol

After every non-trivial task, execute this protocol before closing the session.

## 1. SKILL UPDATE CHECK

Did this task reveal an undocumented pattern, constraint, or workflow?

- If yes: open the relevant `.cursor/rules/` file or domain `SKILL.md` and append it
- If it's a new domain with no skill file: create one following the SKILL.md template in `sub-agent-orchestration.md`
- If it's a cross-cutting concern: add to `decisions.md`

**Trigger:** Any time you say "I noticed that..." or "turns out..." — that's a skill update.

## 2. BUG MEMORY

If a fix took 2+ iterations (you tried something, it failed, you tried again):

Append to the relevant `SKILL.md` under `## GOTCHAS`:

```
[YYYY-MM-DD] BUG: [brief description]
ROOT CAUSE: [what was actually wrong]
FIX: [what resolved it]
PREVENTION: [what rule prevents this in future]
```

Also check `docs/TROUBLESHOOTING_LOG.md` — if it's a new error, document it there too.

## 3. DECISION LOG

If you made an architectural choice (chose approach A over B, decided to skip something, picked a library):

Append to `.cursor/rules/decisions.md`:

```
## [YYYY-MM-DD] Brief Decision Title
**Decision:** What was chosen
**Reasoning:** Why
**Consequence:** What this means going forward
```

## 4. NEVER REPEAT

Before starting any task:

1. Check `forbidden.md` — is any part of the task in the forbidden list?
2. Check `error-patterns.mdc` — has this error been seen before?
3. Check the domain SKILL.md `## GOTCHAS` section — any known traps?

If a known issue exists: apply the documented fix immediately, don't rediscover it.

## 5. NEW SKILL TRIGGER

If you perform the same type of task 3+ times without a skill file for it:

- Create a SKILL.md for that task type
- Add it to `.cursor/SKILLS_INDEX.md`
- Location: in the most relevant directory (e.g., `lib/square/SKILL.md` for Square sync tasks)

## 6. FILE RETROFIT

If you edit an existing file and notice it violates `style.md` or `forbidden.md`:

- Fix the violation in the same commit
- Add the file to the domain SKILL.md's `## RETROFIT LOG`

Exception: if the fix would be large enough to obscure the original change, create a separate commit: `refactor(domain): apply style standards to [filename]`

## 7. SESSION END CHECKLIST

Before ending any session where files were modified:

```bash
git status          # Confirm nothing uncommitted
git log --oneline -5  # Confirm commits look right
npm run lint        # No new lint errors
npm run type-check  # No new TypeScript errors
```

If lint or type-check fail on files you modified: fix before ending the session.

## 8. TECH DEBT LOGGING

If you found an issue but couldn't safely fix it:

- Add to `.cursor/TECH_DEBT.md` immediately
- Format: `| File | Issue | Why Not Auto-Fixed | Effort | Priority |`
- Never leave "I noticed but didn't fix" undocumented

## Self-Improvement Metrics

Track these in `docs/DEV_LOG.md` at session end:

- Files modified
- Domains covered
- Skills updated
- New GOTCHAS documented
- Tech debt items added
