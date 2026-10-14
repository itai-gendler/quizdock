---
{
  "entities": [
    {
      "entity": "session",
      "shows": [
        "Quiz as played",
        "Room name",
        "PIN",
        "Started",
        "Ended",
        "Participant count",
        "Success rate",
        "Personalised tracking",
        "Full answer capture",
        "Question results"
      ]
    },
    {
      "entity": "participant-result",
      "shows": [
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
  "entryPoints": [
    {
      "quizdock-web": "/quizzes/:quizId/history/:sessionId"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/sessions-page.tsx",
      "title": "SessionDetailPage"
    }
  ]
}
---

# Session

One kept session: its figures, the results by question and the participants' results, and — when its room kept other quizzes — the room's quizzes and standings.
