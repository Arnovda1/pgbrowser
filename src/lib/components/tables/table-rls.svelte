<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { RLSInfo } from '$lib/types';
	import { cn } from 'tailwind-variants';
	import ReadOnlySql from '../query/read-only-sql.svelte';
	import SelectedRls from '../selected-rls.svelte';

	let {
		rls,
		class: className = '',
	}: {
		rls: RLSInfo[];
		class?: string;
	} = $props();

	let selectedRls = $state<string | undefined>(undefined); // policyName

	const handleRowClick = (policy: RLSInfo) => {
		if (selectedRls === policy.policyName || !policy.policyName) selectedRls = undefined;
		else selectedRls = policy.policyName;
	};
</script>

<Table.Root class={cn('overflow-hidden rounded-xl', className)}>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[28%]">Name</Table.Head>
			<Table.Head class="w-[12%]">Command</Table.Head>
			<Table.Head class="w-[30%]">Using</Table.Head>
			<Table.Head class="w-[30%]">With check</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each rls as policy}
			{@const selected = selectedRls === policy.policyName}

			<Table.Row
				class="cursor-pointer p-0!
        {selected ? 'border-b-0 bg-primary text-primary-foreground hover:bg-primary/90' : ''}"
				onclick={() => handleRowClick(policy)}
			>
				<Table.Cell class="font-medium select-none">
					{policy.policyName}
				</Table.Cell>
				<Table.Cell class="select-none">
					{policy.command}
				</Table.Cell>
				<Table.Cell>
					{#if policy.usingExpression}
						<div
							class="w-full shrink-0 overflow-hidden rounded-xl border bg-card pr-1 text-foreground"
						>
							<ReadOnlySql code={policy.usingExpression} />
						</div>
					{/if}
				</Table.Cell>
				<Table.Cell>
					{#if policy.withCheckExpression}
						<div
							class="w-full shrink-0 overflow-hidden rounded-xl border bg-card pr-1 text-foreground"
						>
							<ReadOnlySql code={policy.withCheckExpression} />
						</div>
					{/if}
				</Table.Cell>
			</Table.Row>

			{#if selected}
				<Table.Row class="bg-primary text-primary-foreground hover:bg-primary">
					<Table.Cell colspan={500}>
						<SelectedRls {policy} />
					</Table.Cell>
				</Table.Row>
			{/if}
		{/each}
	</Table.Body>
</Table.Root>
