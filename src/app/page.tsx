//src\app\page.tsx
// Main Container (State: Input -> Loading -> Result)
"use client";

import { useState } from "react";
import { EmotionResult } from "@/types/emotion";
import { CORE_EMOTIONS, CoreEmotionType } from "@/constants/emotionsData";
import { X, ArrowRight, RotateCcw } from "lucide-react";
import ShareCard from "@/components/result/ShareCard";
import AtmosphericBg from "@/components/visualizer/AtmosphericBg";
import MoodFace from "@/components/visualizer/MoodFace";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // ข้อความตัวอย่างสำหรับกดทดสอบได้ทันที
  const SAMPLE_TEXTS = [
    "รู้สึกหน่วงๆ ไม่อยากคุยกับใคร แต่ก็ไม่อยากอยู่คนเดียว",
    "เหนื่อยกับงานมาก รู้สึกทำดีแค่ไหนก็ไม่มีใครเห็นค่า",
    "ใจสั่น กังวลกับเรื่องที่ยังมาไม่ถึงตลอดเวลา",
  ];

  // ฟังก์ชันยิงข้อมูลไปหา API หลังบ้าน
  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
      }

      if (data && data.layer_1_core) {
        const matchedKey = Object.keys(CORE_EMOTIONS).find((key) =>
          data.layer_1_core.includes(key),
        ) as CoreEmotionType;

        if (matchedKey) {
          data.layer_1_core = matchedKey; // แก้ที่ data ได้เลยเพราะยังไม่ลง State
        }
      }

      setResult(data);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("ไม่สามารถวิเคราะห์ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setResult(null);
    setErrorMsg("");
  };

  // ดึงชุดสีตามอารมณ์หลักที่ AI ส่งมา
  const activeEmotion = result
    ? CORE_EMOTIONS[result.layer_1_core as CoreEmotionType]
    : null;

  return (
    <main className="min-h-screen text-neutral-800 flex justify-center p-4 relative">
      {/* พื้นหลังเปลี่ยนสีตามอารมณ์ (ถ้าหน้าแรกให้ใช้สีขาวอมเทา #F9FAFB) */}
      <AtmosphericBg color={activeEmotion?.color || "#F9FAFB"} />
      {/* จำกัดขนาดหน้าจอให้พอดีมือถือ (Mobile-First Frame) */}
      <div className="w-full max-w-md flex flex-col justify-between">
        {/* 2. เนื้อหาหลักตามสถานะ */}
        <div className="flex-1 flex flex-col justify-center">
          {/* สเต็ปที่ 1: กำลังโหลด (Loading State) */}
          {isLoading && (
            <div className="text-center space-y-4 animate-pulse">
              <MoodFace
                mouth="think"
                size={72}
                className="text-neutral-700 mx-auto"
              />
              <p className="text-sm text-neutral-600 font-medium">
                กำลังวิเคราะห์ความรู้สึกของคุณ...
              </p>
            </div>
          )}

          {!isLoading && !result && (
            <div className="flex flex-col justify-center h-full pb-8">
              {/* 1. ส่วนหัวข้อ */}
              <div className="text-center mb-6 space-y-2">
                <h2 className="text-2xl font-black tracking-tight text-neutral-900">
                  วันนี้คุณรู้สึกอย่างไร?
                </h2>
                <p className="text-[12px] text-neutral-500">
                  พื้นที่ระบายความรู้สึกของคุณ
                </p>
              </div>

              {/* 2. กล่องข้อความสไตล์สมุดโน้ต (อยู่ตรงกลาง พิมพ์ง่ายบนมือถือ) */}
              <div className="bg-white rounded-3xl p-3 shadow-sm border border-neutral-200 flex flex-col focus-within:border-neutral-400 focus-within:shadow-md transition-all mb-3 relative">
                <textarea
                  className="w-full bg-transparent resize-none outline-none text-neutral-800 text-sm px-3 py-2 min-h-[130px] placeholder:text-neutral-400 leading-relaxed"
                  placeholder="พิมพ์ความรู้สึกของคุณที่นี่..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />

                {/* แถบด้านล่างกล่อง: แสดงจำนวนตัวอักษร + ปุ่มส่ง */}
                <div className="flex justify-between items-end mt-2">
                  <span className="text-[10px] text-neutral-400 pl-3 pb-2 font-medium">
                    {inputText.length > 0
                      ? `${inputText.length} ตัวอักษร`
                      : "พร้อมรับฟังเสมอ"}
                  </span>
                  <button
                    onClick={handleAnalyze}
                    disabled={!inputText.trim()}
                    className="w-12 h-12 shrink-0 bg-neutral-900 text-white rounded-2xl flex items-center justify-center disabled:opacity-30 disabled:bg-neutral-300 hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-500 text-center mb-3 bg-red-50 py-2 rounded-xl">
                  {errorMsg}
                </p>
              )}

              {/* 3. ข้อความตัวอย่าง (ย้ายมาล่างสุด เพื่อเป็นแค่ตัวเลือกเสริม) */}
              <div className="mt-4">
                <div className="flex items-center gap-3 mb-4 opacity-60">
                  <div className="h-px bg-neutral-300 flex-1" />
                  <span className="text-[10px] text-neutral-500 font-medium">
                    หรือเลือกจากข้อความตัวอย่าง
                  </span>
                  <div className="h-px bg-neutral-300 flex-1" />
                </div>

                <div className="flex flex-col gap-2">
                  {SAMPLE_TEXTS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInputText(sample)}
                      className="text-left text-[11px] bg-white/60 border border-neutral-200 hover:border-neutral-400 text-neutral-600 px-4 py-3 rounded-2xl transition active:scale-[0.98] cursor-pointer shadow-sm"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* สเต็ปที่ 3: หน้าแสดงผลลัพธ์ (Result State) */}
          {!isLoading && result && (
            <div className="flex flex-col h-full w-full animate-in fade-in zoom-in-95 duration-500">
              {/* ให้ ShareCard ควบคุมพื้นที่ความสูงทั้งหมดด้วยตัวเอง */}
              <ShareCard
                result={result}
                color={activeEmotion?.color || "#14B8A6"}
                mouth={activeEmotion?.mouth ?? "smile"}
                angry={activeEmotion?.angry}
                onReset={handleReset}
              />
            </div>
          )}
        </div>

        {/* 3. ส่วนท้าย (Footer) */}
        <footer className="text-center text-[10px] text-neutral-500 mt-6 pb-2">
          เราไม่เก็บข้อมูลของคุณ สบายใจได้นะ 🤍
        </footer>
      </div>
    </main>
  );
}
