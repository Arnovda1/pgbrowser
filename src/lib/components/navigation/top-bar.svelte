<script lang="ts">
	import { page } from "$app/state";
	import postgres from '$lib/assets/db-icons/postgres.svg';
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import db from "$lib/stores/db.svelte";
	import type { Func, Trigger } from "$lib/types";
	import { BoxesIcon, DatabaseIcon, FunctionSquareIcon, PlayIcon, TableIcon, TerminalSquareIcon, TextAlignJustifyIcon, ZapIcon } from "lucide-svelte";
	import Button from "../ui/button/button.svelte";
	import SidebarTrigger from "../ui/sidebar/sidebar-trigger.svelte";
	import BreadcrumbSegment, { type breadcrumbSegmentInput } from "./breadcrumb-segment.svelte";
	import BreadcrumbSeparator from "./breadcrumb-separator.svelte";
  
  let {
    databases,
		tables,
    schemas,
    funcs,
    triggers,
	}: {
    databases: string[]
		tables: string[];
    schemas: string[];
    funcs: Func[];
    triggers: Trigger[];
	} = $props();

  const { database, schema, table, functionName, triggerName } = $derived(page.params);

  const segments = $derived(([
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
      visible: !!functionName,
      label: functionName,
      icon: FunctionSquareIcon,
      href: null,
      dropdownLabel: 'Functions',
      items: funcs,
      getLabel: (f: Func) => f.functionName,
      getHref: (f: Func) => `/db/${database}/schema/${schema}/func/${f.functionName}`,
    },
    {
      visible: !!triggerName,
      label: triggerName,
      icon: ZapIcon,
      href: null,
      dropdownLabel: 'Triggers',
      items: triggers.filter(t => t.tableName === table),
      getLabel: (t: Trigger) => t.triggerName,
      getHref: (t: Trigger) => `/db/${database}/schema/${schema}/table/${table}/trigger/${t.triggerName}`,
    }
  ] satisfies breadcrumbSegmentInput[]).filter(s => s.visible));

</script>
 
<div class="flex items-center justify-between">

  <Breadcrumb.Root>
    <Breadcrumb.List>

      <SidebarTrigger />

      <div class="border-r h-6"></div>

      {#if db.connection}
        <Breadcrumb.Link class='flex items-center gap-1.5'>
          <Button variant='ghost'>
            <img src={postgres} alt='' class="size-5 grayscale" />
            {' '}{db.connection.host}:{db.connection.port}
          </Button>
        </Breadcrumb.Link>
      {/if}

      {#each segments as segment}
        <BreadcrumbSegment {...segment} />
      {/each}

      <!-- {#if database}
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <HoverCard.Root openDelay={300} closeDelay={0}>
            <HoverCard.Trigger>
              <Button href={`/db/${database}`} class="flex items-center gap-1.5" variant="ghost">
                <DatabaseIcon /> {database}
              </Button>
            </HoverCard.Trigger>
            <HoverCard.Content class='max-h-[70vh] overflow-y-auto'>
              {#each databases as d}
                <Button variant='secondary' class='w-full' onclick={() => goto(`/db/${d}`)}>
                  {d}
                </Button>
              {/each}
            </HoverCard.Content>
          </HoverCard.Root>
        </Breadcrumb.Item>
      {/if} -->

      <!-- should make these a hover popover, so clicking still returns it to the current schema / func / table -->
      
      <!-- {#if schema}
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <HoverCard.Root openDelay={300} closeDelay={0}>
            <HoverCard.Trigger>
              <Button variant='ghost' href={`/db/${database}/schema/${schema}`}>
                <BoxesIcon /> {schema}
              </Button>
            </HoverCard.Trigger>
            <HoverCard.Content class='max-h-[70vh] overflow-y-auto'>
              {#each schemas as s}
                <Button variant='secondary' class='w-full' onclick={() => goto(`/db/${database}/schema/${s}`)}>
                  {s}
                </Button>
              {/each}
            </HoverCard.Content>
          </HoverCard.Root>
        </Breadcrumb.Item>
      {/if}
      
      {#if table}
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <HoverCard.Root openDelay={300} closeDelay={0}>
            <HoverCard.Trigger>
              <Button variant="ghost" href={`/db/${database}/schema/${schema}/table/${table}`}>
                <TableIcon /> {table}
              </Button>
            </HoverCard.Trigger>
            <HoverCard.Content class='max-h-[70vh] overflow-y-auto'>
              {#each tables as t}
                <Button variant='secondary' class='w-full' onclick={() => goto(`/db/${database}/schema/${schema}/table/${t}`)}>
                  {t}
                </Button>
              {/each}
            </HoverCard.Content>
          </HoverCard.Root>
        </Breadcrumb.Item>
      {/if}

      {#if functionName}
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <HoverCard.Root openDelay={300} closeDelay={0}>
            <HoverCard.Trigger>
              <Button variant="ghost">
                <FunctionSquareIcon /> {functionName}
              </Button>
            </HoverCard.Trigger>
            <HoverCard.Content class='max-h-[70vh] overflow-y-auto'>
              {#each funcs as f}
                <Button variant='secondary' class='w-full' onclick={() => goto(`/db/${database}/schema/${schema}/func/${f.functionName}`)}>
                  {f.functionName}
                </Button>
              {/each}
            </HoverCard.Content>
          </HoverCard.Root>
        </Breadcrumb.Item>
      {/if}

      {#if triggerName}
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <HoverCard.Root openDelay={300} closeDelay={0}>
            <HoverCard.Trigger>
              <Button variant="ghost">
                <ZapIcon /> {triggerName}
              </Button>
            </HoverCard.Trigger>
            <HoverCard.Content class='max-h-[70vh] overflow-y-auto'>
              {#each triggers.filter(t => t.tableName === table) as t}
                <Button variant='secondary' class='w-full' onclick={() => goto(`/db/${database}/schema/${schema}/table/${table}/trigger/${t.triggerName}`)}>
                  {t.triggerName}
                </Button>
              {/each}
            </HoverCard.Content>
          </HoverCard.Root>
        </Breadcrumb.Item>
      {/if} -->

      {#if page.url.pathname === `/db/${database}/schema/${schema}/query`}
        <BreadcrumbSeparator />
        <Breadcrumb.Link class='flex items-center gap-1.5'>
          <Button variant='ghost'>
            <TerminalSquareIcon /> Query
          </Button>
        </Breadcrumb.Link>
      {/if}

      {#if page.url.pathname === `/db/${database}/schema/${schema}/table/${table}/select`}
        <BreadcrumbSeparator />
        <Breadcrumb.Link class='flex items-center gap-1.5'>
          <Button variant='ghost'>
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
