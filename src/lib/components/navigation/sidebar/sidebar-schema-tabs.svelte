<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import {
		ChevronDownIcon,
		FunctionSquareIcon,
		NetworkIcon,
		TableIcon,
		ViewIcon,
		ZapIcon
	} from 'lucide-svelte';

	const sidebar = Sidebar.useSidebar();

	const { database, schema, table } = $derived(page.params);
</script>

<Collapsible.Root open class="group/collapsible">
	<Sidebar.Group>
		<Sidebar.GroupLabel>
			{#snippet child({ props })}
				<Collapsible.Trigger {...props}>
					Schema
					<ChevronDownIcon
						class="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
					/>
				</Collapsible.Trigger>
			{/snippet}
		</Sidebar.GroupLabel>
		<Collapsible.Content>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
          <Sidebar.MenuItem onclick={() => sidebar.setOpenMobile(false)}>
            <Sidebar.MenuButton
              class="border-r-8 border-sidebar/1"
              onclick={() => goto(`/db/${database}/schema/${schema}?tab=tables`)}
            >
              <TableIcon /> Tables
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem onclick={() => sidebar.setOpenMobile(false)}>
            <Sidebar.MenuButton
              class="border-r-8 border-sidebar/1"
              onclick={() => goto(`/db/${database}/schema/${schema}?tab=views`)}
            >
              <ViewIcon /> Views
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem onclick={() => sidebar.setOpenMobile(false)}>
            <Sidebar.MenuButton
              class="border-r-8 border-sidebar/1"
              onclick={() => goto(`/db/${database}/schema/${schema}?tab=routines`)}
            >
              <FunctionSquareIcon /> Routines
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem onclick={() => sidebar.setOpenMobile(false)}>
            <Sidebar.MenuButton
              class="border-r-8 border-sidebar/1"
              onclick={() => goto(`/db/${database}/schema/${schema}?tab=triggers`)}
            >
              <ZapIcon /> Triggers
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem onclick={() => sidebar.setOpenMobile(false)}>
            <Sidebar.MenuButton
              class="border-r-8 border-sidebar/1"
              onclick={() => goto(`/db/${database}/schema/${schema}?tab=erd`)}
            >
              <NetworkIcon /> ER Diagram
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Collapsible.Content>
	</Sidebar.Group>
</Collapsible.Root>