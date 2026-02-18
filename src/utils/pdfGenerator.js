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
                    // Force reload if src is set but not loaded
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
    // Extra delay to ensure images are painted
    await new Promise(resolve => setTimeout(resolve, 200));
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
        // Dynamically import libraries
        const { default: jsPDF } = await import('jspdf');
        const { default: html2canvas } = await import('html2canvas');

        // Get the certificate element
        element = document.getElementById(elementId);
        if (!element) {
            throw new Error('Certificate element not found');
        }

        // CRITICAL: Make element visible and properly positioned
        // Save original styles
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

        // Position element for capture - VISIBLE but off-screen
        element.style.display = 'block';
        element.style.position = 'fixed';
        element.style.left = '0';
        element.style.top = '0';
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        element.style.zIndex = '999999';
        element.style.transform = 'none';

        // Force exact A4 landscape dimensions (in pixels at 96 DPI)
        // A4 landscape: 297mm x 210mm = 1122px x 794px at 96 DPI
        element.style.width = '1122px';
        element.style.height = '794px';

        // Wait for images to load
        await waitForImages(element);

        // Additional delay for full rendering
        await new Promise(resolve => setTimeout(resolve, 300));

        console.log('Starting PDF generation...');

        // Capture with html2canvas - OPTIMIZED SETTINGS
        const canvas = await html2canvas(element, {
            scale: 2, // 2x scale for quality without huge file size
            useCORS: true, // Enable cross-origin images
            allowTaint: true, // Allow local images
            backgroundColor: '#FFFDF5', // Certificate cream background
            width: 1122, // A4 landscape width
            height: 794, // A4 landscape height
            windowWidth: 1122,
            windowHeight: 794,
            logging: false,
            imageTimeout: 15000,
            removeContainer: false,
            onclone: (clonedDoc) => {
                // Ensure cloned element maintains dimensions and visibility
                const clonedElement = clonedDoc.getElementById(elementId);
                if (clonedElement) {
                    clonedElement.style.display = 'block';
                    clonedElement.style.opacity = '1';
                    clonedElement.style.visibility = 'visible';
                    clonedElement.style.width = '1122px';
                    clonedElement.style.height = '794px';
                    clonedElement.style.position = 'relative';
                    clonedElement.style.transform = 'none';

                    // Remove any transforms from nested elements
                    const wrapper = clonedElement.querySelector('.certificate-wrapper');
                    if (wrapper) {
                        wrapper.style.transform = 'none';
                        wrapper.style.width = '1122px';
                        wrapper.style.height = '794px';
                        wrapper.style.margin = '0';
                    }

                    // Ensure ALL images (logos + signatures) are visible
                    const imgs = clonedElement.querySelectorAll('img');
                    imgs.forEach(img => {
                        img.style.display = 'block';
                        img.style.visibility = 'visible';
                        img.style.opacity = '1';
                    });
                }
            }
        });

        console.log(`Canvas captured: ${canvas.width}x${canvas.height}`);

        // Restore original styles
        Object.keys(originalStyles).forEach(key => {
            element.style[key] = originalStyles[key];
        });

        // Verify canvas has content
        if (canvas.width === 0 || canvas.height === 0) {
            throw new Error('Canvas is empty - certificate did not render');
        }

        // Create PDF with A4 landscape orientation
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
            compress: true,
        });

        // A4 landscape dimensions in mm
        const pdfWidth = 297;
        const pdfHeight = 210;

        // Convert canvas to high-quality image
        const imgData = canvas.toDataURL('image/png');

        // Add image to PDF - FULL PAGE, no margins
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'SLOW');

        console.log('PDF created successfully');

        // Download the PDF
        pdf.save(filename);

        return { success: true };
    } catch (error) {
        console.error('PDF generation error:', error);

        // Restore element if error occurred
        if (element) {
            element.style.display = 'none';
            element.style.position = 'absolute';
            element.style.left = '-9999px';
            element.style.top = '-9999px';
            element.style.opacity = '0';
            element.style.visibility = '';
            element.style.zIndex = '';
            element.style.transform = '';
            element.style.width = '1122px';
            element.style.height = '794px';
        }

        throw new Error(`Failed to generate PDF: ${error.message}`);
    }
}

/**
 * Generate PDF filename from certificate data
 * @param {Object} data - Certificate data
 * @returns {string} Formatted filename
 */
export function generatePDFFilename(data) {
    if (!data || !data.rollNo || !data.name) {
        return 'Certificate.pdf';
    }

    // Clean the name (remove special characters, replace spaces with underscores)
    const cleanName = data.name
        .trim()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_');

    return `Certificate_${data.rollNo}_${cleanName}.pdf`;
}
