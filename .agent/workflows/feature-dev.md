---
description: Standard feature development workflow (Research -> Branch -> Code -> Document -> Verify)
---

# Smart Feature Development Workflow

Follow this process for all coding tasks to ensure safety and documentation.

1.  **🧠 Research & Context**
    - Read `docs/LIVING_RULES.md` to ensure compliance.
    - Read `docs/DEV_LOG.md` to get context on recent changes.

2.  **🌿 Branch Strategy**
    - **NEVER** commit to `main`.
    - Create a descriptive branch:

    ```bash
    git checkout main
    git pull origin main
    git checkout -b feature/[name]
    # OR fix/[name]
    ```

3.  **💻 Implementation**
    - Write code.
    - **Rule**: If you encounter a new error, fix it AND add it to `docs/TROUBLESHOOTING_LOG.md`.

4.  **📝 Documentation**
    - Update `docs/DEV_LOG.md` with your progress.
    - Ensure `LIVING_RULES.md` is updated if you learned a new pattern.

5.  **✅ Verification & Merge**
    - Run the safe merge script to automatically lint, build, test, and merge:
    ```bash
    ./scripts/safe-merge.sh
    ```
