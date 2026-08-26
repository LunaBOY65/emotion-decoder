// src/components/result/ShareCard.tsx
"use client";

import { useRef, useState } from "react";
import { EmotionResult } from "@/types/emotion";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import MoodFace, { MouthType } from "@/components/visualizer/MoodFace";

interface ShareCardProps {
  result: EmotionResult;
  color: string;
  mouth?: MouthType;
  angry?: boolean;
}

export default function ShareCard({
  result,
  color,
  mouth = "smile",
  angry,
}: ShareCardProps) {
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
          className="w-full max-w-[300px] aspect-[9/16] rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden"
          style={{ backgroundColor: color }}
        >
          {/* ส่วนหัวของการ์ด */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-900/60">
              Emotion Decoder
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-neutral-900/10 text-neutral-900">
              {result.layer_1_core}
            </span>
          </div>

          {/* ส่วนกลาง: ไฮไลต์ความรู้สึกที่แท้จริง */}
          <div className="relative z-10 space-y-3 my-auto">
            <MoodFace
              mouth={mouth}
              angry={angry}
              size={48}
              className="text-neutral-900"
            />

            <div className="text-[11px] text-neutral-900/60 pt-1">
              {result.layer_1_core} → {result.layer_2_secondary}
            </div>

            <h3 className="text-xl font-black text-neutral-900 leading-snug">
              &ldquo;{result.layer_3_specific}&rdquo;
            </h3>

            <div className="p-3 rounded-xl bg-white/50">
              <p className="text-[11px] text-neutral-900/80 leading-relaxed">
                {result.underlying_cause}
              </p>
            </div>
          </div>

          {/* ส่วนล่าง: คำแนะนำสั้นๆ และ Branding */}
          <div className="relative z-10 space-y-3 pt-2 border-t border-neutral-900/15">
            <div>
              <span className="text-[10px] text-neutral-900/50 block font-medium">
                คำแนะนำใน 5 นาที
              </span>
              <p className="text-[11px] text-neutral-900 line-clamp-2">
                {result.micro_action}
              </p>
            </div>
            <div className="flex justify-between items-center text-[9px] text-neutral-900/40">
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
          className="w-full py-3.5 rounded-xl bg-neutral-900 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
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
