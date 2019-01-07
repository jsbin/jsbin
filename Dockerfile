FROM node

RUN mkdir -p /usr/src/node

WORKDIR /usr/src/node

COPY . /usr/src/node/jsbin

WORKDIR /usr/src/node/jsbin

# RUN npm install --registry=https://registry.npm.taobao.org

EXPOSE 3000

CMD ["./bin/jsbin"]
