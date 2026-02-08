// ============================================
// CONFIGURATION FILE - EASY CUSTOMIZATION
// ============================================
// Edit this file to quickly update all the key information across the website

export const CONFIG = {
    // Organization Details
    organization: {
        name: "DSDAEA",
        fullName: "Dr. Satish Dhawan Aerospace Engineering Association",
        tagline: "PSG_TECH_NODE",
        college: "PSG College of Technology",
        location: "Coimbatore, Tamil Nadu",
    },

    // Hero Section
    hero: {
        title: "AEROSPACE",
        subtitle: "Mk.IV",
        missionObjective: "Advanced Propulsion & Aerodynamics Division. PSG College of Technology. Recruiting Elite Cadets for upcoming orbital deployment.",
    },

    // Social Media Links
    social: {
        instagram: "https://www.instagram.com/aero_psg_tech/",
        linkedin: "https://www.linkedin.com/company/dr-satish-dhawan-aerospace-engineering-association-psg-tech/posts/?feedView=all",
    },

    // Developer Credits
    developer: {
        name: "BASI",
        link: "https://www.instagram.com/bazi.t_h/",
    },

    // Footer Description
    footer: {
        shortDesc: "🚀 Student-run Aerospace & Innovation Club. Open to all branches.",
        longDesc: "We bring together engineers, designers, and innovators passionate about aeronautics, propulsion, UAVs, rocketry, and simulation technologies. Through hands-on projects, technical workshops, competitions, and industry collaboration, we bridge the gap between theory and real-world aerospace applications. Our mission is to ignite curiosity, build competence, and launch future-ready engineers.",
    },

    // Google Form Integration (for registration)
    sound: {
        enabled: true, // Master toggle
        volume: 0.5,
    },
    googleForm: {
        enabled: true, // Set to false to disable form submission
        url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSc_R9SnfJLULefvQEar6xIjnKQPnG1EEUyUmMBOj2q3INnK6w/formResponse",
        entryIds: {
            rollNo: "entry.1980545502",
            name: "entry.1735108337",
            year: "entry.235212158",
            dept: "entry.1142478584",
            event: "entry.520065292",
        },
    },

    // Certificate Generator API
    certificate: {
        apiUrl: "https://script.google.com/macros/s/AKfycbwiATQBGETzz6AGwQ9nHDrmLM2P09T7gySVf7JmFIZlRD94yWWskmrOvk5gm7pnIniO/exec",
        enabled: true,
    },

    // Countdown Timer - EASY CUSTOMIZATION

    countdown: {
        // EDIT THIS: Set your target date and time (Format: "YYYY-MM-DDTHH:MM:SS")
        // Example: "2026-03-15T10:00:00" for March 15, 2026 at 10:00 AM
        targetDate: "2026-03-15T10:00:00",
        label: "IGNITION TIMER",
        description: "Next Launch Sequence",
    },
};
