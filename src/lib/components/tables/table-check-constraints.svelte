<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { CheckConstraint } from '$lib/types';
	import { cn } from 'tailwind-variants';
	import ReadOnlyEditor from '../query/read-only-sql.svelte';

	let {
		checkConstraints,
		class: className = '',
	}: {
		checkConstraints: CheckConstraint[];
		class?: string;
	} = $props();
</script>

<Table.Root class={cn('overflow-hidden rounded-xl', className)}>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[50%]">Constraint</Table.Head>
			<Table.Head class="w-[50%]">Expression</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each checkConstraints as checkConstraint}
			<Table.Row class="p-0!">
				<Table.Cell class="font-medium">
					{checkConstraint.constraintName}
				</Table.Cell>
				<Table.Cell>
					<div class="w-fit shrink-0 overflow-hidden rounded-xl border pr-1">
						<ReadOnlyEditor code={checkConstraint.checkExpression} />
					</div>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
