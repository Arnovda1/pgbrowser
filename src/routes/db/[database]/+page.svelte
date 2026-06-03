<script lang="ts">
	import { page } from "$app/state";
	import * as Item from "$lib/components/ui/item";
	import { BoxesIcon, ChevronRightIcon } from "lucide-svelte";

  let { data } = $props();

  const { database } = $derived(page.params);

</script>

<h2>Schemas</h2>

<div class='grid md:grid-cols-2 lg:grid-cols-3 gap-2'>
  {#each data.schemas as schema}
    <Item.Root variant='muted' title={schema}>
      {#snippet child({ props })}
        <a href={`/db/${database}/schema/${schema}`} {...props}>
          <Item.Media>
            <BoxesIcon class="size-5" />
          </Item.Media>
          <Item.Content class='min-w-0'>
            <Item.Title class='w-full truncate!'>{schema}</Item.Title>
          </Item.Content>
          <Item.Actions>
            <ChevronRightIcon class="size-4" />
          </Item.Actions>
        </a>
      {/snippet}
    </Item.Root>
  {/each}
</div>