---
{
  "availability": [
    {
      "place": "quizdock-web"
    }
  ],
  "domain": "selections",
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
      "target": "apps/frontend/src/routes/selection-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/selections/selections.service.ts",
      "title": "update"
    }
  ]
}
---

# Edit a selection

The owner changes a selection's name and description, the order of its quizzes and each quiz's pace and whether it starts on its own.
