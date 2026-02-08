import React, { useState, useEffect, useRef, useMemo } from 'react';
import './visual-effects.css'; // Advanced visual effects
import './certificate.css'; // Certificate styling
import {
    Rocket, Calendar, ChevronRight, X, Lock,
    Volume2, VolumeX, Instagram, Linkedin, Globe, Cpu,
    Target, MapPin, ExternalLink, Maximize2,
    Scan, Terminal, Check, Activity, Fingerprint,
    Download, FileText, Menu, Shield, Radio,
    Wifi, MousePointer2, ChevronDown, Zap, Database,
    Code, Anchor, Settings, User, Users, Star, Mic,
    Play, Power, Hash, FileCode, Server, Timer, Aperture,
    Crosshair, Disc, Layers, Link, Radar, Monitor, AlertTriangle, FileWarning,
    Eye, Laptop, Smartphone
} from 'lucide-react';
import { playSfx } from './utils/soundEngine';
import { EVENTS_DATA, getLiveEvent, getAllMissions } from './data/events';
import { TEAM_DATA } from './data/team';

// Get the current live event for certificate title
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

// Space Background Component
const SpaceBackground = () => {
    // Generate random stars for static background
    const stars = useMemo(() => Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
    })), []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[#020406]"></div>
            <div className="nebula-layer"></div>

            {/* Stars */}
            {stars.map(star => (
                <div
                    key={star.id}
                    className="absolute bg-white rounded-full opacity-40 animate-pulse"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDuration: `${star.duration}s`,
                        animationDelay: `${star.delay}s`
                    }}
                ></div>
            ))}

            {/* Moving Particles */}
            <div className="particles-container">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3}px`,
                            height: `${Math.random() * 3}px`,
                            animationDuration: `${Math.random() * 10 + 15}s`,
                            animationDelay: `${Math.random() * 10}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Cyber Grid at bottom */}
            <div className="cyber-grid"></div>

            {/* Scanline Overlay */}
            <div className="scanline-overlay"></div>
        </div>
    );
};

