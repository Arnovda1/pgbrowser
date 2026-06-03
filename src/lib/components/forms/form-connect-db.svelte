<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Error from '$lib/components/global/error.svelte';
	import * as Form from '$lib/components/ui/form';
	import { dbConnectionSchema } from '$lib/schemas';
	import { checkConnection } from '$lib/services/db-service';
	import db from '$lib/stores/db.svelte';
	import createDbUrl from '$lib/util/db-url';
	import { SquareIcon } from 'lucide-svelte';
	import { defaults, setMessage, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import z from 'zod';
	import { Input } from '../ui/input';
	import Switch from '../ui/switch/switch.svelte';

	let {
		onSuccess,
	}: {
		onSuccess?: (data: z.infer<typeof dbConnectionSchema>) => void;
	} = $props();

	let loading = $state(false);
	let abortController: AbortController | null = $state(null);

	const images: Record<string, string> = import.meta.glob('$lib/assets/db-icons/*.svg', {
		eager: true,
		import: 'default',
	});

	const form = superForm(defaults(zod4(dbConnectionSchema)), {
		SPA: true,
		validators: zod4(dbConnectionSchema),
		async onUpdate({ form }) {
			if (!form.valid) return;

			loading = true;
			abortController = new AbortController();

			const dbUrl = createDbUrl(form.data, form.data.database);

			try {
				const res = await checkConnection(dbUrl, abortController.signal);
	
				if (!res.success) {
					setMessage(form, res.error || 'Failed to connect to database');
					loading = false;
					return;
				}
	
				db.setConnection(form.data, form.data.database);

				await invalidateAll();
				await goto(`/db/${form.data.database}`);

			} catch {
				
			} finally {
				loading = false;
				abortController = null;
			}
		},
	});
	
	const stopConnecting = async () => {
		if (abortController) abortController.abort();
	};

	const { form: formData, errors, message, enhance, constraints } = $derived(form);
</script>

<form method="POST" use:enhance class="grid gap-3 [@media(max-height:600px)]:grid-cols-2">
	<Form.Field {form} name="username">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Username</Form.Label>
				<Input
					{...props}
					bind:value={$formData.username}
					disabled={loading}
					placeholder="Username"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input
					{...props}
					type="password"
					bind:value={$formData.password}
					disabled={loading}
					placeholder="••••••••"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="host">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Host</Form.Label>
				<Input
					{...props}
					bind:value={$formData.host}
					disabled={loading}
					placeholder="localhost"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="port">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Port</Form.Label>
				<Input
					{...props}
					type="number"
					bind:value={$formData.port}
					disabled={loading}
					placeholder="5432"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="database">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Database</Form.Label>
				<Input
					{...props}
					bind:value={$formData.database}
					disabled={loading}
					placeholder="postgres"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="ssl">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>SSL</Form.Label>
				<span class="flex items-center justify-between">
					Enable SSL <Switch {...props} bind:checked={$formData.ssl} disabled={loading} />
				</span>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Error error={$message} class='[@media(max-height:600px)]:col-span-2' />

	<Form.Button class="w-full [@media(max-height:600px)]:col-span-2" onclick={loading ? stopConnecting : undefined}>
		{#if loading}
			<SquareIcon />
			Stop connecting
		{:else}
			Connect
		{/if}
	</Form.Button>
</form>

{#snippet dbIcon(type: string)}
	<img alt="database icon" src={images[`/src/lib/assets/db-icons/${type}.svg`]} class="size-6" />
{/snippet}
