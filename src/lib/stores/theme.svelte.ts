import { browser } from '$app/environment';

type Theme = 'dark' | 'light' | 'system';

function createThemeStore() {
	let currentTheme = $state<Theme>(
		(browser && (localStorage.getItem('theme') as Theme)) || 'system',
	);

	let systemIsDark = $state(
		browser ? window.matchMedia('(prefers-color-scheme: dark)').matches : false,
	);

	const isDark = $derived.by(() => {
		if (currentTheme === 'system') {
			return systemIsDark;
		}
		return currentTheme === 'dark';
	});

	function applyTheme(isDarkTheme: boolean) {
		if (!browser) return;
		const root = document.documentElement;

		if (isDarkTheme) {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
	}

	if (browser) {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', e => {
			systemIsDark = e.matches;
		});
	}

	$effect.root(() => {
		$effect(() => {
			applyTheme(isDark);
			if (browser) {
				localStorage.setItem('theme', currentTheme);
			}
		});
	});

	return {
		get current() {
			return currentTheme;
		},
		get isDark() {
			return isDark;
		},
		set(theme: Theme) {
			currentTheme = theme;
		},
	};
}

const theme = createThemeStore();

export default theme;