/* --- APP CORE --- */
export default function App() {
    const [view, setView] = useState('intro');
    const [soundOn, setSoundOn] = useState(false);
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

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800;900&family=Rajdhani:wght@300;500;600;700&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
      
      :root {
        --bg-deep: #020305;
        --c-cyan: #00f0ff;
        --c-cyan-dim: rgba(0, 240, 255, 0.1);
        --c-blue: #0066ff;
        --c-glass: rgba(10, 20, 30, 0.65);
        --c-alert: #ff3333;
        --c-success: #00ff9d;
      }

      @keyframes globe { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
    `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    return (
        <div className="relative min-h-screen scanlines selection:bg-[#00f0ff] selection:text-black">
            <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d1b2a] via-[#030508] to-black"></div>
            <ParallaxField mousePos={mousePos} speed={view === 'intro' ? 10 : 0.5} />
            {view !== 'intro' && <GlobalHUD />}
            {view === 'intro' ? (
                <IntroSequence onComplete={() => setView('main')} soundOn={soundOn} setSoundOn={setSoundOn} />
            ) : (
                <SinglePageInterface soundOn={soundOn} />
            )}
        </div>
    );
}

function ParallaxField({ mousePos, speed }) {
    const canvasRef = useRef(null);
    useEffect(() => {
        const c = canvasRef.current;
        const ctx = c.getContext('2d');
        let w = c.width = window.innerWidth;
        let h = c.height = window.innerHeight;
        const stars = Array(200).fill().map(() => ({
            x: Math.random() * w, y: Math.random() * h, z: Math.random() * 2, o: Math.random()
        }));
        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            if (speed > 10) {
                ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
                ctx.fillRect(0, 0, w, h);
            }
            ctx.fillStyle = '#fff';
            stars.forEach(s => {
                if (speed > 1) {
                    s.x = (s.x - w / 2) * (1 + speed / 50) + w / 2;
                    s.y = (s.y - h / 2) * (1 + speed / 50) + h / 2;
                    if (s.x < 0 || s.x > w || s.y < 0 || s.y > h) {
                        s.x = Math.random() * w; s.y = Math.random() * h;
                    }
                }
                const mx = mousePos.x * 30 * s.z;
                const my = mousePos.y * 30 * s.z;
                ctx.globalAlpha = s.o;
                ctx.beginPath();
                if (speed > 5) {
                    ctx.moveTo(s.x, s.y);
                    ctx.lineTo(s.x + (s.x - w / 2) * 0.1, s.y + (s.y - h / 2) * 0.1);
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                } else {
                    ctx.arc(s.x + mx, s.y + my, s.z * 0.8, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            requestAnimationFrame(animate);
        };
        const id = requestAnimationFrame(animate);
        const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
    }, [mousePos, speed]);
    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none mix-blend-screen" />;
}

function GlobalHUD() {
    return (
        <div className="fixed inset-0 z-50 pointer-events-none hidden md:block">
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#00f0ff]/40 rounded-tl-lg"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#00f0ff]/40 rounded-tr-lg"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#00f0ff]/40 rounded-bl-lg"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#00f0ff]/40 rounded-br-lg"></div>
            <div className="absolute bottom-0 left-0 w-full h-8 bg-[#00f0ff]/5 border-t border-[#00f0ff]/10 flex items-center overflow-hidden">
                <div className="whitespace-nowrap animate-marquee font-mono-tech text-[10px] text-[#00f0ff]/80 flex gap-12">
                    <span>/// ORBIT_SYNC: OK</span>
                    <span>/// DATA_LATENCY: 12ms</span>
                    <span>/// PAYLOAD: READY</span>
                    <span>/// AUTH_LEVEL: L3</span>
                    <span>/// WEATHER: CLEAR</span>
                    <span>/// TRAJECTORY: OPTIMAL</span>
                    <span>/// NEXT LAUNCH: T-MINUS 14 DAYS</span>
                    <span>/// SECURE CHANNEL OPEN</span>
                </div>
            </div>
        </div>
    );
}

function IntroSequence({ onComplete, soundOn, setSoundOn }) {
    const [step, setStep] = useState(0);
    const [logs, setLogs] = useState([]);
    const logEndRef = useRef(null);
    const bootLogs = [
        "KERNEL_PANIC: RESOLVED",
        "MOUNTING_VOLUME: /root/dsdaea",
        "LOADING_MODULES: [PHYSICS, AVIONICS, UI]",
        "CHECKING_INTEGRITY... 100%",
        "ESTABLISHING_SAT_LINK...",
        "HANDSHAKE_INITIATED...",
        "ACCESSING_MAINFRAME...",
        "SYSTEM_READY."
    ];
    useEffect(() => {
        let delay = 0;
        bootLogs.forEach((log, i) => {
            setTimeout(() => {
                setLogs(prev => [...prev, `> ${log}`]);
                if (soundOn) playSfx('scan');
                if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }, delay);
            delay += 100;
        });
        setTimeout(() => setStep(1), delay + 300);
    }, [soundOn]);
    const handlePermit = (allowed) => {
        setSoundOn(allowed);
        if (allowed) playSfx('boot');
        setStep(2);
        setTimeout(onComplete, 1500);
    };
    return (
        <div className="fixed inset-0 z-[100] bg-black p-6 flex flex-col justify-center items-center">
            <div className="absolute inset-0 opacity-65 mix-blend-screen pointer-events-none">
                <MatrixRain />
            </div>
            {step === 0 && (
                <div className="w-full max-w-lg font-mono-tech text-xs text-[#00f0ff] opacity-80 h-64 overflow-hidden border border-[#00f0ff]/20 p-4 bg-black/80">
                    {logs.map((log, i) => <div key={i}>{log}</div>)}
                    <div ref={logEndRef} />
                </div>
            )}
            {step === 1 && (
                <div className="relative z-10 glass-panel p-10 max-w-lg w-full border border-[#00f0ff] clip-corner animate-in zoom-in duration-300 text-center">
                    <Fingerprint className="mx-auto text-[#00f0ff] animate-pulse mb-6" size={56} />
                    <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-widest">BIOMETRIC GATE</h1>
                    <p className="text-gray-400 font-mono-tech text-xs tracking-widest mb-8">SYSTEM INITIALIZATION REQUIRED</p>
                    <button onClick={() => handlePermit(true)} onMouseEnter={() => soundOn && playSfx('hover')} className="w-full py-5 bg-[#00f0ff] text-black font-bold font-display tracking-[0.25em] hover:bg-white transition-all clip-tech flex items-center justify-center gap-3 mb-4 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                        <Power size={18} /> INITIALIZE SYSTEM
                    </button>
                    <button onClick={() => handlePermit(false)} className="text-[10px] text-gray-600 hover:text-white font-mono-tech tracking-widest transition-colors flex items-center gap-1 justify-center mx-auto">
                        <Lock size={10} /> EXECUTE_SILENT_OVERRIDE
                    </button>
                </div>
            )}
            {step === 2 && (
                <div className="text-center z-10">
                    <div className="text-4xl md:text-6xl font-display font-black text-white tracking-widest animate-pulse glitch-text">ACCESS GRANTED</div>
                    <div className="w-64 h-1 bg-gray-900 mt-4 mx-auto overflow-hidden">
                        <div className="h-full bg-[#00f0ff] animate-[width_1s_ease-in-out_forwards]" style={{ width: '0%' }}></div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SinglePageInterface({ soundOn }) {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [showReg, setShowReg] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEventExpired, setIsEventExpired] = useState(false);
    const interact = () => { if (soundOn) playSfx('hover'); };
    const action = () => { if (soundOn) playSfx('click'); };
    const liveEvent = getLiveEvent();

    // Check if event has expired
    useEffect(() => {
        const checkExpired = () => {
            const now = new Date().getTime();
            const eventTime = new Date(liveEvent.eventDate).getTime();
            setIsEventExpired(eventTime - now <= 0);
        };
        checkExpired();
        const timer = setInterval(checkExpired, 1000);
        return () => clearInterval(timer);
    }, [liveEvent]);
    const scrollTo = (id) => {
        setMobileMenu(false);
        action();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <div className="min-h-screen relative text-gray-200 font-sans selection:bg-[#00f0ff] selection:text-black overflow-x-hidden">
            <SpaceBackground />
            <header className="fixed top-0 w-full z-50 h-14 sm:h-16 md:h-20 bg-[#030508]/90 backdrop-blur-md border-b border-[#00f0ff]/10 flex items-center justify-between px-3 sm:px-4 md:px-8">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0">
                        <img src="/logo.png" alt="DSDAEA Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-display font-bold text-white text-xs sm:text-sm md:text-lg tracking-widest leading-none truncate">DSDAEA</h1>
                        <p className="text-[7px] sm:text-[8px] md:text-[10px] text-[#00f0ff] font-mono-tech tracking-widest">PSG_TECH_NODE</p>
                    </div>
                </div>
                <nav className="hidden md:flex items-center gap-1">
                    {['MISSIONS', 'CREW', 'ARCHIVES'].map(item => (
                        <button key={item} onClick={() => scrollTo(item.toLowerCase())} onMouseEnter={interact} className="px-6 py-2 text-xs font-bold text-gray-400 hover:text-[#00f0ff] hover:bg-[#00f0ff]/5 font-mono-tech tracking-widest transition-all clip-corner">
                            {item}
                        </button>
                    ))}
                    <button onClick={() => { action(); setShowReg(true); }} className="ml-4 px-6 py-2 bg-[#00f0ff] text-black font-bold text-xs font-mono-tech tracking-widest clip-tech hover:bg-white transition-colors">
                        REGISTER
                    </button>
                </nav>
                <button className="md:hidden text-[#00f0ff] p-2 active:scale-95 flex-shrink-0" onClick={() => { action(); setMobileMenu(!mobileMenu); }}>
                    {mobileMenu ? <X size={20} /> : <Menu size={20} />}
                </button>
            </header>
            {mobileMenu && (
                <div className="fixed inset-0 z-40 bg-black/95 pt-16 sm:pt-20 px-4 sm:px-6 md:hidden animate-in slide-in-from-top-10 overflow-y-auto">
                    <div className="flex flex-col gap-5 sm:gap-6 py-6">
                        {['MISSIONS', 'CREW', 'ARCHIVES'].map(item => (
                            <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="text-left text-xl sm:text-2xl font-display font-bold text-white border-b border-[#00f0ff]/20 pb-4 flex justify-between items-center active:scale-98">
                                {item} <ChevronRight className="text-[#00f0ff]" size={24} />
                            </button>
                        ))}
                        <button onClick={() => { action(); setShowReg(true); setMobileMenu(false); }} className="w-full py-4 sm:py-5 bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] font-bold text-sm sm:text-base tracking-widest clip-tech active:scale-95 mt-4">
                            INITIATE REGISTRATION
                        </button>
                    </div>
                </div>
            )}
            <section className="min-h-screen flex items-center justify-center pt-20 sm:pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#00f0ff]/5 to-transparent opacity-50 pointer-events-none skew-x-12"></div>
                <div className="absolute top-32 left-10 text-[#00f0ff]/20 hidden md:block"><Crosshair size={48} /></div>
                <div className="absolute bottom-32 right-10 text-[#00f0ff]/20 hidden md:block"><Aperture size={48} /></div>
                <div className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-6 md:gap-8 items-center relative z-10">
                    <div className="md:col-span-7 space-y-3 sm:space-y-4 text-center md:text-left order-2 md:order-1 relative w-full max-w-full overflow-hidden">
                        {/* Live Event Title with Glitch */}
                        <div className="mb-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00f0ff]/10 border border-[#00f0ff]/30 rounded-sm mb-3">
                                <Activity size={10} className="text-[#00f0ff] animate-pulse" />
                                <span className="text-[8px] font-mono-tech text-[#00f0ff] tracking-widest">LIVE EVENT</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[0.9] tracking-tight mb-2">
                                {(() => {
                                    const words = liveEvent.title.split(' ');
                                    const midPoint = Math.ceil(words.length / 2);
                                    const firstPart = words.slice(0, midPoint).join(' ');
                                    const secondPart = words.slice(midPoint).join(' ');

                                    return (
                                        <>
                                            <span className="block text-white scale-y-110">
                                                <GlitchText text={firstPart} soundOn={soundOn} />
                                            </span>
                                            {secondPart && (
                                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff] scale-y-110">
                                                    <GlitchText text={secondPart} soundOn={soundOn} />
                                                </span>
                                            )}
                                        </>
                                    );
                                })()}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                <span className="px-3 py-1 bg-[#00f0ff]/20 text-[#00f0ff] text-[10px] font-mono-tech tracking-wider rounded-sm border border-[#00f0ff]/30">
                                    {liveEvent.type}
                                </span>
                                {liveEvent.instructor && (
                                    <span className="text-xs text-gray-400 font-mono-tech flex items-center gap-1">
                                        <User size={12} className="text-[#00f0ff]" /> {liveEvent.instructor}
                                    </span>
                                )}
                                {liveEvent.speaker && (
                                    <span className="text-xs text-gray-400 font-mono-tech flex items-center gap-1">
                                        <Mic size={12} className="text-[#00f0ff]" /> {liveEvent.speaker}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Comprehensive Event Details */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
                            {/* Date & Time */}
                            <div className="bg-[#0a1525]/60 backdrop-blur-sm border border-[#00f0ff]/20 rounded-sm p-2 sm:p-3">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                    <Calendar size={12} className="text-[#00f0ff]" />
                                    <span className="text-[7px] sm:text-[8px] font-mono-tech text-[#00f0ff] tracking-widest">SCHEDULE</span>
                                </div>
                                <div className="text-white font-display text-xs sm:text-sm font-bold">{liveEvent.date}</div>
                                <div className="text-gray-400 font-mono-tech text-[9px] sm:text-[10px]">{liveEvent.time}</div>
                            </div>

                            {/* Venue */}
                            <div className="bg-[#0a1525]/60 backdrop-blur-sm border border-[#00f0ff]/20 rounded-sm p-2 sm:p-3">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                    <MapPin size={12} className="text-[#00f0ff]" />
                                    <span className="text-[7px] sm:text-[8px] font-mono-tech text-[#00f0ff] tracking-widest">LOCATION</span>
                                </div>
                                <div className="text-white font-display text-xs sm:text-sm font-bold truncate">{liveEvent.venue}</div>
                                <div className="text-gray-400 font-mono-tech text-[9px] sm:text-[10px] truncate">{liveEvent.hall}</div>
                            </div>
                        </div>

                        {/* Event Description */}
                        <div className="relative border-l-2 border-[#00f0ff] pl-3 sm:pl-4 mb-3">
                            <p className="text-gray-300 font-mono-tech text-[10px] sm:text-[11px] leading-relaxed">
                                {liveEvent.details}
                            </p>
                        </div>

                        {/* Countdown - Mobile & Desktop */}
                        <div className="w-full md:w-auto">
                            <CountdownWidget />
                        </div>

                        {/* Mobile Register Button - After Countdown */}
                        <div className="md:hidden w-full">
                            <button
                                onClick={() => { if (!isEventExpired) { action(); setShowReg(true); } }}
                                disabled={isEventExpired}
                                className={`w-full py-4 font-bold font-display text-lg tracking-[0.3em] clip-tech transition-all shadow-[0_0_40px_rgba(0,240,255,0.6)] relative overflow-hidden ${isEventExpired
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                                    : 'bg-[#00f0ff] text-black active:bg-white'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isEventExpired ? <Lock size={20} /> : <Target size={20} />}
                                    {isEventExpired ? 'CLOSED' : 'REGISTER'}
                                </span>
                            </button>
                        </div>

                        {/* Desktop Register Button */}
                        <button
                            onClick={() => { if (!isEventExpired) { action(); setShowReg(true); } }}
                            onMouseEnter={interact}
                            disabled={isEventExpired}
                            className={`hidden md:block group relative px-14 py-6 font-bold font-display text-lg tracking-[0.25em] clip-tech transition-all w-auto shadow-[0_0_50px_rgba(0,240,255,0.4)] ${isEventExpired
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-[#00f0ff] text-black hover:bg-white active:scale-95'
                                }`}
                        >
                            <span className="flex items-center justify-center gap-3">
                                {isEventExpired ? <Lock size={24} /> : <Target size={24} />}
                                {isEventExpired ? 'CLOSED' : 'REGISTER'}
                            </span>
                            {!isEventExpired && <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>}
                        </button>
                    </div>
                    <div className="md:col-span-5 relative h-[250px] sm:h-[350px] md:h-[600px] flex items-center justify-center order-1 md:order-2 perspective-1000">
                        <div className="absolute w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[500px] md:h-[500px] border border-[#00f0ff]/20 rounded-full animate-spin-slow"></div>
                        <div className="absolute w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[380px] md:h-[380px] border border-dashed border-[#00f3ff]/40 rounded-full animate-spin-reverse"></div>
                        <div className="absolute w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[450px] md:h-[450px] border border-[#0066ff]/20 rounded-full animate-spin-slow" style={{ animationDuration: '15s' }}></div>
                        <div className="absolute inset-0 w-full h-[20%] bg-gradient-to-b from-[#00f0ff]/20 to-transparent animate-scan pointer-events-none"></div>
                        <div className="relative z-10 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full wireframe-globe opacity-80"></div>
                        <Rocket size={80} strokeWidth={1} className="sm:w-[100px] sm:h-[100px] md:w-[140px] md:h-[140px] text-white absolute z-20 drop-shadow-[0_0_30px_rgba(0,240,255,0.8)] animate-float" />
                        <div className="absolute top-5 sm:top-10 right-0 glass-panel p-2 sm:p-3 border-l-2 border-[#00f0ff] w-20 sm:w-28 md:w-32 hidden sm:block">
                            <div className="text-[8px] sm:text-[9px] text-[#00f0ff] font-mono-tech mb-1">VELOCITY</div>
                            <div className="text-white font-bold font-mono-tech text-xs sm:text-sm">MACH 10</div>
                        </div>
                        <div className="absolute bottom-14 sm:bottom-20 left-0 glass-panel p-2 sm:p-3 border-r-2 border-[#00f0ff] w-20 sm:w-28 md:w-32 text-right hidden sm:block">
                            <div className="text-[8px] sm:text-[9px] text-[#00f0ff] font-mono-tech mb-1">ALTITUDE</div>
                            <div className="text-white font-bold font-mono-tech text-xs sm:text-sm">400 KM</div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-10 bg-[#00f0ff]/5 border-t border-[#00f0ff]/10 flex items-center overflow-hidden">
                    <div className="whitespace-nowrap animate-marquee font-mono-tech text-[10px] text-[#00f0ff]/60">
              /// SYSTEM STATUS: NOMINAL /// WEATHER: CLEAR /// TRAJECTORY: OPTIMAL /// NEXT LAUNCH: T-MINUS 14 DAYS /// SECURE CHANNEL OPEN ///
                    </div>
                </div>
            </section>
            <section id="missions" className="py-20 px-6 relative bg-black/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-12 border-b border-[#00f0ff]/20 pb-4">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Active Missions</h2>
                            <p className="text-[#00f0ff] text-xs font-mono-tech tracking-[0.2em]">CURRENT OPERATIONS LOG</p>
                        </div>
                        <div className="hidden md:flex gap-1">
                            {[...Array(4)].map((_, i) => <div key={i} className="w-2 h-2 bg-[#00f0ff]/40"></div>)}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {EVENTS_DATA.map((event, index) => {
                            const imgUrl = event.image || SPACE_IMAGES[index % SPACE_IMAGES.length];
                            return (
                                <div key={event.id} onClick={() => { action(); setSelectedEvent({ ...event, image: imgUrl }); }} onMouseEnter={interact} className="glass-panel group relative overflow-hidden cursor-pointer min-h-[280px] sm:min-h-[320px] flex flex-col clip-corner hover:border-[#00f0ff] transition-all active:scale-98">
                                    <div className="h-32 sm:h-40 relative overflow-hidden bg-gray-900/50">
                                        <img src={imgUrl} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="" />
                                        <div className="absolute inset-0 bg-[#00f0ff]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute top-2 right-2 bg-black/80 text-[#00f0ff] text-[8px] sm:text-[9px] font-bold px-2 py-1 border border-[#00f0ff]/50 backdrop-blur-md z-20">{event.phase || "ACTIVE"}</div>
                                    </div>
                                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between relative bg-black/80 backdrop-blur-sm">
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-2 leading-tight group-hover:text-[#00f0ff] transition-colors">{event.title}</h3>
                                            <p className="text-[9px] sm:text-[10px] text-gray-400 font-mono-tech tracking-widest mb-3 sm:mb-4 flex items-center gap-2"><Zap size={10} /> {event.type}</p>
                                        </div>
                                        <div className="mt-auto space-y-2 border-t border-[#00f0ff]/10 pt-3">
                                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 text-[10px] sm:text-xs text-gray-400 font-mono-tech">
                                                <span className="flex items-center gap-2"><Calendar size={11} className="text-[#00f0ff]" /> {event.date}</span>
                                                <span className="flex items-center gap-2"><MapPin size={11} className="text-[#00f0ff]" /> {event.venue}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}          </div>
                </div>
            </section>
            <section id="crew" className="py-20 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-12 border-b border-[#00f0ff]/20 pb-4">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Command Crew</h2>
                            <p className="text-[#00f0ff] text-xs font-mono-tech tracking-[0.2em]">MISSION SPECIALISTS</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TEAM_DATA.map((member, index) => (
                            <div key={index} onMouseEnter={interact} className="glass-panel p-6 border border-[#00f0ff]/20 clip-hex group hover:bg-[#00f0ff]/5 transition-all duration-300 flex flex-col items-center text-center">
                                {/* Profile Photo */}
                                <div className="relative mb-4">
                                    <div className="w-32 h-32 rounded-full border-4 border-[#00f0ff]/30 overflow-hidden bg-[#00f0ff]/10 group-hover:border-[#00f0ff]/50 transition-all duration-300">
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User size={48} className="text-[#00f0ff]/50" />
                                            </div>
                                        )}
                                    </div>
                                    {/* Clearance Badge */}
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#00f0ff] text-black px-3 py-1 text-[10px] font-mono-tech font-bold tracking-wider">
                                        {member.clearance}
                                    </div>
                                </div>

                                {/* Member Info */}
                                <div className="w-full">
                                    <h3 className="text-lg font-display font-bold text-white group-hover:text-[#00f0ff] transition-colors mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-mono-tech uppercase tracking-wider mb-2">
                                        {member.role}
                                    </p>
                                    <div className="text-[10px] text-gray-600 font-mono-tech mb-3">
                                        ID: {member.id}
                                    </div>
                                    {member.dept && (
                                        <div className="text-[10px] text-gray-500 font-mono-tech mb-3">
                                            {member.dept}
                                        </div>
                                    )}

                                    {/* Contact Links */}
                                    {(member.email || member.linkedin) && (
                                        <div className="flex gap-3 justify-center mt-4 pt-3 border-t border-[#00f0ff]/10">
                                            {member.email && (
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="text-[#00f0ff] hover:text-white transition-colors"
                                                    title="Email"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                    </svg>
                                                </a>
                                            )}
                                            {member.linkedin && (
                                                <a
                                                    href={member.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#00f0ff] hover:text-white transition-colors"
                                                    title="LinkedIn"
                                                >
                                                    <Linkedin size={20} />
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
            <section id="archives" className="py-24 px-6 relative"><CertificateVault soundOn={soundOn} playSfx={playSfx} /></section>
            <footer className="bg-[#020305] border-t border-[#00f0ff]/20 pt-16 pb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-50"></div>
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 md:gap-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-4"><Rocket className="text-[#00f0ff]" size={24} /><h2 className="text-2xl font-display font-bold text-white">DSDAEA - PSGCT</h2></div>
                        <p className="text-gray-500 text-sm max-w-sm font-mono-tech leading-relaxed mb-4">🚀 Student-run Aerospace & Innovation Club.</p>
                        <p className="text-gray-600 text-xs leading-relaxed max-w-lg">We bring together engineers, designers, and innovators passionate about aeronautics, propulsion, UAVs, rocketry, and simulation technologies.</p>
                    </div>
                    <div>
                        <h4 className="text-[#00f0ff] text-xs font-bold font-display tracking-widest mb-4">SECURE COMMS</h4>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/aero_psg_tech/" target="_blank" rel="noreferrer" className="w-10 h-10 border border-gray-800 flex items-center justify-center text-gray-500 hover:text-[#00f0ff] hover:border-[#00f0ff] transition-all bg-[#00f3ff]/5"><Instagram size={18} /></a>
                            <a href="https://www.linkedin.com/company/dr-satish-dhawan-aerospace-engineering-association-psg-tech/" target="_blank" rel="noreferrer" className="w-10 h-10 border border-gray-800 flex items-center justify-center text-gray-500 hover:text-[#00f0ff] hover:border-[#00f0ff] transition-all bg-[#00f3ff]/5"><Linkedin size={18} /></a>
                        </div>
                    </div>
                    <div className="flex flex-col justify-end items-start md:items-end gap-4">
                        <div className="text-[10px] text-gray-700 font-mono-tech tracking-widest flex items-center gap-2"><Terminal size={12} /> SYSTEM_CORE_ACTIVE</div>
                        <a href="https://www.instagram.com/bazi.t_h/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 border border-[#00f0ff]/30 text-[#00f0ff] font-mono-tech text-[10px] tracking-widest hover:bg-[#00f0ff]/10 transition-colors"><Code size={12} /> DEV_NODE :: BASI</a>
                        <p className="text-[10px] text-gray-800 font-mono-tech mt-2">© 2026 DSDAEA // ALL RIGHTS RESERVED</p>
                    </div>
                </div>
            </footer>
            {showReg && <RegistrationModal onClose={() => setShowReg(false)} soundOn={soundOn} playSfx={playSfx} />}
            {selectedEvent && (
                <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
                    <div className="glass-panel w-full max-w-2xl border-t-2 border-t-[#00f0ff] relative flex flex-col overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-8 relative">
                            <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X /></button>
                            <div className="mb-6">
                                <div className="flex items-center gap-2 text-[#00f0ff] font-mono-tech text-xs mb-2"><Terminal size={12} /> <span>ACCESSING_FILE...</span></div>
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{selectedEvent.title}</h2>
                                <p className="text-gray-500 text-xs font-mono-tech tracking-widest uppercase">{selectedEvent.type} // PRIORITY ALPHA</p>
                            </div>
                            <div className="mb-6 w-full h-40 overflow-hidden relative border border-[#00f0ff]/30">
                                <img src={selectedEvent.image} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-[#00f0ff]/10"></div>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-[#00f0ff]/30 pl-4 mb-8 font-mono-tech">{selectedEvent.details}</p>
                            <button onClick={() => { if (soundOn) playSfx('click'); }} className="w-full bg-[#00f0ff] text-black font-bold font-display py-4 uppercase tracking-widest hover:bg-white transition-colors clip-tech flex justify-center gap-2">
                                <ExternalLink size={18} /> CONFIRM UPLINK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const GlitchText = ({ text, soundOn }) => {
    const [display, setDisplay] = useState(text);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

    const animate = () => {
        let interval;
        let iteration = 0;

        if (soundOn) playSfx('scan');

        clearInterval(interval);
        interval = setInterval(() => {
            setDisplay(text.split('').map((letter, index) => {
                if (index < iteration) return text[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(''));

            if (iteration >= text.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
    };

    useEffect(() => {
        // Only run once on initial page load
        animate();
    }, []);

    return (
        <span onClick={animate} className="cursor-pointer inline-block min-w-max">
            {display}
        </span>
    );
}

function CountdownWidget() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);
    const liveEvent = getLiveEvent();

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const eventTime = new Date(liveEvent.eventDate).getTime();
            const difference = eventTime - now;

            if (difference <= 0) {
                setIsExpired(true);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setIsExpired(false);
            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [liveEvent]);

    const TimeUnit = ({ value, label }) => (
        <div className="flex flex-col items-center flex-1 group cursor-default">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-[#0a1525]/60 backdrop-blur-sm border border-[#00f0ff]/30 flex items-center justify-center group-hover:border-[#00f0ff] transition-all clip-tech">
                <div className="absolute inset-0 bg-[#00f0ff]/5 group-hover:bg-[#00f0ff]/10 transition-all"></div>
                <div className="absolute inset-4 border border-dashed border-[#00f0ff]/10 rounded-full animate-reverse-spin-slow"></div>
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black text-white group-hover:text-[#00f0ff] transition-colors drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] z-10">{String(value).padStart(2, '0')}</span>
            </div>
            <div className="mt-2 md:mt-3 flex items-center gap-1 md:gap-2">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#00f0ff] rotate-45 animate-pulse"></div>
                <span className="text-[8px] sm:text-[9px] md:text-xs text-[#00f0ff] font-mono-tech tracking-[0.15em] md:tracking-[0.25em] font-bold uppercase">{label}</span>
            </div>
        </div>
    );

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6 border-b border-[#00f0ff]/20 pb-2">
                <div className="flex items-center gap-3 text-[#00f0ff]">
                    <div className="relative"><div className="absolute inset-0 bg-[#00f0ff] blur-sm animate-ping opacity-50"></div><Radar size={16} className="relative z-10" /></div>
                    <span className="text-xs font-mono-tech tracking-[0.2em] font-bold">IGNITION TIMER</span>
                </div>
                {/* Registration Status Badge */}
                <div className={`px-3 py-1 rounded-sm font-mono-tech text-[9px] tracking-widest font-bold ${isExpired
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse'
                    }`}>
                    {isExpired ? '● CLOSED' : '● OPEN'}
                </div>
            </div>
            <div className="flex justify-between gap-2 md:gap-6 w-full">
                <TimeUnit value={timeLeft.days} label="DAYS" /><div className="h-16 w-[1px] bg-[#00f0ff]/20 self-center hidden md:block"></div>
                <TimeUnit value={timeLeft.hours} label="HRS" /><div className="h-16 w-[1px] bg-[#00f0ff]/20 self-center hidden md:block"></div>
                <TimeUnit value={timeLeft.minutes} label="MIN" /><div className="h-16 w-[1px] bg-[#00f0ff]/20 self-center hidden md:block"></div>
                <TimeUnit value={timeLeft.seconds} label="SEC" />
            </div>
        </div>
    );
}

function CertificateVault({ soundOn, playSfx }) {
    const [roll, setRoll] = useState("");
    const [state, setState] = useState("IDLE"); // IDLE, SCAN, FOUND, ERROR
    const [certificateData, setCertificateData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const search = async () => {
        if (soundOn) playSfx('click');
        if (!roll.trim()) return;

        setState("SCAN");
        setErrorMessage("");

        try {
            // Import the API function
            const { fetchCertificateData } = await import('./utils/certificateAPI');

            // Fetch certificate data
            const data = await fetchCertificateData(roll);

            // Success!
            setCertificateData(data);
            setState("FOUND");
            if (soundOn) playSfx('success');
        } catch (error) {
            console.error('Certificate fetch error:', error);
            setErrorMessage(error.message || "Certificate not found");
            setState("ERROR");
            if (soundOn) playSfx('denied');
        }
    };

    const handleDownloadJPG = async () => {
        if (soundOn) playSfx('click');

        try {
            // Dynamically import html2canvas
            const html2canvas = (await import('html2canvas')).default;

            // Get the certificate element
            const certificateElement = document.getElementById('certificate-for-download');

            if (!certificateElement) {
                alert('Certificate not found!');
                return;
            }

            // Capture the certificate as canvas with high quality
            const canvas = await html2canvas(certificateElement, {
                scale: 2, // Higher quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#FFFDF5',
                width: 1122, // A4 landscape in pixels at 96 DPI
                height: 794
            });

            // Convert canvas to blob and download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Certificate_${certificateData.rollNo}_${certificateData.name.replace(/\s+/g, '_')}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 'image/jpeg', 0.95);

            if (soundOn) playSfx('success');
        } catch (error) {
            console.error('Error downloading certificate:', error);
            alert('Failed to download certificate. Please try again.');
            if (soundOn) playSfx('denied');
        }
    };

    const handlePrint = () => {
        if (soundOn) playSfx('click');

        // Simple and reliable: just trigger print
        // All show/hide logic is in CSS @media print
        console.log('Triggering print...');

        // Small delay to ensure any animations complete
        setTimeout(() => {
            window.print();
        }, 100);
    };

    const reset = () => {
        setState("IDLE");
        setRoll("");
        setCertificateData(null);
        setErrorMessage("");
    };

    return (
        <>
            <div className="max-w-4xl mx-auto w-full relative">
                <div className="absolute -top-10 left-0 text-[#00f0ff]/20 text-[100px] font-display font-black opacity-10 pointer-events-none">VAULT</div>
                <div className={`glass-panel p-8 md:p-12 border-t-2 border-[#00f0ff] relative overflow-hidden transition-all ${state === "ERROR" ? "border-red-500 animate-shake" : ""}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={120} /></div>
                    <div className="relative z-10 text-center mb-10"><h2 className="text-3xl font-display font-bold text-white mb-2">Data Archives</h2><p className="text-[#00f0ff] text-xs font-mono-tech tracking-[0.2em]">CERTIFICATE VERIFICATION PROTOCOL</p></div>

                    {state === "IDLE" || state === "ERROR" ? (
                        <div className="max-w-md mx-auto flex flex-col gap-6">
                            <div className="relative group">
                                <Scan className={`absolute left-4 top-1/2 -translate-y-1/2 ${state === "ERROR" ? "text-red-500" : "text-[#00f0ff]"}`} size={20} />
                                <input
                                    value={roll}
                                    onChange={e => setRoll(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && search()}
                                    className={`w-full bg-black/60 border py-4 pl-12 pr-4 text-white font-mono-tech placeholder:text-gray-700 focus:outline-none uppercase tracking-widest text-lg ${state === "ERROR" ? "border-red-500" : "border-gray-700 focus:border-[#00f0ff]"}`}
                                    placeholder="ROLL NO. (Ex: 25U201)"
                                />
                            </div>
                            <button
                                onClick={search}
                                className={`text-black font-bold py-4 font-display uppercase tracking-[0.2em] hover:bg-white transition-colors clip-tech ${state === "ERROR" ? "bg-red-500" : "bg-[#00f0ff]"}`}
                            >
                                {state === "ERROR" ? "RETRY SCAN" : "INITIATE SCAN"}
                            </button>
                            {state === "ERROR" && (
                                <div className="flex items-center justify-center gap-2 text-red-500 font-mono-tech text-xs bg-red-900/10 p-3 border border-red-500/30 text-center animate-pulse">
                                    <AlertTriangle size={14} /> {errorMessage || "ACCESS DENIED: ID NOT FOUND"}
                                </div>
                            )}
                        </div>
                    ) : state === "SCAN" ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 border-4 border-[#00f0ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-[#00f0ff] font-mono-tech text-xs animate-pulse">DECRYPTING ARCHIVES...</p>
                        </div>
                    ) : state === "FOUND" && certificateData ? (
                        <div className="space-y-6">
                            {/* Certificate Info Card - Mobile Optimized */}
                            <div className="bg-[#00f0ff]/5 border border-[#00f0ff]/20 p-4 sm:p-6 flex flex-col items-center gap-4 sm:gap-6 animate-in zoom-in duration-300 rounded-lg sm:rounded-none">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#00f0ff]/10 flex items-center justify-center border border-[#00f0ff]/30 rounded-lg">
                                    <FileText size={28} className="text-[#00f0ff] sm:w-8 sm:h-8" />
                                </div>
                                <div className="flex-1 text-center w-full">
                                    <h4 className="font-display font-bold text-white text-base sm:text-lg mb-2">CERTIFICATE LOCATED</h4>
                                    <p className="text-gray-400 text-xs sm:text-sm font-mono-tech break-words px-2">
                                        {certificateData.name}
                                    </p>
                                    <p className="text-gray-500 text-[10px] sm:text-xs font-mono-tech mt-1">
                                        ID: {certificateData.rollNo} • {certificateData.year} • {certificateData.dept}
                                    </p>
                                </div>

                                {/* Mobile-Optimized Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={handlePrint}
                                        className="bg-green-600 hover:bg-green-500 active:bg-green-700 active:scale-95 text-white px-6 py-4 sm:py-3 font-bold text-sm sm:text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 clip-tech shadow-lg shadow-green-600/30 min-h-[48px]"
                                    >
                                        <Download size={16} /> DOWNLOAD PDF
                                    </button>
                                    <button
                                        onClick={reset}
                                        className="bg-gray-700 hover:bg-gray-600 active:bg-gray-800 active:scale-95 text-white px-6 py-4 sm:py-3 font-bold text-sm sm:text-xs uppercase tracking-widest transition-all clip-tech min-h-[48px]"
                                    >
                                        NEW SCAN
                                    </button>
                                </div>
                            </div>

                            {/* Certificate Preview - Mobile Optimized */}
                            <div className="border border-[#00f0ff]/20 p-3 sm:p-4 bg-black/20 rounded-lg sm:rounded-none">
                                <p className="text-[#00f0ff] text-xs font-mono-tech tracking-widest mb-3 sm:mb-4 text-center">CERTIFICATE PREVIEW</p>
                                <div className="overflow-x-auto overflow-y-hidden max-h-[400px] sm:max-h-[500px] md:max-h-[600px] -mx-3 sm:mx-0">
                                    <div className="min-w-[280px] sm:min-w-[300px] px-3 sm:px-0" id="certificate-for-download">
                                        <CertificateTemplate
                                            data={certificateData}
                                            eventTitle={CURRENT_EVENT.certificateTitle || "AEROSPACE EVENT 2026"}
                                        />
                                    </div>
                                </div>
                                <p className="text-gray-500 text-[10px] font-mono-tech text-center mt-3">Scroll to view full certificate</p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Hidden full certificate for printing - MUST be direct child of root */}
            {state === "FOUND" && certificateData && (
                <div id="print-certificate" style={{ display: 'none' }}>
                    <CertificateTemplate
                        data={certificateData}
                        eventTitle={CURRENT_EVENT.certificateTitle || "AEROSPACE EVENT 2026"}
                    />
                </div>
            )}
        </>
    );
}

// Certificate Template Component (embedded)
function CertificateTemplate({ data, eventTitle = "AEROSPACE EVENT 2026" }) {
    if (!data) return null;

    const isParticipation = !data.place || data.place.toLowerCase().includes('participated');
    const subtitle = isParticipation ? "OF PARTICIPATION" : "OF MERIT";

    let actionText = "actively <b>participated</b> in";
    if (!isParticipation) {
        const cleanPlace = data.place?.replace(/Achieved |Winner - /gi, '') || '';
        actionText = `secured <b style="color:var(--navy); border-bottom:1px solid var(--gold);">${cleanPlace}</b> in`;
    }

    return (
        <div className="certificate-wrapper">
            <img src="/collegelogo2.png" className="cert-watermark" alt="Watermark" />
            <div className="cert-frame"></div>
            <div className="cert-corner tl"></div>
            <div className="cert-corner tr"></div>
            <div className="cert-corner bl"></div>
            <div className="cert-corner br"></div>

            <div className="cert-layout">
                <div className="cert-header">
                    <img src="/collegelogo2.png" className="cert-logo" alt="College Logo" />
                    <div className="cert-inst-title">
                        <h1>Dr. Satish Dhawan Aerospace<br />Engineering Association</h1>
                        <h2>PSG College of Technology</h2>
                    </div>
                    <img src="/logo-removebg-preview.png" className="cert-logo" alt="Association Logo" />
                </div>

                <div className="cert-body">
                    <div className="cert-main-heading">Certificate</div>
                    <div className="cert-sub-heading">{subtitle}</div>
                    <div className="cert-text">This is proudly presented to</div>
                    <div className="cert-name">{data.name}</div>
                    <div className="cert-details">
                        (Roll No: <b>{data.rollNo}</b>), a <b>{data.year}</b> year student of the<br />
                        Department of <b>{data.dept}</b>,<br />
                        has <span dangerouslySetInnerHTML={{ __html: actionText }} /> the event
                    </div>
                    <div className="cert-event">{eventTitle}</div>
                    <div className="cert-organizer">
                        organized by <b>Dr. Satish Dhawan Aerospace Engineering Association</b>,<br />
                        PSG College of Technology
                    </div>
                </div>

                <div className="cert-footer">
                    <div className="cert-sig-box">
                        <div className="cert-sig-line"></div>
                        <div className="cert-sig-role">Faculty Advisor</div>
                        <div className="cert-sig-subtitle">Aerospace Association</div>
                    </div>
                    <div className="cert-seal-wrapper">
                        <div className="cert-seal">★</div>
                        <div className="cert-ribbon">EXCELLENCE</div>
                    </div>
                    <div className="cert-sig-box">
                        <div className="cert-sig-line"></div>
                        <div className="cert-sig-role">Chief Secretary</div>
                        <div className="cert-sig-subtitle">Aerospace Association</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MatrixRain() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const c = canvasRef.current;
        const ctx = c.getContext('2d');
        let w = c.width = window.innerWidth;
        let h = c.height = window.innerHeight;
        const cols = Math.floor(w / 20);
        const ypos = Array(cols).fill(0);
        const matrix = () => {
            ctx.fillStyle = '#0001'; ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#00f0ff'; ctx.font = '10pt monospace';
            ypos.forEach((y, i) => {
                const text = String.fromCharCode(Math.random() * 128);
                const x = i * 20; ctx.fillText(text, x, y);
                if (y > 100 + Math.random() * 10000) ypos[i] = 0; else ypos[i] = y + 20;
            });
        };
        const interval = setInterval(matrix, 50);
        return () => clearInterval(interval);
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20" />;
}

function RegistrationModal({ onClose, soundOn, playSfx }) {
    const [step, setStep] = useState(1);
    const [rollInput, setRollInput] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [data, setData] = useState(null);

    const parseRollNumber = (rollNo) => {
        const r = rollNo.toUpperCase();
        const batch = parseInt(r.substring(0, 2));
        let year = "UNKNOWN";

        // Calculate year of study
        if (!isNaN(batch)) {
            const now = new Date();
            const currentYear = now.getFullYear();

            // Extract the 4th digit to check for lateral entry
            // Roll format: 25U201 or 25U401
            // The digit after the letter(s) indicates entry type
            const rollDigits = r.match(/[A-Z]+(\d)/);
            const fourthDigit = rollDigits ? parseInt(rollDigits[1]) : 0;
            const isLateralEntry = fourthDigit === 4;

            // Base year calculation
            let yearOfStudy = (now.getMonth() >= 6 ? currentYear : currentYear - 1) - (2000 + batch) + 1;

            // Lateral entry students skip 1st year, so they're always +1 year ahead
            if (isLateralEntry) {
                yearOfStudy += 1;
            }

            // Assign year label
            if (yearOfStudy === 1) year = "1st Year";
            else if (yearOfStudy === 2) year = "2nd Year";
            else if (yearOfStudy === 3) year = "3rd Year";
            else if (yearOfStudy === 4) year = "4th Year";
            else if (yearOfStudy === 5) year = "5th Year";
            else year = "Alumni";
        }

        // Extract department code (can be 1 or 2 characters)
        const match = r.match(/[0-9]+([A-Z]+)[0-9]+/);
        const code = match ? match[1] : '?';

        // Comprehensive department and degree mapping
        const deptMapping = {
            // B.E. Programs
            'A': { dept: 'Automobile Engineering', degree: 'B.E.' },
            'D': { dept: 'Biomedical Engineering', degree: 'B.E.' },
            'C': { dept: 'Civil Engineering', degree: 'B.E.' },
            'Z': { dept: 'Computer Science & Engineering', degree: 'B.E.' },
            'N': { dept: 'Computer Science (AI & ML)', degree: 'B.E.' },
            'E': { dept: 'Electrical & Electronics', degree: 'B.E.' },
            'L': { dept: 'Electronics & Communication', degree: 'B.E.' },
            'U': { dept: 'Instrumentation & Control', degree: 'B.E.' },
            'M': { dept: 'Mechanical Engineering', degree: 'B.E.' },
            'Y': { dept: 'Metallurgical Engineering', degree: 'B.E.' },
            'P': { dept: 'Production Engineering', degree: 'B.E.' },
            'R': { dept: 'Robotics & Automation', degree: 'B.E.' },

            // B.Tech Programs
            'B': { dept: 'Bio Technology', degree: 'B.Tech' },
            'H': { dept: 'Fashion Technology', degree: 'B.Tech' },
            'I': { dept: 'Information Technology', degree: 'B.Tech' },
            'T': { dept: 'Textile Technology', degree: 'B.Tech' },

            // B.Sc. Programs
            'S': { dept: 'Applied Science', degree: 'B.Sc.' },
            'X': { dept: 'Science', degree: 'B.Sc.' },

            // M.E. Programs (2-letter codes)
            'AE': { dept: 'Automotive Engineering', degree: 'M.E.' },
            'NB': { dept: 'Biometrics & Cybersecurity', degree: 'M.E.' },
            'ZC': { dept: 'Computer Science & Engineering', degree: 'M.E.' },
            'UC': { dept: 'Control Systems', degree: 'M.E.' },
            'EE': { dept: 'Embedded & Real-Time Systems', degree: 'M.E.' },
            'MD': { dept: 'Engineering Design', degree: 'M.E.' },
            'MN': { dept: 'Manufacturing Engineering', degree: 'M.E.' },
            'PP': { dept: 'Power Electronics', degree: 'M.E.' },
            'ED': { dept: 'Energy Engineering', degree: 'M.E.' },
            'CS': { dept: 'Communication Systems', degree: 'M.E.' },
            'LV': { dept: 'VLSI Design', degree: 'M.E.' },
            'BT': { dept: 'Bio Technology', degree: 'M.E.' },
            'LN': { dept: 'Engineering', degree: 'M.E.' },
            'TT': { dept: 'Thermal Engineering', degree: 'M.E.' },
            'SE': { dept: 'Software Engineering', degree: 'M.E.' },

            // MCA
            'MX': { dept: 'Computer Applications', degree: 'MCA' },

            // M.Sc. Programs
            'SA': { dept: 'Applied Science', degree: 'M.Sc.' },
            'FD': { dept: 'Food Science', degree: 'M.Sc.' },
            'XW': { dept: 'Science', degree: 'M.Sc.' },
            'XT': { dept: 'Science & Technology', degree: 'M.Sc.' },
            'XD': { dept: 'Data Science', degree: 'M.Sc.' },
            'XC': { dept: 'Science', degree: 'M.Sc.' },

            // MBA Programs
            'GM': { dept: 'Business Administration', degree: 'MBA' },
            'GW': { dept: 'Business Administration', degree: 'MBA' },
        };

        const info = deptMapping[code] || { dept: 'UNKNOWN', degree: 'UNKNOWN' };

        return {
            name: nameInput,
            roll: r,
            year,
            dept: info.dept,
            degree: info.degree
        };
    };

    const process = (e) => {
        e.preventDefault();
        if (soundOn) playSfx('click');
        if (!nameInput || !rollInput) return;
        setStep(2);
        setTimeout(() => {
            const parsed = parseRollNumber(rollInput);
            setData(parsed);
            if (soundOn) playSfx('success');
            setStep(3);
            // Submit and close after showing completed screen
            setTimeout(() => {
                submitToGoogleForm(parsed);
            }, 2500); // Show completed screen for 2.5s before closing
        }, 2000);
    };

    const submitToGoogleForm = (submitData) => {
        const dataToSubmit = submitData || data;
        if (soundOn) playSfx('deploy');

        // Google Form submission
        const formUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSc_R9SnfJLULefvQEar6xIjnKQPnG1EEUyUmMBOj2q3INnK6w/formResponse';
        const formData = new FormData();

        // Map parsed data to Google Form field names
        formData.append('entry.1980545502', dataToSubmit.roll);
        formData.append('entry.1735108337', dataToSubmit.name);
        formData.append('entry.235212158', dataToSubmit.year);
        formData.append('entry.1142478584', dataToSubmit.dept);
        formData.append('entry.520065292', 'General Registration');

        // Submit to Google Form
        fetch(formUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        }).catch(() => { });

        // Stay on step 3 (registration completed) - user closes manually
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4">
            <div className="w-full max-w-lg glass-panel border-t-4 border-t-[#00f0ff] relative overflow-hidden max-h-[95vh] overflow-y-auto">
                {step === 3 && (
                    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                        <MatrixRain />
                    </div>
                )}
                <div className="relative z-10 p-6 sm:p-8 md:p-12">
                    <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-white"><X size={20} /></button>
                    {step === 1 && (
                        <form onSubmit={process} className="space-y-5 sm:space-y-6">
                            <div className="flex items-center gap-3 text-[#00f0ff] mb-6 sm:mb-8">
                                <Fingerprint size={28} className="sm:hidden" />
                                <Fingerprint size={32} className="hidden sm:block" />
                                <div>
                                    <h3 className="font-display font-bold text-lg sm:text-xl text-white">BIOMETRIC ENTRY</h3>
                                    <p className="text-[9px] sm:text-[10px] font-mono-tech text-gray-500 tracking-wider">SECURE REGISTRATION PORTAL</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] sm:text-[10px] text-[#00f0ff] font-mono-tech mb-1 block tracking-wider">FULL DESIGNATION</label>
                                    <input required value={nameInput} onChange={e => setNameInput(e.target.value)} className="w-full bg-black/50 border border-gray-700 p-3 sm:p-4 text-sm sm:text-base text-white focus:border-[#00f0ff] outline-none font-mono-tech" placeholder="NAME" />
                                </div>
                                <div>
                                    <label className="text-[9px] sm:text-[10px] text-[#00f0ff] font-mono-tech mb-1 block tracking-wider">IDENTIFICATION CODE</label>
                                    <input required value={rollInput} onChange={e => setRollInput(e.target.value)} className="w-full bg-black/50 border border-gray-700 p-3 sm:p-4 text-sm sm:text-base text-white focus:border-[#00f0ff] outline-none font-mono-tech uppercase" placeholder="REG NO. (Eg: 25U201)" />
                                </div>
                            </div>
                            <button className="w-full bg-[#00f0ff] text-black font-bold py-3 sm:py-4 mt-4 sm:mt-6 font-display text-sm sm:text-base tracking-widest clip-tech hover:bg-white transition-colors active:scale-95">TRANSMIT DATA</button>
                        </form>
                    )}
                    {step === 2 && (<div className="text-center py-12"><div className="text-[#00f0ff] font-mono-tech text-xs space-y-2"><p className="animate-pulse">RUNNING IDENTITY_PROTOCOL_V4...</p></div></div>)}
                    {step === 3 && data && (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border-2 border-green-500/50 shadow-[0_0_30px_#00ff00]">
                                <Check size={40} />
                            </div>
                            <h3 className="text-2xl sm:text-3xl text-white font-display font-bold mb-2 tracking-wider">REGISTRATION COMPLETED!</h3>
                            <p className="text-green-500 font-mono-tech text-[10px] sm:text-xs mb-6 tracking-widest animate-pulse">DATA TRANSMITTED SUCCESSFULLY</p>

                            <div className="bg-gradient-to-br from-black/90 to-[#00f0ff]/5 border border-[#00f0ff]/30 rounded-lg p-4 sm:p-6 text-left mb-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f0ff]/5 rounded-full blur-3xl"></div>
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-start gap-3 pb-3 border-b border-[#00f0ff]/10">
                                        <div className="w-8 h-8 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center flex-shrink-0 mt-1">
                                            <User size={16} className="text-[#00f0ff]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[9px] sm:text-[10px] text-gray-500 font-mono-tech tracking-widest mb-1">CADET NAME</div>
                                            <div className="text-sm sm:text-base text-white font-display font-bold break-words">{data.name}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 pb-3 border-b border-[#00f0ff]/10">
                                        <div className="w-8 h-8 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Hash size={16} className="text-[#00f0ff]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[9px] sm:text-[10px] text-gray-500 font-mono-tech tracking-widest mb-1">ROLL NUMBER</div>
                                            <div className="text-sm sm:text-base text-[#00f0ff] font-mono-tech font-bold tracking-wider break-all">{data.roll}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-[#00f0ff]/10">
                                        <div className="flex items-start gap-2">
                                            <div className="w-8 h-8 rounded bg-green-500/10 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                                                <FileText size={14} className="text-green-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[9px] sm:text-[10px] text-gray-500 font-mono-tech tracking-widest mb-1">DEGREE</div>
                                                <div className="text-xs sm:text-sm text-white font-display font-semibold">{data.degree}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Layers size={14} className="text-blue-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[9px] sm:text-[10px] text-gray-500 font-mono-tech tracking-widest mb-1">YEAR</div>
                                                <div className="text-xs sm:text-sm text-white font-display font-semibold">{data.year}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Cpu size={16} className="text-purple-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[9px] sm:text-[10px] text-gray-500 font-mono-tech tracking-widest mb-1">DEPARTMENT</div>
                                            <div className="text-xs sm:text-sm text-white font-display font-semibold break-words leading-snug">{data.dept}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
