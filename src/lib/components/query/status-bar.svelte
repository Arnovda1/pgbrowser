<script lang="ts">
	import type { QueryResult } from '$lib/types';

	let {
		result,
		showBorder = true,
	}: {
		result?: QueryResult;
		showBorder?: boolean;
	} = $props();
</script>

<div
	class="flex items-baseline justify-between px-0.5 text-xs text-muted-foreground {showBorder
		? '-mb-1 border-t pt-px'
		: ''}"
>
	<p>
		Total rows: {result?.success ? result?.meta?.count || 0 : 0}
	</p>

	<p>
		Execution time: {result?.meta.executionTimeMs || 0}ms
	</p>
</div>
