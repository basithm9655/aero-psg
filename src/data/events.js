// ============================================
// EVENTS DATA - DSDAEA EVENT MANAGEMENT SYSTEM
// ============================================
// All demo events are stored in events.json.
// Real event data entered in the Admin Panel or Firebase Firestore
// seamlessly supplements or overrides this baseline.

import rawEvents from './events.json';

// Normalize events so dates and statuses are ready for display
export const EVENTS_DATA = rawEvents.map(event => ({
    ...event,
    eventDate: event.eventDate ? new Date(event.eventDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
}));

// ========== HELPER FUNCTIONS ==========

export const getLiveEvent = () => {
    return EVENTS_DATA.find(event => event.isLive === true) || EVENTS_DATA[0];
};

export const getEventsByStatus = (status) => {
    return EVENTS_DATA.filter(event => event.status === status);
};

export const getEventsByCategory = (category) => {
    if (!category || category === 'all') return EVENTS_DATA;
    return EVENTS_DATA.filter(event => event.category === category);
};

export const getAllMissions = () => {
    return EVENTS_DATA;
};
