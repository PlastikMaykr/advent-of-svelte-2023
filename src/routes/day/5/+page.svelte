<script>
    import jsonData from "./data.json";

    const milisecondsInMinute = 60000; // minutes * secondsInMinute * milisecondsInSecond

    /** 
     * @typedef {Object} Task
     * @property {string} elf 
     * @property {"CREATED_TOY"|"WRAPPED_PRESENT"} task 
     * @property {boolean} make 
     * @property {number} minutesTaken 
     * @property {number} date 
     */

    /**
     * @param {typeof jsonData[0]} param0
     * @returns {Task}
     */
    function taskify({ elf, task, minutesTaken, date }) {
        return {
            elf,
            task: task === 'CREATED_TOY' ? 'CREATED_TOY' : 'WRAPPED_PRESENT',
            make: task === 'CREATED_TOY',
            minutesTaken,
            date: Date.parse(date)
        }
    }

    let data = $state(jsonData.map(taskify));
    let elves = $derived.by(() => {
        console.log(data.at(-1));
        /** @type {Map<string,Task[]>} */
        const elfMap = new Map();

        for (let task of data) {
            const elf = task.elf;
            if (!elfMap.has(elf)) elfMap.set(elf, []);
            elfMap.get(elf)?.push(task);
        }

        return elfMap.entries();
    });
    let [minDate, maxDate, deltaDate] = $derived.by(() => {
        let min = Date.now(), max = 0;

        for (let { date, minutesTaken } of data) {
            let sinceEpoch = date;
            if (sinceEpoch > max) max = sinceEpoch;
            sinceEpoch -= minutesTaken * milisecondsInMinute;
            if (sinceEpoch < min) min = sinceEpoch;
        }

        return [min, max, max - min]
    });
    let deltaHours = $derived(deltaDate / (60 * milisecondsInMinute))

    let fullWidth = $state(0);

    /**
     * @param {Task} task 
     * @returns {number} width normalized
     */
    function getWidth(task) {
        const miliseconds = task.minutesTaken * milisecondsInMinute;
        return miliseconds / deltaDate;
    }

    /**
     * @param {Task} task 
     * @returns {number} left normalized
     */
    function getLeft(task) {
        const start = task.date - (task.minutesTaken * milisecondsInMinute);
        return (start - minDate) / deltaDate;
    }



    let interval = setInterval(() => {
        fetch('https://advent.sveltesociety.dev/data/2023/day-five.json')
            .then((result) => result.json())
            .then((json) => data = json.map(taskify));
    }, 60000);
</script>

<button onclick={() => {
    clearInterval(interval);
}}>STOP</button>

<p>Time range: {Math.trunc(deltaHours)} hours & {Math.floor((deltaHours % 1) * 60)} minutes</p>

<div class="gridy">
    <div class="row bold">
        <div>Names</div>
        <div title="toys per hour">TPH</div>
        <div bind:clientWidth={fullWidth}>Tasks</div>
    </div>

    {#each elves as [elf, tasks]}
    <div class="row">
        <div>{elf}</div>
        <div>{(tasks.reduce((sum, { make }) => sum + (make ? 1 : 0), 0) / deltaHours).toFixed(2)}</div>
        <div>
            {#each tasks as task}
                <div
                    class={'task'}
                    class:make={task.make}
                    class:wrap={!task.make}
                    style:--left={getLeft(task)}
                    style:--width={getWidth(task)}
                ></div>
            {/each}
        </div>
    </div>
{/each}

</div>

<style>
    .gridy {
        display: grid;
        grid-template-columns: auto auto 1fr;
        column-gap: 0.75em;
        row-gap: 0.2rem;
    }
    .row {
        display: grid;
        grid-column: span 3;
        grid-template-columns: subgrid;
    }
    .row > div:last-of-type {
        position: relative;
    }
    .task {
        position: absolute;
        height: 100%;
        width: calc(var(--width) * 100%);
        left: calc(var(--left) * 100%);
        top: 0;
        opacity: 0.55;
        border-radius: 2px;
    }
    .task.make {
        background-image: linear-gradient(90deg, hotpink, pink);
    }
    .task.wrap {
        background-image: linear-gradient(90deg, limegreen, lime);
    }
    .bold {
        font-weight: bolder;
    }
</style>
