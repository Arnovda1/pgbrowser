<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { query } from '$lib/services/db-service';
	import type { FuncDetails } from '$lib/types';
	import beautifySql from '$lib/util/sql-beautify';
	import type { EditorView } from 'codemirror';
	import { CodeIcon, PenIcon, RotateCcwIcon, TrashIcon } from 'lucide-svelte';
	import { onDestroy } from 'svelte';
	import FunctionExecutor from './function-executor.svelte';
	import AlertDialog from './global/alert-dialog.svelte';
	import Error from './global/error.svelte';
	import Success from './global/success.svelte';
	import SqlEditor from './query/sql-editor.svelte';
	import Badge from './ui/badge/badge.svelte';
	import { Button } from './ui/button';

	let {
		func,
	}: {
		func: FuncDetails;
	} = $props();

	let code = $state<string | undefined>(undefined);
	let view = $state<EditorView | undefined>(undefined);

	let error = $state<string>('');
	let status = $state<string>('');
	let loading = $state(false);

	const updateFunction = async () => {
		if (!code) return;
		error = '';
		status = '';
		loading = true;

		try {
			const result = await query(page.params, code);

			if (result.error) {
				error = result.error;
			} else {
				status = 'Function updated';
				await invalidateAll();
			}
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	};

	const deleteFunction = async () => {
		error = '';
		status = '';
		loading = true;

		try {
			const result = await query(
				page.params,
				`DO $$ BEGIN EXECUTE 'DROP FUNCTION ' || ${func.oid}::regprocedure::text; END $$;`,
			);

			if (result.error) {
				error = result.error;
			} else {
				await invalidateAll();
			}
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	};

	const resetFunction = () => {
		code = func.body;
	};

	$effect(() => {
		if (func.oid) code = func.body;
	});

	$effect(() => {
		if (!status) return;

		const timerId = setTimeout(() => (status = ''), 5000);
		return () => clearTimeout(timerId);
	});

	onDestroy(() => {
		error = '';
		status = '';
		loading = false;
	});
</script>

<div class="space-y-2 pb-5">
	<div class="flex justify-between">
		<!-- buttons -->
		<div class="flex gap-1.5">
			<Button onclick={updateFunction} variant="secondary" disabled={loading}>
				<PenIcon /> Update
			</Button>

			<Button onclick={() => beautifySql(view)} variant="secondary" disabled={loading}>
				<CodeIcon /> Beautify
			</Button>

			<Button onclick={resetFunction} variant="secondary" disabled={loading}>
				<RotateCcwIcon /> Reset
			</Button>

			<AlertDialog onContinue={deleteFunction} title="Delete function?" continueLabel="Delete">
				<Button variant="destructive" title="Delete function" disabled={loading}>
					<TrashIcon /> Delete
				</Button>
			</AlertDialog>
		</div>

		<!-- function details -->
		<div class="flex items-center gap-1.5">
			<Badge variant="secondary">
				{func.behaviorType}
			</Badge>
			<Badge variant="secondary">
				{func.language}
			</Badge>
		</div>
	</div>

	<!-- editor -->
	{#if code !== undefined}
		<SqlEditor bind:code bind:view class="max-h-96" />
	{/if}

	<!-- run function -->
	<FunctionExecutor {func} />

	<Error {error} class="my-0" />
	<Success message={status} class="my-0" />
</div>
