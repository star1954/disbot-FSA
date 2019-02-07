//initialization
var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://star1954:andyew1954@cluster0-9ldtt.gcp.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
const dbName = 'Main';
const cName = 'test';
var collection;
const onconnection = function(){

}


//connect to database
client.connect(err => {
 // perform actions on the collection object
 console.log('Connection to Database Succcessful');
 onconnect();

 console.log(exports.find({a:0,b:2,c:0}));

  //client.close();
});

onconnect = function(onconnection = function(){}){
  collection = client.db(dbName).collection(cName);
  onconnection();
}

//exported functions

//insert document with data
exports.insert = function(data,callback = function(){}){
  collection.insertOne(data,function(err, res) {
    if (err) throw err;
    console.log(res.insertedId);
    callback();
  });
}

//find document by data values
exports.find = function(data,callback = function(){}){
  //let resolve;
   collection.findOne(data, function(err, result) {
     if(err) throw err;
     callback(result);
   });
}

//delete document by data values
exports.delete = function(target, callback = function(){}){
  collection.deleteOne(target, function(err, obj) {
      if (err) throw err;
      //console.log("document deleted");
      callback();
    });
}
