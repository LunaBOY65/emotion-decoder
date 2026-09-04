// src/components/result/ShareCard.tsx
"use client";

import { useRef, useState } from "react";
import { EmotionResult } from "@/types/emotion";
import { toPng } from "html-to-image";
import { Download, RotateCcw } from "lucide-react";
import MoodFace, { MouthType } from "@/components/visualizer/MoodFace";

interface ShareCardProps {
  result: EmotionResult;
  color: string;
  mouth?: MouthType;
  angry?: boolean;
  onReset: () => void;
}

export default function ShareCard({
  result,
  color,
  mouth = "smile",
  angry,
  onReset,
}: ShareCardProps) {
  // สร้างตัวอ้างอิง (Ref) เพื่อบอกให้ html-to-image รู้ว่าจะแคปกล่องไหน
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // ดาวน์โหลดเป็นไฟล์รูปภาพ (.png)
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      // --- ทริคสำหรับ iOS Safari ---
      // กระตุ้นให้ Safari โหลดฟอนต์และ Asset ต่างๆ ก่อน 1 รอบ (ป้องกันบั๊กได้รูปเปล่า)
      await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });

      // แคปเจอร์จริงในรอบที่ 2
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const fileName = `emotion-${result.layer_1_core}.png`;

      // ตรวจสอบว่าเบราว์เซอร์รองรับ Web Share API ไหม
      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], fileName, { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "วันนี้คุณรู้สึกอย่างไร?",
            });
            return; // ถ้าเรียกหน้าต่างแชร์สำเร็จ จบการทำงานเลย
          } catch (shareError) {
            // ถ้าผู้ใช้กดยกเลิกการแชร์ (ไม่มีปัญหา)
            if (
              shareError instanceof Error &&
              shareError.name === "AbortError"
            ) {
              console.log("ผู้ใช้ยกเลิกการแชร์");
              return;
            }
            // ถ้าแชร์พัง (ถูกบล็อก) ปล่อยให้มันไหลไปใช้ Fallback ด้านล่าง
            console.warn("Share API ถูกบล็อก, กำลังสลับไปใช้วิธีดาวน์โหลดปกติ");
          }
        }
      }

      // --- Fallback สำหรับ Desktop และ iOS ที่แชร์ไม่ได้ ---
      // ตรวจสอบว่าเป็นอุปกรณ์ iOS หรือไม่
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);

      if (isIOS) {
        // สำหรับ iOS Safari ถ้าโหลดแบบปกติไม่ได้ ให้เปิดรูปในแท็บใหม่
        // เพื่อให้ผู้ใช้สามารถกดค้าง (Long Press) แล้วเลือก "Save Image" ได้
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(
            `<img src="${dataUrl}" alt="Emotion Card" style="width:100%; border-radius: 12px; margin-top: 20px;" />`,
          );
          newWindow.document.write(
            `<p style="text-align:center; font-family:sans-serif; color:#666;">กดค้างที่รูปภาพเพื่อบันทึกลงเครื่อง</p>`,
          );
        } else {
          // ถ้าโดนบล็อก Pop-up เปลี่ยนหน้าปัจจุบันไปที่รูปเลย
          window.location.href = dataUrl;
        }
      } else {
        // สำหรับ Android และ Desktop ใช้วิธีคลิกลิงก์ปกติได้เลย
        const link = document.createElement("a");
        link.download = fileName;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการสร้างรูป:", error);
      alert("ไม่สามารถบันทึกรูปภาพได้ในขณะนี้");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full pb-2">
      {/* กรอบการ์ดสัดส่วน 9:16 */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div
          ref={cardRef}
          className="w-full max-w-[320px] aspect-[9/16] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shrink-0"
          style={{ backgroundColor: color }}
        >
          {/* ส่วนหัวของการ์ด */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-900/60">
              วันนี้คุณรู้สึกอย่างไร?
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-neutral-900/10 text-neutral-900">
              {result.layer_1_core}
            </span>
          </div>

          {/* จัด Layout ชิดซ้าย */}
          <div className="relative z-10 flex flex-col justify-center h-full space-y-3 text-left my-auto mt-6">
            <MoodFace
              mouth={mouth}
              angry={angry}
              size={48}
              className="text-neutral-900"
            />

            <div className="text-[11px] text-neutral-900/60 pt-1 font-medium">
              {result.layer_1_core} → {result.layer_2_secondary}
            </div>

            <h3 className="text-[22px] font-black text-neutral-900 leading-snug">
              &ldquo;{result.layer_3_specific}&rdquo;
            </h3>

            <div className="p-4 mt-2 rounded-2xl bg-white/40 border border-white/20">
              <p className="text-[11.5px] text-neutral-900/80 leading-relaxed">
                {result.underlying_cause}
              </p>
            </div>
          </div>

          {/* คำแนะนำสั้นๆ */}
          <div className="relative z-10 space-y-3 pt-2 border-t border-neutral-900/15">
            <div>
              <span className="text-[10px] text-neutral-900/50 block font-medium">
                คำแนะนำใน 5 นาที
              </span>
              <p className="text-[11px] text-neutral-900 leading-snug line-clamp-3">
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

      {/*  ปุ่มกด */}
      <div className="space-y-3 w-full max-w-[320px] mx-auto mt-auto pt-6">
        <button
          onClick={handleDownloadImage}
          disabled={isExporting}
          className="w-full py-4 rounded-2xl bg-[#1A1A1A] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-black active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          <span>{isExporting ? "กำลังบันทึกรูป..." : "บันทึกรูปภาพ"}</span>
        </button>
        <button
          onClick={onReset}
          className="w-full py-4 rounded-2xl bg-white/80 backdrop-blur-sm text-neutral-800 font-medium text-sm flex items-center justify-center gap-2 hover:bg-white active:scale-[0.98] transition cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>วิเคราะห์ใหม่อีกครั้ง</span>
        </button>
      </div>
    </div>
  );
}
