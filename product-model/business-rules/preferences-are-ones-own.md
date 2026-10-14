---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "account",
      "effect": "changes",
      "facts": [
        "Interface language",
        "Participant access at launch"
      ]
    }
  ],
  "permits": [
    {
      "related": [
        {
          "verb": "holds",
          "entity": "participant"
        }
      ]
    },
    {
      "related": [
        {
          "verb": "holds",
          "entity": "host"
        }
      ]
    },
    {
      "related": [
        {
          "verb": "holds",
          "entity": "administrator"
        }
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/me/me.controller.ts"
    }
  ]
}
---

# A person changes only their own preferences

Interface language and participant access at launch are changed by the account's own holder.
