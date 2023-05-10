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


// May contain unused imports in some cases
// @ts-ignore
import { ShipRequirements } from './ship-requirements';

/**
 * The reactor of the ship. The reactor is responsible for powering the ship\'s systems and weapons.
 * @export
 * @interface ShipReactor
 */
export interface ShipReactor {
    /**
     * 
     * @type {string}
     * @memberof ShipReactor
     */
    'symbol': ShipReactorSymbolEnum;
    /**
     * 
     * @type {string}
     * @memberof ShipReactor
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof ShipReactor
     */
    'description': string;
    /**
     * Condition is a range of 0 to 100 where 0 is completely worn out and 100 is brand new.
     * @type {number}
     * @memberof ShipReactor
     */
    'condition'?: number;
    /**
     * 
     * @type {number}
     * @memberof ShipReactor
     */
    'powerOutput': number;
    /**
     * 
     * @type {ShipRequirements}
     * @memberof ShipReactor
     */
    'requirements': ShipRequirements;
}

export const ShipReactorSymbolEnum = {
    SolarI: 'REACTOR_SOLAR_I',
    FusionI: 'REACTOR_FUSION_I',
    FissionI: 'REACTOR_FISSION_I',
    ChemicalI: 'REACTOR_CHEMICAL_I',
    AntimatterI: 'REACTOR_ANTIMATTER_I'
} as const;

export type ShipReactorSymbolEnum = typeof ShipReactorSymbolEnum[keyof typeof ShipReactorSymbolEnum];


