---
{
  "kind": "person",
  "acts": "external",
  "relations": [
    {
      "entity": "quiz",
      "verb": "owns",
      "cardinality": "one-to-many"
    },
    {
      "entity": "selection",
      "verb": "owns",
      "cardinality": "one-to-many"
    },
    {
      "entity": "room",
      "verb": "hosts",
      "cardinality": "one-to-many"
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
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-METIER.md",
      "title": "Who may host — the roles"
    }
  ]
}
---

# Host

The role that builds quizzes and presents them: a host keeps their own bank of quizzes and selections, runs rooms and reads the results of their quizzes. The role is granted by the operator or the identity provider, or, in local mode, by holding the host seat.
