# Agoric Indexer & Dashboard

This project provides a comprehensive tool for extracting and visualizing Cosmos Network data:

 - Extractor: Extracts data from Tendermint and other relevant sources.
 - [Cube](https://cube.dev): Provides a semantic layout and an API for structured data access.
 - React Dashboard: Visualizes the data in an interactive interface.

## Get Started

```
cp .env.example .env
docker-compose up head-indexer tail-indexer --build
```

## Documentation

 - [Architecture](./docs/architecture.md)
 - [Requests](./docs/requests.md)
 - [Deploy](./docs/deploy.md)

## Get started

```
cp .env.example .env # and put settings
docker-compose up
```

Endpoints:

 - Dashboard: [http://localhost:8080](http://localhost:8080)
 - Cube Playground: [http://localhost:4000](http://localhost:4000)
