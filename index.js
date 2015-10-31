/*
/////////////////////////////
// Initialize Dependencies //
/////////////////////////////
*/
require('dotenv').load(); // Loads in .env variables
var ghScrape = require("gh-scrape"), // Github stat scraping module
    CronJob = require('cron').CronJob,
    twilio = require('twilio'),
    email   = require('emailjs');

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
var job = new CronJob(TIME, function() {
    // Scape github user's stats, and return userStats
    ghScrape.scrape("https://github.com/"+username, function(userStats) {
        var currentStreak = parseInt(userStats.currentStreak),
            longestStreak = userStats.longestStreak;
        var textBody = currentStreak ? "Awesome job today your current streak is "+currentStreak+". Keep up the good work, make some more commits! Beat your record of "+longestStreak : "Oh no! You're current streak today is 0, make a commit today you lazy shit! Your highest streak record is only "+longestStreak;
        //Client Sends SMS
        sendSMS(textBody);
    });
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
    emailServer.send({
       text:    error, 
       from:    email_account, 
       to:      email_account,
       subject: "hackerTracker9000 fatal error"
    }, function(err, message) {
        console.log(err || message); 
    });
}
