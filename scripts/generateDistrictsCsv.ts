import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.join(__dirname, '..', 'data_source', 'district_data');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'data', 'districts.csv');

interface StateInfo {
  lat: number;
  lng: number;
  approxPopulation: number;
}

interface DistrictRow {
  id: string;
  name: string;
  name_ta: string;
  population: number;
  water_deficit_score: number;
  road_deficit_score: number;
  health_deficit_score: number;
  power_deficit_score: number;
  overall_deficit_index: number;
  citizen_tickets_count: number;
  planned_capex_crores: number;
  required_capex_crores: number;
  alignment_mismatch_pct: number;
  lat: number;
  lng: number;
  top_unaddressed_demand: string;
  top_unaddressed_demand_ta: string;
}

const CSV_HEADER: (keyof DistrictRow)[] = [
  'id', 'name', 'name_ta', 'population', 'water_deficit_score', 'road_deficit_score',
  'health_deficit_score', 'power_deficit_score', 'overall_deficit_index', 'citizen_tickets_count',
  'planned_capex_crores', 'required_capex_crores', 'alignment_mismatch_pct', 'lat', 'lng',
  'top_unaddressed_demand', 'top_unaddressed_demand_ta',
];

// Best-effort approximate state-capital coordinates and 2011 Census total population placeholders;
// NOT authoritative per-district data — replace with verified Census/data.gov.in figures for production use.
const STATE_INFO: Record<string, StateInfo> = {
  'JAMMU & KASHMIR': { lat: 34.0837, lng: 74.7973, approxPopulation: 12541302 },
  'HIMACHAL PRADESH': { lat: 31.1048, lng: 77.1734, approxPopulation: 6864602 },
  PUNJAB: { lat: 30.7333, lng: 76.7794, approxPopulation: 27743338 },
  CHANDIGARH: { lat: 30.7333, lng: 76.7794, approxPopulation: 1055450 },
  UTTARAKHAND: { lat: 30.3165, lng: 78.0322, approxPopulation: 10086292 },
  HARYANA: { lat: 29.0588, lng: 76.0856, approxPopulation: 25351462 },
  'NCT OF DELHI': { lat: 28.7041, lng: 77.1025, approxPopulation: 16787941 },
  RAJASTHAN: { lat: 26.9124, lng: 75.7873, approxPopulation: 68548437 },
  'UTTAR PRADESH': { lat: 26.8467, lng: 80.9462, approxPopulation: 199812341 },
  BIHAR: { lat: 25.5941, lng: 85.1376, approxPopulation: 104099452 },
  SIKKIM: { lat: 27.3389, lng: 88.6065, approxPopulation: 610577 },
  'ARUNACHAL PRADESH': { lat: 27.0844, lng: 93.6053, approxPopulation: 1383727 },
  NAGALAND: { lat: 25.6751, lng: 94.1086, approxPopulation: 1978502 },
  MANIPUR: { lat: 24.817, lng: 93.9368, approxPopulation: 2855794 },
  MIZORAM: { lat: 23.7271, lng: 92.7176, approxPopulation: 1097206 },
  TRIPURA: { lat: 23.8315, lng: 91.2868, approxPopulation: 3673917 },
  MEGHALAYA: { lat: 25.5788, lng: 91.8933, approxPopulation: 2966889 },
  ASSAM: { lat: 26.1433, lng: 91.7898, approxPopulation: 31205576 },
  'WEST BENGAL': { lat: 22.5726, lng: 88.3639, approxPopulation: 91276115 },
  JHARKHAND: { lat: 23.3441, lng: 85.3096, approxPopulation: 32988134 },
  ODISHA: { lat: 20.2961, lng: 85.8245, approxPopulation: 41974218 },
  CHHATTISGARH: { lat: 21.2514, lng: 81.6296, approxPopulation: 25545198 },
  'MADHYA PRADESH': { lat: 23.2599, lng: 77.4126, approxPopulation: 72626809 },
  GUJARAT: { lat: 23.2156, lng: 72.6369, approxPopulation: 60439692 },
  MAHARASHTRA: { lat: 19.076, lng: 72.8777, approxPopulation: 112374333 },
  'ANDHRA PRADESH': { lat: 17.385, lng: 78.4867, approxPopulation: 84580777 },
  KARNATAKA: { lat: 12.9716, lng: 77.5946, approxPopulation: 61095297 },
  GOA: { lat: 15.4909, lng: 73.8278, approxPopulation: 1458545 },
  KERALA: { lat: 8.5241, lng: 76.9366, approxPopulation: 33406061 },
  'TAMIL NADU': { lat: 13.0827, lng: 80.2707, approxPopulation: 72147030 },
  PUDUCHERRY: { lat: 11.9416, lng: 79.8083, approxPopulation: 1247953 },
  LAKSHADWEEP: { lat: 10.5669, lng: 72.642, approxPopulation: 64473 },
  'ANDAMAN & NICOBAR ISLANDS': { lat: 11.6234, lng: 92.7265, approxPopulation: 380581 },
  'DADRA & NAGAR HAVELI': { lat: 20.2766, lng: 73.0169, approxPopulation: 343709 },
  'DAMAN & DIU': { lat: 20.3974, lng: 72.8328, approxPopulation: 243247 },
};

