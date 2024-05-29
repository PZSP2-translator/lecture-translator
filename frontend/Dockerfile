FROM node:21-alpine3.18

WORKDIR /frontend

COPY . .

# remove the bash installation for "release"
RUN apk add bash


RUN chmod +x change_ip.sh
RUN chmod +x entrypoint.sh

ENTRYPOINT ["/frontend/entrypoint.sh"]