# Agoric Indexer and Dashboard

This project provides a comprehensive tool for extracting and visualizing Agoric Network data. It extracts per-block data from Tendermint and other relevant sources, loads it in data warehaouse (Google BigQuery by default), provides a semantic layout and a REST API for loaded data and then builds a visualization dashboard on top of this API.

Semantic layout and visualiation dashboard refer to Inter Protocol smart contract in Agoric blockchain. Indexed block data refers to all data in the network.

Technologies used for this solution are following:

* Block indexer – a custom set of extractors from Tendermint-compatible networks with defined relational schema for extracted data. Golang-based.
* Semantic layout and REST API – cube.js as data transformation layaer
* Data warehouse – Google BigQuery
* Visualisation Dashboard – React application based on Shadcn UI kit

# Repository layout

This repository consists of following directories:

* `cube` – cube.js model definitions
* `dashboard` – React visualisation dashboard
* `docs` – documentation
* `http-processor` – ???? Почему здесь лежит txdecode?
* `patches` – ????
* `tendermint-normalizer` – ????
* `tendermint-source` – ???
* `tendermint-trigger` – ????

# Architecture

# Quickstart

## Configuration

The main configuration is passed to services as environmental variables. Example configuration can be found in `.env.example` file. To prepare configuration from an example file

```
cp .env.example .env # and put settings
```

## Running docker-compose

This repository is shipped with docker compose config and can be started with the following commands:

```
# Build and run containers
docker-compose up
```

On start up the indexer will start processing Agoric blocks from genesis to head using RPC nodes listed in configuration file. You can immediately check extracted data here:

* Dashboard: http://localhost:8080
* Cube Playground: http://localhost:4000

All other aspects of the indexation process can be analysed checking logs in docker-compose stdout.

# REST API

## Cube.js queries

## Cube.js API docs

# Development

## Subsystems detailed description


## Running tests

## Running linters

# Deploy