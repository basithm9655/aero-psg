# DSDAEA Aerospace Web Application

A cinematic, sci-fi themed web application for the Dr. Satish Dhawan Aerospace Engineering Association at PSG College of Technology.

## Features

- 🚀 **Cinematic Intro Sequence** - Boot-up animation with biometric gate
- ⭐ **Parallax Starfield** - Mouse-interactive background with warp speed effects
- 🎯 **Mission Hub** - Display and manage aerospace events
- 👥 **Crew Roster** - Team member showcase with clearance levels
- 📜 **Certificate Vault** - Digital certificate verification system
- 📝 **Smart Registration** - Roll number parsing with department detection
- 🔊 **Procedural Audio** - Web Audio API sound effects
- 📱 **Fully Responsive** - Optimized for all screen sizes

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application will open at `http://localhost:3000`

## Easy Customization

All key information can be easily updated in **`src/config.js`**:

### Organization Details
```javascript
organization: {
  name: "DSDAEA",
  fullName: "Dr. Satish Dhawan Aerospace Engineering Association",
  tagline: "PSG_TECH_NODE",
  college: "PSG College of Technology",
}
```

### Social Media Links
```javascript
social: {
  instagram: "https://www.instagram.com/aero_psg_tech/",
  linkedin: "https://www.linkedin.com/...",
}
```

### Event Data
Edit **`src/data/events.js`** to add/modify missions and events.

### Team Members
Edit **`src/data/team.js`** to update crew roster.

### Google Form Integration
Update `src/config.js` with your Google Form details:
```javascript
googleForm: {
  enabled: true,
  url: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse",
  entryIds: {
    name: "entry.123456",
    rollNumber: "entry.789012",
  },
}
```

## Technologies

- **React** 18.2.0
- **Vite** 5.0.8
- **Tailwind CSS** 3.3.6
- **Lucide React** (Icons)
- **Web Audio API** (Sound effects)

## Project Structure

```
src/
├── App.jsx              # Main application component
├── main.jsx             # React entry point
├── index.css            # Global styles + Tailwind
├── config.js            # 🎯 Easy customization file
├── data/
│   ├── events.js        # Event/mission data
│   └── team.js          # Team member data
└── utils/
    └── soundEngine.js   # Procedural audio system
```

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

## License

© 2026 DSDAEA - All Rights Reserved

---

**Developed by:** [BASI](https://www.instagram.com/bazi.t_h/)
