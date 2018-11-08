var Discord = require('discord.io');
var logger = require('winston');
const auth = require('./auth.json');
var fs = require('fs');
var admins = [234843909291769856];
var admin = true;
const newcomerrole = "509824081600970753";
const serverID = "502961198002864130";
var channelID = "509889611066245122";
const greet = "Welcome <@TEMP>";
//368640999112835075


var msgc = 0;
var tempdata;
const txtdata = tempdata;
tempdata = fs.readFileSync('data.txt','utf8')
//loadData
function loadData() {
  var apos = txtdata.search("!admins");
  tempdata = [];
  var temp0 = 0;
  for(var i = apos+6; i<txtdata.length;i++){
    if(txtdata[i]===','){
      temp0++;
      continue;
    }else if (txtdata[i]===';') {
      temp0 = 0;
      break;
    }
    tempdata[temp0].append(txtdata[i]);
  }
  console.log("admins: "+tempdata);
}

//loadData();

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



//configuration
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

function saveData(){

}

function send(id, message){
    bot.sendMessage({
                    to: id,
                    message: message
                });
}


bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    send(channelID,'Bot Online');
});

console.log("Running and Listening")

bot.on('guildMemberAdd', function(callback) { /* Event called when someone joins the server */
  var sms = greet.replace("TEMP",callback.id)
  setTimeout(function(){
    send(channelID,sms);
  },500);
  console.log("new user");
    bot.addToRole({
      serverID:serverID,
      userID:callback.id,
      roleID:newcomerrole
    });
 });


//listen
bot.on('message', function (user, userID, channelID, message, evt) {
  channelID = channelID;
  //console.log(bot.getAllUsers());
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                console.log(channelID);
            break;

            case 'imtheadmin':
            if(!admin){
              console.log("Adding "+user+":"+userID+" as an admin");
              admins.push(userID);
              console.log(admins);
              send(userID,"YOU ARE NOW THE ADMIN");
              admin = true;
              }else{
                console.log("!!WARNING!!: User "+user+":"+userID+" attempted to add themselves to admin");}
            bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
            break;

            case 'summon':
            for(var i = 0; i<admins.length; i++){
              if(admins[i]==userID){
                //set admin
                send()
                bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
              }
            }

            break;

            case 'debugid':
            for(var i = 0; i<admins.length; i++){
              if(admins[i]==userID){
                //set admin
                send(channelID,channelID);
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
