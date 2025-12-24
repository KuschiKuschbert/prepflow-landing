/**
 * In-memory queue state for sync operations.
 */
import type { QueuedSyncOperation } from '../types';

// In-memory queue (could be moved to database for persistence)
export const syncQueue: QueuedSyncOperation[] = [];
export let isProcessing = false;
export let lastBatchProcessedAt = 0;

export function setIsProcessing(value: boolean): void {
  isProcessing = value;
}

export function setLastBatchProcessedAt(value: number): void {
  lastBatchProcessedAt = value;
}

export function clearQueueState(): void {
  syncQueue.length = 0;
  isProcessing = false;
  lastBatchProcessedAt = 0;
}
