<script lang="ts">
	import { page } from '$app/state';
	import { schemaStore } from '$lib/stores/schema.svelte';
	import theme from '$lib/stores/theme.svelte';
	import { acceptCompletion } from '@codemirror/autocomplete';
	import { PostgreSQL, sql, SQLDialect } from '@codemirror/lang-sql';
	import { materialOcean } from '@fsegurai/codemirror-theme-material-ocean';
	import { EditorView } from 'codemirror';
	import CodeMirror from 'svelte-codemirror-editor';
	import { cn } from 'tailwind-variants';

	let {
		code = $bindable(''),
		view = $bindable<EditorView | undefined>(undefined),
		class: className,
	}: {
		code: string;
		view: EditorView | undefined;
		class?: string;
	} = $props();

	const pg = SQLDialect.define({
		...PostgreSQL.spec,
		caseInsensitiveIdentifiers: true,
		operatorChars: '+-*/%=<>!&|~^$',
		doubleDollarQuotedStrings: false,
	});

	let sqlExtension = $derived(
		sql({
			dialect: pg,
			upperCaseKeywords: true,
			schema:
				Object.keys(schemaStore.structure).length > 0
					? schemaStore.structure
					: { [page.params.schema as string]: {} },
			tables: schemaStore.tables,
			defaultSchema: page.params.schema,
		}),
	);

	$effect(() => {
		const currentCode = code ? code.replace(/\$function\$/g, '$$$$') : '';

		if (view && currentCode !== view.state.doc.toString()) {
			view.dispatch({
				changes: { from: 0, to: view.state.doc.length, insert: currentCode },
			});
		}
	});
</script>

{#key schemaStore.structure}
	<CodeMirror
		lang={sqlExtension}
		bind:value={code}
		theme={EditorView.darkTheme.of(theme.isDark)}
		autocompletion
		keybindings={[
			{ key: 'Tab', run: acceptCompletion },
			{ key: 'Mod-f', run: () => true },
			{ key: 'Mod-g', run: () => true },
			{ key: 'Mod-G', run: () => true },
			{ key: 'Mod-Alt-g', run: () => true },
		]}
		onready={v => (view = v)}
		class={cn('sql-editor h-full overflow-hidden rounded-2xl border font-mono', className)}
		extensions={theme.isDark ? [materialOcean] : []}
	/>
{/key}

<style>
	:global(.sql-editor .cm-editor) {
		height: 100%;
	}
</style>
