---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "A quiz is being played",
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
      "text": "The Host chooses Stop the quiz with Keep what was played so far ticked",
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
      "text": "The Product keeps an interrupted session of the questions shown, ends the quiz and opens the lobby; it counts in the room's standings",
      "kind": "product",
      "actor": "host",
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
          "as": "current",
          "from": "Question",
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
          "entity": "room",
          "effect": "changes",
          "facts": [
            "Standings"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "question",
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

# Stop the quiz and keep what was played

## Trigger

Time runs out for the whole quiz.

## Outcome

History shows the session as interrupted, with the questions never reached marked not played.

## Edge cases

- If keeping the session fails, nothing moves and the quiz goes on, for the host to try again.
