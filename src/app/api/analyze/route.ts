// Serverless route เชื่อมต่อ Gemini API (Structured JSON)

import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("หา GEMINI_API_KEY ไม่เจอใน .env.local");
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

    // ตั้งคำสั่งให้ AI ทำตัวเป็นนักจิตวิทยาและแมปเข้าวงล้ออารมณ์
    const prompt = `ข้อความจากผู้ใช้: "${text}"`;
    const systemInstruction = `
      คุณคือนักจิตวิทยาที่เชี่ยวชาญการถอดรหัสความรู้สึก (Emotion Decoder)
      หน้าที่ของคุณคือวิเคราะห์ข้อความของผู้ใช้ แล้วระบุอารมณ์ตามลำดับชั้น 3 ระดับ:
        `;

    // สั่งให้ Gemini ตอบกลับมาเป็น JSON เสมอ
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            layer_1_core: { type: Type.STRING },
            layer_2_secondary: { type: Type.STRING },
            layer_3_specific: { type: Type.STRING },
            underlying_cause: { type: Type.STRING },
            validation_note: { type: Type.STRING },
            micro_action: { type: Type.STRING },
          },
          required: [
            "layer_1_core",
            "layer_2_secondary",
            "layer_3_specific",
            "underlying_cause",
            "validation_note",
            "micro_action",
          ],
        },
      },
    });

    // แปลงผลลัพธ์เป็น JSON แล้วส่งกลับให้หน้าเว็บ
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
