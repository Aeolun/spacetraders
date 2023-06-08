/* tslint:disable */
/* eslint-disable */
/**
 * SpaceTraders API
 * SpaceTraders is an open-universe game and learning platform that offers a set of HTTP endpoints to control a fleet of ships and explore a multiplayer universe.  The API is documented using [OpenAPI](https://github.com/SpaceTradersAPI/api-docs). You can send your first request right here in your browser to check the status of the game server.  ```json http {   \"method\": \"GET\",   \"url\": \"https://api.spacetraders.io/v2\", } ```  Unlike a traditional game, SpaceTraders does not have a first-party client or app to play the game. Instead, you can use the API to build your own client, write a script to automate your ships, or try an app built by the community.  We have a [Discord channel](https://discord.com/invite/jh6zurdWk5) where you can share your projects, ask questions, and get help from other players.   
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
import { GetJumpGate200Response } from '../models';
// @ts-ignore
import { GetMarket200Response } from '../models';
// @ts-ignore
import { GetShipyard200Response } from '../models';
// @ts-ignore
import { GetSystem200Response } from '../models';
// @ts-ignore
import { GetSystemWaypoints200Response } from '../models';
// @ts-ignore
import { GetSystems200Response } from '../models';
// @ts-ignore
import { GetWaypoint200Response } from '../models';
/**
 * SystemsApi - axios parameter creator
 * @export
 */
