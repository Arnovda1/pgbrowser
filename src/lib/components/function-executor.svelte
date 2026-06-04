<script lang="ts">
	import { page } from '$app/state';
	import { query } from '$lib/services/db-service';
	import type { FuncDetails, QueryResult } from '$lib/types';
	import { cleanFunctionSignature } from '$lib/util/functions';
	import type { EditorView } from 'codemirror';
	import { PlayIcon } from 'lucide-svelte';
	import { onDestroy } from 'svelte';
	import Error from './global/error.svelte';
	import DataOutput from './query/data-output.svelte';
	import SqlEditor from './query/sql-editor.svelte';
	import StatusBar from './query/status-bar.svelte';
	import { Button } from './ui/button';

	let {
		func,
	}: {
		func: FuncDetails;
	} = $props();

	let code = $state<string>('');
	let result = $state<QueryResult | undefined>(undefined);
	let view = $state<EditorView | undefined>(undefined);

	let error = $state<string>('');
	let loading = $state(false);

	const executeFunction = async () => {
		if (!code) return;
		error = '';
		loading = true;

		try {
			result = await query(page.params, code);
			if (result.error) {
				error = result.error;
			}
		} finally {
			loading = false;
		}
	};

	$effect(() => {
		if (!func.name) return;

		const args = cleanFunctionSignature(func.argumentSignature);

		if (args) {
			code = `SELECT ${func.name}(/* ${args} */);`;
		} else {
			code = `SELECT ${func.name}();`;
		}
	});

	onDestroy(() => {
		error = '';
		loading = false;
	});
</script>

<div class="flex h-fit max-h-18 w-full gap-2">
	<Button onclick={executeFunction} size="sm" disabled={!code || loading}>
		<PlayIcon /> Run
	</Button>
	<div class="my-auto h-fit w-full">
		<SqlEditor bind:code bind:view />
	</div>
</div>

{#if result?.success || error}
	<div class="overflow-hidden rounded-xl bg-muted/50 p-2">
		{#if result?.success}
			<DataOutput {result} />
		{/if}
		<Error {error} class="my-0" />
	</div>
{/if}

{#if result}
	<StatusBar {result} showBorder={false} />
{/if}
