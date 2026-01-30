# Feature Functionality Specifications

This directory contains specifications for the expected behavior of various features in the application. These documents serve as the "Source of Truth" for functionality, helping us identify regressions and restore broken features systematically.

## Workflow

1.  **Identify a Feature**: Pick a feature or page (e.g., "Login", "Recipe Search", "Admin User Management").
2.  **Describe Expected Behavior**: The user (or developer) describes how it _should_ work.
3.  **Create Spec File**: Create a file in this directory using `TEMPLATE.md`. Name it `[feature-name].md` (e.g., `login.md`).
4.  **Verify & Fix**:
    - Check the current implementation against the spec.
    - Mark items as `[Working]`, `[Broken]`, or `[In Progress]`.
    - Fix the broken items.
5.  **Maintain**: Keep the spec updated as requirements change.

## File Naming Convention

Use lowercase kebab-case: `feature-name.md`.
Example:

- `login-flow.md`
- `recipe-creation.md`
- `staff-scheduling.md`
