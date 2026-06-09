<script lang="ts">
	import type { Trigger } from "$lib/types";
	import { cn } from "tailwind-variants";
	import NotFound from "../global/not-found.svelte";
	import ListTriggersItems from "./list-triggers-items.svelte";

  let {
    triggers,
    class: className = '',
    table,
  }: {
    triggers: Trigger[];
    class?: string;
    table?: string;
  } = $props();

  const filteredTriggers = $derived(table ? triggers.filter(t => t.tableName === table) : triggers);

</script>

<div class={cn('grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full', className)}>
  {#if filteredTriggers.length > 0}
    <ListTriggersItems triggers={filteredTriggers} />
  {:else}
    <NotFound>No triggers</NotFound>
  {/if}
</div>