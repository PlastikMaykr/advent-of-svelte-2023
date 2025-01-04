<script>
    import Card from "./Card.svelte";

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
    
    newGame();

    /** @param {Card} card  */
    function cardClick(card) {
        if (card.flip) return;
        if (card.done) return;
        if (first && second) return;
        if (first === card) return;
        
        card.flip = true;

        if (!first) {
            first = card;
        } else { // first && !second
            second = card;

            if (first.number === second.number) {
                first.flip = second.flip = false;
                first.done = second.done = true;
                first = second = null;
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
                    alert(`We've got a WINNER!`);
                }, revealDuration);
            } 
        }

        // console.log({ first, second })
    }
</script>

<button onclick={newGame}>New Game</button>

<article>
    {#each cards as card}
        <Card
            {card}
            onclick={() => cardClick(card)}
        />
    {/each}
</article>

<style>
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
