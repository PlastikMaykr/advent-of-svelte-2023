import { error } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load(event) {
    console.log(event.params.slug + ', internal: ' + event.isSubRequest);

    error(403, 'coming soon');
}

// INFO: this load would only be called for endpoints like '/day/number' that 
