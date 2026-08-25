// Serverless route เชื่อมต่อ Gemini API (Structured JSON)

import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import {
  SYSTEM_INSTRUCTION,
  EMOTION_RESPONSE_SCHEMA,
} from "@/constants/systemPrompt";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("หา GEMINI_API_KEY ไม่เจอ");
      return NextResponse.json(
        { error: "ระบบยังไม่ได้ตั้งค่า API Key" },
        { status: 500 },
      );
    }

    const ai = new GoogleGenAI();

    // รับข้อความที่ผู้ใช้พิมพ์ส่งมา
    const body = await req.json();
    const { text } = body;

    if (!text || text.trim() === "") {
      return NextResponse.json(
        { error: "กรุณาพิมพ์ข้อความความรู้สึก" },
        { status: 400 },
      );
    }

    // ตั้งคำสั่งให้ AI ทำตัวเป็นนักจิตวิทยา
    const prompt = `ข้อความจากผู้ใช้: "${text}"`;

    // ให้ Gemini ตอบกลับเป็น JSON เสมอ
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: EMOTION_RESPONSE_SCHEMA,
      },
    });

    // แปลงเป็น JSON แล้วส่งกลับให้หน้าเว็บ
    const result = JSON.parse(response.text || "{}");
    return NextResponse.json(result);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการวิเคราะห์:", error);
    return NextResponse.json(
      { error: "ระบบไม่สามารถประมวลผลได้ในขณะนี้" },
      { status: 500 },
    );
  }
}
