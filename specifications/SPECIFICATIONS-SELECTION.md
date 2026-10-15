# QuizDock — Selections (the selection brief)

> A **selection**: a named, saved, replayable list of quizzes, launched into a room in one go. The room
> ([SPECIFICATIONS-ROOM.md](./SPECIFICATIONS-ROOM.md)) improvises a series of quizzes live; a selection prepares one.
> The decisions taken, the data, and the tests. What selections are and do is stated once, in the
> [Product Model](../product-model/README.md); this brief links to it and keeps why it is so.

Status: **delivered on `dev`** (2026-10-14), not released yet.

---

## 1. The model

Moved to the Product Model, the Selections domain ([open the report](../product-model/README.md)):

- **What a selection is and holds**: [Selection](../product-model/entities/selection.md).
- **What a host does with one**: [Create](../product-model/capabilities/create-selection/capability.md), [Edit](../product-model/capabilities/edit-selection/capability.md),
  [Add a quiz](../product-model/capabilities/add-quiz-to-selection/capability.md), [Remove a quiz](../product-model/capabilities/remove-quiz-from-selection/capability.md),
  [Delete](../product-model/capabilities/delete-selection/capability.md), [Browse](../product-model/capabilities/browse-selections/capability.md),
  [Present a selection](../product-model/capabilities/launch-selection/capability.md), [Save a room as a selection](../product-model/capabilities/save-room-as-selection/capability.md),
  [Share](../product-model/capabilities/share-selection/capability.md), [Stop sharing](../product-model/capabilities/stop-sharing-selection/capability.md),
  [Create a selection from a shared one](../product-model/capabilities/copy-selection/capability.md), [Compare its launches](../product-model/capabilities/compare-selection-launches/capability.md).
- **Its rules**: [the queue](../product-model/business-rules/selection-queue.md), [the limits](../product-model/business-rules/selection-limits.md),
  [who reads what](../product-model/business-rules/selection-reading.md), [sharing shares no quiz](../product-model/business-rules/selection-sharing-shares-no-quiz.md),
  [only its owner changes it](../product-model/business-rules/selection-changes-by-owner.md), [or deletes it](../product-model/business-rules/selection-deletion-by-owner.md),
  [what a room can play](../product-model/business-rules/playable-quiz.md).

Those a decision below explains link back to it, so the report shows the decision beside them.

## 2. Decisions taken

- **The word** (2026-10-13): *selection* — neutral on the domain, the duration and the rigour, translatable (fr
  *Sélection*, es *Selección*, de *Auswahl*). It can take a qualifier later if a variant needs one (*ordered
  selection*), and the name the host gives it says the rest. Ruled out:
  - *Programme*, *Path* (*Parcours*): they promise a long-term, structured follow-up;
  - *Playlist*, and the game vocabulary (*round*, *tournament*, *season*): outside quizzes, or too narrow;
  - *Series* (fr *Série*): already the answer streak; *Session*: already one archived quiz; *Bundle*, *pack*: already
    the import/export format.
- **Only what depends on the quizzes** (2026-10-13): a [selection](../product-model/entities/selection.md) holds
  only what depends on the quizzes. The settings that depend on the audience and the place stay the
  room's, picked at each launch as today:
  - capture, personal tracking (RG-16), picking one's own name, participant access;
  - the invitation address, the join lock, the sounds and levels, motion, the audience language, the room's name.

  A selection never imposes a capture the host did not choose, and stays playable in any context.
- **A reference to each quiz, not a copy** (2026-10-13): [adding a quiz copies nothing](../product-model/capabilities/add-quiz-to-selection/scenarios/add-a-quiz.md).
  A quiz edited between two launches is played in its new version; each archived session keeps its own frozen copy (`quiz_snapshot`), which is what any follow-up reads.
- **Shared like a quiz** (2026-10-13, settled 2026-10-14), as `quiz.shared` and *Create from this* do for a quiz:
  [sharing](../product-model/capabilities/share-selection/capability.md), [presenting another host's selection](../product-model/capabilities/launch-selection/scenarios/launch-shared-selection.md)
  and [creating one's own from it](../product-model/capabilities/copy-selection/capability.md). Sharing a selection
  [does not share its quizzes](../product-model/business-rules/selection-sharing-shares-no-quiz.md): the owner decides for each. **Beyond the
  instance** (a bundle, the template catalogue, the store), where everything travels as a copy, is outside this brief.
- **The list is a queue the host may leave** (2026-10-14): [the room's lobby picks the next quiz](../product-model/business-rules/selection-queue.md).
  It reads what the room already knows (`playedQuizIds`), so no cursor is stored. Moving on stays the host's call
  (ROOM §2).
- **One rule for what shows** (2026-10-14): everyone, the owner included, sees of a selection
  [what they may read](../product-model/business-rules/selection-reading.md); what they may read but not play is greyed
  ([in its editor](../product-model/capabilities/edit-selection/capability.md)), and only what can be played shows
  [in the console](../product-model/capabilities/launch-selection/capability.md). To keep another host's quiz, the only way is one's own copy.
- **Saving a room as a selection, from two places** (2026-10-14): [the console and *History*'s room card](../product-model/capabilities/save-room-as-selection/capability.md).
  *History* is the way back for a host who forgot to save it live; an archived session does not keep its pace, so
  its quizzes come back at the manual pace.
- **Limits** (2026-10-14), against abuse only: [50 quizzes, each once](../product-model/business-rules/selection-limits.md)
  (`selection.too_many_quizzes`). Each once because the queue plays the first one not played yet, so a second line
  would never come; a quiz is played again with *Change quiz*. The name and the description take a room's and a
  quiz's lengths. The room itself keeps no limit.
- **A quiz that cannot be played is skipped** (2026-10-14), and [launching is refused](../product-model/capabilities/launch-selection/scenarios/nothing-playable.md)
  only when none can be (`selection.nothing_playable`).
- **The follow-up compares launches** (2026-10-14), read from their archived sessions like the room's card in
  *History*, settings never locked: [Launches](../product-model/capabilities/compare-selection-launches/capability.md), on the selection's page. Every
  session of a room its host opened from their own selection carries it (`game_session_log.selection_id`, emptied if
  the selection is deleted: the archives stay). Following each participant from one launch to the next — a stable
  identity, accounts only, RG-16 — is outside this brief.

## 3. Data (sketch)

- `selection`: id (ULID), owner, name, description, timestamps.
- `selection_item`: selection, quiz (deleted with it), order index, pace, starts on its own.
- A launch is not stored as such: its sessions carry the selection they came from (`game_session_log.selection_id`,
  set null on delete), as they carry their room (`room_id`).

## 4. Tests

Each pull request comes with the tests that fail without it, and coverage does not drop; the multi-quiz room's
tests (`apps/backend/test/game/`) stay green, a selection launching an ordinary room. At least:

- the lobby picks the first quiz of the list not played yet; one picked outside the list leaves the queue where it
  was; a quiz skipped stays next;
- a quiz that cannot be played is skipped, and launching is refused when none can be (`selection.nothing_playable`);
- visibility: another host sees only the quizzes they may read, a selection with none does not show, a deleted
  quiz leaves the list; in its editor, a quiz one may read but not play is greyed with why;
- another host launching a shared selection plays its shared quizzes keeping nothing;
- saving a room as a selection, from the console (the quizzes played, their pace) and from *History* (the archived
  ones, manual pace), leaving out what cannot be read;
- every session of a room opened from a selection carries `selection_id`, emptied when the selection is deleted;
  *Launches* compares them;
- the limits: 50 quizzes, each once.
