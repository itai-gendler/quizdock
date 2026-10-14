---
{
  "kind": "primary",
  "result": "achieved",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Participant types the PIN, picks a nickname and joins",
      "kind": "actor",
      "actor": "participant",
      "capability": "join-room",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "PIN"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::join"
        }
      }
    },
    {
      "text": "The Product seats them and shows the step being played",
      "kind": "product",
      "actor": "participant",
      "capability": "join-room",
      "entities": [
        {
          "entity": "player",
          "effect": "creates",
          "to": "Connected",
          "facts": [
            "Nickname",
            "Avatar",
            "Presence",
            "Ready",
            "Score",
            "Joined at"
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
      "text": "The Participant answers the question on screen",
      "kind": "actor",
      "actor": "participant",
      "capability": "answer-question",
      "entities": [
        {
          "entity": "answer",
          "effect": "creates",
          "facts": [
            "Value",
            "Correct",
            "Credit",
            "Points awarded",
            "Response time"
          ]
        },
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Prompt"
          ]
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

# Join, then answer

## Trigger

Someone is invited into a room with its PIN or QR code.

## Outcome

The participant lands on the step being played and answers the question on screen.
