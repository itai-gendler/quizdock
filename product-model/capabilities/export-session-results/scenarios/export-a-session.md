---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Export (CSV) on a session",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "PIN"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::session"
        }
      }
    },
    {
      "text": "The Product downloads each participant's rank, nickname, score, right answers, answers given, longest streak and average time",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "participant-result",
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
        },
        {
          "entity": "participant",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "answer",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::session"
        }
      }
    }
  ]
}
---

# Export a session's results

## Trigger

Results feed a follow-up or an HR system.

## Outcome

The host has the session's ranking as a spreadsheet.
