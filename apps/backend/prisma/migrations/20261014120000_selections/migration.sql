-- Selections (SPECIFICATIONS-SELECTION): a named list of quizzes, launched into a room.
CREATE TABLE "selection" (
    "id" CHAR(26) NOT NULL,
    "owner_id" CHAR(26) NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "description" VARCHAR(2000),
    "shared" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "selection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "selection_item" (
    "id" CHAR(26) NOT NULL,
    "selection_id" CHAR(26) NOT NULL,
    "quiz_id" CHAR(26) NOT NULL,
    "order_index" INTEGER NOT NULL,
    "mode" VARCHAR(10) NOT NULL DEFAULT 'manual',
    "auto_start" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "selection_item_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "game_session_log" ADD COLUMN "selection_id" CHAR(26);

CREATE INDEX "selection_owner_id_idx" ON "selection"("owner_id");
CREATE INDEX "selection_item_quiz_id_idx" ON "selection_item"("quiz_id");
CREATE UNIQUE INDEX "selection_item_selection_id_quiz_id_key" ON "selection_item"("selection_id", "quiz_id");
CREATE INDEX "game_session_log_selection_id_idx" ON "game_session_log"("selection_id");

ALTER TABLE "selection" ADD CONSTRAINT "selection_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "selection_item" ADD CONSTRAINT "selection_item_selection_id_fkey" FOREIGN KEY ("selection_id") REFERENCES "selection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "selection_item" ADD CONSTRAINT "selection_item_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "game_session_log" ADD CONSTRAINT "game_session_log_selection_id_fkey" FOREIGN KEY ("selection_id") REFERENCES "selection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
