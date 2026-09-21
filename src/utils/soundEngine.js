let isMuted = false;

export const setMuted = (muted) => {
    isMuted = muted;
};

export const getMuted = () => isMuted;

export const playSfx = (type = 'click') => {
    if (isMuted) return;

    try {
        const audioMap = {
            hover: '/sounds/hover.mp3',
            click: '/sounds/click.mp3',
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
            audio.volume = 0.35;
            audio.play().catch(e => console.debug("Audio play blocked:", e));
        }
    } catch (e) {
        console.warn("Audio error:", e);
    }
};
