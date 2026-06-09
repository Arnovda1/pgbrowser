<script lang="ts">
	import { page } from "$app/state";
	import { ChevronRightIcon, TableIcon } from "lucide-svelte";
	import * as Item from "../ui/item";

  let {
    tables,
    search,
  }: {
    tables: string[];
    search?: string,
  } = $props();

  const { database, schema } = $derived(page.params);

  const filteredTables = $derived(search
    ? tables.filter(t => t.toLowerCase().includes(search))
    : tables
  );
</script>

{#each filteredTables as table}
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
{/each}