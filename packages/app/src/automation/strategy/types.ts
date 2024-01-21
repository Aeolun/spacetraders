export type LocationWithSystemSpecifier = {
	system: {
		symbol: string;
		x: number;
		y: number;
	};
}

export type LocationWithWaypointSpecifier = LocationWithSystemSpecifier & {
	waypoint: {
		symbol: string;
		x: number;
		y: number;
	};
}

export type LocationSpecifier = LocationWithSystemSpecifier & Partial<LocationWithWaypointSpecifier>

export type Location =
	| LocationSpecifier
	| "self";

export const isLocationWithWaypoint = (location: Location): location is LocationWithWaypointSpecifier => {
	return typeof location !== 'string' && location.waypoint !== undefined;
}
