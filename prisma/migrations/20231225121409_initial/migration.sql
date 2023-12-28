-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('PERSONAL', 'GROUP');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "RTHash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupConversation" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalConversation" (
    "id" SERIAL NOT NULL,
    "initiatorId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,

    CONSTRAINT "PersonalConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupConversationId" INTEGER,
    "personalConversationId" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GroupConversation_title_key" ON "GroupConversation"("title");

-- CreateIndex
CREATE INDEX "Message_groupConversationId_idx" ON "Message"("groupConversationId");

-- CreateIndex
CREATE INDEX "Message_personalConversationId_idx" ON "Message"("personalConversationId");

-- AddForeignKey
ALTER TABLE "GroupConversation" ADD CONSTRAINT "GroupConversation_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalConversation" ADD CONSTRAINT "PersonalConversation_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalConversation" ADD CONSTRAINT "PersonalConversation_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_groupConversationId_fkey" FOREIGN KEY ("groupConversationId") REFERENCES "GroupConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_personalConversationId_fkey" FOREIGN KEY ("personalConversationId") REFERENCES "PersonalConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
