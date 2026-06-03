<script lang="ts">
	import { page } from "$app/state";
	import type { Trigger } from "$lib/types";
	import { ChevronRightIcon, ZapIcon } from "lucide-svelte";
	import { cn } from "tailwind-variants";
	import NotFound from "../global/not-found.svelte";
	import * as Item from "../ui/item";

  let {
    triggers,
    class: className = '',
    table,
  }: {
    triggers: Trigger[];
    class?: string;
    table?: string;
  } = $props();

  const { database, schema } = $derived(page.params);

  const filteredTriggers = $derived(table ? triggers.filter(t => t.tableName === table) : triggers);

</script>

<div class={cn('grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full', className)}>
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
  {:else}
    <NotFound>No triggers</NotFound>
  {/each}
</div>