<script module>
    /**
     * @typedef {object} Chapter
     * @property {string} title
     * @property {number} startSeconds
     */

    /**
     * @typedef {object} VideoData
     * @property {Chapter[]} [chapters]
     */

    /**
     * @typedef {object} PlayerVars
     * @property {number} playsinline
     * @property {number} enablejsapi
     */

    /**
     * @typedef {object} YTPlayerOptions
     * @property {string} videoId
     * @property {PlayerVars} playerVars
     * @property {object} events
     * @property {(event: YT['PlayerEvent']) => void} events.onReady
     * @property {(event: YT['OnStateChangeEvent']) => void} events.onStateChange
     */

    /**
     * @typedef {object} YT
     * @property {(element:HTMLElement, options:YTPlayerOptions) => Player} Player
     * @property {PlayerState} PlayerState
     * @property {Player} Player
     * @property {YTEvent} PlayerEvent
     * @property {YTEvent} OnStateChangeEvent
     */

    /**
     * @typedef {object} PlayerState
     * @property {number} PlayerState.UNSTARTED
     * @property {number} PlayerState.ENDED
     * @property {number} PlayerState.PLAYING
     * @property {number} PlayerState.PAUSED
     * @property {number} PlayerState.BUFFERING
     */

    /**
     * @typedef {object} Player
     * @property {() => number} getCurrentTime
     * @property {() => VideoData} getVideoData
     * @property {() => PlayerState} getPlayerState
     * @property {() => void} destroy
     */

    /**
     * @typedef {object} YTEvent
     * @property {number} data
     */
</script>

<script>
    // @ts-nocheck

    import { onMount, onDestroy } from "svelte";

    /** @type {string} */
    // export let videoId;
    /**
     * @callback ChapterChangeCallback
     * @param {Chapter} chapter
     */

    /** @type {ChapterChangeCallback} */
    // export let onChapterChangeCallback = () => {};

    let { videoId, currentChapterTitle = $bindable(''), onChapterChangeCallback = () => {} } = $props();

    // @ts-ignore
    /** @type {typeof YT} */
    // window.YT;
    // @ts-ignore
    // const YT = window.YT;

    /** @type {HTMLDivElement | undefined} */
    let playerContainer;
    /** @type {Player | undefined} */
    let player;
    /** @type {number} */
    let currentChapterIndex = $state(-1);
    /** @type {number} */
    let expectedChapterTransitionTime = -1;
    /** @type {number | undefined} */
    let transitionCheckTimeout;

    $inspect(currentChapterIndex);

    /**
     * This function is automatically called by the YouTube IFrame API after it loads.
     */
    function onYouTubeIframeAPIReady() {
        if (!playerContainer) {
            console.error("Player Container not defined");
            return;
        }

        player = new YT.Player(playerContainer, {
            videoId: videoId,
            playerVars: {
                playsinline: 1,
                enablejsapi: 1,
            },
            events: {
                onReady: onPlayerReady,
                // onStateChange: onPlayerStateChange,
            },
        });
    }

    /**
     * Called when player is ready
     */
    function onPlayerReady() {
        // Player is ready and loaded
    }

    /**
     * Called when the player's state changes
     * @param {YT.OnStateChangeEvent} event
     */
    function onPlayerStateChange(event) {
        if (transitionCheckTimeout) clearTimeout(transitionCheckTimeout);

        if (
            event.data === YT.PlayerState.PLAYING ||
            event.data === YT.PlayerState.PAUSED ||
            event.data === YT.PlayerState.ENDED ||
            event.data === YT.PlayerState.BUFFERING
        ) {
            checkChapterChange();
        }
    }

    /**
     * Checks if the current chapter has changed.
     */
    function checkChapterChange() {
        console.log(player?.getVideoData?.().chapters);
        
        if (
            player &&
            player.getVideoData &&
            player.getVideoData() &&
            player.getVideoData().chapters
        ) {
            /** @type {VideoData} */
            const videoData = player.getVideoData();
            if (videoData.chapters.length > 0) {
                const chapters = videoData.chapters;

                const currentTime = player.getCurrentTime();
                let newChapterIndex = -1;
                for (let i = 0; i < chapters.length; i++) {
                    if (
                        currentTime >= chapters[i].startSeconds &&
                        (i === chapters.length - 1 ||
                            currentTime < chapters[i + 1].startSeconds)
                    ) {
                        newChapterIndex = i;
                        break;
                    }
                }
                if (newChapterIndex !== currentChapterIndex) {
                    currentChapterIndex = newChapterIndex;
                    if (currentChapterIndex > -1) {
                        onChapterChange(chapters[currentChapterIndex]);
                    }
                }
                if (
                    newChapterIndex < chapters.length - 1 &&
                    player.getPlayerState() === YT.PlayerState.PLAYING
                ) {
                    const nextChapterStartTime =
                        chapters[newChapterIndex + 1].startSeconds;
                    if (
                        expectedChapterTransitionTime !== nextChapterStartTime
                    ) {
                        expectedChapterTransitionTime = nextChapterStartTime;
                        const timeToTransition =
                            (nextChapterStartTime - currentTime) * 1000;
                        if (timeToTransition > 0) {
                            transitionCheckTimeout = setTimeout(function () {
                                checkChapterChange();
                            }, timeToTransition + 1000);
                        }
                    }
                }
            }
        }
    }

    /**
     * Calls the provided callback function when the chapter changes.
     * @param {Chapter} chapter
     */
    function onChapterChange(chapter) {
        console.log(chapter.title);
        currentChapterTitle = chapter.title;
        onChapterChangeCallback(chapter);
    }

    onMount(() => {
        // Check if the API is already loaded
        if (window.YT && window.YT.Player) {
            onYouTubeIframeAPIReady();
        } else {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        }
    });

    onDestroy(() => {
        if (player) {
            player.destroy();
            player = undefined;
        }
        if (transitionCheckTimeout) clearTimeout(transitionCheckTimeout);
    });
</script>

<svelte:head>
    <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<div bind:this={playerContainer}></div>
