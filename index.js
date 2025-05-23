require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 5005;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/make-vapi-call', async (req, res) => {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
        const response = await axios.post(
            'https://api.vapi.ai/call',
            // {
            //     phoneNumber: mobileNumber,
            //     twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
            //     twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
            //     assistantId: process.env.ASSISTANT_ID
            // },
            {
                  phoneNumberId: "a522c8af-b512-44b9-94ff-dcf9dbb0b1f3",
                  assistantId: "9ed58e91-2d5f-489b-a65a-ab8c2427d6b6",
                  customer: {
                  number: mobileNumber
                    }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({
            error: 'Failed to make Vapi agent call',
            details: error.response ? error.response.data : error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
