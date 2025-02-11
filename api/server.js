const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");

let dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt = `You are an AI assistant that is part of the online code IDE Judge0. Your job is to answer the user's questions pertaining to the code in the editor, which will be provided to you for context. Your role will include suggesting fixes for code and if asked for, providing explanations or improvements for the code. You are expected to provide helpful and accurate responses to the user's queries. You are also expected to be polite and professional in your responses. If you are unsure about a response, ask for clarification or provide a general response.`;

app.post("/api/ai-chat", async (req, res) => {
  const { messages } = req.body;

  const userPrompt = messages[0].content;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(error.status).json({ error: error.error.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port http://localhost:3000`);
});
