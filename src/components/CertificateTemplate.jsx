import React from 'react';
import '../certificate.css';
import { formatCertificateName, normaliseYearLabel } from '../utils/rollParser';

/**
 * Regal Aerospace Certificate Template
 * Optimized for high-res 300 DPI A4 landscape export (1122px x 794px)
 * Designed for 100% rock-solid html2canvas and print fidelity.
 */

/**
 * Classical Acanthus & Rosette Vector Corner Filigree
 * Resolution-independent SVG with genuine gold leaf gradients.
 */
function CornerOrnament({ className }) {
    return (
        <svg className={`cert-corner-svg ${className}`} viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="cornerGoldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff7d6" />
                    <stop offset="35%" stopColor="#f3cf55" />
                    <stop offset="70%" stopColor="#c59b27" />
                    <stop offset="100%" stopColor="#7a5509" />
                </linearGradient>
            </defs>

            {/* Corner Outer Bracket L-frame */}
            <path d="M 2 2 L 68 2 C 54 8 44 18 36 36 C 18 44 8 54 2 68 Z" fill="url(#cornerGoldFoil)" />
            <path d="M 5 5 L 60 5 C 48 10 38 20 30 38 C 20 38 10 48 5 60 Z" fill="#fffdf5" opacity="0.9" />

            {/* Classical Victorian Scroll Curves */}
            <path d="M 2 32 C 16 32 32 16 32 2" stroke="#c59b27" strokeWidth="1.5" fill="none" />
            <path d="M 2 48 C 24 48 48 24 48 2" stroke="#826012" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            <path d="M 2 64 C 32 64 64 32 64 2" stroke="#c59b27" strokeWidth="1.2" fill="none" />

            {/* Corner Faceted Diamond Rosette Jewel */}
            <polygon points="18,8 24,14 18,20 12,14" fill="url(#cornerGoldFoil)" stroke="#5e4104" strokeWidth="0.6" />
            <circle cx="18" cy="14" r="2.2" fill="#001F3F" />
            <circle cx="18" cy="14" r="0.9" fill="#ffffff" />

            {/* Delicate Accent Gold Beads */}
            <circle cx="48" cy="14" r="2" fill="#c59b27" />
            <circle cx="14" cy="48" r="2" fill="#c59b27" />
            <circle cx="36" cy="20" r="1.5" fill="#fadb6d" />
            <circle cx="20" cy="36" r="1.5" fill="#fadb6d" />

            {/* Terminal Fleur Acanthus Leaf Accents */}
            <path d="M 64 2 Q 74 2 76 6 Q 74 10 68 8 Z" fill="url(#cornerGoldFoil)" />
            <path d="M 2 64 Q 2 74 6 76 Q 10 74 8 68 Z" fill="url(#cornerGoldFoil)" />
        </svg>
    );
}

/**
 * Royal Calligraphic Name Flourish with Swan-neck curves & central star rosette
 */
