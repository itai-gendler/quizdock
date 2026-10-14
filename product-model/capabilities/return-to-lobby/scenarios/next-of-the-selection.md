---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The room was opened from a selection that has a quiz left to play",
      "kind": "condition",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "as": "current",
          "facts": [
            "Current step"
          ]
        },
        {
          "entity": "selection",
          "effect": "reads",
          "facts": [
            "Quizzes"
          ]
        },
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Selection",
            "Played quizzes"
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
      },
      "actor": "host"
    },
    {
      "text": "The Host chooses Back to the lobby",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "reads",
          "facts": [
            "Name",
            "Quizzes"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      }
    },
    {
      "text": "The Product opens the selection's next quiz not played yet, with its pace, counting down when it starts on its own",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "as": "current",
          "from": "Podium",
          "to": "Ended",
          "facts": []
        },
        {
          "entity": "game",
          "effect": "creates",
          "as": "next",
          "to": "Lobby",
          "facts": [
            "Quiz played",
            "Pace",
            "Keeps results",
            "Starts on its own at"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "selection",
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

# The selection's next quiz

## Trigger

A room plays a selection.

## Outcome

The lobby says what comes next and where it stands in the selection ("3 of 5"); the host may still change the quiz.

## Edge cases

- A quiz of the selection that cannot be played is skipped; with none left, the lobby waits for the host's choice.
