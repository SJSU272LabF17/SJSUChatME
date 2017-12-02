var Botkit = require('botkit');
require('dotenv').load();
var request = require('request');
var weather = require('./weather.js');
var course = require('./course.js');
var library = require('./libraryTime.js')

var middleware = require('botkit-middleware-watson')({
    username: process.env.CONVERSATION_USERNAME,
    password: process.env.CONVERSATION_PASSWORD,
    workspace_id: process.env.WORKSPACE_ID,
    version_date: '2016-09-20'
});

var controller = Botkit.slackbot({
        json_file_store: './db_slackbutton_bot/',
    }).configureSlackApp(
        {
            clientId: process.env.SLACK_CLIENT_ID,
            clientSecret: process.env.SLACK_CLIENT_SECRET,            
            scopes: ['bot']
        }
    );

controller.setupWebserver(3000, function (err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);
    controller.createOauthEndpoints(controller.webserver, function (err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
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
        case 'lookupWeather':
            //let answer =  JSON.stringify(watsonDataOutput.context.action)
            //bot.reply(message, answer);
            weather.lookupWeather(watsonDataOutput, bot, message);
            break;
        
        case 'lookupCourse':
            course.lookupCourse(watsonDataOutput, bot, message);
            break; 
        
        case 'libraryTiming':
            library.libraryTiming(watsonDataOutput, bot, message);
            break;       
      
        default:
            bot.reply(message, "Sorry, I cannot execute what you've asked me to do");
    }
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
        bot.reply(message, message.watsonData.output.text.join('\n'));
        invokeAction(message.watsonData.output, bot, message);
    }
    else {
        if (customSlackMessage == true) {
            bot.reply(message, message.watsonData.output.context.slack);
        }
        else {
            bot.reply(message, message.watsonData.output.text[0]);
        }
    }
}

controller.on('direct_message,direct_mention,mention', function (bot, message) {
    middleware.interpret(bot, message, function (err) {
        if (!err) {
            handleWatsonResponse(bot, message);
        }
        else {            
            bot.reply(message, "I'm sorry, but for technical reasons I can't respond to your message");
        }
    });
});

controller.on('interactive_message_callback', function (bot, message) {
    middleware.interpret(bot, message, function (err) {
        if (!err) {
            handleWatsonResponse(bot, message);
        }
        else {            
            bot.reply(message, "I'm sorry, but for technical reasons I can't respond to your message");
        }
    });
});

controller.on('create_bot', function (bot, config) {
    if (_bots[bot.config.token]) {
        // already online! do nothing.
    } else {
        bot.startRTM(function (err) {

            if (!err) {
                trackBot(bot);
            }

            bot.startPrivateConversation({ user: config.createdBy }, function (err, convo) {
                if (err) {
                    console.log(err);
                } else {
                    convo.say('I am a bot that has just joined your team');
                }
            });
        });
    }
});

controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});

controller.storage.teams.all(function (err, teams) {
    if (err) {
      console.log(err);
        throw new Error(err);
    }
    // connect all teams with bots up to slack!
    for (var t in teams) {
        if (teams[t].bot) {
            controller.spawn(teams[t]).startRTM(function (err, bot) {
                if (err) {
                    console.log('Error connecting bot to Slack:', err);
                } else {
                    trackBot(bot);
                }
            });
        }
    }
});

