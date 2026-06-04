<script lang="ts">
	import { page } from '$app/state';
	import DataOutput from '$lib/components/query/data-output.svelte';
	import EditorButtons from '$lib/components/query/editor-buttons.svelte';
	import QuerySidebar from '$lib/components/query/query-sidebar.svelte';
	import SqlEditor from '$lib/components/query/sql-editor.svelte';
	import StatusBar from '$lib/components/query/status-bar.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import { query } from '$lib/services/db-service';
	import { queryHistory } from '$lib/stores/query-history.svelte';
	import type { QueryResult } from '$lib/types';
	import beautifySql from '$lib/util/sql-beautify';
	import type { EditorView } from 'codemirror';

	let code = $state<string>(page.url.searchParams.get('sql') || '');
	let view = $state<EditorView | undefined>(undefined);
	let queriesContainer = $state<HTMLDivElement | undefined>();
	let sidePane = $state<Resizable.Pane | undefined>(undefined);

	let result = $state<QueryResult | undefined>(undefined);
	let loading = $state<boolean>(false);

	const onExecute = async () => {
		try {
			loading = true;
			result = undefined;

			result = await query(page.params, code);
			queryHistory.add(code, false);
			queriesContainer?.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		} catch (err: any) {
			queryHistory.add(code, true);
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex min-h-0 flex-1 flex-col">
	<Resizable.PaneGroup direction="horizontal">
		<Resizable.Pane defaultSize={75} minSize={50}>
			<Resizable.PaneGroup direction="vertical">
				<Resizable.Pane defaultSize={70} minSize={40}>
					<div
						class="flex h-full min-w-0 flex-col gap-1.5 pb-3 {sidePane?.isExpanded() ? 'pr-3' : ''}"
					>
						<EditorButtons
							bind:code
							{onExecute}
							{sidePane}
							showCloseSidebar
							beautify={() => view && beautifySql(view)}
						/>
						<SqlEditor bind:code bind:view />
					</div>
				</Resizable.Pane>

				<Resizable.Handle class="hover:bg-primary" />

				<Resizable.Pane defaultSize={30} minSize={15}>
					<div class="flex h-full min-w-0 flex-col overflow-hidden">
						<DataOutput {loading} {result} />
					</div>
				</Resizable.Pane>
			</Resizable.PaneGroup>
		</Resizable.Pane>

		{#if sidePane?.isExpanded()}
			<Resizable.Handle class="hover:bg-primary" />
		{/if}

		<Resizable.Pane defaultSize={25} minSize={15} maxSize={60} bind:this={sidePane} collapsible>
			<QuerySidebar bind:code bind:queriesContainer />
		</Resizable.Pane>
	</Resizable.PaneGroup>

	<StatusBar {result} />
</div>
