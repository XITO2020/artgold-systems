export class HateBERT {
    private static instance: HateBERT;
    private apiUrl: string;
  
    private constructor() {
      this.apiUrl = 'https://api.example.com/hatebert'; // Remplacez par l'URL de votre API
    }
  
    static async getInstance() {
      if (!HateBERT.instance) {
        HateBERT.instance = new HateBERT();
      }
      return HateBERT.instance;
    }
  
    async predict(text: string) {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
  
      if (!response.ok) {
        throw new Error(`HateBERT API error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    }
  }
  