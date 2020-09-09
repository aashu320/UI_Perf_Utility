const client = require('./RedisQueueClient');

client.createQueue();
//client.publishMessage("Who are you?");
//client.popMessage();
var messgaeObj = {
    "name": "Aashish",
    "Age": 25
}
for(var i=0;i<12;i++) {
    client.publishMessage(JSON.stringify(messgaeObj));
}
