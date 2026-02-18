import React from 'react';
import '../certificate.css';

/**
 * CertificateTemplate Component
 * Renders a premium certificate with student data
 * Supports browser print for PDF generation
 */
export default function CertificateTemplate({ data, eventTitle = "XYZ EVENT TITLE" }) {
    if (!data) return null;

    // Determine certificate type
    const isParticipation =
        !data.place || data.place.toLowerCase().includes('participated');

    const subtitle = isParticipation
        ? "OF PARTICIPATION"
        : "OF MERIT";

    let actionText = "actively <b>participated</b> in";

    if (!isParticipation) {
        const cleanPlace = data.place.replace(/Achieved |Winner - /gi, '');
        actionText = `secured <b style="color:var(--navy); border-bottom:1px solid var(--gold);">${cleanPlace}</b> in`;
    }

    return (
        <div className="certificate-wrapper">

            {/* Watermark */}
            <img
                src="/collegelogo2.png"
                className="cert-watermark"
                alt="Watermark"
            />

            {/* Frame */}
            <div className="cert-frame"></div>

            {/* Corners */}
            <div className="cert-corner tl"></div>
            <div className="cert-corner tr"></div>
            <div className="cert-corner bl"></div>
            <div className="cert-corner br"></div>

            <div className="cert-layout">

                {/* Header */}
                <div className="cert-header">
                    <img
                        src="/collegelogo2.png"
                        className="cert-logo"
                        alt="College Logo"
                    />

                    <div className="cert-inst-title">
                        <h1>
                            Dr. Satish Dhawan Aerospace<br />
                            Engineering Association
                        </h1>
                        <h2>PSG College of Technology</h2>
                    </div>

                    <img
                        src="/logo-removebg-preview.png"
                        className="cert-logo"
                        alt="Association Logo"
                    />
                </div>

                {/* Body */}
                <div className="cert-body">

                    <div className="cert-main-heading">Certificate</div>

                    <div className="cert-sub-heading">
                        {subtitle}
                    </div>

                    <div className="cert-text">
                        This is proudly presented to
                    </div>

                    <div className="cert-name">
                        {data.name}
                    </div>

                    <div className="cert-details">
                        (Roll No: <b>{data.rollNo}</b>), a <b>{data.year}</b> year student of the<br />
                        Department of <b>{data.dept}</b>,<br />
                        has <span dangerouslySetInnerHTML={{ __html: actionText }} /> the event
                    </div>

                    <div className="cert-event">
                        {eventTitle}
                    </div>

                    <div className="cert-organizer">
                        organized by <b>Dr. Satish Dhawan Aerospace Engineering Association</b>,<br />
                        PSG College of Technology
                    </div>

                </div>

                {/* Footer with Signatures */}
                <div className="cert-footer">

                    {/* Faculty Signature */}
                    <div className="cert-sig-box">
                        <img
                            src="/faculty-sign.png"
                            alt="Faculty Signature"
                            className="cert-sign-img"
                        />
                        <div className="cert-sig-line"></div>
                        <div className="cert-sig-role">Faculty Advisor</div>
                        <div className="cert-sig-subtitle">
                            Aerospace Association
                        </div>
                    </div>

                    {/* Seal */}
                    <div className="cert-seal-wrapper">
                        <div className="cert-seal">★</div>
                        <div className="cert-ribbon">EXCELLENCE</div>
                    </div>

                    {/* Secretary Signature */}
                    <div className="cert-sig-box">
                        <img
                            src="/secretary-sign.png"
                            alt="Secretary Signature"
                            className="cert-sign-img"
                        />
                        <div className="cert-sig-line"></div>
                        <div className="cert-sig-role">Chief Secretary</div>
                        <div className="cert-sig-subtitle">
                            Aerospace Association
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}