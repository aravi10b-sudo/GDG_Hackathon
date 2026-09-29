import { DistrictData } from '../types';

const REQUIRED_COLUMNS = [
  'id',
  'name',
  'name_ta',
  'population',
  'water_deficit_score',
  'road_deficit_score',
  'health_deficit_score',
  'power_deficit_score',
  'overall_deficit_index',
  'citizen_tickets_count',
  'planned_capex_crores',
  'required_capex_crores',
  'alignment_mismatch_pct',
  'lat',
  'lng',
  'top_unaddressed_demand',
  'top_unaddressed_demand_ta',
] as const;

/** Parses RFC4180-style CSV text (quoted fields, escaped "" quotes, CRLF/LF) into rows of string cells. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ''));
}

/**
 * Fetches and parses a district dataset CSV served from the app's public folder.
 * Returns null (never throws) when the file is missing, malformed, or empty,
 * so callers can fall back to mock data.
 */
export async function loadRealDistricts(csvUrl: string = '/data/districts.csv'): Promise<DistrictData[] | null> {
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    const rows = parseCsv(text);
    if (rows.length < 2) {
      return null;
    }

    const header = rows[0].map((h) => h.trim());
    const missingColumn = REQUIRED_COLUMNS.find((col) => !header.includes(col));
    if (missingColumn) {
      console.warn(`realDistrictLoader: missing required CSV column "${missingColumn}"`);
      return null;
    }

    const columnIndex = new Map(header.map((name, index) => [name, index]));
    const dataRows = rows.slice(1).filter((r) => r.some((cell) => cell.trim() !== ''));
    if (dataRows.length === 0) {
      return null;
    }

    const districts: DistrictData[] = dataRows.map((row) => {
      const get = (col: string): string => row[columnIndex.get(col)!] ?? '';
      const getNumber = (col: string): number => Number(get(col));

      return {
        id: get('id'),
        name: get('name'),
        name_ta: get('name_ta'),
        population: getNumber('population'),
        water_deficit_score: getNumber('water_deficit_score'),
        road_deficit_score: getNumber('road_deficit_score'),
        health_deficit_score: getNumber('health_deficit_score'),
        power_deficit_score: getNumber('power_deficit_score'),
        overall_deficit_index: getNumber('overall_deficit_index'),
        citizen_tickets_count: getNumber('citizen_tickets_count'),
        planned_capex_crores: getNumber('planned_capex_crores'),
        required_capex_crores: getNumber('required_capex_crores'),
        alignment_mismatch_pct: getNumber('alignment_mismatch_pct'),
        center_coords: { lat: getNumber('lat'), lng: getNumber('lng') },
        top_unaddressed_demand: get('top_unaddressed_demand'),
        top_unaddressed_demand_ta: get('top_unaddressed_demand_ta'),
      };
    });

    return districts;
  } catch (err) {
    console.warn('realDistrictLoader: failed to load real district data, falling back to mock data', err);
    return null;
  }
}
