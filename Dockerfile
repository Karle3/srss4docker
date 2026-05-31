#
# Nana techWorld
# https://www.youtube.com/watch?v=pg19Z8LL06w
# https://www.youtube.com/watch?v=pg19Z8LL06w

# Docker directives are UpperCASE:
# https://docs.docker.com/reference/dockerfile

# https://de.wikipedia.org/wiki/Alpine_Linux
# https://www.alpinelinux.org/

# BaseImage for NodeJS from docker-hub
# https://hub.docker.com/_/node
# instead docker pull node:24-alpine
#
FROM node:24-alpine

WORKDIR /

# Copy dependencies into folder of container
COPY package.json .

# Satisfy dependencies of the js-appl (based on package.json)
RUN npm install

# Copy js-appl to working folder of container
COPY srss.js .

# start NodeJS with js-appl
CMD ["node", "srss.js"]

# ================================================================
# On CLI: BUILD the image from this definiton file
# docker build -t nana:1.0.0 -f Dockerfile  --- klappt nicht!

#
# docker build -t nana  .
# On CLI: RUN :
# docker run nana
