FROM node AS builder

WORKDIR /frontend

COPY . .

RUN npm i
RUN npm run build


FROM nginx:perl

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /frontend/dist .
COPY --from=builder /frontend/nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT nginx -g 'daemon off;'

