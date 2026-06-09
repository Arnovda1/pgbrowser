<script lang="ts">
	import { page } from '$app/state';
	import { ChevronRightIcon, ViewIcon } from 'lucide-svelte';
	import * as Item from '../ui/item';

	let {
		views,
		search,
	}: {
		views: string[];
    search?: string,
	} = $props();

	const { database, schema } = $derived(page.params);

  const filteredViews = $derived(search
    ? views.filter(v => v.toLowerCase().includes(search))
    : views
  );
</script>

{#each filteredViews as view}
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
{/each}