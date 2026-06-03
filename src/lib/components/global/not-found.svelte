<script lang="ts">
	import type { Snippet } from "svelte";

  let {
    children,
    small,
  }: {
    children: Snippet;
    small?: boolean;
  } = $props();

</script>

<p class="italic text-center text-muted-foreground m-auto {small ? 'text-xs' : ''}">
  {@render children()}
</p>