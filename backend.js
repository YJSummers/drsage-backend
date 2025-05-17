
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
