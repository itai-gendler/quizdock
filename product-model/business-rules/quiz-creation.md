---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "quiz",
      "effect": "creates"
    }
  ],
  "permits": [
    {
      "actors": [
        "host"
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts"
    }
  ]
}
---

# A host creates quizzes

Creating a quiz — blank, imported or copied — belongs to hosts; the quiz is theirs.
