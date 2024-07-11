-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GITHUB', 'CREDENTIALS');

-- CreateEnum
CREATE TYPE "Env" AS ENUM ('DEV', 'PRE', 'PRO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "provider" "Provider" NOT NULL DEFAULT 'CREDENTIALS',
    "username" TEXT,
    "password" TEXT,
    "complete_name" TEXT,
    "avatar" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "user_id" TEXT NOT NULL,
    "image_url" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kvs" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kvs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "provider_username" ON "users"("provider", "username");

-- CreateIndex
CREATE INDEX "provider_email" ON "users"("provider", "email");

-- CreateIndex
CREATE INDEX "user_id" ON "projects"("user_id");

-- CreateIndex
CREATE INDEX "project_name" ON "projects"("name");

-- CreateIndex
CREATE INDEX "name_user_id" ON "projects"("name", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_user_id_key" ON "projects"("slug", "user_id");

-- CreateIndex
CREATE INDEX "project_id" ON "groups"("project_id");

-- CreateIndex
CREATE INDEX "group_name" ON "groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "kvs_key_key" ON "kvs"("key");

-- CreateIndex
CREATE INDEX "group_id" ON "kvs"("group_id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kvs" ADD CONSTRAINT "kvs_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
