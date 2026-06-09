<script lang="ts">
	import { cn } from "tailwind-variants";
	import NotFound from "../global/not-found.svelte";
	import ListTablesItems from "./list-tables-items.svelte";

  let {
    tables,
    class: className = '',
  }: {
    tables: string[];
    class?: string,
  } = $props();
</script>

<div class={cn('grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full', className)}>
  {#if tables.length > 0}
    <ListTablesItems {tables} />
  {:else}
    <NotFound>No tables</NotFound>
  {/if}
</div>