---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host opens the quiz's Reviews",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title"
          ]
        },
        {
          "entity": "review",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::reviews"
        }
      }
    },
    {
      "text": "The Product shows the average, the distribution of stars and each review, latest first",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "review",
          "effect": "reads",
          "facts": [
            "Rating",
            "Comment",
            "Nickname",
            "Date"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::reviews"
        }
      }
    },
    {
      "text": "The Host narrows the reviews to one rating",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "review",
          "effect": "reads",
          "facts": [
            "Rating"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::reviews"
        }
      }
    }
  ]
}
---

# Read a quiz's reviews

## Trigger

A host wants to know how participants liked a quiz.

## Outcome

They read every rating and comment; reviews from another host's game show as anonymous.
