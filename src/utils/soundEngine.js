export const playSfx = (type = 'click') => {
    try {
        const audioMap = {
            hover: '/sounds/hover.mp3',
            click: '/sounds/click.mp3',
            success: '/sounds/deploy.mp3',
            denied: '/sounds/beeps2.ogg',
            boot: '/sounds/start.mp3',
            scan: '/sounds/typing.mp3',
            modal: '/sounds/enter-project.ogg',
            close: '/sounds/leave-project.ogg'
        };

        const file = audioMap[type];
        if (file) {
            const audio = new Audio(file);
            audio.volume = 0.4;
            audio.play().catch(e => console.debug("Audio play blocked:", e));
        }
    } catch (e) {
        console.warn("Audio error:", e);
    }
};
