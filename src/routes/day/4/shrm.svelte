<script>
    /** @type {{width:number, height:number, history:number[]}} */
    let {width, height, history } = $props();

    let hisLen = $derived(history.length);
    let avg = $derived(hisLen ? Math.round(history.reduce((sum, beat) => sum + beat, 0) / hisLen) : '--');
    let jump = $derived(width / (60 - 1));
    let d = $derived(path(history));

    /** @param {number[]} history  */
    function path(history) {
        if (hisLen < 2) return '';

        // @ts-ignore
        let d = `M${width},${height - history.at(-1)} L`;
        let w = width - jump;
        let l = hisLen - 1;
        while (w > 0 && l > 0) {
            d += ` ${w},${height - history[l]}`;
            w -= jump;
            l--;
        }

        return d;
    }
</script>

<svg
    {width}
    height={height + 25}
>
    <path
        {d}
    />
    <text x="5" y="5">avg: {avg}</text>
    <!-- x axis -->
    <line
        x1={0}
        y1={height}
        x2={width}
        y2={height}
    />
    <line
        x1={1}
        y1={height + 10}
        x2={1}
        y2={height}
    />
    <text
        x={5}
        y={height + 5}
        text-anchor="start"
    >60</text>
    <line
        x1={width / 2}
        y1={height + 10}
        x2={width / 2}
        y2={height}
    />
    <text
        x={width / 2}
        y={height + 5}
        text-anchor="middle"
    >30</text>
    <line
        x1={width - 1}
        y1={height + 10}
        x2={width - 1}
        y2={height}
    />
    <text
        x={width - 5}
        y={height + 5}
        text-anchor="end"
    >0</text>
    <!-- y axis -->
    <line
        x1={35}
        y1={height - 100}
        x2={width}
        y2={height - 100}
    />
    <text
        x={5}
        y={height - 100}
        text-anchor="start"
        class="middle"
    >
        100
    </text>
</svg>

<style>
svg {
    margin-block: 0 var(--pico-typography-spacing-vertical);
    background-color: var(--pico-card-background-color);
}
path {
    stroke-width: 2;
    stroke: var(--pico-form-element-invalid-border-color);
    fill: none;
}
line {
    stroke-width: 1;
    stroke: var(--pico-secondary-focus);
    fill: none;
}
text {
    font-size: 12px;
    dominant-baseline: hanging;
}
text.middle {
    dominant-baseline: middle;
}
</style>
