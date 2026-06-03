<script lang="ts">
	import { goto } from "$app/navigation";
	import db from "$lib/stores/db.svelte";
	import { onMount } from "svelte";


  onMount(() => {
    if (!db.connection) {
      goto('/connect');
    } else {
      goto(`/db/${db.initialDatabase}`);
    }
  });

</script>