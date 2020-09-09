const RedisSMQ = require('rsmq');
const Logger = require("./Logger");
const PropertiesReader = require('properties-reader');
const logger = new Logger().getInstance();
var properties = PropertiesReader('Configuration.properties');

const QUEUE_NAME = properties.get('QUEUE_NAME');

//Initiating RSMQ client.
const RSMQClient = new RedisSMQ({
    host: "127.0.0.1",
    port: 6379,
    ns: "rsmq"
});

module.exports= {
    createQueue:function() {
        //Check if the queue exists
        RSMQClient.listQueues(function(err, queues) {
            if(err) {
                logger.err("err");
                return
            }
            if(!queues.includes("PERF")) {
                logger.warn("Data queue not found. Creating a one for you.");
                RSMQClient.createQueue({qname: QUEUE_NAME}, function(err, resp) {
                    if(err) {
                        logger.error(err);
                        return
                    }
                    if(resp === 1) {
                        logger.info("Queue Created.");
                    }
                })
            }
        })
    },
    publishMessage:function(message) {
        RSMQClient.sendMessage({
            qname: properties.get('QUEUE_NAME'),
            message: message,
        }, function (err, resp) {
            if(err) {
                logger.error(err);
                return
            }
        })
    },
    
    popMessage:function() {
        RSMQClient.popMessage({
            qname: properties.get('QUEUE_NAME')
        }, function (err,resp) {
            if(err) {
                logger.error(err);
            }
            if(resp.id) {
               // return resp;
               console.log(resp.message);
            } else {
                return null;
            }
        })
    }
}