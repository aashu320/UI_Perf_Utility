const express = require('express');
const bodyParser = require('body-parser');
const consumer = require('./dataConsumer');
const app = express();

//Defining express runtime
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


//Exposing rest endpoints
app.get("/getPoints", (req,res) => {
    res.send(consumer.getFirstNPoints());
} )

var server = app.listen(5000, ()=> {
    console.log(`Server listening on port ${server.address().port}`);
    console.log(consumer);
    consumer.startConsumer();
});