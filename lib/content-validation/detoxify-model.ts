export class DetoxifyModel {
    private static instance: DetoxifyModel;
    private apiUrl: string;
  
    private constructor() {
      this.apiUrl = 'https://api.example.com/detoxify'; // Remplacez par l'URL de votre API
    }
  
    static async getInstance() {
      if (!DetoxifyModel.instance) {
        DetoxifyModel.instance = new DetoxifyModel();
      }
      return DetoxifyModel.instance;
    }
  
    async analyze(text: string) {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
  
      if (!response.ok) {
        throw new Error(`Detoxify API error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    }
  }
  