<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import NotFound from "$lib/components/global/not-found.svelte";
	import * as Collapsible from "$lib/components/ui/collapsible/index.js";
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { ChevronDownIcon, EllipsisIcon, PencilIcon, PlusIcon, TableIcon, TextAlignJustifyIcon } from "lucide-svelte";

  let {
    tables,
  }: {
    tables: string[],
  } = $props();

  const sidebar = Sidebar.useSidebar();

  const { database, schema, table } = $derived(page.params);

</script>


<Collapsible.Root open class="group/collapsible">
  <Sidebar.Group>
    <Sidebar.GroupLabel>
      {#snippet child({ props })}
        <Collapsible.Trigger {...props}>
          Tables
          <ChevronDownIcon
            class="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
          />
        </Collapsible.Trigger>
      {/snippet}
    </Sidebar.GroupLabel>
    <Collapsible.Content>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each tables as t}
            <Sidebar.MenuItem onclick={() => sidebar.setOpenMobile(false)}>
              <Sidebar.MenuButton
                class='border-sidebar/1 border-r-8'
                isActive={t === table}
                onclick={() => goto(`/db/${database}/schema/${schema}/table/${t}`)}
              >
                <TableIcon /> {t}
              </Sidebar.MenuButton>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  {#snippet child({ props })}
                    <Sidebar.MenuAction {...props}>
                      <EllipsisIcon class='bg-sidebar rounded-full' />
                    </Sidebar.MenuAction>
                  {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content side="right" align="start">
                  <DropdownMenu.Item>
                    {#snippet child({ props })}
                      <a {...props} href={`/db/${database}/schema/${schema}/table/${t}/select`}>
                        <TextAlignJustifyIcon /> View records
                      </a>
                    {/snippet}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    {#snippet child({ props })}
                      <a {...props} href={`/db/${database}/schema/${schema}/table/${t}/alter`}>
                        <PencilIcon /> Alter table
                      </a>
                    {/snippet}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    {#snippet child({ props })}
                      <a {...props} href={`/db/${database}/schema/${schema}/table/${t}/new`}>
                        <PlusIcon /> New record
                      </a>
                    {/snippet}
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Sidebar.MenuItem>
          {:else}
            <Sidebar.MenuItem>
              <NotFound small>No tables</NotFound>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Collapsible.Content>
  </Sidebar.Group>
</Collapsible.Root>