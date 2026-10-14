---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Participant picks an interface language on My account",
      "kind": "actor",
      "actor": "participant",
      "entities": [
        {
          "entity": "account",
          "effect": "reads",
          "facts": [
            "Interface language"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::my-account"
        }
      }
    },
    {
      "text": "The Product keeps it with their account and shows their screens in it",
      "kind": "product",
      "actor": "participant",
      "entities": [
        {
          "entity": "account",
          "effect": "changes",
          "facts": [
            "Interface language"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::my-account"
        }
      }
    }
  ]
}
---

# Change the interface language

## Trigger

Someone prefers another language than the instance's.

## Outcome

Their own screens use it on every device they sign in from; a room's projection still speaks the quiz's or the room's language.
