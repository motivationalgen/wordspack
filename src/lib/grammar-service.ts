/**
 * Grammar Service
 * Handles external API integrations for grammar checking.
 */

export interface GrammarCorrection {
  text: string;
  offset: number;
  length: number;
  replacements: string[];
  explanation: string;
  category: string;
  impact: "critical" | "suggested";
}

export interface GrammarResult {
  correctedText: string;
  corrections: GrammarCorrection[];
  readabilityScore: number;
  readabilityLevel: string;
}

export const grammarService = {
  /**
   * Check grammar using LanguageTool Public API
   * Stable and supports CORS for browser usage.
   */
  async checkWithLanguageTool(text: string): Promise<GrammarResult> {
    try {
      const response = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
        },
        body: new URLSearchParams({
          text: text,
          language: "en-US",
        }),
      });

      if (!response.ok) throw new Error("LanguageTool API request failed");
      const data = await response.json();

      let correctedText = text;
      // Sort matches by offset descending to replace without breaking indices
      const matches = (data.matches || []).sort((a: any, b: any) => b.offset - a.offset);

      const corrections: GrammarCorrection[] = matches.map((m: any) => ({
        text: text.substring(m.offset, m.offset + m.length),
        offset: m.offset,
        length: m.length,
        replacements: m.replacements.slice(0, 3).map((r: any) => r.value),
        explanation: m.message,
        category: m.rule.category.name,
        impact: m.rule.issueType === "misspelling" ? "critical" : "suggested",
      }));

      // Apply first replacement for corrected text
      matches.forEach((m: any) => {
        if (m.replacements && m.replacements.length > 0) {
          correctedText = 
            correctedText.substring(0, m.offset) + 
            m.replacements[0].value + 
            correctedText.substring(m.offset + m.length);
        }
      });

      return {
        correctedText,
        corrections,
        readabilityScore: 85, // Default for now
        readabilityLevel: "Good",
      };
    } catch (error) {
      console.error("LanguageTool check failed:", error);
      throw error;
    }
  },

  /**
   * Check grammar using Grammarly WebSocket protocol
   * NOTE: This will likely fail in a standard browser due to CORS/Origin restrictions
   * unless used with a proxy or as a browser extension.
   */
  async checkWithGrammarlyWS(text: string): Promise<GrammarResult> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket("wss://capi.grammarly.com/freews");
      const corrections: GrammarCorrection[] = [];
      let correctedText = text;

      socket.onopen = () => {
        // Send start message
        socket.send(JSON.stringify({
          action: "start",
          client: "extension_chrome",
          clientVersion: "14.908.2201",
          dialect: "american",
          docid: Math.random().toString(36).substring(7),
          extDomain: window.location.hostname,
          id: 4,
          protocolVersion: "1.0",
          token: null,
          type: "other",
        }));

        // Send text message
        socket.send(JSON.stringify({
          ch: [`+0:0:${text}:0`],
          rev: 0,
          action: "submit_ot",
          id: 5
        }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.action === "alert") {
          corrections.push({
            text: data.highlightText || "",
            offset: data.begin,
            length: data.end - data.begin,
            replacements: data.replacements || [],
            explanation: data.explanation || data.title,
            category: data.categoryHuman || data.group,
            impact: data.impact === "critical" ? "critical" : "suggested",
          });
        }

        if (data.action === "finished") {
          socket.close();
          
          // Construct corrected text based on collected alerts
          // We sort by offset descending to avoid breaking indices during replacement
          let finalCorrectedText = text;
          const sortedCorrections = [...corrections].sort((a, b) => b.offset - a.offset);
          
          sortedCorrections.forEach(c => {
            if (c.replacements && c.replacements.length > 0) {
              finalCorrectedText = 
                finalCorrectedText.substring(0, c.offset) + 
                c.replacements[0] + 
                finalCorrectedText.substring(c.offset + c.length);
            }
          });

          resolve({
            correctedText: finalCorrectedText,
            corrections,
            readabilityScore: data.score || 0,
            readabilityLevel: data.dialect || "N/A",
          });
        }
      };

      socket.onerror = (err) => {
        console.error("Grammarly WS Error:", err);
        reject(new Error("Grammarly WebSocket connection failed. This is likely due to CORS/Origin restrictions on the Grammarly API."));
      };

      // Timeout safety
      setTimeout(() => {
        if (socket.readyState !== WebSocket.CLOSED) {
          socket.close();
          reject(new Error("Grammarly check timed out"));
        }
      }, 10000);
    });
  }
};
