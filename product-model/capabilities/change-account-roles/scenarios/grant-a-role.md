---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Administrator opens an account's roles, ticks Host or Administrator and saves",
      "kind": "actor",
      "actor": "administrator",
      "entities": [
        {
          "entity": "account",
          "effect": "reads",
          "facts": [
            "Display name",
            "Roles",
            "Granted roles"
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
          "place": "quizdock-web::administration::accounts"
        }
      }
    },
    {
      "text": "The Product grants the roles; the account holds them from its next request",
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

# Grant a role

## Trigger

Someone needs to host, or to administer the instance.

## Outcome

The account holds the roles ticked; a granted role survives an expired seat or claims that stop carrying it.

## Edge cases

- In local mode the administration changes nothing without the operator's administration token.
