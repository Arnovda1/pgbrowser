<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { Snippet } from 'svelte';

	let {
		children,
		onContinue,
		title,
		description,
		cancelLabel = 'Cancel',
		continueLabel = 'Continue',
		class: className,
	}: {
		children: Snippet;
		onContinue: () => void;
		title: string;
		description?: string;
		cancelLabel?: string;
		continueLabel?: string;
		class?: string;
	} = $props();

	let open = $state<boolean>(false);
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger class={className}>
		{@render children()}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{title}</AlertDialog.Title>
			{#if description}
				<AlertDialog.Description>
					{description}
				</AlertDialog.Description>
			{/if}
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>{cancelLabel}</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={() => {
					open = false;
					onContinue();
				}}>{continueLabel}</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
