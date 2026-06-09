<script lang="ts">
	import type { Routine } from '$lib/types';
	import { cn } from 'tailwind-variants';
	import NotFound from '../global/not-found.svelte';
	import ListRoutinesItems from './list-routines-items.svelte';

	let {
		routines,
		class: className = '',
	}: {
		routines: Routine[];
		class?: string;
	} = $props();
</script>

<div class={cn('grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
	{#if routines.length > 0}
		<ListRoutinesItems {routines} />
	{:else}
		<NotFound>No functions or procedures</NotFound>
	{/if}
</div>
