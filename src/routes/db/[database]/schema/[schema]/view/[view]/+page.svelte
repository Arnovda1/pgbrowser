<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import JsonViewer from '$lib/components/json-viewer.svelte';
	import ReadOnlyEditor from '$lib/components/query/read-only-sql.svelte';
	import RecordsTable from '$lib/components/records-table.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import { getRecords } from '$lib/services/db-service.js';
	import db from '$lib/stores/db.svelte';
	import type { QueryResult } from '$lib/types';
	import { onMount } from 'svelte';

	let { data } = $props();

	let result = $state<QueryResult | undefined>(undefined);
	let selectedRecord = $state<string | undefined>(undefined);
	let sidePane = $state<Resizable.Pane | undefined>(undefined);

	const { database, schema } = $derived(page.params);
	const params = $derived({ ...page.params, table: page.params.view });

	const primaryKey = $derived.by<string | string[] | undefined>(() => {
		const primaryKeyColumns = data.columns.filter(c => c.isPrimaryKey).map(c => c.columnName);
		if (primaryKeyColumns.length === 1) return primaryKeyColumns[0];
		else return primaryKeyColumns;
	});

	const fetchRecords = async () => {
		result = await getRecords(params);
	};

	const loadMore = async () => {
		if (!result?.success) return;

		const prevResult = result;
		const res = await getRecords(params, result.data.length);

		result = res;
		result.data = [...prevResult?.data, ...res.data];
	};

	const onRecordClick = (pk: string) => {
		if (selectedRecord === pk) {
			if (sidePane?.isCollapsed()) sidePane.expand();
			else sidePane?.collapse();
		} else {
			if (sidePane?.isCollapsed()) {
				sidePane?.expand();
				sidePane?.resize(30);
			}
			selectedRecord = pk;
		}
	};

	$effect(() => {
		if (page.params.view) fetchRecords();
	});

	onMount(async () => {
		if (!db.connection) goto('/connect');
		sidePane?.collapse();
	});
</script>

{#if result}
	<div class="flex items-center gap-2">
		<div class="w-fit shrink-0 overflow-hidden rounded-xl border pr-1 opacity-70">
			<ReadOnlyEditor code={result.meta.query} />
		</div>

		<p class="text-xs text-muted-foreground">
			{result?.meta.executionTimeMs}ms
		</p>

		<Button
			size="xs"
			variant="outline"
			href={`/db/${database}/schema/${schema}/query?sql=${encodeURIComponent(result.meta.query)}`}
		>
			Edit
		</Button>
	</div>
{/if}

<Resizable.PaneGroup direction="horizontal">
	<Resizable.Pane defaultSize={100} minSize={50} maxSize={100}>
		<div class="grid h-full min-h-0">
			<RecordsTable
				{result}
				{loadMore}
				{primaryKey}
				{onRecordClick}
				highlightedRecord={sidePane?.isExpanded() ? selectedRecord : undefined}
				columns={data.columns}
			/>
		</div>
	</Resizable.Pane>

	<Resizable.Handle class="my-4 hover:bg-primary {sidePane?.isExpanded() ? 'mx-2.5' : ''}" />

	<Resizable.Pane minSize={15} defaultSize={30} maxSize={50} bind:this={sidePane} collapsible>
		<JsonViewer {...page.params} {primaryKey} {sidePane} pkValue={selectedRecord} />
	</Resizable.Pane>
</Resizable.PaneGroup>
