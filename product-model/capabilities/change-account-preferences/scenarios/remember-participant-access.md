---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host picks Always accounts required or Always open access",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "account",
          "effect": "reads",
          "facts": [
            "Participant access at launch"
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
      "text": "The Product keeps the choice; their next launches use it without asking",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "account",
          "effect": "changes",
          "facts": [
            "Participant access at launch"
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

# Remember the participant access for launches

## Trigger

A host on an instance where rooms may be opened to guests no longer wants to be asked at each launch.

## Outcome

Launches open rooms with that access at once; picking Ask brings the question back.
