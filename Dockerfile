FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . ./

RUN yarn build

# prod env stores the entities precompiled in dist folder!
ENV TYPEORM_ENTITIES "dist/**/**.entity.js"
ENV TYPEORM_CONNECTION "postgres"
ENV TYPEORM_MIGRATIONS "src/migrations/**/*.ts"
ENV TYPEORM_MIGRATIONS_DIR "src/migrations"
ENV TYPEORM_MIGRATIONS_TABLE_NAME "nest_migrations"

ENV PORT 3000

EXPOSE 3000

CMD [ "yarn", "start:prod" ]
