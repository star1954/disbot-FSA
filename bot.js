var Discord = require('discord.io');//discord bot stuff
var logger = require('winston');//idfk
var date = require('time');//time and date
var readline = require('readline');//readline for console commands
var data = require('./data.json');//user data
const auth = require('./auth.json');//auth token
var fs = require('fs');//file read system
const silent = true; //silent online message for testing
const admins = ["234843909291769856","255535608015880193"];
const greet = "welcome to our home, <@TEMP> , you are family to the FSA now, enjoy your stay!";
const greetDM = ["test1","test2"];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var users = data;
//example
const star1954 ={
  name:'star1954',
  id:'234843909291769856',
  lastlogin:2918238289,
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

var msgc = 0;
var tempdata;


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

//save data
function saveData(){
    var json = JSON.stringify(data); //convert it back to a string
    fs.writeFile('data.json', json, 'utf8', function(err){
      if(err){
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
  var sms = greet.replace("TEMP",callback.id)//message, replace the blankspace
  bot.createDMChannel(callback.id, function(call){
    for(var i = 0; i<greetDM.length; i++){
      //DM the set messages
      send(callback.id,greetDM[i]);
    }
  });
  setTimeout(function(){
    send(mainchannelID,sms);//send the message after .5 seconds
  },500);
  console.log("new user, added user "+callback.username+':'+callback.id+ " to role:"+newcomerrole);
  //add the user to the role, somehow not working
    bot.addToRole({
      serverID:serverID,
      userID:callback.id,
      roleID:newcomerrole,
    });
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
            for(var i = 0; i<admins.length; i++){
              if(admins[i]==userID){
                //send pong
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                sent = true;
                bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
              }
            }
            if(!sent){
              send(channelID,"Command not reconized");
              bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
            }
            break;

            //fsa summon, requested by AuroraTheFirst
            case 'summon':
            for(var i = 0; i<admins.length; i++){
              if(admins[i]==userID){
                //set admin
                send(mainchannelID,"<@&324342717641654282> <@&324342883194765322> <@&368640962253291521> <@&368640999112835075>")
                bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
              }
            }

            break;

            case 'rules':
            for(var i = 0; i<greetDM.length; i++){
              //DM the set messages
              send(userID,greetDM[i]);
            }
            break;

            case 'debugid':
            for(var i = 0; i<admins.length; i++){
              if(admins[i]==userID){
                //set admin
                send(channelID,mainchannelID);
              }

            }
            break;
         }
     }
});

bot.on('disconnect', function(errMsg, code) {
if(code === 0){
    console.log("")
}else{
    console.log("DISCONNECTED FROM SERVER");
}
});













rl.on('line', (input) => {
  if(input === 'end'){
    send(mainchannelID,"Bot Offline");
    bot.disconnect();
  }
  if(input === 'restart'){
    send(mainchannelID,"Bot Restarting");
    bot.disconnect();
  }
});
