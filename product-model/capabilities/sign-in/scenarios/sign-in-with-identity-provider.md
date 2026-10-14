---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "Authentication mode is Identity provider",
      "kind": "condition",
      "entities": [
        {
          "entity": "instance-settings",
          "effect": "reads",
          "facts": [
            "Authentication mode"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::sign-in"
        }
      },
      "actor": "visitor"
    },
    {
      "text": "The Visitor chooses to sign in and signs in at the identity provider",
      "kind": "actor",
      "actor": "visitor",
      "entities": [],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::sign-in"
        }
      }
    },
    {
      "text": "The Product signs them in, keeping the name, address and roles the provider gives along with the roles granted to their account",
      "kind": "product",
      "actor": "visitor",
      "entities": [
        {
          "entity": "account",
          "effect": "changes",
          "facts": [
            "Display name",
            "Email",
            "Roles"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::sign-in"
        }
      }
    }
  ]
}
---

# Sign in through the identity provider

## Trigger

Someone opens the host area, or a room that requires an account, on an instance that signs in through an identity provider.

## Outcome

They are signed in: a host or an administrator reaches their area, and a participant goes back to the room they were joining.

## Edge cases

- Sign-in that does not go through says so and offers to try again.
- The roles come from the provider's claims; a role granted from the administration adds to them and survives claims that stop carrying it.
