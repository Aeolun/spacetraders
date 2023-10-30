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



/**
 * 
 * @export
 * @interface WaypointTrait
 */
export interface WaypointTrait {
    /**
     * The unique identifier of the trait.
     * @type {string}
     * @memberof WaypointTrait
     */
    'symbol': WaypointTraitSymbolEnum;
    /**
     * The name of the trait.
     * @type {string}
     * @memberof WaypointTrait
     */
    'name': string;
    /**
     * A description of the trait.
     * @type {string}
     * @memberof WaypointTrait
     */
    'description': string;
}

export const WaypointTraitSymbolEnum = {
    Uncharted: 'UNCHARTED',
    UnderConstruction: 'UNDER_CONSTRUCTION',
    Marketplace: 'MARKETPLACE',
    Shipyard: 'SHIPYARD',
    Outpost: 'OUTPOST',
    ScatteredSettlements: 'SCATTERED_SETTLEMENTS',
    SprawlingCities: 'SPRAWLING_CITIES',
    MegaStructures: 'MEGA_STRUCTURES',
    Overcrowded: 'OVERCROWDED',
    HighTech: 'HIGH_TECH',
    Corrupt: 'CORRUPT',
    Bureaucratic: 'BUREAUCRATIC',
    TradingHub: 'TRADING_HUB',
    Industrial: 'INDUSTRIAL',
    BlackMarket: 'BLACK_MARKET',
    ResearchFacility: 'RESEARCH_FACILITY',
    MilitaryBase: 'MILITARY_BASE',
    SurveillanceOutpost: 'SURVEILLANCE_OUTPOST',
    ExplorationOutpost: 'EXPLORATION_OUTPOST',
    MineralDeposits: 'MINERAL_DEPOSITS',
    CommonMetalDeposits: 'COMMON_METAL_DEPOSITS',
    PreciousMetalDeposits: 'PRECIOUS_METAL_DEPOSITS',
    RareMetalDeposits: 'RARE_METAL_DEPOSITS',
    MethanePools: 'METHANE_POOLS',
    IceCrystals: 'ICE_CRYSTALS',
    ExplosiveGases: 'EXPLOSIVE_GASES',
    StrongMagnetosphere: 'STRONG_MAGNETOSPHERE',
    VibrantAuroras: 'VIBRANT_AURORAS',
    SaltFlats: 'SALT_FLATS',
    Canyons: 'CANYONS',
    PerpetualDaylight: 'PERPETUAL_DAYLIGHT',
    PerpetualOvercast: 'PERPETUAL_OVERCAST',
    DrySeabeds: 'DRY_SEABEDS',
    MagmaSeas: 'MAGMA_SEAS',
    Supervolcanoes: 'SUPERVOLCANOES',
    AshClouds: 'ASH_CLOUDS',
    VastRuins: 'VAST_RUINS',
    MutatedFlora: 'MUTATED_FLORA',
    Terraformed: 'TERRAFORMED',
    ExtremeTemperatures: 'EXTREME_TEMPERATURES',
    ExtremePressure: 'EXTREME_PRESSURE',
    DiverseLife: 'DIVERSE_LIFE',
    ScarceLife: 'SCARCE_LIFE',
    Fossils: 'FOSSILS',
    WeakGravity: 'WEAK_GRAVITY',
    StrongGravity: 'STRONG_GRAVITY',
    CrushingGravity: 'CRUSHING_GRAVITY',
    ToxicAtmosphere: 'TOXIC_ATMOSPHERE',
    CorrosiveAtmosphere: 'CORROSIVE_ATMOSPHERE',
    BreathableAtmosphere: 'BREATHABLE_ATMOSPHERE',
    ThinAtmosphere: 'THIN_ATMOSPHERE',
    Jovian: 'JOVIAN',
    Rocky: 'ROCKY',
    Volcanic: 'VOLCANIC',
    Frozen: 'FROZEN',
    Swamp: 'SWAMP',
    Barren: 'BARREN',
    Temperate: 'TEMPERATE',
    Jungle: 'JUNGLE',
    Ocean: 'OCEAN',
    Radioactive: 'RADIOACTIVE',
    MicroGravityAnomalies: 'MICRO_GRAVITY_ANOMALIES',
    DebrisCluster: 'DEBRIS_CLUSTER',
    DeepCraters: 'DEEP_CRATERS',
    ShallowCraters: 'SHALLOW_CRATERS',
    UnstableComposition: 'UNSTABLE_COMPOSITION',
    HollowedInterior: 'HOLLOWED_INTERIOR',
    Stripped: 'STRIPPED'
} as const;

export type WaypointTraitSymbolEnum = typeof WaypointTraitSymbolEnum[keyof typeof WaypointTraitSymbolEnum];


