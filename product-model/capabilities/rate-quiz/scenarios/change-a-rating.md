---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Participant sends a rating again for what they played",
      "kind": "actor",
      "actor": "participant",
      "entities": [],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      }
    },
    {
      "text": "The Product replaces their earlier rating",
      "kind": "product",
      "actor": "participant",
      "entities": [
        {
          "entity": "review",
          "effect": "changes",
          "facts": [
            "Rating",
            "Comment"
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

# Change one's rating

## Trigger

A participant changes their mind.

## Outcome

One review per participant and quiz stays, the latest.
