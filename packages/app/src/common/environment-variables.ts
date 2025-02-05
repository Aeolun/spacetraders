function assert(variable: string | undefined, name: string = "variable") {
	if (!variable) {
		throw new Error(`Environment variable ${name} not set`);
	}
	return variable;
}

export const environmentVariables = {
	agentName: assert(process.env.AGENT_NAME, "AGENT_NAME"),
	agentEmail: assert(process.env.AGENT_EMAIL, "AGENT_EMAIL"),
	agentFaction: assert(process.env.AGENT_FACTION, "AGENT_FACTION"),
	apiEndpoint: assert(process.env.API_ENDPOINT, "API_ENDPOINT"),
	accountEmail: assert(process.env.ACCOUNT_EMAIL, "ACCOUNT_EMAIL"),
	jwtSecret: assert(process.env.JWT_SECRET, "JWT_SECRET"),
	databaseUrl: assert(process.env.DATABASE_URL, "DATABASE_URL"),
	backgroundRateLimit: assert(
		process.env.BACKGROUND_RATELIMIT,
		"BACKGROUND_RATELIMIT",
	),
	foregroundRateLimit: assert(
		process.env.FOREGROUND_RATELIMIT,
		"FOREGROUND_RATELIMIT",
	),
	redisPort: assert(process.env.REDIS_PORT, "REDIS_PORT"),
	redisHost: assert(process.env.REDIS_HOST, "REDIS_HOST"),
};
