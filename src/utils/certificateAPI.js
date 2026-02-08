/**
 * Certificate API Integration
 * Handles fetching certificate data from Google Apps Script endpoint
 */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwiATQBGETzz6AGwQ9nHDrmLM2P09T7gySVf7JmFIZlRD94yWWskmrOvk5gm7pnIniO/exec';

/**
 * Fetch certificate data for a given roll number
 * @param {string} rollNo - Student roll number
 * @returns {Promise<Object>} Certificate data object
 * @throws {Error} If fetch fails or roll number not found
 */
export async function fetchCertificateData(rollNo) {
    if (!rollNo || typeof rollNo !== 'string') {
        throw new Error('Invalid roll number');
    }

    try {
        const response = await fetch(`${SCRIPT_URL}?rollNo=${encodeURIComponent(rollNo.trim())}`);

        if (!response.ok) {
            throw new Error(`Network error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Certificate not found');
        }

        // Validate response data structure
        if (!data.data || !data.data.name || !data.data.rollNo) {
            throw new Error('Invalid certificate data received');
        }

        return data.data;
    } catch (error) {
        if (error.message.includes('Certificate not found') || error.message.includes('Invalid certificate data')) {
            throw error;
        }
        throw new Error('Network error. Please check your connection and try again.');
    }
}
