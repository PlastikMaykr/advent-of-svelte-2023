<script>
    import '@picocss/pico';

    import { page } from '$app/state';
    import { fly } from 'svelte/transition';

    let { children } = $props();

    let open = $state(false);

    $effect(() => {
        page.url.pathname;
        open = false;
    });

    /** 
     * @param {HTMLAnchorElement} node
     * @param {string} url 
     */
    function checkOut(node, url) {
        (async () => {
            const { status } = await fetch(url);
            // console.log(status)
            const fail = status == 404;
            node.href = fail ? '#' : url;
        })();
    }
</script>

{#if open}
    <aside transition:fly={{ x: "-400px" }}>
        <ul>
            <li><a href="/">Home</a></li>
            {#each { length: 24 } as _, i}
                {@const day = i + 1}
                {@const url = `/day/${day}`}
                <li>
                    <!-- svelte-ignore a11y_invalid_attribute -->
                    <a
                        href="#"
                        use:checkOut={url}
                        onclick={function () {
                            console.log('click');
                        }}
                    >Day {day}</a>
                </li>
            {/each}
        </ul>
    </aside>
{/if}

<button
    aria-label="open-menu"
    class:open onclick={() => (open = !open)}
></button>

<header class="container">
    A Svelte challenge for each day until Christmas Eve!
    <br />
    Title is "{page.url.pathname}"
</header>

<main class="container">
    {@render children()}
</main>

<style>
    button {
        position: absolute;
        left: 10px;
        bottom: 15px;
        background-color: var(--pico-primary-inverse);
        mask: var(--pico-icon-chevron) center no-repeat;
        /* background-position: center center; */
        transform: rotate(-90deg);
        transition: transform 250ms;
    }
    button.open {
        transform: rotate(90deg);
    }

    aside {
        overflow: auto;
        position: absolute;
        width: 250px;
        padding: 1em;
        height: 100%;
        background-color: var(--pico-muted-border-color);
    }

    a[href="#"] {
        color: var(--pico-muted-color);
        text-decoration: none;
        cursor: default;
    }
</style>
