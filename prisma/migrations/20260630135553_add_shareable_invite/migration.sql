-- CreateTable
CREATE TABLE "shareable_invite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shareable_invite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shareable_invite_token_key" ON "shareable_invite"("token");

-- CreateIndex
CREATE INDEX "shareable_invite_token_idx" ON "shareable_invite"("token");

-- CreateIndex
CREATE INDEX "shareable_invite_organizationId_idx" ON "shareable_invite"("organizationId");

-- AddForeignKey
ALTER TABLE "shareable_invite" ADD CONSTRAINT "shareable_invite_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shareable_invite" ADD CONSTRAINT "shareable_invite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
