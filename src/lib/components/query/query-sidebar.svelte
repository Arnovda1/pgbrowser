<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card";
  import * as Item from "$lib/components/ui/item";
  import { queryHistory } from "$lib/stores/query-history.svelte";
  import { formatDate } from "$lib/util/date";
  import { RotateCcwIcon, TrashIcon } from "lucide-svelte";
  import NotFound from "../global/not-found.svelte";
  import Badge from "../ui/badge/badge.svelte";
  import Button from "../ui/button/button.svelte";
  import ReadOnlyEditor from "./read-only-sql.svelte";

  let {
    code = $bindable(),
    queriesContainer = $bindable(),
  }: {
    code: string;
    queriesContainer?: HTMLDivElement,
  } = $props();

</script>

<div class='h-full pl-3 flex flex-col'>

  <div class='flex justify-between items-center shrink-0 pr-3'>
    <h3>History</h3>

    <Button
      variant='ghost'
      size='icon'
      class='text-muted-foreground'
      onclick={() => queryHistory.clear()}
    >
      <TrashIcon />
    </Button>
  </div>

  <div class='flex-1 overflow-y-auto pr-3 mt-2' bind:this={queriesContainer}>
    <div class='grid gap-1 w-full min-w-0'>
      {#each queryHistory.list as query}
        <Item.Root variant='muted' class='w-full min-w-0 flex-nowrap!'>
          <Item.Content class="flex-1 min-w-0">

            <HoverCard.Root>
              <HoverCard.Trigger>
                <Item.Title class='line-clamp-1 text-muted-foreground hover:underline'>
                  {#if query.amount > 1}
                    <Badge variant='outline'>
                      ×{query.amount}
                    </Badge>
                  {/if}
    
                  {query.query.slice(0, 50)}
                </Item.Title>
              </HoverCard.Trigger>
              <HoverCard.Content class='whitespace-pre-line w-60 p-1.5'>
                <div class="border rounded-2xl overflow-y-auto max-h-80">
                  <ReadOnlyEditor code={query.query}  />
                </div>
              </HoverCard.Content>
            </HoverCard.Root>

            <Item.Description class='line-clamp-1 text-muted-foreground/50'>
              {formatDate(query.timestamp)}
              {#if query.error}
                • Failed
              {/if}
            </Item.Description>

            </Item.Content>
          <Item.Actions>
            <Button
              variant="ghost"
              size="icon-sm"
              title='Restore query'
              onclick={() => code = query.query}
            >
              <RotateCcwIcon />
            </Button>
          </Item.Actions>
        </Item.Root>
      {:else}
        <NotFound>No history yet</NotFound>
      {/each}
    </div>
  </div>

  <!-- <Tabs.Root class="w-full" bind:value={tab}>
    <Tabs.List class='w-full'>
      <Tabs.Trigger value="account">
        <HistoryIcon /> {#if tab === 'account'} Account {/if}
      </Tabs.Trigger>
      <Tabs.Trigger value="password">
        <KeyIcon /> {#if tab === 'password'} Password {/if}
      </Tabs.Trigger>
      <Tabs.Trigger value="friends">
        <UsersIcon /> {#if tab === 'friends'} Friends {/if}
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="account">
      Make changes to your account here.i i i i i i i i i i 
    </Tabs.Content>
    <Tabs.Content value="password">Change your password here.</Tabs.Content>
  </Tabs.Root> -->

</div>