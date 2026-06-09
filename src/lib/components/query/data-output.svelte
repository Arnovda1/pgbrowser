<script lang="ts">
	import type { QueryResult } from "$lib/types";
	import Error from "../global/error.svelte";
	import NotFound from "../global/not-found.svelte";
	import RecordsTable from "../records-table.svelte";
	import { Spinner } from "../ui/spinner";

  let {
    result,
    loading,
  }: {
    result?: QueryResult,
    loading?: boolean,
  } = $props();

</script>


{#if loading}
  <span class='m-auto'><Spinner class='m-auto' /> Loading</span>
{:else if result}
  <div class="flex flex-col h-full min-w-0">
    <Error error={result.error} class='mt-3 mr-3' />

    {#if !result.error}
      <RecordsTable {result} showIndex />
    {/if}
    
  </div>
{:else}
  <NotFound>No data</NotFound>
{/if}