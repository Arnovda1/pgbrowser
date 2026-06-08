import { describe, expect, test } from 'bun:test';
import { formatDate, formatIfDate } from './date';

describe('formatDate', () => {
	test('should format a Date object correctly', () => {
		const date = new Date('2023-05-15T14:30:00Z');
		const result = formatDate(date);
		expect(result).toContain('15');
		expect(result).toContain('May');
		expect(result).toContain('14:30:00');
	});

	test('should format a date string correctly', () => {
		const result = formatDate('2023-05-15T14:30:00Z');
		expect(result).toContain('15');
		expect(result).toContain('May');
		expect(result).toContain('14:30:00');
	});
});

describe('formatIfDate', () => {
	test('should pass through non-string values', () => {
		expect(formatIfDate(123)).toBe('123');
		expect(formatIfDate(null)).toBe('null');
		expect(formatIfDate(undefined)).toBe('undefined');
	});

	test('should pass through empty or whitespace strings', () => {
		expect(formatIfDate('')).toBe('');
		expect(formatIfDate('   ')).toBe('   ');
	});

	test('should pass through numeric strings (not dates)', () => {
		expect(formatIfDate('12345')).toBe('12345');
	});

	test('should format valid ISO date strings', () => {
		const result = formatIfDate('2023-05-15T14:30:00Z');
		expect(result).toContain('15');
		expect(result).toContain('May');
		expect(result).toContain('2023');
	});

	test('should format date-only strings', () => {
		const result = formatIfDate('2023-05-15');
		expect(result).toContain('15');
		expect(result).toContain('May');
		expect(result).toContain('2023');
	});

	test("should pass through strings that aren't dates", () => {
		expect(formatIfDate('Hello World')).toBe('Hello World');
		expect(formatIfDate('2023-99-99')).toBe('2023-99-99');
	});
});
