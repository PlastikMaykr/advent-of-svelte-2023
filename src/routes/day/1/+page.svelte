<script>
    import jsonData from './data.json';

    let data = $state(jsonData);
    
    let searched = $derived(data.filter(d => d));

    function addTally(front = false) {
        data[front ? 'unshift' : 'push']({
            name: 'name',
            tally: 0
        })
    }
</script>

<h3>Day One</h3>
<p>Naughty or Nice</p>

<div>

    <article style="display: flex">
        <button style="flex: 1" onclick={() => addTally(true)}>➕</button>
    </article>

    {#each searched as entry}
    <article data-emoji={ entry.tally > 0 ? '😇' : '👿'}>
        <!-- svelte-ignore a11y_no_redundant_roles -->
        <fieldset role="group" style:--outline={ entry.tally > 0 ? 'limegreen' : 'hotpink'}>
            <input type="text" bind:value={entry.name} />
            <input type="number" bind:value={entry.tally} />
        </fieldset>
    </article>
    {/each}

    <article style="display: flex">
        <button style="flex: 1" onclick={() => addTally()}>➕</button>
    </article>

</div>

<style>
    div {
        max-width: 600px;
    }
    article {
        position: relative;
    }
    article:before {
        content: attr(data-emoji);
        position: absolute;
        top: 0;
        left: 0;
        /* transform: translate(-25%, -25%); */
        z-index: 10;
        font-size: 1.5rem;
    }
    fieldset {
        outline: 1px solid var(--outline, #888);
        margin: 0;
    }
    input[type="number"] {
        flex-basis: 16ch !important;
    }
</style>
