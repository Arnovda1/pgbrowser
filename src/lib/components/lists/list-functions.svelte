<script lang="ts">
	import { page } from "$app/state";
	import type { Func } from "$lib/types";
	import { ChevronRightIcon, FunctionSquareIcon } from "lucide-svelte";
	import { cn } from "tailwind-variants";
	import NotFound from "../global/not-found.svelte";
	import * as Item from "../ui/item";

  let {
    functions,
    class: className = '',
  }: {
    functions: Func[];
    class?: string,
  } = $props();

  const { database, schema, table } = $derived(page.params);

</script>

<div class={cn('grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full', className)}>
  {#each functions as func}
    <Item.Root variant='muted' title={func.functionName}>
      {#snippet child({ props })}
        <a href={`/db/${database}/schema/${schema}/func/${func.functionName}`} {...props}>
          <Item.Media>
            <FunctionSquareIcon class="size-5" />
          </Item.Media>
          <Item.Content class='min-w-0'>
            <Item.Title class='w-full truncate!'>{func.functionName}</Item.Title>
          </Item.Content>
          <Item.Actions>
            <ChevronRightIcon class="size-4" />
          </Item.Actions>
        </a>
      {/snippet}
    </Item.Root>
  {:else}
    <NotFound>No functions</NotFound>
  {/each}
</div>