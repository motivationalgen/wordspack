import React, { useState, useRef, useEffect } from "react";
import { Download, Share2, Palette, RefreshCw, Type, Image as ImageIcon } from "lucide-react";
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
  { bg: "#0EA5E9", text: "#FFFFFF" }, // Sky Blue
{ bg: "#6366F1", text: "#FFFFFF" }, // Indigo
{ bg: "#EC4899", text: "#FFFFFF" }, // Pink
{ bg: "#F97316", text: "#000000" }, // Orange
{ bg: "#14B8A6", text: "#FFFFFF" }, // Teal
{ bg: "#A855F7", text: "#FFFFFF" }, // Purple
{ bg: "#22C55E", text: "#000000" }, // Green (brighter)
{ bg: "#EAB308", text: "#000000" }, // Amber
{ bg: "#64748B", text: "#FFFFFF" }, // Cool Gray
{ bg: "#334155", text: "#FFFFFF" }, // Dark Slate
{ bg: "#BE123C", text: "#FFFFFF" }, // Rose Red
{ bg: "#0F172A", text: "#F1F5F9" }, // Deep Navy
{ bg: "#D946EF", text: "#FFFFFF" }, // Fuchsia
{ bg: "#84CC16", text: "#000000" }, // Lime
{ bg: "#06B6D4", text: "#000000" }, // Cyan
  { bg: "#1D4ED8", text: "#FFFFFF" }, // Blue (strong)
{ bg: "#9333EA", text: "#FFFFFF" }, // Deep Purple
{ bg: "#F43F5E", text: "#FFFFFF" }, // Rose
{ bg: "#EA580C", text: "#FFFFFF" }, // Burnt Orange
{ bg: "#0D9488", text: "#FFFFFF" }, // Dark Teal
{ bg: "#4F46E5", text: "#FFFFFF" }, // Indigo Deep
{ bg: "#16A34A", text: "#FFFFFF" }, // Green Rich
{ bg: "#CA8A04", text: "#000000" }, // Mustard
{ bg: "#475569", text: "#FFFFFF" }, // Slate Gray
{ bg: "#1E40AF", text: "#FFFFFF" }, // Royal Blue
{ bg: "#9F1239", text: "#FFFFFF" }, // Wine Red
{ bg: "#020617", text: "#E2E8F0" }, // Almost Black
{ bg: "#C026D3", text: "#FFFFFF" }, // Magenta
{ bg: "#65A30D", text: "#000000" }, // Olive
{ bg: "#0891B2", text: "#FFFFFF" }, // Cyan Deep
  { bg: "#FF6B6B", text: "#FFFFFF" }, // Soft Red
{ bg: "#6C5CE7", text: "#FFFFFF" }, // Neon Purple
{ bg: "#00CEC9", text: "#000000" }, // Aqua
{ bg: "#FAB1A0", text: "#000000" }, // Peach
{ bg: "#2D3436", text: "#FFFFFF" }, // Charcoal
{ bg: "#FD79A8", text: "#000000" }, // Bubblegum Pink
{ bg: "#55EFC4", text: "#000000" }, // Mint
{ bg: "#FFEAA7", text: "#000000" }, // Soft Yellow
];

