import React from 'react';
import '../certificate.css';
import { formatCertificateName } from '../utils/certificateAPI';

/**
 * Regal Aerospace Certificate Template
 * Optimized for high-res 300 DPI A4 landscape export (1122px x 794px)
 * Designed for 100% rock-solid html2canvas and print fidelity.
 */
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
            {/* 1. Translucent Central Institutional Watermark */}
            <div className="cert-watermark-wrap">
                <img src="/collegelogo2.png" className="cert-watermark" alt="PSG Tech Crest" />
            </div>

            {/* 2. Classical Security Multi-Tiered Borders */}
            <div className="cert-border-outer"></div>
            <div className="cert-border-middle"></div>
            <div className="cert-border-inner"></div>

            {/* 3. Classical Corner Filigree Ornaments */}
            <div className="cert-corner tl"></div>
            <div className="cert-corner tr"></div>
            <div className="cert-corner bl"></div>
            <div className="cert-corner br"></div>

            {/* 4. Absolute Main Certificate Content Layout */}
            <div className="cert-layout">
                {/* Header: Dual Emblems & Institutional Typography */}
                <div className="cert-header">
                    <div className="cert-logo-box">
                        <img src="/collegelogo2.png" className="cert-logo-img" alt="PSG Tech Crest" />
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
                        <img src="/logo-removebg-preview.png" className="cert-logo-img" alt="DSDAEA Emblem" />
                    </div>
                </div>

                {/* Grand Certificate Title Banner & Distinction Badge */}
                <div className="cert-banner-section">
                    <div className="cert-main-heading">CERTIFICATE</div>
                    <div className="cert-badge-wrapper">
                        <div className={`cert-distinction-badge ${isParticipation ? 'badge-participation' : 'badge-merit'}`}>
                            ★ {badgeText} ★
                        </div>
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

                    <div className="cert-name-underline">
                        <span className="cert-line"></span>
                        <span className="cert-diamond">♦</span>
                        <span className="cert-line"></span>
                    </div>

                    <div className="cert-citation-details">
                        (Roll No: <b>{data.rollNo}</b>), a <b>{data.year || "4th"}</b> Year cadet of the Department of{' '}
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

                    {/* Central 3D Embossed Medallion Gold Seal */}
                    <div className="cert-seal-block">
                        <div className="cert-embossed-seal">
                            <div className="cert-seal-inner">
                                <div className="cert-seal-star">★</div>
                                <div className="cert-seal-label">DSDAEA<br />PSG TECH</div>
                            </div>
                        </div>
                        <div className="cert-seal-ribbons">
                            <div className="cert-ribbon-tail ribbon-left"></div>
                            <div className="cert-ribbon-tail ribbon-right"></div>
                        </div>
                    </div>

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
                    <span>ISSUED: MARCH 2026 • PSG TECH</span>
                </div>
            </div>
        </div>
    );
}
