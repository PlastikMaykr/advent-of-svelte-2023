<script>
    // @ts-nocheck

    /** YT player */
    import YouTubePlayer from './YT.svelte';
    
    let currentChapterTitle = $state('');
    let videoId = 'H2epJGvWbks';

    function handleChapterChange(chapter) {
        currentChapterTitle = chapter.title;
    };

    /** taps */
    const milisecondsInMinute = 60000; // secondsInMinute:60 * milisecondsInSecond:1000

    let start = $state(0);
    let last = $state(0);
    
    let taps = $state(0);
    let bpm = $state(0);

    function reset() {
        start = last = taps = bpm = 0;
    }

    function onpointerdown() {
        this.style.setProperty('--rotate', Math.random() * 100 - 50 + 'deg');

        // console.log({start, last, diff: last - start, taps, bpm})
        taps++;
        last = Date.now();

        if (!start) {
            start = Date.now();
            return;
        }

        last = Date.now();
        bpm = Math.trunc(taps / ((last - start) / milisecondsInMinute));
    }
</script>

<h4>Current Chapter: {currentChapterTitle}</h4>

<YouTubePlayer
    {videoId}
    {currentChapterTitle}
    onChapterChangeCallback={handleChapterChange}
/>

<hr />

<button
    onclick={reset}
><span>reset</span></button>

<p>BPM: {bpm}</p>

<button
    {onpointerdown}
><span>TAP</span></button>

<style>
    button {
        aspect-ratio: 1;
        border-radius: 50%;

    }
    button > span {
        display: block;
        transform: rotate(var(--rotate, 0deg));
    }
</style>
