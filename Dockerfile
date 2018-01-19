FROM node:0.10-onbuild

RUN npm install
RUN ./bin/jsbin

EXPOSE 3000
