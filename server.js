const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());

app.use(morgan('combined'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.use((req, res, next) => {
   if(process.env.NODE_ENV === 'development') {
       console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
       console.log('Headers:', req.headers);
       console.log('Body:', req.body);
   }
   next();
});

app.post('/webhook/voice', (req, res) => {

    // Create TwiML response
    const twiml = new twilio.twiml.VoiceResponse();

    // Extract call information
    const callSid = req.body.CallSid;
    const from = req.body.From;
    const to = req.body.To;
    const callStatus = req.body.CallStatus;

    console.log(`Incoming call from ${from} to ${to}, Status: ${callStatus}`);

    // Respond to the call
    twiml.say('Hello! Thank you for calling. This is a webhook response.');

    res.type('text/xml');
    res.send(twiml.toString())
});

app.post('/webhook/status', (req, res) => {
    const callSid = req. query.callSid;
    const callStatus = req.query.callStatus;
    const duration = req.query.duration;

    console.log(`Incoming call from ${callSid} to ${callStatus}, Duration: ${duration} seconds`);

    res.status(200).send('OK');
});

app.get('/health', (req, res) => {
    res.json({status: 'OK', timestamp: new Date().toISOString()});
});

app.listen((port) => {
    console.log(`Listening on ${port}`);
})

const server = app.listen(port, '0.0.0.0', () =>{
    console.log(`🚀 Twilio webhook server running on port ${port}`);
    console.log(`🐳 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${port}/health`);
    console.log(`📞 Webhook URL: http://localhost:${port}/webhook/voice`);
});

async function makeOutboundCall(toNumber, fromNumber) {
    try {
        const call = await client.calls.create({
            url: 'https://api.awoz.co/twilio/webhook/voice',
            to: toNumber,
            from: fromNumber
        });
        console.log(`Call successfully ${call.sid}`);
        return call;
    } catch (err) {
        console.error(err);
        throw err;

    }

}

module.exports = {app, makeOutboundCall};