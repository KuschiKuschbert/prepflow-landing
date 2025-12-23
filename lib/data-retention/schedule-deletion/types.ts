export interface ScheduleDeletionParams {
  userEmail: string;
  requestedAt?: Date;
  metadata?: Record<string, unknown>;
}
