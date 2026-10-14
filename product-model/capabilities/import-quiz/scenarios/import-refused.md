---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host picks a file that is too large or is not a bundle",
      "kind": "actor",
      "actor": "host",
      "entities": [],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::my-quizzes"
        }
      }
    },
    {
      "text": "The Product creates nothing and says why",
      "kind": "product",
      "actor": "host",
      "entities": [],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::my-quizzes"
        }
      }
    }
  ]
}
---

# A file that cannot be imported

## Trigger

A host picks the wrong file.

## Outcome

No quiz is created.
