let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "h6u4%kr"));
let neo4jSession = driver.session();
module.exports = neo4jSession;