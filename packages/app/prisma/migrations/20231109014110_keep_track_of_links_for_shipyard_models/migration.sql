-- AddForeignKey
ALTER TABLE "ShipyardModel" ADD CONSTRAINT "ShipyardModel_waypointSymbol_fkey" FOREIGN KEY ("waypointSymbol") REFERENCES "Waypoint"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;
