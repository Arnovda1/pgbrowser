import dagre from '@dagrejs/dagre';

const computeErdLayout = async (
	tables: { tableName: string; columns: string[] }[],
	relationships: [],
): Promise<
	{
		x: number;
		y: number;
		tableName: string;
		columns: string[];
	}[]
> => {
	const g = new dagre.graphlib.Graph();

	// 1. Configure Layout settings
	g.setGraph({
		rankdir: 'LR', // Left-to-Right is highly readable for ER diagrams
		nodesep: 80, // Space between tables in the same column
		ranksep: 120, // Space between horizontal schema columns
	});
	g.setDefaultEdgeLabel(() => ({}));

	// 2. Feed tables into Dagre with estimated dimensions
	tables.forEach(table => {
		// Basic calculation guessing table size based on column length
		const estimatedWidth = 220;
		const estimatedHeight = 60 + table.columns.length * 28;

		g.setNode(table.tableName, { width: estimatedWidth, height: estimatedHeight });
	});

	// 3. Feed relationships (edges)
	// relationships.forEach(rel => {
	// 	g.setEdge(rel.source, rel.target);
	// });

	// 4. Calculate coordinates
	dagre.layout(g);

	// 5. Extract layout positions back into your data mapping
	const positionedNodes = tables.map(table => {
		const dagreNode = g.node(table.tableName);
		return {
			...table,
			// Dagre uses center anchor points; map them to top-left for web components
			x: dagreNode.x - dagreNode.width / 2,
			y: dagreNode.y - dagreNode.height / 2,
		};
	});

	return positionedNodes;
};

export default computeErdLayout;
