<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import TablesSidebar from '$lib/components/navigation/sidebar/app-sidebar.svelte';
	import TopBar from '$lib/components/navigation/top-bar.svelte';
	import SidebarInset from '$lib/components/ui/sidebar/sidebar-inset.svelte';
	import SidebarProvider from '$lib/components/ui/sidebar/sidebar-provider.svelte';
	import db from '$lib/stores/db.svelte.js';
	import { schemaStore } from '$lib/stores/schema.svelte';
	import { onMount } from 'svelte';

	let { children, data } = $props();

	$effect(() => {
		if (data.columns && page.params.schema) {
			schemaStore.setStructure(page.params.schema, data.columns);
		} else {
			schemaStore.clear();
		}
	});

	onMount(() => {
		if (!db.connection) goto('/connect');
	});
</script>

<div class="h-dvh w-full">
	<SidebarProvider>
		<TablesSidebar {...data} />

		<SidebarInset class="space-y-3 p-3">
			<TopBar {...data} />

			{@render children()}
		</SidebarInset>
	</SidebarProvider>
</div>
