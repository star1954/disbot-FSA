const fs = require('fs');
const time = require('../node_modules/time');
const millis = new time.time();
const db = require('./mongo.js')


//IO commands
exports.readJSON = function(filepath, callback = function(){}){
}//WIP DO NOT USE

exports.writeJSON = function(filepath, data, callback = function(){}){
  var json = JSON.stringify(data); //convert it back to a string
  //logData("DEBUG: "+json);
  fs.writeFile(filepath), json, 'utf8', function(err){//write to file
    if(err){//log any errors
      exports.logData(err);
    }
  }); //write
}//WIP DO NOT USE

exports.replaceDoc = function(data0,data1){
  db.delete(data0, function(){
    db.insert(data1);
  });
};

exports.readUsers = function(callback){
  db.find({userdata:true},function(data){
    callback(data.data);
  })
}

exports.writeUsers = function(data){
  db.delete({userdata:true}, function(){
    db.insert({userdata:true,data:data
    });
  });

}


//log data
exports.logData = function(data) {
  var log="\n["+time.time()+"]: "+data;//time marker and formatting
  console.log(log);
  //let me try tis again
  fs.createWriteStream(logpath);
  fs.open(logpath, 'a', function(e, id) {
   fs.write(id, log, null, 'utf8', function(err){
     fs.close(id, (err) => {
    if (err) throw err;
  });
   });
 });
 db.find({log:true}function(data){
   var dat = {log:true,logs:data.logs};
   db.delete(data, function(){
     dat.logs += log;
     db.insert(data);
   });
 })
}//log data into storage
