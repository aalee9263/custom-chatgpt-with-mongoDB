
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');
const ejs = require('ejs');

const app = express();
const port = 3000;

const openai = new OpenAI({
    apiKey: 'process.env.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', // Replace this with your OpenAI API key
});

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(cors());
app.use(bodyParser.json());

app.get('/home', (req, res) => res.render('pages/home'))
app.get('/about', (req, res) => res.render('pages/about'))
app.get('/contact', (req, res) => res.render('pages/contact'))

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
            max_tokens: 150,
        });

        res.json({ response: response.choices[0].message.content.trim() });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong with the API request' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
