/**
 * Webhook logger types.
 */
export interface WebhookEventLog {
  stripe_event_id: string;
  event_type: string;
  processed: boolean;
  processed_at?: Date;
  processing_time_ms?: number;
  success?: boolean;
  error_message?: string;
  event_data?: any;
}



