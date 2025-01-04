export function seconder() {
    let beginning = 0;
    let interval = 0;
    
    return {
        /** @param {Function} [callback] */
        start: function(callback) {
            this.stop();

            beginning = Date.now();

            if (callback) {
                interval = setInterval(callback, 1000);
            }
        },
        stop: function() {
            beginning = 0;
            clearInterval(interval);
        },
        // TODO: pause()
        get isRunning() {
            return !!beginning;
        },
        get display() {
            const time = Math.trunc((Date.now() - beginning) / 1000);
            const seconds = time % 60;
            const minutes = Math.trunc((time) / 60) % 60;
            const hours = Math.trunc((time) / 3600);
            
            if (hours) {
                return `${hours}:${pad(minutes)}:${pad(seconds)}`;
            } else if (minutes) {
                return `${pad(minutes)}:${pad(seconds)}`;
            } else {
                return `${pad(seconds)}`;
            } 
        }
    };
}

/** @param {number} number */
function pad(number) {
    return `${number}`.padStart(2, '0');
}
