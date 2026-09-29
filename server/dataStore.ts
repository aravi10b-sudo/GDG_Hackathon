import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data', 'runtime');
const TICKETS_FILE = path.join(DATA_DIR, 'tickets.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`dataStore: failed to read ${filePath}, using fallback`, err);
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`dataStore: failed to write ${filePath}`, err);
  }
}

// Lightweight prototype file-based store — swap for a real database (e.g. Postgres/Cloud SQL) in production.
export function loadTickets<T>(seedData: T[]): T[] {
  return readJsonFile<T[]>(TICKETS_FILE, seedData);
}

export function persistTickets<T>(tickets: T[]): void {
  writeJsonFile(TICKETS_FILE, tickets);
}

export function loadProjects<T>(seedData: T[]): T[] {
  return readJsonFile<T[]>(PROJECTS_FILE, seedData);
}

export function persistProjects<T>(projects: T[]): void {
  writeJsonFile(PROJECTS_FILE, projects);
}
