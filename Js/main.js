
/*******************************************************************************
                                  Variables
*******************************************************************************/
const Discord = require('../node_modules/discord.io');//discord bot stuff
const logger = require('../node_modules/winston');//idfk, logger?
const time = require('../node_modules/time');
const millis = new time.time();
const readline = require('readline');//readline for console commands
const dataIO = require('./dataIO.js');//user data
const auth = require('./data/auth.json');//auth token
const fs = require('fs');//file read system
const logpath = 'log.txt'
const silent = false; //silent online message for testing
let admins = ['234843909291769856','255535608015880193'];
/*/
var roles = ['368640999112835075','368640962253291521','324342883194765322','324342717641654282'];
//*/
//*/
let roles = ['509824081600970753','516877427822166026','516877459870842882','516877474936913921'];
//*/
const greet = "welcome to our home, <@TEMP> , you are family to the FSA now, enjoy your stay!";
const greetDM = [
  "Hello! Welcome to the the FSA server, led by Aurora the first! While here, we want your experience to be a healthy and satisfactory one for both you and your fellow combat personnel, and to do this, we want you to take some time to follow a few rules.\n \n",
  "1. Please keep chats to their appropriate chat room, we don’t want to see nsfw in general\n",
  "2. Be respectful of others and their opinions, even if they don’t agree with you\n",
  "3. Do NOT under any circumstances spam chat, it’s unpleasant for everyone, and filling chat with your trash hides the important stuff\n",
  "4. Please respect the outfit leader, as your leader, I want to be your friend, and I can take a good amount of verbal roughhousing, but please, not too much!\n",
  "5. If there are any problems, concerns, or issues that arise on the server, please contact me or any currently acting sentinels, we are always happy to help, and I’m ALWAYS willing to be a shoulder to lean on about anything! We are a family, and I want to be there to support you!\n",
  "6. the following subjects are now to be left out of general chat: drugs, drug paraphernalia, drug use, drug inhalation/ingestion, talking how/where to buy drugs, etc.\n"
];
const promotemessage = "<TEMP> has shown valiant effort for the cause, and their efforts have been rewarded!";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let users = [];

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token0,
   autorun: true
});

//Channel ID for summon and auto-role
//*Mainbot
const newcomerrole = "368640999112835075";
const serverID = "323941972157005826";
var mainchannelID = "323941972157005826";
//*/
/*Testbot
const newcomerrole = "509824081600970753";
const serverID = "502961198002864130";
var mainchannelID = "509889611066245122";
//*/
/*******************************************************************************
                                  Loop
*******************************************************************************/

function mainLoop() {//updating user data depending on situation
  temp0=undefined;temp1=undefined;temp2=undefined;
  for(var i = 0; i< users.length; i++){
    if(users[i]!== undefined){
      var o = users[i];

      //offender thresholds
      if(o.offender>=15){
        //o.mute = true;
        logData("Offender "+o.name+" Has reached mute threshold. \n Index: "+o.offender);
      }


      temp1 = false;
      //auto adding admins
      if(o.admin){for(var z = 0; z<admins.list; z++){if(admins[z]==o.id){
          temp1 = true;
        }}
        admins.push(o.id);
      }

      //making mutes mute
      if(o.mute){
        bot.mute({
          userID:o.id,
          serverID:serverID
        });
      }else{
        bot.unmute({
          serverID:serverID,
          userID:o.id
        });
      }

      //slow offender "cooldown"
      if(o.offender>0){
        o.offender-=0.001;
      }
    }
  }
}
setInterval(mainLoop,1000);

/*******************************************************************************
                                  Events
*******************************************************************************/


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
        offender:0,
      };



      //pull from database
    }
  }
});

//bot initialization
bot.on('ready', function (evt) {
    logData('Connected');
    logData('Logged in as: ');
    logData(bot.username + ' - (' + bot.id + ')');
    if(!silent) send(mainchannelID,'Bot Online');
});

logData("Running and Listening");


