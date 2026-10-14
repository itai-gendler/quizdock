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
      "text": "The Host chooses Close the room with Archive this quiz's results ticked, and confirms",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "PIN"
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
      "text": "The Product keeps the session with its results, ends the game and closes the room",
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
          "from": "Podium",
          "to": "Ended",
          "facts": []
        },
        {
          "entity": "room",
          "effect": "changes",
          "from": "Open",
          "to": "Closed",
          "facts": [
            "Standings"
          ]
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

# Close the room and keep the results

## Trigger

The session is over.

## Outcome

The phones and the projection say the room is closed; the session is in History, and the room's closing standings were shown.

## Edge cases

- Results are kept only when the game kept answers: a room closed before anyone answered keeps nothing.
- A game of another host's shared quiz keeps nothing, whatever is ticked.
- A quiz deleted meanwhile cannot be kept: the room closes and says so.
- An idle room expires four hours after it was last used.
