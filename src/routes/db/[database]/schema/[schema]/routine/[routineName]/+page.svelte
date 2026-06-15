<script lang="ts">
	import RoutineEditor from '$lib/components/routine-editor.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let { data } = $props();
</script>

<div class="grid space-y-4 pb-50">
	{#each data.routineDetails as routine, i}
		<RoutineEditor {routine} />

		{#if i + 1 !== data.routineDetails.length}
			<Separator class="mt-14 mb-8" />
		{/if}
	{/each}
</div>
