import {Ship} from "@app/ship/ship";
import {getBackgroundAgentToken} from "@app/setup/background-agent-token";
import {ExtractResources201Response, Survey} from "spacetraders-sdk";

export const mineBehavior = async (shipReg: string, homeSystem: string, range: number) => {
    const token = await getBackgroundAgentToken()
    const ship = new Ship(token, 'PHANTASM', shipReg)
    let started = false

    while(true) {
        try {
            if (!started) {
                await ship.updateShipStatus();
                await ship.validateCooldowns()
                await ship.navigate(homeSystem)
                started = true
            }

            let extractResult: ExtractResources201Response | undefined;
            let survey: Survey | undefined = undefined
            do {
                await ship.orbit()
                // if (!survey) {
                //     survey = (await ship.survey()).survey.data.data.surveys[0];
                // }

                extractResult = (await ship.extract(survey)).extract
                await ship.dock()
                await ship.sellAllCargo()

            } while (extractResult && extractResult.data.cargo.units < extractResult.data.cargo.capacity)
        } catch(error) {
            console.log("Unexpected issue in agent, restarting after 60s: ",error?.response?.data ? error?.response?.data : error.toString())
            await ship.waitFor(60000)
            started = false
        }
    }

    // const shipyardresponse = await api.systems.getShipyard('X1-VU95', 'X1-VU95-02777Z')
    // fs.writeFileSync('shipyard.json', JSON.stringify(shipyardresponse.data.data, null, 2))
}