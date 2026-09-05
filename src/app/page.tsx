//src\app\page.tsx
// Main Container (State: Input -> Loading -> Result)
"use client";

import { useState, useEffect } from "react";
import { EmotionResult } from "@/types/emotion";
import { CORE_EMOTIONS, CoreEmotionType } from "@/constants/emotionsData";
import { ArrowRight, X, Sun, Moon } from "lucide-react";
import ShareCard from "@/components/result/ShareCard";
import AtmosphericBg from "@/components/visualizer/AtmosphericBg";
import MoodFace from "@/components/visualizer/MoodFace";
import { ALL_SAMPLES } from "@/constants/sampleTexts";

const loadingMessages = [
  "กำลังวิเคราะห์ความรู้สึกของคุณ..",
  "ใกล้เสร็จแล้ว...",
];

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDark, setIsDark] = useState(false);

  // กำหนดเป็นค่าว่างไว้ก่อน
  const [randomSamples, setRandomSamples] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false); // เอาไว้เช็คว่าสุ่มเสร็จหรือยัง

  // ชุดข้อความ Loading ที่จะเล่นสลับกันไปมา
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);

  const toggleDarkMode = () => {
    if (isDark === false) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  };

  // บังคับให้หน้า Result กลับไปเป็นโหมดปกติ (ลบคลาส dark ชั่วคราว)
  useEffect(() => {
    if (result) {
      // ถ้ามีผลลัพธ์ (อยู่หน้า Result) ให้ถอดคลาส dark ออก
      document.documentElement.classList.remove("dark");
    } else if (isDark) {
      // ถ้าไม่มีผลลัพธ์ (อยู่หน้าแรก) และผู้ใช้เคยกดเปิดโหมดมืดไว้ ให้ใส่คลาส dark กลับคืนมา
      document.documentElement.classList.add("dark");
    }
  }, [result, isDark]);

  // สุ่มข้อความเมื่อหน้าเว็บโหลดเสร็จ
  useEffect(() => {
    // ครอบด้วย setTimeout เลื่อนการอัปเดต State
    const timer = setTimeout(() => {
      const shuffled = [...ALL_SAMPLES].sort(() => 0.5 - Math.random());
      setRandomSamples(shuffled.slice(0, 3));
      setIsMounted(true); // บอกว่าสุ่มเสร็จแล้ว พร้อมโชว์!
    }, 0);

    // คลีนอัพ timer ด้วยเสมอ
    return () => clearTimeout(timer);
  }, []);

  // สลับข้อความ Loading ทุกๆ 1.8 วินาที
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading) {
      interval = setInterval(() => {
        setLoadingTextIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [isLoading]);

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

      //แปลงข้อมูลดิบที่ได้รับมาจากเซิร์ฟเวอร์ ผ่านการดึงข้อมูลด้วย fetch() (Object)
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
      }

      if (data && data.layer_1_core) {
        const matchedKey = Object.keys(CORE_EMOTIONS).find((key) =>
          data.layer_1_core.includes(key),
        ) as CoreEmotionType;

        if (matchedKey) {
          data.layer_1_core = matchedKey;
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
      <AtmosphericBg
        color={activeEmotion?.color || (isDark ? "#0F172A" : "#F9FAFB")}
      />
      {/* จำกัดขนาดหน้าจอให้พอดีมือถือ */}
      <div className="w-full max-w-md flex flex-col justify-between">
        {/* ปุ่มสลับ Dark Mode แบบแคปซูล (Pill Toggle) ตอนที่กำลังโชว์ผลลัพธ์ */}{" "}
        {!result && (
          <button
            onClick={toggleDarkMode}
            className="absolute top-4 right-4 w-[72px] h-[36px] bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center p-1 cursor-pointer transition-colors z-20"
            aria-label="สลับโหมดมืด/สว่าง"
          >
            {/* วงกลม (Thumb) เปลี่ยนสีและเลื่อนซ้าย-ขวา */}
            <div
              className={`absolute w-7 h-7 rounded-full transition-all duration-300 ease-in-out ${
                isDark
                  ? "translate-x-[36px] bg-blue-600"
                  : "translate-x-0 bg-amber-500"
              }`}
            />
            {/* กล่องใส่ไอคอน */}
            <div className="flex w-full justify-between items-center px-[6px] z-10">
              <Sun
                className={`w-4 h-4 transition-colors duration-300 ${isDark ? "text-neutral-400" : "text-white"}`}
              />
              <Moon
                className={`w-4 h-4 transition-colors duration-300 ${isDark ? "text-white" : "text-neutral-400"}`}
              />
            </div>
          </button>
        )}
        {/* เนื้อหาหลักตามสถานะ */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center space-y-4 animate-pulse">
              <MoodFace
                mouth="think"
                size={72}
                className="text-neutral-700 mx-auto"
              />
              <p
                key={loadingTextIdx}
                className="text-sm text-neutral-600 font-medium animate-in fade-in zoom-in-95 duration-300"
              >
                {loadingMessages[loadingTextIdx]}
              </p>
            </div>
          )}

          {!isLoading && !result && (
            <div className="flex flex-col justify-center h-full pb-8">
              <div className="text-center mb-6 space-y-2">
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                  วันนี้คุณรู้สึกอย่างไร?
                </h2>
                <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
                  พื้นที่เข้าใจความรู้สึกของคุณ
                </p>
              </div>

              {/* กล่องข้อความ */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-3 shadow-sm border border-neutral-200 dark:border-gray-700 flex flex-col focus-within:border-neutral-400 dark:focus-within:border-gray-500 focus-within:shadow-md transition-all mb-3 relative">
                {/* ปุ่ม X สำหรับล้างข้อความ จะโชว์เฉพาะตอนที่มีตัวอักษร */}
                {inputText.length > 0 && (
                  <button
                    onClick={() => setInputText("")}
                    className="absolute top-4 right-4 w-7 h-7 bg-neutral-100 dark:bg-gray-700 hover:bg-neutral-200 dark:hover:bg-gray-600 text-neutral-500 dark:text-neutral-300 rounded-full flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                    aria-label="ล้างข้อความ"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <textarea
                  suppressHydrationWarning
                  className="w-full bg-transparent resize-none outline-none text-neutral-800 dark:text-neutral-100 text-sm px-3 py-2 pr-10 min-h-[130px] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 leading-relaxed"
                  placeholder="พิมพ์ความรู้สึกของคุณที่นี่..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />

                {/* กล่อง แสดงจำนวนตัวอักษร + ปุ่มส่ง */}
                <div className="flex justify-between items-end mt-2">
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 pl-3 pb-2 font-medium">
                    {inputText.length > 0
                      ? `${inputText.length} ตัวอักษร`
                      : "พร้อมรับฟังเสมอ"}
                  </span>
                  <button
                    onClick={handleAnalyze}
                    disabled={!inputText.trim()}
                    className="w-12 h-12 shrink-0 bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white rounded-2xl flex items-center justify-center disabled:opacity-30 disabled:bg-neutral-300 dark:disabled:bg-gray-600 hover:bg-neutral-800 dark:hover:bg-gray-200 transition-all active:scale-95 cursor-pointer"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-500 dark:text-red-400 text-center mb-3 bg-red-50 dark:bg-red-900/20 py-2 rounded-xl">
                  {errorMsg}
                </p>
              )}

              {/* ข้อความตัวอย่าง */}
              <div className="mt-4">
                <div className="flex items-center gap-3 mb-4 opacity-60">
                  <div className="h-px bg-neutral-300 dark:bg-gray-600 flex-1" />
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                    หรือเลือกจากข้อความตัวอย่าง
                  </span>
                  <div className="h-px bg-neutral-300 dark:bg-gray-600 flex-1" />
                </div>

                {/* ล็อกความสูงขั้นต่ำไว้ (min-h-[140px]) ป้องกันหน้าจอกระตุกตอนปุ่มโผล่มา */}
                <div className="flex flex-col gap-2 min-h-[140px]">
                  {isMounted &&
                    randomSamples.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setInputText(sample)}
                        className="text-left text-[11px] bg-white/60 dark:bg-gray-800/60 border border-neutral-200 dark:border-gray-700 hover:border-neutral-400 dark:hover:border-gray-500 text-neutral-600 dark:text-neutral-300 px-4 py-3 rounded-2xl transition active:scale-[0.98] cursor-pointer shadow-sm animate-in fade-in duration-500"
                      >
                        {sample}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* หน้าแสดงผลลัพธ์ (Result State) */}
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
        <footer className="text-center text-[10px] text-neutral-500 dark:text-neutral-400 mt-6 pb-2">
          เราไม่เก็บข้อมูลของคุณ สบายใจได้นะ 🤍
        </footer>
      </div>
    </main>
  );
}
