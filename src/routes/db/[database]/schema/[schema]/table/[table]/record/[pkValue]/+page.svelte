<script lang="ts">
	import { page } from "$app/state";



  const { pkValue } = $derived(page.params);
  
</script>

selected: {pkValue}