const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("../models/topic.server.model");

const API_PORT = 3001;
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = "";
var fs = require('fs')


/*
// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));
*/
// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  fs.readFile(__dirname + '/../data/topics.json', 'utf-8', function(err, data){
    if (err) return res.json({success: false, error: err });
    return res.json({sucess:true, data:data});
  });
  //return res.json({data: "hello world"});
  /*
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
  */
});


// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  var fileName = __dirname + '/../data/topics.json';

  const topicName  = req.body;

  fs.readFile(fileName, 'utf-8', function(err, data){
    if (err) return res.json({success: false, error: err });
    
    var topics = JSON.parse(data);
    var index = topics.indexOf(topicName.topic);
    
    if (index > -1) {
      topics.splice(index, 1);
    }

    fs.writeFile(fileName, JSON.stringify(topics), 'utf-8', function(err) {
      if (err) return res.json({success: false, error: err });
      return res.json({ success: true });
    })
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  var fileName = __dirname + '/../data/topics.json';
  
  const topicName = req.body;

  fs.readFile(fileName, 'utf-8', function(err, data){
    if (err) return res.json({success: false, error: err });
    
    var topics = JSON.parse(data);
    topics.push(topicName.topic);
    
 
    fs.writeFile(fileName, JSON.stringify(topics), 'utf-8', function(err) {
      if (err) return res.json({success: false, error: err });
      return res.json({ success: true });
    })
  });
  
  
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));