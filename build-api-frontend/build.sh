#!/bin/bash
if [ $# -eq 0 ]
  then
    echo "The script needs the ip adress of your computer in network you want website to be accessible from"
    exit 0
fi
echo The server ip is "$1"
server_ip=$1
export SERVER_IP=$server_ip
docker-compose up --build