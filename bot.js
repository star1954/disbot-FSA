var Discord = require('discord.io');//discord bot stuff
var logger = require('winston');//idfk
const time = require('time');
var millis = new time.time();
var readline = require('readline');//readline for console commands
var data = require('./data.json');//user data
const auth = require('./auth.json');//auth token
var fs = require('fs');//file read system
const silent = false; //silent online message for testing
var admins = ['234843909291769856','255535608015880193'];
const greet = "welcome to our home, <@TEMP> , you are family to the FSA now, enjoy your stay!";
const greetDM = ["Hello","Welcome to FSA"];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var users = [];
var temp0,temp1,temp2;
var log = "";
//example

const star1954 ={
  name:'star1954',
  roles:[],
  nick:'star1954',
  mute:false,
  deaf:false,
  id:'234843909291769856',
  lastlogin:0,
  admin:true,
};
//Channel ID for summon and auto-role
//*
const newcomerrole = "368640999112835075";
const serverID = "323941972157005826";
var mainchannelID = "323941972157005826";
//*/
/*
const newcomerrole = "509824081600970753";
const serverID = "502961198002864130";
var mainchannelID = "509889611066245122";
//*/






//loadData
logData(data);

//Queue class
/*

function Queue(){
	this.data = [];
}

Queue.prototype.add = function(inp){
	this.data.unshift(inp);
}
Queue.prototype.last = function(){
	return this.data[this.data.length-1];
}
Queue.prototype.first = function(){
	return this.data[0];
}
Queue.prototype.remove = function(){
	this.data.pop();
}
Queue.prototype.removeread = function() {
	var read = this.last();
	this.remove();
	return this.last();
};

//test queue
var lineQueue = new Queue();
//*/

//configuration of logger
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('any', function(event) {
  //logData(event.t);
  if(event.t == 'GUILD_CREATE'){
    //logData(event.d.members);
    var o = event.d.members;
    for(var i = 0; i<o.length; i++){
      var oi = o[i];
      var po = {
        name:oi.user.username,
        roles:oi.roles,
        nick:oi.nick,
        mute:oi.mute,
        deaf:oi.deaf,
        lastlogin:0,
        admin:false,
        id:oi.user.id,
      };
      var push = true;
      for(var x = 0; x<users.length; x++){
        if(users[x].id == po.id) push = false;
      }
      if(push) users.push(po);
      for(var x = 0; x<users.length; x++){
        //if(users[i].admin){admins.push(users[i].id);}
      }
      //users.length;
    //logData(users);
    }
  }
});

//bot initialization
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    if(!silent) send(mainchannelID,'Bot Online');
});

logData("Running and Listening");

//welcome message
bot.on('guildMemberAdd', function(callback) { /* Event called when someone joins the server */
  var sms = greet.replace("TEMP",callback.id)//message, replace the blankspace "temp"
  bot.createDMChannel(callback.id, function(call){
    for(var i = 0; i<greetDM.length; i++){
      //DM the set messages
      send(callback.id,greetDM[i]);
    }
  });//send the DM

  setTimeout(function(){
    send(mainchannelID,sms);//send the message after .5 seconds
  },500);//delayed server welcome

  logData("new user, added user "+callback.username+':'+callback.id+ " to role:"+newcomerrole);
  logData(callback);//log data

  //add the user to the role, somehow not working
    bot.addToRole({
      serverID:serverID,
      userID:callback.id,
      roleID:newcomerrole,
    });
    //add to users array
    var oi = callback;
    var po = {
      name:oi.username,
      roles:oi.roles,
      nick:oi.nick,
      mute:oi.mute,
      deaf:oi.deaf,
      lastlogin:0,
      admin:false,
      id:oi.id,
    };
    users.push(po);
 });


//listen for message commands
bot.on('message', function (user, userID, channelID, message, evt) {
  //mainchannelID = channelID;
  //logData(bot.getAllUsers());
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    //logData("DEBUG"+userID);
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd) {

            default:
            //unreconized command
            send(channelID,"Command not reconized");
            bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
            break;
            //ping for debugging
            case 'ping':
            var sent = false;
            isAdmin(userID,function(){
              sent = true;
              bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
            });
            if(!sent){
              send(channelID,"Command not reconized");
              bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
            }else{
              bot.sendMessage({
                  to: channelID,
                  message: 'Pong!'
              });
            }
            break;

            //fsa summon, requested by AuroraTheFirst
            case 'summon':
            isAdmin(userID,function(){
              var ar = "";
              for(var i = 0; i<args.length; i++){
                ar=ar+" "+args[i];
              }
              send(mainchannelID,"<@&324342717641654282> <@&324342883194765322> <@&368640962253291521> <@&368640999112835075>");
              setTimeout(function(){send(mainchannelID,"**"+user+": "+ar+'**');},100);
              bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
            });
            break;

            case 'rules':
            for(var i = 0; i<greetDM.length; i++){
              //DM the set messages
              send(userID,greetDM[i]);
              bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
            }
            break;

            case 'debugid':
            isAdmin(userID,function(){
              send(channelID,mainchannelID);
            });
            break;

            case 'force':
            //force user into a voice channel
            isAdmin(userID,function(){
              bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
              bot.moveUserTo({serverID: serverID, userID: args, channelID:"323941973247655938"},function(err){if(err) logData(err);});
            });
            break;
         }
     }

});

bot.on('disconnect', function(errMsg, code) {
if(code === 0){
    logData("Connection Failed");
}else{
    logData("DISCONNECTED FROM SERVER");
}
});

//console commands
rl.on('line', (input) => {
  log="\n["+time.time()+"]>>"+input;
  fs.open('./log.txt', 'a', function(e, id) {
   fs.write(id, log, null, 'utf8', function(err){
     fs.close(id, (err) => {
    if (err) throw err;
  });
   });
 });
  switch(input){
  case 'end':
    send(mainchannelID,"Bot Offline");
    bot.disconnect();
  break;
  case 'restart':
    send(mainchannelID,"Bot Restarting");
    bot.disconnect();
    break;

  case 'connect':
    bot.connect();
    break;

  case 'savedata':
    saveData();
  break;
  }

});





/*******************************************************************************
                                  FUNCTIONS
*******************************************************************************/
//save data
function saveData(){
    var json = JSON.stringify(users); //convert it back to a string
    fs.writeFile('./data.json', json, 'utf8', function(err){//write to file
      if(err){//log any errors
        logData(err);
      }
    }); //write
}

//send message
function send(id, message){
    bot.sendMessage({
                    to: id,
                    message: message
                });
}

//check admin
function isAdmin(id,callback = function(){}){
  var s = false;
  for(var i = 0; i<admins.length; i++){
    if(admins[i]==id){
      //callback
      callback();
      s = true;
    }
  }
  if(!s){
    log("Failed Auth")
  }
}

//log data
function logData(data) {
  log="\n["+time.time()+"]: "+data;//time marker and formatting

  console.log(log);
  fs.open('./log.txt', 'a', function(e, id) {
   fs.write(id, log, null, 'utf8', function(err){
     fs.close(id, (err) => {
    if (err) throw err;
  });
   });
 });
}
