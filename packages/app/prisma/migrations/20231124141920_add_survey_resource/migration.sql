-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "waypointSymbol" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Survey_waypointSymbol_idx" ON "Survey"("waypointSymbol");

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_waypointSymbol_fkey" FOREIGN KEY ("waypointSymbol") REFERENCES "Waypoint"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
