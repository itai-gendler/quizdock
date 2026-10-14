---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "participant-result",
      "effect": "reads",
      "facts": [
        "Nickname",
        "Rank",
        "Score",
        "Right answers",
        "Answers given",
        "Average time",
        "Longest streak"
      ]
    }
  ],
  "permits": [
    {
      "related": [
        {
          "verb": "lists",
          "entity": "session"
        },
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
      "target": "apps/backend/src/quizzes/quizzes.service.ts",
      "title": "sessionPlayerDetail"
    }
  ]
}
---

# A quiz's owner or an administrator reads its participants' results

Participants' results are read with their session, by the quiz's owner and administrators.
