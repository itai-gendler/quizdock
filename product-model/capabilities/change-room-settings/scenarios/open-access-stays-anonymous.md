---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The room is in open access",
      "kind": "condition",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Participant access"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host tries to turn personalised tracking on",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Personalised tracking"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      }
    },
    {
      "text": "The Product refuses: guests have no account to track",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "account",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      }
    }
  ]
}
---

# Open access keeps no individual results

## Trigger

A host opened the room to guests.

## Outcome

Tracking stays off and participants keep typing their names.
