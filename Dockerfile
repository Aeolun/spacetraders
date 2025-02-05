ARG NODE_VERSION=22

FROM node:${NODE_VERSION} as base
ENV WORKDIR /opt
WORKDIR $WORKDIR

RUN npm install -g pnpm@^9.0.0
RUN apt update && apt install -y build-essential git curl python3

FROM base AS build

COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY packages/app/package.json packages/app/
COPY packages/spacetraders-sdk/package.json packages/spacetraders-sdk/

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm deploy --filter @spacetraders/app /build/

FROM base AS runner

COPY --from=build /build/ ./

EXPOSE 4001

ENV PORT 4001

ENV NODE_ENV production

ENV AGENT_NAME "PHANTASM"
ENV AGENT_EMAIL ""
ENV AGENT_FACTION "GALACTIC"
ENV DATABASE_URL ""
ENV API_ENDPOINT "https://api.spacetraders.io/v2/"

CMD ["pnpm", "run", "dev"]
