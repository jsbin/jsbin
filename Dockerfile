FROM ubuntu:14.10
MAINTAINER Josh Burns <mail@joshburns.ml>

# Install Node
RUN sudo apt-get update
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN sudo apt-get install nodejs
RUN sudo apt-get install build-essential

# Add application to container filesystem
ADD . /var/www

# Create local config
WORKDIR /var/www

# Setup Enviroment
RUN npm install --dev

EXPOSE 8000

RUN cp config.default.json config.local.json

# Setup ENV vars and run application
# RUN (sleep 5 && echo "JSBIN server started on localhost:8000") PORT=8000 JSBIN_CONFIG=./config.local.json ./bin/jsbin
