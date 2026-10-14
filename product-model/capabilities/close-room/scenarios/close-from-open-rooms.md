---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses End on one of their rooms in Open rooms, and confirms",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "PIN",
            "Name"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::open-rooms"
        }
      }
    },
    {
      "text": "The Product ends its game and closes it, keeping nothing",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "from": "Lobby",
          "to": "Ended",
          "facts": []
        },
        {
          "entity": "room",
          "effect": "changes",
          "from": "Open",
          "to": "Closed",
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

# Close a room from Open rooms

## Trigger

A host finds a room left open.

## Outcome

The room is closed without opening its console.
