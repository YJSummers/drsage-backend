
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require("openai");

const app = express(); // ✅ This is what's missing right now

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.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
});

app.post('/drsage', async (req, res) => {
  const { message, treatment } = req.body;

  const prompt = `
You are Dr. Sage, an omniscient AI medical advisor. The user prefers a \${treatment} approach. Analyze their concern and offer accurate, respectful guidance:
"\${message}"
`;

  const completion = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [{ role: 'system', content: prompt }],
    temperature: 0.7,
  });

  res.json({ reply: completion.data.choices[0].message.content });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Dr. Sage backend running on port ' + PORT));
