import {Ship} from "@app/ship/ship";
import {getBackgroundAgentToken} from "@app/setup/background-agent-token";
import {ExtractResources201Response, Survey} from "spacetraders-sdk";

export const mineBehavior = async (ship: Ship) => {
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
}