function NameFlourish() {
    return (
        <svg className="cert-flourish-svg" viewBox="0 0 460 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Left flourish line with tapering gradient */}
            <path d="M 15 11 L 180 11" stroke="url(#flourishGradL)" strokeWidth="1.6" strokeLinecap="round" />
            {/* Left swan-neck calligraphic wave */}
            <path d="M 145 11 C 162 3, 178 19, 195 11 C 205 6, 215 9, 222 11" stroke="#b88c1b" strokeWidth="1.4" fill="none" />
            <circle cx="170" cy="7" r="1.8" fill="#c59b27" />
            
            {/* Center Heraldic Diamond Rosette */}
            <polygon points="230,2 238,11 230,20 222,11" fill="url(#flourishGold)" stroke="#684803" strokeWidth="1" />
            <circle cx="230" cy="11" r="2.5" fill="#ffffff" />
            <circle cx="230" cy="11" r="1.2" fill="#7a5509" />
            
            {/* Flanking accent beads */}
            <circle cx="216" cy="11" r="2" fill="#c59b27" />
            <circle cx="244" cy="11" r="2" fill="#c59b27" />
            
            {/* Right swan-neck calligraphic wave */}
            <path d="M 238 11 C 245 9, 255 6, 265 11 C 282 19, 298 3, 315 11" stroke="#b88c1b" strokeWidth="1.4" fill="none" />
            <circle cx="290" cy="7" r="1.8" fill="#c59b27" />
            {/* Right flourish line with tapering gradient */}
            <path d="M 280 11 L 445 11" stroke="url(#flourishGradR)" strokeWidth="1.6" strokeLinecap="round" />

            <defs>
                <linearGradient id="flourishGradL" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c59b27" stopOpacity="0" />
                    <stop offset="40%" stopColor="#c59b27" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#fadb6d" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="flourishGradR" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fadb6d" stopOpacity="1" />
                    <stop offset="60%" stopColor="#c59b27" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#c59b27" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="flourishGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff9e0" />
                    <stop offset="40%" stopColor="#f5d669" />
                    <stop offset="70%" stopColor="#c59b27" />
                    <stop offset="100%" stopColor="#6e4c04" />
                </linearGradient>
            </defs>
        </svg>
    );
}

/**
 * 36-Point Serrated 3D Gold Notary Seal with Swallowtail Ribbons
 * Authentic embossed gold wafer notary seal stamped onto master diplomas.
 */
