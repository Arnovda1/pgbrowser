<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import TooltipProvider from '$lib/components/ui/tooltip/tooltip-provider.svelte';
	import './layout.css';

	let { children } = $props();

	// onMount(() => {
	// 	if (db.connection && !page.url.pathname.startsWith('/db')) goto('/db');
	// 	else if (!page.url.pathname.startsWith('/connect')) goto('/connect');
	// });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<TooltipProvider>
	{@render children()}
</TooltipProvider>

<style>
  :global(.cm-editor .cm-scroller) {
    font-size: 13px !important;
    line-height: 1.5 !important;
  }
</style>