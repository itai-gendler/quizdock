---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    }
  ],
  "domain": "sessions",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/sessions-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/lib/csv.ts"
    }
  ]
}
---

# Export results

A host downloads results as a CSV file: a session's ranking, a room's standings, or one participant's answers.
