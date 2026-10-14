---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Participant chooses Not yet",
      "kind": "actor",
      "actor": "participant",
      "entities": [
        {
          "entity": "player",
          "effect": "reads",
          "facts": [
            "Ready"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      }
    },
    {
      "text": "The Product no longer counts them ready",
      "kind": "product",
      "actor": "participant",
      "entities": [
        {
          "entity": "player",
          "effect": "changes",
          "facts": [
            "Ready"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      }
    }
  ]
}
---

# Say not yet

## Trigger

A participant needs a moment.

## Outcome

The ready count drops by one.
