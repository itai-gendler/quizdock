---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host opens the selection's launches",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "reads",
          "facts": [
            "Name"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::selection"
        }
      }
    },
    {
      "text": "The Product lists each launch kept, latest first, read from its sessions: its date, how many took part and each quiz played with its success rate",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Room name",
            "Started",
            "Participant count",
            "Success rate"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::selection"
        }
      }
    }
  ]
}
---

# Read a selection's launches

## Trigger

A host compares groups that played the same series.

## Outcome

They see how each group did, quiz by quiz.

## Edge cases

- Only launches whose results were kept show; another host's launch of a shared selection never does.
