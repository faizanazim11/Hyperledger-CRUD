Minikube Portion of the Readme
=====================================

## Kubernetes - Minikube (Local)
[Install Kubernetes and Minikube](https://kubernetes.io/docs/tasks/tools/)
[If OSX here is virtual box](https://www.virtualbox.org/wiki/Mac%20OS%20X%20build%20instructions)
[Kubernetes book](https://www.amazon.com/Devops-2-3-Toolkit-Viktor-Farcic/dp/1789135508/ref=tmm_pap_swatch_0?_encoding=UTF8&sr=8-2)
[K8s Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

Okay, now that we've successfully ran the network locally, let's do this on a local kubernetes installation.
```bash
minikube start --memory=4g --cpus=4
sleep 5
kubectl apply -f network/minikube/storage/pvc.yaml
sleep 10
kubectl apply -f network/minikube/storage/tests
```

Now we have storage and we're going to test it. You can do a kubectl get pods to see what pods are up. Here's how I can connect to my containers. You should split your terminal and connect to both.
```bash
☁  k8s-hyperledger-fabric-2.2 [master] ⚡  kubectl get pods
NAME                        READY   STATUS    RESTARTS   AGE
example1-6858b4f776-5pgls   1/1     Running   0          17s
example1-6858b4f776-q92vv   1/1     Running   0          17s
example2-55fcbb9cbd-drzwn   1/1     Running   0          17s
example2-55fcbb9cbd-sv4c8   1/1     Running   0          17s
☁  k8s-hyperledger-fabric-2.2 [master] ⚡ 
```

We'll use one of these to setup the files for the network
```bash
kubectl exec -it $(kubectl get pods -o=name | grep example1 | sed "s/^.\{4\}//") -- mkdir -p /host/files/scripts
kubectl exec -it $(kubectl get pods -o=name | grep example1 | sed "s/^.\{4\}//") -- mkdir -p /host/files/chaincode
sleep 1
kubectl cp ./scripts $(kubectl get pods -o=name | grep example1 | sed "s/^.\{4\}//"):/host/files/
kubectl cp ./network/minikube/configtx.yaml $(kubectl get pods -o=name | grep example1 | sed "s/^.\{4\}//"):/host/files
kubectl cp ./network/minikube/config.yaml $(kubectl get pods -o=name | grep example1 | sed "s/^.\{4\}//"):/host/files
kubectl cp ./chaincode/patient $(kubectl get pods -o=name | grep example1 | sed "s/^.\{4\}//"):/host/files/chaincode
kubectl cp ./fabric-samples/bin $(kubectl get pods -o=name | grep example1 | sed "s/^.\{4\}//"):/host/files
```

Let's bash into the container and make sure everything copied over properly
```bash
kubectl exec -it $(kubectl get pods -o=name | grep example1 | sed "s/^.\{4\}//") bash
```

Finally ready to start the ca containers
```bash
kubectl apply -f network/minikube/cas
```
# sleep 60
Your containers should be up and running. You can check the logs like so and it should look liek this.
```bash
☁  k8s-hyperledger-fabric-2.2 [master] ⚡  kubectl logs -f orderers-ca-d69cbc664-dzk4f
2020/12/11 04:12:37 [INFO] Created default configuration file at /etc/hyperledger/fabric-ca-server/fabric-ca-server-config.yaml
2020/12/11 04:12:37 [INFO] Starting server in home directory: /etc/hyperledger/fabric-ca-server
...
2020/12/11 04:12:38 [INFO] generating key: &{A:ecdsa S:256}
2020/12/11 04:12:38 [INFO] encoded CSR
2020/12/11 04:12:38 [INFO] signed certificate with serial number 307836600921505839273746385963411812465330101584
2020/12/11 04:12:38 [INFO] Listening on https://0.0.0.0:7054
```

This should generate the crypto-config files necessary for the network. You can check on those files in any of the containers.
```bash
root@example1-6858b4f776-wmlth:/host# cd files
root@example1-6858b4f776-wmlth:/host/files# ls
bin  chaincode	config.yaml  configtx.yaml  crypto-config  scripts
root@example1-6858b4f776-wmlth:/host/files# cd crypto-config/
root@example1-6858b4f776-wmlth:/host/files/crypto-config# ls
ordererOrganizations  peerOrganizations
root@example1-6858b4f776-wmlth:/host/files/crypto-config# cd peerOrganizations/
root@example1-6858b4f776-wmlth:/host/files/crypto-config/peerOrganizations# ls
doctor  cvh
root@example1-6858b4f776-wmlth:/host/files/crypto-config/peerOrganizations# cd doctor/
root@example1-6858b4f776-wmlth:/host/files/crypto-config/peerOrganizations/doctor# ls
msp  peers  users
root@example1-6858b4f776-wmlth:/host/files/crypto-config/peerOrganizations/doctor# cd msp/
root@example1-6858b4f776-wmlth:/host/files/crypto-config/peerOrganizations/doctor/msp# ls
IssuerPublicKey  IssuerRevocationPublicKey  admincerts	cacerts  keystore  signcerts  tlscacerts  user
root@example1-6858b4f776-wmlth:/host/files/crypto-config/peerOrganizations/doctor/msp# cd tlscacerts/
```

Time to generate the artifacts inside one of the containers and in the files folder - NOTE: if you are on OSX you might have to load the proper libs `curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.1 1.4.7` (apt update then apt install curl) (you will also need to cp from (this path will depend on where you are in the container) cp bin/* /host/files/bin)
```bash
kubectl exec -it $(kubectl get pods -o=name | grep example1 | sed "s/^.\{4\}//") bash
...
cd /host/files

rm -rf orderer channels
mkdir -p orderer channels
bin/configtxgen -profile OrdererGenesis -channelID syschannel -outputBlock ./orderer/genesis.block
bin/configtxgen -profile MainChannel -outputCreateChannelTx ./channels/mainchannel.tx -channelID mainchannel
bin/configtxgen -profile MainChannel -outputAnchorPeersUpdate ./channels/doctor-anchors.tx -channelID mainchannel -asOrg doctor
bin/configtxgen -profile MainChannel -outputAnchorPeersUpdate ./channels/cvh-anchors.tx -channelID mainchannel -asOrg cvh
```

Let's try to start up the orderers
```bash
kubectl apply -f network/minikube/orderers
```
# sleep 50
Go ahead and check the logs and see that the orderers have selected a leader like so
```bash
 1 became follower at term 2 channel=syschannel node=1
2020-12-11 05:20:15.616 UTC [orderer.consensus.etcdraft] Step -> INFO 029 1 [logterm: 1, index: 3, vote: 0] cast MsgVote for 2 [logterm: 1, index: 3] at term 2 channel=syschannel node=1
2020-12-11 05:20:15.634 UTC [orderer.consensus.etcdraft] run -> INFO 02a raft.node: 1 elected leader 2 at term 2 channel=syschannel node=1
2020-12-11 05:20:15.639 UTC [orderer.consensus.etcdraft] run -> INFO 02b Raft leader changed: 0 -> 2 channel=syschannel node=1
```

We should be able to start the peers now
```bash
kubectl apply -f network/minikube/orgs/doctor/couchdb 
kubectl apply -f network/minikube/orgs/cvh/couchdb
# sleep 50
kubectl apply -f network/minikube/orgs/doctor/
kubectl apply -f network/minikube/orgs/cvh/

kubectl apply -f network/minikube/orgs/doctor/cli
kubectl apply -f network/minikube/orgs/cvh/cli
kubectl delete -f network/minikube/storage/tests
```

NOTE: you can stop the cas if you don't need them anymore (don't do this if you want to continue making certs later)
- minikube only has so many resources so sometimes when testing you might need to decide what containers are more important
```bash
kubectl delete -f network/minikube/cas
```


Time to actually test the network
```bash
kubectl exec -it $(kubectl get pods -o=name | grep cli-peer0-doctor-deployment | sed "s/^.\{4\}//") -- bash -c 'peer channel create -c mainchannel -f ./channels/mainchannel.tx -o orderer0-service:7050 --tls --cafile=/etc/hyperledger/orderers/msp/tlscacerts/orderers-ca-service-7054.pem'

kubectl exec -it $(kubectl get pods -o=name | grep cli-peer0-doctor-deployment | sed "s/^.\{4\}//") -- bash -c 'cp mainchannel.block ./channels/'
kubectl exec -it $(kubectl get pods -o=name | grep cli-peer0-doctor-deployment | sed "s/^.\{4\}//") -- bash -c 'peer channel join -b channels/mainchannel.block'
kubectl exec -it $(kubectl get pods -o=name | grep cli-peer1-doctor-deployment | sed "s/^.\{4\}//") -- bash -c 'peer channel join -b channels/mainchannel.block'
kubectl exec -it $(kubectl get pods -o=name | grep cli-peer0-cvh-deployment | sed "s/^.\{4\}//") -- bash -c 'peer channel join -b channels/mainchannel.block'
kubectl exec -it $(kubectl get pods -o=name | grep cli-peer1-cvh-deployment | sed "s/^.\{4\}//") -- bash -c 'peer channel join -b channels/mainchannel.block'

sleep 5

kubectl exec -it $(kubectl get pods -o=name | grep cli-peer0-doctor-deployment | sed "s/^.\{4\}//") -- bash -c 'peer channel update -o orderer0-service:7050 --tls --cafile=/etc/hyperledger/orderers/msp/tlscacerts/orderers-ca-service-7054.pem -c mainchannel -f channels/doctor-anchors.tx'
kubectl exec -it $(kubectl get pods -o=name | grep cli-peer0-cvh-deployment | sed "s/^.\{4\}//") -- bash -c 'peer channel update -o orderer0-service:7050 --tls --cafile=/etc/hyperledger/orderers/msp/tlscacerts/orderers-ca-service-7054.pem -c mainchannel -f channels/cvh-anchors.tx'
```

```bash
kubectl exec -it $(kubectl get pods -o=name | grep cli-peer0-doctor-deployment | sed "s/^.\{4\}//") -- bash -c 'peer lifecycle chaincode package patient.tar.gz --path /opt/javapath/src/patient --lang java --label patient_1'
kubectl exec -it $(kubectl get pods -o=name | grep cli-peer1-doctor-deployment | sed "s/^.\{4\}//") -- bash -c 'peer lifecycle chaincode package patient.tar.gz --path /opt/javapath/src/patient --lang java --label patient_1'
kubectl exec -it $(kubectl get pods -o=name | grep cli-peer0-cvh-deployment | sed "s/^.\{4\}//") -- bash -c 'peer lifecycle chaincode package patient.tar.gz --path /opt/javapath/src/patient --lang java --label patient_1'
kubectl exec -it $(kubectl get pods -o=name | grep cli-peer1-cvh-deployment | sed "s/^.\{4\}//") -- bash -c 'peer lifecycle chaincode package patient.tar.gz --path /opt/javapath/src/patient --lang java --label patient_1'
Now we are going to install the chaincode - NOTE: Make sure you go mod vendor in each chaincode folder... might need to remove the go.sum depending

kubectl exec -it $(kubectl get pods -o=name | grep cli-peer0-doctor-deployment | sed "s/^.\{4\}//") -- bash -c 'peer lifecycle chaincode install patient.tar.gz &> pkg.txt'
kubectl exec -it $(kubectl get pods -o=name | grep cli-peer1-doctor-deployment | sed "s/^.\{4\}//") -- bash -c 'peer lifecycle chaincode install patient.tar.gz'
kubectl exec -it $(kubectl get pods -o=name | grep cli-peer0-cvh-deployment | sed "s/^.\{4\}//") -- bash -c 'peer lifecycle chaincode install patient.tar.gz &> pkg.txt'
kubectl exec -it $(kubectl get pods -o=name | grep cli-peer1-cvh-deployment | sed "s/^.\{4\}//") -- bash -c 'peer lifecycle chaincode install patient.tar.gz'

kubectl exec -it $(kubectl get pods -o=name | grep cli-peer0-doctor-deployment | sed "s/^.\{4\}//") -- bash -c 'peer lifecycle chaincode approveformyorg -o orderer0-service:7050 --tls --cafile=/etc/hyperledger/orderers/msp/tlscacerts/orderers-ca-service-7054.pem --channelID mainchannel --name patient --version 1.0 --sequence 1 --package-id $(tail -n 1 pkg.txt | awk '\''NF>1{print $NF}'\'')'
kubectl exec -it $(kubectl get pods -o=name | grep cli-peer0-cvh-deployment | sed "s/^.\{4\}//") -- bash -c 'peer lifecycle chaincode approveformyorg -o orderer0-service:7050 --tls --cafile=/etc/hyperledger/orderers/msp/tlscacerts/orderers-ca-service-7054.pem --channelID mainchannel --name patient --version 1.0 --sequence 1 --package-id $(tail -n 1 pkg.txt | awk '\''NF>1{print $NF}'\'')'

kubectl exec -it $(kubectl get pods -o=name | grep cli-peer0-doctor-deployment | sed "s/^.\{4\}//") -- bash -c 'peer lifecycle chaincode commit -o orderer0-service:7050 --tls --cafile=/etc/hyperledger/orderers/msp/tlscacerts/orderers-ca-service-7054.pem --channelID mainchannel --name patient --version 1.0 --sequence 1'
```







Start the Backend
```
kubectl apply -f network/minikube/backend
```

Start the Frontend
```
kubectl apply -f network/minikube/frontend
```