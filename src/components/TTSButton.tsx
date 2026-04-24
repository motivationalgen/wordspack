import { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX, Play, Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TTSButtonProps {
  text: string;
  className?: string;
}

export const TTSButton = ({ text, className }: TTSButtonProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Prioritize natural/premium sounding English voices
      const preferred = availableVoices.filter(v => 
        (v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Google')) && 
        v.lang.startsWith('en')
      );

      const defaultVoice = preferred.find(v => v.name.includes('US') || v.name.includes('English')) || 
                           preferred[0] || 
                           availableVoices.find(v => v.lang.startsWith('en')) || 
                           availableVoices[0];
      setSelectedVoice(defaultVoice);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(() => {
    if (!text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Adjust parameters for a more human feel
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.05; // Slightly higher for warmth
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [text, selectedVoice]);

  const togglePause = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {!isSpeaking ? (
        <Button
          variant="outline"
          size="sm"
          onClick={speak}
          title="Speak text"
          className="h-8 px-2 gap-1.5"
        >
          <Volume2 className="h-4 w-4" />
          <span className="text-xs font-medium">Listen</span>
        </Button>
      ) : (
        <div className="flex items-center gap-1 bg-secondary/50 rounded-md p-0.5 border border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePause}
            title={isPaused ? "Resume" : "Pause"}
            className="h-7 w-7"
          >
            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={stop}
            title="Stop"
            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </Button>
        </div>
      )}

      {voices.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Change voice">
              <VolumeX className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto w-56">
            {voices.filter(v => v.lang.startsWith('en')).map((voice) => (
              <DropdownMenuItem
                key={voice.name}
                onClick={() => setSelectedVoice(voice)}
                className={cn(selectedVoice?.name === voice.name && "bg-accent font-medium")}
              >
                {voice.name} ({voice.lang})
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
