<script>
	import { goto } from '$app/navigation';
	import FormConnectDb from '$lib/components/forms/form-connect-db.svelte';
	import * as Card from '$lib/components/ui/card';
	import db from '$lib/stores/db.svelte';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (db.connection) goto(`/db/${db.initialDatabase}`);
	});
</script>

<div class="flex h-dvh w-dvw items-center justify-center">
	<Card.Root class="w-full [@media(max-height:600px)]:max-w-lg max-w-sm">
		<Card.Header>
			<Card.Title>Set up the database connection</Card.Title>
		</Card.Header>
		<Card.Content>
			<FormConnectDb />
		</Card.Content>
	</Card.Root>
</div>
