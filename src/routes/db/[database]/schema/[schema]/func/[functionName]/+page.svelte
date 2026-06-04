<script lang="ts">
	import FunctionEditor from '$lib/components/function-editor.svelte';
	import type { EditorView } from 'codemirror';

	let { data } = $props();

	// A reactive object to store the individual views by a unique key
	let views = $state<Record<string, EditorView>>({});
</script>

{#each data.functionDetails as func}
	<FunctionEditor {func} />
	<!-- <div class="grid space-y-2 pb-5">
		<div class="text-sm">
			<p class="font-bold">Arguments:</p>

			<div class="flex flex-wrap items-center">
				{#each func.argumentSignature ? func.argumentSignature.split(',') : [] as arg}
					{@const parts = arg.trim().split(' ')}
					{@const key = parts[0]}
					{@const value = parts.slice(1).join(' ')}
					<p class="mr-3">
						{key} <span class="text-xs text-muted-foreground">{value}</span>
					</p>
				{/each}

				<p class="ml-auto text-xs text-muted-foreground">{func.languageName}</p>
			</div>
		</div>

		<div class="max-h-96">
			<SqlEditor
				code={func.functionBody}
				bind:view={views[func.functionOid || func.functionName]}
			/>
		</div>
	</div> -->
{/each}
