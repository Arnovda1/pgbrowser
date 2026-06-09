<script lang="ts">
	import { page } from '$app/state';
	import type { Routine } from '$lib/types';
	import { ChevronRightIcon, FunctionSquareIcon } from 'lucide-svelte';
	import { cn } from 'tailwind-variants';
	import NotFound from '../global/not-found.svelte';
	import * as Item from '../ui/item';

	let {
		routines,
		class: className = '',
	}: {
		routines: Routine[];
		class?: string;
	} = $props();

	const { database, schema } = $derived(page.params);
</script>

<div class={cn('grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
	{#each routines as routine}
		<Item.Root variant="muted" title={routine.name}>
			{#snippet child({ props })}
				<a href={`/db/${database}/schema/${schema}/routine/${routine.name}`} {...props}>
					<Item.Media>
						<FunctionSquareIcon class="size-5" />
					</Item.Media>
					<Item.Content class="min-w-0">
						<Item.Title class="w-full truncate!">{routine.name}</Item.Title>
					</Item.Content>
					<Item.Actions>
						<ChevronRightIcon class="size-4" />
					</Item.Actions>
				</a>
			{/snippet}
		</Item.Root>
	{:else}
		<NotFound>No functions or procedures</NotFound>
	{/each}
</div>
