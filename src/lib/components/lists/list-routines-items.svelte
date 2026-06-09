<script lang="ts">
	import { page } from '$app/state';
	import type { Routine } from '$lib/types';
	import { ChevronRightIcon, FunctionSquareIcon } from 'lucide-svelte';
	import * as Item from '../ui/item';

	let {
		routines,
    search,
	}: {
		routines: Routine[];
    search?: string,
	} = $props();

	const { database, schema } = $derived(page.params);

  const filteredRoutines = $derived(search
    ? routines.filter(r => r.name.toLowerCase().includes(search))
    : routines
  );
</script>

{#each filteredRoutines as routine}
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
{/each}
