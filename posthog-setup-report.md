<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Subtrack Expo app.

**Changes made:**

- **`app.config.js`** (new) — Converts `app.json` to a dynamic config that injects `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` into `Constants.expoConfig.extra` at build time.
- **`libs/posthog.ts`** (new) — PostHog client instance configured via `expo-constants`. Disabled automatically if no token is set.
- **`app/_layout.tsx`** — Wrapped the app in `PostHogProvider` with touch autocapture enabled and manual screen tracking via `usePathname` + `useEffect`.
- **`hooks/useAuthSignUp.ts`** — Calls `posthog.identify()` and captures `user_signed_up` after email verification succeeds.
- **`hooks/useAuthSignIn.ts`** — Calls `posthog.identify()` and captures `user_signed_in` on successful sign-in (both direct and MFA paths).
- **`hooks/useAuthForgotPassword.ts`** — Captures `forgot_password_requested` when reset email is sent and `password_reset_completed` when the new password is saved.
- **`app/(tabs)/settings.tsx`** — Captures `user_signed_out` and calls `posthog.reset()` before signing out to cleanly end the session.
- **`app/(tabs)/index.tsx`** — Captures `subscription_card_expanded` with `subscription_id` and `subscription_name` when a card is tapped open.
- **`.env`** — PostHog token and host written via wizard-tools (never committed to git).
- **Packages installed** — `posthog-react-native`, `react-native-svg`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User completes email verification and finishes account creation | `hooks/useAuthSignUp.ts` |
| `user_signed_in` | User successfully signs in (password or MFA) | `hooks/useAuthSignIn.ts` |
| `user_signed_out` | User confirms and completes sign-out | `app/(tabs)/settings.tsx` |
| `forgot_password_requested` | User submits their email to start the password reset flow | `hooks/useAuthForgotPassword.ts` |
| `password_reset_completed` | User successfully sets a new password | `hooks/useAuthForgotPassword.ts` |
| `subscription_card_expanded` | User taps to expand a subscription card on the home screen | `app/(tabs)/index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/376530/dashboard/1471730
- **New Sign-ups Over Time:** https://us.posthog.com/project/376530/insights/cUKL2dtd
- **Sign-up to Sign-in Conversion Funnel:** https://us.posthog.com/project/376530/insights/ln5kM8zj
- **Password Reset Funnel:** https://us.posthog.com/project/376530/insights/Uk7MYeoY
- **Subscription Card Engagement:** https://us.posthog.com/project/376530/insights/NK4U01Fg
- **Sign-ins vs Sign-outs (Churn Signal):** https://us.posthog.com/project/376530/insights/0AycrexD

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
