<script lang="ts">
	import { page } from '$app/state';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { Column, QueryResult } from '$lib/types';
	import { getPkValue } from '$lib/util/pk-helpers';
	import { PencilIcon, TrashIcon } from 'lucide-svelte';
	import AlertDialog from './global/alert-dialog.svelte';
	import RecordCell from './record-cell.svelte';
	import Button from './ui/button/button.svelte';

	let {
		result,
		columns,
		showButtons,
		showIndex,
		primaryKey,
		highlightedRecord,
		onRecordClick,
		loadMore,
	}: {
		result?: QueryResult;
		columns?: Column[]; // optional for linking FK to other tables
		showIndex?: boolean;
		showButtons?: boolean;
		primaryKey?: string | string[]; // required for onRecordClick
		highlightedRecord?: string;
		onRecordClick?: (pkValue: string) => void;
		loadMore?: () => void;
	} = $props();

	const { database, schema } = $derived(page.params);
</script>

{#if result?.success}
	<Table.Root>
		<Table.Header class="sticky top-0 z-10">
			<Table.Row>
				{#if showIndex}
					<Table.Head class="w-1">#</Table.Head>
				{/if}

				{#if showButtons}
					<Table.Head class="w-1" />
				{/if}

				{#each result?.meta.columns as column (column.number)}
					<Table.Head class="w-48 truncate">
						{column.name}
						<span class="text-xs font-normal text-muted-foreground">{column.type}</span>
					</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each result.data as record, i}
				{@const pkValue = getPkValue(record as Record<string, any>, primaryKey)}
				{@const highlighted = !!(highlightedRecord && highlightedRecord === pkValue)}

				<Table.Row
					class="
            {onRecordClick ? 'cursor-pointer' : ''} 
            {highlighted
						? 'bg-primary text-primary-foreground hover:bg-primary/80'
						: i % 2
							? 'bg-muted/40 transition-none hover:bg-muted/90'
							: ''}
          "
					onclick={() => primaryKey && pkValue && onRecordClick?.(pkValue)}
				>
					{#if showIndex}
						<Table.Cell class="w-1">
							{i + 1}
						</Table.Cell>
					{/if}

					{#if showButtons}
						<Table.Cell class="w-1 {highlighted ? 'text-black' : ''}">
							<Button
								variant="outline"
								title="Edit"
								size="icon-xs"
								class={highlighted ? 'border-muted-foreground' : ''}
							>
								<PencilIcon />
							</Button>
							<AlertDialog
								onContinue={() => {}}
								title="Delete record?"
								continueLabel="Delete record"
							>
								<Button
									variant="outline"
									title="Delete"
									size="icon-xs"
									class={highlighted ? 'border-muted-foreground' : ''}
								>
									<TrashIcon />
								</Button>
							</AlertDialog>
						</Table.Cell>
					{/if}

					{#if record && typeof record === 'object'}
						{#each Object.entries(record) as entry}
							<RecordCell {entry} {result} {columns} {pkValue} {highlighted} />
						{/each}
					{/if}
				</Table.Row>
			{:else}
				<Table.Row class="hover:bg-transparent border-none">
					<Table.Cell colspan={500} class="text-center p-4 italic text-muted-foreground">
						no records
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>

		{#if !(result.data.length % 50) && result.data.length !== 0}
			<Table.Row class="border-none hover:bg-transparent">
				<Table.Cell colspan={500} class="p-4 text-center">
					<div class="flex w-full justify-center">
						<Button onclick={loadMore}>Load more</Button>
					</div>
				</Table.Cell>
			</Table.Row>
		{/if}
	</Table.Root>
{/if}
