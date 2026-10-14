---
{
  "kind": "person",
  "acts": "external",
  "relations": [
    {
      "entity": "account",
      "verb": "holds",
      "cardinality": "one-to-one"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/roles.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/auth.guard.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/admin/admin-layout.tsx"
    }
  ]
}
---

# Administrator

The role that oversees the instance: it reads every quiz, open room, session and review, and administers accounts and quizzes. It creates, edits and presents nothing on its own; an account holding both roles also hosts its own bank.
