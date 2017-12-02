var Botkit = require("botkit");
require("dotenv").load();
var request = require("request");

var middleware = require("botkit-middleware-watson")({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  workspace_id: process.env.WORKSPACE_ID,
  version_date: "2016-09-20"
});

var controller = Botkit.slackbot({
  json_file_store: "./db_slackbutton_bot/"
}).configureSlackApp({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  scopes: ["bot"]
});

controller.setupWebserver(3000, function(err, webserver) {
  controller.createWebhookEndpoints(controller.webserver);
  controller.createOauthEndpoints(controller.webserver, function(
    err,
    req,
    res
  ) {
    if (err) {
      res.status(500).send("ERROR: " + err);
    } else {
      res.send("Success!");
    }
  });
});

var _bots = {};
function trackBot(bot) {
  _bots[bot.config.token] = bot;
}

function invokeAction(watsonDataOutput, bot, message) {
  let actionName = watsonDataOutput.context.action.name;

  switch (actionName) {
    case "lookupWeather":
      //let answer =  JSON.stringify(watsonDataOutput.context.action)
      //bot.reply(message, answer);
      lookupWeather(watsonDataOutput, bot, message);
      break;

    case "lookupCourse":
      lookupCourse(watsonDataOutput, bot, message);
      break;
    /*
        case 'get-time':
            let answer = "It's " + new Date().getHours() + " o'clock and "
                + new Date().getMinutes() + " minutes";
            bot.reply(message, answer);
            break;
        */
    default:
      bot.reply(message, "Sorry, I cannot execute what you've asked me to do");
  }
}

function lookupCourse(watsonDataOutput, bot, message) {
  let course = watsonDataOutput.context.action.course;
  let answer;
  switch (course) {
    case "Cloud Computing":
      answer =
        "Courses to take :  <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE281.html|CMPE 281>, <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE282.html|CMPE 282> & <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE289.html|CMPE 289>, More details at <https://msse.sjsu.edu/cloud-computing-and-virtualization|Cloud Computing>";
      break;
    case "Enterprise":
      answer =
        "Courses to take :  E101, E102, E103 More details at https://msse.sjsu.edu/enterprise-software-technologies";
      break;
    case "Networking":
      answer =
        "Courses to take :  N101, N102, N103 More details at https://msse.sjsu.edu/networking-software";
      break;
    case "Data Science":
      answer =
        "Courses to take :  <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE255.html|CMPE 255>, <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE256.html|CMPE 256>, <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE257.html|CMPE 257>, <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE258.html|CMPE 258> & <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE266.html|CMPE 266> More details at <http://msse.sjsu.edu/data-science|Data Science>";
      break;
    case "Systems Engineering":
      answer =
        "Courses to take :  SE101, SE102, SE103 More details at https://msse.sjsu.edu/software-systems-engineering";
      break;
    default:
      answer = "No Specialization taken";
  }

  bot.reply(message, answer);
}

function lookupWeather(watsonDataOutput, bot, message) {
  let coordinates;
  let location = watsonDataOutput.context.action.location;

  switch (location) {
    case "Munich":
      coordinates = "48.13/11.58";
      break;
    case "Delhi":
      coordinates = "28.70/77.10";
      break;
    case "Hamburg":
      coordinates = "53.55/9.99";
      break;
    case "SJSU":
      coordinates = "37.33/-121.88";
      break;
    default:
      coordinates = "52.52/13.38"; // Berlin
  }

  let weatherUsername = process.env.WEATHER_USERNAME;
  let weatherPassword = process.env.WEATHER_PASSWORD;
  let weatherUrl =
    "https://" +
    weatherUsername +
    ":" +
    weatherPassword +
    "@twcservice.mybluemix.net:443/api/weather/v1/geocode/" +
    coordinates +
    "/observations.json?units=m&language=en-US";

  request(weatherUrl, function(error, response, body) {
    var info = JSON.parse(body);
    let answer =
      "The current temperature in " +
      info.observation.obs_name +
      " is " +
      info.observation.temp +
      " °C";
    let bakwas = JSON.stringify(info.observation);
    bot.reply(message, answer);
  });
}

function handleWatsonResponse(bot, message) {
  let customSlackMessage = false;
  let actionToBeInvoked = false;
  if (message.watsonData) {
    if (message.watsonData.output) {
      if (message.watsonData.output.context) {
        if (message.watsonData.output.context.slack) {
          customSlackMessage = true;
        }
        if (message.watsonData.output.context.action) {
          actionToBeInvoked = true;
        }
      }
    }
  }
  if (actionToBeInvoked == true) {
    bot.reply(message, message.watsonData.output.text.join("\n"));
    invokeAction(message.watsonData.output, bot, message);
  } else {
    if (customSlackMessage == true) {
      bot.reply(message, message.watsonData.output.context.slack);
    } else {
      bot.reply(message, message.watsonData.output.text[0]);
    }
  }
}

controller.on("direct_message,direct_mention,mention", function(bot, message) {
  middleware.interpret(bot, message, function(err) {
    if (!err) {
      handleWatsonResponse(bot, message);
    } else {
      bot.reply(
        message,
        "I'm sorry, but for technical reasons I can't respond to your message"
      );
    }
  });
});

controller.on("interactive_message_callback", function(bot, message) {
  middleware.interpret(bot, message, function(err) {
    if (!err) {
      handleWatsonResponse(bot, message);
    } else {
      bot.reply(
        message,
        "I'm sorry, but for technical reasons I can't respond to your message"
      );
    }
  });
});

controller.on("create_bot", function(bot, config) {
  if (_bots[bot.config.token]) {
    // already online! do nothing.
  } else {
    bot.startRTM(function(err) {
      if (!err) {
        trackBot(bot);
      }

      bot.startPrivateConversation({ user: config.createdBy }, function(
        err,
        convo
      ) {
        if (err) {
          console.log(err);
        } else {
          convo.say("I am a bot that has just joined your team");
        }
      });
    });
  }
});

controller.on("rtm_open", function(bot) {
  console.log("** The RTM api just connected!");
});

controller.on("rtm_close", function(bot) {
  console.log("** The RTM api just closed");
  // you may want to attempt to re-open
});

controller.storage.teams.all(function(err, teams) {
  if (err) {
    throw new Error(err);
  }
  // connect all teams with bots up to slack!
  for (var t in teams) {
    if (teams[t].bot) {
      controller.spawn(teams[t]).startRTM(function(err, bot) {
        if (err) {
          console.log("Error connecting bot to Slack:", err);
        } else {
          trackBot(bot);
        }
      });
    }
  }
});
