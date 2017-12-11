var lookupProff= function lookupProff(watsonDataOutput, bot, message) {

  var fs=require('fs');
  var data=fs.readFileSync('proffessors.json');
  var proff=JSON.parse(data);
  let name = watsonDataOutput.context.action.proff;
  var i;
  var answer = 'Professor not found. Here is a list of all the faculties : <http://www.sjsu.edu/people/ | Faculty Index>';
  for(i=0;i<proff.length;++i){
     if(proff[i].name==name){
       answer = 'Click on the link to know about the professor : <'+proff[i].page+'|Prof. '+proff[i].name +'>';
       break;
     }
  }    
  bot.reply(message, answer);
}

module.exports  = {lookupProff};

