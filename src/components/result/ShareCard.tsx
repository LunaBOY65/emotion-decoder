// src/components/result/ShareCard.tsx
"use client";

import { useRef, useState } from "react";
import { EmotionResult } from "@/types/emotion";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";

interface ShareCardProps {
  result: EmotionResult;
  color: string; // โทนสีประจำอารมณ์
}

export default function ShareCard({ result, color }: ShareCardProps) {
  // สร้างตัวอ้างอิง (Ref) เพื่อบอกให้ html-to-image รู้ว่าจะแคปกล่องไหน
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // 1. ฟังก์ชันดาวน์โหลดเป็นไฟล์รูปภาพ (.png)
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      // แปลง DOM กล่องการ์ดให้เป็น Data URL รูปภาพ
      const dataUrl = await toPng(cardRef.current, { cacheBust: true });
      const link = document.createElement("a");
      link.download = `emotion-${result.layer_1_core}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการสร้างรูป:", error);
      alert("ไม่สามารถบันทึกรูปภาพได้ในขณะนี้");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {/* ================= กรอบการ์ดสัดส่วน 9:16 (IG Story Style) ================= */}
      <div className="flex justify-center">
        <div
          ref={cardRef}
          className="w-full max-w-[320px] aspect-[9/16] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl bg-neutral-900 border border-neutral-800"
        >
          {/* พื้นหลังแสง Gradient ละมุนตามสีอารมณ์ */}
          <div
            className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ backgroundColor: color }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: color }}
          />

          {/* ส่วนหัวของการ์ด */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">
              Emotion Decoder
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold border"
              style={{ borderColor: `${color}60`, color: color }}
            >
              {result.layer_1_core}
            </span>
          </div>

          {/* ส่วนกลาง: ไฮไลต์ความรู้สึกที่แท้จริง */}
          <div className="relative z-10 space-y-3 my-auto">
            <div className="text-[11px] text-neutral-400">
              {result.layer_1_core} → {result.layer_2_secondary}
            </div>

            <h3 className="text-2xl font-bold text-white leading-tight">
              &ldquo;{result.layer_3_specific}&rdquo;
            </h3>

            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                {result.underlying_cause}
              </p>
            </div>
          </div>

          {/* ส่วนล่าง: คำแนะนำสั้นๆ และ Branding */}
          <div className="relative z-10 space-y-3 pt-2 border-t border-neutral-800/60">
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium">
                คำแนะนำใน 5 นาที
              </span>
              <p className="text-[11px] text-neutral-200 line-clamp-2">
                {result.micro_action}
              </p>
            </div>

            <div className="flex justify-between items-center text-[9px] text-neutral-400">
              <span>#เปิดโลกใหม่ในใจคุณ</span>
              <span>Stateless Privacy</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ปุ่มกดดาวน์โหลดรูปภาพ ================= */}
      <div>
        <button
          onClick={handleDownloadImage}
          disabled={isExporting}
          className="w-full py-3.5 px-4 rounded-xl bg-neutral-100 text-neutral-950 font-medium text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition cursor-pointer disabled:opacity-50 shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>
            {isExporting ? "กำลังบันทึกรูป..." : "บันทึกการ์ดรูปภาพ (PNG)"}
          </span>
        </button>
      </div>
    </div>
  );
}
