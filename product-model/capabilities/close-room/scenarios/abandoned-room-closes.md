---
{
  "kind": "edge",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The game has waited two minutes for its host",
      "kind": "condition",
      "unattended": true,
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Current step"
          ]
        },
        {
          "entity": "host",
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
      "text": "The Product keeps what was played as an interrupted session, ends the game and closes the room",
      "kind": "product",
      "entities": [
        {
          "entity": "session",
          "effect": "creates",
          "to": "Interrupted",
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
          "from": "Waiting for the host",
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

# A room whose host does not come back

## Trigger

The host never came back.

## Outcome

Every device is told the room is closed; what was played is in the host's History, marked interrupted.

## Edge cases

- A game of another host's shared quiz keeps nothing here either.
