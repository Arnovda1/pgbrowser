<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { RLSInfo } from '$lib/types';
	import { cn } from 'tailwind-variants';
	import NotFound from '../global/not-found.svelte';
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
			<Table.Head class="w-[35%]">Name</Table.Head>
			<Table.Head class="w-[20%]">Command</Table.Head>
			<Table.Head class="w-[45%]">Expression</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each rls as policy}
			{@const selected = selectedRls === policy.policyName}

			<Table.Row
				class="cursor-pointer p-0! {selected ? 'border-b-0' : ''}"
				onclick={() => handleRowClick(policy)}
			>
				<Table.Cell class="font-medium">
					{policy.policyName}
				</Table.Cell>
				<Table.Cell>
					{policy.command}
				</Table.Cell>
				<Table.Cell>
					{#if policy.usingExpression}
						<div class="w-fit shrink-0 overflow-hidden rounded-xl border pr-1">
							<ReadOnlySql code={policy.usingExpression} />
						</div>
					{:else}
						<NotFound>None</NotFound>
					{/if}
				</Table.Cell>
			</Table.Row>

			{#if selected}
				<Table.Row class="hover:bg-transparent">
					<Table.Cell colspan={500}>
						<SelectedRls {policy} />
					</Table.Cell>
				</Table.Row>
			{/if}
		{/each}
	</Table.Body>
</Table.Root>
