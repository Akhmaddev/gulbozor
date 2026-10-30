import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-3.5-flash-lite";

const SYSTEM_PROMPT = `Sen "Gulbozor.uz" saytining "Yordamchi Ai" yordamchisisan.
Foydalanuvchilarga o'zbek tilida, qisqa, do'stona va aniq javob ber.
Bilmagan narsangni o'ylab topma, bilmasang shuni ayt. emoji ishlatma
emoji ishlatma mumkin emas emoji`;

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages kerak" });
    }

    // Frontend formatini Gemini formatiga o'tkazish
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
        }),
      }
    );

    if (!response.ok) {
      console.error(await response.text());
      return res.status(500).json({ error: "Gemini xatosi" });
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "Kechirasiz, javob topa olmadim.";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

app.listen(3001, () => console.log("Server: http://localhost:3001"));