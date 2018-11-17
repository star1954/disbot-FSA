var Discord = require('discord.io');//discord bot stuff
var logger = require('winston');//idfk
var date = require('time');//time and date
var readline = require('readline');//readline for console commands
var data = require('./data.json');//user data
const auth = require('./auth.json');//auth token
var fs = require('fs');//file read system
const silent = true; //silent online message for testing
var admins = [];
const greet = "welcome to our home, <@TEMP> , you are family to the FSA now, enjoy your stay!";
const greetDM = ["Hello","Welcome to FSA"];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var users = [];
var muted = [];
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
console.log(data);

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
  console.log(event.t);
  if(event.t == 'GUILD_CREATE'){
    //console.log(event.d.members);
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
      for(var i = 0; i<users.length; i++){
        if(users[i].id == po.id) push = false;
      }
      if(push) users.push(po);
      for(var i = 0; i<users.length; i++){
        if(users[i].admin) admins.push(users[i].id);
      }
      console.log(admins);
    //console.log(users);
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

console.log("Running and Listening");

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

  console.log("new user, added user "+callback.username+':'+callback.id+ " to role:"+newcomerrole);
  console.log(callback);//log data

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
  //console.log(bot.getAllUsers());
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`

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
              send(mainchannelID,"<@&324342717641654282> <@&324342883194765322> <@&368640962253291521> <@&368640999112835075>")
              bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
            });

            break;

            case 'rules':
            for(var i = 0; i<greetDM.length; i++){
              //DM the set messages
              send(userID,greetDM[i]);
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
              bot.moveUserTo({serverID: serverID, userID: args, channelID:"323941973247655938"},function(err){if(err) console.log(err);});
            });
            break;
         }
     }

});

bot.on('disconnect', function(errMsg, code) {
if(code === 0){
    console.log("Connection Failed")
}else{
    console.log("DISCONNECTED FROM SERVER");
}
});

//console commands
rl.on('line', (input) => {
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
        console.log(err);
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
  for(var i = 0; i<admins.length; i++){
    if(admins[i]==userID){
      //callback
      callback();
    }
  }
}
