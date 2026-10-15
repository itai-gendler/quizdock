---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses to save the gathering for later launches",
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
          "place": "quizdock-web::archived-room"
        }
      }
    },
    {
      "text": "The Product creates a selection of the room's kept quizzes in order, each paced by hand",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "creates",
          "facts": [
            "Name",
            "Quizzes"
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
          "place": "quizdock-web::archived-room"
        }
      }
    }
  ]
}
---

# Save from Sessions

## Trigger

A host forgot to save the room live.

## Outcome

The selection is among theirs.
