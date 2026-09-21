import { fetchCertificateFromDb, getCadetByRoll } from '../firebase.js';

// Certificate verification helper functions

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
            return {
                ...cloudCert,
                place: formatRankTitle(cloudCert.place)
            };
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
                    `ATTENDANCE UNVERIFIED: Cadet ${cadet.name} (${cleanRoll}) is registered, but event attendance has not been verified by Mission Control. Certificates are only issued to cadets who attended.`
                );
            }

            // Student attended! Check rank (1st, 2nd, 3rd, or Participation)
            const rankText = formatRankTitle(cadet.place);

            return {
                name: cadet.name,
                rollNo: cleanRoll,
                phone: cadet.phone || '',
                year: cadet.year || '4th',
                dept: cadet.dept || 'Aerospace Engineering',
                place: rankText,
                event: cadet.event || 'FLIGHT & PROPULSION SYSTEMS WORKSHOP 2026'
            };
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
        const res = await fetch(`${SCRIPT_URL}?rollNo=${encodeURIComponent(cleanRoll)}`);
        if (res.ok) {
            const json = await res.json();
            if (json && json.success && json.data && json.data.name) {
                return {
                    name: json.data.name,
                    rollNo: json.data.rollNo || cleanRoll,
                    phone: json.data.phone || '',
                    year: json.data.year || '4th',
                    dept: json.data.dept || 'Aerospace Engineering',
                    place: formatRankTitle(json.data.place),
                    event: json.data.event || 'FLIGHT & PROPULSION SYSTEMS WORKSHOP 2026'
                };
            }
        }
    } catch (e) {
        // Fallback network error ignored
    }

    throw new Error(`Cadet ${cleanRoll} is not found in the verified event roster. Please ensure registration at the Cadet Entry Portal.`);
}
