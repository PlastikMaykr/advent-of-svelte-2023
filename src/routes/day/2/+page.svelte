<script>
    import { fade } from 'svelte/transition';

    let count = $state(0);

    function decrement() {
        if (count <= 0) return;
        count--;
    }

    function increment() {
        if (count >= moods.length - 1) return;
        count++;
    }

    function reset() {
        count = 0;
    }

    const moods = [
        // { emoji: '😢', label: 'Crying Santa' },
        { emoji: '😔', label: 'Pensive Santa' },
        { emoji: '😞', label: 'Disappointed Santa' },
        { emoji: '😟', label: 'Worried Santa' },
        { emoji: '😕', label: 'Confused Santa' },
        { emoji: '🙂', label: 'Slightly Smiling Santa' },
        { emoji: '😌', label: 'Relieved Santa' },
        { emoji: '😊', label: 'Smiling Santa with Smiling Eyes' },
        { emoji: '😃', label: 'Grinning Santa with Big Eyes' },
        { emoji: '😄', label: 'Grinning Santa with Smiling Eyes' },
        { emoji: '😁', label: 'Beaming Santa with Smiling Eyes' },
        // { emoji: '🥳', label: 'Partying Santa' },
        { emoji: '🤩', label: 'Star-Struck' },
        { emoji: '🤢', label: 'Nauseated Santa' },
        { emoji: '🤮', label: 'Santa Vomiting' },
        { emoji: '😬', label: 'Grimacing Santa' },
    ];

    let currentMood = $derived(moods[count]);
</script>

<h3>Day Two</h3>
<p>Merry Munch-o-Meter</p>

<div>
    <article>
        {#key currentMood}
            <span
                transition:fade
                title={currentMood.label}
            >
                {currentMood.emoji}
            </span>
        {/key}
        <section>🎅</section>
    </article>

    <!-- svelte-ignore a11y_no_redundant_roles -->
    <fieldset role="group">
        <button onclick={decrement}>--🍪</button>
        <input type="number" bind:value={count} style="-moz-appearance: textfield;"/>
        <button onclick={increment}>🍪++</button>
    </fieldset>

    <button class="reset" onclick={reset}>🔄</button>
</div>

<style>
    div {
        max-width: 450px;
        margin-inline: auto;
        text-align: center;
    }

    article {
        position: relative;
        text-align: center;
        font-size: 3rem;
        border-radius: 99vh;
    }
    article::after {
        content: "🎅's mood";
        font-size: 1rem;
        position: absolute;
        top: 50%;
        left: 1rem;
        transform-origin: 0% 100%;
        transform: rotate(-45deg);
    }

    article > span {
        cursor: crosshair;
        position: absolute;
        top: 50%;
        left: 50%;
        /* transform-origin: 0% 100%; */
        transform: translate(-50%, -50%);
    }

    article > section {
        position: relative;
        transform-origin: 50% 80%;
        transform: translate(0.75%, 9%) scale(1.1);
        clip-path: polygon(
            0% 0%,
            100% 0%,
            100% 48%,
            0% 48%
        );
    }

    fieldset {
        outline: 1px solid var(--outline, #888);
        --pico-border-radius: 100vh;
    }

    input[type='number'] {
        flex-basis: 8ch !important;
        text-align: center;
    }

    /* Chrome, Safari, Edge, Opera */
    input[type='number']::-webkit-outer-spin-button,
    input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    button.reset {
        border-radius: 100vh;
        margin-top: 1rem;
    }
</style>
