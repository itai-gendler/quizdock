---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The game is in its lobby",
      "kind": "condition",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Current step"
          ]
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
      "text": "The Participant chooses I'm ready",
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
      "text": "The Product counts them ready on the console and the projection",
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

# Say one is ready

## Trigger

A participant is set to play.

## Outcome

They are ready for this quiz; each quiz of the room asks again.

## Edge cases

- Being ready never starts a first quiz: the host does.
