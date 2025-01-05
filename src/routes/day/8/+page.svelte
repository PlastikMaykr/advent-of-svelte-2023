<script>
    // TODO: extract dialog to reusable component
    // TODO: high score

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
    let clock = $state('00');
    const clockUpdate = () => clock = timer.display;

    /** @type {HTMLDialogElement} */
    let dialog;
    const showDialog = () => dialog.showModal();
    const closeDialog = () => dialog.close();
    const dialogCloseButtonAttr = { rel: 'prev', onclick: closeDialog };
 
    function newGame() {
        timer.stop();
        clock = '00';
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

                    showDialog();
                }, revealDuration);
            } 
        }
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

<article class="game">
    {#each cards as card}
        <Card
            {card}
            onclick={() => cardClick(card)}
        />
    {/each}
</article>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
<dialog
    bind:this={dialog}
    onclick={closeDialog}
>
    <article onclick={(e) => e.stopPropagation()}>
        <header>
            <button aria-label="Close" {...dialogCloseButtonAttr}></button>
            <p>We've got a WINNER!</p>
        </header>
        
        <p>🏆🏁🎉🎆🎇</p>
        <p>You won!</p>
        
        <ul>
            <li>reveals: {reveals}</li>
            <li>time: {clock}</li>
        </ul>
    </article>
</dialog>

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
        min-width: 6ch;
        text-align: right;
    }

    .game {
        display: grid;
        gap: 16px;
    }

    @media (min-width: 576px) {
        .game {
            grid-template-columns: repeat(4, 1fr);
        }
    }
    @media (min-width: 768px) {
        .game {
            grid-template-columns: repeat(6, 1fr);
        }
    }
    @media (min-width: 1024px) {
        .game {
            grid-template-columns: repeat(8, 1fr);
        }
    }
    @media (min-width: 1280px) {
        .game {
            grid-template-columns: repeat(10, 1fr);
        }
    }
    @media (min-width: 1536px) {
        .game {
            grid-template-columns: repeat(12, 1fr);
        }
    }
</style>
