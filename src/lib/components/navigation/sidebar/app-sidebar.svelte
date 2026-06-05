<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import AlertDialog from '$lib/components/global/alert-dialog.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import db from '$lib/stores/db.svelte';
	import type { Func } from '$lib/types';
	import {
		BoxesIcon,
		ChevronsUpDownIcon,
		DatabaseIcon,
		RotateCcw,
		UnplugIcon,
	} from 'lucide-svelte';
	import NotFound from '../../global/not-found.svelte';
	import SidebarTables from './sidebar-tables.svelte';

	let {
		tables,
		schemas,
		databases,
		funcs,
	}: {
		tables: string[];
		schemas: string[];
		databases: string[];
		funcs: Func[];
	} = $props();

	const sidebar = Sidebar.useSidebar();

	const { database, schema, table, functionName } = $derived(page.params);

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
			<!-- show tables if schema selected -->
			<SidebarTables {tables} />
		{:else}
			<!-- show schemas if none selected -->
			<Sidebar.Group>
				<Sidebar.GroupLabel>Schemas</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each schemas as s}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={s === schema}
									onclick={() => goto(`/db/${database}/schema/${s}`)}
								>
									<BoxesIcon />
									{s}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
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
