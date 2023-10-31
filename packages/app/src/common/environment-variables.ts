

function assert(variable: string | undefined) {
  if (!variable) {
    throw new Error("Environment variable not set")
  }
  return variable
}

export const environmentVariables = {
  agentName: assert(process.env.AGENT_NAME),
  agentEmail: assert(process.env.AGENT_EMAIL),
  agentFaction: assert(process.env.AGENT_FACTION),
  apiEndpoint: assert(process.env.API_ENDPOINT),
  accountEmail: assert(process.env.ACCOUNT_EMAIL),
  jwtSecret: assert(process.env.JWT_SECRET),
  databaseUrl: assert(process.env.DATABASE_URL),
  backgroundRateLimit: assert(process.env.BACKGROUND_RATELIMIT),
  foregroundRateLimit: assert(process.env.FOREGROUND_RATELIMIT),
  redisPort : assert(process.env.REDIS_PORT),
  redisHost : assert(process.env.REDIS_HOST),
}