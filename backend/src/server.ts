import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import authRouter from './auth';
import { authMiddleware } from './middleware';
import { saver, getThreadId } from './langgraphSaver';
import { getDb } from './db';
import { summarize } from './summarize';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}
const genAI = new GoogleGenerativeAI(apiKey);
const gemini = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

// iFixit API helpers
async function searchIFixit(query: string) {
  const url = `https://www.ifixit.com/api/2.0/search/${encodeURIComponent(query)}?filter=device`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data.results?.[0] || null;
}

async function getGuide(deviceTitle: string) {
  const url = `https://www.ifixit.com/api/2.0/wikis/CATEGORY/${encodeURIComponent(deviceTitle)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data.guides?.[0] || null;
}

async function getGuideDetails(guideId: string) {
  const url = `https://www.ifixit.com/api/2.0/guides/${guideId}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

// Streaming Gemini response
import type { Request, Response } from 'express';
async function streamGemini(prompt: string, res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  const result = await gemini.generateContentStream(prompt);
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) res.write(`data: ${text}\n\n`);
  }
  res.end();
}

// Auth router
app.use('/auth', authRouter);

// Usage analytics endpoint
app.post('/usage', authMiddleware, async (req: Request, res: Response) => {
  const { tokens } = req.body;
  const db = await getDb();
  await db.run('INSERT INTO usage (user_id, total_tokens) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET total_tokens = total_tokens + ?', [(req as any).userId, tokens, tokens]);
  res.sendStatus(200);
});

// Main chat endpoint
app.post("/api/chat", authMiddleware, async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });

  // 1. Search iFixit
  const device = await searchIFixit(message);
  if (!device) return res.status(404).json({ error: "Device not found in iFixit" });

  // 2. Get guide
  const guide = await getGuide(device.title);
  if (!guide) return res.status(404).json({ error: "No guide found for device" });

  // 3. Get guide details
  const guideDetails = await getGuideDetails(guide.guideid);
  if (!guideDetails) return res.status(404).json({ error: "Guide details not found" });

  // 4. Clean guide data
  const cleanGuide = {
    title: guideDetails.title,
    steps: guideDetails.steps?.map((step: any, i: number) => {
      const text = step.lines.map((l: any) => l.text_raw).join(" ");
      const image = step.media?.images?.[0]?.original || null;
      return `Step ${i + 1}: ${text}${image ? ` [Image: ${image}]` : ""}`;
    }) || [],
    url: guideDetails.url
  };

  // 5. Gemini prompt
  const prompt = `You are a repair assistant.\nYou are ONLY allowed to use the verified repair data below.\nDo NOT add steps.\nDo NOT guess.\nFormat output in Markdown.\n\nVerified Repair Data:\n${JSON.stringify(cleanGuide, null, 2)}`;

  // 6. Stream Gemini response
  await streamGemini(prompt, res);
});

// Context management in chat endpoint
app.post('/chat', authMiddleware, async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });

  const db = await getDb();
  const sessionId = (req as any).userId; // Assuming userId is used as session identifier

  // Context management
  let messages: any[] = await db.all('SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at DESC LIMIT 20', [sessionId]);
  messages = messages.reverse(); // Reverse to get chronological order
  if (messages.length > 20) {
    const summary = await summarize(messages.slice(0, 10));
    // Store summary in DB
    await db.run('INSERT INTO summaries (id, session_id, summary) VALUES (?, ?, ?)', [/* uuid */, sessionId, summary]);
    messages = [
      { role: 'system', content: summary } as any,
      ...messages.slice(10)
    ];
  }

  // 1. Search iFixit
  const device = await searchIFixit(message);
  if (!device) return res.status(404).json({ error: "Device not found in iFixit" });

  // 2. Get guide
  const guide = await getGuide(device.title);
  if (!guide) return res.status(404).json({ error: "No guide found for device" });

  // 3. Get guide details
  const guideDetails = await getGuideDetails(guide.guideid);
  if (!guideDetails) return res.status(404).json({ error: "Guide details not found" });

  // 4. Clean guide data
  const cleanGuide = {
    title: guideDetails.title,
    steps: guideDetails.steps?.map((step: any, i: number) => {
      const text = step.lines.map((l: any) => l.text_raw).join(" ");
      const image = step.media?.images?.[0]?.original || null;
      return `Step ${i + 1}: ${text}${image ? ` [Image: ${image}]` : ""}`;
    }) || [],
    url: guideDetails.url
  };

  // 5. Gemini prompt
  const prompt = `You are a repair assistant.\nYou are ONLY allowed to use the verified repair data below.\nDo NOT add steps.\nDo NOT guess.\nFormat output in Markdown.\n\nVerified Repair Data:\n${JSON.stringify(cleanGuide, null, 2)}`;

  // 6. Stream Gemini response
  await streamGemini(prompt, res);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`FixMaster server running on port ${PORT}`);
});
