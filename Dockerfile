# Build-Stage
FROM node:22-alpine as build-stage

WORKDIR /app

COPY . ./
RUN npm ci
RUN npm install
RUN npm run build

# Production-Stage
FROM node:22-alpine as production-stage

WORKDIR /app

# Kopiere die gesamte App einschließlich der build-Dateien
COPY --from=build-stage /app /app

ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080

# Verwende nuxt start für SSR
CMD ["npm", "run", "start"]