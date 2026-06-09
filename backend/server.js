const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors()); 
app.use(express.json());

const PORT = process.env.PORT || 5000;
const GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
const KEY_NAME = process.env.KEY_NAME || "Gemini API Key";
const PROJECT_NAME = process.env.PROJECT_NAME || "projects/546155233681";

const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

// Chat API Route
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: { message: "Message is required" } });
        }

        if (!GOOGLE_API_KEY || GOOGLE_API_KEY.includes("YAHAN_APNI")) {
            return res.status(500).json({ error: { message: "Backend me API Key set nahi hai! .env file check karein." } });
        }

        // Fetch wrapper call to Gemini API
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `You are Biswa AI (Key Profile: ${KEY_NAME}, Registered under: ${PROJECT_NAME}), an expert bot specialized in gaming, coding cheat sheets, quick tricks, and useful hacks. Keep responses extremely helpful, formatted with clean line breaks, and concise. User asks: ${message}` 
                    }] 
                }]
            })
        });

        const data = await response.json();
        return res.json(data);

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Internal Server Error occurred on backend." } });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});
