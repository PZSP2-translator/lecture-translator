#!/bin/bash
echo "starting"
server_ip=$(ip -4 addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}')

if [ -z "$server_ip" ]; then
  echo "No IP address found for eth0 interface"
  exit 1
fi
export SERVER_IP=$server_ip
docker-compose up --build