---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Administrator unticks a granted role and saves",
      "kind": "actor",
      "actor": "administrator",
      "entities": [
        {
          "entity": "account",
          "effect": "reads",
          "facts": [
            "Granted roles"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::administration::accounts"
        }
      }
    },
    {
      "text": "The Product revokes the grant; the account keeps what the identity provider or the seat gives",
      "kind": "product",
      "actor": "administrator",
      "entities": [
        {
          "entity": "account",
          "effect": "changes",
          "facts": [
            "Granted roles"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::administration::accounts"
        }
      }
    }
  ]
}
---

# Revoke a role

## Trigger

Someone no longer hosts or administers.

## Outcome

The grant is gone; with nothing else, the account takes part as a participant.
