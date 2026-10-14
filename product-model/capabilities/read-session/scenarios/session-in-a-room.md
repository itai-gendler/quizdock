---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The room kept other quizzes too",
      "kind": "condition",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Room name"
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
          "place": "quizdock-web::workspace::session"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host opens the session",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Started"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::session"
        }
      }
    },
    {
      "text": "The Product adds the room's kept quizzes in order and its standings summed over them",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Room name",
            "Quiz as played"
          ]
        },
        {
          "entity": "participant-result",
          "effect": "reads",
          "facts": [
            "Nickname",
            "Score"
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
          "place": "quizdock-web::workspace::session"
        }
      }
    }
  ]
}
---

# A session played in a room of several quizzes

## Trigger

A host reads a quiz played as part of a series.

## Outcome

They see the session within its room.
