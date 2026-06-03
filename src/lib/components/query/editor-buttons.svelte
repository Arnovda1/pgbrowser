<script lang="ts">
	import { CodeIcon, PanelRightIcon, PlayIcon, TrashIcon } from "lucide-svelte";
	import AlertDialog from "../global/alert-dialog.svelte";
	import { Button } from "../ui/button";
	import type { ResizablePane } from "../ui/resizable";

  let {
    code = $bindable(),
    showCloseSidebar,
    sidePane,
    onExecute,
    beautify,
  }: {
    code: string;
    showCloseSidebar: boolean;
    sidePane?: ResizablePane,
    onExecute: () => void;
    beautify: () => void;
  } = $props();

  const disabled = $derived(code.length === 0);

</script>

<div class='flex gap-1.5'>
  <Button {disabled} onclick={onExecute}>
    <PlayIcon /> Execute
  </Button>

  <Button onclick={beautify} variant='secondary'>
    <CodeIcon /> Beautify
  </Button>

  <AlertDialog
    onContinue={() => code = ''}
    title="Clear query?"
    continueLabel="Clear"
  >
    <Button variant='secondary' title='Clear query' {disabled}>
      <TrashIcon /> Clear
    </Button>
  </AlertDialog>

  {#if showCloseSidebar}
    <Button
      variant='ghost'
      size='icon'
      class='ml-auto text-muted-foreground'
      onclick={() => sidePane?.isCollapsed() ? sidePane?.expand() : sidePane?.collapse()}
    >
      <PanelRightIcon />
    </Button>
  {/if}
</div>