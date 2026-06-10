<script lang="ts">
	import { page } from '$app/state';
	import Erd from '$lib/components/erd.svelte';
	import NotFound from '$lib/components/global/not-found.svelte';
	import ListRoutinesItems from '$lib/components/lists/list-routines-items.svelte';
	import ListRoutines from '$lib/components/lists/list-routines.svelte';
	import ListTablesItems from '$lib/components/lists/list-tables-items.svelte';
	import ListTables from '$lib/components/lists/list-tables.svelte';
	import ListTriggersItems from '$lib/components/lists/list-triggers-items.svelte';
	import ListTriggers from '$lib/components/lists/list-triggers.svelte';
	import ListViewsItems from '$lib/components/lists/list-views-items.svelte';
	import ListViews from '$lib/components/lists/list-views.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Tabs from '$lib/components/ui/tabs';

	let { data } = $props();

	let tab = $state<string>(page.url.searchParams.get('tab') || 'tables');
	let search = $state<string>('');

	$effect(() => {
		if (search) tab = 'search';
		else tab = page.url.searchParams.get('tab') || 'tables'
	});

</script>

<Tabs.Root bind:value={tab} class='h-full'>
	<div class="flex justify-between gap-1.5">
		<Tabs.List>
			<Tabs.Trigger value="tables">Tables</Tabs.Trigger>
			<Tabs.Trigger value="views">Views</Tabs.Trigger>
			<Tabs.Trigger value="routines">Routines</Tabs.Trigger>
			<Tabs.Trigger value="triggers">Triggers</Tabs.Trigger>
			<Tabs.Trigger value="erd">ER Diagram</Tabs.Trigger>
			{#if search}
				<Tabs.Trigger value="search">Search</Tabs.Trigger>
			{/if}
		</Tabs.List>

		<Input
			class='max-w-full min-w-14 w-fit'
			placeholder='Search schema'
			oninput={e => search = e.currentTarget.value.toLowerCase()}
		/>
	</div>

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

	<Tabs.Content value="search" class="space-y-2">
		<h2>Search for "{search}"</h2>
		<div class="group grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-fit">
			<ListTablesItems tables={data.tables} {search} />
			<ListViewsItems views={data.views} {search} />
			<ListRoutinesItems routines={data.routines} {search} />
			<ListTriggersItems triggers={data.triggers} {search} />
			
			<div class="group-has-[:nth-child(2)]:hidden col-span-full text-center">
      <!-- <p>No results found for "{search}".</p> -->
			 <NotFound>No results found for "{search}"</NotFound>
    	</div>
		</div>
	</Tabs.Content>
</Tabs.Root>
