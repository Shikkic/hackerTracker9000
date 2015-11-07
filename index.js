/*
/////////////////////////////
// Initialize Dependencies //
/////////////////////////////
*/
require('dotenv').load(); // Loads in .env variables
var ghScrape = require("gh-scrape"), // Github stat scraping module
    CronJob = require('cron').CronJob,
    twilio = require('twilio'),
    email   = require('emailjs'),
    later = require('later'),
    _ = require('underscore');

/*
//////////////////////////////
// Initialize Env Variables //
//////////////////////////////
*/
var account_sid = process.env.ACCOUNT_SID, //Twilio ACCOUNT_SID
    auth_token = process.env.AUTH_TOKEN, //Twilio AUTH_TOKEN
    twilio_number = process.env.TWILIO_NUM, //Twilio number
    username = process.env.USERNAME, //Github User you want to query for
    number = process.env.NUMBER, //Phone number you want to text
    enable_error_emails = process.env.ENABLE_ERROR_EMAILS, //Enables Error Email Logging
    email_account = process.env.EMAIL_ACCOUNT_NAME, //Email Address you want to recieve errors at
    email_password = process.env.EMAIL_PASSWORD, //Email Password
    host = process.env.HOST, //Email STMP server name
    ssl = process.env.SSL, //SSL encryption T:F
    TIME = process.env.TIME; //When you want to recieve your SMS(s)

/*
//////////////////////////////////////////////
// Initialize Twilio Client && Email Server //
//////////////////////////////////////////////
*/
var client = new twilio.RestClient(account_sid, auth_token),
    emailServer  = email.server.connect({
       user:     email_account,
       password: email_password, 
       host:     host, 
       ssl:      ssl
    });

/*
//////////////////
// Run Cron Job //
//////////////////
*/
// TODO log when it will be sending!
console.log("Sending SMS to "+number+" at "+Date(JSON.stringify(later.parse.cron(TIME)))+"!");
var job = new CronJob(TIME, function() {
    // gh-scrape module: Scapes github user's stats and return userStats object
    ghScrape.scrapeCommits("https://github.com/"+username, function(userCommits) {
        try {
            // generate message for user
            var messageText = createMessage(userStats);
        }
        catch(e) {
            // Having an issue where the gh-scrape module returns undefined
            // Want to be notified if this error for now
            sendErrorEmail(e);
        }
        // send SMS
        sendSMS(messageText);
    });
// TODO Make Time/Zone a env variale
}, null, true, 'America/New_York');

/*
////////////////////////////
// Functions Declarations //
////////////////////////////
*/
function sendSMS(messageString) {
    client.sms.messages.create({
        to: number,
        from: twilio_number,
        body: messageString
    }, function(error, message) {
        if (!error) {
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);
            console.log('Message sent on:');
            console.log(message.dateCreated);
        } else {
            console.log(error);
            sendErrorEmail(JSON.stringify(error));
        }
    });
};

function sendErrorEmail(error) {
    // Only send email if error emails are enabled
    if (enable_error_emails) {
        emailServer.send({
           text:    error, 
           from:    email_account, 
           to:      email_account,
           subject: "hackerTracker9000 fatal error has occurred"
        }, function(err, message) {
            console.log(err || message); 
        });
    }
};

function createMessage(userCommits, userStreak) {
    // Retrieve User's current streak and their longest streak
    //var currentStreak = parseInt(userStats.currentStreak),
        //longestStreak = userStats.longestStreak;
    var currentNumCommits = _.last(userCommits)
    currentNumCommits = currentNumCommits.commits;
    var currentStreak = userStreak.currentStreak;
    var average = averageCommits(userCommits); 
    var textBody = parseInt(currentNumCommits) ? "Awesome job today making " + currentNumCommits +" commits, Current streak is "+currentStreak+"! You're "+(parseInt(currentStreak) / 100)*(100)+"% of the way to 100 days! You made "+average+"% more than your average commits!" : "Oh no! You made zero commits, make a commit today you lazy shit!";

    return textBody;
};

function averageCommits(userCommits) {
    var currentNumCommits = _.last(userCommits);
    currentNumCommits = currentNumCommits.commits;
    var userCommits = _.last(userCommits, 30);
    var totalNumCommits = 0;
    for (var i in userCommits) {
        totalNumCommits += parseInt(userCommits[i].commits);
    }
    var totalAverage = (totalNumCommits / userCommits.length)

    return ((currentNumCommits/totalAverage)*100).toFixed(2);
};
