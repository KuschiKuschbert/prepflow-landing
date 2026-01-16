# 🔄 The Ralph Loop Technique

The **Ralph Wiggum AI Loop Technique** is an iterative development methodology used in this project to ensure robustness and automated refinement.

## 核心 (The Core)

> "Don't aim for perfect on the first try. Let the loop refine the work."

The technique is based on a simple philosophy: **Persistence wins over initial precision.**

### 1. Iteration > Perfection

The agent is encouraged to attempt a solution immediately. Failures are not setbacks; they are **data** used to refine the next iteration.

### 2. Completion Promises

Every task must have a defined **Completion Promise**. This is a specific state or string (e.g., "DONE", "VERIFIED", "TESTS PASSED") that signals the loop to terminate.

### 3. Failures Are Data

Deterministic failures are predictable. Each failure provides context (error logs, lint warnings) that is fed back into the agent's context for the next turn.

### 4. Self-Correction Pattern

If the agent encounters a bug, it must:

1.  Analyze the error.
2.  Update the internal plan (`task.md`).
3.  Implement a fix.
4.  Verify.
5.  If it fails, repeat from Step 1.

## Rules for Agents

- **Rule R1**: If a tool fails, do not apologize. Use the error message to adjust your next call.
- **Rule R2**: Always verify your work with a terminal command or browser check before declaring "DONE".
- **Rule R3**: If you are stuck in a loop (3+ identical failures), stop and ask the USER for clarification.
- **Rule R4**: Maintain `task.md` as the "Loop State".

## How to Trigger a Ralph Loop

If you want an agent to "Ralph" on a specific problem, use the command:

> "Ralph this: [Your Task]"

The agent will then enter an autonomous loop until the goal is achieved or a maximum iteration limit is reached.

## 集成 (Integration Points)

- **AI Laws**: Rules for loop execution are codified in [AI_RULES.md](file:///Users/danielkuschmierz/Prepflow-Ecosystem/prepflow-web/docs/AI_RULES.md).
- **Persona**: The [Improver](file:///Users/danielkuschmierz/Prepflow-Ecosystem/prepflow-web/docs/personas/improver.md) persona is the primary agent for executing autonomous loops.
- **Error Learning**: The [Error Learning System](file:///Users/danielkuschmierz/Prepflow-Ecosystem/prepflow-web/docs/ERROR_LEARNING_SYSTEM.md) uses the loop technique to refine automated fixes.
- **RSI**: The [Recursive Self-Improvement System](file:///Users/danielkuschmierz/Prepflow-Ecosystem/prepflow-web/docs/rsi/README.md) orchestrates multi-phase Ralph Loops.
