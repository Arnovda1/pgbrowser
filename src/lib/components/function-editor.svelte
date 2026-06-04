<script lang="ts">
	import type { FuncDetails } from '$lib/types';
	import beautifySql from '$lib/util/sql-beautify';
	import type { EditorView } from 'codemirror';
	import { CodeIcon, PlayIcon, TrashIcon } from 'lucide-svelte';
	import AlertDialog from './global/alert-dialog.svelte';
	import SqlEditor from './query/sql-editor.svelte';
	import { Button } from './ui/button';

	let {
		func,
	}: {
		func: FuncDetails;
	} = $props();

	let view = $state<EditorView | undefined>(undefined);

	const updateFunction = () => {};
	const deleteFunction = () => {};
</script>

<div class="grid space-y-2 pb-5">
	<div class="text-sm">
		<p class="font-bold">Arguments:</p>

		<div class="flex flex-wrap items-center">
			{#each func.argumentSignature ? func.argumentSignature.split(',') : [] as arg}
				{@const parts = arg.trim().split(' ')}
				{@const key = parts[0]}
				{@const value = parts.slice(1).join(' ')}
				<p class="mr-3">
					{key} <span class="text-xs text-muted-foreground">{value}</span>
				</p>
			{/each}

			<p class="ml-auto text-xs text-muted-foreground">{func.languageName}</p>
		</div>
	</div>

	<!-- buttons -->
	<div class="flex gap-1.5">
		<Button onclick={updateFunction}>
			<PlayIcon /> Update
		</Button>

		<Button onclick={() => view && beautifySql(view)} variant="secondary">
			<CodeIcon /> Beautify
		</Button>

		<AlertDialog onContinue={deleteFunction} title="Clear query?" continueLabel="Clear">
			<Button variant="destructive" title="Clear query">
				<TrashIcon /> Delete
			</Button>
		</AlertDialog>
	</div>

	<!-- editor -->
	<div class="max-h-96">
		<SqlEditor code={func.functionBody} bind:view />
	</div>
</div>
