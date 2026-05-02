import React, { useState, useRef } from "react";
import { Download, Palette, RefreshCw, Type, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SocialShareCardProps {
  word: string;
  meaning: string;
  example: string;
}

type BgStyle = "solid" | "gradient" | "mesh" | "elegant" | "texture";

const PRESET_COLORS = [
  { bg: "#0EA5E9", text: "#FFFFFF" },
  { bg: "#6366F1", text: "#FFFFFF" },
  { bg: "#EC4899", text: "#FFFFFF" },
  { bg: "#F97316", text: "#000000" },
  { bg: "#14B8A6", text: "#FFFFFF" },
  { bg: "#A855F7", text: "#FFFFFF" },
  { bg: "#22C55E", text: "#000000" },
  { bg: "#EAB308", text: "#000000" },
  { bg: "#64748B", text: "#FFFFFF" },
  { bg: "#334155", text: "#FFFFFF" },
  { bg: "#BE123C", text: "#FFFFFF" },
  { bg: "#0F172A", text: "#F1F5F9" },
  { bg: "#D946EF", text: "#FFFFFF" },
  { bg: "#84CC16", text: "#000000" },
  { bg: "#06B6D4", text: "#000000" },
];

export const SocialShareCard = ({ word, meaning, example }: SocialShareCardProps) => {
  const [bgStyle, setBgStyle] = useState<BgStyle>("elegant");
  const [bgColor, setBgColor] = useState(PRESET_COLORS[0].bg);
  const [textColor, setTextColor] = useState(PRESET_COLORS[0].text);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const randomize = () => {
    const styles: BgStyle[] = ["solid", "gradient", "mesh", "elegant", "texture"];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomPreset = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];

    setBgStyle(randomStyle);
    setBgColor(randomPreset.bg);
    setTextColor(randomPreset.text);
  };

  const drawToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // BACKGROUND
    if (bgStyle === "solid") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

    } else if (bgStyle === "gradient") {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, bgColor);
      grad.addColorStop(1, adjustColor(bgColor, -40));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

    } else if (bgStyle === "mesh" || bgStyle === "elegant") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      ctx.globalAlpha = 0.4;
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = adjustColor(bgColor, 20 + i * 10);
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, 400 + Math.random() * 400, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (bgStyle === "elegant") {
        ctx.strokeStyle = textColor;
        ctx.globalAlpha = 0.2;
        ctx.strokeRect(60, 60, width - 120, height - 120);
        ctx.globalAlpha = 1;
      }

    } else if (bgStyle === "texture") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // noise
      const imageData = ctx.createImageData(width, height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = Math.random() * 30;
        imageData.data[i] = noise;
        imageData.data[i + 1] = noise;
        imageData.data[i + 2] = noise;
        imageData.data[i + 3] = 40;
      }
      ctx.putImageData(imageData, 0, 0);

      // diagonal pattern
      ctx.strokeStyle = adjustColor(bgColor, -40);
      ctx.globalAlpha = 0.15;
      for (let i = -height; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + height, height);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // TEXT
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";

    ctx.font = "bold 120px Inter";
    ctx.fillText(word, width / 2, height / 2 - 120);

    ctx.font = "500 48px Inter";
    wrapText(ctx, meaning, width - 200).forEach((line, i) => {
      ctx.fillText(line, width / 2, height / 2 + i * 60);
    });

    ctx.font = "italic 36px serif";
    wrapText(ctx, `"${example}"`, width - 300).forEach((line, i) => {
      ctx.fillText(line, width / 2, height / 2 + 200 + i * 45);
    });

    ctx.font = "bold 32px Inter";
    ctx.fillText("WORDSPACK", width / 2, height - 100);
  };

  const handleDownload = () => {
    drawToCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `wordspack-${word}.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast.success("Downloaded!");
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(" ");
    const lines = [];
    let line = words[0];

    for (let i = 1; i < words.length; i++) {
      const test = line + " " + words[i];
      if (ctx.measureText(test).width < maxWidth) line = test;
      else {
        lines.push(line);
        line = words[i];
      }
    }
    lines.push(line);
    return lines;
  };

  const adjustColor = (hex: string, amt: number) => {
    let num = parseInt(hex.slice(1), 16);
    let r = Math.min(255, Math.max(0, (num >> 16) + amt));
    let g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
    let b = Math.min(255, Math.max(0, (num & 0xff) + amt));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
  };

  return (
    <div className="p-6">
      <div
        className="aspect-square rounded-xl flex items-center justify-center relative overflow-hidden"
        style={{
          background: bgStyle === "gradient"
            ? `linear-gradient(135deg, ${bgColor}, ${adjustColor(bgColor, -40)})`
            : bgColor,
          color: textColor
        }}
      >
        {bgStyle === "texture" && (
          <>
            <div className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\"/></svg>')"
              }}
            />
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0 1px, transparent 1px 40px)"
              }}
            />
          </>
        )}

        <div className="text-center z-10">
          <h2 className="text-4xl font-bold">{word}</h2>
          <p className="mt-4">{meaning}</p>
          <p className="italic mt-4">"{example}"</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Button onClick={handleDownload}><Download /> Download</Button>
        <Button variant="ghost" onClick={randomize}><RefreshCw /> Random</Button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
