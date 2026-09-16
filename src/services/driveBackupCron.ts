/**
 * Background Cron Backup Service for RedZen Google Drive Stay Ledger
 * Manages periodic automatic backup snapshots of the stay ledger, reservations,
 * and member registries to Google Drive.
 */

import { getEarlyAccessLeads } from './leadStorage';
import { syncStayLedgerToDrive } from '../googleDrive';
import { getAccessToken } from '../firebase';
import { DriveStayFile } from '../types';

export interface CronBackupSettings {
  enabled: boolean;
  intervalMinutes: number; // e.g., 5, 15, 30, 60
  lastBackupTime?: string;
  nextBackupTime?: string;
  lastBackupStatus?: 'idle' | 'running' | 'success' | 'failed';
  lastBackupError?: string;
  lastBackupFile?: DriveStayFile;
  backupCount: number;
}

const CRON_SETTINGS_KEY = 'redzen_drive_cron_backup_settings_v1';

const DEFAULT_SETTINGS: CronBackupSettings = {
  enabled: true,
  intervalMinutes: 15,
  lastBackupStatus: 'idle',
  backupCount: 0
};

export function getCronBackupSettings(): CronBackupSettings {
  try {
    const raw = localStorage.getItem(CRON_SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveCronBackupSettings(settings: Partial<CronBackupSettings>): CronBackupSettings {
  const current = getCronBackupSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(CRON_SETTINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to persist cron settings', e);
  }
  return updated;
}

type BackupListener = (settings: CronBackupSettings) => void;
const listeners: Set<BackupListener> = new Set();

export function subscribeToCronUpdates(listener: BackupListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners(settings: CronBackupSettings) {
  listeners.forEach((fn) => {
    try {
      fn(settings);
    } catch (e) {
      console.error('Error notifying cron listener', e);
    }
  });
}

/**
 * Executes a background backup run if authenticated with Google Drive
 */
export async function runCronBackupNow(manualTrigger = false): Promise<{ success: boolean; file?: DriveStayFile; error?: string }> {
  const settings = getCronBackupSettings();
  
  // Verify auth token
  const token = await getAccessToken();
  if (!token) {
    const reason = 'Niet ingelogd met Google Workspace. Verbind Google Drive om automatische cron backups te activeren.';
    saveCronBackupSettings({
      lastBackupStatus: 'idle',
      lastBackupError: reason
    });
    notifyListeners(getCronBackupSettings());
    return { success: false, error: reason };
  }

  // Update status to running
  saveCronBackupSettings({
    lastBackupStatus: 'running',
    lastBackupError: undefined
  });
  notifyListeners(getCronBackupSettings());

  try {
    const leads = getEarlyAccessLeads();
    const note = manualTrigger 
      ? `Handmatige snapshot via achtergrond cron service (${new Date().toLocaleTimeString('nl-NL')})`
      : `Geplande automatische background cron backup (interval: ${settings.intervalMinutes}m)`;
    
    const file = await syncStayLedgerToDrive(leads, { exportNote: note });
    
    const nextDate = new Date(Date.now() + settings.intervalMinutes * 60 * 1000).toISOString();
    const updated = saveCronBackupSettings({
      lastBackupTime: new Date().toISOString(),
      nextBackupTime: nextDate,
      lastBackupStatus: 'success',
      lastBackupError: undefined,
      lastBackupFile: file,
      backupCount: (settings.backupCount || 0) + 1
    });

    notifyListeners(updated);
    return { success: true, file };
  } catch (err: any) {
    console.error('Cron backup error:', err);
    const updated = saveCronBackupSettings({
      lastBackupStatus: 'failed',
      lastBackupError: err.message || 'Onbekende fout tijdens backup'
    });
    notifyListeners(updated);
    return { success: false, error: err.message };
  }
}

let activeIntervalTimer: NodeJS.Timeout | null = null;

/**
 * Initializes or restarts the background client-side cron worker
 */
export function startDriveCronWorker() {
  if (activeIntervalTimer) {
    clearInterval(activeIntervalTimer);
    activeIntervalTimer = null;
  }

  const checkAndRun = async () => {
    const settings = getCronBackupSettings();
    if (!settings.enabled) return;

    const token = await getAccessToken();
    if (!token) return; // Silent until user connects Drive

    const now = Date.now();
    const last = settings.lastBackupTime ? new Date(settings.lastBackupTime).getTime() : 0;
    const intervalMs = settings.intervalMinutes * 60 * 1000;

    if (now - last >= intervalMs && settings.lastBackupStatus !== 'running') {
      await runCronBackupNow(false);
    }
  };

  // Run a periodic check every 30 seconds
  activeIntervalTimer = setInterval(checkAndRun, 30000);

  // Trigger initial check after 5 seconds to catch up if interval elapsed
  setTimeout(checkAndRun, 5000);
}

export function stopDriveCronWorker() {
  if (activeIntervalTimer) {
    clearInterval(activeIntervalTimer);
    activeIntervalTimer = null;
  }
}
