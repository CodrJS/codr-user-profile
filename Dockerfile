### Install the dependencies
FROM node:16-alpine as deps
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

### Build the code
FROM deps AS builder
WORKDIR /usr/src
COPY . .
RUN yarn build

### Run the code
FROM node:16-alpine
WORKDIR /usr/src

COPY --from=builder /usr/src/dist ./dist
COPY --from=builder /usr/src/node_modules ./node_modules
COPY --from=builder /usr/src/package.json ./package.json

RUN addgroup -g 1001 -S nodejs
RUN adduser -S service -u 1001
RUN chown -R service:nodejs /usr/src/dist
USER service

CMD ["yarn", "start"]