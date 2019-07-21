#!/bin/bash

lsof -n -i:8080 | grep LISTEN | awk '{ print $2 }' | xargs kill
lsof -n -i:3000 | grep LISTEN | awk '{ print $2 }' | xargs kill
# lsof -n -i:3001 | grep LISTEN | awk '{ print $2 }' | xargs kill

docker kill $(docker ps -q) || :
docker rm $(docker ps -aq) || :
docker rmi $(docker images dev-* -q) || :