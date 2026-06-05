<script lang="ts">
	import ListFunctions from '$lib/components/lists/list-functions.svelte';
	import ListTables from '$lib/components/lists/list-tables.svelte';
	import ListTriggers from '$lib/components/lists/list-triggers.svelte';
	import ListViews from '$lib/components/lists/list-views.svelte';
	import * as Tabs from '$lib/components/ui/tabs';

	let { data } = $props();
</script>

<Tabs.Root value="tables">
	<Tabs.List>
		<Tabs.Trigger value="tables">Tables</Tabs.Trigger>
		<Tabs.Trigger value="views">Views</Tabs.Trigger>
		<Tabs.Trigger value="functions">Functions</Tabs.Trigger>
		<Tabs.Trigger value="triggers">Triggers</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="tables" class="space-y-2">
		<h2>Tables</h2>
		<ListTables tables={data.tables} />
	</Tabs.Content>

	<Tabs.Content value="views" class="space-y-2">
		<h2>Views</h2>
		<ListViews views={data.views} />
	</Tabs.Content>

	<Tabs.Content value="functions" class="space-y-2">
		<h2>Functions</h2>
		<ListFunctions functions={data.funcs} />
	</Tabs.Content>

	<Tabs.Content value="triggers" class="space-y-2">
		<h2>Triggers</h2>
		<ListTriggers triggers={data.triggers} />
	</Tabs.Content>
</Tabs.Root>
