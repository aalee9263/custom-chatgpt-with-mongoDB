const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');
const ejs = require('ejs');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3000;

// Initialize OpenAI client with API key from .env
const openai = new OpenAI({
    apiKey: process.env.API_KEY, // Use environment variable for API key
});

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(cors());
app.use(bodyParser.json());

app.get('/home', (req, res) => res.render('pages/home'));
app.get('/about', (req, res) => res.render('pages/about'));
app.get('/contact', (req, res) => res.render('pages/contact'));

// In-memory conversation history storage
let conversationHistory = [];

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    // Add user message to history
    conversationHistory.push({ role: 'user', content: userMessage });

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: conversationHistory,
            max_tokens: 150,
        });

        const botResponse = response.choices[0].message.content.trim();

        // Add bot response to history
        conversationHistory.push({ role: 'assistant', content: botResponse });

        res.json({ response: botResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong with the API request' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
