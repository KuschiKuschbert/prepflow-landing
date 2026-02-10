---
name: react-state-management
description: Master modern React state management with Redux Toolkit, Zustand, Jotai, and React Query. Use when setting up global state, managing server state, or choosing between state management solutions.
---

# React State Management

Comprehensive guide to modern React state management patterns, from local component state to global stores and server state synchronization.

## Do not use this skill when

- The task is unrelated to react state management
- You need a different domain or tool outside this scope

## Instructions

- Clarify goals, constraints, and required inputs.
- Apply relevant best practices and validate outcomes.
- Provide actionable steps and verification.
- If detailed examples are required, open `resources/implementation-playbook.md`.

## Use this skill when

- Setting up global state management in a React app
- Choosing between Redux Toolkit, Zustand, or Jotai
- Managing server state with React Query or SWR
- Implementing optimistic updates
- Debugging state-related issues
- Migrating from legacy Redux to modern patterns

## Core Concepts

### 1. State Categories

| Type             | Description                  | Solutions                     |
| ---------------- | ---------------------------- | ----------------------------- |
| **Local State**  | Component-specific, UI state | useState, useReducer          |
| **Global State** | Shared across components     | Redux Toolkit, Zustand, Jotai |
| **Server State** | Remote data, caching         | React Query, SWR, RTK Query   |
| **URL State**    | Route parameters, search     | React Router, nuqs            |
| **Form State**   | Input values, validation     | React Hook Form, Formik       |

### 2. Selection Criteria

```Small app, simple state → Zustand or Jotai
Large app, complex state → Redux Toolkit
Heavy server interaction → React Query + light client state
Atomic/granular updates → Jotai
```

## Quick Start

### Zustand (Simplest)

```typescript
// store/useStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  setUser: (user: User | null) => void
  toggleTheme: () => void
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        theme: 'light',
        setUser: (user) => set({ user }),
        toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      }),
      { name: 'app-storage' }
    )
  )
)

// Usage in component
function Header() {
  const { user, theme, toggleTheme } = useStore()
  return (
    <header className={theme}>
      {user?.name}
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  )
}
```

### Redux Toolkit (Enterprise)

```typescript
// features/counter/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

### React Query (Server State)

```typescript
// hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetch(`/api/users/${id}`).then(res => res.json()),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newUser: User) =>
      fetch('/api/user', { method: 'POST', body: JSON.stringify(newUser) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
```

## Best Practices

### 1. Keep State Local

Don't put everything in global state. If state is only used in one branch of the component tree, keep it local or lift it up to the nearest common ancestor.

### 2. Separate Server State

Don't store API data in Redux/Zustand unless you need to modify it extensively on the client. Use React Query or SWR for caching, deduping, and revalidation.

### 3. Use Selectors

Always derive data from state using selectors to prevent unnecessary re-renders.

```typescript
const userRole = useStore(state => state.user.role); // Good
const { user } = useStore(); // Bad: re-renders on any user change
```

### 4. Atomic Updates

Split large stores into smaller slices or atoms to minimize re-render scope.

### 5. URL as Source of Truth

Store filter, sort, and pagination state in the URL search params so the UI is shareable and bookmarkable.

## Resources

- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query/latest)
- [Jotai](https://jotai.org/)
