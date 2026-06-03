<script lang="ts">
	import { page } from "$app/state";
	import type { Column, QueryResult } from "$lib/types";
	import { formatIfDate } from "$lib/util/date";
	import { urlRegex } from "$lib/util/regexes";
	import { Button } from "./ui/button";
	import { TableCell } from "./ui/table";
  import * as Tooltip from "./ui/tooltip";

  let {
    entry,
    result,
    pkValue,
    columns,
    highlighted,
  }: {
    entry: [string, any];
    result: QueryResult;
    columns?: Column[];
    pkValue?: string;
    highlighted?: boolean;
  } = $props();

  const fkReferencedTable = $derived(columns ? columns.find(c => c.columnName === entry[0])?.referencedTable : undefined)
  const dataType = $derived(result.success && result.meta.columns.find(c => c.name === entry[0])?.type)
  const { database, schema } = $derived(page.params);

</script>

<TableCell class='max-w-sm truncate'>
  {#if entry[1] === null}
    <span class="italic {highlighted ? 'text-muted/80' : 'text-muted-foreground'}">
      NULL
    </span>

  {:else if fkReferencedTable}
    <Button
      size='sm'
      variant='link'
      href={`/db/${database}/schema/${schema}/table/${fkReferencedTable}/record/${pkValue}`}
      class="p-0! h-fit! block truncate {highlighted ? 'text-primary-foreground' : ''}"
    >
      {entry[1]}
    </Button>

  {:else if typeof entry[1] === 'object'}
    {JSON.stringify(entry[1])}

  {:else if dataType === 'timestamp'}
    
    {formatIfDate(entry[1])}

  {:else if dataType === 'text' && urlRegex.test(entry[1])}
    <Button
      size='sm'
      variant='link'
      target="_blank"
      href={entry[1]}
      class="p-0! h-fit! block truncate {highlighted ? 'text-primary-foreground' : ''}"
    >
      {entry[1]}
    </Button>

  {:else}
    {entry[1]}

  {/if}
</TableCell>