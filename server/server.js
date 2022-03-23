const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const PORT = 3000
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

let profanityData;

// Endpoint to handle Sendbird webhook events. To add another webhook event handler, add case to switch statement
app.post('/sendbird/webhook', (req,res) => {

    switch (req.body.category) {
        case 'profanity_filter:replace':
            console.log(`Received handled SendBird webhook event: ${req.body.category}`);
            profanityData = {
                "time": new Date().toLocaleString(),
                "sender": req.body.sender.nickname,
                "message": req.body.payload.message
            }
            
            notifyProfanity().then();
            break;
        default:
            console.log(`Received unhandled SendBird webhook event: ${req.body.category}`)
            break;
    }

    return res.sendStatus(200);
})

app.get('/notify', (req,res) => {

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');

    res.send(`data: ${JSON.stringify(profanityData)}\n\n`);
})

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`)
})

async function notifyProfanity() {
    var requestOptions = { method: 'GET' }
    let url = 'http://localhost:3000/notify'

    try {
        const response = await axios.request(url, requestOptions);
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error);
        return error
    }
}
