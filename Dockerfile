FROM ubuntu:15.04
MAINTAINER Josh Burns <mail@joshburns.ml>

# Install Node
RUN sudo apt-get update
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN sudo apt-get install nodejs
RUN sudo apt-get install build-essential

# Add application to container filesystem
ADD . /var/www

