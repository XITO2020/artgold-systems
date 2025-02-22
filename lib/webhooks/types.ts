
export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  signature?: string;
}

export interface WebhookVerification {
  isValid: boolean;
  event?: WebhookEvent;
  error?: string;
}

export interface WebhookProcessor {
  processEvent(event: WebhookEvent): Promise<void>;
  handleError(error: Error): Promise<void>;
}

export type WebhookProvider = 'stripe' | 'paypal';
