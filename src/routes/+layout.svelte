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

<div id="layout">

    <header class="container">
        A Svelte challenge for each day until Christmas Eve!
        <br />
        Title is "{page.url.pathname}"
    </header>

    <main class="container">
        {@render children()}
    </main>
            
    <footer class="container">
        foot-ish
    </footer>

</div>

<div id="viewport">

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

</div>

<style>
    #layout {
        min-height: 100vh;
        min-height: 100dvh;
        display: grid;
        grid-template-rows: auto 1fr auto;
    }

    #layout > header,
    #layout > main,
    #layout > footer {
        padding-block: var(--pico-block-spacing-vertical);
    }

    #viewport {
        width: 100vw;
        width: 100dvw;
        height: 100vh;
        height: 100dvh;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 999;
    }

    button {
        position: absolute;
        left: 10px;
        bottom: 15px;
        background-color: var(--pico-primary-inverse);
        mask: var(--pico-icon-chevron) center no-repeat;
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
        max-height: 100vh;
        max-height: 100dvh;
        background-color: var(--pico-muted-border-color);
    }

    a[href="#"] {
        color: var(--pico-muted-color);
        text-decoration: none;
        cursor: default;
    }
</style>
