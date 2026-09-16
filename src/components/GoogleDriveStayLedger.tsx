import React, { useState, useEffect, useCallback } from 'react';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken 
} from '../firebase';
import { 
  listStayLedgerFiles, 
  syncStayLedgerToDrive, 
  deleteDriveFile 
} from '../googleDrive';
import { 
  getCronBackupSettings, 
  saveCronBackupSettings, 
  runCronBackupNow, 
  subscribeToCronUpdates,
  CronBackupSettings 
} from '../services/driveBackupCron';
import { DriveStayFile, EarlyAccessLead } from '../types';
import { GoogleSignInButton } from './GoogleSignInButton';
import { User } from 'firebase/auth';

interface GoogleDriveStayLedgerProps {
  leads: EarlyAccessLead[];
  onFileSynced?: (file: DriveStayFile) => void;
}

export const GoogleDriveStayLedger: React.FC<GoogleDriveStayLedgerProps> = ({ leads, onFileSynced }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveStayFile[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Deletion confirmation modal state
  const [fileToDelete, setFileToDelete] = useState<DriveStayFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Background cron backup state
  const [cronSettings, setCronSettings] = useState<CronBackupSettings>(getCronBackupSettings);
  const [isTriggeringCron, setIsTriggeringCron] = useState(false);

  // Monitor auth state on mount
  useEffect(() => {
    const unsubscribeAuth = initAuth(
      async (authUser, token) => {
        setUser(authUser);
        setHasToken(!!token);
        if (token) {
          fetchFiles();
        }
      },
      () => {
        setUser(null);
        setHasToken(false);
        setDriveFiles([]);
      }
    );

    const unsubscribeCron = subscribeToCronUpdates((updated) => {
      setCronSettings(updated);
      if (updated.lastBackupStatus === 'success') {
        fetchFiles();
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeCron();
    };
  }, []);

  const handleToggleCron = (enabled: boolean) => {
    const updated = saveCronBackupSettings({ enabled });
    setCronSettings(updated);
    setStatusMessage({
      type: 'info',
      text: enabled 
        ? `Automatische achtergrond backups geactiveerd (elke ${updated.intervalMinutes} min).`
        : 'Automatische achtergrond backups gepauzeerd.'
    });
  };

  const handleChangeInterval = (minutes: number) => {
    const nextDate = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    const updated = saveCronBackupSettings({ 
      intervalMinutes: minutes,
      nextBackupTime: nextDate
    });
    setCronSettings(updated);
  };

  const handleRunManualCron = async () => {
    setIsTriggeringCron(true);
    setStatusMessage(null);
    try {
      const res = await runCronBackupNow(true);
      if (res.success && res.file) {
        setStatusMessage({
          type: 'success',
          text: `Achtergrond backup geslaagd! Bestand "${res.file.name}" veilig opgeslagen in Google Drive.`
        });
        if (onFileSynced) onFileSynced(res.file);
        await fetchFiles();
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Achtergrond backup mislukt.'
        });
      }
    } finally {
      setIsTriggeringCron(false);
    }
  };

  const fetchFiles = useCallback(async () => {
    setIsLoadingFiles(true);
    setStatusMessage(null);
    try {
      const files = await listStayLedgerFiles();
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Fout bij ophalen Drive bestanden:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Kon bestanden uit Google Drive niet laden.'
      });
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  const handleSignIn = async () => {
    setIsLoadingAuth(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setHasToken(true);
        setStatusMessage({
          type: 'success',
          text: `Verbonden met Google Drive account (${res.user.email}).`
        });
        await fetchFiles();
      }
    } catch (err: any) {
      console.error('Google Sign-In fout:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Inloggen met Google mislukt. Probeer het opnieuw.'
      });
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setHasToken(false);
    setDriveFiles([]);
    setStatusMessage({
      type: 'info',
      text: 'Veilig uitgelogd van Google Drive.'
    });
  };

  const handleSyncToDrive = async () => {
    if (!hasToken) {
      setStatusMessage({
        type: 'info',
        text: 'Meld je eerst aan met Google om het gastenregister te synchroniseren.'
      });
      return;
    }

    setIsSyncing(true);
    setStatusMessage(null);
    try {
      const uploadedFile = await syncStayLedgerToDrive(leads, {
        exportNote: `Handmatige synchronisatie van ${leads.length} gastendossiers vanuit Admin Portal`
      });

      setStatusMessage({
        type: 'success',
        text: `Verblijfsregister succesvol opgeslagen in Google Drive (${uploadedFile.name}).`
      });

      if (onFileSynced) {
        onFileSynced(uploadedFile);
      }

      await fetchFiles();
    } catch (err: any) {
      console.error('Sync naar Google Drive mislukt:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Synchronisatie naar Google Drive is mislukt.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Explicit confirmation dialog handler for deleting a file
  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(fileToDelete.id);
      setStatusMessage({
        type: 'success',
        text: `Bestand "${fileToDelete.name}" is definitief verwijderd uit Google Drive.`
      });
      setFileToDelete(null);
      await fetchFiles();
    } catch (err: any) {
      console.error('Bestand verwijderen mislukt:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Verwijderen mislukt.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-[#15191A] border border-[#A9875A]/30 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Header & Connection status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">📁</span>
            <h3 className="text-lg font-serif text-[#F7F5F1]">Google Drive Stay Ledger</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#A9875A]/15 border border-[#A9875A]/40 text-[#A9875A] uppercase tracking-wider">
              Workspace
            </span>
          </div>
          <p className="text-xs text-[#A9AAA7] max-w-xl">
            Sla gastreserveringen, verblijfsdossiers en digitale facturen gecodeerd op in de beveiligde Google Drive map van RedZen Suites.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user && hasToken ? (
            <div className="flex items-center gap-3 bg-[#0B0D0E] border border-white/10 rounded-xl px-3 py-2">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Google Host'} 
                  className="w-7 h-7 rounded-full border border-[#A9875A]/50"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#A9875A]/20 text-[#A9875A] font-bold text-xs flex items-center justify-center">
                  {(user.displayName || user.email || 'G')[0].toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <div className="text-xs text-[#F7F5F1] font-medium truncate max-w-[140px] sm:max-w-[180px]">
                  {user.displayName || user.email}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Drive Verbonden
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-[11px] text-[#A9AAA7] hover:text-rose-400 ml-2 underline cursor-pointer"
              >
                Ontkoppelen
              </button>
            </div>
          ) : (
            <GoogleSignInButton
              onClick={handleSignIn}
              isLoading={isLoadingAuth}
              text="Verbind met Google Drive"
            />
          )}
        </div>
      </div>

      {/* Notifications / Feedback */}
      {statusMessage && (
        <div 
          className={`p-3.5 rounded-xl text-xs flex items-start gap-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300' 
              : statusMessage.type === 'error'
              ? 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
              : 'bg-amber-950/40 border border-amber-500/40 text-amber-300'
          }`}
        >
          <span className="text-sm">
            {statusMessage.type === 'success' ? '✅' : statusMessage.type === 'error' ? '⚠️' : 'ℹ️'}
          </span>
          <span className="flex-1">{statusMessage.text}</span>
          <button 
            type="button" 
            onClick={() => setStatusMessage(null)}
            className="text-[#A9AAA7] hover:text-white text-xs cursor-pointer ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Background Cron Backups Panel */}
      <div className="p-4 rounded-xl bg-[#0B0D0E] border border-[#A9875A]/25 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">⏱️</span>
            <span className="text-xs font-serif font-medium text-[#F7F5F1]">Achtergrond Cron Backup Scheduler</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              cronSettings.enabled && hasToken
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
            }`}>
              {cronSettings.enabled ? (hasToken ? 'Actief' : 'Wacht op Drive login') : 'Gepauzeerd'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[11px] text-[#A9AAA7] flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={cronSettings.enabled}
                onChange={(e) => handleToggleCron(e.target.checked)}
                className="rounded accent-[#A9875A]"
              />
              <span>Automatische cron backups</span>
            </label>

            <select
              value={cronSettings.intervalMinutes}
              onChange={(e) => handleChangeInterval(parseInt(e.target.value, 10))}
              disabled={!cronSettings.enabled}
              className="bg-[#181E20] text-xs text-[#F7F5F1] border border-white/10 rounded-lg px-2 py-1 cursor-pointer disabled:opacity-40"
            >
              <option value="5">Elke 5 minuten</option>
              <option value="15">Elke 15 minuten</option>
              <option value="30">Elke 30 minuten</option>
              <option value="60">Elk uur</option>
            </select>

            <button
              type="button"
              onClick={handleRunManualCron}
              disabled={!hasToken || isTriggeringCron || cronSettings.lastBackupStatus === 'running'}
              className="px-2.5 py-1 rounded-lg bg-[#181E20] hover:bg-[#252c30] text-[11px] text-[#A9875A] border border-[#A9875A]/40 font-mono transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>⚡</span>
              <span>{isTriggeringCron ? 'Draait...' : 'Draai Nu'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#A9AAA7] pt-1 border-t border-white/5">
          <div>
            Laatste backup: <span className="text-[#F7F5F1]">
              {cronSettings.lastBackupTime ? new Date(cronSettings.lastBackupTime).toLocaleTimeString('nl-NL') : 'Nog niet gedraaid'}
            </span>
          </div>
          <div>
            Volgende run: <span className="text-emerald-400">
              {cronSettings.nextBackupTime && cronSettings.enabled ? new Date(cronSettings.nextBackupTime).toLocaleTimeString('nl-NL') : '—'}
            </span>
          </div>
          <div>
            Totaal uitgevoerde backups: <span className="text-[#A9875A]">{cronSettings.backupCount || 0}</span>
          </div>
          {cronSettings.lastBackupStatus === 'running' && (
            <span className="text-amber-400 animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Backup snapshot wordt weggeschreven naar Google Drive...
            </span>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B0D0E]/60 p-4 rounded-xl border border-white/5">
        <div className="text-xs text-[#A9AAA7]">
          <span className="font-semibold text-[#F7F5F1]">{leads.length} actieve dossiers</span> beschikbaar voor export naar Drive map <span className="font-mono text-[#A9875A]">"RedZen Suites — Stay Ledger"</span>.
        </div>

        <div className="flex items-center gap-2">
          {hasToken && (
            <button
              type="button"
              onClick={fetchFiles}
              disabled={isLoadingFiles}
              className="px-3 py-2 rounded-xl bg-[#181E20] hover:bg-[#20272a] text-[#F7F5F1] text-xs font-medium border border-white/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoadingFiles ? 'Verversen...' : '🔄 Bestanden Verversen'}
            </button>
          )}

          <button
            type="button"
            onClick={handleSyncToDrive}
            disabled={!hasToken || isSyncing}
            className="px-4 py-2 rounded-xl bg-[#A9875A] hover:bg-[#C5A069] text-[#0B0D0E] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <span>☁️</span>
            <span>{isSyncing ? 'Synchroniseren...' : 'Upload Stay Ledger naar Drive'}</span>
          </button>
        </div>
      </div>

      {/* Files List from Google Drive */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#A9AAA7]">
          <span>Gearchiveerde Bestanden in Google Drive ({driveFiles.length})</span>
          {isLoadingFiles && <span className="text-[#A9875A] animate-pulse">Laden...</span>}
        </div>

        {!hasToken ? (
          <div className="p-8 text-center rounded-xl bg-[#0B0D0E]/40 border border-dashed border-white/10 space-y-2">
            <div className="text-2xl">🔐</div>
            <p className="text-xs text-[#A9AAA7]">
              Meld u aan met uw geautoriseerde Google account om de Drive dossiers te bekijken en te synchroniseren.
            </p>
          </div>
        ) : driveFiles.length === 0 && !isLoadingFiles ? (
          <div className="p-8 text-center rounded-xl bg-[#0B0D0E]/40 border border-dashed border-white/10 space-y-2">
            <div className="text-2xl">📂</div>
            <p className="text-xs text-[#A9AAA7]">
              Nog geen verblijfsdossiers gevonden in uw RedZen Suites map. Klik hierboven op "Upload Stay Ledger naar Drive" om uw eerste backup te maken.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-[#0B0D0E]">
            {driveFiles.map((file) => (
              <div 
                key={file.id}
                className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="text-lg mt-0.5 sm:mt-0">
                    {file.mimeType.includes('json') ? '📄' : '📁'}
                  </span>
                  <div>
                    <div className="text-xs font-medium text-[#F7F5F1] break-all">
                      {file.name}
                    </div>
                    <div className="text-[11px] text-[#A9AAA7] font-mono flex flex-wrap gap-2 mt-0.5">
                      {file.size && <span>{file.size}</span>}
                      {file.modifiedTime && (
                        <span>
                          Gewijzigd: {new Date(file.modifiedTime).toLocaleString('nl-NL')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {file.webViewLink && (
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#181E20] hover:bg-[#A9875A] text-[#A9875A] hover:text-[#0B0D0E] text-xs font-mono transition-all flex items-center gap-1"
                    >
                      <span>Open in Drive</span>
                      <span>↗</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setFileToDelete(file)}
                    title="Verwijder bestand uit Google Drive"
                    className="p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-300 border border-white/5 text-xs transition-colors cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mandatory Explicit Confirmation Dialog for File Deletion */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#15191A] border border-rose-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold">
              <span>⚠️</span>
              <span>Bevestig Verwijdering uit Google Drive</span>
            </div>

            <p className="text-xs text-[#F7F5F1] leading-relaxed">
              Weet u zeker dat u het volgende bestand permanent wilt verwijderen uit Google Drive?
            </p>

            <div className="p-3 rounded-xl bg-[#0B0D0E] border border-white/10 text-xs font-mono text-[#A9875A] break-all">
              {fileToDelete.name}
            </div>

            <p className="text-[11px] text-[#A9AAA7]">
              Deze actie kan niet ongedaan worden gemaakt.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-[#181E20] hover:bg-[#22292c] text-[#F7F5F1] text-xs font-medium border border-white/10 transition-colors cursor-pointer"
              >
                Annuleren
              </button>

              <button
                type="button"
                onClick={confirmDeleteFile}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Verwijderen...' : 'Definitief Verwijderen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
