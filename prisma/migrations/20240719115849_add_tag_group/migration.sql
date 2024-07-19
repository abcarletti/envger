/*
  Warnings:

  - A unique constraint covering the columns `[tag,project_id]` on the table `groups` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tag` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "groups" ADD COLUMN if not exists "tag" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX if not exists "groups_tag_project_id_key" ON "groups"("tag", "project_id");
