<script lang="ts">
	import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-svelte";
	import ButtonGroup from "./ui/button-group/button-group.svelte";
	import Button from "./ui/button/button.svelte";


  let {
    size = $bindable(),
  }: {
    size: 'sm' | 'md' | 'lg';
  } = $props();

  const larger = () => {
    if (size === 'sm') size = 'md';
    else if (size === 'md') size = 'lg';
  };

  const smaller = () => {
    if (size === 'md') size = 'sm';
    else if (size === 'lg') size = 'md';
  };

</script>

<ButtonGroup>
  {#if size !== 'sm'}
    <Button onclick={smaller} size='icon' title='Make editor smaller'>
      <ChevronsDownUpIcon />
    </Button>
  {/if}
  {#if size !== 'lg'}
    <Button onclick={larger} size='icon' title="Make editor larger">
      <ChevronsUpDownIcon />
    </Button>
  {/if}
</ButtonGroup>