function NotaryMedallionSeal() {
    return (
        <div className="cert-seal-block">
            <svg className="cert-seal-svg" viewBox="0 0 96 116" width="94" height="114" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="sealGoldFoil3D" cx="42%" cy="38%" r="60%">
                        <stop offset="0%" stopColor="#fffde6" />
                        <stop offset="25%" stopColor="#fae182" />
                        <stop offset="55%" stopColor="#d4af37" />
                        <stop offset="85%" stopColor="#9a7413" />
                        <stop offset="100%" stopColor="#543c04" />
                    </radialGradient>
                    <radialGradient id="sealCenterGold" cx="40%" cy="35%" r="55%">
                        <stop offset="0%" stopColor="#fff6c7" />
                        <stop offset="50%" stopColor="#e5be48" />
                        <stop offset="100%" stopColor="#85600c" />
                    </radialGradient>
                    <linearGradient id="ribbonNavyL" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#002244" />
                        <stop offset="100%" stopColor="#000e1c" />
                    </linearGradient>
                    <linearGradient id="ribbonNavyR" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#002b54" />
                        <stop offset="100%" stopColor="#001224" />
                    </linearGradient>
                </defs>

                {/* Left and Right Swallowtail Ribbon Tails */}
                <g className="cert-seal-ribbons-svg">
                    {/* Left Ribbon */}
                    <path
                        d="M 36 68 L 22 108 L 32 102 L 44 108 L 44 68 Z"
                        fill="url(#ribbonNavyL)"
                        stroke="#c59b27"
                        strokeWidth="0.8"
                    />
                    <path d="M 25 103 L 32 98 L 41 103" stroke="#fadb6d" strokeWidth="0.6" fill="none" opacity="0.8" />

                    {/* Right Ribbon */}
                    <path
                        d="M 52 68 L 52 108 L 64 102 L 74 108 L 60 68 Z"
                        fill="url(#ribbonNavyR)"
                        stroke="#c59b27"
                        strokeWidth="0.8"
                    />
                    <path d="M 55 103 L 64 98 L 71 103" stroke="#fadb6d" strokeWidth="0.6" fill="none" opacity="0.8" />
                </g>

                {/* 36-Point Serrated Notary Starburst Wafer */}
                <g className="cert-seal-wafer">
                    <polygon
                        points="48.0,2.0 51.7,6.2 56.0,2.7 58.9,7.4 63.7,4.8 65.7,9.9 71.0,8.2 72.1,13.6 77.6,12.8 77.7,18.3 83.2,18.4 82.4,23.9 87.8,25.0 86.1,30.3 91.2,32.3 88.6,37.1 93.3,40.0 89.8,44.3 94.0,48.0 89.8,51.7 93.3,56.0 88.6,58.9 91.2,63.7 86.1,65.7 87.8,71.0 82.4,72.1 83.2,77.6 77.7,77.7 77.6,83.2 72.1,82.4 71.0,87.8 65.7,86.1 63.7,91.2 58.9,88.6 56.0,93.3 51.7,89.8 48.0,94.0 44.3,89.8 40.0,93.3 37.1,88.6 32.3,91.2 30.3,86.1 25.0,87.8 23.9,82.4 18.4,83.2 18.3,77.7 12.8,77.6 13.6,72.1 8.2,71.0 9.9,65.7 4.8,63.7 7.4,58.9 2.7,56.0 6.2,51.7 2.0,48.0 6.2,44.3 2.7,40.0 7.4,37.1 4.8,32.3 9.9,30.3 8.2,25.0 13.6,23.9 12.8,18.4 18.3,18.3 18.4,12.8 23.9,13.6 25.0,8.2 30.3,9.9 32.3,4.8 37.1,7.4 40.0,2.7 44.3,6.2"
                        fill="url(#sealGoldFoil3D)"
                        stroke="#fff5be"
                        strokeWidth="0.8"
                    />

                    {/* Concentric Beaded Circle Rings */}
                    <circle cx="48" cy="48" r="39.5" stroke="#785305" strokeWidth="0.7" fill="none" />
                    <circle cx="48" cy="48" r="37.5" stroke="#fff1a8" strokeWidth="1.2" strokeDasharray="1.5 2.2" fill="none" opacity="0.9" />

                    {/* Inner Raised Medallion Core */}
                    <circle cx="48" cy="48" r="34.5" fill="url(#sealCenterGold)" stroke="#684703" strokeWidth="1" />
                    <circle cx="48" cy="48" r="32" stroke="#fff9d6" strokeWidth="0.7" fill="none" opacity="0.75" />

                    {/* Central Heraldic Aerospace Inscription */}
                    <text x="48" y="32" textAnchor="middle" fill="#331f01" fontSize="9" fontFamily="'Cinzel', serif" fontWeight="900">★</text>
                    <text x="48" y="44" textAnchor="middle" fill="#291801" fontSize="10" fontFamily="'Cinzel', serif" fontWeight="900" letterSpacing="1.2">DSDAEA</text>
                    <text x="48" y="52.5" textAnchor="middle" fill="#3b2403" fontSize="6.5" fontFamily="'Cinzel', serif" fontWeight="900" letterSpacing="0.8">PSG TECH</text>
                    <text x="48" y="60.5" textAnchor="middle" fill="#4d2f03" fontSize="6.2" fontFamily="'Montserrat', sans-serif" fontWeight="800" letterSpacing="1">2026</text>
                    <text x="48" y="68" textAnchor="middle" fill="#331f01" fontSize="6.2" letterSpacing="1.5">★★★★★</text>
                </g>
            </svg>
        </div>
    );
}

