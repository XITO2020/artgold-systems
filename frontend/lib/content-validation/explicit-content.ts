import { ImageAnnotatorClient, protos } from '@google-cloud/vision';
import { NsfwjsModel } from './nsfwjs-model';
import { HumeAI } from './hume-ai';

interface ExplicitContentResult {
  adult: number;
  racy: number;
  gore: number;
  violence: number;
  details: {
    googleVision: any;
    nsfwjs: any;
    humeAI: any;
  };
}

export async function detectExplicitContent(imageBuffer: Buffer): Promise<ExplicitContentResult> {
  // Initialize clients
  const visionClient = new ImageAnnotatorClient();
  const nsfwModel = await NsfwjsModel.getInstance();
  const humeAI = new HumeAI(process.env.HUME_API_KEY!);

  // Run all detections in parallel
  const [googleResult, nsfwResult, humeResult] = await Promise.all([
    // Google Vision Safe Search
    visionClient.safeSearchDetection(imageBuffer).then(([results]) => results.safeSearchAnnotation),

    // NSFW.js detection
    nsfwModel.classify(imageBuffer),

    // Hume AI content analysis
    humeAI.analyzeImage(imageBuffer)
  ]);

  // Normalize Google Vision results (POSSIBLE->0.5, LIKELY->0.75, VERY_LIKELY->1.0)
  const normalizeGoogleScore = (likelihood: protos.google.cloud.vision.v1.Likelihood) => {
    const scores: Record<protos.google.cloud.vision.v1.Likelihood, number> = {
      [protos.google.cloud.vision.v1.Likelihood.VERY_UNLIKELY]: 0,
      [protos.google.cloud.vision.v1.Likelihood.UNLIKELY]: 0.25,
      [protos.google.cloud.vision.v1.Likelihood.POSSIBLE]: 0.5,
      [protos.google.cloud.vision.v1.Likelihood.LIKELY]: 0.75,
      [protos.google.cloud.vision.v1.Likelihood.VERY_LIKELY]: 1.0,
      [protos.google.cloud.vision.v1.Likelihood.UNKNOWN]: 0 // Ajout de la valeur manquante
    };
    return scores[likelihood] || 0;
  };

  const googleScores = {
    adult: normalizeGoogleScore(googleResult.adult),
    racy: normalizeGoogleScore(googleResult.racy),
    violence: normalizeGoogleScore(googleResult.violence),
    medical: normalizeGoogleScore(googleResult.medical)
  };

  // Combine scores with weighted average
  const weights = {
    google: 0.4,
    nsfwjs: 0.4,
    hume: 0.2
  };

  return {
    adult: (
      googleScores.adult * weights.google +
      nsfwResult.porn * weights.nsfwjs +
      humeResult.nsfw_score * weights.hume
    ),
    racy: (
      googleScores.racy * weights.google +
      nsfwResult.sexy * weights.nsfwjs +
      humeResult.suggestive_score * weights.hume
    ),
    gore: (
      googleScores.violence * weights.google +
      nsfwResult.gore * weights.nsfwjs +
      humeResult.gore_score * weights.hume
    ),
    violence: (
      googleScores.violence * weights.google +
      nsfwResult.violence * weights.nsfwjs +
      humeResult.violence_score * weights.hume
    ),
    details: {
      googleVision: googleScores,
      nsfwjs: nsfwResult,
      humeAI: humeResult
    }
  };
}
