require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY  // ✅ Pulled securely from Render’s environment
});

app.post('/drsage', async (req, res) => {
  const { message, treatment } = req.body;

  const prompt = `
You are Dr. Sage, an omniscient AI medical advisor. The user prefers a ${treatment} approach. Analyze their concern and offer accurate, respectful guidance:
"${message}"
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.7,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('Dr. Sage error:', error);
    res.status(500).json({ error: 'Something went wrong processing your request.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Dr. Sage backend running on port ${PORT}`));
