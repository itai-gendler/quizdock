---
{
  "availability": [
    {
      "place": "quizdock-web::administration"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/admin/admin-quizzes-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/admin/operations/cli-commands.operations.ts",
      "title": "quizzes.transfer"
    }
  ]
}
---

# Hand over a quiz

An administrator gives a quiz to another account; the media only it uses and its history follow it.
