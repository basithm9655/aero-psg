/**
 * Next-Gen Aerospace Sound & Haptics Engine - DSDAEA PSG TECH
 * Hybrid architecture:
 * 1. Web Audio API synthesizer for instant 0ms latency procedural telemetry SFX
 *    (works 100% offline, zero network latency, never blocked by missing files)
 * 2. High-fidelity audio file playback from /sounds/ for atmospheric soundscapes
 * 3. Mobile tactile haptic feedback (navigator.vibrate) on supported devices
 */

let isMuted = false;
let audioCtx = null;

// Initialize or resume Web Audio Context on first user gesture
function getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

export const setMuted = (muted) => {
    isMuted = muted;
};

export const getMuted = () => isMuted;

// Subtle mobile haptic feedback
function triggerHaptic(pattern = 12) {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
            navigator.vibrate(pattern);
        } catch (_) {}
    }
}

/**
 * Procedural Web Audio Sound Synthesizers
 * Generates futuristic sci-fi aerospace audio directly with math oscillators
 */
function playSynthSfx(type) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (type) {
        case 'click': {
            // Crisp dual-tone digital relay click
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.05);
            triggerHaptic(8);
            break;
        }

        case 'hover': {
            // High-frequency subtle telemetry blip
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(2200, now);
            osc.frequency.exponentialRampToValueAtTime(2800, now + 0.03);

            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.03);
            break;
        }

        case 'success': {
            // Ascending resonant 4-chord harmonic chime
            const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            freqs.forEach((freq, idx) => {
                const noteTime = now + idx * 0.06;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0, noteTime);
                gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.015);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 0.36);
            });
            triggerHaptic([20, 40, 20]);
            break;
        }

        case 'denied': {
            // Two-tone warning buzzer
            [0, 0.09].forEach((offset) => {
                const noteTime = now + offset;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(160, noteTime);
                osc.frequency.linearRampToValueAtTime(110, noteTime + 0.07);

                gain.gain.setValueAtTime(0.2, noteTime);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.07);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 0.07);
            });
            triggerHaptic([40, 60, 40]);
            break;
        }

        case 'telemetry': {
            // Radar frequency sweep
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.linearRampToValueAtTime(1600, now + 0.08);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.08);
            triggerHaptic(10);
            break;
        }

        case 'boot': {
            // Deep sub-bass energy surge followed by rising warp tone
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(65, now);
            osc.frequency.exponentialRampToValueAtTime(520, now + 0.4);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.45);
            triggerHaptic([30, 30, 60]);
            break;
        }

        case 'scan': {
            // Rapid high-tech data packet stream
            for (let i = 0; i < 3; i++) {
                const noteTime = now + i * 0.025;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1800 + Math.random() * 600, noteTime);

                gain.gain.setValueAtTime(0.12, noteTime);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.02);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 0.02);
            }
            break;
        }

        case 'modal': {
            // Sci-fi pressure equalization sweep
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(940, now + 0.18);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.2);
            triggerHaptic(15);
            break;
        }

        default:
            break;
    }
}

/**
 * Universal Master Sound Dispatcher
 */
export const playSfx = (type = 'click') => {
    if (isMuted) return;

    try {
        // 1. Play zero-latency procedural synth audio immediately
        playSynthSfx(type);

        // 2. Play layered recorded sound file when available for extra richness
        const audioMap = {
            click: '/sounds/click.mp3',
            hover: '/sounds/hover.mp3',
            success: '/sounds/deploy.mp3',
            denied: '/sounds/beeps2.ogg',
            boot: '/sounds/start.mp3',
            scan: '/sounds/typing.mp3',
            modal: '/sounds/enter-project.ogg',
            close: '/sounds/leave-project.ogg',
            expand: '/sounds/expand.mp3',
            fade: '/sounds/fade.mp3',
            alert: '/sounds/beeps3.ogg',
            telemetry: '/sounds/click-project.ogg',
            logo: '/sounds/logo.mp3',
            manifesto: '/sounds/manifesto.ogg'
        };

        const file = audioMap[type];
        if (file) {
            const audio = new Audio(file);
            audio.volume = type === 'hover' ? 0.15 : 0.3;
            audio.play().catch(() => {});
        }
    } catch (_) {}
};
