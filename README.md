# hackerTracker9000

A small SMS tool to remind you to make more commits on your public github projects!

If you use github for work or private repos your work and commits are often unseen and undocumented once you leave the repo. So this tool helps to remind you to keep working on your public projects to keep your github profile looking sharp!

#### Private + Public Contributions 
![Github](http://i.imgur.com/HTV11P0.png)

#### Public Contributions
![Github](http://i.imgur.com/Rj2hsRd.png)

---
## How to use

Clone the repo
`$ git clone https://github.com/Shikkic/hackerTracker9000`

Navigate to the root folder
`$ cd hackerTracker9000`

Create an .env file
`$ touch .env`

Fill out the .env with appropriate information
```sh
# Twilio Credentials
ACCOUNT_SID=''
AUTH_TOKEN=''
TWILIO_NUM=''
# Github User
USERNAME=''
# Phone number to SMS (Make sure number starts with +1)
NUMBER=''
# Email Credentials
EMAIL_ACCOUNT_NAME=''
EMAIL_PASSWORD=''
HOST=''
SSL=''
# Time you want to recieve texts
TIME='00 00 21 * * 0-6'
```

Run the file and you should be done!
`$ node index.js`

> Protip: If you want this to run continously, it's highly recommend you deploy it to a VM or service where it can run as a background process instead of running it on you local machine.

