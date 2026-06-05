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
	let view = $state<EditorView | undefined>(undefined);

	const updatePolicy = async () => {
		try {
			if (!code) return;
			error = undefined;

			const sqlCommand = oneLine(`
        BEGIN;
          DROP POLICY "${policy.policyName}" ON ${schema}.${table};
          
          CREATE POLICY "${policy.policyName}" ON ${schema}.${table}
          FOR ${policy.command || 'ALL'}
          TO ${policy.roles || 'PUBLIC'}
          USING (${code});
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
				`DROP POLICY ${policy.policyName} ON ${schema}.${table}`,
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
	});
</script>

<div class="flex flex-col gap-2 rounded-xl bg-card p-1.5 text-card-foreground">
	<Error {error} />

	<!-- buttons -->
	<div class="flex gap-1.5">
		<Button title="Update" onclick={updatePolicy}>
			<PencilIcon /> Update
		</Button>
		<AlertDialog onContinue={deletePolicy} title="Delete policy?" continueLabel="Delete policy">
			<Button variant="destructive" title="Delete">
				<TrashIcon /> Delete
			</Button>
		</AlertDialog>
	</div>

	<!-- editor -->
	{#if code}
		<SqlEditor bind:code bind:view />
	{/if}
</div>
