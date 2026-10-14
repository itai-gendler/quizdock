---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "One of the room's sessions was played without personalised tracking",
      "kind": "condition",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Personalised tracking"
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
          "place": "quizdock-web::workspace::archived-room"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host opens the gathering",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Room name"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::archived-room"
        }
      }
    },
    {
      "text": "The Product lists its quizzes and says there are no standings",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Quiz as played"
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
          "place": "quizdock-web::workspace::archived-room"
        }
      }
    }
  ]
}
---

# A room without standings

## Trigger

Not every quiz of the room tracked participants.

## Outcome

No standings are summed.
