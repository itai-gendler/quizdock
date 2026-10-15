---
{
  "entities": [
    {
      "entity": "quiz",
      "shows": [
        "Title",
        "Description",
        "Language",
        "Cover",
        "Tags",
        "Licence",
        "Question count",
        "Owner",
        "Updated",
        "Shared"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/quizzes"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/dashboard-page.tsx"
    }
  ]
}
---

# My quizzes

A host's quizzes and those other hosts share, as a list or a grid, filtered by status, owner, language and tags; for an administrator, every quiz of the instance.
