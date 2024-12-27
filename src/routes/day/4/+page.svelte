<script>
    import Monitor from './shrm.svelte'

    let beat = $state(0);

    /** @type {number[]} */
    let lastMinute = $state([]);
    /** @type {number[]} */
    let beforeMinute = [];
    /** @type {number[]} */
    let lastHour = $state([]);

    const height = 150;
    let width = $state(0);
    
    let interval = setInterval(() => {
        fetch('https://advent.sveltesociety.dev/data/2023/day-four.json')
            .then((result) => result.json())
            .then(({ heartRate }) => {
                beat = heartRate;
                lastMinute.push(heartRate);

                if (lastMinute.length > 60) {
                    // @ts-ignore
                    beforeMinute.push(lastMinute.shift());
                    
                    if (beforeMinute.length === 60) {
                        lastHour.push(beforeMinute.reduce((sum, val) => sum + val, 0) / 60);
                        beforeMinute.length = 0;
                    }
                }
            });
    }, 1000);
</script>

<h3>Day Four</h3>
<p>Santa’s Heart Rate Monitor™</p>

<button onclick={() => {
    clearInterval(interval);
}}>STOP</button>

<p>CURRENT: {beat}</p>

<div bind:clientWidth={width}>
    <p>MINUTE in seconds</p>
    <Monitor
        {width}
        {height}
        history={lastMinute}
    />
    
    <p>HOUR in minutes</p>
    <Monitor
        {width}
        {height}
        history={lastHour}
    />
</div>

<style>
    p {
        margin: var(--pico-typography-spacing-vertical) 0 0;
    }
</style>
