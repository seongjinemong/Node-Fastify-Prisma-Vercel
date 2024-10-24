-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "sessions_id_seq";
