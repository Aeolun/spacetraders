import {prisma} from "@common/prisma";
import {ShipNameGenerator} from "@auto/setup/ship-name-generator";
import {generateShipName} from "@common/lib/names";

prisma.ship.findMany().then(async ships => {
  const genrator = new ShipNameGenerator();
  for(const ship of ships) {
    //if (!ship.callsign) {
      const newName = await generateShipName(ship);
      console.log(`Giving ship ${ship.symbol} the name ${newName}`);
      await prisma.ship.update({
        where: {
          symbol: ship.symbol
        },
        data: {
          callsign: newName
        }
      })
    //}
  }
})