//listen for message commands
bot.on('message', function (user, userID, channelID, message, evt) {
  //mainchannelID = channelID;
  //logData(bot.getAllUsers());
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`

    if (message.substring(0, 1) == '!') {
      logData("Command>> "+message);
      objectFromId(userID).offender+=0.5;
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd) {
            default:
            //unreconized command

            send(channelID,"Command not reconized");
            bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
            //objectFromId(userID).offender-=0.5;
            break;
            //ping for debugging
            case 'ping':
            bot.sendMessage({
                to: channelID,
                message: 'Pong!'
            });
            break;

            //fsa summon, requested by AuroraTheFirst
            case 'summon':
            isAdmin(userID,function(){
              var ar = "";
              for(var i = 0; i<args.length; i++){
                ar=ar+" "+args[i];
              }
              var sen = "<@&324342717641654282> <@&324342883194765322> <@&368640962253291521> <@&368640999112835075>";
              send(mainchannelID,sen+"\n"+"**"+user+": "+ar+'**');
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
              var target = idFromName(args[0]);//get target ID
              var o = objectFromId(target);
              console.log(args[0]+target);
              if(target==undefined){
                o = objectFromId('253592101844025345');
              }//make sure target exists
              if(o==undefined){
                logData("Target Undefined");
              }else{
              //offender Index:
              o.offender+=2;
              logData("Offender: "+ o.name+"\n VIOLATION INDEX of user: "+o.offender);

                //shut the ____ up amon!
                var rand = Math.random();
                if(rand<0.3){
                send(channelID,"<@"+o.id+"> needs to stop before they're teamkilled by the wildcards");
              }else if(rand<0.8){
                send(channelID,"<@"+o.id+"> needs to stop before they're decimated by an orbital strike");
              }else{
                send(channelID,"<@"+o.id+"> needs to stop before they're exiled to AutX");
              }}
            });
            break;

            case 'myoffender':
            bot.deleteMessage({channelID:channelID,messageID:evt.d.id});
            send(mainchannelID,"offending index: \n"+objectFromId(userID).offender);
            logData(objectFromId(userID).offender);
            break;

            case 'promote':
            isAdmin(userID,function(){
            send(mainchannelID,promotemessage.replace("TEMP",user));
            var o = objectFromId(userID);
            o.offender = 0;
            bot.addToRole({//add to promoted role
              severID:serverID,
              userID:userID,
              roleID:roles[1]
            });
            bot.removeFromRole({//remove from previous role
              severID:serverID,
              userID:userID,
              roleID:roles[0]
            });
          });
            break;
            case 'demote':
            break;
         }
     }else{
       logData("Message>> "+message);
     }



});

bot.on('disconnect', function(errMsg, code) {
if(code === 0){
    logData("Connection Failed");
    logData("Retrying in 10 seconds")
    setTimeout(function(){bot.connect();},10000);
}else{
    logData("DISCONNECTED FROM SERVER");
    saveData();
}
});

//console commands
rl.on('line', (input) => {
  if(true){
  log="\n["+time.time()+"]>>"+input;
  fs.open('./log.txt', 'a', function(e, id) {
   fs.write(id, log, null, 'utf8', function(err){
     fs.close(id, (err) => {
    if (err) throw err;
  });
   });
 });}

 var args = input.substring(1).split(' ');
 var cmd = args[0];
 args = args.splice(1);
  switch(cmd){
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

  case 'remove':
  bot.deleteMessage({channelID:channelID,messageID:args[0]});
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
for(var i = 0; i<users.length; i++){
    dataIO.insertDoc(users[i]);
  }
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
    var o = objectFromId(id);
    logData("Failed Auth: "+ o.name+"\n VIOLATION INDEX: "+o.offender+1);
    o.offender++;
  }
}

//log data
function logData(data) {
  log="\n["+time.time()+"]: "+data;//time marker and formatting
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
function objectFromId(name,callback =function(name){}){
  for(var i = 0; i<users.length; i++){
    var u = users[i];
    if(u.id === name){
      callback(u);
      return u;
    }
  }
}

//list rules
function sendRules(userID){
  runs = greetDM.length;
  var message = "";
  for(var i = 0; i<runs; i++){
    message += greetDM[i]+"\n";
  }
  send(userID,message);
}
