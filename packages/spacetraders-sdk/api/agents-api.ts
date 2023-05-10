/* tslint:disable */
/* eslint-disable */
/**
 * SpaceTraders API
 * SpaceTraders is an open-universe game and learning platform that offers a set of HTTP endpoints to control a fleet of ships and explore a multiplayer universe.  The API is documented using [OpenAPI](https://github.com/SpaceTradersAPI/api-docs). You can send your first request right here in your browser to check the status of the game server.  ```json http {   \"method\": \"GET\",   \"url\": \"https://api.spacetraders.io/v2\", } ```  Unlike a traditional game, SpaceTraders does not have a first-party agent2 or app to play the game. Instead, you can use the API to build your own agent2, write a script to automate your ships, or try an app built by the community.  We have a [Discord channel](https://discord.com/invite/jh6zurdWk5) where you can share your projects, ask questions, and get help from other players.
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: joel@spacetraders.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { GetMyAgent200Response } from '../models';
/**
 * AgentsApi - axios parameter creator
 * @export
 */
export const AgentsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Fetch your agent\'s details.
         * @summary My Agent Details
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMyAgent: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/my/agent`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication AgentToken required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AgentsApi - functional programming interface
 * @export
 */
export const AgentsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AgentsApiAxiosParamCreator(configuration)
    return {
        /**
         * Fetch your agent\'s details.
         * @summary My Agent Details
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getMyAgent(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetMyAgent200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getMyAgent(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * AgentsApi - factory interface
 * @export
 */
export const AgentsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AgentsApiFp(configuration)
    return {
        /**
         * Fetch your agent\'s details.
         * @summary My Agent Details
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMyAgent(options?: any): AxiosPromise<GetMyAgent200Response> {
            return localVarFp.getMyAgent(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AgentsApi - object-oriented interface
 * @export
 * @class AgentsApi
 * @extends {BaseAPI}
 */
export class AgentsApi extends BaseAPI {
    /**
     * Fetch your agent\'s details.
     * @summary My Agent Details
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AgentsApi
     */
    public getMyAgent(options?: AxiosRequestConfig) {
        return AgentsApiFp(this.configuration).getMyAgent(options).then((request) => request(this.axios, this.basePath));
    }
}
