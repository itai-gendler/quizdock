---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Participant chooses Log out",
      "kind": "actor",
      "actor": "participant",
      "entities": [],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace"
        }
      }
    },
    {
      "text": "The Product ends their sign-in on this browser",
      "kind": "product",
      "actor": "participant",
      "entities": [],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace"
        }
      }
    }
  ]
}
---

# Log out

## Trigger

A signed-in person is done.

## Outcome

They are signed out and back on the public pages.