// Accurate Tamil-script translations for real Tamil Nadu districts (bilingual UI focus of this app).
const TAMIL_NADU_DISTRICT_NAME_TA: Record<string, string> = {
  Thiruvallur: 'திருவள்ளூர்',
  Chennai: 'சென்னை',
  Kancheepuram: 'காஞ்சிபுரம்',
  Vellore: 'வேலூர்',
  Tiruvannamalai: 'திருவண்ணாமலை',
  Viluppuram: 'விழுப்புரம்',
  Salem: 'சேலம்',
  Namakkal: 'நாமக்கல்',
  Erode: 'ஈரோடு',
  'The Nilgiris': 'நீலகிரி',
  Dindigul: 'திண்டுக்கல்',
  Karur: 'கரூர்',
  Tiruchirappalli: 'திருச்சிராப்பள்ளி',
  Perambalur: 'பெரம்பலூர்',
  Ariyalur: 'அரியலூர்',
  Pudukkottai: 'புதுக்கோட்டை',
  Thanjavur: 'தஞ்சாவூர்',
  Nagapattinam: 'நாகப்பட்டினம்',
  Tiruvarur: 'திருவாரூர்',
  Ramanathapuram: 'இராமநாதபுரம்',
  Virudhunagar: 'விருதுநகர்',
  Madurai: 'மதுரை',
  Theni: 'தேனி',
  Sivaganga: 'சிவகங்கை',
  Tirunelveli: 'திருநெல்வேலி',
  Thoothukkudi: 'தூத்துக்குடி',
  Kanniyakumari: 'கன்னியாகுமரி',
  Coimbatore: 'கோயம்புத்தூர்',
  Tiruppur: 'திருப்பூர்',
  Krishnagiri: 'கிருஷ்ணகிரி',
  Dharmapuri: 'தர்மபுரி',
};

const DEMAND_TEMPLATES: { en: string; ta: string }[] = [
  { en: 'Rural drinking water pipeline coverage', ta: 'ஊரக குடிநீர்க் குழாய் வசதி பற்றாக்குறை' },
  { en: 'Rural and inter-district road connectivity', ta: 'ஊரக மற்றும் மாவட்டங்களுக்கிடையேயான சாலை இணைப்பு பற்றாக்குறை' },
  { en: 'Primary healthcare facility access', ta: 'ஆரம்ப சுகாதார நிலைய அணுகல் பற்றாக்குறை' },
  { en: 'Power feeder and distribution reliability', ta: 'மின் விநியோக நம்பகத்தன்மை பற்றாக்குறை' },
];

/** Deterministic string hash mapped into [min, max], used only to vary illustrative placeholder scores. */
function hashInRange(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return min + (hash % (max - min + 1));
}

function toCsvValue(value: string | number): string {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

interface DistrictKey {
  stateName: string;
  dtCode: string;
  districtName: string;
}

function collectDistrictsFromSource(): Map<string, DistrictKey> {
  const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.csv'));
  const districtsByDtCode = new Map<string, DistrictKey>();

  for (const file of files) {
    const content = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf-8');
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i].split(',').map((c) => c.trim());
      if (cells.length < 8) continue;

      const [, , stateName, dtCode, districtName, sdtCode, , townCode] = cells;
      const isDistrictHeaderRow = dtCode !== '0' && sdtCode === '0' && townCode === '0';
      if (isDistrictHeaderRow && !districtsByDtCode.has(dtCode)) {
        districtsByDtCode.set(dtCode, { stateName, dtCode, districtName });
      }
    }
  }

  return districtsByDtCode;
}

function buildDistrictRow(key: DistrictKey, perDistrictPopulation: number): DistrictRow {
  const info = STATE_INFO[key.stateName];
  const seed = `${key.stateName}-${key.districtName}`;
  const demand = DEMAND_TEMPLATES[hashInRange(seed + 'demand', 0, DEMAND_TEMPLATES.length - 1)];
  const name_ta =
    key.stateName === 'TAMIL NADU'
      ? TAMIL_NADU_DISTRICT_NAME_TA[key.districtName] ?? key.districtName
      : key.districtName;

  return {
    id: `IN-${key.dtCode}`,
    name: key.districtName,
    name_ta,
    population: perDistrictPopulation,
    water_deficit_score: hashInRange(seed + 'water', 15, 85),
    road_deficit_score: hashInRange(seed + 'road', 15, 85),
    health_deficit_score: hashInRange(seed + 'health', 15, 85),
    power_deficit_score: hashInRange(seed + 'power', 15, 85),
    overall_deficit_index: hashInRange(seed + 'overall', 20, 80),
    citizen_tickets_count: hashInRange(seed + 'tickets', 20, 300),
    planned_capex_crores: hashInRange(seed + 'planned', 40, 500),
    required_capex_crores: hashInRange(seed + 'required', 80, 700),
    alignment_mismatch_pct: hashInRange(seed + 'mismatch', 5, 65),
    lat: info.lat,
    lng: info.lng,
    top_unaddressed_demand: demand.en,
    top_unaddressed_demand_ta: demand.ta,
  };
}

function main(): void {
  const districtsByDtCode = collectDistrictsFromSource();

  const districtsByState = new Map<string, DistrictKey[]>();
  for (const key of districtsByDtCode.values()) {
    if (!STATE_INFO[key.stateName]) {
      console.warn(`Skipping unknown state "${key.stateName}" (no STATE_INFO entry)`);
      continue;
    }
    const list = districtsByState.get(key.stateName) ?? [];
    list.push(key);
    districtsByState.set(key.stateName, list);
  }

  const rows: DistrictRow[] = [];
  for (const [stateName, keys] of districtsByState) {
    const perDistrictPopulation = Math.round(STATE_INFO[stateName].approxPopulation / keys.length);
    for (const key of keys) {
      rows.push(buildDistrictRow(key, perDistrictPopulation));
    }
  }

  const csvLines = [CSV_HEADER.join(',')];
  for (const row of rows) {
    csvLines.push(CSV_HEADER.map((col) => toCsvValue(row[col])).join(','));
  }

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, csvLines.join('\n') + '\n', 'utf-8');
  console.log(`Wrote ${rows.length} districts across ${districtsByState.size} states/UTs to ${OUTPUT_FILE}`);
}

main();