export const SocialShareCard = ({ word, meaning, example }: SocialShareCardProps) => {
  const [bgStyle, setBgStyle] = useState<BgStyle>("elegant");
  const [bgColor, setBgColor] = useState(PRESET_COLORS[0].bg);
  const [textColor, setTextColor] = useState(PRESET_COLORS[0].text);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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
   else if (bgStyle === "texture") {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Strong visible grain
  for (let i = 0; i < 20000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;

    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(x, y, 2, 2);
  }

  // Soft lighting
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "rgba(255,255,255,0.1)");
  grad.addColorStop(1, "rgba(0,0,0,0.15)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

  // Add noise texture
  const imageData = ctx.createImageData(width, height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = Math.random() * 30; // grain strength
    imageData.data[i] = noise;     // R
    imageData.data[i + 1] = noise; // G
    imageData.data[i + 2] = noise; // B
    imageData.data[i + 3] = 40;    // Alpha (very subtle)
  }
  ctx.putImageData(imageData, 0, 0);

  // Optional overlay pattern (diagonal lines)
  ctx.strokeStyle = adjustColor(bgColor, -40);
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1;

  for (let i = -height; i < width; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

    // Set high resolution
    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background
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
      
      // Abstract shapes
      ctx.globalAlpha = 0.4;
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = adjustColor(bgColor, 20 + i * 10);
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, 400 + Math.random() * 400, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      if (bgStyle === "elegant") {
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.2;
        ctx.strokeRect(60, 60, width - 120, height - 120);
        ctx.globalAlpha = 1.0;
      }
    }

    // 2. Draw Text
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";


    ctx.font = "600 58px Inter";
ctx.globalAlpha = 0.7;
ctx.fillText("WORD OF THE DAY", width / 2, 120);
ctx.globalAlpha = 1;

    // Word
    ctx.font = "bold 120px 'Inter', sans-serif";
    ctx.fillText(word, width / 2, height / 2 - 120);

    // Meaning
    ctx.font = "500 48px 'Inter', sans-serif";
    const meaningLines = wrapText(ctx, meaning, width - 200);
    meaningLines.forEach((line, i) => {
      ctx.fillText(line, width / 2, height / 2 + (i * 60));
    });

    // Example
    ctx.font = "italic 36px 'Inter', sans-serif";
    ctx.globalAlpha = 0.8;
    const exampleLines = wrapText(ctx, `"${example}"`, width - 300);
    const exampleStart = height / 2 + (meaningLines.length * 60) + 80;
    exampleLines.forEach((line, i) => {
      ctx.fillText(line, width / 2, exampleStart + (i * 45));
    });
    ctx.globalAlpha = 1.0;

    // Logo / Brand
    ctx.font = "bold 32px 'Inter', sans-serif";
    ctx.fillText("WORDSPACK", width / 2, height - 100);
    ctx.font = "300 24px 'Inter', sans-serif";
    ctx.fillText("wordspack.com", width / 2, height - 65);
  };

  const handleDownload = () => {
    drawToCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = `wordspack-${word.toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Image generated and download started!");
  };

  // Helper: Wrap text for canvas
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  // Helper: darken/lighten color
  const adjustColor = (hex: string, amt: number) => {
    let usePound = false;
    if (hex[0] === "#") {
      hex = hex.slice(1);
      usePound = true;
    }
    const num = parseInt(hex, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  };

  return (
    <div className="mt-12 p-6 bg-card border rounded-2xl shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Preview Area */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Social Media Preview
          </h3>
          
         {bgStyle === "texture" && (
  <div className="absolute inset-0 z-0 pointer-events-none">
    
    {/* Visible grain dots */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0,0,0,0.25) 1px, transparent 1px)",
        backgroundSize: "4px 4px",
        opacity: 0.4
      }}
    />

    {/* Light overlay for depth */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,0,0,0.15))"
      }}
    />
  </div>
)}
          <div 
            ref={previewRef}
            className={cn(
              "aspect-square w-full max-w-[500px] mx-auto rounded-xl shadow-lg flex flex-col items-center justify-center p-8 text-center transition-all duration-500",
              bgStyle === "mesh" && "relative overflow-hidden"
            )}
            style={{ 
              backgroundColor: bgColor, 
              color: textColor,
              background: bgStyle === "gradient" ? `linear-gradient(135deg, ${bgColor} 0%, ${adjustColor(bgColor, -40)} 100%)` : bgColor
            }}
          >
            {bgStyle === "mesh" && (
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                 <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[80px]" style={{ backgroundColor: adjustColor(bgColor, 30) }} />
                 <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[80px]" style={{ backgroundColor: adjustColor(bgColor, 20) }} />
              </div>
            )}
            
            {bgStyle === "elegant" && (
              <div className="absolute inset-4 border border-current opacity-20 pointer-events-none" />
            )}

            <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="px-3 py-1 text-xs rounded-full bg-black/20 backdrop-blur-sm mb-4">
  Word of the Day
</span>
              <div className="w-12 h-[2px] bg-current opacity-40 mb-4" />
              <h4 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">{word}</h4>
              <p className="text-lg sm:text-xl font-medium mb-8 leading-relaxed opacity-95">{meaning}</p>
              <p className="text-sm sm:text-base italic opacity-80 max-w-[80%] leading-relaxed font-serif">"{example}"</p>
              
              <div className="mt-12 flex flex-col items-center">
                <span className="text-xs font-bold tracking-[0.2em] opacity-90">WORDSPACK</span>
                <span className="text-[10px] opacity-70 mt-1 uppercase tracking-widest font-medium">wordspack.com</span>
              </div>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Area */}
        <div className="w-full lg:w-72 space-y-6">
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Palette className="w-4 h-4" /> Style
            </Label>
            <div className="grid grid-cols-2 gap-2">
             {(["solid", "gradient", "mesh", "elegant", "texture"] as BgStyle[]).map((s) => (
                <Button 
                  key={s}
                  variant={bgStyle === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBgStyle(s)}
                  className="capitalize text-xs h-9"
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Type className="w-4 h-4" /> Color Preset
            </Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setBgColor(p.bg);
                    setTextColor(p.text);
                  }}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                    bgColor === p.bg ? "border-primary scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: p.bg }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button className="w-full gap-2 h-11 font-semibold" onClick={handleDownload}>
              <Download className="w-4 h-4" /> Download PNG
            </Button>
            <Button variant="ghost" className="w-full gap-2 h-10 text-muted-foreground" onClick={randomize}>
              <RefreshCw className="w-4 h-4" /> Randomize
            </Button>
          </div>

          <div className="pt-4 p-4 bg-muted/40 rounded-xl border border-dashed border-border">
             <p className="text-[11px] text-muted-foreground leading-relaxed">
               <strong>Tip:</strong> Share this word on Instagram, Twitter, or WhatsApp to help your friends build their vocabulary too!
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
