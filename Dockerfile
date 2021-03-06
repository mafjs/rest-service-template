FROM alekzonder/pm2:6.10-alpine

WORKDIR /app

COPY src /app/src
COPY package.json /app/package.json
COPY index.js /app/index.js
COPY yarn.lock /app/yarn.lock

RUN yarn install --production && yarn cache clean

CMD ["pm2-docker", "--raw", "index.js"]

EXPOSE 3000
