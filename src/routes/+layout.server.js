/** @type {(string|null)[]} */
let dayPaths = Array.from({ length: 24 });

let done = false;


/** @param {typeof fetch} fetch */
async function getPaths(fetch) {
    const promises = [];
    /** @type {string[]} */
    const paths = [];
    for (let i = 0; i < dayPaths.length; i++) {
        const day = i + 1;
        const path = `/day/${day}`;
        promises.push(fetch(path).then(({ status }) => {
            console.log(day, status);
            paths[i] = status !== 200 ? '#' : path;
        }));
    }
    await Promise.allSettled(promises);
    return paths;
}

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch }) {
    if (!done) {
        done = true;
        dayPaths = await getPaths(fetch);
    }

    return {
        dayPaths
    };
}