export default function CertificateTemplate({ data, eventTitle = "FLIGHT & PROPULSION SYSTEMS WORKSHOP 2026" }) {
    if (!data) return null;

    const isParticipation = !data.place || data.place.toLowerCase().includes('participat');
    const badgeText = isParticipation ? "OF PARTICIPATION" : "OF MERIT & EXCELLENCE";

    let citationText;
    if (!isParticipation) {
        const cleanPlace = data.place?.replace(/Achieved |Winner - /gi, '') || 'High Distinction';
        citationText = (
            <>
                has demonstrated exceptional technical acumen, visionary aerospace engineering, and secured{' '}
                <b className="cert-placement-highlight">{cleanPlace}</b> in
            </>
        );
    } else {
        citationText = (
            <>
                has actively participated with exemplary technical commitment and enthusiasm in
            </>
        );
    }

    const verificationHash = `DSDAEA-2026-${(data.rollNo || "CADET").toUpperCase()}-VERIFIED`;

    // Normalize academic year so "4th Year" doesn't produce duplicate "4th Year Year"
    const cadetYear = normaliseYearLabel(data.year) || "4th";

    // Format recipient name strictly in Title Case and compute dynamic responsive font size
    const formattedName = formatCertificateName(data.name);
    const nameLength = formattedName.length;

    // Adaptive typography scaling: guarantees single-line fit without text collision or line breaks
    let nameFontSize = '56px';
    if (nameLength > 36) {
        nameFontSize = '32px';
    } else if (nameLength > 30) {
        nameFontSize = '38px';
    } else if (nameLength > 24) {
        nameFontSize = '44px';
    } else if (nameLength > 18) {
        nameFontSize = '50px';
    } else {
        nameFontSize = '56px';
    }

    return (
        <div className="certificate-wrapper">
            {/* 1. High-Security Vector Guilloche Rosette Background Overlay */}
            <svg className="cert-guilloche-canvas" viewBox="0 0 1122 794" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="secRosettePattern" width="70" height="70" patternUnits="userSpaceOnUse">
                        <path d="M 0 35 Q 17.5 10 35 35 T 70 35" fill="none" stroke="rgba(197, 155, 39, 0.04)" strokeWidth="0.6" />
                        <path d="M 0 35 Q 17.5 60 35 35 T 70 35" fill="none" stroke="rgba(197, 155, 39, 0.04)" strokeWidth="0.6" />
                        <circle cx="35" cy="35" r="1.2" fill="rgba(197, 155, 39, 0.08)" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#secRosettePattern)" />
                <rect x="34" y="34" width="1054" height="726" fill="none" stroke="rgba(197, 155, 39, 0.18)" strokeWidth="0.7" strokeDasharray="6 3" />
                <circle cx="561" cy="397" r="280" fill="none" stroke="rgba(197, 155, 39, 0.05)" strokeWidth="0.8" />
                <circle cx="561" cy="397" r="240" fill="none" stroke="rgba(0, 31, 63, 0.03)" strokeWidth="0.6" strokeDasharray="8 4" />
            </svg>

            {/* 2. Translucent Central Institutional Watermark */}
            <div className="cert-watermark-wrap">
                <img src="/collegelogo2.png" className="cert-watermark" crossOrigin="anonymous" alt="PSG Tech Crest" />
            </div>

            {/* 3. Classical Security Multi-Tiered Borders */}
            <div className="cert-border-outer"></div>
            <div className="cert-border-middle"></div>
            <div className="cert-border-inner"></div>

            {/* 4. Ornate Vector Corner Filigrees (Resolution-independent SVG) */}
            <CornerOrnament className="tl" />
            <CornerOrnament className="tr" />
            <CornerOrnament className="bl" />
            <CornerOrnament className="br" />

            {/* 5. Main Certificate Content Layout */}
            <div className="cert-layout">
                {/* Header: Dual Emblems & Institutional Typography */}
                <div className="cert-header">
                    <div className="cert-logo-box">
                        <img src="/collegelogo2.png" className="cert-logo-img" crossOrigin="anonymous" alt="PSG Tech Crest" />
                    </div>
                    <div className="cert-header-text">
                        <h1 className="cert-college-name">PSG COLLEGE OF TECHNOLOGY</h1>
                        <p className="cert-college-tagline">
                            COIMBATORE • AUTONOMOUS INSTITUTION • AFFILIATED TO ANNA UNIVERSITY • ACCREDITED A++
                        </p>
                        <h2 className="cert-dept-name">
                            Dr. Satish Dhawan Aerospace Engineering Association
                        </h2>
                    </div>
                    <div className="cert-logo-box">
                        <img src="/logo-removebg-preview.png" className="cert-logo-img" crossOrigin="anonymous" alt="DSDAEA Emblem" />
                    </div>
                </div>

                {/* Classical Certificate Title & Distinction Badge */}
                <div className="cert-title-section">
                    <div className="cert-title-rule cert-title-rule-top">
                        <span className="cert-rule-line"></span>
                        <span className="cert-rule-diamond">◆</span>
                        <span className="cert-rule-line"></span>
                    </div>

                    <div className="cert-main-heading">
                        <span className="cert-heading-flank">✦</span>
                        <span>C E R T I F I C A T E</span>
                        <span className="cert-heading-flank">✦</span>
                    </div>

                    <div className="cert-badge-wrapper">
                        <div className={`cert-distinction-badge ${isParticipation ? 'badge-participation' : 'badge-merit'}`}>
                            ✦ {badgeText} ✦
                        </div>
                    </div>

                    <div className="cert-title-rule cert-title-rule-bottom">
                        <span className="cert-rule-line"></span>
                        <span className="cert-rule-diamond">◆</span>
                        <span className="cert-rule-line"></span>
                    </div>
                </div>

                {/* Body Citation & Recipient Student Credentials */}
                <div className="cert-body-section">
                    <p className="cert-conferral-note">This certificate of honor is proudly conferred upon</p>

                    <div
                        className="cert-recipient-name"
                        style={{
                            fontSize: nameFontSize,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {formattedName}
                    </div>

                    <div className="cert-flourish-wrap">
                        <NameFlourish />
                    </div>

                    <div className="cert-citation-details">
                        (Roll No: <b>{data.rollNo}</b>), a <b>{cadetYear}</b> Year cadet of the Department of{' '}
                        <b>{data.dept || "Aerospace Engineering"}</b>,<br />
                        {citationText}
                    </div>

                    <div className="cert-event-plate">
                        <span className="cert-event-title">{eventTitle}</span>
                    </div>

                    <div className="cert-organizer-note">
                        ORGANIZED BY DR. SATISH DHAWAN AEROSPACE ENGINEERING ASSOCIATION (DSDAEA) • PSG TECH
                    </div>
                </div>

                {/* Signatures & Central 3D Embossed Gold Medallion Seal */}
                <div className="cert-footer-section">
                    {/* Faculty Advisor */}
                    <div className="cert-sig-block">
                        <div className="cert-sig-img-container">
                            <img
                                src="/FAsign.png"
                                alt="Faculty Advisor Signature"
                                className="cert-sig-image"
                                crossOrigin="anonymous"
                            />
                        </div>
                        <div className="cert-sig-line"></div>
                        <div className="cert-sig-name">Dr. Vasanth Raj D</div>
                        <div className="cert-sig-desig">Assistant Professor (Sr. Gr.)</div>
                        <div className="cert-sig-title">FACULTY ADVISOR</div>
                    </div>

                    {/* Central 36-Point Serrated 3D Embossed Gold Notary Seal */}
                    <NotaryMedallionSeal />

                    {/* Secretary */}
                    <div className="cert-sig-block">
                        <div className="cert-sig-img-container">
                            <img
                                src="/secsign.png"
                                alt="Secretary Signature"
                                className="cert-sig-image"
                                crossOrigin="anonymous"
                            />
                        </div>
                        <div className="cert-sig-line"></div>
                        <div className="cert-sig-name">Mohammed Rahil</div>
                        <div className="cert-sig-desig">Secretary, DSDAEA</div>
                        <div className="cert-sig-title">EXECUTIVE COMMAND</div>
                    </div>
                </div>

                {/* Tamper-Evident Bottom Security Verification Bar */}
                <div className="cert-security-footer">
                    <span>OFFICIAL ACADEMIC CREDENTIAL // VERIFIED</span>
                    <span className="cert-hash-code">{verificationHash}</span>
                    <span>ISSUED: 2026 • PSG TECH</span>
                </div>
            </div>
        </div>
    );
}
