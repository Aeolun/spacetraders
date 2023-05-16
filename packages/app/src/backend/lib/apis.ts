import {FleetApi, SystemsApi, DefaultApi, AgentsApi, ContractsApi, FactionsApi} from "spacetraders-sdk";
import {configuration} from "../configuration";

export default {
    systems: new SystemsApi(configuration),
    fleet: new FleetApi(configuration),
    default: new DefaultApi(configuration),
    agents: new AgentsApi(configuration),
    contracts: new ContractsApi(configuration),
    factions: new FactionsApi(configuration)
}