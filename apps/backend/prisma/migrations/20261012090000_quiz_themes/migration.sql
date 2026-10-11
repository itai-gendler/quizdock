-- AlterEnum (PostgreSQL 12+ takes two values in one transaction)
ALTER TYPE "media_kind" ADD VALUE 'icon';
ALTER TYPE "media_kind" ADD VALUE 'font';

-- AlterTable
ALTER TABLE "quiz" ADD COLUMN     "theme_builtin" TEXT,
ADD COLUMN     "theme_id" CHAR(26);

-- AlterTable
ALTER TABLE "question" ADD COLUMN     "background_style" JSONB;

-- AlterTable
ALTER TABLE "slide" ADD COLUMN     "background_style" JSONB;

-- CreateTable
CREATE TABLE "theme" (
    "id" CHAR(26) NOT NULL,
    "owner_id" CHAR(26) NOT NULL,
    "name" TEXT NOT NULL,
    "parent" TEXT NOT NULL,
    "overrides" JSONB NOT NULL DEFAULT '{}',
    "accessibility" JSONB NOT NULL,
    "slug" TEXT,
    "license" TEXT,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "fingerprint" CHAR(64),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme_media" (
    "theme_id" CHAR(26) NOT NULL,
    "media_id" CHAR(26) NOT NULL,

    CONSTRAINT "theme_media_pkey" PRIMARY KEY ("theme_id","media_id")
);

-- CreateIndex
CREATE INDEX "theme_owner_id_idx" ON "theme"("owner_id");

-- CreateIndex
CREATE INDEX "theme_fingerprint_idx" ON "theme"("fingerprint");

-- CreateIndex
CREATE INDEX "theme_media_media_id_idx" ON "theme_media"("media_id");

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theme" ADD CONSTRAINT "theme_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theme_media" ADD CONSTRAINT "theme_media_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theme_media" ADD CONSTRAINT "theme_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- A quiz takes a library theme or a shipped one, never both.
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_one_theme" CHECK ("theme_id" IS NULL OR "theme_builtin" IS NULL);
