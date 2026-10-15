---
{
  "relations": [
    {
      "entity": "quiz",
      "verb": "lists",
      "cardinality": "many-to-many"
    }
  ],
  "references": [
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-SELECTION.md#2-decisions-taken",
      "title": "Selections brief: decisions taken"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/selections/selections.service.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/prisma/schema.prisma",
      "title": "Selection"
    }
  ],
  "domain": "selections"
}
---

# Selection

A host's named, saved list of quizzes to launch into a room in one go: after each quiz, the room's lobby picks the next one not played yet.

## Information kept

- **Name** — up to 60 characters
- **Description** — optional, up to 2,000 characters
- **Shared** — whether the instance's other hosts see it read-only, present it and copy it; off by default
- **Quizzes** — up to 50 quizzes in order, each once, each with its pace and whether it starts on its own after the lobby countdown
