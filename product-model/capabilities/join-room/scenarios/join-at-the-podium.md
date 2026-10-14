---
{
  "kind": "alternative",
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
          "place": "quizdock-web::public::join"
        }
      },
      "actor": "participant"
    },
    {
      "text": "The Participant joins",
      "kind": "actor",
      "actor": "participant",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Name"
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
      "text": "The Product seats them in the room to play from the next quiz",
      "kind": "product",
      "actor": "participant",
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
          "place": "quizdock-web::public::participant-view"
        }
      }
    }
  ]
}
---

# Join while a quiz is at its podium

## Trigger

Someone arrives between two quizzes.

## Outcome

They wait for the next quiz; joining during a quiz instead lets them answer from the question on screen.
