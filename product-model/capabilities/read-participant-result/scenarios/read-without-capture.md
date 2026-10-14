---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "Every answer was not kept",
      "kind": "condition",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Full answer capture"
          ]
        },
        {
          "entity": "answer",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::participant-sheet"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host opens a participant of the session",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "participant-result",
          "effect": "reads",
          "facts": [
            "Nickname"
          ]
        },
        {
          "entity": "participant",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "session",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::participant-sheet"
        }
      }
    },
    {
      "text": "The Product shows their result and says the answers were not kept",
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
          "entity": "answer",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::participant-sheet"
        }
      }
    }
  ]
}
---

# A participant's result without the answers

## Trigger

The session was played without full answer capture.

## Outcome

Only their totals are there.
