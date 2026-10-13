# QuizDock — Selections (the selection brief)

> A **selection**: a named, saved, replayable list of quizzes, launched into a room in one go. The room
> ([SPECIFICATIONS-ROOM.md](./SPECIFICATIONS-ROOM.md)) improvises a series of quizzes live; a selection prepares one.
> The model, the decisions taken, and what is still to evaluate.

Status: **draft.** Nothing delivered; the open points of §4 come before any pull request.

---

## 1. The model

- **A selection** is content, like a quiz: it belongs to its host and sits next to *My quizzes*. It holds:
  - its **name** (and an optional description), which carries the context: *History, year 8*, *Company night*;
  - its **quizzes, in order**;
  - for each quiz, what depends on the quiz itself: its **pace** (`manual` / `auto`, LIVE §8) and whether the
    **next quiz starts on its own** after the lobby countdown (LIVE §11.4).
- **Launching** a selection opens a room on its first quiz. From there, the room is an ordinary room (ROOM §1): same
  screens, same archives, same standings.
- **Saving a room as a selection** turns the quizzes a room played, in their order, into a new selection.

## 2. Decisions taken

- **The word** (2026-10-13): *selection* — neutral on the domain, the duration and the rigour, translatable (fr
  *Sélection*, es *Selección*, de *Auswahl*). It can take a qualifier later if a variant needs one (*ordered
  selection*), and the name the host gives it says the rest. Ruled out:
  - *Programme*, *Path* (*Parcours*): they promise a long-term, structured follow-up;
  - *Playlist*, and the game vocabulary (*round*, *tournament*, *season*): outside quizzes, or too narrow;
  - *Series* (fr *Série*): already the answer streak; *Session*: already one archived quiz; *Bundle*, *pack*: already
    the import/export format.
- **Only what depends on the quizzes** (2026-10-13). The settings that depend on the audience and the place stay the
  room's, picked at each launch as today:
  - capture, personal tracking (RG-16), picking one's own name, participant access;
  - the invitation address, the join lock, the sounds and levels, motion, the audience language, the room's name.

  A selection never imposes a capture the host did not choose, and stays playable in any context.
- **A reference to each quiz, not a copy** (2026-10-13). A quiz edited between two launches is played in its new
  version; each archived session keeps its own frozen copy (`quiz_snapshot`), which is what any follow-up reads.
- **Shared like a quiz** (2026-10-13): a selection can be shared with the instance's other hosts, off by default.
  They see it read-only in their bank and can **create a selection from it**, theirs to edit, with nothing linking
  the two afterwards (as `quiz.shared` and *Create from this* do for a quiz). What *read-only* allows, and what the
  new selection refers to, is §4.5.
- **A follow-up is possible without locking settings**: like the room's standings (ROOM §5, RG-16), whatever compares
  launches is read from their archived sessions and only counts the compatible ones (those that tracked their
  participants). Nothing is fixed in advance.

## 3. Data (sketch)

- `selection`: id (ULID), owner, name, description, timestamps.
- `selection_item`: selection, quiz, order index, pace, starts on its own.
- A launch is not stored as such: its sessions would carry the selection they came from, as they carry their room
  (`game_session_log.room_id`). To confirm with the follow-up (§4.1).

## 4. To evaluate

1. **The follow-up**: what it shows — per participant across launches, launches compared with one another (success
   rate, turnout), or both — and so whether sessions need a `selection_id`.
2. **Launching**: is the room held to the list, or is the list a queue the host can leave (skip a quiz, insert one,
   change the order live)? And what the room shows of the list (the quiz coming next, how many are left).
3. **Saving a room**: from where — the console when the room closes (every quiz played is known live,
   `room:{pin}:played`), *History*'s room card (only the archived quizzes are known, ROOM §5), or both.
4. **A quiz that is no longer playable**: deleted, back to `draft`, or without a question at launch — skipped, or the
   launch refused.
5. **Sharing and its references**: a selection refers to its owner's quizzes. Presenting a shared quiz one does not
   own, keeping nothing, comes first ([SPECIFICATIONS-SHARED-PLAY.md](./SPECIFICATIONS-SHARED-PLAY.md)). So:
   - can another host **launch** a shared selection as it is — and so present quizzes they do not own — or only read
     it and create from it?
   - does a shared selection require its quizzes to be shared too, or does sharing it share them?
   - a selection created from it: does it refer to the owner's quizzes, or does creating it copy them into the taker's
     bank (RG-17: copies, never references)?
   - beyond the instance: in a bundle, in the template catalogue or the store, where everything travels as a copy.
6. **Limits**: the number of quizzes per selection, still open for the room too (ROOM §6).

## 5. Tests

Each pull request comes with the tests that fail without it, and coverage does not drop; the multi-quiz room's
tests (`apps/backend/test/game/`) stay green, a selection launching an ordinary room. What to cover follows the
answers to §4.
