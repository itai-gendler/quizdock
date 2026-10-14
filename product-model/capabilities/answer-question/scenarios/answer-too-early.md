---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The question is still being read, or its sound is still playing before a listen-first question",
      "kind": "condition",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Current step"
          ]
        },
        {
          "entity": "question",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      },
      "actor": "participant"
    },
    {
      "text": "The Participant submits an answer",
      "kind": "actor",
      "actor": "participant",
      "entities": [
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Prompt"
          ]
        },
        {
          "entity": "answer",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      }
    },
    {
      "text": "The Product refuses it as too early and lets them answer again",
      "kind": "product",
      "actor": "participant",
      "entities": [
        {
          "entity": "answer",
          "effect": "reads",
          "facts": []
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

# An answer before the answers open

## Trigger

A participant answers during the reading time.

## Outcome

Their answer is not counted; they answer again once the answers open.
