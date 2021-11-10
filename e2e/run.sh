#!/bin/bash

# this script is only for using in workspaces!!!
APP_PORT=$(wb elektra 'echo $APP_PORT' | tail -1 | tr -d '\r') 
HOST="http://localhost:$APP_PORT"
SPECS_FOLDER="cypress/integration/**/*"

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -h|--host)
    HOST="$2"
    shift # past argument
    shift # past value
    ;;
    *)    # test folder
    SPECS_FOLDER="cypress/integration/$2/*"
    shift # past argument
    ;;
esac
done

echo "HOST           = ${HOST}"
echo "SPECS FOLDER   = ${SPECS_FOLDER}"

docker run --rm -it -v "$PWD:/e2e" -w /e2e --network=host -e CYPRESS_baseUrl="$HOST" keppel.eu-de-1.cloud.sap/ccloud-dockerhub-mirror/cypress/included:7.1.0 --spec "$SPECS_FOLDER"
