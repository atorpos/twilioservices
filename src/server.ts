import express, { Request, Response, NextFunction } from 'express';
import twilio from 'twilio';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT || '3002', 10);

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const accountSid = process.env.ACCOUNT_SID as string;
const authToken = process.env.AUTH_TOKEN as string;
const client = twilio(accountSid, authToken);

// Dev logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
    }
    next();
});

// Voice webhook
app.post('/webhook/voice', (req: Request, res: Response) => {
    const twiml = new twilio.twiml.VoiceResponse();

    const callSid: string = req.body.CallSid;
    const from: string = req.body.From;
    const to: string = req.body.To;
    const callStatus: string = req.body.CallStatus;

    console.log(`Incoming call from ${from} to ${to}, Status: ${callStatus}`);

    twiml.say('Hello! Thank you for calling. This is a webhook response.');

    res.type('text/xml');
    res.send(twiml.toString());
});

// Status webhook
app.post('/webhook/status', (req: Request, res: Response) => {
    const callSid: string = req.query.callSid as string;
    const callStatus: string = req.query.callStatus as string;
    const duration: string = req.query.duration as string;

    console.log(`Call ${callSid}, Status: ${callStatus}, Duration: ${duration} seconds`);

    res.status(200).send('OK');
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Twilio webhook server running on port ${port}`);
    console.log(`🐳 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${port}/health`);
    console.log(`📞 Webhook URL: http://localhost:${port}/webhook/voice`);
});

export async function makeOutboundCall(toNumber: string, fromNumber: string) {
    try {
        const call = await client.calls.create({
            url: 'https://api.awoz.co/twilio/webhook/voice',
            to: toNumber,
            from: fromNumber,
        });
        console.log(`Call successfully created: ${call.sid}`);
        return call;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export { app, server };