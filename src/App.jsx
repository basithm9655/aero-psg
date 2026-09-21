import React, { useState, useEffect, useRef, useMemo } from 'react';
import './visual-effects.css';
import './certificate.css';
import {
    Rocket, Calendar, ChevronRight, X, Lock,
    Volume2, VolumeX, Instagram, Linkedin, Globe,
    Target, MapPin, ExternalLink, Maximize2,
    Scan, Terminal, Check, Activity, Fingerprint,
    Download, FileText, Menu, Shield,
    Wifi, MousePointer2, ChevronDown, Zap, Database,
    Code, Anchor, User, Users, Star, Mic,
    Play, Power, Hash, FileCode, Server, Timer, Aperture,
    Crosshair, Disc, Layers, Link as LinkIcon, Radar, Monitor, AlertTriangle, FileWarning,
    Eye, Laptop, Smartphone, Gauge, Award, ChevronUp
} from 'lucide-react';
import { playSfx, setMuted } from './utils/soundEngine';
import { EVENTS_DATA, getLiveEvent, getAllMissions, getEventsByCategory } from './data/events';
import { TEAM_DATA } from './data/team';
import CertificateTemplate from './components/CertificateTemplate';
import { registerCadet, getCadetByRoll, fetchPublishedContent } from './firebase.js';

// Current active flagship event
const CURRENT_EVENT = getLiveEvent();

/* --- ASSET BANK --- */
const SPACE_IMAGES = [
    "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1614728853913-1e32005e307b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?auto=format&fit=crop&q=80&w=800"
];


/* --- KEY CLUB METRICS --- */
const ASSOCIATION_STATS = [
    { value: "100%", label: "STUDENT DRIVEN", detail: "Engineered at PSG College of Technology" },
    { value: "WORKSHOPS", label: "EVENTS & MISSIONS", detail: "Hands-on aerospace conclaves & symposiums" }
];

