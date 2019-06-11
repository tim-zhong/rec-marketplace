#!/bin/bash
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


# HELPER TO PRINT STEP HEAPER
printHeader () {
  printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
  echo $1
  printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
}

# REMOVE EXISTING REST SERVER, PLAYGROUND ETC
printHeader "REMOVE EXISTING REST SERVER, PLAYGROUND ETC"

lsof -n -i:8080 | grep LISTEN | awk '{ print $2 }' | xargs kill
lsof -n -i:3000 | grep LISTEN | awk '{ print $2 }' | xargs kill

docker kill $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images dev-* -q)

DIR="$(pwd)"

# GET AND SETUP FABRIC
printHeader "GET AND SETUP FABRIC"
export FABRIC_VERSION=hlfv12

rm -rf $DIR/fabric-tools
mkdir $DIR/fabric-tools
chmod 777 $DIR/fabric-tools
cd $DIR/fabric-tools

curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.tar.gz
tar -xvf $DIR/fabric-tools/fabric-dev-servers.tar.gz

$DIR/fabric-tools/stopFabric.sh
$DIR/fabric-tools/teardownFabric.sh
$DIR/fabric-tools/downloadFabric.sh
$DIR/fabric-tools/startFabric.sh
$DIR/fabric-tools/createPeerAdminCard.sh


# DELETE ANY EXISTING BUSINESS NETWORK CARDS 
printHeader "DELETE ANY EXISTING BUSINESS NETWORK CARDS"
rm -fr ~/.composer
composer card delete -c PeerAdmin@fabric-network
composer card delete -c admin@rec-biznet
echo "Don't worry if there're errors here. The cards we're deleting might not exist."

cd $DIR


# CREATE PEER ADMIN CARD AND IMPORT
printHeader "CREATE PEER ADMIN CARD AND IMPORT"
# CREATE LOCATION FOR LOCAL CARD STORE
rm -rf $(pwd)/.loc-card-store
mkdir $(pwd)/.loc-card-store
chmod 777 $(pwd)/.loc-card-store


# CREATE CONNECTION PROFILE
rm -fr $(pwd)/loc-stage
mkdir $(pwd)/loc-stage
chmod 777 $(pwd)/loc-stage
echo '{
    "name": "fabric-network",
    "x-type": "hlfv1",
    "version": "1.0.0",
    "peers": {
        "peer0.org1.example.com": {
            "url": "grpc://localhost:7051"
        }
    },
    "certificateAuthorities": {
        "ca.org1.example.com": {
            "url": "http://localhost:7054",
            "caName": "ca.org1.example.com"
        }
    },
    "orderers": {
        "orderer.example.com": {
            "url": "grpc://localhost:7050"
        }
    },
    "organizations": {
        "Org1": {
            "mspid": "Org1MSP",
            "peers": [
                "peer0.org1.example.com"
            ],
            "certificateAuthorities": [
                "ca.org1.example.com"
            ]
        }
    },
    "channels": {
        "composerchannel": {
            "orderers": [
                "orderer.example.com"
            ],
            "peers": {
                "peer0.org1.example.com": {
                    "endorsingPeer": true,
                    "chaincodeQuery": true,
                    "eventSource": true
                }
            }
        }
    },
    "client": {
        "organization": "Org1",
        "connection": {
            "timeout": {
                "peer": {
                    "endorser": "300",
                    "eventHub": "300",
                    "eventReg": "300"
                },
                "orderer": "300"
            }
        }
    }
}' > $(pwd)/loc-stage/connection.json


# CREATE A BUSINESS NETWORK CARD FOR THE HYPERLEDGER FABRIC ADMIN
printHeader "CREATE A BUSINESS NETWORK CARD FOR THE HYPERLEDGER FABRIC ADMIN"
ADMIN_DIR="$DIR/fabric-tools/fabric-scripts/hlfv12/composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp"
composer card create \
-p $(pwd)/loc-stage/connection.json \
-u PeerAdmin \
-c $ADMIN_DIR/signcerts/Admin@org1.example.com-cert.pem \
-k $ADMIN_DIR/keystore/114aab0e76bf0c78308f89efc4b8c9423e31568da0c340ca187a9b17aa9a4457_sk \
-r PeerAdmin \
-r ChannelAdmin


# IMPORT THE BUSINESS NETWORK CARD FOR THE HYPERLEDGER FABRIC ADMIN
printHeader "IMPORT THE BUSINESS NETWORK CARD FOR THE HYPERLEDGER FABRIC ADMIN"
composer card import -f PeerAdmin@fabric-network.card


# PACKAGE THE BUSINESS NETWORK
printHeader "PACKAGE THE BUSINESS NETWORK"
cd $DIR/biznet
composer archive create -a rec-biznet.bna -t dir -n .
cd $DIR
cp $DIR/biznet/rec-biznet.bna rec-biznet.bna


# INSTALL THE BNA
printHeader "INSTALL THE BNA"
composer network install -c PeerAdmin@fabric-network -a rec-biznet.bna

NETWORK_VERSION=$(grep -o '"version": *"[^"]*"' $DIR/biznet/package.json | grep -o '[0-9]\.[0-9]\.[0-9]')


# START THE BNA
printHeader "START THE BNA"
composer network start \
--networkName rec-biznet \
--networkVersion $NETWORK_VERSION \
-A admin \
-S adminpw \
-c PeerAdmin@fabric-network


# IMPORT THE BUSINESS NETWORK CARD FOR THE BUSINESS NETWORK ADMIN
printHeader "IMPORT THE BUSINESS NETWORK CARD FOR THE BUSINESS NETWORK ADMIN"
composer card import -f admin@rec-biznet.card


# TEST CONNECTION
printHeader "TEST CONNECTION"
composer network ping -c admin@rec-biznet

# START PLAYGROUND
printHeader "START PLAYGROUND"
composer-playground &
echo "WAIT FOR PLAYGROUND TO WAKE UP"
sleep 5


# START REST API
printHeader "START REST API"
composer-rest-server -c admin@rec-biznet -n never -w true &
echo "WAIT FOR REST API TO WAKE UP"
sleep 10


# START THE LOC APPLICATION
# docker run \
# -d \
# --network composer_default \
# --name vda \
# -e REACT_APP_REST_SERVER_CONFIG='{"webSocketURL": "ws://localhost:3000", "httpURL": "http://localhost:3000/api"}' \
# -p 6001:6001 \
# hyperledger/letters-of-credit:latest


# OPEN THE APPLICATION
URLS="http://localhost:3000/explorer/"
case "$(uname)" in
"Darwin") open ${URLS}
          ;;
"Linux")  if [ -n "$BROWSER" ] ; then
	       	        http://localhost:3000/explorer/
	        elif    which x-www-browser > /dev/null ; then
                  nohup x-www-browser ${URLS} < /dev/null > /dev/null 2>&1 &
          elif    which xdg-open > /dev/null ; then
                  for URL in ${URLS} ; do
                          xdg-open ${URL}
	                done
          elif  	which gnome-open > /dev/null ; then
	                gnome-open http://localhost:3000/explorer/
	        else
    	            echo "Could not detect web browser to use - please launch Application and Composer Playground URL using your chosen browser ie: <browser executable name> http://localhost:8080 or set your BROWSER variable to the browser launcher in your PATH"
	        fi
          ;;
*)        echo "Playground not launched - this OS is currently not supported "
          ;;
esac
