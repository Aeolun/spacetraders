export function logShipAction(ship: string, action: string) {
    console.log(`${new Date().toISOString()} [${ship}] ${action}`)
}