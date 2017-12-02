require('dotenv').load();
var request = require('request');

var lookupWeather = function lookupWeather(watsonDataOutput, bot, message) {
    let coordinates = '37.33/-121.88';
    //let location = watsonDataOutput.context.action.location;

    let weatherUsername = process.env.WEATHER_USERNAME;
    let weatherPassword = process.env.WEATHER_PASSWORD;
    let weatherUrl = 'https://' + weatherUsername + ':' + weatherPassword + '@twcservice.mybluemix.net:443/api/weather/v1/geocode/' + coordinates + '/observations.json?units=m&language=en-US';

    request(weatherUrl, function (error, response, body) {
        var info = JSON.parse(body);
        let answer = "The current temperature in " + info.observation.obs_name
            + " is " + info.observation.temp + " °C" 
        let bakwas = JSON.stringify(info.observation)
        bot.reply(message, answer);
    })
}

module.exports  = {lookupWeather};
