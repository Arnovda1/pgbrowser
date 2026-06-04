<script lang="ts">
	import { page } from '$app/state';
	import ListFunctions from '$lib/components/lists/list-functions.svelte';
	import ListTables from '$lib/components/lists/list-tables.svelte';
	import ListTriggers from '$lib/components/lists/list-triggers.svelte';

	let { data } = $props();

	const { database, schema } = $derived(page.params);
</script>

<h2>Tables</h2>
<ListTables tables={data.tables} />

<h2>Functions</h2>
<ListFunctions functions={data.funcs} />

<h2>Triggers</h2>
<ListTriggers triggers={data.triggers} />
