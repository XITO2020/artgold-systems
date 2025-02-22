
import { PerspectiveAPI } from './perspective-api';
import { HateBERT } from './hatebert-model';
import { DetoxifyModel } from './detoxify-model';

interface HateSpeechResult {
  score: number;
  categories: {
    hate: number;
    threat: number;
    insult: number;
    identity_attack: number;
  };
  details: any;
}

export async function detectHateSpeech(text: string): Promise<HateSpeechResult> {
  // Initialize models
  const perspective = new PerspectiveAPI(process.env.PERSPECTIVE_API_KEY!);
  const hateBERT = await HateBERT.getInstance();
  const detoxify = await DetoxifyModel.getInstance();

  // Run all models in parallel
  const [
    perspectiveResult,
    hateBERTResult,
    detoxifyResult
  ] = await Promise.all([
    perspective.analyzeText(text),
    hateBERT.predict(text),
    detoxify.analyze(text)
  ]);

  // Combine scores with weighted average
  const weights = {
    perspective: 0.4,
    hateBERT: 0.3,
    detoxify: 0.3
  };

  const categories = {
    hate: (
      perspectiveResult.TOXICITY * weights.perspective +
      hateBERTResult.hate_speech * weights.hateBERT +
      detoxifyResult.toxicity * weights.detoxify
    ),
    threat: (
      perspectiveResult.THREAT * weights.perspective +
      hateBERTResult.threatening * weights.hateBERT +
      detoxifyResult.threat * weights.detoxify
    ),
    insult: (
      perspectiveResult.INSULT * weights.perspective +
      hateBERTResult.offensive * weights.hateBERT +
      detoxifyResult.insult * weights.detoxify
    ),
    identity_attack: (
      perspectiveResult.IDENTITY_ATTACK * weights.perspective +
      hateBERTResult.identity_hate * weights.hateBERT +
      detoxifyResult.identity_attack * weights.detoxify
    )
  };

  return {
    score: Math.max(...Object.values(categories)),
    categories,
    details: {
      perspective: perspectiveResult,
      hateBERT: hateBERTResult,
      detoxify: detoxifyResult
    }
  };
}
