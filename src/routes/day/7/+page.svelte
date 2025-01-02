<script>
    import data from './morse.json';
    const morseMap = new Map(Object.entries(data));

    /** @param {string} str */
    function toMorse(str) {
        let morse = '';

        for (let char of str) {
            char = char.toUpperCase();
            if (!morseMap.has(char)) continue;

            morse += morseMap.get(char) + ' ';
        }

        return morse;
    }

    /** @type {HTMLElement} */
    let textOutput;
    let input = $state('');
</script>

<p>Input</p>
<textarea
    bind:value={input}
    oninput={() => {
        textOutput.innerText = toMorse(input).split('').map(char => 
        char === '0' ? '.' :
        char === '1' ? '-' :
        char
    ).join('');
    }}
></textarea>

<p>Output</p>
<textarea readonly bind:this={textOutput}></textarea>
