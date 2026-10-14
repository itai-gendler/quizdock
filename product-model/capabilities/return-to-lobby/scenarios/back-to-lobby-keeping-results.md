---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The quiz is at its podium",
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
      "text": "The Host chooses Back to the lobby with Archive this quiz's results ticked",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Name"
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
    },
    {
      "text": "The Product keeps the session, ends the quiz and opens the room's lobby with no quiz picked; players stay",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "creates",
          "to": "Ended",
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
        },
        {
          "entity": "participant-result",
          "effect": "creates",
          "facts": [
            "Nickname",
            "Rank",
            "Score",
            "Right answers",
            "Answers given",
            "Average time",
            "Longest streak"
          ],
          "with": "session"
        },
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
            "Pace"
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
        },
        {
          "entity": "player",
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

# Back to the lobby, keeping the results

## Trigger

The room plays another quiz.

## Outcome

The session is in History; the phones show the room's standings and wait for the next quiz, and the host chooses it.
