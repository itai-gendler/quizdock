---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    }
  ],
  "domain": "my-quizzes",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/editor-page.tsx",
      "title": "saveSettings"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts",
      "title": "update"
    }
  ]
}
---

# Edit a quiz

The owner changes a quiz's settings: title, description, language, cover, tags, licence, whether participants may rate it, its sound settings and its theme.
