const fs = require('fs');
const time = require('../node_modules/time');
const millis = new time.time();

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
}

//IO commands
exports.readJSON = function(filepath, callback = function(){}){
}

exports.writeJSON = function(filepath, data, callback = function(){}){
  var json = JSON.stringify(data); //convert it back to a string
  //logData("DEBUG: "+json);
  fs.writeFile(filepath), json, 'utf8', function(err){//write to file
    if(err){//log any errors
      exports.logData(err);
    }
  }); //write
}
