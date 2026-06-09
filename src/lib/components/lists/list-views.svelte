<script lang="ts">
	import { page } from '$app/state';
	import { ChevronRightIcon, ViewIcon } from 'lucide-svelte';
	import { cn } from 'tailwind-variants';
	import NotFound from '../global/not-found.svelte';
	import * as Item from '../ui/item';
	import ListViewsItems from './list-views-items.svelte';

	let {
		views,
		class: className = '',
	}: {
		views: string[];
		class?: string;
	} = $props();
</script>

<div class={cn('grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
	{#if views.length > 0}
		<ListViewsItems {views} />
	{:else}
		<NotFound>No views</NotFound>
	{/if}
</div>
