// hume-ai.ts
export class HumeAI {
    private apiKey: string;
  
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }
  
    async analyzeImage(imageBuffer: Buffer) {
      const response = await fetch('https://api.hume.ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ image: imageBuffer.toString('base64') })
      });
  
      if (!response.ok) {
        throw new Error(`Hume AI error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    }
  }
  