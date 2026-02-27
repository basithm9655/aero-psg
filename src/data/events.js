// ============================================
// EVENTS DATA - EVENT MANAGEMENT SYSTEM
// ============================================
// Manage all your events here: past, present (live), and upcoming
//
// HOW TO USE:
// 1. Set ONE event as "isLive: true" - this shows in the hero section with countdown
// 2. Other events set "status": "upcoming" or "past"
// 3. Fill in hall details, time, venue for easy management

export const EVENTS_DATA = [
    // ========== LIVE EVENT (Shows in Hero with Countdown) ==========
    {
        id: 1,
        title: "AeroQuest 2026",
        type: "TECHNICAL COMPETITION",
        status: "live",        // live, upcoming, or past
        isLive: true,          // ONLY ONE EVENT should have this true!

        // EVENT TIMING
        date: "MAR 02, 2026",
        time: "Full Day Event",
        eventDate: new Date('2026-03-02T09:00:00'), // Prelims start

        // VENUE DETAILS
        venue: "G-Block, Room 401",
        hall: "Room 401",
        building: "G-Block",

        // DESCRIPTIONS
        details: "AeroQuest - Where Curiosity Takes Flight. Two-day aerospace competition with MCQ Screening and GD (MAR 02) and Interview (MAR 03, 2026). Test your aerospace knowledge!",

        // REGISTRATION
        registrationLink: "https://forms.gle/your-link", // Your Google Form link
        registrationEnabled: true,
        capacity: 50,

        // ADDITIONAL INFO
        tagline: "Where Curiosity Takes Flight",
        rounds: MCQ | Finals: Group Discussion and Interview ",
        contact: "Rahil - 7305457530 | Vasim - 6379737578",
        instagram: "@aero_psg_tech",

        // CERTIFICATE
        certificateTitle: "AEROQUEST 2026",

        image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800",
        phase: "LIVE"
    },

    // ========== UPCOMING EVENTS ==========
    {
        id: 2,
        title: "Propulsion Seminar",
        type: "GUEST LECTURE",
        status: "upcoming",
        isLive: false,

        date: "APR 02, 2026",
        time: "2:00 PM - 4:00 PM",
        eventDate: new Date('2026-04-02T14:00:00'),

        venue: "Lecture Theatre",
        hall: "Block 3, LT-201",
        building: "Main Academic Block",

        details: "Expert session on cryogenic rocket engines and advanced propulsion systems with ISRO scientist.",

        registrationLink: "",
        registrationEnabled: false,

        speaker: "Guest: ISRO Senior Scientist",

        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        phase: "UPCOMING"
    },

    {
        id: 3,
        title: "UAV Design Challenge",
        type: "COMPETITION",
        status: "upcoming",
        isLive: false,

        date: "MAY 20, 2026",
        time: "9:00 AM - 5:00 PM",
        eventDate: new Date('2026-05-20T09:00:00'),

        venue: "Open Ground",
        hall: "Sports Complex",
        building: "Main Campus",

        details: "Build and fly your own UAV in this exciting competition. Teams compete for cash prizes and certificates.",

        registrationLink: "",
        registrationEnabled: false,
        prizes: "₹50,000 Prize Pool",

        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
        phase: "UPCOMING"
    },

    // ========== PAST EVENTS (Completed) ==========
    {
        id: 4,
        title: "Water Rocketry Competition",
        type: "COMPETITION",
        status: "past",
        isLive: false,

        date: "FEB 10, 2026",
        time: "9:00 AM - 12:00 PM",
        eventDate: new Date('2026-02-10T09:00:00'),

        venue: "Launch Pad B",
        hall: "Outdoor Arena",
        building: "Sports Ground",

        details: "High-pressure water rocket competition with max apogee target of 150m. Successfully completed with 35 participants.",

        registrationEnabled: false,
        participants: 35,
        winner: "Team Velocity - 148m",

        image: "https://images.unsplash.com/photo-1614728853913-1e32005e307b?auto=format&fit=crop&q=80&w=800",
        phase: "COMPLETED"
    },

    {
        id: 5,
        title: "Satellite Systems Workshop",
        type: "TECHNICAL SESSION",
        status: "past",
        isLive: false,

        date: "JAN 15, 2026",
        time: "10:00 AM - 3:00 PM",
        eventDate: new Date('2026-01-15T10:00:00'),

        venue: "Computer Lab",
        hall: "Block 4, CL-205",
        building: "Engineering Block",

        details: "Workshop on satellite communication and orbital mechanics. Covered subsystems, protocols, and mission planning.",

        registrationEnabled: false,
        participants: 45,

        image: "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?auto=format&fit=crop&q=80&w=800",
        phase: "COMPLETED"
    }
];

// ========== HELPER FUNCTIONS (Don't edit) ==========

// Get the current live event for hero section
export const getLiveEvent = () => {
    return EVENTS_DATA.find(event => event.isLive === true) || EVENTS_DATA[0];
};

// Get events by status
export const getEventsByStatus = (status) => {
    return EVENTS_DATA.filter(event => event.status === status);
};

// Get all events for missions section
export const getAllMissions = () => {
    return EVENTS_DATA;
};
