-- A rating from another host's game of a shared quiz keeps no nickname.
ALTER TABLE "quiz_feedback" ALTER COLUMN "nickname" DROP NOT NULL;
