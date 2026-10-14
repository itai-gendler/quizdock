---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "review",
      "effect": "reads",
      "facts": [
        "Rating",
        "Comment",
        "Nickname",
        "Date"
      ]
    }
  ],
  "permits": [
    {
      "related": [
        {
          "verb": "receives",
          "entity": "quiz"
        },
        {
          "verb": "owns",
          "entity": "host"
        }
      ]
    },
    {
      "actors": [
        "administrator"
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts",
      "title": "feedback"
    }
  ]
}
---

# A quiz's owner or an administrator reads its reviews

Reviews are read by the quiz's owner and by administrators, never by the reviewer's fellow participants.
