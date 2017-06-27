FROM alekzonder/pm2:6.10-alpine

WORKDIR /app

COPY src /app/src
COPY package.json /app/package.json
COPY index.js /app/index.js
COPY yarn.lock /app/yarn.lock

RUN yarn --production

CMD ["pm2-docker", "index.js"]

EXPOSE 3000
