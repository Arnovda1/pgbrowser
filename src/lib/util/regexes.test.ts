import { describe, expect, test } from 'bun:test';
import { urlRegex } from './regexes';

describe('urlRegex', () => {
	test('http', () => {
		expect(urlRegex.test('http://example.com')).toBeTrue();
	});

	test('https', () => {
		expect(urlRegex.test('https://example.com')).toBeTrue();
	});

	test('unhappy', () => {
		expect(urlRegex.test('example.com')).toBeFalse();
	});
});
