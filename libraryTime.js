var libraryTiming = function libraryTiming(watsonDataOutput, bot, message) {
  
    var d = new Date();
    d.setTime( d.getTime() - 28800000 );
    var hours = d.getHours();
    var disphours = hours;
    var ampm = ' AM';
    if (hours > 12){
      disphours = hours -12;
      ampm = ' PM';
    } 
  
  
    var minutes = d.getMinutes();
    if(minutes<10){
      minutes = '0' + minutes;
    }
  
    var weekday = new Array(7);
      weekday[0] = "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";
  
    let answer = "It's " + weekday[d.getDay()] + ', '+ disphours + ":" + minutes + ampm  + ', Library is open ';
   

    var n = weekday[d.getDay()];
    var secondline = 'At the moment it is ';
    switch(n){
        case 'Sunday':
            answer = answer + 'from 1 PM to midnight.';
            if(hours >= 13 && hours <=23){
              secondline = secondline + 'open';
            } else {
              secondline = secondline + 'closed';
            }
            break;
        case 'Monday':
            answer = answer + '24 hours.';
            if(hours >= 0 && hours <=23){
              secondline = secondline + 'open';
            } else {
              secondline = secondline + 'closed';
            }
            break;
        case 'Tuesday':
            answer = answer + '24 hours.';
            if(hours >= 0 && hours <=23){
              secondline = secondline + 'open';
            } else {
              secondline = secondline + 'closed';
            }
            break;
        case 'Wednesday':
            answer = answer + '24 hours.';
            if(hours >= 0 && hours <=23){
              secondline = secondline + 'open';
            } else {
              secondline = secondline + 'closed';
            }
            break;
        case 'Thursday':
            answer = answer + '24 hours.';
            if(hours >= 0 && hours <=23){
              secondline = secondline + 'open';
            } else {
              secondline = secondline + 'closed';
            }
            break;
        case 'Friday':
            answer = answer + '24 hours.';
            if(hours >= 0 && hours <=23){
              secondline = secondline + 'open';
            } else {
              secondline = secondline + 'closed';
            }
            break;
        case 'Saturday':
            answer = answer + 'from 9 AM to 6 PM.';
            if(hours >= 9 && hours <=18){
              secondline = secondline + 'open';
            } else {
              secondline = secondline + 'closed';
            }
            break;
  
        default:
            break;
    }
    bot.reply(message, answer);
    bot.reply(message, secondline);
}

module.exports  = {libraryTiming};

