//send message
exports.send = function(id, message){
    bot.sendMessage({
      to: id,
      message: message
    });
}
//*

//get userID from username and vise versa
exports.idFromName = function (name,callback =function(id){}, users = []) {
  for(var i = 0; i<users.length; i++){
    var u = users[i];
    if(u.name === name){
      callback(u.id);
      return u.id;
    }
  }
}
exports.nameFromId = function(name,callback =function(name){}, users = []) {
  for(var i = 0; i<users.length; i++){
    var u = users[i];
    if(u.id === name){
      callback(u.name);
      return u.name;
    }
  }
}
exports.objectFromId = function(name,callback =function(name){}, users = []){
  for(var i = 0; i<users.length; i++){
    var u = users[i];
    if(u.id === name){
      callback(u);
      return u;
    }
  }
}

//admin check
isAdmin(id,admins,users,callback = function(){}){
  var s = false;
  for(var i = 0; i<admins.length; i++){
    if(admins[i]==id){
      //callback
      callback();
      s = true;
    }
  }
  if(!s){
    var o = objectFromId(id);
    logData("Failed Auth: "+ o.name+"\n VIOLATION INDEX: "+o.offender+1);
    o.offender++;
  }
}
