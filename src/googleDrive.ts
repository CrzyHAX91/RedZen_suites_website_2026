import { getAccessToken } from './firebase';
import { DriveStayFile, EarlyAccessLead, DigitalReceipt } from './types';

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API_URL = 'https://www.googleapis.com/upload/drive/v3';
const REDZEN_FOLDER_NAME = 'RedZen Suites — Stay Ledger';

/**
 * Ensures a valid access token is present or throws a user-friendly error.
 */
async function requireAccessToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Geen geldige Google Drive sessie gevonden. Log opnieuw in met Google.');
  }
  return token;
}

/**
 * Finds or creates the dedicated RedZen Suites Stay Ledger folder in Google Drive.
 */
export async function getOrCreateLedgerFolder(): Promise<string> {
  const token = await requireAccessToken();

  // Search for existing folder
  const query = encodeURIComponent(`mimeType = 'application/vnd.google-apps.folder' and name = '${REDZEN_FOLDER_NAME}' and trashed = false`);
  const searchRes = await fetch(`${DRIVE_API_URL}/files?q=${query}&fields=files(id, name)&pageSize=1`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!searchRes.ok) {
    const errorData = await searchRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Fout bij controleren van Google Drive map.');
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder if not found
  const createRes = await fetch(`${DRIVE_API_URL}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: REDZEN_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Veilige cloud-opslag voor RedZen Suites verblijfsdossiers, reserveringen en digitale facturen.'
    })
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Aanmaken van Google Drive map mislukt.');
  }

  const createData = await createRes.json();
  return createData.id;
}

/**
 * Lists all stay ledger files, receipts, and records in Google Drive.
 */
export async function listStayLedgerFiles(): Promise<DriveStayFile[]> {
  const token = await requireAccessToken();
  const folderId = await getOrCreateLedgerFolder();

  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const res = await fetch(
    `${DRIVE_API_URL}/files?q=${query}&fields=files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink)&orderBy=modifiedTime desc`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Kon bestanden niet ophalen uit Google Drive.');
  }

  const data = await res.json();
  return (data.files || []).map((file: any) => ({
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    size: file.size ? `${(parseInt(file.size, 10) / 1024).toFixed(1)} KB` : undefined,
    createdTime: file.createdTime,
    modifiedTime: file.modifiedTime,
    webViewLink: file.webViewLink
  }));
}

/**
 * Saves or updates the complete Stay & Guest Ledger JSON file to Google Drive.
 */
export async function syncStayLedgerToDrive(
  leads: EarlyAccessLead[],
  meta?: { exportNote?: string }
): Promise<DriveStayFile> {
  const token = await requireAccessToken();
  const folderId = await getOrCreateLedgerFolder();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName = `redzen_stay_ledger_${timestamp}.json`;

  const payload = {
    app: 'RedZen Suites Private Wellness',
    entity: 'Stay Ledger & Guest Dossiers',
    generatedAt: new Date().toISOString(),
    exportNote: meta?.exportNote || 'Periodieke sync van gastendossiers en reserveringen',
    totalRecords: leads.length,
    convertedStaysCount: leads.filter(l => l.paymentStatus === 'deposit_paid' || l.status === 'converted').length,
    records: leads
  };

  const fileContent = JSON.stringify(payload, null, 2);
  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: 'application/json',
    description: `RedZen Suites Gasten- en Verblijfsregister (${leads.length} records)`
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append(
    'file',
    new Blob([fileContent], { type: 'application/json' })
  );

  const uploadRes = await fetch(
    `${UPLOAD_API_URL}/files?uploadType=multipart&fields=id,name,mimeType,size,createdTime,modifiedTime,webViewLink`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    }
  );

  if (!uploadRes.ok) {
    const errorData = await uploadRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Uploaden van verblijfsregister naar Drive is mislukt.');
  }

  const uploaded = await uploadRes.json();
  return {
    id: uploaded.id,
    name: uploaded.name,
    mimeType: uploaded.mimeType,
    size: uploaded.size ? `${(parseInt(uploaded.size, 10) / 1024).toFixed(1)} KB` : undefined,
    createdTime: uploaded.createdTime,
    modifiedTime: uploaded.modifiedTime,
    webViewLink: uploaded.webViewLink
  };
}

/**
 * Exports an individual Digital Receipt to Google Drive as an archive document.
 */
export async function exportReceiptToDrive(receipt: DigitalReceipt): Promise<DriveStayFile> {
  const token = await requireAccessToken();
  const folderId = await getOrCreateLedgerFolder();

  const fileName = `Factuur_${receipt.receiptNumber}_${receipt.reservationCode}.json`;
  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: 'application/json',
    description: `RedZen Suites Digitale Aanbetalingsfactuur voor ${receipt.customerName} (${receipt.reservationCode})`
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append(
    'file',
    new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' })
  );

  const uploadRes = await fetch(
    `${UPLOAD_API_URL}/files?uploadType=multipart&fields=id,name,mimeType,size,createdTime,modifiedTime,webViewLink`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    }
  );

  if (!uploadRes.ok) {
    const errorData = await uploadRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Opslaan van factuur naar Google Drive mislukt.');
  }

  const uploaded = await uploadRes.json();
  return {
    id: uploaded.id,
    name: uploaded.name,
    mimeType: uploaded.mimeType,
    size: uploaded.size ? `${(parseInt(uploaded.size, 10) / 1024).toFixed(1)} KB` : undefined,
    createdTime: uploaded.createdTime,
    modifiedTime: uploaded.modifiedTime,
    webViewLink: uploaded.webViewLink
  };
}

/**
 * Deletes a file from Google Drive.
 * MANDATORY: Callers must obtain explicit user confirmation before executing this function.
 */
export async function deleteDriveFile(fileId: string): Promise<void> {
  const token = await requireAccessToken();

  const res = await fetch(`${DRIVE_API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok && res.status !== 204) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Bestand kon niet worden verwijderd uit Google Drive.');
  }
}
