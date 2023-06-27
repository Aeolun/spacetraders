import {FleetApi, SystemsApi, DefaultApi, AgentsApi, ContractsApi, FactionsApi, Configuration} from "spacetraders-sdk";

export interface APIInstance {
    systems: SystemsApi,
    fleet: FleetApi,
    default:DefaultApi,
    agents: AgentsApi,
    contracts: ContractsApi,
    factions: FactionsApi
}

export default (agentToken: string) => {
    const configuration = new Configuration({
        basePath: process.env.API_ENDPOINT,
        accessToken: agentToken,
    })
    return {
        systems: new SystemsApi(configuration),
        fleet: new FleetApi(configuration),
        default: new DefaultApi(configuration),
        agents: new AgentsApi(configuration),
        contracts: new ContractsApi(configuration),
        factions: new FactionsApi(configuration)
    }
}