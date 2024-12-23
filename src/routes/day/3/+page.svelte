<script>
    import jsonData from "./data.json";

    let data = $state(jsonData.map(present => Object.assign(present, {
        sleigh: false,
        sent: false
    })));

    /** @typedef {typeof data[0]} Present */

    const max = 100;

    let runs = $state(0);

    let unloaded = $derived(data.filter(({ sleigh, sent }) => !sleigh && !sent));
    let sleigh = $derived(data.filter(present => present.sleigh));
    let capacity = $derived(Math.ceil(sleigh.reduce((sum, { weight }) => sum + weight, 0) * 100) / 100);
    let excess = $derived(capacity > max);
    let shipped = $derived(data.reduce((sum, { sent }) => sum + (sent ? 1 : 0), 0));
    // let shipped = $derived(data.filter(present => present.sent));

    /** @param {Present} present  */
    function moveTo(present) {
        present.sleigh = true;
    }
    
    /** @param {Present} present  */
    function moveFrom(present) {
        present.sleigh = false;
    }

    function send() {
        if (excess) return;

        sleigh.forEach(present => {
            present.sleigh = false;
            present.sent = true;
        });

        runs++;
    }
</script>

<h3>Day Three</h3>
<p>Jingle Bell Balancer</p>

<div>
    <div>
        <p>Sleigh Load Balancer™</p>
    </div>

    <div class="grid sticky">
        <div>
            <h4>Shipped: {shipped}/{data.length}</h4>
            <progress value={shipped} max={data.length}></progress>
        </div>
        <div>
            <h4>Sleigh capacity: {capacity}</h4>
            <progress
                class={capacity > max ? 'full': null}
                value={capacity}
                {max}
            ></progress>
        </div>
        <div>
            <button
                class="right"
                aria-label="move back"
                disabled={excess}
                onclick={send}
            ></button>
        </div>
    </div>

    <div class="grid">
        <div>
            {#each unloaded as present}
                <article class={max - capacity < present.weight ? 'invalid' : null}>
                    <span>{present.name}</span>
                    <span class="golden">{present.weight}</span>
                    <button
                        class="right"
                        aria-label="move to sleigh"
                        onclick={() => moveTo(present)}
                    ></button>
                </article>
            {/each}
        </div>

        <div>
            {#each sleigh as present}
                <article>
                    <button
                        class="left"
                        aria-label="move back"
                        onclick={() => moveFrom(present)}
                    ></button>
                    <span>{present.name}</span>
                    <span class="golden">{present.weight}</span>
                </article>
            {/each}
        </div>
        
        <div></div>

    </div>
</div>

<dialog open={shipped === data.length}>
    <article>
        <h2>All presents delivered</h2>
        <p>It only took:</p>
        <p>{runs} runs</p>
        <footer style="text-align: center;">
            <button
            onclick={() => {
                runs = 0;
                data.forEach(present => {
                    present.sent = false;
                })
            }}
            >Reset</button>
        </footer>
      </article>
</dialog>

<style>
    div.grid {
        grid-template-columns: 1fr 1fr 8ch;
    }
    div.sticky {
        position: sticky;
        top: 0;
        margin-block: 1rem;
        background-color: #374258;
    }
    div.sticky > * {
        padding: 1rem;
    }
    div.sticky > * > * {
        margin: 0;
    }
    progress.full {
        --pico-progress-color: var(--pico-form-element-invalid-active-border-color);
    }
    div > article {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .invalid {
        outline: 1px solid var(--pico-form-element-invalid-border-color);
    }
    .golden {
        color: goldenrod;
    }
    button:disabled {
        --pico-background-color: var(--pico-muted-color);
    }
    button.left, button.right {
        mask: var(--pico-icon-chevron) center no-repeat;
    }
    button.left {
        transform: rotate(90deg);
    }
    button.right {
        transform: rotate(-90deg);
    }
    dialog {
        text-align: center;
    }
</style>
