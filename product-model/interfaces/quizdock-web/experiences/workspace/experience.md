---
{
  "actors": [
    "participant",
    "host",
    "administrator"
  ],
  "access": "authenticated",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/router.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/auth.guard.ts"
    }
  ]
}
---

# Host area

Where signed-in people work: hosts build their quizzes and selections, present them from the console, and read their History; administrators read the whole instance there. Every signed-in person reaches their own account and preferences.
