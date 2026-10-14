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
      "target": "apps/backend/src/selections/selections.service.ts",
      "title": "duplicate"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/selection-page.tsx"
    }
  ]
}
---

# Create a selection from a shared selection

A host makes their own selection from one another host shares: it refers to the same quizzes they may read, copying none, with nothing linking the two afterwards.
