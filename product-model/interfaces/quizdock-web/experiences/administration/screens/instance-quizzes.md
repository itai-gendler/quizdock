---
{
  "entities": [
    {
      "entity": "quiz",
      "shows": [
        "Title",
        "Owner",
        "Updated",
        "Question count"
      ],
      "collects": [
        "Owner"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/admin/quizzes"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/admin/admin-quizzes-page.tsx"
    }
  ]
}
---

# Quizzes

Every quiz of the instance, whoever owns it, with what an administrator may do to it.
