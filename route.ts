import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body.history) ? body.history : [];
    if (!message || message.length > 12000) {
      return NextResponse.json({ error: "Enter a message under 12,000 characters." }, { status: 400 });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        error: "Gemini is not configured yet. Add GEMINI_API_KEY to your Vercel Environment Variables and redeploy."
      }, { status: 503 });
    }
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: "You are VOXON AI, a clear, capable, friendly creative assistant. Be useful, concise when possible, and transparent about uncertainty."
    });
    const safeHistory = history.slice(-12).filter((m: any) =>
      (m.role === "user" || m.role === "assistant") && typeof m.text === "string"
    );
    const chat = model.startChat({
      history: safeHistory.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text.slice(0, 12000) }]
      }))
    });
    const result = await chat.sendMessage(message);
    return NextResponse.json({ text: result.response.text() });
  } catch {
    return NextResponse.json({ error: "The AI request failed. Check your API key, quota, and server logs." }, { status: 500 });
  }
}
