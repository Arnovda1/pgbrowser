<script lang='ts'>
	import SqlEditor from "$lib/components/query/sql-editor.svelte";
	import * as Resizable from "$lib/components/ui/resizable";

	let { data } = $props();

</script>

{#each data.functionDetails as func}
	<div class="grid space-y-2 pb-5">
		
		<div class="text-sm">
			<p class="font-bold">Arguments: </p>

			<div class="flex flex-wrap items-center">
				{#each func.argumentSignature.split(',') as arg}
					{@const [key, value] = arg.trim().split(' ')}
					<p class="mr-3">
						{key} <span class="text-muted-foreground">{value}</span>{' '}
					</p>
				{/each}
	
				<p class="text-xs ml-auto text-muted-foreground">{func.languageName}</p>
			</div>
		</div>

		<Resizable.PaneGroup direction="vertical">
			<Resizable.Pane>
				<SqlEditor code={func.functionBody} />
			</Resizable.Pane>
				hello
			<Resizable.Handle withHandle class='bg-transparent -mt-px'/>
			<Resizable.Pane></Resizable.Pane>
		</Resizable.PaneGroup>

		<!-- <SqlEditor code={func.functionBody} size='lg' /> -->

	</div>
{/each}