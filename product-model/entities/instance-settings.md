---
{
  "singleton": true,
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "packages/contracts/src/admin/settings.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/auth-mode.ts"
    }
  ]
}
---

# Instance settings

The settings the operator gives the instance, kept once, that change how people sign in and join.

## Information kept

- **Authentication mode** — Local, where people sign in with a typed name and one host seat, or Identity provider, where everyone signs in through the operator's OpenID Connect provider
- **Anonymous participants** — under Identity provider, whether hosts may open a room to participants without an account; off by default
- **Instance language** — the default interface language, and the language new quizzes start in
- **Public address** — the address invitations point at first, when configured
- **Web administration scope** — Read, where the administration only shows the instance, or Write
