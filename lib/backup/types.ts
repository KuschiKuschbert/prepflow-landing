/**
 * Type definitions for backup and restore system.
 */

export type BackupFormat = 'json' | 'sql' | 'encrypted';
export type EncryptionMode = 'user-password' | 'prepflow-only';
export type RestoreMode = 'full' | 'selective' | 'merge';
export type BackupType = 'manual' | 'scheduled';
export type ConflictResolution = 'skip' | 'update' | 'create-new';

export interface BackupData {
  version: string; // "1.0.0"
  timestamp: string; // ISO 8601
  userId: string;
  tables: {
    [tableName: string]: any[];
  };
  metadata: {
    recordCounts: Record<string, number>;
    exportFormat: 'json' | 'sql';
    encryptionMode?: EncryptionMode;
  };
}

export interface EncryptedBackup {
  data: Uint8Array; // Encrypted binary data
  filename: string; // e.g., "backup-2025-01-15.pfbk"
  size: number; // Size in bytes
  encryptionMode: EncryptionMode;
  createdAt: string; // ISO 8601
}

export interface EncryptionOptions {
  mode: EncryptionMode;
  password?: string; // Required if mode is 'user-password'
}

export interface BackupFile {
  id: string;
  filename: string;
  size: number;
  createdAt: string;
  format: BackupFormat;
  encryptionMode?: EncryptionMode;
  googleDriveFileId?: string;
}

export interface RestoreResult {
  success: boolean;
  tablesRestored: string[];
  recordsRestored: Record<string, number>;
  conflicts: Record<string, number>;
  errors?: string[];
}

export interface MergeOptions {
  conflictResolution: ConflictResolution;
  skipExisting?: boolean; // Default: true
  updateExisting?: boolean; // Default: false
  createNewIds?: boolean; // Default: false (for merge mode)
}

export interface BackupSchedule {
  userId: string;
  intervalHours: number;
  lastBackupAt?: string;
  nextBackupAt?: string;
  enabled: boolean;
  autoUploadToDrive: boolean;
}

export interface BackupSettings {
  userId: string;
  defaultFormat: BackupFormat;
  defaultEncryptionMode: EncryptionMode;
  scheduledBackupEnabled: boolean;
  scheduledBackupInterval: number; // hours
  autoUploadToDrive: boolean;
}

export interface TableData {
  tableName: string;
  records: any[];
  recordCount: number;
}

export interface BackupMetadata {
  id: string;
  userId: string;
  backupType: BackupType;
  format: BackupFormat;
  fileSizeBytes: number;
  recordCount: number;
  googleDriveFileId?: string;
  createdAt: string;
}

