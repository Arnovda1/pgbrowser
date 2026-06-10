<script lang="ts">
	import { page } from '$app/state';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import db from '$lib/stores/db.svelte';
	import type { Routine, Trigger } from '$lib/types';
	import {
		BoxesIcon,
		DatabaseIcon,
		FunctionSquareIcon,
		PlayIcon,
		TableIcon,
		TerminalSquareIcon,
		TextAlignJustifyIcon,
		ViewIcon,
		ZapIcon,
	} from 'lucide-svelte';
	import PostgresIcon from '../postgres-icon.svelte';
	import Button from '../ui/button/button.svelte';
	import SidebarTrigger from '../ui/sidebar/sidebar-trigger.svelte';
	import BreadcrumbSegment, { type breadcrumbSegmentInput } from './breadcrumb-segment.svelte';
	import BreadcrumbSeparator from './breadcrumb-separator.svelte';

	let {
		databases,
		views,
		tables,
		schemas,
		routines,
		triggers,
	}: {
		databases: string[];
		views: string[];
		tables: string[];
		schemas: string[];
		routines: Routine[];
		triggers: Trigger[];
	} = $props();

	const { database, schema, view, table, routineName, triggerName } = $derived(page.params);

	const segments = $derived(
		(
			[
				{
					visible: !!database,
					label: database,
					icon: DatabaseIcon,
					href: `/db/${database}`,
					dropdownLabel: 'Databases',
					items: databases,
					getLabel: (d: string) => d,
					getHref: (d: string) => `/db/${d}`,
				},
				{
					visible: !!schema,
					label: schema,
					icon: BoxesIcon,
					href: `/db/${database}/schema/${schema}`,
					dropdownLabel: 'Schemas',
					items: schemas,
					getLabel: (s: string) => s,
					getHref: (s: string) => `/db/${database}/schema/${s}`,
				},
				{
					visible: !!view,
					label: view,
					icon: ViewIcon,
					href: `/db/${database}/view/${view}`,
					dropdownLabel: 'Views',
					items: views,
					getLabel: (v: string) => v,
					getHref: (v: string) => `/db/${database}/schema/${schema}/view/${v}`,
				},
				{
					visible: !!table,
					label: table,
					icon: TableIcon,
					href: `/db/${database}/schema/${schema}/table/${table}`,
					dropdownLabel: 'Tables',
					items: tables,
					getLabel: (t: string) => t,
					getHref: (t: string) => `/db/${database}/schema/${schema}/table/${t}`,
				},
				{
					visible: !!routineName,
					label: routineName,
					icon: FunctionSquareIcon,
					href: null,
					dropdownLabel: 'Functions',
					items: routines,
					getLabel: (r: Routine) => r.name,
					getHref: (r: Routine) => `/db/${database}/schema/${schema}/routine/${r.name}`,
				},
				{
					visible: !!triggerName,
					label: triggerName,
					icon: ZapIcon,
					href: null,
					dropdownLabel: 'Triggers',
					items: triggers.filter(t => t.tableName === table),
					getLabel: (t: Trigger) => t.triggerName,
					getHref: (t: Trigger) =>
						`/db/${database}/schema/${schema}/table/${table}/trigger/${t.triggerName}`,
				},
			] satisfies breadcrumbSegmentInput[]
		).filter(s => s.visible),
	);
</script>

<div class="flex items-center justify-between">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<SidebarTrigger />

			<div class="h-6 border-r"></div>

			{#if db.connection}
				<Breadcrumb.Link class="flex items-center gap-1.5">
					<Button variant="ghost">
						<PostgresIcon />{' '}
						<span class='max-w-32 sm:max-w-64 truncate' title={`${db.connection.host}:${db.connection.port}`}>
							{db.connection.host}:{db.connection.port}
						</span>
					</Button>
				</Breadcrumb.Link>
			{/if}

			{#each segments as segment}
				<BreadcrumbSegment {...segment} />
			{/each}

			{#if page.url.pathname === `/db/${database}/schema/${schema}/query`}
				<BreadcrumbSeparator />
				<Breadcrumb.Link class="flex items-center gap-1.5">
					<Button variant="ghost">
						<TerminalSquareIcon /> Query
					</Button>
				</Breadcrumb.Link>
			{/if}

			{#if page.url.pathname === `/db/${database}/schema/${schema}/table/${table}/select`}
				<BreadcrumbSeparator />
				<Breadcrumb.Link class="flex items-center gap-1.5">
					<Button variant="ghost">
						<TextAlignJustifyIcon /> Select
					</Button>
				</Breadcrumb.Link>
			{/if}
		</Breadcrumb.List>
	</Breadcrumb.Root>

	{#if database && !page.url.pathname.endsWith('/query')}
		<Button href={`/db/${database}/schema/${schema || 'public'}/query`}>
			<PlayIcon /> Query
		</Button>
	{/if}
</div>
