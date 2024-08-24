const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb'); // Import MongoDB client
const { OpenAI } = require('openai');
const ejs = require('ejs');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3000;

// Initialize OpenAI client with API key from .env
const openai = new OpenAI({
    apiKey: process.env.API_KEY, // Use environment variable for API key
});
console.log("API Key:", process.env.API_KEY);

// MongoDB connection URL and database name from .env
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017'; // Fallback to localhost if not defined
const dbName = process.env.DB_NAME || 'chatDB'; // Fallback to 'chatDB' if not defined
let db;

// Connect to MongoDB
MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        db = client.db(dbName);
    })
    .catch(error => console.error('MongoDB connection error:', error));

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(cors());
app.use(bodyParser.json());

app.get('/home', (req, res) => res.render('pages/home'));
app.get('/about', (req, res) => res.render('pages/about'));
app.get('/contact', (req, res) => res.render('pages/contact'));

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
            max_tokens: 150,
        });

        const botResponse = response.choices[0].message.content.trim();

        // Save conversation to MongoDB
        const chatCollection = db.collection('chats');
        await chatCollection.insertOne({
            userMessage: userMessage,
            botResponse: botResponse,
            timestamp: new Date(),
        });

        res.json({ response: botResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong with the API request' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