/* --- SPACE BACKGROUND COMPONENT --- */
const SpaceBackground = () => {
    // Generate meteors
    const meteors = useMemo(() => Array.from({ length: 4 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 40}%`,
        left: `${40 + Math.random() * 50}%`,
        delay: `${i * 3.5 + Math.random() * 2}s`,
        duration: `${4 + Math.random() * 3}s`
    })), []);

    // Random celestial stars
    const stars = useMemo(() => Array.from({ length: 70 }).map((_, i) => {
        const colors = ['#ffffff', '#00f0ff', '#60a5fa', '#fef08a'];
        return {
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2.2 + 0.8,
            color: colors[Math.floor(Math.random() * colors.length)],
            duration: Math.random() * 5 + 3,
            delay: Math.random() * 5
        };
    }), []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Deep Space Canvas Base */}
            <div className="absolute inset-0 bg-[#020406]"></div>

            {/* Glowing Nebula Clouds */}
            <div className="nebula-layer"></div>
            <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/3 -right-48 w-[30rem] h-[30rem] bg-[#4f46e5]/10 rounded-full blur-[140px] pointer-events-none"></div>

            {/* Shooting Meteors */}
            {meteors.map(m => (
                <div
                    key={m.id}
                    className="meteor w-32 md:w-48"
                    style={{
                        top: m.top,
                        left: m.left,
                        animationDelay: m.delay,
                        animationDuration: m.duration
                    }}
                />
            ))}

            {/* Twinkling Stars */}
            {stars.map(star => (
                <div
                    key={star.id}
                    className="absolute rounded-full animate-pulse"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        backgroundColor: star.color,
                        boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
                        animationDuration: `${star.duration}s`,
                        animationDelay: `${star.delay}s`,
                        opacity: 0.65
                    }}
                />
            ))}

            {/* Cyber Floor Grid */}
            <div className="cyber-grid"></div>

            {/* Subtle Scanline Overlay */}
            <div className="scanline-overlay"></div>
        </div>
    );
};

/* --- PARALLAX INTERACTIVE STARFIELD --- */
function ParallaxField({ mousePos, speed }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;
        const ctx = c.getContext('2d');
        let w = c.width = window.innerWidth;
        let h = c.height = window.innerHeight;

        const starCount = window.innerWidth < 768 ? 90 : 180;
        const stars = Array(starCount).fill().map(() => ({
            x: Math.random() * w,
            y: Math.random() * h,
            z: Math.random() * 2 + 0.5,
            o: Math.random() * 0.7 + 0.3,
            color: Math.random() > 0.8 ? '#00f0ff' : '#ffffff'
        }));

        let animationFrameId;

        const animate = () => {
            ctx.clearRect(0, 0, w, h);

            if (speed > 10) {
                ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
                ctx.fillRect(0, 0, w, h);
            }

            stars.forEach(s => {
                if (speed > 1) {
                    s.x = (s.x - w / 2) * (1 + speed / 50) + w / 2;
                    s.y = (s.y - h / 2) * (1 + speed / 50) + h / 2;
                    if (s.x < 0 || s.x > w || s.y < 0 || s.y > h) {
                        s.x = Math.random() * w;
                        s.y = Math.random() * h;
                    }
                }

                const mx = mousePos.x * 25 * s.z;
                const my = mousePos.y * 25 * s.z;

                ctx.globalAlpha = s.o;
                ctx.fillStyle = s.color;
                ctx.beginPath();

                if (speed > 5) {
                    ctx.moveTo(s.x, s.y);
                    ctx.lineTo(s.x + (s.x - w / 2) * 0.12, s.y + (s.y - h / 2) * 0.12);
                    ctx.strokeStyle = '#00f0ff';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                } else {
                    ctx.arc(s.x + mx, s.y + my, s.z * 0.9, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const resize = () => {
            if (!c) return;
            w = c.width = window.innerWidth;
            h = c.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, [mousePos, speed]);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none mix-blend-screen" />;
}

/* --- GLOBAL HUD OVERLAY --- */
function GlobalHUD() {
    return (
        <div className="fixed inset-0 z-40 pointer-events-none hidden md:block">
            {/* Corner Tech Brackets */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#00f0ff]/40 rounded-tl"></div>
            <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#00f0ff]/40 rounded-tr"></div>
            <div className="absolute bottom-10 left-6 w-12 h-12 border-b-2 border-l-2 border-[#00f0ff]/40 rounded-bl"></div>
            <div className="absolute bottom-10 right-6 w-12 h-12 border-b-2 border-r-2 border-[#00f0ff]/40 rounded-br"></div>

            {/* Bottom Telemetry Flight Ticker */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-[#00f0ff]/5 backdrop-blur-md border-t border-[#00f0ff]/20 flex items-center overflow-hidden">
                <div className="whitespace-nowrap animate-marquee font-mono-tech text-[10px] text-[#00f0ff]/80 flex gap-12 items-center">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>NODE: PSG_TECH_AERO_NODE_ALPHA</span>
                    <span>/// ORBITAL STATUS: NOMINAL</span>
                    <span>/// DSN LINK: 8.4 GHz LOCKED</span>
                    <span>/// APOGEE CEILING: 420 KM</span>
                    <span>/// ATTITUDE: 3-AXIS STABILIZED</span>
                    <span>/// WEATHER RADAR: CLEAR CEILING</span>
                    <span>/// NEXT LAUNCH: T-MINUS 14 DAYS</span>
                    <span>/// ENCRYPTED TELEMETRY STREAM ACTIVE</span>
                </div>
            </div>
        </div>
    );
}

/* --- INTRO SEQUENCE (BIOMETRIC / BOOT) --- */
function IntroSequence({ onComplete, soundOn, setSoundOn }) {
    const [step, setStep] = useState(0);
    const [logs, setLogs] = useState([]);
    const logEndRef = useRef(null);

    const bootLogs = [
        "KERNEL_SYS: KERNEL INITIALIZED",
        "MOUNTING_FILESYSTEM: /dev/psg/dsdaea",
        "LOADING_CORE_MODULES: [PROPULSION, AERODYNAMICS, AVIONICS, CFD]",
        "CHECKING_INTEGRITY: 100% VERIFIED",
        "ACQUIRING_ORBITAL_EPHEMERIS...",
        "ESTABLISHING_ISRO_DSN_TELEMETRY...",
        "AUTHENTICATION_GATEWAY: ARMED",
        "MISSION_OPERATIONS_READY."
    ];

    useEffect(() => {
        let delay = 0;
        bootLogs.forEach((log) => {
            setTimeout(() => {
                setLogs(prev => [...prev, `> ${log}`]);
                if (soundOn) playSfx('scan');
                if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }, delay);
            delay += 120;
        });
        setTimeout(() => setStep(1), delay + 250);
    }, []);

    const handlePermit = (allowed) => {
        setSoundOn(allowed);
        setMuted(!allowed);
        if (allowed) playSfx('boot');
        setStep(2);
        setTimeout(onComplete, 1400);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#020408] p-6 flex flex-col justify-center items-center">
            <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
                <MatrixRain />
            </div>

            {/* Quick Skip Button */}
            <button
                onClick={() => handlePermit(true)}
                className="absolute top-6 right-6 text-[10px] font-mono-tech tracking-widest text-gray-400 hover:text-[#00f0ff] border border-gray-800 hover:border-[#00f0ff]/50 px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 z-20"
            >
                <Zap size={12} className="text-[#00f0ff]" /> BYPASS PROTOCOL
            </button>

            {step === 0 && (
                <div className="w-full max-w-lg font-mono-tech text-xs text-[#00f0ff] h-64 overflow-hidden border border-[#00f0ff]/30 p-5 bg-black/85 rounded shadow-[0_0_30px_rgba(0,240,255,0.15)] relative">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#00f0ff]/20 text-[10px] text-gray-400">
                        <span className="flex items-center gap-2"><Terminal size={12} className="text-[#00f0ff]" /> BOOT_SEQUENCE.SH</span>
                        <span className="text-emerald-400 animate-pulse">RUNNING</span>
                    </div>
                    <div className="space-y-1 overflow-y-auto max-h-48">
                        {logs.map((log, i) => <div key={i} className="text-xs">{log}</div>)}
                        <div ref={logEndRef} />
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="relative z-10 hud-box p-8 md:p-12 max-w-lg w-full clip-corner animate-in zoom-in duration-300 text-center shadow-[0_0_50px_rgba(0,240,255,0.25)]">
                    <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-[#00f0ff]/30 animate-ping opacity-30"></div>
                        <div className="w-16 h-16 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff]">
                            <Fingerprint size={38} className="animate-pulse" />
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-display font-black text-white mb-2 tracking-widest">
                        AEROSPACE PORTAL
                    </h1>
                    <p className="text-gray-400 font-mono-tech text-[11px] tracking-widest mb-8">
                        DSDAEA // PSG COLLEGE OF TECHNOLOGY
                    </p>

                    <button
                        onClick={() => handlePermit(true)}
                        onMouseEnter={() => soundOn && playSfx('hover')}
                        className="w-full py-4 bg-[#00f0ff] text-black font-bold font-display tracking-[0.25em] text-sm hover:bg-white transition-all clip-tech flex items-center justify-center gap-3 mb-3 shadow-[0_0_30px_rgba(0,240,255,0.5)] active:scale-98"
                    >
                        <Power size={18} /> INITIALIZE SYSTEM
                    </button>

                    <button
                        onClick={() => handlePermit(false)}
                        className="text-[11px] text-gray-500 hover:text-white font-mono-tech tracking-widest transition-colors flex items-center gap-1.5 justify-center mx-auto py-2"
                    >
                        <Lock size={12} /> ENTER IN SILENT MODE
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="text-center z-10 animate-in zoom-in duration-300">
                    <div className="text-4xl md:text-6xl font-display font-black text-white tracking-widest animate-pulse glitch-text drop-shadow-[0_0_30px_rgba(0,240,255,0.9)]">
                        ACCESS GRANTED
                    </div>
                    <p className="font-mono-tech text-xs text-[#00f0ff] mt-2 tracking-[0.3em]">SYNCHRONIZING CADET TERMINAL...</p>
                    <div className="w-72 h-1.5 bg-gray-900 mt-6 mx-auto overflow-hidden rounded">
                        <div className="h-full bg-gradient-to-r from-[#00f0ff] to-[#0066ff] animate-[width_1.2s_ease-in-out_forwards]" style={{ width: '100%' }}></div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* --- MATRIX RAIN BACKGROUND FOR BOOT --- */
function MatrixRain() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;
        const ctx = c.getContext('2d');
        let w = c.width = window.innerWidth;
        let h = c.height = window.innerHeight;
        const cols = Math.floor(w / 24);
        const ypos = Array(cols).fill(0);

        const matrix = () => {
            ctx.fillStyle = 'rgba(2, 4, 8, 0.1)';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#00f0ff';
            ctx.font = '11pt monospace';

            ypos.forEach((y, i) => {
                const text = String.fromCharCode(33 + Math.floor(Math.random() * 90));
                const x = i * 24;
                ctx.fillText(text, x, y);
                if (y > 100 + Math.random() * 10000) ypos[i] = 0;
                else ypos[i] = y + 20;
            });
        };

        const interval = setInterval(matrix, 45);
        return () => clearInterval(interval);
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-25" />;
}

/* --- MAIN APP CORE --- */
export default function App() {
    const [view, setView] = useState('intro');
    const [soundOn, setSoundOn] = useState(true);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: (e.clientY / window.innerHeight) * 2 - 1
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const toggleSound = () => {
        const next = !soundOn;
        setSoundOn(next);
        setMuted(!next);
        if (next) playSfx('click');
    };

    return (
        <div className="relative min-h-screen scanlines selection:bg-[#00f0ff] selection:text-black bg-[#020306]">
            {/* Background Layer */}
            <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0b1b30] via-[#03060d] to-[#010204]"></div>
            <ParallaxField mousePos={mousePos} speed={view === 'intro' ? 8 : 0.5} />

            {view !== 'intro' && <GlobalHUD />}

            {view === 'intro' ? (
                <IntroSequence
                    onComplete={() => setView('main')}
                    soundOn={soundOn}
                    setSoundOn={setSoundOn}
                />
            ) : (
                <SinglePageInterface
                    soundOn={soundOn}
                    toggleSound={toggleSound}
                    mousePos={mousePos}
                />
            )}
        </div>
    );
}

/* --- SINGLE PAGE INTERFACE --- */
function SinglePageInterface({ soundOn, toggleSound, mousePos }) {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [showReg, setShowReg] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [missionCategory, setMissionCategory] = useState('all');
    const [showBackToTop, setShowBackToTop] = useState(false);

    const interact = () => { if (soundOn) playSfx('hover'); };
    const action = () => { if (soundOn) playSfx('click'); };

    // Scroll listener for back to top
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        setMobileMenu(false);
        action();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToTop = () => {
        action();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const [publishedContent, setPublishedContent] = useState([]);

    useEffect(() => {
        fetchPublishedContent().then(items => {
            if (Array.isArray(items)) setPublishedContent(items);
        }).catch(() => {});
    }, []);

    const liveEvent = useMemo(() => {
        if (publishedContent && publishedContent.length > 0) {
            const adminLive = publishedContent.find(c => c.isLive === true || c.badge?.toUpperCase().includes('FLAGSHIP'));
            if (adminLive) {
                return {
                    id: adminLive.id,
                    title: adminLive.title,
                    type: adminLive.badge || "FLAGSHIP MISSION",
                    category: adminLive.category || "competition",
                    status: "live",
                    isLive: true,
                    date: adminLive.date || "SCHEDULED",
                    time: adminLive.time || "09:30 AM IST",
                    eventDate: adminLive.eventDate ? new Date(adminLive.eventDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    venue: adminLive.location || "PSG Tech Aero Campus",
                    hall: adminLive.hall || "Main Auditorium & Aerodynamics Lab",
                    details: adminLive.summary || adminLive.details || "",
                    prizes: adminLive.prizes || "Cash Pool + Merit Certificates",
                    tagline: adminLive.tagline || "Where Curiosity Defies Gravity",
                    image: adminLive.photo || adminLive.image || "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800",
                    phase: adminLive.phase || "LAUNCH WINDOW OPEN",
                    certificateTitle: adminLive.certificateTitle || adminLive.title
                };
            }
        }
        return getLiveEvent();
    }, [publishedContent]);

    const rawTitle = liveEvent.title || "Flight & Propulsion Systems";
    const titleColonIdx = rawTitle.indexOf(':');
    const heroTitle = titleColonIdx > -1 ? rawTitle.substring(0, titleColonIdx).trim() : rawTitle.trim();
    const heroShortType = (liveEvent.type || (titleColonIdx > -1 ? rawTitle.substring(titleColonIdx + 1).trim() : "TECHNICAL WORKSHOP")).toUpperCase();

    // Segment title: "Flight & Propulsion" in white, "Systems" in blue
    let heroPartWhite = heroTitle;
    let heroPartBlue = "";
    if (heroTitle.toLowerCase().includes("flight & propulsion systems")) {
        heroPartWhite = "Flight & Propulsion";
        heroPartBlue = "Systems";
    } else if (heroTitle.lastIndexOf(' ') > -1) {
        const lastSpace = heroTitle.lastIndexOf(' ');
        heroPartWhite = heroTitle.substring(0, lastSpace);
        heroPartBlue = heroTitle.substring(lastSpace + 1);
    }

    const filteredMissions = useMemo(() => {
        const base = getEventsByCategory(missionCategory);
        const dynamicMapped = (publishedContent || [])
            .filter(c => missionCategory === 'all' || c.category === missionCategory)
            .map(c => ({
                id: c.id,
                title: c.title,
                type: c.badge || (c.category ? c.category.toUpperCase() : "MISSION DISPATCH"),
                category: c.category || "competition",
                status: "active",
                date: c.date || "SCHEDULED",
                time: c.time || "09:30 AM IST",
                venue: c.location || "PSG Tech Aero Campus",
                details: c.summary || c.details || "",
                image: c.photo || c.image || "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800",
                prizes: c.prizes || "Merit Certificate & Access",
                tagline: c.tagline || "Official Flight Conclave",
                registrationEnabled: true
            }));
        return [...dynamicMapped, ...base];
    }, [missionCategory, publishedContent]);

    return (
        <div className="min-h-screen relative text-gray-200 font-sans selection:bg-[#00f0ff] selection:text-black overflow-x-hidden">
            <SpaceBackground />

            {/* Sticky Navigation Header */}
            <header className="fixed top-0 w-full z-50 h-16 md:h-20 bg-[#02050b]/90 backdrop-blur-xl border-b border-[#00f0ff]/20 flex items-center justify-between px-3 sm:px-6 md:px-10 transition-all">
                {/* Brand Logo & Node Title */}
                <div
                    onClick={scrollToTop}
                    className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
                    onMouseEnter={interact}
                >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 relative flex items-center justify-center flex-shrink-0">
                        <div className="absolute inset-0 rounded-full border border-[#00f0ff]/30 group-hover:border-[#00f0ff] transition-colors group-hover:scale-110 duration-300"></div>
                        <img src="/logo.png" alt="DSDAEA Logo" className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <h1 className="font-display font-black text-white text-xs sm:text-base md:text-xl tracking-wider sm:tracking-widest leading-none group-hover:text-[#00f0ff] transition-colors truncate">
                                DSDAEA
                            </h1>
                            <span className="hidden sm:inline-block px-1.5 py-0.5 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 text-[8px] font-mono-tech tracking-wider rounded-sm flex-shrink-0">
                                PSG TECH
                            </span>
                        </div>
                        <p className="text-[7.5px] xs:text-[8px] sm:text-[9px] md:text-[10px] text-[#00f0ff] font-mono-tech tracking-wider sm:tracking-widest flex items-center gap-1 mt-0.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
                            AEROSPACE_NODE_ONLINE
                        </p>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    {[
                        { id: 'missions', label: 'MISSIONS' },
                        { id: 'crew', label: 'COMMAND CREW' },
                        { id: 'archives', label: 'ARCHIVES VAULT' }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => scrollTo(item.id)}
                            onMouseEnter={interact}
                            className="px-4 py-2 text-xs font-bold text-gray-300 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 font-mono-tech tracking-widest transition-all clip-corner"
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Header Action Controls */}
                <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                    {/* Audio Equalizer Toggle Button */}
                    <button
                        onClick={toggleSound}
                        className="p-2 sm:px-3 sm:py-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/30 hover:border-[#00f0ff] rounded transition-all flex items-center gap-1.5 text-xs font-mono-tech text-[#00f0ff] active:scale-95"
                        title={soundOn ? "Mute Sound Effects" : "Enable Sound Effects"}
                    >
                        {soundOn ? (
                            <>
                                <div className="flex items-end gap-0.5 h-3.5 w-3.5 sm:w-4">
                                    <div className="eq-bar eq-bar-1"></div>
                                    <div className="eq-bar eq-bar-2"></div>
                                    <div className="eq-bar eq-bar-3"></div>
                                    <div className="eq-bar eq-bar-4"></div>
                                </div>
                                <span className="hidden sm:inline text-[10px] tracking-wider font-bold">AUDIO ON</span>
                            </>
                        ) : (
                            <>
                                <VolumeX size={14} className="text-gray-400" />
                                <span className="hidden sm:inline text-[10px] tracking-wider text-gray-400">MUTED</span>
                            </>
                        )}
                    </button>

                    {/* Registration Primary CTA */}
                    <button
                        onClick={() => { action(); setShowReg(true); }}
                        onMouseEnter={interact}
                        className="flex px-2.5 sm:px-5 py-2 sm:py-2.5 bg-[#00f0ff] text-black font-bold text-[11px] sm:text-xs font-mono-tech tracking-wider sm:tracking-widest clip-tech hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] items-center gap-1 active:scale-95"
                    >
                        <Target size={13} className="flex-shrink-0" /> <span className="hidden xs:inline">CADET</span> <span>JOIN</span>
                    </button>

                    {/* Mobile Hamburger Toggle */}
                    <button
                        className="lg:hidden text-[#00f0ff] p-2 hover:bg-[#00f0ff]/10 border border-[#00f0ff]/30 rounded active:scale-95"
                        onClick={() => { action(); setMobileMenu(!mobileMenu); }}
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileMenu ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </header>

            {/* Mobile Drawer Menu */}
            {mobileMenu && (
                <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl pt-20 px-6 lg:hidden animate-in slide-in-from-top-6 overflow-y-auto flex flex-col justify-between pb-8">
                    <div className="flex flex-col gap-4 py-6 border-t border-[#00f0ff]/20">
                        {[
                            { id: 'missions', label: 'MISSIONS & CONCLAVES' },
                            { id: 'crew', label: 'COMMAND CREW' },
                            { id: 'archives', label: 'CERTIFICATE VAULT' }
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    scrollTo(item.id);
                                    setMobileMenu(false);
                                }}
                                className="text-left text-lg font-display font-bold text-white border-b border-[#00f0ff]/15 pb-4 flex justify-between items-center active:scale-98"
                            >
                                <span>{item.label}</span>
                                <ChevronRight className="text-[#00f0ff]" size={20} />
                            </button>
                        ))}

                        <button
                            onClick={() => { action(); setShowReg(true); setMobileMenu(false); }}
                            className="w-full py-4 bg-[#00f0ff] text-black font-bold text-sm tracking-widest clip-tech active:scale-95 mt-4 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.5)]"
                        >
                            <Target size={18} /> INITIATE CADET REGISTRATION
                        </button>
                    </div>

                    <div className="pt-6 border-t border-[#00f0ff]/15 flex items-center justify-between text-xs font-mono-tech text-gray-400">
                        <span>MISSION CONTROL:</span>
                        <a
                            href="/admin.html"
                            className="text-[#00f0ff] hover:underline flex items-center gap-1 font-bold"
                        >
                            ADMIN CONSOLE 🔒 ➔
                        </a>
                    </div>
                </div>
            )}

            {/* HERO SECTION - RESPONSIVE 2-COLUMN LAYOUT (MOBILE: DETAILS & CTA FIRST, 3D ORB UNDERNEATH) */}
            <section className="min-h-screen flex items-center justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-6 md:px-10 relative overflow-hidden">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative z-10">

                    {/* LEFT COLUMN (PC): EVENT DETAILS & ACTION CONTROLS | MOBILE: ORDER-2 (AFTER 3D ORB) */}
                    <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6">

                        {/* Top Status & Category Badges */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2.5">
                            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-[#00f0ff]/10 border border-[#00f0ff]/40 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"></span>
                                <span className="text-[8.5px] sm:text-[10px] font-mono-tech text-[#00f0ff] tracking-[0.2em] sm:tracking-[0.25em] font-bold uppercase">
                                    FLAGSHIP MISSION
                                </span>
                            </div>

                            {/* Compact Category Badge */}
                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-500/15 border border-purple-500/40 rounded-full">
                                <span className="text-[8px] sm:text-[9px] font-mono-tech text-purple-300 tracking-wider font-bold uppercase">
                                    CATEGORY: {liveEvent.category ? liveEvent.category.toUpperCase() : "EVENT"}
                                </span>
                            </div>

                            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-amber-500/15 border border-amber-500/40 rounded-full">
                                <Award size={12} className="text-amber-400" />
                                <span className="text-[8.5px] sm:text-[10px] font-mono-tech text-amber-300 tracking-wider font-bold uppercase">
                                    {liveEvent.prizes || "₹50,000 PRIZE POOL"}
                                </span>
                            </div>
                        </div>

                        {/* Glitch Animated Headline (Event Name: Flight & Propulsion in white, Systems in blue) */}
                        <div className="space-y-1 sm:space-y-2">
                            <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-5xl xl:text-6xl font-display font-black leading-[1.05] tracking-tight">
                                <span className="block text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]">
                                    <GlitchText text={heroPartWhite} soundOn={soundOn} />
                                </span>
                                {heroPartBlue && (
                                    <span className="block text-[#00f0ff] drop-shadow-[0_0_30px_rgba(0,240,255,0.6)]">
                                        <GlitchText text={heroPartBlue} soundOn={soundOn} />
                                    </span>
                                )}
                            </h1>

                            {/* Short Technical Workshop Tag */}
                            <div className="flex items-center justify-center lg:justify-start gap-2 pt-0.5">
                                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-[11px] sm:text-sm font-mono-tech tracking-[0.15em] sm:tracking-[0.2em] font-bold rounded">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping"></span>
                                    {heroShortType}
                                </span>
                            </div>
                        </div>

                        {/* Tagline / Mission Motto */}
                        {liveEvent.tagline && (
                            <div className="flex items-center gap-2 text-[#00f0ff] font-mono-tech text-xs sm:text-sm tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping"></span>
                                <span className="uppercase font-bold tracking-widest">{liveEvent.tagline}</span>
                            </div>
                        )}

                        {/* Dynamic Countdown Unit */}
                        <div className="pt-1 max-w-md lg:max-w-md w-full">
                            <CountdownWidget targetDate={liveEvent.eventDate} />
                        </div>

                        {/* Primary Call to Action & More Details Buttons */}
                        <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3.5 w-full max-w-2xl lg:max-w-none">
                            {/* Register Button */}
                            <button
                                onClick={() => { action(); setShowReg(true); }}
                                onMouseEnter={interact}
                                className="px-5 sm:px-8 py-3.5 sm:py-4 bg-[#00f0ff] text-black font-bold font-display text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] clip-tech hover:bg-white transition-all shadow-[0_0_30px_rgba(0,240,255,0.6)] flex items-center justify-center gap-2 group active:scale-95 flex-1 min-w-[140px] sm:flex-initial"
                            >
                                <Target size={16} className="group-hover:rotate-45 transition-transform" />
                                REGISTER NOW
                            </button>

                            {/* More Details Button - Opens Complete Mission Detail Modal */}
                            <button
                                onClick={() => { action(); setSelectedEvent(liveEvent); }}
                                onMouseEnter={interact}
                                className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/60 text-[#00f0ff] hover:text-white font-bold font-mono-tech text-xs tracking-wider transition-all flex items-center justify-center gap-2 rounded shadow-lg active:scale-95 flex-1 min-w-[120px] sm:flex-initial"
                            >
                                <Eye size={15} /> MORE DETAILS
                            </button>

                            {/* Certificate Button */}
                            <button
                                onClick={() => scrollTo('archives')}
                                onMouseEnter={interact}
                                className="px-5 sm:px-6 py-3.5 sm:py-4 bg-transparent border border-gray-700 hover:border-[#00f0ff] text-gray-300 hover:text-[#00f0ff] font-bold font-mono-tech text-xs tracking-wider transition-all flex items-center justify-center gap-2 clip-corner active:scale-95 w-full sm:w-auto"
                            >
                                <FileText size={15} /> CERTIFICATE
                            </button>
                        </div>

                        {/* Date, Block & Category Glass HUD Cards - Below Countdown and Action Buttons */}
                        <div className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-3 text-left max-w-2xl lg:max-w-none w-full pt-1">
                            {/* 1. Date & Time */}
                            <div className="hud-box p-2.5 sm:p-3 rounded flex flex-col justify-between col-span-2 sm:col-span-5">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-0.5 text-[#00f0ff]">
                                        <Calendar size={12} />
                                        <span className="text-[8.5px] sm:text-[9px] font-mono-tech tracking-widest font-bold uppercase">EVENT DATE</span>
                                    </div>
                                    <div className="text-white font-display text-xs sm:text-base font-bold">{liveEvent.date}</div>
                                </div>
                                <div className="text-gray-400 font-mono-tech text-[9.5px] sm:text-xs mt-0.5">{liveEvent.time}</div>
                            </div>

                            {/* 2. Campus Block & Hall */}
                            <div className="hud-box p-2.5 sm:p-3 rounded flex flex-col justify-between col-span-1 sm:col-span-4">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-0.5 text-[#00f0ff]">
                                        <MapPin size={12} />
                                        <span className="text-[8.5px] sm:text-[9px] font-mono-tech tracking-widest font-bold uppercase">CAMPUS BLOCK</span>
                                    </div>
                                    <div className="text-white font-display text-xs sm:text-base font-bold truncate">
                                        {liveEvent.building || "Block 5 / Mech"}
                                    </div>
                                </div>
                                <div className="text-gray-400 font-mono-tech text-[9px] sm:text-xs mt-0.5 truncate">
                                    {liveEvent.hall || liveEvent.venue}
                                </div>
                            </div>

                            {/* 3. Category & Type (Compact Smaller Box) */}
                            <div className="hud-box p-2.5 sm:p-3 rounded flex flex-col justify-between col-span-1 sm:col-span-3">
                                <div>
                                    <div className="flex items-center gap-1 mb-0.5 text-[#00f0ff]">
                                        <Target size={11} />
                                        <span className="text-[8px] font-mono-tech tracking-wider font-bold uppercase">CATEGORY</span>
                                    </div>
                                    <div className="text-white font-display text-xs sm:text-sm font-bold uppercase truncate">
                                        {liveEvent.category || "Workshop"}
                                    </div>
                                </div>
                                <div className="text-amber-400 font-mono-tech text-[8.5px] sm:text-[9px] mt-0.5 truncate">
                                    {liveEvent.type}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN (PC): 3D AEROSPACE ORBITER WITH RINGS | MOBILE: ORDER-1 (FIRST AT TOP) */}
                    <div className="order-1 lg:order-2 lg:col-span-5 flex items-center justify-center py-4 lg:py-0 w-full overflow-hidden">
                        <AerospaceOrbiterHUD mousePos={mousePos} soundOn={soundOn} />
                    </div>

                </div>
            </section>

            {/* KEY MILESTONES / ASSOCIATION TRACK RECORD - 2 COLUMNS ON MOBILE */}
            <section className="py-8 sm:py-10 px-3 sm:px-6 md:px-10 border-y border-[#00f0ff]/15 bg-black/40 backdrop-blur-md relative">
                <div className="max-w-4xl mx-auto grid grid-cols-2 gap-2.5 sm:gap-6">
                    {ASSOCIATION_STATS.map((stat, i) => (
                        <div key={i} className="hud-box p-3.5 sm:p-6 rounded-lg text-center sm:text-left relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00f0ff]/5 rounded-full blur-2xl group-hover:bg-[#00f0ff]/15 transition-all"></div>
                            <div className="text-2xl sm:text-4xl md:text-5xl font-display font-black text-white group-hover:text-[#00f0ff] transition-colors drop-shadow-[0_0_15px_rgba(0,240,255,0.5)] mb-1">
                                {stat.value}
                            </div>
                            <div className="text-[10px] sm:text-sm font-mono-tech font-bold text-[#00f0ff] tracking-wider mb-1 uppercase">
                                {stat.label}
                            </div>
                            <div className="text-[9px] sm:text-xs text-gray-400 font-mono-tech line-clamp-2">
                                {stat.detail}
                            </div>
                        </div>
                    ))}
                </div>
            </section>




            {/* ACTIVE & UPCOMING MISSIONS SECTION */}
            <section id="missions" className="py-14 sm:py-24 px-3 sm:px-6 md:px-10 relative">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 border-b border-[#00f0ff]/20 pb-4 gap-3 sm:gap-4">
                        <div>
                            <div className="text-[#00f0ff] text-[9.5px] sm:text-[10px] font-mono-tech tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-1 flex items-center gap-2">
                                <Activity size={13} className="text-[#00f0ff] animate-pulse" /> EXPEDITION LOG
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white">
                                Aerospace Missions
                            </h2>
                        </div>

                        {/* Category Filter Tabs with Touch Scroll */}
                        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 max-w-full scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
                            {[
                                { id: 'all', label: 'ALL MISSIONS' },
                                { id: 'competition', label: 'COMPETITIONS' },
                                { id: 'workshop', label: 'WORKSHOPS' },
                                { id: 'seminar', label: 'SEMINARS' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => { action(); setMissionCategory(tab.id); }}
                                    className={`px-3 py-1.5 sm:py-2 rounded text-xs font-mono-tech tracking-wider transition-all whitespace-nowrap flex-shrink-0 active:scale-95 ${
                                        missionCategory === tab.id
                                            ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                                            : 'bg-black/60 border border-gray-800 text-gray-400 hover:text-white hover:border-[#00f0ff]/40'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Missions Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {filteredMissions.map((event, index) => {
                            const imgUrl = event.image || SPACE_IMAGES[index % SPACE_IMAGES.length];
                            const isLive = event.isLive;

                            return (
                                <div
                                    key={event.id}
                                    onClick={() => { action(); setSelectedEvent({ ...event, image: imgUrl }); }}
                                    onMouseEnter={interact}
                                    className={`hud-box group relative overflow-hidden cursor-pointer flex flex-col rounded-lg hover:border-[#00f0ff] active:scale-[0.99] transition-all duration-300 ${
                                        isLive ? 'border-[#00f0ff]/60 shadow-[0_0_30px_rgba(0,240,255,0.15)]' : ''
                                    }`}
                                >
                                    {/* Cover Image Container */}
                                    <div className="h-40 sm:h-44 relative overflow-hidden bg-gray-900/60">
                                        <img
                                            src={imgUrl}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                            alt={event.title}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>

                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3 bg-black/85 text-[#00f0ff] text-[9px] font-bold px-2.5 py-1 border border-[#00f0ff]/50 backdrop-blur-md z-20 rounded font-mono-tech flex items-center gap-1.5">
                                            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>}
                                            {event.phase || "ACTIVE"}
                                        </div>

                                        {event.prizes && (
                                            <div className="absolute bottom-3 left-3 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono-tech font-bold px-2 py-0.5 rounded backdrop-blur-md">
                                                {event.prizes}
                                            </div>
                                        )}
                                    </div>

                                    {/* Mission Details */}
                                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-black/80">
                                        <div>
                                            <div className="text-[10px] text-[#00f0ff] font-mono-tech tracking-widest uppercase mb-1 flex items-center gap-1.5">
                                                <Zap size={12} /> {event.type}
                                            </div>
                                            <h3 className="text-lg font-bold font-display text-white group-hover:text-[#00f0ff] transition-colors leading-tight mb-3">
                                                {event.title}
                                            </h3>
                                            <p className="text-gray-400 font-mono-tech text-xs line-clamp-2 mb-4 leading-relaxed">
                                                {event.details}
                                            </p>
                                        </div>

                                        {/* Footer Meta */}
                                        <div className="border-t border-[#00f0ff]/15 pt-3 space-y-1.5 font-mono-tech text-[11px] text-gray-400">
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1.5 text-gray-300"><Calendar size={12} className="text-[#00f0ff]" /> {event.date}</span>
                                                {event.venue ? (
                                                    <span className="flex items-center gap-1.5 text-gray-300"><MapPin size={12} className="text-[#00f0ff]" /> {event.venue}</span>
                                                ) : (
                                                    <span className="text-gray-500"></span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* COMMAND CREW (LEADERSHIP) SECTION */}
            <section id="crew" className="py-24 px-4 sm:px-6 md:px-10 relative bg-black/40 border-t border-[#00f0ff]/15">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#00f0ff]/20 pb-4 gap-4">
                        <div>
                            <div className="text-[#00f0ff] text-[10px] font-mono-tech tracking-[0.3em] uppercase mb-1 flex items-center gap-2">
                                <Shield size={14} /> MISSION DIRECTORS & COORDINATORS
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
                                Command Crew
                            </h2>
                        </div>
                        <p className="text-gray-400 text-xs font-mono-tech max-w-md">
                            Faculty leadership and student executive officers driving aerospace research and student innovation at PSG College of Technology.
                        </p>
                    </div>

                    {/* Crew Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-6">
                        {TEAM_DATA.map((member, index) => (
                            <div
                                key={index}
                                onMouseEnter={interact}
                                className="hud-box p-6 rounded-lg group hover:border-[#00f0ff] transition-all flex flex-col items-center text-center relative overflow-hidden"
                            >
                                {/* Profile Photo with Glowing Clearance Ring */}
                                <div className="relative mb-5">
                                    <div className="w-32 h-32 rounded-full border-2 border-[#00f0ff]/40 overflow-hidden bg-[#00f0ff]/10 group-hover:border-[#00f0ff] transition-all group-hover:scale-105 duration-300 p-1">
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center rounded-full bg-gray-900">
                                                <User size={48} className="text-[#00f0ff]/60" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#00f0ff] text-black px-2.5 py-0.5 text-[9px] font-mono-tech font-bold tracking-widest rounded shadow">
                                        CLEARANCE: {member.clearance}
                                    </div>
                                </div>

                                {/* Member Information */}
                                <div className="w-full">
                                    <h3 className="text-lg font-display font-bold text-white group-hover:text-[#00f0ff] transition-colors mb-1 min-h-[26px]">
                                        {member.name || <span className="text-gray-600 font-mono-tech text-sm">—</span>}
                                    </h3>
                                    <p className="text-xs text-[#00f0ff] font-mono-tech uppercase tracking-wider mb-2 font-bold">
                                        {member.role}
                                    </p>
                                    <div className="text-[10px] text-gray-500 font-mono-tech mb-2">
                                        {member.id ? `CALLSIGN / ID: ${member.id}` : "CALLSIGN / ID: —"}
                                    </div>
                                    {member.dept ? (
                                        <div className="text-[11px] text-gray-400 font-mono-tech mb-4">
                                            {member.dept}
                                        </div>
                                    ) : (
                                        <div className="text-[11px] text-gray-600 font-mono-tech mb-4">
                                            —
                                        </div>
                                    )}

                                    {/* Social Uplinks */}
                                    {(member.email || member.linkedin) && (
                                        <div className="flex gap-3 justify-center pt-3 border-t border-[#00f0ff]/15">
                                            {member.email && (
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="w-8 h-8 rounded bg-[#00f0ff]/10 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black border border-[#00f0ff]/30 flex items-center justify-center transition-all"
                                                    title="Email Officer"
                                                >
                                                    <MailIcon size={14} />
                                                </a>
                                            )}
                                            {member.linkedin && (
                                                <a
                                                    href={member.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-8 h-8 rounded bg-[#00f0ff]/10 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black border border-[#00f0ff]/30 flex items-center justify-center transition-all"
                                                    title="LinkedIn Profile"
                                                >
                                                    <Linkedin size={14} />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </section>

            {/* CERTIFICATE VAULT SECTION */}
            <section id="archives" className="py-14 sm:py-24 px-3 sm:px-6 md:px-10 relative">
                <CertificateVault soundOn={soundOn} playSfx={playSfx} />
            </section>

            {/* FOOTER */}
            <footer className="bg-[#020306] border-t border-[#00f0ff]/20 pt-16 pb-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-60"></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border border-[#00f0ff]/40 p-1 flex items-center justify-center">
                                <Rocket className="text-[#00f0ff]" size={22} />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-display font-bold text-white leading-tight">
                                    DSDAEA // PSG TECH
                                </h2>
                                <p className="text-[10px] text-[#00f0ff] font-mono-tech tracking-widest">DR. SATISH DHAWAN AEROSPACE ASSOCIATION</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs font-mono-tech leading-relaxed max-w-lg">
                            Student-run aerospace engineering society at PSG College of Technology, Coimbatore. We innovate across hybrid rocketry, autonomous UAV avionics, computational fluid dynamics, and space science missions.
                        </p>
                        <p className="text-[11px] text-gray-500 font-mono-tech">
                            Address: Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu, 641004.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-[#00f0ff] text-xs font-bold font-display tracking-widest mb-4">COMMUNICATION UPLINKS</h4>
                        <div className="flex gap-3 mb-4">
                            <a
                                href="https://www.instagram.com/aero_psg_tech/"
                                target="_blank"
                                rel="noreferrer"
                                className="w-10 h-10 border border-gray-800 hover:border-[#00f0ff] rounded flex items-center justify-center text-gray-400 hover:text-[#00f0ff] transition-all bg-[#00f0ff]/5"
                                title="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/dr-satish-dhawan-aerospace-engineering-association-psg-tech/"
                                target="_blank"
                                rel="noreferrer"
                                className="w-10 h-10 border border-gray-800 hover:border-[#00f0ff] rounded flex items-center justify-center text-gray-400 hover:text-[#00f0ff] transition-all bg-[#00f0ff]/5"
                                title="LinkedIn"
                            >
                                <Linkedin size={18} />
                            </a>
                        </div>
                        <p className="text-[11px] font-mono-tech text-gray-500">Official Contact: dsdaeaweb@gmail.com</p>
                    </div>

                    <div className="flex flex-col justify-between items-start md:items-end gap-4">
                        <div className="text-[10px] text-emerald-400 font-mono-tech tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            CORE_SERVICES: 100% OPERATIONAL
                        </div>
                        <a
                            href="https://www.instagram.com/bazi.t_h/"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2 border border-[#00f0ff]/30 text-[#00f0ff] font-mono-tech text-[10px] tracking-widest hover:bg-[#00f0ff]/10 rounded transition-colors"
                        >
                            <Code size={12} /> DEV_NODE :: BASI
                        </a>
                        <p className="text-[10px] text-gray-600 font-mono-tech">
                            © 2026 DSDAEA PSG TECH // ALL SYSTEMS SECURE
                        </p>
                    </div>
                </div>
            </footer>

            {/* FLOATING BACK TO TOP BUTTON */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    onMouseEnter={interact}
                    className="fixed bottom-12 right-6 z-40 w-11 h-11 bg-[#00f0ff] hover:bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.7)] transition-all animate-bounce"
                    title="Return to Orbit / Top"
                >
                    <Rocket size={18} className="-rotate-45" />
                </button>
            )}

            {/* REGISTRATION MODAL */}
            {showReg && (
                <RegistrationModal
                    onClose={() => setShowReg(false)}
                    soundOn={soundOn}
                    playSfx={playSfx}
                />
            )}

            {/* MISSION BRIEFING MODAL */}
            {selectedEvent && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in zoom-in-95 duration-200">
                    <div className="hud-box w-full max-w-3xl border-t-2 border-t-[#00f0ff] relative flex flex-col overflow-hidden max-h-[92vh] overflow-y-auto rounded-lg">
                        <div className="p-4 sm:p-8 relative">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 text-gray-400 hover:text-white transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-4 pr-8 sm:pr-0">
                                <div className="flex items-center gap-1.5 text-[#00f0ff] font-mono-tech text-[11px] sm:text-xs mb-1">
                                    <Terminal size={13} /> <span>FILE_DECRYPTED :: MISSION_DOSSIER</span>
                                </div>
                                <h2 className="text-xl sm:text-3xl font-display font-bold text-white">{selectedEvent.title}</h2>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-[#00f0ff] text-xs font-mono-tech tracking-widest uppercase">
                                        {selectedEvent.type} // PRIORITY: ALPHA
                                    </span>
                                    {selectedEvent.tagline && (
                                        <span className="text-gray-400 text-xs font-mono-tech">• {selectedEvent.tagline}</span>
                                    )}
                                </div>
                            </div>

                            {/* Mission Visual Banner */}
                            <div className="mb-5 sm:mb-6 w-full h-40 sm:h-56 overflow-hidden relative border border-[#00f0ff]/30 rounded bg-gray-900">
                                <img
                                    src={selectedEvent.image || selectedEvent.photo || "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800"}
                                    className="w-full h-full object-cover"
                                    alt={selectedEvent.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                {selectedEvent.prizes && (
                                    <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 text-[10px] sm:text-xs font-mono-tech font-bold px-2.5 py-1 rounded backdrop-blur-md flex items-center gap-1.5">
                                        <Award size={13} /> AWARDS: {selectedEvent.prizes}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6 font-mono-tech">
                                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed border-l-2 border-[#00f0ff] pl-3 sm:pl-4">
                                    {selectedEvent.details}
                                </p>

                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3 bg-black/60 p-3 sm:p-4 rounded border border-gray-800 text-xs">
                                    <div>
                                        <div className="text-gray-500 text-[10px]">SCHEDULE:</div>
                                        <div className="text-white font-bold text-xs sm:text-sm">{selectedEvent.date}</div>
                                        <div className="text-gray-400 text-[10.5px] sm:text-[11px]">{selectedEvent.time}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-[10px]">BLOCK & LOCATION:</div>
                                        <div className="text-white font-bold text-xs sm:text-sm">{selectedEvent.building || selectedEvent.venue}</div>
                                        <div className="text-gray-400 text-[10.5px] sm:text-[11px]">{selectedEvent.hall || selectedEvent.venue}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {selectedEvent.registrationEnabled !== false ? (
                                    <button
                                        onClick={() => {
                                            if (soundOn) playSfx('click');
                                            setSelectedEvent(null);
                                            setShowReg(true);
                                        }}
                                        className="flex-1 bg-[#00f0ff] text-black font-bold font-display py-3.5 uppercase tracking-widest hover:bg-white transition-all clip-tech flex justify-center items-center gap-2"
                                    >
                                        <Target size={16} /> REGISTER FOR MISSION
                                    </button>
                                ) : (
                                    <div className="flex-1 py-3 text-center bg-gray-900 border border-gray-800 text-gray-400 text-xs font-mono-tech rounded">
                                        MISSION COMPLETED / REGISTRATION CLOSED
                                    </div>
                                )}
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="px-6 py-3.5 bg-gray-800 text-gray-300 font-mono-tech text-xs tracking-wider hover:bg-gray-700 transition-colors rounded"
                                >
                                    CLOSE DOSSIER
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

/* --- 3D INTERACTIVE AEROSPACE ORBITER HUD --- */
function AerospaceOrbiterHUD({ mousePos, soundOn }) {
    const [mode, setMode] = useState('LEO'); // SUB, HYPER, LEO, DEEP
    const [thrusterActive, setThrusterActive] = useState(true);

    const modes = {
        SUB: {
            title: "SUB-ORBITAL",
            velocity: "MACH 4.2",
            altitude: "85.4 KM",
            apogee: "115 KM",
            downlink: "12 Mbps",
            status: "BOOST GLIDE"
        },
        HYPER: {
            title: "HYPERSONIC CRUISE",
            velocity: "MACH 8.8",
            altitude: "34.2 KM",
            apogee: "N/A",
            downlink: "45 Mbps",
            status: "SCRAMJET ACTIVE"
        },
        LEO: {
            title: "LEO ORBITAL",
            velocity: "MACH 24.6",
            altitude: "420.0 KM",
            apogee: "424 KM",
            downlink: "115 kbps",
            status: "INCLINATION 51.6°"
        },
        DEEP: {
            title: "ESCAPE TRAJECTORY",
            velocity: "11.2 km/s",
            altitude: "384,400 KM",
            apogee: "LUNAR TRANSFER",
            downlink: "2.4 kbps",
            status: "TRANSLUNAR INSERTION"
        }
    };

    const currentMode = modes[mode];

    const changeMode = (m) => {
        if (soundOn) playSfx('telemetry');
        setMode(m);
    };

    return (
        <div className="relative w-[260px] h-[260px] xs:w-[290px] xs:h-[290px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px] flex items-center justify-center perspective-1000 select-none my-3 sm:my-0 pb-8 sm:pb-0">
            {/* Outer Concentric Gimbal Compass Rings */}
            <div className="absolute inset-0 border border-[#00f0ff]/30 rounded-full animate-spin-slow pointer-events-none">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-black px-1 text-[7.5px] sm:text-[9px] font-mono-tech text-[#00f0ff]">000° N</div>
                <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 bg-black px-1 text-[7.5px] sm:text-[9px] font-mono-tech text-[#00f0ff]">090° E</div>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-black px-1 text-[7.5px] sm:text-[9px] font-mono-tech text-[#00f0ff]">180° S</div>
                <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 bg-black px-1 text-[7.5px] sm:text-[9px] font-mono-tech text-[#00f0ff]">270° W</div>
            </div>

            {/* Inner Dashed Gyro Ring */}
            <div className="absolute w-[200px] h-[200px] xs:w-[230px] xs:h-[230px] sm:w-[270px] sm:h-[270px] md:w-[320px] md:h-[320px] border border-dashed border-[#00f0ff]/40 rounded-full animate-reverse-spin-slow pointer-events-none"></div>

            {/* Dynamic Plasma Thruster Glow behind Craft */}
            <div className="absolute w-28 h-28 xs:w-36 xs:h-36 sm:w-44 sm:h-44 rounded-full bg-[#00f0ff]/15 blur-3xl pointer-events-none animate-pulse"></div>

            {/* Central Spacecraft Graphic */}
            <div
                className="relative z-20 transition-transform duration-300 ease-out"
                style={{
                    transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px) rotate(${mousePos.x * 12}deg)`
                }}
            >
                {/* Spacecraft Silhouette Vector */}
                <div className="relative flex flex-col items-center">
                    <svg
                        className="w-16 h-16 xs:w-20 xs:h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 text-white drop-shadow-[0_0_25px_rgba(0,240,255,0.9)]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {/* Fuselage & Hypersonic Wings */}
                        <path d="M12 2L15 8L22 13L15 14L14 20L12 18L10 20L9 14L2 13L9 8L12 2Z" fill="rgba(0, 240, 255, 0.15)" />
                        <line x1="12" y1="2" x2="12" y2="18" stroke="#00f0ff" strokeWidth="1.5" />
                        <circle cx="12" cy="9" r="1.5" fill="#00f0ff" />
                    </svg>

                    {/* Animated Plasma Thruster Plume */}
                    {thrusterActive && (
                        <div className="w-3.5 h-12 bg-gradient-to-b from-[#00f0ff] via-[#0066ff] to-transparent rounded-full animate-plume -mt-3 blur-[1px]"></div>
                    )}
                </div>
            </div>

            {/* Radar Sweep Line */}
            <div className="radar-sweep-line"></div>

            {/* Top Right Telemetry Callout */}
            <div className="absolute top-1 right-0 sm:top-4 sm:right-1 hud-box p-1.5 sm:p-2.5 rounded border-l-2 border-l-[#00f0ff] text-left z-20 min-w-[85px] xs:min-w-[95px] sm:min-w-[115px]">
                <div className="text-[7px] sm:text-[8px] font-mono-tech text-[#00f0ff] uppercase">VELOCITY</div>
                <div className="text-[11px] sm:text-sm font-mono-tech font-bold text-white">{currentMode.velocity}</div>
                <div className="text-[6.5px] sm:text-[8px] font-mono-tech text-gray-400 mt-0.5">{currentMode.status}</div>
            </div>

            {/* Bottom Left Telemetry Callout */}
            <div className="absolute bottom-2 left-0 sm:bottom-4 sm:left-1 hud-box p-1.5 sm:p-2.5 rounded border-r-2 border-r-[#00f0ff] text-right z-20 min-w-[85px] xs:min-w-[95px] sm:min-w-[115px]">
                <div className="text-[7px] sm:text-[8px] font-mono-tech text-[#00f0ff] uppercase">ALTITUDE</div>
                <div className="text-[11px] sm:text-sm font-mono-tech font-bold text-white">{currentMode.altitude}</div>
                <div className="text-[6.5px] sm:text-[8px] font-mono-tech text-gray-400 mt-0.5">APOGEE: {currentMode.apogee}</div>
            </div>

            {/* Interactive Flight Mode Switcher Bar */}
            <div className="absolute -bottom-5 sm:-bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/90 p-1 rounded-full border border-[#00f0ff]/40 z-30 shadow-lg">
                {['SUB', 'HYPER', 'LEO', 'DEEP'].map(m => (
                    <button
                        key={m}
                        onClick={() => changeMode(m)}
                        className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-mono-tech font-bold rounded-full transition-all ${
                            mode === m
                                ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_#00f0ff]'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {m}
                    </button>
                ))}
            </div>
        </div>
    );
}



/* --- COUNTDOWN TIMER WIDGET --- */
function CountdownWidget({ targetDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 8, minutes: 22, seconds: 45 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const eventTime = new Date(targetDate).getTime();
            const diff = eventTime - now;

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60)
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const TimeUnit = ({ value, label }) => (
        <div className="flex flex-col items-center flex-1 min-w-0">
            <div className="relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-[#0a1525]/80 backdrop-blur-md border border-[#00f0ff]/30 flex items-center justify-center rounded clip-tech hover:border-[#00f0ff] transition-colors">
                <span className="text-base xs:text-xl sm:text-2xl md:text-3xl font-display font-black text-white drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]">
                    {String(value).padStart(2, '0')}
                </span>
            </div>
            <span className="mt-1 text-[7px] xs:text-[8px] sm:text-[9px] text-[#00f0ff] font-mono-tech tracking-wider sm:tracking-widest font-bold uppercase truncate">
                {label}
            </span>
        </div>
    );

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-3 pb-1 border-b border-[#00f0ff]/20">
                <div className="flex items-center gap-2 text-[#00f0ff]">
                    <Radar size={14} className="animate-spin-slow" />
                    <span className="text-[10px] font-mono-tech tracking-[0.2em] font-bold">IGNITION COUNTDOWN</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono-tech font-bold animate-pulse">
                    ● LAUNCH WINDOW OPEN
                </div>
            </div>
            <div className="flex justify-between gap-2 max-w-md">
                <TimeUnit value={timeLeft.days} label="DAYS" />
                <div className="h-12 w-[1px] bg-[#00f0ff]/20 self-center hidden sm:block"></div>
                <TimeUnit value={timeLeft.hours} label="HOURS" />
                <div className="h-12 w-[1px] bg-[#00f0ff]/20 self-center hidden sm:block"></div>
                <TimeUnit value={timeLeft.minutes} label="MINS" />
                <div className="h-12 w-[1px] bg-[#00f0ff]/20 self-center hidden sm:block"></div>
                <TimeUnit value={timeLeft.seconds} label="SECS" />
            </div>
        </div>
    );
}

/* --- CERTIFICATE VAULT COMPONENT --- */
function CertificateVault({ soundOn, playSfx }) {
    const [roll, setRoll] = useState("");
    const [state, setState] = useState("IDLE"); // IDLE, SCAN, FOUND, ERROR
    const [certificateData, setCertificateData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const search = async (overrideRoll) => {
        const query = (overrideRoll || roll).trim().toUpperCase();
        if (!query) return;

        if (soundOn) playSfx('click');
        setState("SCAN");
        setErrorMessage("");

        try {
            const { fetchCertificateData } = await import('./utils/certificateAPI');
            const data = await fetchCertificateData(query);
            setCertificateData(data);
            setState("FOUND");
            if (soundOn) playSfx('success');
        } catch (error) {
            console.error('Certificate search error:', error);
            setErrorMessage(error.message || "Certificate record not located.");
            setState("ERROR");
            if (soundOn) playSfx('denied');
        }
    };

    const handleDownloadJPG = async () => {
        if (soundOn) playSfx('click');
        try {
            const { generateCertificateJPG } = await import('./utils/pdfGenerator');
            const cleanName = certificateData.name?.trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Cadet';
            const filename = `DSDAEA_Certificate_${certificateData.rollNo}_${cleanName}.jpg`;
            await generateCertificateJPG('certificate-print-zone', filename);
            if (soundOn) playSfx('success');
        } catch (error) {
            console.error('Error downloading JPG certificate:', error);
            alert('Could not download image. Try PDF format.');
            if (soundOn) playSfx('denied');
        }
    };

    const handlePrint = async () => {
        if (soundOn) playSfx('click');
        try {
            const { generateCertificatePDF, generatePDFFilename } = await import('./utils/pdfGenerator');
            const filename = generatePDFFilename(certificateData);
            await generateCertificatePDF('certificate-print-zone', filename);
            if (soundOn) playSfx('success');
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('PDF generation error. Please try again.');
            if (soundOn) playSfx('denied');
        }
    };

    const reset = () => {
        setState("IDLE");
        setRoll("");
        setCertificateData(null);
        setErrorMessage("");
    };

    return (
        <div className="max-w-4xl mx-auto w-full relative">
            <div className="hud-box p-4 sm:p-8 md:p-12 rounded-lg border-t-2 border-t-[#00f0ff] relative overflow-hidden">
                <div className="text-center mb-6 sm:mb-8">
                    <div className="text-[#00f0ff] text-[9.5px] sm:text-[10px] font-mono-tech tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-1 flex items-center justify-center gap-2">
                        <Shield size={15} /> VERIFIED AIR ARCHIVES
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">Certificate Vault</h2>
                    <p className="text-gray-400 text-xs font-mono-tech max-w-lg mx-auto">
                        Official credential verification protocol for DSDAEA workshops, symposiums, and national technical challenges.
                    </p>
                </div>

                {state === "IDLE" || state === "ERROR" ? (
                    <div className="max-w-md mx-auto space-y-4 sm:space-y-5">
                        <div className="relative">
                            <Scan className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00f0ff]" size={18} />
                            <input
                                value={roll}
                                onChange={e => setRoll(e.target.value.toUpperCase())}
                                onKeyPress={e => e.key === 'Enter' && search()}
                                className="w-full bg-black/70 border border-gray-700 focus:border-[#00f0ff] py-3.5 sm:py-4 pl-12 pr-4 text-white font-mono-tech placeholder:text-gray-600 focus:outline-none uppercase tracking-widest text-sm sm:text-base rounded"
                                placeholder="ENTER ROLL NO. (EG: 25U201)"
                            />
                        </div>

                        <button
                            onClick={() => search()}
                            className="w-full py-3.5 sm:py-4 bg-[#00f0ff] text-black font-bold font-display uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm hover:bg-white transition-all clip-tech shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95"
                        >
                            VERIFY CREDENTIAL
                        </button>

                        {state === "ERROR" && (
                            <div className="p-3 bg-red-900/20 border border-red-500/40 text-red-400 text-xs font-mono-tech text-center rounded flex items-center justify-center gap-2">
                                <AlertTriangle size={14} /> {errorMessage}
                            </div>
                        )}
                    </div>
                ) : state === "SCAN" ? (
                    <div className="text-center py-12 space-y-3">
                        <div className="w-16 h-16 border-4 border-[#00f0ff] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-[#00f0ff] font-mono-tech text-xs tracking-widest animate-pulse">DECRYPTING ARCHIVAL CERTIFICATES...</p>
                    </div>
                ) : state === "FOUND" && certificateData ? (
                    <div className="space-y-5 sm:space-y-6">
                        {/* Certificate Card Header */}
                        <div className="bg-[#00f0ff]/10 border border-[#00f0ff]/30 p-4 sm:p-5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded bg-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] flex-shrink-0">
                                    <Award size={22} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-display font-bold text-white text-base sm:text-lg truncate">{certificateData.name}</h4>
                                    <p className="text-gray-400 font-mono-tech text-xs truncate">
                                        ID: {certificateData.rollNo} • {certificateData.year} Year • {certificateData.dept}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                <button
                                    onClick={handlePrint}
                                    className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono-tech font-bold text-xs tracking-wider rounded flex items-center justify-center gap-1.5 shadow active:scale-95"
                                >
                                    <Download size={14} /> OFFICIAL PDF
                                </button>
                                <button
                                    onClick={handleDownloadJPG}
                                    className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-[#00f0ff] hover:bg-white text-black font-mono-tech font-bold text-xs tracking-wider rounded flex items-center justify-center gap-1.5 shadow active:scale-95"
                                >
                                    <FileText size={14} /> HIGH-RES JPG
                                </button>
                                <button
                                    onClick={reset}
                                    className="px-3 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono-tech text-xs rounded active:scale-95"
                                >
                                    NEW
                                </button>
                            </div>
                        </div>

                        {/* Live Certificate Preview Box */}
                        <div className="border border-[#00f0ff]/20 p-3 sm:p-4 bg-black/40 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[#00f0ff] text-xs font-mono-tech tracking-widest">OFFICIAL CREDENTIAL PREVIEW</p>
                                <span className="text-[10px] text-gray-400 font-mono-tech sm:hidden">↔ Swipe to view</span>
                            </div>
                            <div className="overflow-x-auto pb-2">
                                <div className="cert-screen-preview-container mx-auto">
                                    <CertificateTemplate
                                        data={certificateData}
                                        eventTitle={CURRENT_EVENT.certificateTitle || "FLIGHT & PROPULSION SYSTEMS WORKSHOP 2026"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Dedicated 1:1 unscaled print zone for PDF and JPG generation */}
            {state === "FOUND" && certificateData && (
                <div
                    id="certificate-print-zone"
                    style={{
                        position: 'fixed',
                        left: '-99999px',
                        top: '0px',
                        width: '1122px',
                        height: '794px',
                        pointerEvents: 'none',
                        zIndex: -99999,
                    }}
                >
                    <CertificateTemplate
                        data={certificateData}
                        eventTitle={CURRENT_EVENT.certificateTitle || "FLIGHT & PROPULSION SYSTEMS WORKSHOP 2026"}
                    />
                </div>
            )}
        </div>
    );
}

/* --- REGISTRATION MODAL WITH DIGITAL BOARDING PASS --- */
function RegistrationModal({ onClose, soundOn, playSfx }) {
    const [step, setStep] = useState(1);
    const [rollInput, setRollInput] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [phoneInput, setPhoneInput] = useState("");
    const [data, setData] = useState(null);
    const [regError, setRegError] = useState("");
    const [existingCadet, setExistingCadet] = useState(null);

    // Instant Department and Year parser as student types
    const parsedMeta = useMemo(() => {
        const r = rollInput.trim().toUpperCase();
        if (r.length < 3) return null;

        const batch = parseInt(r.substring(0, 2));
        let year = "Unknown";
        if (!isNaN(batch)) {
            const y = Math.max(1, Math.min(4, 2026 - (2000 + batch) + 1));
            year = `${y}${y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th'} Year`;
        }

        const match = r.match(/[0-9]+([A-Z]+)[0-9]*/);
        const code = match ? match[1] : '';

        const deptMapping = {
            'A': 'Automobile Engineering',
            'D': 'Biomedical Engineering',
            'C': 'Civil Engineering',
            'Z': 'Computer Science & Engineering',
            'N': 'Computer Science (AI & ML)',
            'E': 'Electrical & Electronics',
            'L': 'Electronics & Communication',
            'U': 'Instrumentation & Control',
            'M': 'Mechanical Engineering',
            'Y': 'Metallurgical Engineering',
            'P': 'Production Engineering',
            'R': 'Robotics & Automation',
            'B': 'Bio Technology',
            'I': 'Information Technology',
            'T': 'Textile Technology'
        };

        const dept = deptMapping[code] || (code ? 'Aerospace Engineering' : 'Engineering Candidate');
        const degree = ['B', 'I', 'H', 'T'].includes(code) ? 'B.Tech' : 'B.E.';

        return { year, dept, degree };
    }, [rollInput]);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (soundOn) playSfx('click');
        setRegError("");
        setExistingCadet(null);

        if (!nameInput || !rollInput || !phoneInput) return;

        if (phoneInput.length !== 10) {
            setRegError("Please enter a valid 10-digit mobile phone number.");
            if (soundOn) playSfx('denied');
            return;
        }

        const cleanRoll = rollInput.trim().toUpperCase();
        setStep(2);

        try {
            // Verify if roll number has already registered (Strictly 1 registration per roll number)
            const existing = await getCadetByRoll(cleanRoll);
            if (existing) {
                if (soundOn) playSfx('denied');
                setStep(1);
                setExistingCadet(existing);
                setRegError(`ROLL NUMBER ALREADY REGISTERED: Roll number ${cleanRoll} has already registered as "${existing.name}". Each roll number can register only one time.`);
                return;
            }

            const cadetData = {
                name: nameInput.trim(),
                roll: cleanRoll,
                rollNo: cleanRoll,
                phone: phoneInput.trim(),
                year: parsedMeta?.year || '1st Year',
                dept: parsedMeta?.dept || 'Mechanical Engineering',
                degree: parsedMeta?.degree || 'B.E.',
                flightCode: `DS-${Math.floor(1000 + Math.random() * 9000)}`
            };

            await registerCadet(cadetData, { preventDuplicate: true });
            setData(cadetData);
            if (soundOn) playSfx('success');
            setStep(3);
        } catch (err) {
            console.error("Registration error:", err);
            setStep(1);
            setRegError(err.message || "Registration failed. Please try again.");
            if (soundOn) playSfx('denied');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4">
            <div className="w-full max-w-lg hud-box p-4 sm:p-8 rounded-lg relative overflow-y-auto max-h-[90vh] my-auto">
                <button
                    onClick={onClose}
                    className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-white"
                    aria-label="Close registration modal"
                >
                    <X size={20} />
                </button>

                {step === 1 && (
                    <form onSubmit={handleRegister} className="space-y-3.5 sm:space-y-4">
                        <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4 pr-8 sm:pr-0">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded bg-[#00f0ff]/15 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] flex-shrink-0">
                                <Fingerprint size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-display font-bold text-white leading-tight">CADET ENTRY PORTAL</h3>
                                <p className="text-[9px] sm:text-[10px] font-mono-tech text-gray-400">DSDAEA // OFFICIAL REGISTRATION (1 TIME PER ROLL)</p>
                            </div>
                        </div>

                        {regError && (
                            <div className="p-3 bg-red-950/70 border border-red-500/50 rounded text-xs font-mono-tech text-red-300 space-y-2">
                                <div className="flex items-center gap-2 text-red-400 font-bold">
                                    <AlertTriangle size={15} /> REGISTRATION RESTRICTED
                                </div>
                                <p className="text-[11px] leading-relaxed">{regError}</p>
                                {existingCadet && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData(existingCadet);
                                            setStep(3);
                                        }}
                                        className="w-full py-2 bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/40 rounded text-xs font-mono-tech transition-all flex items-center justify-center gap-2 mt-1"
                                    >
                                        <Check size={14} /> VIEW EXISTING BOARDING PASS ➔
                                    </button>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="text-[10px] font-mono-tech text-[#00f0ff] block mb-1">CANDIDATE FULL NAME</label>
                            <input
                                required
                                autoComplete="name"
                                value={nameInput}
                                onChange={e => { setNameInput(e.target.value); setRegError(""); }}
                                className="w-full bg-black/60 border border-gray-700 p-3 text-white font-mono-tech text-base sm:text-sm rounded focus:border-[#00f0ff] outline-none"
                                placeholder="Enter Full Name"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono-tech text-[#00f0ff] block mb-1">PSG TECH ROLL NUMBER (ONE REGISTRATION ONLY)</label>
                            <input
                                required
                                autoCapitalize="characters"
                                autoCorrect="off"
                                spellCheck="false"
                                value={rollInput}
                                onChange={e => { setRollInput(e.target.value.toUpperCase()); setRegError(""); setExistingCadet(null); }}
                                className="w-full bg-black/60 border border-gray-700 p-3 text-white font-mono-tech text-base sm:text-sm rounded focus:border-[#00f0ff] outline-none uppercase tracking-wider"
                                placeholder="E.g. 25U201"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono-tech text-[#00f0ff] block mb-1">PHONE NUMBER</label>
                            <input
                                required
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                pattern="[0-9]{10}"
                                maxLength={10}
                                value={phoneInput}
                                onChange={e => { setPhoneInput(e.target.value.replace(/\D/g, '')); setRegError(""); }}
                                className="w-full bg-black/60 border border-gray-700 p-3 text-white font-mono-tech text-base sm:text-sm rounded focus:border-[#00f0ff] outline-none tracking-wider"
                                placeholder="10-digit mobile number (e.g. 9876543210)"
                            />
                        </div>

                        {/* Real-time Department Identification Feedback */}
                        {parsedMeta && (
                            <div className="p-3 bg-[#00f0ff]/10 border border-[#00f0ff]/30 rounded text-xs font-mono-tech text-gray-300 space-y-1">
                                <div className="text-[#00f0ff] text-[10px] font-bold">AUTOMATIC IDENTIFICATION:</div>
                                <div>Branch: <b className="text-white">{parsedMeta.dept}</b> ({parsedMeta.degree})</div>
                                <div>Academic Year: <b className="text-white">{parsedMeta.year}</b></div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 bg-[#00f0ff] text-black font-bold font-display tracking-widest text-xs uppercase clip-tech hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] mt-2"
                        >
                            TRANSMIT CADET ENTRY
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <div className="text-center py-12 space-y-3">
                        <div className="w-12 h-12 border-4 border-[#00f0ff] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-[#00f0ff] font-mono-tech text-xs tracking-widest animate-pulse">
                            AUTHENTICATING WITH PSG TECH REGISTRY...
                        </p>
                    </div>
                )}

                {step === 3 && data && (
                    <div className="space-y-5 text-center">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center mx-auto">
                            <Check size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-display font-bold text-white">ACCESS GRANTED!</h3>
                            <p className="text-xs font-mono-tech text-emerald-400">CADET BOARDING PASS ISSUED</p>
                        </div>

                        {/* Cadet Digital Flight Pass */}
                        <div className="cadet-card-bg p-5 rounded-lg border border-[#00f0ff]/40 text-left relative overflow-hidden font-mono-tech text-xs space-y-3">
                            <div className="flex justify-between items-start pb-2 border-b border-[#00f0ff]/20">
                                <div>
                                    <div className="text-[9px] text-gray-400">MISSION FLIGHT CODE</div>
                                    <div className="text-base font-display font-black text-[#00f0ff]">{data.flightCode}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[9px] text-gray-400">CLEARANCE</div>
                                    <div className="text-emerald-400 font-bold">LEVEL-1 CADET</div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-gray-400 text-[10px]">CADET NAME</div>
                                <div className="text-white font-bold text-sm">{data.name}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div>
                                    <div className="text-gray-400 text-[9px]">ROLL NO</div>
                                    <div className="text-white">{data.roll}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-[9px]">PHONE</div>
                                    <div className="text-[#00f0ff] font-mono-tech">{data.phone || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-[9px]">ACADEMIC YEAR</div>
                                    <div className="text-white">{data.year}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-[9px]">DEPARTMENT</div>
                                    <div className="text-white truncate">{data.dept}</div>
                                </div>
                            </div>

                            {/* Barcode Strip */}
                            <div className="h-8 barcode-strip rounded opacity-80 mt-2"></div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-mono-tech text-xs tracking-wider rounded"
                        >
                            RETURN TO MISSION CONTROL
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* --- GLITCH TEXT COMPONENT --- */
const GlitchText = ({ text, soundOn }) => {
    const [display, setDisplay] = useState(text);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

    const animate = () => {
        let iteration = 0;
        if (soundOn) playSfx('scan');

        const interval = setInterval(() => {
            setDisplay(text.split('').map((letter, index) => {
                if (index < iteration) return text[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(''));

            if (iteration >= text.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
    };

    useEffect(() => {
        animate();
    }, [text]);

    return (
        <span onClick={animate} className="cursor-pointer inline-block">
            {display}
        </span>
    );
};

/* --- EMAIL ICON UTILITY --- */
function MailIcon({ size = 16, className = "" }) {
    return (
        <svg
            className={`w-${size} h-${size} ${className}`}
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}
