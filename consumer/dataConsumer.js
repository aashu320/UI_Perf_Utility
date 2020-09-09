const rsmq = require("rsmq-worker");
const Logger = require("../Logger");
const PropertiesReader = require('properties-reader');
var properties = PropertiesReader("../Configuration.properties");
const logger = new Logger().getInstance();

var monitoringData = [];

const subscriber = new rsmq(properties.get('QUEUE_NAME'), {
    host: "127.0.0.1",
    port: 6379,
    ns: "rsmq"
});

subscriber.on("message", function(message,next,id) {
    monitoringData.push(message.toString());
    logger.info(message);
    next();
});

subscriber.on('error', function( err, msg ){
    console.log( "ERROR", err, msg.id );
});

subscriber.on('exceeded', function( msg ){
    console.log( "EXCEEDED", msg.id );
});

subscriber.on('timeout', function( msg ){
    console.log( "TIMEOUT", msg.id, msg.rc );
});

function startConsumer() {
    subscriber.start();
}

function getFirstNPoints() {
    var data = `{[${monitoringData.splice(0,5)}]}`;
    return data;
}

module.exports = {
    startConsumer,
    getFirstNPoints,
    monitoringData
}