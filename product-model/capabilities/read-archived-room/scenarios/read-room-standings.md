---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host opens a gathering in Sessions",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Room name"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::sessions"
        }
      }
    },
    {
      "text": "The Product shows the room's kept quizzes in order and its standings summed per nickname",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Room name",
            "Quiz as played",
            "Started"
          ]
        },
        {
          "entity": "participant-result",
          "effect": "reads",
          "facts": [
            "Nickname",
            "Score",
            "Right answers",
            "Answers given",
            "Average time",
            "Longest streak"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "room",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::archived-room"
        }
      }
    }
  ]
}
---

# Read a room's standings

## Trigger

A host wants the result of an evening of quizzes.

## Outcome

They see who won the series.

## Edge cases

- The standings count only the quizzes kept, so they may differ from those seen live.
