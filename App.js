const support = require('./Js/support.js');
const dataIO = require('./Js/dataIO.js');
//main.logData('test');
//console.log(main);

//loop
/*
function mainLoop() {//updating user data depending on situation
  var temp0=undefined;temp1=undefined;temp2=undefined;
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
*/
