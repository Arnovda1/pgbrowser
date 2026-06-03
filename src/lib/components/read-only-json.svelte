<script lang='ts'>
	import theme from "$lib/stores/theme.svelte";
	import { json } from "@codemirror/lang-json";
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
	lang={json()}
	value={code}
	theme={EditorView.darkTheme.of(theme.isDark)}
	class="json-viewer font-mono h-full"
	extensions={theme.isDark ? [materialOcean] : []}
	readonly lineWrapping
	editable={false}
	dropCursor={false}
	highlight={{
		activeLine: false,
		activeLineGutter: false,
	}}
/>

<style>
	:global(.json-viewer .cm-editor) {
		height: 100%;
	}
</style>
