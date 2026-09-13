require("dotenv").config();

const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// Serve the portfolio from the public folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!groq) {
      return res.status(503).json({
        reply: "Groq AI is not configured. Please add your GROQ_API_KEY."
      });
    }

    const messages = Array.isArray(req.body.messages)
      ? req.body.messages
          .filter(
            (message) =>
              message &&
              (message.role === "user" || message.role === "assistant") &&
              typeof message.content === "string"
          )
          .slice(-12)
          .map((message) => ({
            role: message.role,
            content: message.content.slice(0, 4000)
          }))
      : [];

    const portfolioContext = `
You are the AI assistant for Jessica Danielle C. Ande's professional portfolio.

You can answer general questions normally.

For questions specifically about Jessica, use only the portfolio information provided to you. Do not invent personal information.

Jessica's information:
- Name: Jessica Danielle C. Ande
- IT Support Intern / On-the-Job Trainee
- Started August 19, 2026
- Education: Philippine Christian University
- Skills include Microsoft Word, Excel, PowerPoint, problem solving, eagerness to learn, task prioritization, and openness to new ideas.
- Projects: PCU Enrollment Form, Loops & Iterations, Birth Month Calendar, and Multiplication Table.
- Achievement: College Dean's List 2025–2026.

Be friendly, professional, and concise.
Do not claim to be Jessica.
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: portfolioContext
        },
        ...messages
      ],
      temperature: 0.6,
      max_completion_tokens: 700
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    res.json({ reply });
  } catch (error) {
    console.error("Groq error:", error);

    res.status(500).json({
      reply: "Sorry, something went wrong while connecting to the AI."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Portfolio running on port ${PORT}`);
  console.log(`Groq AI: ${groq ? "configured" : "not configured"}`);
});