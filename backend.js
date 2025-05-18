const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/drsage', async (req, res) => {
  const { message, treatment } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are Dr. Sage, a compassionate and highly intelligent virtual medical assistant with full diagnostic capabilities. 
If the user's message is vague or non-specific (e.g., "I have an earache"), you must ask follow-up questions to gather more details 
before offering an assessment or treatment. Adjust responses based on their preference for conventional, natural, or blended care. 
You may explain complex ideas in plain language when necessary, but do not skip critical medical considerations.`
        },
        {
          role: 'user',
          content: `${message}. They prefer a ${treatment} treatment approach.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error('Error from OpenAI:', err.message);
    res.status(500).json({ error: 'Failed to get response from Dr. Sage' });
  }
});

app.listen(3000, () => {
  console.log('Dr. Sage backend running on port 3000');
});
