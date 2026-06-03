<script lang='ts'>
	import theme from "$lib/stores/theme.svelte";
	import { sql } from "@codemirror/lang-sql";
	import { materialOcean } from "@fsegurai/codemirror-theme-material-ocean";
	import { EditorView } from "codemirror";
	import CodeMirror from "svelte-codemirror-editor";

  let {
    code,
  }: {
    code: string;
  } = $props();

</script>

<CodeMirror
	lang={sql({ upperCaseKeywords: true })}
	value={code}
	theme={EditorView.darkTheme.of(theme.isDark)}
	class="sql-viewer font-mono"
	extensions={theme.isDark ? [materialOcean] : []}
	readonly lineWrapping
	editable={false}
	foldGutter={false}
	dropCursor={false}
	highlight={{
		activeLine: false,
		activeLineGutter: false,
	}}
/>

<style>
	:global(.sql-viewer .cm-editor) {
		height: fit-content;
	}
</style>
