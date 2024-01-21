import {FleetApi, SystemsApi, DefaultApi, AgentsApi, ContractsApi, FactionsApi, Configuration} from "spacetraders-sdk";
import globalAxios from 'axios';
import axiosRetry from 'axios-retry'

axiosRetry(globalAxios, { retries: 3, retryCondition: (error) => {
  return (error.response?.status && error.response?.status >= 500) || axiosRetry.isNetworkOrIdempotentRequestError(error);
  },
  retryDelay: (retryCount, error) => {
  if (error.response?.status === 429) {
    return error.response.headers['retry-after'] ? error.response.headers['retry-after'] * 1000 : retryCount * 1000;
  } else {
    return retryCount * 1000;
  }
} });

export const requestCounts: Record<string, {
  count: number,
}> = {}
globalAxios.interceptors.response.use(response => {
  if (response.config.url) {
    const url = new URL(response.config.url)
    const logUrl = url.pathname.replace(/PHANTASM-[0-9A-F]+/g, '$').replace(/X1-[A-Z0-9]+-[0-9A-Z]+/g, '$').replace(/X1-[A-Z0-9]+/g, '$')
    if (!requestCounts[logUrl]) {
      requestCounts[logUrl] = {
        count: 0,
      }
    }
    requestCounts[logUrl].count++;
  }
  return response
})

export interface APIInstance {
    systems: SystemsApi,
    fleet: FleetApi,
    default:DefaultApi,
    agents: AgentsApi,
    contracts: ContractsApi,
    factions: FactionsApi
}

export default (agentToken: string, basePath?: string) => {
    const configuration = new Configuration({
        basePath: basePath ?? process.env.API_ENDPOINT,
        accessToken: agentToken,
        
    })
    return {
        systems: new SystemsApi(configuration, undefined, globalAxios),
        fleet: new FleetApi(configuration, undefined, globalAxios),
        default: new DefaultApi(configuration, undefined, globalAxios),
        agents: new AgentsApi(configuration, undefined, globalAxios),
        contracts: new ContractsApi(configuration, undefined, globalAxios),
        factions: new FactionsApi(configuration, undefined, globalAxios)
    }
}