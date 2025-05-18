const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/drsage', async (req, res) => {
  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error('Error from OpenAI:', err.message);
    res.status(500).json({ error: 'Failed to get response from Dr. Sage' });
  }
});

app.listen(3000, () => {
  console.log('Dr. Sage memory backend running on port 3000');
});
