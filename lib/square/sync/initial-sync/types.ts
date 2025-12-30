/**
 * Initial sync types.
 */

export interface InitialSyncResult {
  success: boolean;
  staffSynced: number;
  dishesSynced: number;
  ordersSynced: number;
  costsSynced: number;
  errors: number;
  errorMessages?: string[];
  startedAt: string;
  completedAt?: string;
}



