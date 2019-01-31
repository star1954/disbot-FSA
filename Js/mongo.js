var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://star1954:andyew1954@cluster0-9ldtt.gcp.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
const dbName = 'Main';
const cName = 'test';
let collection;
const onconnection = function(){

}

client.connect(err => {
 // perform actions on the collection object
 console.log('Connection to Database Succcessful');
 onconnect();

 console.log(exports.find({a:0,b:2,c:0}));

  //client.close();
});
//functions

onconnect = function(onconnection = function(){}){
  collection = client.db(dbName).collection(cName);
  onconnection();
}
exports.insert = function(data,callback = function(){}){
  collection.insertOne(data,function(err, res) {
    if (err) throw err;
    console.log(res.insertedId);
    callback();
  });

}

exports.find = function(data,callback = function(){}){
  let resolve;
   collection.findOne(data, function(err, result) {
     if(err) throw err;
     console.log(result);
     resolve = result;
     callback(resolve);
     return resolve;
   });
}
exports.delete = function(target, callback = function(){}){
  collection.deleteOne(target, function(err, obj) {
      if (err) throw err;
      console.log("document deleted");
      callback();
    });

}
