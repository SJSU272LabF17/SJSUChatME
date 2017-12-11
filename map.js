var lookupLocation = function lookupCourse(watsonDataOutput, bot, message) {
    let location = watsonDataOutput.context.action.location;
  
  var fs=require('fs');
  var data=fs.readFileSync('map.json');
  var map=JSON.parse(data);
  
  var answer =  "Could not find the location. Here's a handy map of SJSU for you" +location;
  
  var i;
  for(i=0;i<map.length;++i){
     if(map[i].location==location){
       answer = location + ' is located in the image at ' + map[i].grid;
       break;
     } 
  } 
    
  var image = {
                "attachments": [
                    {
                        "title": "SJSU Map",
                        "image_url": "http://www.sjsu.edu/map/pics/043017_NorthCampus_WEB_05.jpg"
                    }
                ]
              }
    
    bot.reply(message, answer);
    bot.reply(message, image);
}

module.exports  = {lookupLocation};


