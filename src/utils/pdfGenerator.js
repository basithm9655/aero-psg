/**
 * High-Precision Certificate Exporter (PDF & JPG) - DSDAEA PSG TECH
 * Produces 300 DPI high-fidelity A4 landscape output via jsPDF + html2canvas
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
                    img.onerror = resolve; // Continue even if an image fails
                    if (img.src && !img.complete) {
                        const src = img.src;
                        img.src = '';
                        img.src = src;
                    }
                })
            );
        } else if (img.decode) {
            promises.push(img.decode().catch(() => {}));
        }
    }

    await Promise.all(promises);

    if (document.fonts) {
        await document.fonts.ready;
        try {
            await Promise.all([
                document.fonts.load('800 40px "Cinzel"'),
                document.fonts.load('800 40px "Cinzel Decorative"'),
                document.fonts.load('400 68px "Pinyon Script"'),
                document.fonts.load('400 34px "Alex Brush"'),
                document.fonts.load('700 14px "Playfair Display"'),
                document.fonts.load('600 10px "Montserrat"')
            ]);
        } catch (e) {
            // Non-blocking fallback
        }
    }

    // Safety settling interval for canvas rasterizer
    await new Promise((resolve) => setTimeout(resolve, 400));
}

/**
 * Capture an element at exact 1122px x 794px with 2x resolution
 */
async function captureCertificateCanvas(elementId) {
    const { default: html2canvas } = await import('html2canvas');

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

    // Temporarily bring the element to top-left for flawless capture
    element.style.display = 'block';
    element.style.position = 'fixed';
    element.style.left = '0px';
    element.style.top = '0px';
    element.style.opacity = '1';
    element.style.visibility = 'visible';
    element.style.zIndex = '999999';
    element.style.width = '1122px';
    element.style.height = '794px';
    element.style.transform = 'none';

    try {
        await waitForImagesAndFonts(element);

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
            imageTimeout: 15000,
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
export async function generateCertificatePDF(elementId = 'certificate-print-zone', filename = 'Certificate.pdf') {
    const { default: jsPDF } = await import('jspdf');

    const canvas = await captureCertificateCanvas(elementId);

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas render was empty');
    }

    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
    pdf.save(filename);

    return { success: true };
}

/**
 * Generate and download high-resolution JPG certificate
 */
export async function generateCertificateJPG(elementId = 'certificate-print-zone', filename = 'Certificate.jpg') {
    const canvas = await captureCertificateCanvas(elementId);

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas render was empty');
    }

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Failed to create JPG blob from canvas'));
                return;
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            resolve({ success: true });
        }, 'image/jpeg', 0.96);
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
