<script lang="ts">
	import FunctionEditor from '$lib/components/function-editor.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { EditorView } from 'codemirror';

	let { data } = $props();

	// A reactive object to store the individual views by a unique key
	let views = $state<Record<string, EditorView>>({});
</script>

<div class="grid pb-50">
	{#each data.functionDetails as func, i}
		<FunctionEditor {func} />

		{#if i + 1 !== data.functionDetails.length}
			<Separator class="mb-16" />
		{/if}
	{/each}
</div>
