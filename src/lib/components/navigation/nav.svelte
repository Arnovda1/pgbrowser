<script lang="ts">
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { cn } from 'tailwind-variants';
	import { navigationMenuTriggerStyle } from '../ui/navigation-menu/navigation-menu-trigger.svelte';
</script>

<div class="flex items-center justify-center">
	<NavigationMenu.Root class="w-full flex-1 p-1">
		<NavigationMenu.List class="w-full">
			<NavigationMenu.Item>
				<NavigationMenu.Link href="/" class={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}
					>Home</NavigationMenu.Link
				>
			</NavigationMenu.Item>
			<NavigationMenu.Item>
				<NavigationMenu.Link
					href="/query"
					class={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}>Query</NavigationMenu.Link
				>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
</div>
