<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cn } from 'tailwind-variants';

	let {
		message,
		small = false,
		class: className = '',
	}: {
		message?: string | null;
		small?: boolean;
		class?: string;
	} = $props();
</script>

{#if message}
	<p
		class={cn(`
    my-auto rounded-2xl bg-primary/10 px-3 text-sm text-primary
    ${small ? 'py-0.5 text-sm' : 'py-2'}
    ${className}
  `)}
		transition:slide={{ duration: 100 }}
	>
		{message}
	</p>
{/if}
