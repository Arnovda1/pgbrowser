<script lang="ts">
	import { page } from '$app/state';
	import Erd from '$lib/components/erd.svelte';
	import ListRoutines from '$lib/components/lists/list-routines.svelte';
	import ListTables from '$lib/components/lists/list-tables.svelte';
	import ListTriggers from '$lib/components/lists/list-triggers.svelte';
	import ListViews from '$lib/components/lists/list-views.svelte';
	import * as Tabs from '$lib/components/ui/tabs';

	let { data } = $props();

	let tab = $state<string>(page.url.searchParams.get('tab') || 'tables');
</script>

<Tabs.Root bind:value={tab} class='h-full'>
	<Tabs.List>
		<Tabs.Trigger value="tables">Tables</Tabs.Trigger>
		<Tabs.Trigger value="views">Views</Tabs.Trigger>
		<Tabs.Trigger value="routines">Routines</Tabs.Trigger>
		<Tabs.Trigger value="triggers">Triggers</Tabs.Trigger>
		<Tabs.Trigger value="erd">ER Diagram</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="tables" class="space-y-2">
		<h2>Tables</h2>
		<ListTables tables={data.tables} />
	</Tabs.Content>

	<Tabs.Content value="views" class="space-y-2">
		<h2>Views</h2>
		<ListViews views={data.views} />
	</Tabs.Content>

	<Tabs.Content value="routines" class="space-y-2">
		<h2>Functions & procedures</h2>
		<ListRoutines routines={data.routines} />
	</Tabs.Content>

	<Tabs.Content value="triggers" class="space-y-2">
		<h2>Triggers</h2>
		<ListTriggers triggers={data.triggers} />
	</Tabs.Content>

	<Tabs.Content value="erd" class="space-y-2">
		<Erd {...data} />
	</Tabs.Content>
</Tabs.Root>
