ARG NODE_VERSION=18.16.1

FROM node:${NODE_VERSION}-alpine as runtime
ENV WORKDIR /opt
WORKDIR $WORKDIR

RUN npm install -g pnpm
RUN apk update && apk add build-base git curl
RUN apk add --no-cache python3 build-base
RUN npm install -g pm2

COPY packages/ .

WORKDIR $WORKDIR/packages/app
RUN pnpm install --prod



EXPOSE 4001
ENV PORT 4001
ENV NODE_ENV production
ENV AGENT_NAME "PHANTASM"
ENV AGENT_EMAIL ""
ENV AGENT_FACTION "GALACTIC"
ENV DATABASE_URL ""
ENV API_ENDPOINT "https://api.spacetraders.io/v2/"

CMD ["pm2-runtime", "start", "npm", "--env", "production", "--", "start"]
