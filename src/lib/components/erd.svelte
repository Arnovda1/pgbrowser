<script lang="ts">
	import { page } from '$app/state';
	import { getAllColumns } from '$lib/services/db-service';
	import type { Func, Trigger } from '$lib/types';
	import computeErdLayout from '$lib/util/erd-layout';
	import { Anchor, Node, Svelvet } from 'svelvet';

	let {
		databases,
		views,
		tables,
		schemas,
		funcs,
		triggers,
	}: {
		databases: string[];
		views: string[];
		tables: string[];
		schemas: string[];
		funcs: Func[];
		triggers: Trigger[];
	} = $props();

  let tablesDetail = $state<{ tableName: string; columns: string[]; }[]>([]);
  let layoutedTables = $state<{
		x: number;
		y: number;
		tableName: string;
		columns: string[];
	}[]>([]);

  const fetchTablesDetail = async () => {
    const result = await getAllColumns(page.params);
    tablesDetail = Object.values(
      result.reduce((acc, { tableName, columnName }) => {
        acc[tableName] ??= { tableName, columns: [] };
        acc[tableName].columns.push(columnName);
        return acc;
      }, {} as Record<string, any[number]>)
    );
  };

  const erdLayout = async () => {
    layoutedTables = await computeErdLayout(tablesDetail, []);
  };

  $effect(() => {
    if (tables) fetchTablesDetail();
  });

  $effect(() => {
    if (tablesDetail) erdLayout();
  });


  // const g = new dagre.graphlib.Graph();
  // g.setGraph({ rankdir: 'TB' });
  // g.setDefaultNodeLabel(() => {});

  // const nodes = tables.map(t => g.setNode(t, { width: 200, height: 100 }));

  // dagre.layout(g);

  // const organizedNodes = nodes.map(node => {
  //   const nodeWithPosition = g.node(node);
  //   return {
  //     ...node,
  //     position: { x: nodeWithPosition.x, y: nodeWithPosition.y }
  //   };
  // });
</script>

<!-- {JSON.stringify(tablesDetail)} -->

<div class="rounded-2xl border overflow-hidden h-full">
  <Svelvet id="my-canvas" TD minimap controls edge={null} editable={false}>
  
    {#each layoutedTables as table}
      <Node 
        id={table.tableName}
        position={{ x: table.x, y: table.y }}
        useDefaults={false}
        borderRadius={14}
      >
        <!-- Custom UI for your database table -->
        <div class="bg-card border p-4 rounded-xl">
          <div class="table-header">{table.tableName}</div>
          <div class="table-columns">
            {#each table.columns as col}
              <div class="">{col}</div>
            {/each}
          </div>
          
          <!-- Explicit mapping anchor hubs for lines to snap to -->
          <Anchor id="input" direction={'east'} />
          <Anchor id="output" direction={'west'} />
        </div>
      </Node>
    {/each}

  </Svelvet>
</div>