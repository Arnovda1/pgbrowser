<script lang="ts">
	import type { QueryResult } from "$lib/types";

  let {
    result,
  }: {
    result?: QueryResult;
  } = $props();

</script>

<div class="border-t text-xs flex items-baseline text-muted-foreground justify-between pt-px -mb-1 px-0.5">
  <p>
    Total rows: {result?.success ? result?.meta?.count || 0 : 0}
  </p>

  <p>
    Execution time: {result?.meta.executionTimeMs || 0}ms
  </p>
</div>