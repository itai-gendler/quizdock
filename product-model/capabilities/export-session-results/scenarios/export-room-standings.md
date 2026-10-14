---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Export standings (CSV) on a gathering",
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
      "text": "The Product downloads the room's standings",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "participant-result",
          "effect": "reads",
          "facts": [
            "Nickname",
            "Score",
            "Right answers",
            "Answers given"
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
      }
    }
  ]
}
---

# Export a room's standings

## Trigger

A host keeps a series' result.

## Outcome

They have the standings as a spreadsheet.
