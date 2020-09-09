const client = require('./RedisQueueClient');

client.createQueue();

for(var i=0;i<10;i++) {
    client.publishMessage("Hello");
    console.log("Message got published.")
}
