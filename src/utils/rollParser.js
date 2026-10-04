/**
 * PSG Tech Roll Number Parser
 * Shared by the Registration Portal and the Certificate Vault so that the
 * academic year and department shown on a certificate always match the
 * values derived during registration.
 *
 * Roll format: <2-digit batch><dept letters><serial>   e.g. 23M116, 25Z201
 */

export const DEPT_MAPPING = {
    'A': 'Automobile Engineering',
    'D': 'Biomedical Engineering',
    'C': 'Civil Engineering',
    'Z': 'Computer Science & Engineering',
    'N': 'Computer Science (AI & ML)',
    'E': 'Electrical & Electronics',
    'L': 'Electronics & Communication',
    'U': 'Instrumentation & Control',
    'M': 'Mechanical Engineering',
    'Y': 'Metallurgical Engineering',
    'P': 'Production Engineering',
    'R': 'Robotics & Automation',
    'B': 'Biotechnology',
    'I': 'Information Technology',
    'T': 'Textile Technology',
    'F': 'Fashion Technology',
    'G': 'Apparel Technology',
    'S': 'Mechanical (Sandwich)',
    'AM': 'Applied Mathematics',
    'CS': 'Computer Systems & Design',
    'SS': 'Software Systems',
    'CY': 'Cyber Security',
    'DA': 'Data Science',
    'AE': 'Aerospace Engineering'
};

// Integrated 5-year programmes
const FIVE_YEAR_CODES = new Set(['AM', 'CS', 'SS', 'CY', 'DA', 'S']);
const BTECH_CODES = new Set(['B', 'I', 'H', 'T', 'F', 'G']);

export function ordinalYear(n) {
    const suffix = n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';
    return `${n}${suffix} Year`;
}

/**
 * Academic year of study based on joining batch.
 * The academic session at PSG Tech begins around June, so a 2025 batch student
 * is in 2nd year from June 2026 until May 2027.
 */
export function computeYearOfStudy(batch, code = '', now = new Date()) {
    if (isNaN(batch)) return null;
    const joinYear = 2000 + batch;
    const sessionOffset = now.getMonth() >= 5 ? 1 : 0; // June = 5
    const raw = now.getFullYear() - joinYear + sessionOffset;
    const maxYear = FIVE_YEAR_CODES.has(code) ? 5 : 4;
    return Math.max(1, Math.min(maxYear, raw));
}

export function parseRollNumber(rollInput) {
    const r = String(rollInput || '').trim().toUpperCase();
    if (r.length < 3) return null;

    const batch = parseInt(r.substring(0, 2), 10);
    const match = r.match(/^[0-9]+([A-Z]+)[0-9]*/);
    const code = match ? match[1] : '';

    const yearNum = computeYearOfStudy(batch, code);
    const year = yearNum ? ordinalYear(yearNum) : 'Unknown';

    const isDeptDetected = Boolean(code && DEPT_MAPPING[code]);
    const dept = isDeptDetected ? DEPT_MAPPING[code] : '';
    const degree = BTECH_CODES.has(code) ? 'B.Tech' : 'B.E.';

    return { year, yearNum, dept, isDeptDetected, degree, code };
}

/**
 * Normalise any stored year value ("4th Year", "4th", "4", "IV") to "4th".
 */
export function normaliseYearLabel(value) {
    if (value === undefined || value === null) return '';
    const s = String(value).trim();
    if (!s || /unknown/i.test(s)) return '';
    const roman = { I: 1, II: 2, III: 3, IV: 4, V: 5 };
    const cleaned = s.replace(/\s*year\s*/gi, '').trim().toUpperCase();
    if (roman[cleaned]) return ordinalYear(roman[cleaned]).replace(' Year', '');
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num >= 1 && num <= 5) return ordinalYear(num).replace(' Year', '');
    return s.replace(/\s*year\s*/gi, '').trim();
}

/**
 * Format student name for certificate display:
 * Capitalizes the first letter of each word (Title Case) and preserves initials.
 */
export function formatCertificateName(name) {
    if (!name || typeof name !== 'string') return "Aerospace Cadet";
    const trimmed = name.trim();
    if (!trimmed) return "Aerospace Cadet";

    return trimmed
        .split(/\s+/)
        .map(word => {
            if (word.includes('.')) {
                return word
                    .split('.')
                    .map(part => {
                        if (!part) return '';
                        if (part.length === 1) return part.toUpperCase();
                        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
                    })
                    .join('.');
            }
            if (word.length === 1) return word.toUpperCase();
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
}

