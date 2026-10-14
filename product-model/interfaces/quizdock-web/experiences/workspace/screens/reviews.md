---
{
  "entities": [
    {
      "entity": "quiz",
      "shows": [
        "Title"
      ]
    },
    {
      "entity": "review",
      "shows": [
        "Rating",
        "Comment",
        "Nickname",
        "Date"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/quizzes/:quizId/reviews"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/feedback-page.tsx"
    }
  ]
}
---

# Reviews

The ratings participants gave a quiz: the average, the distribution and each review, filtered by rating.
