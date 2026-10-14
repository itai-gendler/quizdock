---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Administrator opens Open rooms",
      "kind": "actor",
      "actor": "administrator",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::open-rooms"
        }
      }
    },
    {
      "text": "The Product lists every open room of the instance with its host",
      "kind": "product",
      "actor": "administrator",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "PIN",
            "Name"
          ]
        },
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Quiz played",
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
          "place": "quizdock-web::workspace::open-rooms"
        }
      }
    }
  ]
}
---

# An administrator sees every open room

## Trigger

An administrator checks what is being played.

## Outcome

They see every room, read-only.
