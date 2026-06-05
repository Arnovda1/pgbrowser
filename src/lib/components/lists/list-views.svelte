<script lang="ts">
	import { page } from '$app/state';
	import { ChevronRightIcon, ViewIcon } from 'lucide-svelte';
	import { cn } from 'tailwind-variants';
	import NotFound from '../global/not-found.svelte';
	import * as Item from '../ui/item';

	let {
		views,
		class: className = '',
	}: {
		views: string[];
		class?: string;
	} = $props();

	const { database, schema, view } = $derived(page.params);
</script>

<div class={cn('grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
	{#each views as view}
		<Item.Root variant="muted" title={view}>
			{#snippet child({ props })}
				<a href={`/db/${database}/schema/${schema}/view/${view}`} {...props}>
					<Item.Media>
						<ViewIcon class="size-5" />
					</Item.Media>
					<Item.Content class="min-w-0">
						<Item.Title class="w-full truncate!">{view}</Item.Title>
					</Item.Content>
					<Item.Actions>
						<ChevronRightIcon class="size-4" />
					</Item.Actions>
				</a>
			{/snippet}
		</Item.Root>
	{:else}
		<NotFound>No views</NotFound>
	{/each}
</div>
