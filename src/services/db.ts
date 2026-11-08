import { Employee } from '../types';
import { INITIAL_EMPLOYEES } from './sampleData';

const DB_NAME = 'BabilAgriArchiveDB_v2';
const DB_VERSION = 1;
const STORE_NAME = 'employees';

let dbInstance: IDBDatabase | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB open failed:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        dbInstance = request.result;
        resolve(dbInstance);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    } catch (e) {
      reject(e);
    }
  });
}

// Fallback localStorage key
const LS_FALLBACK_KEY = 'babil_agri_employees_backup';

export async function getAllEmployees(): Promise<Employee[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = async () => {
        const results = request.result as Employee[];
        if (!results || results.length === 0) {
          // Seed with initial authentic employees
          await saveAllEmployees(INITIAL_EMPLOYEES);
          resolve(INITIAL_EMPLOYEES);
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Falling back to localStorage for archive data', err);
    const cached = localStorage.getItem(LS_FALLBACK_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(INITIAL_EMPLOYEES));
    return INITIAL_EMPLOYEES;
  }
}

export async function saveEmployee(employee: Employee): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(employee);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Fallback save to localStorage', err);
    const existing = await getAllEmployees();
    const idx = existing.findIndex(e => e.id === employee.id);
    if (idx >= 0) {
      existing[idx] = employee;
    } else {
      existing.unshift(employee);
    }
    localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(existing));
  }
}

export async function deleteEmployee(id: number): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Fallback delete from localStorage', err);
    const existing = await getAllEmployees();
    const filtered = existing.filter(e => e.id !== id);
    localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(filtered));
  }
}

export async function saveAllEmployees(list: Employee[]): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      list.forEach(item => store.put(item));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Fallback saveAll to localStorage', err);
    localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(list));
  }
}

export async function resetToDefault(): Promise<Employee[]> {
  await saveAllEmployees(INITIAL_EMPLOYEES);
  return INITIAL_EMPLOYEES;
}

export async function exportDatabaseBackup(): Promise<string> {
  const employees = await getAllEmployees();
  const exportPayload = {
    system: 'Babil Agriculture Directorate - Electronic Dossier Archive System',
    republic: 'جمهورية العراق - ديوان محافظة بابل - مديرية زراعة بابل',
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    totalEmployees: employees.length,
    employees
  };
  return JSON.stringify(exportPayload, null, 2);
}

export async function importDatabaseBackup(jsonString: string): Promise<Employee[]> {
  const parsed = JSON.parse(jsonString);
  const employees: Employee[] = Array.isArray(parsed) ? parsed : (parsed.employees || []);
  if (!Array.isArray(employees)) {
    throw new Error('صيغة ملف النسخة الاحتياطية غير صالحة');
  }
  await saveAllEmployees(employees);
  return employees;
}
