/**
 * Professional PDF Certificate Generator - OPTIMIZED for ALL DEVICES
 * Generates high-quality PDF certificates using jsPDF + html2canvas
 * Ensures full A4 landscape page utilization
 */

/**
 * Wait for all images in element to load
 * @param {HTMLElement} element - Element to check for images
 * @returns {Promise<void>}
 */
async function waitForImages(element) {
    const images = element.getElementsByTagName('img');
    const promises = [];

    for (let img of images) {
        if (!img.complete) {
            promises.push(
                new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve; // Resolve even on error to not block
                    if (img.src && !img.complete) {
                        const src = img.src;
                        img.src = '';
                        img.src = src;
                    }
                })
            );
        }
    }

    await Promise.all(promises);
    await new Promise(resolve => setTimeout(resolve, 200));
}

/**
 * NEW FIX: Converts image elements to Base64 data URIs.
 * This guarantees html2canvas will render them, bypassing any network/pathing issues.
 */
function convertImagesToBase64(element) {
    const images = element.getElementsByTagName('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    for (let img of images) {
        if (img.src.startsWith('data:')) continue;

        try {
            canvas.width = img.naturalWidth || img.width || 300;
            canvas.height = img.naturalHeight || img.height || 150;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Replace the src with raw base64 data
            img.src = canvas.toDataURL('image/png');

            // Strictly enforce dimensions on signatures so html2canvas doesn't collapse them
            if (img.classList.contains('cert-sign-img')) {
                img.style.width = '110px';
                img.style.height = '50px';
                img.style.display = 'block';
            }
        } catch (e) {
            console.warn('Could not convert image to base64:', img.src, e);
        }
    }
}

/**
 * Generate PDF from certificate HTML element - OPTIMIZED VERSION
 * @param {string} elementId - ID of the certificate element to convert
 * @param {string} filename - Desired filename for the PDF
 * @returns {Promise<void>}
 */
export async function generateCertificatePDF(elementId, filename) {
    let element = null;

    try {
        const { default: jsPDF } = await import('jspdf');
        const { default: html2canvas } = await import('html2canvas');

        element = document.getElementById(elementId);
        if (!element) throw new Error('Certificate element not found');

        const originalStyles = {
            display: element.style.display,
            position: element.style.position,
            left: element.style.left,
            top: element.style.top,
            opacity: element.style.opacity,
            visibility: element.style.visibility,
            transform: element.style.transform,
            width: element.style.width,
            height: element.style.height
        };

        element.style.display = 'block';
        element.style.position = 'fixed';
        element.style.left = '0';
        element.style.top = '0';
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        element.style.zIndex = '999999';
        element.style.transform = 'none';
        element.style.width = '1122px';
        element.style.height = '794px';

        // Wait for images to load
        await waitForImages(element);

        // --- APPLY BASE64 FIX ---
        convertImagesToBase64(element);

        await new Promise(resolve => setTimeout(resolve, 300));

        console.log('Starting PDF generation...');

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#FFFDF5',
            width: 1122,
            height: 794,
            windowWidth: 1122,
            windowHeight: 794,
            logging: false,
            imageTimeout: 15000,
            removeContainer: false,
            onclone: (clonedDoc) => {
                const clonedElement = clonedDoc.getElementById(elementId);
                if (clonedElement) {
                    clonedElement.style.display = 'block';
                    clonedElement.style.opacity = '1';
                    clonedElement.style.visibility = 'visible';
                    clonedElement.style.width = '1122px';
                    clonedElement.style.height = '794px';
                    clonedElement.style.position = 'relative';
                    clonedElement.style.transform = 'none';

                    const wrapper = clonedElement.querySelector('.certificate-wrapper');
                    if (wrapper) {
                        wrapper.style.transform = 'none';
                        wrapper.style.width = '1122px';
                        wrapper.style.height = '794px';
                        wrapper.style.margin = '0';
                    }
                }
            }
        });

        console.log(`Canvas captured: ${canvas.width}x${canvas.height}`);

        Object.keys(originalStyles).forEach(key => {
            element.style[key] = originalStyles[key];
        });

        if (canvas.width === 0 || canvas.height === 0) {
            throw new Error('Canvas is empty - certificate did not render');
        }

        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
            compress: true,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');

        console.log('PDF created successfully');
        pdf.save(filename);

        return { success: true };
    } catch (error) {
        console.error('PDF generation error:', error);
        if (element) {
            element.style.display = 'none';
            element.style.position = 'absolute';
            element.style.left = '-9999px';
        }
        throw new Error(`Failed to generate PDF: ${error.message}`);
    }
}

export function generatePDFFilename(data) {
    if (!data || !data.rollNo || !data.name) return 'Certificate.pdf';
    const cleanName = data.name.trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    return `Certificate_${data.rollNo}_${cleanName}.pdf`;
}
