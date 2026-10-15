---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host deletes the selection and confirms",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "reads",
          "facts": [
            "Name"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::selections"
        }
      }
    },
    {
      "text": "The Product deletes it; its sessions stay in History without it",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "removes"
        },
        {
          "entity": "session",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::selections"
        }
      }
    }
  ]
}
---

# Delete a selection

## Trigger

A selection is no longer needed.

## Outcome

It is gone; nothing it pointed at is touched.
