# 1. Adopt Strict Zod Validation (Web) and MVI Architecture (App)

- Status: accepted
- Deciders: Antigravity, User
- Date: 2026-10-24

## Context and Problem Statement

The codebase has grown with mixed patterns.

- **Web (`prepflow-web`):** API routes often use loose typing (`any`) and inconsistent validation, leading to potential runtime errors and maintenance difficulties.
- **App (`curbos-app`):** Screens are built with Compose but logic is sometimes scattered in ViewModels without a clear state management pattern, making it harder to test and debug complex flows.

We need a standardized approach for new features and refactoring to ensure quality, type safety, and maintainability.

## Decision Drivers

- Type Safety: Eliminate `any` to catch errors at compile time.
- Validation: Ensure all external inputs are validated before processing.
- Predictability: State changes should be predictable and traceable.
- Testability: Logic should be easily unit testable.
- Consistency: Developers should follow the same patterns across the codebase.

## Considered Options

- **Option 1:** Keep ad-hoc patterns (Status Quo).
- **Option 2:** Adopt strict Zod validation for Web APIs and strict MVI (Model-View-Intent) for App ViewModels.
- **Option 3:** Adopt MVVM without strict intents for App.

## Decision Outcome

Chosen option: **Option 2**.

We will enforce:

1.  **Web:** All API routes must use `zod` schemas for request body/query validation. Types must be inferred from Zod schemas. `any` is strictly forbidden in API handlers.
2.  **App:** All Screens must use the MVI pattern.
    - **State:** A single data class `UiState` exposed as `StateFlow`.
    - **Intent:** A sealed interface `Intent` (or `Event`) describing all user actions.
    - **ViewModel:** A single entry point `onIntent(intent)` (or similar) to process actions.

### Positive Consequences

- **Web:** improper requests are rejected early with clear errors. Code is self-documenting via schemas.
- **App:** Unidirectional data flow makes state management robust. easy to log/debug user actions.
- **Shared:** Consistent developer experience.

### Negative Consequences

- **Web:** increased boilerplate for simple APIs.
- **App:** More boilerplate (sealed classes) for simple screens.

## Implementation Examples

### Web (API Route)

```typescript
import { z } from 'zod';
const schema = z.object({ name: z.string() });
export async function POST(req: NextRequest) {
  const body = await parse(req);
  const data = schema.parse(body); // Typed as { name: string }
  // ...
}
```

### App (MVI)

```kotlin
sealed interface ScreenIntent {
    data object Refresh : ScreenIntent
    data class Submit(val value: String) : ScreenIntent
}
class ScreenViewModel : ViewModel() {
    fun onIntent(intent: ScreenIntent) { ... }
}
```
