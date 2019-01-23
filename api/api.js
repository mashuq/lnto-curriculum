var graph = require('./graph');
var services = {
    graph:graph
}

let invoke = function(param){
    return services[param.service][param.action](param.data);
} 

var api = {
    invoke:invoke
}

module.exports = api;