export const SystemsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Get jump gate details for a waypoint.
         * @summary Get Jump Gate
         * @param {string} systemSymbol The system symbol
         * @param {string} waypointSymbol The waypoint symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getJumpGate: async (systemSymbol: string, waypointSymbol: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'systemSymbol' is not null or undefined
            assertParamExists('getJumpGate', 'systemSymbol', systemSymbol)
            // verify required parameter 'waypointSymbol' is not null or undefined
            assertParamExists('getJumpGate', 'waypointSymbol', waypointSymbol)
            const localVarPath = `/systems/{systemSymbol}/waypoints/{waypointSymbol}/jump-gate`
                .replace(`{${"systemSymbol"}}`, encodeURIComponent(String(systemSymbol)))
                .replace(`{${"waypointSymbol"}}`, encodeURIComponent(String(waypointSymbol)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Retrieve imports, exports and exchange data from a marketplace. Imports can be sold, exports can be purchased, and exchange goods can be purchased or sold. Send a ship to the waypoint to access trade good prices and recent transactions.
         * @summary Get Market
         * @param {string} systemSymbol The system symbol
         * @param {string} waypointSymbol The waypoint symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMarket: async (systemSymbol: string, waypointSymbol: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'systemSymbol' is not null or undefined
            assertParamExists('getMarket', 'systemSymbol', systemSymbol)
            // verify required parameter 'waypointSymbol' is not null or undefined
            assertParamExists('getMarket', 'waypointSymbol', waypointSymbol)
            const localVarPath = `/systems/{systemSymbol}/waypoints/{waypointSymbol}/market`
                .replace(`{${"systemSymbol"}}`, encodeURIComponent(String(systemSymbol)))
                .replace(`{${"waypointSymbol"}}`, encodeURIComponent(String(waypointSymbol)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get the shipyard for a waypoint. Send a ship to the waypoint to access ships that are currently available for purchase and recent transactions.
         * @summary Get Shipyard
         * @param {string} systemSymbol The system symbol
         * @param {string} waypointSymbol The waypoint symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getShipyard: async (systemSymbol: string, waypointSymbol: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'systemSymbol' is not null or undefined
            assertParamExists('getShipyard', 'systemSymbol', systemSymbol)
            // verify required parameter 'waypointSymbol' is not null or undefined
            assertParamExists('getShipyard', 'waypointSymbol', waypointSymbol)
            const localVarPath = `/systems/{systemSymbol}/waypoints/{waypointSymbol}/shipyard`
                .replace(`{${"systemSymbol"}}`, encodeURIComponent(String(systemSymbol)))
                .replace(`{${"waypointSymbol"}}`, encodeURIComponent(String(waypointSymbol)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get the details of a system.
         * @summary Get System
         * @param {string} systemSymbol The system symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getSystem: async (systemSymbol: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'systemSymbol' is not null or undefined
            assertParamExists('getSystem', 'systemSymbol', systemSymbol)
            const localVarPath = `/systems/{systemSymbol}`
                .replace(`{${"systemSymbol"}}`, encodeURIComponent(String(systemSymbol)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Fetch all of the waypoints for a given system. System must be charted or a ship must be present to return waypoint details.
         * @summary List Waypoints
         * @param {string} systemSymbol The system symbol
         * @param {number} [page] What entry offset to request
         * @param {number} [limit] How many entries to return per page
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getSystemWaypoints: async (systemSymbol: string, page?: number, limit?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'systemSymbol' is not null or undefined
            assertParamExists('getSystemWaypoints', 'systemSymbol', systemSymbol)
            const localVarPath = `/systems/{systemSymbol}/waypoints`
                .replace(`{${"systemSymbol"}}`, encodeURIComponent(String(systemSymbol)));
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

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Return a list of all systems.
         * @summary List Systems
         * @param {number} [page] What entry offset to request
         * @param {number} [limit] How many entries to return per page
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getSystems: async (page?: number, limit?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/systems`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * View the details of a waypoint.
         * @summary Get Waypoint
         * @param {string} systemSymbol The system symbol
         * @param {string} waypointSymbol The waypoint symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getWaypoint: async (systemSymbol: string, waypointSymbol: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'systemSymbol' is not null or undefined
            assertParamExists('getWaypoint', 'systemSymbol', systemSymbol)
            // verify required parameter 'waypointSymbol' is not null or undefined
            assertParamExists('getWaypoint', 'waypointSymbol', waypointSymbol)
            const localVarPath = `/systems/{systemSymbol}/waypoints/{waypointSymbol}`
                .replace(`{${"systemSymbol"}}`, encodeURIComponent(String(systemSymbol)))
                .replace(`{${"waypointSymbol"}}`, encodeURIComponent(String(waypointSymbol)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
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
 * SystemsApi - functional programming interface
 * @export
 */
export const SystemsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = SystemsApiAxiosParamCreator(configuration)
    return {
        /**
         * Get jump gate details for a waypoint.
         * @summary Get Jump Gate
         * @param {string} systemSymbol The system symbol
         * @param {string} waypointSymbol The waypoint symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getJumpGate(systemSymbol: string, waypointSymbol: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetJumpGate200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getJumpGate(systemSymbol, waypointSymbol, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieve imports, exports and exchange data from a marketplace. Imports can be sold, exports can be purchased, and exchange goods can be purchased or sold. Send a ship to the waypoint to access trade good prices and recent transactions.
         * @summary Get Market
         * @param {string} systemSymbol The system symbol
         * @param {string} waypointSymbol The waypoint symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getMarket(systemSymbol: string, waypointSymbol: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetMarket200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getMarket(systemSymbol, waypointSymbol, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Get the shipyard for a waypoint. Send a ship to the waypoint to access ships that are currently available for purchase and recent transactions.
         * @summary Get Shipyard
         * @param {string} systemSymbol The system symbol
         * @param {string} waypointSymbol The waypoint symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getShipyard(systemSymbol: string, waypointSymbol: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetShipyard200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getShipyard(systemSymbol, waypointSymbol, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Get the details of a system.
         * @summary Get System
         * @param {string} systemSymbol The system symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getSystem(systemSymbol: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetSystem200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getSystem(systemSymbol, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Fetch all of the waypoints for a given system. System must be charted or a ship must be present to return waypoint details.
         * @summary List Waypoints
         * @param {string} systemSymbol The system symbol
         * @param {number} [page] What entry offset to request
         * @param {number} [limit] How many entries to return per page
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getSystemWaypoints(systemSymbol: string, page?: number, limit?: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetSystemWaypoints200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getSystemWaypoints(systemSymbol, page, limit, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Return a list of all systems.
         * @summary List Systems
         * @param {number} [page] What entry offset to request
         * @param {number} [limit] How many entries to return per page
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getSystems(page?: number, limit?: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetSystems200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getSystems(page, limit, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * View the details of a waypoint.
         * @summary Get Waypoint
         * @param {string} systemSymbol The system symbol
         * @param {string} waypointSymbol The waypoint symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getWaypoint(systemSymbol: string, waypointSymbol: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetWaypoint200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getWaypoint(systemSymbol, waypointSymbol, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * SystemsApi - factory interface
 * @export
 */
export const SystemsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = SystemsApiFp(configuration)
    return {
        /**
         * Get jump gate details for a waypoint.
         * @summary Get Jump Gate
         * @param {string} systemSymbol The system symbol
         * @param {string} waypointSymbol The waypoint symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getJumpGate(systemSymbol: string, waypointSymbol: string, options?: any): AxiosPromise<GetJumpGate200Response> {
            return localVarFp.getJumpGate(systemSymbol, waypointSymbol, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieve imports, exports and exchange data from a marketplace. Imports can be sold, exports can be purchased, and exchange goods can be purchased or sold. Send a ship to the waypoint to access trade good prices and recent transactions.
         * @summary Get Market
         * @param {string} systemSymbol The system symbol
         * @param {string} waypointSymbol The waypoint symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMarket(systemSymbol: string, waypointSymbol: string, options?: any): AxiosPromise<GetMarket200Response> {
            return localVarFp.getMarket(systemSymbol, waypointSymbol, options).then((request) => request(axios, basePath));
        },
        /**
         * Get the shipyard for a waypoint. Send a ship to the waypoint to access ships that are currently available for purchase and recent transactions.
         * @summary Get Shipyard
         * @param {string} systemSymbol The system symbol
         * @param {string} waypointSymbol The waypoint symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getShipyard(systemSymbol: string, waypointSymbol: string, options?: any): AxiosPromise<GetShipyard200Response> {
            return localVarFp.getShipyard(systemSymbol, waypointSymbol, options).then((request) => request(axios, basePath));
        },
        /**
         * Get the details of a system.
         * @summary Get System
         * @param {string} systemSymbol The system symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getSystem(systemSymbol: string, options?: any): AxiosPromise<GetSystem200Response> {
            return localVarFp.getSystem(systemSymbol, options).then((request) => request(axios, basePath));
        },
        /**
         * Fetch all of the waypoints for a given system. System must be charted or a ship must be present to return waypoint details.
         * @summary List Waypoints
         * @param {string} systemSymbol The system symbol
         * @param {number} [page] What entry offset to request
         * @param {number} [limit] How many entries to return per page
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getSystemWaypoints(systemSymbol: string, page?: number, limit?: number, options?: any): AxiosPromise<GetSystemWaypoints200Response> {
            return localVarFp.getSystemWaypoints(systemSymbol, page, limit, options).then((request) => request(axios, basePath));
        },
        /**
         * Return a list of all systems.
         * @summary List Systems
         * @param {number} [page] What entry offset to request
         * @param {number} [limit] How many entries to return per page
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getSystems(page?: number, limit?: number, options?: any): AxiosPromise<GetSystems200Response> {
            return localVarFp.getSystems(page, limit, options).then((request) => request(axios, basePath));
        },
        /**
         * View the details of a waypoint.
         * @summary Get Waypoint
         * @param {string} systemSymbol The system symbol
         * @param {string} waypointSymbol The waypoint symbol
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getWaypoint(systemSymbol: string, waypointSymbol: string, options?: any): AxiosPromise<GetWaypoint200Response> {
            return localVarFp.getWaypoint(systemSymbol, waypointSymbol, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * SystemsApi - object-oriented interface
 * @export
 * @class SystemsApi
 * @extends {BaseAPI}
 */
export class SystemsApi extends BaseAPI {
    /**
     * Get jump gate details for a waypoint.
     * @summary Get Jump Gate
     * @param {string} systemSymbol The system symbol
     * @param {string} waypointSymbol The waypoint symbol
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SystemsApi
     */
    public getJumpGate(systemSymbol: string, waypointSymbol: string, options?: AxiosRequestConfig) {
        return SystemsApiFp(this.configuration).getJumpGate(systemSymbol, waypointSymbol, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieve imports, exports and exchange data from a marketplace. Imports can be sold, exports can be purchased, and exchange goods can be purchased or sold. Send a ship to the waypoint to access trade good prices and recent transactions.
     * @summary Get Market
     * @param {string} systemSymbol The system symbol
     * @param {string} waypointSymbol The waypoint symbol
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SystemsApi
     */
    public getMarket(systemSymbol: string, waypointSymbol: string, options?: AxiosRequestConfig) {
        return SystemsApiFp(this.configuration).getMarket(systemSymbol, waypointSymbol, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get the shipyard for a waypoint. Send a ship to the waypoint to access ships that are currently available for purchase and recent transactions.
     * @summary Get Shipyard
     * @param {string} systemSymbol The system symbol
     * @param {string} waypointSymbol The waypoint symbol
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SystemsApi
     */
    public getShipyard(systemSymbol: string, waypointSymbol: string, options?: AxiosRequestConfig) {
        return SystemsApiFp(this.configuration).getShipyard(systemSymbol, waypointSymbol, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get the details of a system.
     * @summary Get System
     * @param {string} systemSymbol The system symbol
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SystemsApi
     */
    public getSystem(systemSymbol: string, options?: AxiosRequestConfig) {
        return SystemsApiFp(this.configuration).getSystem(systemSymbol, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Fetch all of the waypoints for a given system. System must be charted or a ship must be present to return waypoint details.
     * @summary List Waypoints
     * @param {string} systemSymbol The system symbol
     * @param {number} [page] What entry offset to request
     * @param {number} [limit] How many entries to return per page
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SystemsApi
     */
    public getSystemWaypoints(systemSymbol: string, page?: number, limit?: number, options?: AxiosRequestConfig) {
        return SystemsApiFp(this.configuration).getSystemWaypoints(systemSymbol, page, limit, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Return a list of all systems.
     * @summary List Systems
     * @param {number} [page] What entry offset to request
     * @param {number} [limit] How many entries to return per page
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SystemsApi
     */
    public getSystems(page?: number, limit?: number, options?: AxiosRequestConfig) {
        return SystemsApiFp(this.configuration).getSystems(page, limit, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * View the details of a waypoint.
     * @summary Get Waypoint
     * @param {string} systemSymbol The system symbol
     * @param {string} waypointSymbol The waypoint symbol
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SystemsApi
     */
    public getWaypoint(systemSymbol: string, waypointSymbol: string, options?: AxiosRequestConfig) {
        return SystemsApiFp(this.configuration).getWaypoint(systemSymbol, waypointSymbol, options).then((request) => request(this.axios, this.basePath));
    }
}
