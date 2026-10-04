import { fetchCertificateFromDb, getCadetByRoll } from '../firebase.js';
import { parseRollNumber, normaliseYearLabel, formatCertificateName } from './rollParser.js';
import { EVENTS_DATA } from '../data/events.js';

export { formatCertificateName };

const LEGACY_EVENT_TITLE = 'FLIGHT & PROPULSION SYSTEMS WORKSHOP 2026';

/**
 * Helper to normalize award / rank title
 */
export function formatRankTitle(place) {
    const p = String(place || '').trim();
    if (p === '1') return 'Winner - 1st Rank';
    if (p === '2') return 'Achieved 2nd Place';
    if (p === '3') return 'Achieved 3rd Place';
    if (p.toLowerCase().includes('1st') || p.toLowerCase().includes('winner') || p.toLowerCase().includes('rank 1')) {
        return 'Winner - 1st Rank';
    }
    if (p.toLowerCase().includes('2nd') || p.toLowerCase().includes('runner') || p.toLowerCase().includes('rank 2')) {
        return 'Achieved 2nd Place';
    }
    if (p.toLowerCase().includes('3rd') || p.toLowerCase().includes('rank 3')) {
        return 'Achieved 3rd Place';
    }
    return 'Certificate of Participation';
}

/**
 * Resolve the correct event title for a cadet record.
 * New registrations store `event` explicitly. Older records (created before the
 * field existed) are matched to the event they registered for using the
 * registration timestamp: the first certificate-bearing event that took place
 * on/after the registration date.
 */
export function resolveEventTitle(record) {
    if (record && typeof record.event === 'string' && record.event.trim()) {
        return record.event.trim();
    }
    const registeredAt = record?.registeredAt ? new Date(record.registeredAt) : null;
    if (!registeredAt || isNaN(registeredAt.getTime())) return LEGACY_EVENT_TITLE;

    const candidates = EVENTS_DATA
        .filter(e => e.certificateTitle && (e.isLive || e.status === 'completed' || e.status === 'live'))
        .sort((a, b) => a.eventDate - b.eventDate);

    const ONE_DAY = 24 * 60 * 60 * 1000;
    const match = candidates.find(e => e.eventDate.getTime() + ONE_DAY >= registeredAt.getTime());
    return (match || candidates[candidates.length - 1])?.certificateTitle || LEGACY_EVENT_TITLE;
}

/**
 * Build a clean, fully-verified certificate payload.
 * Year and department fall back to values parsed from the roll number
 * (never to a hard-coded default) so every printed detail is accurate.
 */
function buildCertificatePayload(source, cleanRoll, placeOverride) {
    const parsed = parseRollNumber(cleanRoll);
    const year = normaliseYearLabel(source.year) || normaliseYearLabel(parsed?.year) || '';
    const dept = (source.dept && String(source.dept).trim()) || parsed?.dept || '';
    return {
        name: formatCertificateName(source.name),
        rollNo: (source.rollNo || source.roll || cleanRoll).toString().trim().toUpperCase(),
        phone: source.phone || '',
        year,
        dept,
        place: placeOverride !== undefined ? placeOverride : formatRankTitle(source.place),
        event: resolveEventTitle(source)
    };
}

/**
 * Fetch certificate data for a given roll number
 * Rules:
 * 1. Must be registered in system.
 * 2. Must be marked PRESENT by admin (attendance == '1').
 * 3. If rank 1, 2, 3 assigned -> Certificate with Rank.
 * 4. Otherwise -> Certificate of Participation.
 * 
 * @param {string} rollNo - Student roll number
 * @returns {Promise<Object>} Certificate data object
 * @throws {Error} If not registered or attendance not verified
 */
export async function fetchCertificateData(rollNo) {
    if (!rollNo || typeof rollNo !== 'string') {
        throw new Error('Please enter a valid roll number.');
    }

    const cleanRoll = rollNo.trim().toUpperCase();

    // 1. Check direct Certificate database records (issued credentials)
    try {
        const cloudCert = await fetchCertificateFromDb(cleanRoll);
        if (cloudCert && cloudCert.name && cloudCert.rollNo) {
            return buildCertificatePayload(cloudCert, cleanRoll);
        }
    } catch (e) {
        console.warn("Direct certificate DB check issue:", e.message);
    }

    // 2. Check Cadet Registration & Attendance Database
    try {
        const cadet = await getCadetByRoll(cleanRoll);
        if (cadet) {
            const isPresent = String(cadet.attendance) === '1';
            
            // If student registered but admin has NOT marked attendance:
            if (!isPresent) {
                throw new Error(
                    `ATTENDANCE UNVERIFIED: Cadet ${formatCertificateName(cadet.name)} (${cleanRoll}) is registered, but event attendance has not been verified by Mission Control. Certificates are only issued to cadets who attended.`
                );
            }

            // Student attended! Rank (1st, 2nd, 3rd) or Participation is resolved in the payload
            return buildCertificatePayload(cadet, cleanRoll);
        }
    } catch (err) {
        // If it's the attendance unverified error, rethrow directly
        if (err.message && err.message.includes('ATTENDANCE UNVERIFIED')) {
            throw err;
        }
        console.warn("Cadet attendance check error:", err.message);
    }

    // 3. Check Google Apps Script / Sheet Archive Endpoint
    try {
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxAkDBvojbxbRul99ETqa_7nk3Z9K8szZo_YLVMXIjcr-AoP-rQO3DAEtzcXfFiZa_g/exec';
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), 9000) : null;
        const res = await fetch(`${SCRIPT_URL}?rollNo=${encodeURIComponent(cleanRoll)}`, controller ? { signal: controller.signal } : undefined);
        if (timer) clearTimeout(timer);
        if (res.ok) {
            const json = await res.json();
            if (json && json.success && json.data && json.data.name) {
                return buildCertificatePayload({ ...json.data, rollNo: json.data.rollNo || cleanRoll }, cleanRoll);
            }
        }
    } catch (e) {
        // Fallback network error ignored
    }

    throw new Error(`Cadet ${cleanRoll} is not found in the verified event roster. Please ensure registration at the Cadet Entry Portal.`);
}
