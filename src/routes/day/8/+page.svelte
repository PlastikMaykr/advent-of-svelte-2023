<script>
    import Card from "./Card.svelte";
    import { seconder } from "./timer.js";

    const timer = seconder();

    /** @param {Array<any>} arr */
    function shuffle(arr) {
        const len = arr.length;

        for (let i = 0; i < len * len; i++) {
            let a = Math.trunc(Math.random() * len);
            let b = Math.trunc(Math.random() * len);
            [ arr[a], arr[b] ] = [ arr[b], arr[a] ];
        }
        
        return arr;
    }

    const revealDuration = 1000;
    const pairs = 24;

    function newGame() {
        timer.stop();
        // timer.start(clockUpdate);
        reveals = 0;
        progress = 0;

        won = false;
        first = null;
        second = null;

        cards = shuffle(Array.from({ length: pairs * 2 }, (_, i) => ({
            index: i,
            number: i % pairs + 1,
            flip: false,
            done: false
        })));

        console.groupCollapsed('Game spoiler');
        console.log(cards.map(card => card.number));
        console.groupEnd();
    }

    /** @typedef {object} Card 
     * @prop {number} index  
     * @prop {number} number 
     * @prop {boolean} flip 
     * @prop {boolean} done 
     */

    /** @type {Card[]} */
    let cards = $state([]);
    let won = $state(false);
    /** @type {Card|null} */
    let first = $state(null);
    /** @type {Card|null} */
    let second = $state(null);

    let reveals = $state(0);
    let progress = $state(0);
    let clock = $state('');
    const clockUpdate = () => clock = timer.display;

    // TODO: move newGame declaration here
    
    newGame();

    /** @param {Card} card  */
    function cardClick(card) {
        if (card.flip) return;
        if (card.done) return;
        if (first && second) return;
        if (first === card) return;
        
        card.flip = true;

        if (!first) {
            if (!timer.isRunning) timer.start(clockUpdate);
            
            first = card;
        } else { // first && !second
            reveals++;

            second = card;

            if (first.number === second.number) {
                first.flip = second.flip = false;
                first.done = second.done = true;
                first = second = null;

                progress++;
            } else { // first != second
                setTimeout(() => {
                    first && (first.flip = false);
                    second && (second.flip = false);
                    first = null;
                    second = null;
                }, revealDuration);
            }
            
            won = cards.every(({done}) => done);
            if (won) {
                // WINNER
                setTimeout(() => {
                    timer.stop();
                    
                    alert(`We've got a WINNER!\nreveals: ${reveals}\ntime: ${clock}`);
                }, revealDuration);
            } 
        }

        // console.log({ first, second })
    }
</script>

<h3>Day Eight</h3>
<p>Santa’s Mysterious Deck of Doubles</p>

<hr />

<nav>
    <button onclick={newGame}>New Game</button>

    <!-- svelte-ignore a11y_no_redundant_roles -->
    <fieldset role="group">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label>reveals:</label>
        <output>{reveals}</output>
    </fieldset>

    <!-- svelte-ignore a11y_no_redundant_roles -->
    <fieldset role="group">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label>timer:</label>
        <output>{clock}</output>
    </fieldset>
</nav>

<progress value={progress} max={pairs}></progress>

<article>
    {#each cards as card}
        <Card
            {card}
            onclick={() => cardClick(card)}
        />
    {/each}
</article>

<style>
    nav {
        align-items: baseline;
        margin-bottom: 1rem;
    }

    fieldset {
        border: 1px solid;
        margin: 0;
        flex: 0;
        align-items: baseline;
    }
    fieldset > * {
        padding: 0.5em 1em;
    }
    label {
        background-color: var(--pico-secondary-background);
    }
    output {
        /* flex: 0 0 4ch; */
        min-width: 6ch;
        text-align: right;
    }

    article {
        display: grid;
        gap: 16px;
    }

    @media (min-width: 576px) {
        article {
            grid-template-columns: repeat(4, 1fr);
        }
    }
    @media (min-width: 768px) {
        article {
            grid-template-columns: repeat(6, 1fr);
        }
    }
    @media (min-width: 1024px) {
        article {
            grid-template-columns: repeat(8, 1fr);
        }
    }
    @media (min-width: 1280px) {
        article {
            grid-template-columns: repeat(10, 1fr);
        }
    }
    @media (min-width: 1536px) {
        article {
            grid-template-columns: repeat(12, 1fr);
        }
    }
</style>
