---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host opens Sessions",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::sessions"
        }
      }
    },
    {
      "text": "The Product lists their kept sessions, latest first, a room that kept several quizzes as one line",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Room name",
            "Started",
            "Ended",
            "Participant count",
            "Quiz as played"
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
          "place": "quizdock-web::workspace::sessions"
        }
      }
    }
  ]
}
---

# Browse sessions room by room

## Trigger

A host looks for past results.

## Outcome

They open a room or a session to read its results.
