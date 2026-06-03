<script lang="ts">
	import { cn } from 'tailwind-variants';

	let {
		error,
		small = false,
		class: className = '',
	}: {
		error?: string | null;
		small?: boolean;
		class?: string;
	} = $props();
</script>

{#if error}
	<p
		class={cn(`
    my-auto rounded-full bg-destructive/10 px-3 text-sm text-destructive
    ${small ? 'py-0.5 text-sm' : 'py-2'}
    ${className}
  `)}
	>
		{error}
	</p>
{/if}
