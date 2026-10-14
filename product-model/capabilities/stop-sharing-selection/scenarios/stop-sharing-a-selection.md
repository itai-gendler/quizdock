---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host turns off Share with the instance's other hosts",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "reads",
          "facts": [
            "Shared"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selection"
        }
      }
    },
    {
      "text": "The Product makes it private again",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "changes",
          "facts": [
            "Shared"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selection"
        }
      }
    }
  ]
}
---

# Stop sharing a selection

## Trigger

A selection was meant for its owner only.

## Outcome

Other hosts no longer see it; the selections they created from it stay theirs.
