<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import AlertDialog from '$lib/components/global/alert-dialog.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import db from '$lib/stores/db.svelte';
	import type { Routine } from '$lib/types';
	import { ChevronsUpDownIcon, DatabaseIcon, RotateCcw, UnplugIcon } from 'lucide-svelte';
	import NotFound from '../../global/not-found.svelte';
	import SidebarSchemaTabs from './sidebar-schema-tabs.svelte';
	import SidebarSchemas from './sidebar-schemas.svelte';
	import SidebarTables from './sidebar-tables.svelte';
	import SidebarViews from './sidebar-views.svelte';

	let {
		views,
		tables,
		schemas,
		databases,
		routines,
	}: {
		views: string[];
		tables: string[];
		schemas: string[];
		databases: string[];
		routines: Routine[];
	} = $props();

	const sidebar = Sidebar.useSidebar();

	const { database, schema } = $derived(page.params);

	const closeMobile = () => {
		sidebar.setOpenMobile(false);
	};
</script>

<Sidebar.Root variant="floating">
	<Sidebar.Header>
		<Sidebar.Menu>
			{#if db.connection}
				<!-- database -->

				<Sidebar.MenuItem>
					<Sidebar.GroupLabel>Database</Sidebar.GroupLabel>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton
									{...props}
									class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<DatabaseIcon />
									<span class="font-semibold">{database || 'Select database'}</span>
									<ChevronsUpDownIcon class="ms-auto" />
								</Sidebar.MenuButton>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.DropdownMenuLabel>Databases</DropdownMenu.DropdownMenuLabel>
							{#each databases as database}
								<DropdownMenu.Item onclick={closeMobile}>
									{#snippet child({ props })}
										<a href="/db/{database}" {...props}>
											{database}
										</a>
									{/snippet}
								</DropdownMenu.Item>
							{:else}
								<DropdownMenu.Label>
									<NotFound small>No databases</NotFound>
								</DropdownMenu.Label>
							{/each}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Sidebar.MenuItem>
			{/if}
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- tables + functions or schemas -->

		{#if schema}
			<!-- show schema tabs -->
			<SidebarSchemaTabs />

			<!-- show tables and views if schema selected -->
			<SidebarTables {tables} />
			<SidebarViews {views} />
		{:else}
			<!-- show schemas if none selected -->
			<SidebarSchemas {schemas} />
		{/if}
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Menu class="flex-row gap-1">
			<Sidebar.MenuItem class="w-full">
				<AlertDialog
					onContinue={() => {
						db.disconnect();
						goto('/connect');
					}}
					title="Disconnect?"
					continueLabel="Disconnect"
					class="w-full"
				>
					<Sidebar.MenuButton variant="outline" title="Disconnect from server">
						<UnplugIcon /> Disconnect
					</Sidebar.MenuButton>
				</AlertDialog>
			</Sidebar.MenuItem>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton variant="outline" onclick={invalidateAll} title="Refresh">
					<RotateCcw />
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
