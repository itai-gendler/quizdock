---
{
  "kind": "edge",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "A device that plays the next question's sound or video has not loaded it",
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
    },
    {
      "text": "The Product holds the room until every such device has loaded it",
      "kind": "product",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "from": "Leaderboard",
          "to": "Waiting for media",
          "facts": [
            "Current step"
          ]
        },
        {
          "entity": "room",
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
      "text": "The Product shows the question once they are ready, or after ten seconds at most",
      "kind": "product",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "from": "Waiting for media",
          "to": "Question",
          "facts": [
            "Time left"
          ]
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

# Wait for a device still loading

## Trigger

A question with media comes up and a phone or the projection is slow.

## Outcome

The question starts everywhere at the same instant.
