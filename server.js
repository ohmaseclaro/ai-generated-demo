// server.js

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public_html')));

// OpenAI API configuration
const openai = new OpenAI();

// Chatbot API endpoint
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: userMessage }],
            max_tokens: 150,
        });

        const botResponse = completion.choices[0].message.content.trim();

        // Send response
        res.json({ response: botResponse });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});