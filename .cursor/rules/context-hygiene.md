# Context Hygiene — Mid-Task Handoff Without Losing Thread

## When to Summarize

Summarize your context when:

- Approaching context limit (>80% of token window used)
- Switching from one domain to another during a multi-domain task
- Pausing a long-running task (user says "continue later")
- Handing off to a sub-agent

## Handoff Checkpoint Template

When you need to pause or hand off, produce a checkpoint block:

```
## CHECKPOINT: [Task Name]
**Branch:** improvement/task-name
**Last Commit:** [commit hash + message]
**Phase:** [current phase]
**Domain Completed:** [list of domains fully done]
**Current Domain:** [domain being worked on]
**Current File:** [last file modified]
**Files Modified This Domain:** [list]
**Files Remaining This Domain:** [list or "unknown — search needed"]
**Known Issues / Blockers:** [anything that went wrong or needs human input]
**Next Step:** [exact first action to take on resume]
**TECH_DEBT Items Added:** [any new items logged to TECH_DEBT.md]
```

## Resume Protocol

When resuming a paused task:

1. Read the checkpoint block above
2. Run `git log --oneline -10` to confirm last commit
3. Run `git status` to confirm clean tree
4. Verify the current branch: `git branch --show-current`
5. Continue from "Next Step" in the checkpoint

## Sub-Agent Handoff

When spawning a sub-agent for a specific domain:

- Pass the checkpoint block in the prompt
- Specify exactly which files to touch
- Specify the commit message format
- Ask the sub-agent to produce a checkpoint on completion

Never split tasks that share mutable state (e.g., a single file being modified by two agents simultaneously).

## Context Compression Rules

When summarizing long context, preserve:

1. The branch name and last commit
2. The list of completed domains
3. The exact next file/action
4. Any TECH_DEBT items identified
5. Any patterns discovered that differ from the rules

Drop from context:

- Full file contents already committed
- Error messages that were resolved
- Intermediate reasoning steps

## Domain Completion Checklist

Before marking a domain as complete:

- [ ] All files in domain reviewed
- [ ] Improvements applied (or skipped with reason in TECH_DEBT.md)
- [ ] RETROFIT LOG in domain's SKILL.md updated
- [ ] Committed: `refactor(domain): apply skill standards`
- [ ] No lint errors introduced (run `npm run lint` on changed files)

## Context Window Warning Signs

Stop and produce a checkpoint if:

- You notice you're repeating yourself
- You can't recall what was done 10+ steps ago
- The response is getting very long without a commit
- You're unsure if a file was already processed
