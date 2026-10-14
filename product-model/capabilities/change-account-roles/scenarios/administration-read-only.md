---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "Web administration scope is Read",
      "kind": "condition",
      "entities": [
        {
          "entity": "instance-settings",
          "effect": "reads",
          "facts": [
            "Web administration scope"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::administration::accounts"
        }
      },
      "actor": "administrator"
    },
    {
      "text": "The Administrator opens an account's actions",
      "kind": "actor",
      "actor": "administrator",
      "entities": [
        {
          "entity": "account",
          "effect": "reads",
          "facts": [
            "Roles"
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
      "text": "The Product offers no role change and says the operator keeps the administration read-only",
      "kind": "product",
      "actor": "administrator",
      "entities": [],
      "contexts": {
        "web": {
          "place": "quizdock-web::administration::accounts"
        }
      }
    }
  ]
}
---

# The administration only shows the instance

## Trigger

The operator set the web administration to read only.

## Outcome

Roles are changed only by the operator's command line.
