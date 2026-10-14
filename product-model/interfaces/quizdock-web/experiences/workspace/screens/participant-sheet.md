---
{
  "entities": [
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
    },
    {
      "entity": "answer",
      "shows": [
        "Value",
        "Correct",
        "Points awarded",
        "Response time"
      ]
    },
    {
      "entity": "session",
      "shows": [
        "Full answer capture"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/quizzes/:quizId/history/:sessionId/players/:playerResultId"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/sessions-page.tsx",
      "title": "SessionPlayerPage"
    }
  ]
}
---

# Participant sheet

One participant's result in a session and, when every answer was kept, their answer to each question.
