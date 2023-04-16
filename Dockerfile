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

# Set up env vars
ARG VERSION
ARG RELEASE_TIME
ARG GIT_REF
ARG GIT_COMMIT_SHA
ARG GIT_COMMIT_TIME
ARG GIT_REPO
ARG GIT_WORKFLOW_SHA

ENV NODE_ENV="production"
ENV VERSION=${VERSION}
ENV RELEASE_TIME=${RELEASE_TIME}
ENV GIT_REF=${GIT_REF}
ENV GIT_COMMIT_SHA=${GIT_COMMIT_SHA}
ENV GIT_COMMIT_TIME=${GIT_COMMIT_TIME}
ENV GIT_REPO=${GIT_REPO}
ENV GIT_WORKFLOW_SHA=${GIT_WORKFLOW_SHA}

# Set up user and group
RUN addgroup -g 1001 -S nodejs
RUN adduser -S service -u 1001

# update owner
RUN chown -R service:nodejs ./

# copy files
COPY --chown=service:nodejs --from=builder /usr/src/dist ./dist
COPY --from=builder /usr/src/node_modules ./node_modules
COPY --from=builder /usr/src/package.json ./package.json

# use user and create logs dir
USER service
RUN mkdir /usr/src/logs

EXPOSE 8000
CMD ["yarn", "start"]
