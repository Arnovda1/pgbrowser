<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import db from '$lib/stores/db.svelte';
	import type { Func } from '$lib/types';
	import { BoxesIcon, ChevronsUpDownIcon, DatabaseIcon, UnplugIcon } from 'lucide-svelte';
	import NotFound from '../global/not-found.svelte';
	import SidebarTables from './sidebar/sidebar-tables.svelte';

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
  
  // let uniqueFuncs = $derived.by(() => {
  //   return Array.from(funcs.reduce((map, f) => {
  //     if (map.has(f.functionName)) {
  //       map.get(f.functionName).amount += 1;
  //     } else {
  //       map.set(f.functionName, { ...f, amount: 1 });
  //     }
  //     return map;
  //   }, new Map()).values());
  // });

  const closeMobile = () => {
    sidebar.setOpenMobile(false);
  }

</script>

<Sidebar.Root variant='floating'>
	<Sidebar.Header>
    <Sidebar.Menu>
      <!-- <Sidebar.GroupLabel>Database</Sidebar.GroupLabel> -->
      <!-- {#if db.connection && 'database' in db.connection && db.connection.type !== 'mongodb'} -->
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
                <Sidebar.MenuButton isActive={s === schema} onclick={() => goto(`/db/${database}/schema/${s}`)}>
                  <BoxesIcon /> {s}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            {/each}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    {/if}

	</Sidebar.Content>
	<Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton variant='outline' onclick={() => {db.disconnect(); goto('/connect')}}>
          <UnplugIcon /> Disconnect
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Footer>
</Sidebar.Root>
