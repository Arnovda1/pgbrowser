<script lang="ts">
	import { query } from "$lib/services/db-service";
	import type { QueryResult } from "$lib/types";
	import { getWhereClause } from "$lib/util/pk-helpers";
	import { XIcon } from "lucide-svelte";
	import { slide } from "svelte/transition";
	import ReadOnlyJson from "./read-only-json.svelte";
	import Button from "./ui/button/button.svelte";
	import type { ResizablePane } from "./ui/resizable";

  let {
    sidePane,
    pkValue,
    primaryKey,
    database,
    schema,
    table,
  }: {
    sidePane?: ResizablePane;
    pkValue?: string;
    primaryKey?: string | string[];
    database?: string;
    schema?: string;
    table?: string;
  } = $props()

  let result = $state<undefined | QueryResult>(undefined);

  $effect(() => {
    if (pkValue === undefined || !primaryKey || !database || !schema || !table) {
      result = undefined;
      return;
    }

    const controller = new AbortController();
    let isCurrent = true;

    const fetchRecord = async () => {
      if (!pkValue || !primaryKey) return;

      try {
        const whereClause = await getWhereClause(pkValue, primaryKey);

        const res = await query(
          { database, schema }, 
          `SELECT * FROM "${table}" WHERE ${whereClause} LIMIT 1`,
        );

        if (isCurrent) {
          result = res;
        }
      } catch (error) {
        if (isCurrent) {
          console.error("Failed to fetch record:", error);
          result = undefined;
        }
      }
    }

    fetchRecord();

    return () => {
      isCurrent = false;
      controller.abort(); 
    };
  });

</script>

<div class="flex flex-col h-full" transition:slide={{axis: 'x'}}>
  <div class="flex items-center justify-between my-1">
    <h3>JSON viewer</h3>

    {result?.error}
    
    <Button variant='ghost' size='icon-sm' onclick={sidePane?.collapse}>
      <XIcon />
    </Button>
  </div>
  
  <div class="border rounded-2xl flex-1 overflow-hidden">
    {#if result?.success}
      <ReadOnlyJson code={JSON.stringify(result.data[0], null, 2)} />
    {/if}
  </div>
</div>