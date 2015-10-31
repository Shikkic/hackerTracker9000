# hackerTracker9000

A small SMS tool to remind you to make more commits on your public github projects!

If you use github for work or private repos your work and commits are often unseen and undocumented once you leave the repo. So this tool helps to remind you to keep working on your public projects to keep your github profile looking sharp!

#### Private + Public Contributions 
![Github](http://i.imgur.com/HTV11P0.png)

#### Public Contributions
![Github](http://i.imgur.com/Rj2hsRd.png)

---
## How to use

What you'll need to get started!
  - Twilio API Credentials
    - Twilio Phone Number
    - Twilio Credits

Clone the repo

`$ git clone https://github.com/Shikkic/hackerTracker9000`

Navigate to the root folder

`$ cd hackerTracker9000`

Download dependencies

`$ npm install`

#### IMPORTANT

Run `$ gulp build` it will automatically ignore your .env file locally.

> NEVER UPLOAD YOUR .ENV PUBLICLY, EVER

Now you just need to fill out the .env with appropriate information
```sh
# Twilio Credentials
ACCOUNT_SID='<TWILIO_ACCOUNT_SID>'
AUTH_TOKEN='<TWILIO_AUTH_TOKEN>'
TWILIO_NUM='<TWILIO_NUMBER>' 

# Github User You want to track
USERNAME='<GITHUB_USERNAME>'

# Phone number recieving SMS notifcations
NUMBER='<RECIEVING_PHONE_NUMBER>'

# Email Credentials for error handling
ENABLE_ERROR_EMAILS="<true or false">
EMAIL_ACCOUNT_NAME='<EMAIL_ADDRESS>'
EMAIL_PASSWORD='<EMAIL_PASSWORD>'
HOST='<HOST_NAME>' # exp: smtp.gmail.com
SSL='<true or false>'

# Time you want to recieve texts
TIME='00 21 0 * * 0-6' #default is everyday at 8pm
```

Run `$ gulp run` and you're all set!

> Protip: If you want this to run continuously, it's highly recommended you deploy it to a VM or service where it can run as a background process instead of running it on your local machine. I will put up a tutorial later if you'd like to do learn how to do that.
