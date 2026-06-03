<script lang="ts">
	import { page } from "$app/state";
	import { ChevronRightIcon, TableIcon } from "lucide-svelte";
	import { cn } from "tailwind-variants";
	import NotFound from "../global/not-found.svelte";
	import * as Item from "../ui/item";

  let {
    tables,
    class: className = '',
  }: {
    tables: string[];
    class?: string,
  } = $props();

  const { database, schema, table } = $derived(page.params);

</script>

<div class={cn('grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full', className)}>
  {#each tables as table}
    <Item.Root variant='muted' title={table}>
      {#snippet child({ props })}
        <a href={`/db/${database}/schema/${schema}/table/${table}`} {...props}>
          <Item.Media>
            <TableIcon class="size-5" />
          </Item.Media>
          <Item.Content class='min-w-0'>
            <Item.Title class='w-full truncate!'>{table}</Item.Title>
          </Item.Content>
          <Item.Actions>
            <ChevronRightIcon class="size-4" />
          </Item.Actions>
        </a>
      {/snippet}
    </Item.Root>
  {:else}
    <NotFound>No tables</NotFound>
  {/each}
</div>