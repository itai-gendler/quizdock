---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    }
  ],
  "domain": "selections",
  "references": [
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
