<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import NotFound from '$lib/components/global/not-found.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import {
		ChevronDownIcon,
		ViewIcon
	} from 'lucide-svelte';

	let {
		views,
	}: {
		views: string[];
	} = $props();

	const sidebar = Sidebar.useSidebar();

	const { database, schema, view } = $derived(page.params);
</script>

<Collapsible.Root open class="group/collapsible">
	<Sidebar.Group>
		<Sidebar.GroupLabel>
			{#snippet child({ props })}
				<Collapsible.Trigger {...props}>
					Views
					<ChevronDownIcon
						class="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
					/>
				</Collapsible.Trigger>
			{/snippet}
		</Sidebar.GroupLabel>
		<Collapsible.Content>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each views as v}
						<Sidebar.MenuItem onclick={() => sidebar.setOpenMobile(false)}>
							<Sidebar.MenuButton
								class="border-r-8 border-sidebar/1"
								isActive={v === view}
								onclick={() => goto(`/db/${database}/schema/${schema}/view/${v}`)}
							>
								<ViewIcon /> {v}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{:else}
						<Sidebar.MenuItem>
							<NotFound small>No views</NotFound>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Collapsible.Content>
	</Sidebar.Group>
</Collapsible.Root>
