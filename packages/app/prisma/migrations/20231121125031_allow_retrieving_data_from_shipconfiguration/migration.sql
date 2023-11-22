-- AddForeignKey
ALTER TABLE "ShipConfiguration" ADD CONSTRAINT "ShipConfiguration_frameSymbol_fkey" FOREIGN KEY ("frameSymbol") REFERENCES "ShipFrame"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipConfiguration" ADD CONSTRAINT "ShipConfiguration_reactorSymbol_fkey" FOREIGN KEY ("reactorSymbol") REFERENCES "ShipReactor"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipConfiguration" ADD CONSTRAINT "ShipConfiguration_engineSymbol_fkey" FOREIGN KEY ("engineSymbol") REFERENCES "ShipEngine"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipConfigurationModule" ADD CONSTRAINT "ShipConfigurationModule_moduleSymbol_fkey" FOREIGN KEY ("moduleSymbol") REFERENCES "ShipModule"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipConfigurationMount" ADD CONSTRAINT "ShipConfigurationMount_mountSymbol_fkey" FOREIGN KEY ("mountSymbol") REFERENCES "ShipMount"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
