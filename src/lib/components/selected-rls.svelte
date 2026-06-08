<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { query } from '$lib/services/db-service';
	import type { RLSInfo } from '$lib/types';
	import { oneLine } from '$lib/util/functions';
	import { EditorView } from 'codemirror';
	import { PencilIcon, TrashIcon } from 'lucide-svelte';
	import AlertDialog from './global/alert-dialog.svelte';
	import Error from './global/error.svelte';
	import SqlEditor from './query/sql-editor.svelte';
	import Button from './ui/button/button.svelte';

	let {
		policy,
	}: {
		policy: RLSInfo;
	} = $props();

	const { schema, table } = $derived(page.params);

	let error = $state<string | undefined>(undefined);
	let code = $state<string | undefined>(undefined);
	let withCheckCode = $state<string | undefined>(undefined);
	let view = $state<EditorView | undefined>(undefined);
	let withCheckView = $state<EditorView | undefined>(undefined);

	const updatePolicy = async () => {
		try {
			if (!code && !withCheckCode) return;
			error = undefined;

			const usingClause = code ? `USING (${code})` : '';
			const withCheckClause = withCheckCode ? `WITH CHECK (${withCheckCode})` : '';

			const sqlCommand = oneLine(`
        BEGIN;
          DROP POLICY "${policy.policyName}" ON "${schema}"."${table}";
          
          CREATE POLICY "${policy.policyName}" ON "${schema}"."${table}"
          FOR ${policy.command || 'ALL'}
          TO ${policy.roles || 'PUBLIC'}
          ${usingClause}
          ${withCheckClause};
        COMMIT;
      `);

			const result = await query(page.params, sqlCommand);

			if (result.error) {
				error = result.error;
				return;
			}

			await invalidateAll();
		} catch (err: any) {
			error = err.message;
		}
	};

	const deletePolicy = async () => {
		try {
			error = undefined;

			const result = await query(
				page.params,
				oneLine(`DROP POLICY "${policy.policyName}" ON "${schema}"."${table}"`),
			);

			if (result.error) {
				error = result.error;
				return;
			}

			await invalidateAll();
		} catch (err: any) {
			error = err.message;
		}
	};

	$effect(() => {
		if (policy.usingExpression) code = policy.usingExpression;
		if (policy.withCheckExpression) withCheckCode = policy.withCheckExpression;
	});
</script>

<div class="flex flex-col gap-2 rounded-xl bg-card p-1.5">
	<Error {error} />

	<!-- buttons -->
	<div class="flex gap-1.5">
		<AlertDialog onContinue={updatePolicy} title="Update policy?" continueLabel="Update">
			<Button title="Update">
				<PencilIcon /> Update
			</Button>
		</AlertDialog>
		<AlertDialog onContinue={deletePolicy} title="Delete policy?" continueLabel="Delete policy">
			<Button variant="destructive" title="Delete">
				<TrashIcon /> Delete
			</Button>
		</AlertDialog>
	</div>

	<!-- editors -->
	<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
		{#if code}
			<div class="flex flex-col gap-1.5">
				<span class="px-1 text-xs font-medium text-muted-foreground select-none"
					>Using (SELECT/UPDATE/DELETE)</span
				>
				<SqlEditor bind:code bind:view class="text-foreground" />
			</div>
		{/if}

		{#if withCheckCode}
			<div class="flex flex-col gap-1.5">
				<span class="px-1 text-xs font-medium text-muted-foreground select-none"
					>With check (INSERT/UPDATE)</span
				>
				<SqlEditor bind:code={withCheckCode} bind:view={withCheckView} class="text-foreground" />
			</div>
		{/if}
	</div>
</div>
