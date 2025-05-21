-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_projectId_fkey";

-- CreateTable
CREATE TABLE "NotesChunk" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chunkText" TEXT NOT NULL,
    "embedding" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resourceId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "NotesChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotesChunk_resourceId_idx" ON "NotesChunk"("resourceId");

-- CreateIndex
CREATE INDEX "NotesChunk_projectId_idx" ON "NotesChunk"("projectId");

-- CreateIndex
CREATE INDEX "NotesChunk_userId_idx" ON "NotesChunk"("userId");

-- CreateIndex
CREATE INDEX "Notes_projectId_idx" ON "Notes"("projectId");

-- CreateIndex
CREATE INDEX "Notes_ownerId_idx" ON "Notes"("ownerId");

-- CreateIndex
CREATE INDEX "Projects_ownerId_idx" ON "Projects"("ownerId");

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotesChunk" ADD CONSTRAINT "NotesChunk_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotesChunk" ADD CONSTRAINT "NotesChunk_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
