---
{
  "kind": "configuration",
  "of": "capability-scenario",
  "settings": [
    {
      "entity": "instance-settings",
      "fact": "Authentication mode"
    }
  ],
  "takesEffect": "When a person signs in; the operator sets the mode in the instance's configuration.",
  "stability": "Accounts are told apart by how they signed in: a local name and an identity-provider account are different accounts, each keeping its own quizzes, selections and results.",
  "alternatives": [
    {
      "id": "sign-in-with-host-seat",
      "selectedWhen": "Authentication mode is Local, the default: people sign in with a name and one of them holds the host seat."
    },
    {
      "id": "sign-in-with-identity-provider",
      "selectedWhen": "Authentication mode is Identity provider: everyone signs in through the operator's OpenID Connect provider."
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/auth-mode.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/no-auth.provider.ts",
      "title": "localPrincipal"
    }
  ]
}
---

# Sign-in mode

An instance either runs with no identity provider — a name typed and a single host seat — or signs everyone in through the operator's OpenID Connect provider. Both are supported with the same image, so a classroom can start local and an organisation can plug in its provider.
