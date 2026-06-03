<script lang="ts">
  import { goto } from "$app/navigation";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { ChevronDownIcon } from "lucide-svelte";
  import Button from "../ui/button/button.svelte";
  import BreadcrumbSeparator from "./breadcrumb-separator.svelte";

  export interface breadcrumbSegmentInput {
    visible: boolean;
    label?: string;
    icon: any;
    href: string | null;
    dropdownLabel: string;
    items: any[];
    getLabel: (item: any) => string;
    getHref: (item: any) => string;
  }

  let {
    label,
    icon: Icon,
    href,
    dropdownLabel,
    items,
    getLabel,
    getHref,
  }: breadcrumbSegmentInput = $props();
</script>

<BreadcrumbSeparator />

<Breadcrumb.Item>
   <Button variant='ghost' class='group px-1 active:not-aria-[haspopup]:translate-y-0! gap-0!' {href}>
    
    <Button 
      {href}
      variant="ghost" 
      class="flex items-center gap-1.5 px-1.5 pr-0 group-hover:text-foreground"
    >
      <Icon class="size-4 text-muted-foreground group-hover:text-foreground" /> {label}
    </Button>

    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({props})}
          <Button {...props} variant="ghost" size='icon-sm'>
            <ChevronDownIcon class="size-3.5" />
            <span class="sr-only">Toggle context menu</span>
          </Button>
        {/snippet}
      </DropdownMenu.Trigger>

      <DropdownMenu.Content class="max-h-[60vh]">
        <DropdownMenu.Label>{dropdownLabel}</DropdownMenu.Label>

        {#each items as item}
          <DropdownMenu.Item 
            class="cursor-pointer min-w-0 max-w-full"
            onclick={() => goto(getHref(item))}
          >
            {getLabel(item)}
          </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>

    </Button>
</Breadcrumb.Item>