/**
 * High-Precision Certificate Exporter (PDF & JPG) - DSDAEA PSG TECH
 * Produces 300 DPI high-fidelity A4 landscape output via jsPDF + html2canvas
 * Optimized for lightning-fast mobile generation with zero-flash rendering.
 */

/**
 * Wait for all images inside an element to be completely loaded and decoded,
 * and ensure Google Web Fonts are ready for canvas rendering.
 */
async function waitForImagesAndFonts(element) {
    const images = element.getElementsByTagName('img');
    const promises = [];

    for (let img of images) {
        if (!img.complete) {
            promises.push(
                new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve; // Non-blocking: continue even if an image fails
                })
            );
        } else if (img.decode) {
            promises.push(img.decode().catch(() => {}));
        }
    }

    // Safety timeout: max 1200ms for images to avoid freezing mobile generation
    const imgTimeout = new Promise((resolve) => setTimeout(resolve, 1200));
    await Promise.race([Promise.all(promises), imgTimeout]);

    if (document.fonts) {
        try {
            await Promise.race([
                Promise.all([
                    document.fonts.load('800 40px "Cinzel"'),
                    document.fonts.load('800 40px "Cinzel Decorative"'),
                    document.fonts.load('400 40px "Pinyon Script"'),
                    document.fonts.load('700 14px "Playfair Display"'),
                    document.fonts.load('600 10px "Montserrat"')
                ]),
                new Promise((resolve) => setTimeout(resolve, 600))
            ]);
        } catch (e) {
            // Non-blocking fallback
        }
    }

    // Ultra-short layout stabilization pause
    await new Promise((resolve) => setTimeout(resolve, 80));
}

/**
 * Capture an element at exact 1122px x 794px with 2x resolution (2244x1588px)
 */
async function captureCertificateCanvas(elementId, onProgress) {
    if (onProgress) onProgress(20);
    const { default: html2canvas } = await import('html2canvas');
    if (onProgress) onProgress(35);

    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Certificate element #${elementId} not found.`);
    }

    // Save initial style values
    const prevStyles = {
        display: element.style.display,
        position: element.style.position,
        left: element.style.left,
        top: element.style.top,
        opacity: element.style.opacity,
        visibility: element.style.visibility,
        zIndex: element.style.zIndex,
        width: element.style.width,
        height: element.style.height,
        transform: element.style.transform,
    };

    // Position behind the full-screen loading HUD (z-index 1000000) so no visual flashing occurs
    element.style.display = 'block';
    element.style.position = 'fixed';
    element.style.left = '0px';
    element.style.top = '0px';
    element.style.opacity = '1';
    element.style.visibility = 'visible';
    element.style.zIndex = '99999';
    element.style.width = '1122px';
    element.style.height = '794px';
    element.style.transform = 'none';

    try {
        await waitForImagesAndFonts(element);
        if (onProgress) onProgress(50);

        const canvas = await html2canvas(element, {
            scale: 2, // 2x scale: 2244px x 1588px (300 DPI equivalent)
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#FFFDF8',
            width: 1122,
            height: 794,
            windowWidth: 1122,
            windowHeight: 794,
            x: 0,
            y: 0,
            scrollX: 0,
            scrollY: 0,
            logging: false,
            imageTimeout: 8000,
            onclone: (clonedDoc) => {
                const clonedElement = clonedDoc.getElementById(elementId);
                if (clonedElement) {
                    clonedElement.style.display = 'block';
                    clonedElement.style.position = 'absolute';
                    clonedElement.style.left = '0px';
                    clonedElement.style.top = '0px';
                    clonedElement.style.width = '1122px';
                    clonedElement.style.height = '794px';
                    clonedElement.style.transform = 'none';
                    clonedElement.style.opacity = '1';
                    clonedElement.style.visibility = 'visible';
                }
            },
        });

        if (onProgress) onProgress(80);
        return canvas;
    } finally {
        // Always restore original styles
        Object.keys(prevStyles).forEach((key) => {
            element.style[key] = prevStyles[key];
        });
    }
}

/**
 * Generate and download high-resolution PDF certificate
 */
export async function generateCertificatePDF(elementId = 'certificate-print-zone', filename = 'Certificate.pdf', onProgress) {
    if (onProgress) onProgress(10);
    const { default: jsPDF } = await import('jspdf');

    const canvas = await captureCertificateCanvas(elementId, onProgress);

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas render was empty');
    }

    if (onProgress) onProgress(88);

    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
    
    if (onProgress) onProgress(96);
    pdf.save(filename);
    if (onProgress) onProgress(100);

    return { success: true };
}

/**
 * Generate and download high-resolution JPG certificate
 */
export async function generateCertificateJPG(elementId = 'certificate-print-zone', filename = 'Certificate.jpg', onProgress) {
    if (onProgress) onProgress(10);
    const canvas = await captureCertificateCanvas(elementId, onProgress);

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas render was empty');
    }

    if (onProgress) onProgress(88);

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Failed to create JPG blob from canvas'));
                return;
            }
            if (onProgress) onProgress(95);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 5000);
            if (onProgress) onProgress(100);
            resolve({ success: true });
        }, 'image/jpeg', 0.95);
    });
}

/**
 * Generate standard clean filename for certificate
 */
export function generatePDFFilename(data, ext = 'pdf') {
    if (!data || !data.rollNo || !data.name) {
        return `Certificate.${ext}`;
    }
    const cleanName = data.name
        .trim()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_');
    return `Certificate_${data.rollNo}_${cleanName}.${ext}`;
}
