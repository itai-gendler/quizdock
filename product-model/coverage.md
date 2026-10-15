---
{
  "scope": "The Product Overview and the first domain, Selections: creating, editing and sharing selections, saving a room as one, presenting them and comparing their launches. The quizzes, rooms, games and sessions a selection acts on appear as far as selections need them; their own domains come next, one at a time.",
  "method": "Static reading of source, schema, migrations, specifications, documentation and tests at the pinned commit; nothing was run.",
  "covered": [
    {
      "description": "Selections: the backend service, access rules and controller.",
      "paths": [
        "apps/backend/src/selections/"
      ]
    },
    {
      "description": "The Selections and Selection pages, and the selection panel and Save as a selection in the console.",
      "paths": [
        "apps/frontend/src/routes/selections-page.tsx",
        "apps/frontend/src/routes/selection-page.tsx",
        "apps/frontend/src/game/room-components.tsx"
      ]
    }
  ],
  "exclusions": [
    {
      "description": "Automated tests, fixtures and load-test tooling.",
      "paths": [
        "apps/backend/test/",
        "tools/"
      ]
    },
    {
      "description": "Specifications, documentation, screenshots and branding assets.",
      "paths": [
        "specifications/",
        "docs/",
        "branding/"
      ]
    },
    {
      "description": "Packaging, deployment and repository tooling.",
      "paths": [
        "docker/",
        "env/",
        "keycloak/",
        ".github/",
        ".husky/",
        "quizdock",
        "Dockerfile",
        "Dockerfile.standalone",
        "docker-compose.yml",
        "docker-compose.prod.yml"
      ]
    },
    {
      "description": "Generated API client and API description.",
      "paths": [
        "apps/frontend/src/api/generated/",
        "apps/backend/openapi/"
      ]
    },
    {
      "description": "Design system components, styling and the frontend's visual helpers.",
      "paths": [
        "apps/frontend/src/components/ui/",
        "apps/frontend/src/index.css"
      ]
    }
  ],
  "unmapped": [
    {
      "description": "My quizzes: building, sharing, publishing, archiving and deleting quizzes, their questions and slides, import and export, preview and reviews. Not moved yet: a later domain.",
      "paths": [
        "apps/backend/src/quizzes/",
        "apps/backend/src/questions/",
        "apps/backend/src/slides/",
        "apps/frontend/src/routes/dashboard-page.tsx",
        "apps/frontend/src/routes/editor-page.tsx",
        "apps/frontend/src/routes/quiz-read-only.tsx",
        "apps/frontend/src/routes/question-form.tsx",
        "apps/frontend/src/routes/slide-form.tsx",
        "apps/frontend/src/routes/preview-page.tsx",
        "apps/frontend/src/routes/feedback-page.tsx",
        "apps/frontend/src/routes/use-copy-quiz.ts",
        "apps/frontend/src/routes/quiz-starter.ts"
      ]
    },
    {
      "description": "Open rooms: running a room from the console, joining and playing from a phone, the projection, scoring and room standings. Not moved yet: a later domain.",
      "paths": [
        "apps/backend/src/game/",
        "apps/frontend/src/game/",
        "apps/frontend/src/routes/join-page.tsx",
        "apps/frontend/src/routes/player-page.tsx",
        "apps/frontend/src/routes/screen-page.tsx",
        "apps/frontend/src/routes/control-page.tsx",
        "apps/frontend/src/routes/live-page.tsx",
        "packages/contracts/src/"
      ]
    },
    {
      "description": "Sessions: History, kept results, participant sheets and the CSV export. Not moved yet: a later domain.",
      "paths": [
        "apps/frontend/src/routes/history-page.tsx",
        "apps/frontend/src/routes/sessions-page.tsx"
      ]
    },
    {
      "description": "Accounts: sign-in, roles, the host seat, accounts and preferences, and their administration. Not moved yet: a later domain.",
      "paths": [
        "apps/backend/src/auth/",
        "apps/backend/src/users/",
        "apps/backend/src/me/",
        "apps/frontend/src/routes/profile-page.tsx",
        "apps/frontend/src/routes/login-page.tsx",
        "apps/frontend/src/routes/callback-page.tsx",
        "apps/frontend/src/routes/admin/"
      ]
    },
    {
      "description": "Media library, in-browser conversion, credits and media housekeeping: left out as a supporting area of authoring; a question's and a slide's media appear as their facts.",
      "paths": [
        "apps/backend/src/media/",
        "apps/frontend/src/routes/media-library-dialog.tsx",
        "apps/frontend/src/routes/media-upload.tsx",
        "apps/frontend/src/routes/question-media-field.tsx",
        "apps/frontend/src/routes/slide-media-field.tsx",
        "apps/frontend/src/routes/admin-media-page.tsx"
      ]
    },
    {
      "description": "Quiz themes and the instance's look: left out as presentation the model does not prescribe beyond a quiz's Theme fact.",
      "paths": [
        "apps/backend/src/themes/",
        "apps/backend/src/look/",
        "apps/frontend/src/routes/themes-page.tsx",
        "apps/frontend/src/routes/theme-editor-page.tsx",
        "apps/frontend/src/routes/builtin-theme-page.tsx",
        "apps/frontend/src/routes/quiz-theme-field.tsx"
      ]
    },
    {
      "description": "Template catalogue, the community store and publication export: left out as a sharing channel beside the core (copies offered to the instance or to an outside store).",
      "paths": [
        "apps/backend/src/store/",
        "apps/backend/src/quizzes/portable/quiz-publication.service.ts",
        "apps/frontend/src/routes/templates-page.tsx",
        "apps/frontend/src/routes/template-page.tsx",
        "apps/frontend/src/routes/community-page.tsx",
        "apps/frontend/src/routes/community-preview-page.tsx",
        "apps/frontend/src/routes/publication-export.tsx"
      ]
    },
    {
      "description": "The operator command line and the local MCP connector: left out as operator tooling that runs the same operations.",
      "paths": [
        "apps/backend/src/cli/",
        "apps/backend/src/cli.ts",
        "apps/backend/src/mcp/"
      ]
    },
    {
      "description": "Public demo mode and sample quizzes: left out as a showcase deployment and seed content.",
      "paths": [
        "apps/backend/src/demo/",
        "apps/backend/src/quizzes/samples/",
        "apps/backend/samples/"
      ]
    }
  ],
  "limitations": [
    {
      "description": "The quizzes, rooms, games and sessions appear only as far as selections act on them: the states other domains reach (a game question by question, a quiz archived, a room closed) are listed but not yet reached by any Step, which is why lint warns about them, and two Rules govern only selection launches here, though they govern rooms too.",
      "paths": [
        "apps/backend/src/game/",
        "apps/backend/src/quizzes/"
      ]
    }
  ]
}
---

# Coverage
