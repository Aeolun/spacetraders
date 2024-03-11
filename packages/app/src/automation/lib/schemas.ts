import z from "zod";

export const SystemSpecifierSchema = z.object({
  symbol: z.string(),
  x: z.number(),
  y: z.number()
});

export const WaypointSpecifierSchema = z.object({
  symbol: z.string(),
  x: z.number(),
  y: z.number()
});

export const LocationWithWaypointSpecifierSchema = z.object({
  system: SystemSpecifierSchema,
  waypoint: WaypointSpecifierSchema
});

export const ShipNavFlightModeSchema = z.union([z.literal('jump'), z.literal('CRUISE'), z.literal('DRIFT'), z.literal("BURN"), z.literal("STEALTH")]);