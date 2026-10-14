---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Administrator opens Sessions",
      "kind": "actor",
      "actor": "administrator",
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
      "text": "The Product lists every kept session of the instance with its host",
      "kind": "product",
      "actor": "administrator",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Room name",
            "Started",
            "Participant count"
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
          "place": "quizdock-web::workspace::sessions"
        }
      }
    }
  ]
}
---

# An administrator browses every host's sessions

## Trigger

An administrator oversees what is played.

## Outcome

They read every session, read-only.
