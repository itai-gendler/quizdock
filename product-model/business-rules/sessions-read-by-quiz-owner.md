---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "session",
      "effect": "reads",
      "facts": [
        "Quiz as played",
        "Room name",
        "PIN",
        "Started",
        "Ended",
        "Participant count",
        "Success rate",
        "Personalised tracking",
        "Full answer capture",
        "Question results",
        "Selection",
        "Kept until"
      ]
    }
  ],
  "permits": [
    {
      "related": [
        {
          "verb": "is kept in",
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
      "target": "apps/backend/src/quizzes/quizzes.service.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/history.controller.ts"
    }
  ]
}
---

# A quiz's owner or an administrator reads its sessions

The sessions of a quiz are read by its owner — whoever hosted them — and by administrators.
