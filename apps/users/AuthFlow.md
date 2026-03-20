# Auth & Onboarding Flow (Users App)

This document describes how authentication and onboarding are set up and how they connect to the main **(tabs)** app.

---

## Route structure

```
app/
  index.tsx              ← Entry: checks token, redirects to (auth) or (tabs)
  _layout.tsx            ← Root Stack: index → (auth) → (tabs) → modal

  (auth)/                 ← Auth group (Stack, no header)
    _layout.tsx
    splash.tsx            ← Splash (1.5s then → onboarding)
    onboarding.tsx        ← Onboarding → "Get started" → login
    login.tsx             ← Login; links to sign-up, forgot-password; "Sign in" → (tabs)
    sign-up.tsx           ← Sign up; "Sign in" → back to login
    forgot-password.tsx   ← Step 1: email; → verify-reset
    verify-reset.tsx      ← Step 2: code/token; → new-password
    new-password.tsx      ← Step 3: new + confirm; → reset-success
    reset-success.tsx     ← Success; "Sign in" → login

  (tabs)/                 ← Main app (after auth)
    _layout.tsx           ← Tab navigator
    index.tsx              ← Home
    explore.tsx           ← Explore

  modal.tsx               ← Modal screen
```

---

## Flow overview

### 1. App launch (`app/index.tsx`)

- Reads `token` from **expo-secure-store** (key: `"token"`).
- Uses `isTokenExpired(token)` from `@repo/ui/graphql` to validate.
- **If valid token:** `router.replace('/(tabs)')` → user goes to the main app.
- **If no token or expired:** `router.replace('/(auth)/splash')` → user goes to auth.

So the **only** gate between “logged out” and “logged in” is the token in secure store. The **(tabs)** folder is the authenticated area; **(auth)** is the unauthenticated area.

### 2. Auth flow (unauthenticated)

| Step | Screen | Action |
|------|--------|--------|
| 1 | **Splash** | Shows “Medoraa”; after 1.5s auto-navigates to onboarding. |
| 2 | **Onboarding** | “Get started” → replaces stack with **login**. |
| 3 | **Login** | “Sign up” → sign-up; “Forgot password?” → forgot-password; “Sign in (demo)” → **(tabs)**. (In production, “Sign in” calls API, then `setLogInHandler(accessToken)` and `router.replace('/(tabs)')`.) |
| 4 | **Sign up** | “Already have an account? Sign in” → back to login. (In production, form submits → `setLogInHandler` → `router.replace('/(tabs)')`.) |
| 5 | **Forgot password** | Enter email → “Next” → **verify-reset**; “Back to login” → login. |
| 6 | **Verify reset** | Enter code/token → “Continue” → **new-password**. |
| 7 | **New password** | New + confirm password → “Submit” → **reset-success**. |
| 8 | **Reset success** | “Sign in” → **login**. |

All of these live under the **(auth)** group. Navigation within auth uses `router.push()` or `router.replace()` so the user can move through onboarding → login → sign-up / forgot-password → reset steps without ever seeing **(tabs)** until they have a valid token.

### 3. Main app (authenticated)

- After a successful login or sign-up (and storing the token with `setLogInHandler`), the app sends the user to **`/(tabs)`**.
- **(tabs)** contains the main tab UI (Home, Explore, etc.). Only users who passed the `index.tsx` check (valid token) or who just logged in land here.
- Logout (when implemented) should call `onUserSignOut()` from `@repo/ui/graphql` and then `router.replace('/(auth)/login')` so the next time the app is opened, `index.tsx` will again send them to **(auth)/splash** (no token).

---

## How it’s wired with (tabs)

- **Entry:** `app/index.tsx` is the single decision point: token valid → **(tabs)**, else → **(auth)/splash**.
- **Root layout:** `app/_layout.tsx` defines a Stack with, in order: `index`, `(auth)`, `(tabs)`, `modal`. The app opens on `index`; `index` then redirects and never shows itself again (except briefly as a loading state).
- **Auth → app:** From login (or sign-up), after storing the token you call `router.replace('/(tabs)')`. That replaces the current route with the tab navigator; the user cannot go back into auth with the back button.
- **App → auth:** On logout, clear token with `onUserSignOut()` and `router.replace('/(auth)/login')`. Next cold start will hit `index.tsx` and, because there’s no token, redirect to `/(auth)/splash`.

So **(tabs)** is the “logged-in” shell; **(auth)** is the “logged-out” shell, and `index.tsx` plus token storage connect the two.

---

## API integration (existing)

- **Token storage:** `setLogInHandler(token)` and `onUserSignOut()` in `@repo/ui/graphql` (uses expo-secure-store).
- **Token check:** `isTokenExpired(token)` from `@repo/ui/graphql`.
- **Mutations (in `@repo/ui`):** `useLoginMutation`, `useSignUpMutation`, `useForgotPasswordMutation`, `useResetPasswordMutation`. Use these in the corresponding **(auth)** screens; on success, store the token and redirect to `/(tabs)` (login/sign-up) or to the next reset step (forgot flow).

---

## Optional: onboarding seen flag

To show onboarding only on first install, you can:

- Store a flag (e.g. `hasSeenOnboarding` in secure store or AsyncStorage) when the user leaves onboarding.
- In `index.tsx`: if no token and **no** `hasSeenOnboarding` → `/(auth)/splash`; if no token but **has** `hasSeenOnboarding` → `/(auth)/login`; if token → `/(tabs)`.

That keeps the same route structure and only changes the first redirect target for unauthenticated users.