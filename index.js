// Setup depend
var ghScrape = require("gh-scrape"),
    CronJob = require('cron').CronJob,
    twilio = require('twilio'),
    program = require('commander');

// Pull env variables
var account_sid = process.env.ACCOUNT_SID,
    auth_token = process.env.AUTH_TOKEN,
    twilio_number = process.env.TWILIO_NUM;

var client = new twilio.RestClient(account_sid, auth_token);

// Pull cli args
program
  .version('0.0.1')
  .option('-n, --number [12345..]', 'recieveing phone number')
  .parse(process.argv); 

// Create Cron Job
var job = new CronJob('00 00 21 * * 0-6', function() {
    ghScrape.scrape("https://github.com/shikkic", function(userStats) {
        var currentStreak = userStats.currentStreak,
            longestStreak = userStats.longestStreak;
        var textBody = currentStreak ? "Awesome job today your current streak is "+currentStreak+". Keep up the good work, make some more commits! Beat your record of "+longestStreak : "Oh no! You're current streak today is 0, make a commit today you lazy shit! Your highest streak record is only "+longestStreak;
        client.sms.messages.create({
            to: program.number,
            from: twilio_number,
            body: textBody 
        }, function(error, message) {
            if (!error) {
                console.log('Success! The SID for this SMS message is:');
                console.log(message.sid);
                console.log('Message sent on:');
                console.log(message.dateCreated);
            } else {
                console.log('Oops! There was an error.');
                console.log(error);
            }
        });
    });
}, null, true, 'America/New_York');
