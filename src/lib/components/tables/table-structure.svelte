<script lang="ts">
	import { page } from "$app/state";
	import * as Table from "$lib/components/ui/table";
	import type { Column } from "$lib/types";
	import Button from "../ui/button/button.svelte";

  let {
    columns,
    class: className = '',
  }: {
    columns: Column[];
    class?: string;
  } = $props();

  const { database, schema } = $derived(page.params);

</script>

<Table.Root class={className}>
  <Table.Header>
    <Table.Row>
      <Table.Head class='w-[30%]'>Column</Table.Head>
      <Table.Head class='w-[50%]'>Type</Table.Head>
      <Table.Head class='w-[20%]'>FK table</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each columns as col}
      <Table.Row class='p-0!'>
        <Table.Cell class='font-medium'>
          {col.columnName}
        </Table.Cell>
        <Table.Cell>
          {col.dataType}
        </Table.Cell>
        <Table.Cell>
          {#if col.referencedTable}
            <Button
              variant='link'
              size='sm'
              class='p-0! h-fit!'
              href={`/db/${database}/schema/${schema}/table/${col.referencedTable}`}
            >
              {col.referencedTable}
            </Button>
          {/if}
          <!-- <a href={`/db/${database}/schema/${schema}/table/${col.referencedTable}`}>
            {col.referencedTable}
          </a> -->
        </Table.Cell>
        <!-- {JSON.stringify(col)} -->
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>