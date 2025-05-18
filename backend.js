
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const sessionMemory = {};

app.post("/drsage", async (req, res) => {
  const { messages, userId = "anon" } = req.body;

  try {
    if (!sessionMemory[userId]) sessionMemory[userId] = [];
    sessionMemory[userId].push(...messages);
    if (sessionMemory[userId].length > 10)
      sessionMemory[userId] = sessionMemory[userId].slice(-10);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: sessionMemory[userId],
    });

    const reply = completion.choices[0].message.content;
    sessionMemory[userId].push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    res.status(500).json({ reply: "Sorry, Dr. Sage is unavailable right now." });
  }
});

app.listen(port, () => {
  console.log(`Dr. Sage backend running on port ${port}`);
});
