<script lang="ts">
	import { page } from "$app/state";
	import DataOutput from "$lib/components/query/data-output.svelte";
	import EditorButtons from "$lib/components/query/editor-buttons.svelte";
	import QuerySidebar from "$lib/components/query/query-sidebar.svelte";
	import SqlEditor from "$lib/components/query/sql-editor.svelte";
	import StatusBar from "$lib/components/query/status-bar.svelte";
	import * as Resizable from "$lib/components/ui/resizable";
	import { query } from "$lib/services/db-service";
	import { queryHistory } from "$lib/stores/query-history.svelte";
	import type { QueryResult } from "$lib/types";
	import type { EditorView } from "codemirror";
	import { format } from 'sql-formatter';

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

  function beautify() {
    if (!view) return;
    const unformattedSQL = view.state.doc.toString();
    
    const formattedSQL = format(unformattedSQL, {
      language: 'postgresql',
      linesBetweenQueries: 2,
    });

    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: formattedSQL,
      },
    });
  }

</script>

<div class="flex-1 min-h-0 flex flex-col">
  <Resizable.PaneGroup direction='horizontal'>
    <Resizable.Pane defaultSize={75} minSize={50}>
      <Resizable.PaneGroup direction='vertical'>

        <Resizable.Pane defaultSize={70} minSize={40}>
          <div class="flex flex-col gap-1.5 h-full pb-3 min-w-0 {sidePane?.isExpanded() ? 'pr-3' : ''}">
            <EditorButtons bind:code={code} {onExecute} {beautify} {sidePane} showCloseSidebar />
            <SqlEditor bind:code={code} bind:view={view} />
          </div>
        </Resizable.Pane>
        
        <Resizable.Handle class='hover:bg-primary' />

        <Resizable.Pane defaultSize={30} minSize={15}>
          <div class="flex flex-col h-full min-w-0 overflow-hidden">
            <DataOutput {loading} {result} />
          </div>
        </Resizable.Pane>

      </Resizable.PaneGroup>
    </Resizable.Pane>

    {#if sidePane?.isExpanded()}
      <Resizable.Handle class='hover:bg-primary' />
    {/if}

    <Resizable.Pane
      defaultSize={25}
      minSize={15}
      maxSize={60}
      bind:this={sidePane}
      collapsible
    >
      <QuerySidebar bind:code={code} bind:queriesContainer={queriesContainer} />
    </Resizable.Pane>

  </Resizable.PaneGroup>

  <StatusBar {result} />
</div>