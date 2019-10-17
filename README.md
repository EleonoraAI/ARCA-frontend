# ARCA-frontend
Experimental front-end for the ARCA project

## Run locally

### Prerequisites
- nodejs
- npm

### Install dependencies
`npm install`

### Run
`SPARQL_ENDPOINT=<local_sparql_endpoint> npm start`

For example:

**macOS**
`SPARQL_ENDPOINT=http://localhost:9999/blazegraph/namespace/ARCA_triple_store/sparql npm start`
go to : http://0.0.0.0:5000/

**WIN**
`set SPARQL_ENDPOINT=http://localhost:9999/blazegraph/namespace/ARCA_triple_store/sparql`
`npm start`
go to : http://127.0.0.1:5000/


## Run with Docker (recommended)

### Prerequisites
- docker

### Docker build and launch container
#### Download image
`docker pull eleonorai/arca-front-end`
Build container and launch it for the first time
docker run -d -p 127.0.0.1:5000:5000/tcp --name arca-front-end eleonorai/arca-front-end

### Container management
#### Stop container
`docker stop arca-front-end`
#### Start container
`docker start arca-front-end`
go to http://localhost:5000/
