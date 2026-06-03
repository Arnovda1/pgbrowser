<script lang="ts">
	import * as Table from "$lib/components/ui/table";
	import type { TableIndex } from "$lib/types";

  let {
    indexes,
    class: className = '',
  }: {
    indexes: TableIndex[];
    class?: string,
  } = $props();

</script>

<Table.Root class={className}>
  <Table.Header>
    <Table.Row>
      <Table.Head class='w-[50%]'>Column</Table.Head>
      <Table.Head class='w-[50%]'>Type</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each indexes as index}
      <Table.Row class='p-0!'>
        <Table.Cell class='font-medium'>
          {index.columns}
        </Table.Cell>
        <Table.Cell>
          {index.isUnique ? 'UNIQUE' : ''}
          {index.isPrimaryKey ? 'PK' : 'INDEX'}
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>