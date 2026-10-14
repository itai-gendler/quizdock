---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "A quiz picked after another has its countdown over, or every connected participant is ready",
      "kind": "condition",
      "unattended": true,
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Starts on its own at",
            "Ready participants"
          ]
        },
        {
          "entity": "participant",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      }
    },
    {
      "text": "The Product starts the quiz",
      "kind": "product",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "from": "Lobby",
          "to": "Question",
          "facts": [
            "Current step",
            "Time left",
            "Starts on its own at"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      }
    }
  ]
}
---

# The next quiz starts on its own

## Trigger

The room plays several quizzes in a row.

## Outcome

The next quiz is under way without the host's click.
