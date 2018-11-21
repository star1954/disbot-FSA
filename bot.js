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
const greetDM = [
  "Hello! Welcome to the the FSA server, led by Aurora the first! While here, we want your experience to be a healthy and satisfactory one for both you and your fellow combat personnel, and to do this, we want you to take some time to follow a few rules.",
  "1. Please keep chats to their appropriate chat room, we don’t want to see nsfw in general",
  "2. Be respectful of others and their opinions, even if they don’t agree with you",
  "3. Do NOT under any circumstances spam chat, it’s unpleasant for everyone, and filling chat with your trash hides the important stuff",
  "4. Please respect the outfit leader, as your leader, I want to be your friend, and I can take a good amount of verbal roughhousing, but please, not too much!",
  "5. If there are any problems, concerns, or issues that arise on the server, please contact me or any currently acting sentinels, we are always happy to help, and I’m ALWAYS willing to be a shoulder to lean on about anything! We are a family, and I want to be there to support you!"
];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var users = [];
var temp0,temp1,temp2,ran,runs;
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
/*
const newcomerrole = "368640999112835075";
const serverID = "323941972157005826";
var mainchannelID = "323941972157005826";
//*/
//*
const newcomerrole = "509824081600970753";
const serverID = "502961198002864130";
var mainchannelID = "509889611066245122";
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
    sendRules(userID);
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

            case 'rules'://messages rules to user
            sendRules(userID);
            bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
            break;

            case 'debugid':
            isAdmin(userID,function(){
              send(channelID,mainchannelID);
            });//prints out an ID
            break;

            case 'force':
            //force user into a voice channel
            isAdmin(userID,function(){
              bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
              bot.moveUserTo({serverID: serverID, userID: args, channelID:"323941973247655938"},function(err){if(err) logData(err);});
            });
            break;

            case 'shut':
            bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
            isAdmin(userID, asdf=>{
              var target = idFromName(args[1]);//get target ID
              console.log(args[0]+target);
              if(target==undefined){
                target = '253592101844025345';
              }//target exists
                //shut the ____ up amon!
                var rand = Math.random();
                if(rand<0.3){
                send(channelID,"<@"+target+"> needs to stop before they're teamkilled by the wildcards");
              }else if(rand<0.8){
                send(channelID,"<@"+target+"> needs to stop before they're decimated by an orbital strike");
              }else{
                send(channelID,"<@"+target+"> needs to stop before they're exiled to AutX");
              }
            });
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

  case 'debugdata':
  logData(idFromName('star1954'));
  break;
  }

});





/*******************************************************************************
                                  FUNCTIONS
*******************************************************************************/
//save data
function saveData(){
    var json = JSON.stringify(users); //convert it back to a string
    //logData("DEBUG: "+json);
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

//get userID from username and vise versa
function idFromName(name,callback =function(id){}) {
  for(var i = 0; i<users.length; i++){
    var u = users[i];
    if(u.name === name){
      callback(u.id);
      return u.id;
    }
  }
}
function nameFromId(name,callback =function(name){}) {
  for(var i = 0; i<users.length; i++){
    var u = users[i];
    if(u.id === name){
      callback(u.name);
      return u.name;
    }
  }
}

//list rules
function sendRules(userID){
  runs = greetDM.length;
  ran = 0;
  temp0 = userID;
    //DM the set messages
    setTimeout(Support1,100);
}
//support for the previous function
function Support1(){
  ran++;
  send(temp0,greetDM[ran-1]);
  if(ran<runs){
    setTimeout(Support1,100);
  }
}
