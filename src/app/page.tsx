// Main Container (State: Input -> Loading -> Result)
"use client";

import { useState } from "react";
import { EmotionResult } from "@/types/emotion";
import { CORE_EMOTIONS, CoreEmotionType } from "@/constants/emotionsData";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import WheelSlice from "@/components/visualizer/WheelSlice";
import ShareCard from "@/components/result/ShareCard";
import AtmosphericBg from "@/components/visualizer/AtmosphericBg";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

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

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      }

      const data: EmotionResult = await response.json();
      setResult(data);
    } catch (err) {
      setErrorMsg("ไม่สามารถวิเคราะห์ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
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
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex justify-center p-4">
      {/* แสงฟุ้งเปลี่ยนสีตามอารมณ์ */}
      <AtmosphericBg color={activeEmotion?.color || "#525252"} />
      {/* จำกัดขนาดหน้าจอให้พอดีมือถือ (Mobile-First Frame) */}
      <div className="w-full max-w-md flex flex-col justify-between py-6">
        {/* 1. ส่วนหัว (Header) */}
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Emotion Decoder
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            ถอดรหัสความรู้สึกที่อธิบายไม่ถูก (ไม่มีการบันทึกข้อมูล)
          </p>
        </header>

        {/* 2. เนื้อหาหลักตามสถานะ */}
        <div className="flex-1 flex flex-col justify-center">
          {/* สเต็ปที่ 1: กำลังโหลด (Loading State) */}
          {isLoading && (
            <div className="text-center space-y-4 animate-pulse">
              <div className="w-16 h-16 mx-auto rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-neutral-400 animate-spin" />
              </div>
              <p className="text-sm text-neutral-400">
                กำลังแยกแยะความรู้สึกของคุณ...
              </p>
            </div>
          )}

          {/* สเต็ปที่ 2: หน้าพิมพ์ข้อความ (Input State) */}
          {!isLoading && !result && (
            <div className="space-y-4">
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 focus-within:border-neutral-600 transition">
                <textarea
                  className="w-full h-44 bg-transparent resize-none outline-none text-neutral-200 text-sm leading-relaxed placeholder:text-neutral-600"
                  placeholder="พิมพ์อะไรก็ได้ที่อยู่ในหัวตอนนี้... ไม่ต้องเรียบเรียง เช่น 'รู้สึกหน่วงๆ ไม่อยากคุยกับใคร แต่ก็ไม่อยากอยู่คนเดียว'"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 text-center">{errorMsg}</p>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!inputText.trim()}
                className="w-full py-3.5 bg-neutral-100 text-neutral-950 font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-30 active:scale-[0.98] transition cursor-pointer"
              >
                <span>ถอดรหัสความรู้สึก</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* สเต็ปที่ 3: หน้าแสดงผลลัพธ์ (Result State) */}
          {!isLoading && result && (
            <div className="space-y-4">
              {/* แสดงกราฟิกวงล้ออารมณ์ 3 ชั้น */}
              <WheelSlice
                core={result.layer_1_core}
                secondary={result.layer_2_secondary}
                specific={result.layer_3_specific}
                color={activeEmotion?.color || "#14B8A6"}
              />

              {/* การ์ด: สิ่งที่ซ่อนอยู่เบื้องลึก */}
              <div className="bg-neutral-900 border border-neutral-800/80 rounded-2xl p-4">
                <h2 className="text-xs text-neutral-400 font-medium mb-1.5">
                  สาเหตุเบื้องลึก
                </h2>
                <p className="text-sm text-neutral-200 leading-relaxed">
                  {result.underlying_cause}
                </p>
              </div>

              {/* การ์ด 9:16 สำหรับแชร์ลง Story พร้อมปุ่มแชร์ */}
              <ShareCard
                result={result}
                color={activeEmotion?.color || "#14B8A6"}
              />

              {/* การ์ด: สิ่งที่ทำได้ทันที */}
              <div className="bg-neutral-900 border border-neutral-800/80 rounded-2xl p-4">
                <h2 className="text-xs text-neutral-400 font-medium mb-1.5">
                  คำแนะนำเล็กๆ ใน 5 นาที
                </h2>
                <p className="text-sm text-neutral-200 leading-relaxed">
                  {result.micro_action}
                </p>
              </div>

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
        <footer className="text-center text-[10px] text-neutral-600 mt-6">
          Powered by Gemini API • Stateless Privacy
        </footer>
      </div>
    </main>
  );
}
