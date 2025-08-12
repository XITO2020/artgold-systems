export class PerspectiveAPI {
    private apiKey: string;
  
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }
  
    async analyzeText(text: string) {
      const response = await fetch(
        `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comment: { text },
            requestedAttributes: {
              TOXICITY: {},
              THREAT: {},
              INSULT: {},
              IDENTITY_ATTACK: {},
            },
            languages: ['en'],
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Perspective API error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.attributeScores;
    }
  }
  