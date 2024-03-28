FROM node:16-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .

ARG VITE_BASE_URL
ENV VITE_BASE_URL $VITE_BASE_URL

RUN yarn build --mode production

FROM nginx:1.25-alpine
WORKDIR /app
COPY nginx-boot.sh /sbin/nginx-boot
COPY --from=build /app/dist /usr/share/nginx/html
CMD [ "/sbin/nginx-boot" ]
