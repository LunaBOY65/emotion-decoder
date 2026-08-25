//src\app\page.tsx
// Main Container (State: Input -> Loading -> Result)
"use client";

import { useState } from "react";
import { EmotionResult } from "@/types/emotion";
import { CORE_EMOTIONS, CoreEmotionType } from "@/constants/emotionsData";
import { X, ArrowRight, RotateCcw } from "lucide-react";
import WheelSlice from "@/components/visualizer/WheelSlice";
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
      <div className="w-full max-w-md flex flex-col justify-between py-6">
        {/* 1. ส่วนหัว (Header) */}
        <header className="flex items-center justify-between mb-6 pt-4">
          {result ? (
            <button
              onClick={handleReset}
              aria-label="ปิด"
              className="w-8 h-8 flex items-center justify-center text-neutral-700/70 hover:text-neutral-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <span className="w-8" /> // เว้นที่ว่างไว้ให้ชื่ออยู่กึ่งกลางเสมอ
          )}
          <h1 className="text-sm font-semibold tracking-tight text-neutral-800/80">
            Current Mood
          </h1>
          <span className="w-8" />
        </header>

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
                กำลังตั้งใจฟังความรู้สึกของคุณ...
              </p>
            </div>
          )}

          {!isLoading && !result && (
            <div className="flex flex-col h-full pb-4">
              {/* คาแรกเตอร์คอยฟังอยู่ด้านบน ทำให้แอปดูมีชีวิตชีวา ไม่ใช่แค่กล่องขาวๆ */}
              <div className="flex flex-col items-center text-center mt-2 mb-8">
                <MoodFace
                  mouth="smile"
                  size={72}
                  className="text-neutral-800 mb-4"
                />
                <h2 className="text-2xl font-black tracking-tight text-neutral-900">
                  วันนี้เป็นอย่างไรบ้าง?
                </h2>
              </div>

              <div className="flex-1" />

              {/* แถบข้อความตัวอย่าง (ทำเป็นปุ่มมนๆ วางซ้อนกัน) */}
              <div className="mb-6 space-y-3">
                <span className="text-[12px] text-neutral-600 font-medium">
                  ลองแตะข้อความตัวอย่าง:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_TEXTS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInputText(sample)}
                      className="text-left text-xs bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-700 px-4 py-2.5 rounded-full transition active:scale-95 cursor-pointer"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-500 text-center mb-2">
                  {errorMsg}
                </p>
              )}

              {/* กล่องพิมพ์ข้อความสไตล์แชท มีปุ่มส่งกลมๆ ซ่อนอยู่ข้างในขวา */}
              <div className="bg-white rounded-3xl p-2 pr-2 shadow-sm border border-neutral-200 flex items-end focus-within:border-neutral-400 transition">
                <textarea
                  className="w-full bg-transparent resize-none outline-none text-neutral-800 text-sm px-4 py-3 max-h-32 placeholder:text-neutral-400"
                  rows={2}
                  placeholder="พิมพ์ระบายความรู้สึกที่นี่..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />

                {/* ปุ่มส่งข้อความแบบไอคอนกลมเล็กๆ */}
                <button
                  onClick={handleAnalyze}
                  disabled={!inputText.trim()}
                  className="w-11 h-11 mb-1 shrink-0 bg-neutral-900 text-white rounded-full flex items-center justify-center disabled:opacity-30 disabled:bg-neutral-400 transition active:scale-95 cursor-pointer"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* สเต็ปที่ 3: หน้าแสดงผลลัพธ์ (Result State) */}
          {!isLoading && result && (
            <div className="space-y-4">
              {/* หน้า + ชื่ออารมณ์หลัก ตัวใหญ่ชัดเจน แบบเดียวกับการ์ดต้นแบบ */}
              <div className="flex flex-col items-center text-center py-2">
                <MoodFace
                  mouth={activeEmotion?.mouth ?? "smile"}
                  angry={activeEmotion?.angry}
                  size={96}
                  className="text-neutral-900 mb-3"
                />
                <h2 className="text-3xl font-black tracking-tight text-neutral-900">
                  {result.layer_1_core}
                </h2>
              </div>

              {/* แสดงกราฟิกวงล้ออารมณ์ 3 ชั้น */}
              <WheelSlice
                core={result.layer_1_core}
                secondary={result.layer_2_secondary}
                specific={result.layer_3_specific}
                color={activeEmotion?.color || "#14B8A6"}
              />

              {/* การ์ด 9:16 สำหรับแชร์ลง Story พร้อมปุ่มแชร์ */}
              <ShareCard
                result={result}
                color={activeEmotion?.color || "#14B8A6"}
              />

              <button
                onClick={handleReset}
                className="w-full py-3 bg-neutral-900 border border-neutral-800 text-neutral-300 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.98] transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>วิเคราะห์ความรู้สึกอื่น</span>
              </button>
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
