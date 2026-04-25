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

type BgStyle = "solid" | "gradient" | "mesh" | "elegant";

const PRESET_COLORS = [
  { bg: "#2F4F4F", text: "#FFFFFF" }, // Dark Ash Green
  { bg: "#1E293B", text: "#F8FAFC" }, // Slate
  { bg: "#FACC15", text: "#000000" }, // Yellow
  { bg: "#EF4444", text: "#FFFFFF" }, // Red
  { bg: "#8B5CF6", text: "#FFFFFF" }, // Violet
  { bg: "#10B981", text: "#FFFFFF" }, // Emerald
];

export const SocialShareCard = ({ word, meaning, example }: SocialShareCardProps) => {
  const [bgStyle, setBgStyle] = useState<BgStyle>("elegant");
  const [bgColor, setBgColor] = useState(PRESET_COLORS[0].bg);
  const [textColor, setTextColor] = useState(PRESET_COLORS[0].text);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const randomize = () => {
    const styles: BgStyle[] = ["solid", "gradient", "mesh", "elegant"];
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
              {(["solid", "gradient", "mesh", "elegant"] as BgStyle[]).map((s) => (
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
