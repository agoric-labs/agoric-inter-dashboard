# tendermint-source
FROM golang:1.20 as build-tendermint-source

WORKDIR /app

COPY tendermint-source/go.* .
RUN go mod download && go mod verify

COPY ./tendermint-source .
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 \
 go build -ldflags="-w -s" -o "bin/tendermint-source" .

# http-processor
FROM golang:1.20 as build-http-processor

WORKDIR /app

COPY http-processor/go.* .
RUN go mod download && go mod verify

COPY ./http-processor .
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 \
 go build -ldflags="-w -s" -o "bin/http-processor" .

# tendermint-trigger
FROM golang:1.20 as build-tendermint-trigger

WORKDIR /app

COPY tendermint-trigger/go.* .
RUN go mod download && go mod verify

COPY ./tendermint-trigger .
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 \
 go build -ldflags="-w -s" -o "bin/tendermint-trigger" .

# bqreader
FROM golang:1.20 as build-bqreader

WORKDIR /app

COPY bqreader/go.* .
RUN go mod download && go mod verify

COPY ./bqreader .
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 \
 go build -ldflags="-w -s" -o "bin/bqreader" .

# build agd for Agoric with a txdecode command
FROM golang:1.20 as agoric

COPY patches/0001-feat-add-a-txdecode-command.patch /patch.patch

RUN curl -s https://deb.nodesource.com/setup_18.x | bash \
 && apt update && apt install -y nodejs \
 && npm install -g yarn \
 && git clone --branch mainnet1B-rc3 https://github.com/Agoric/agoric-sdk \
 && cd agoric-sdk \
 && git apply /patch.patch \
 && yarn && yarn build \
 && cd packages/cosmic-swingset \
 && make build-chain

# final image
FROM python:3.11.6

ENV PATH="/app/bin:$PATH"
WORKDIR /app

COPY patches/target-bigquery.patch /target-bigquery.patch

RUN apt update \
 && apt install -y jq curl git \
 && pip install requests z3-target-bigquery ujson \
 && cd /usr/local/lib/python3.9/site-packages \
 && git apply /target-bigquery.patch

COPY --from=agoric /go/agoric-sdk/golang/cosmos/build/agd /app/bin/agd
COPY --from=build-tendermint-source /app/bin/* /app/bin/
COPY --from=build-http-processor /app/bin/* /app/bin/
COPY --from=build-tendermint-trigger /app/bin/* /app/bin/
COPY --from=fullstorydev/grpcurl:v1.8.7-alpine /bin/grpcurl /app/bin/
COPY --from=build-bqreader /app/bin/* /app/bin/
COPY tendermint-normalizer/main.py /app/bin/tendermint-normalizer
COPY balances-extractor/main.py /app/bin/balances-extractor
COPY coingeko-extractor/main.py /app/bin/coingeko-extractor
COPY *.catalog.json ./
COPY extract-* ./
