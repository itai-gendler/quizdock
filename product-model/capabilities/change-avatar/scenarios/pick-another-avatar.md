---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The game is in its lobby",
      "kind": "condition",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Current step"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      },
      "actor": "participant"
    },
    {
      "text": "The Participant draws another avatar and saves it",
      "kind": "actor",
      "actor": "participant",
      "entities": [
        {
          "entity": "player",
          "effect": "reads",
          "facts": [
            "Avatar"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      }
    },
    {
      "text": "The Product shows it to the whole room",
      "kind": "product",
      "actor": "participant",
      "entities": [
        {
          "entity": "player",
          "effect": "changes",
          "facts": [
            "Avatar"
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
          "place": "quizdock-web::public::participant-view"
        }
      }
    }
  ]
}
---

# Pick another avatar

## Trigger

A participant wants another picture.

## Outcome

Their new avatar shows in the lobby, the leaderboard and the podium.

## Edge cases

- Once the quiz has started the avatar no longer changes.
