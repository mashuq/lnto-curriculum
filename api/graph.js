let neo4j = require('../config/neo4j');
let uuidv4 = require('uuid/v4');

let identityEquals = function(objectID1, objectID2){
    if(null == objectID1 || null == objectID2){
        return false;
    }

    if(objectID1.high == objectID2.high 
        && objectID1.low == objectID2.low){
            return true;
    }
    return false;
}

let populateFullGraph = function (param) {
    return new Promise(function (mainResolve, mainReject) {
        let combinedResult = {};
        let combinedProcessing = function(){
            return new Promise(function(resolve, reject) {
                let response = processCombinedResult(combinedResult, param);
                mainResolve(response);
            });
        };

        neo4j.run('MATCH (n) RETURN n').then(
            result => {
                combinedResult.nodeResult = result;
                return neo4j.run('match ()-[r]->() return r');
            },
            error => {mainReject(error);}
        ).then(
            result => {
                combinedResult.edgeResult = result;
                return combinedProcessing();
            },
            error => {mainReject(error);}
        );
    });
}

let addNewNode = function (params) {
    params.uuid = uuidv4();
    params.active = true;
    return new Promise(function (mainResolve, mainReject) {
        let combinedResult = {};
        let combinedProcessing = function(){
            return new Promise(function(resolve, reject) {
                let response = processCombinedResult(combinedResult, params);
                mainResolve(response);
            });
        };
        let cypher = `Match (root) where root.uuid = $parentUUID Create (child:${params.type}{name:$name, uuid : $uuid, acive:$active})<-[:has]-(root) return child`;
        neo4j.run(cypher, params).then(
            result => {
                combinedResult.nodeResult = result;
                param = getNodeProperties(result);
                return neo4j.run('MATCH (n {uuid:$uuid})-[r]-() return r', param);
            },
            error => {mainReject(error);}
        ).then(
            result => {
                combinedResult.edgeResult = result;
                return combinedProcessing();
            },
            error => {mainReject(error);}
        );
    });
}

let graph = {
    populateFullGraph: populateFullGraph,
    addNewNode: addNewNode
}

module.exports = graph;

function getNodeProperties(result){
    return result.records[0]._fields[0].properties;
}

function processCombinedResult(combinedResult, param) {
    let response = { nodes: [], edges: [] };
    for (let record of combinedResult.nodeResult.records) {
        let nodeRecord = record._fields[0];
        let node = {};
        node.label = nodeRecord.labels[0];
        Object.assign(node, nodeRecord.properties);
        response.nodes.push(node);
    }
    for (let record of combinedResult.edgeResult.records) {
        let relationshipRecord = record._fields[0];
        let startObjectID = relationshipRecord.start;
        let endObjectID = relationshipRecord.end;
        let startID, endID = '';
        for (let record of combinedResult.nodeResult.records) {
            let nodeRecord = record._fields[0];
            if (identityEquals(startObjectID, nodeRecord.identity)) {
                startID = nodeRecord.properties.uuid;
            }
            if (identityEquals(endObjectID, nodeRecord.identity)) {
                endID = nodeRecord.properties.uuid;
            }
        }
        let edge = { from: startID, to: endID };
        if(edge.from == undefined && param.parentUUID != undefined){
            edge.from = param.parentUUID;
        }
        response.edges.push(edge);
    }
    return response;
}
