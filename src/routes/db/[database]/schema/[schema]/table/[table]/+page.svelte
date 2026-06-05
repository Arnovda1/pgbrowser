<script lang="ts">
	import { page } from '$app/state';
	import ListTriggers from '$lib/components/lists/list-triggers.svelte';
	import TableCheckConstraints from '$lib/components/tables/table-check-constraints.svelte';
	import TableIndexes from '$lib/components/tables/table-indexes.svelte';
	import TableStructure from '$lib/components/tables/table-structure.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { ArrowRight } from 'lucide-svelte';

	let { data } = $props();

	const { database, schema, table } = $derived(page.params);
</script>

<Tabs.Root value="structure">
	<div class="flex justify-between">
		<Tabs.List>
			<Tabs.Trigger value="structure">Table structure</Tabs.Trigger>
			<Tabs.Trigger value="metadata">Metadata</Tabs.Trigger>
			<Tabs.Trigger value="triggers">Triggers</Tabs.Trigger>
			<Tabs.Trigger value="rls">RLS</Tabs.Trigger>
		</Tabs.List>

		<Button href={`/db/${database}/schema/${schema}/table/${table}/select`}>
			<ArrowRight /> View records
		</Button>
	</div>

	<Tabs.Content value="structure" class="space-y-2">
		<h2>Table structure</h2>
		<div class="overflow-hidden rounded-xl bg-muted/50 p-2">
			<TableStructure {...data} />
		</div>
	</Tabs.Content>

	<Tabs.Content value="metadata" class="space-y-6">
		<div class="space-y-2">
			<h2>Indexes</h2>
			<div class="overflow-hidden rounded-xl bg-muted/50 p-2">
				<TableIndexes {...data} />
			</div>
		</div>

		<div class="space-y-2">
			<h2>Constraints</h2>
			<div class="overflow-hidden rounded-xl bg-muted/50 p-2">
				<TableCheckConstraints {...data} />
			</div>
		</div>
	</Tabs.Content>

	<Tabs.Content value="triggers" class="space-y-2">
		<h2>Triggers</h2>
		<ListTriggers {...data} class="grid gap-2 xl:grid-cols-2 2xl:grid-cols-3" {table} />
	</Tabs.Content>

	<Tabs.Content value="rls" class="space-y-2">
		<h2>Row Level Security</h2>
	</Tabs.Content>
</Tabs.Root>
