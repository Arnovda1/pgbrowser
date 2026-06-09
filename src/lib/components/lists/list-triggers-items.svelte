<script lang="ts">
	import { page } from "$app/state";
	import type { Trigger } from "$lib/types";
	import { ChevronRightIcon, ZapIcon } from "lucide-svelte";
	import * as Item from "../ui/item";

  let {
    triggers,
    search,
  }: {
    triggers: Trigger[];
    search?: string,
  } = $props();

  const { database, schema } = $derived(page.params);

  const filteredTriggers = $derived(search
    ? triggers.filter(t => t.triggerName.toLowerCase().includes(search))
    : triggers
  );
</script>

{#each filteredTriggers as trigger}
  <Item.Root variant='muted' title={trigger.triggerName}>
    {#snippet child({ props })}
      <a href={`/db/${database}/schema/${schema}/table/${trigger.tableName}/trigger/${trigger.triggerName}`} {...props}>
        <Item.Media>
          <ZapIcon class="size-5" />
        </Item.Media>
        <Item.Content class='min-w-0'>
          <Item.Title class='w-full truncate!'>{trigger.triggerName}</Item.Title>
        </Item.Content>
        <Item.Actions>
          <ChevronRightIcon class="size-4" />
        </Item.Actions>
      </a>
    {/snippet}
  </Item.Root>
{/each}