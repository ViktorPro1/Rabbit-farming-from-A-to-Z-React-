// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest';
import { todayKyiv, tomorrowDate, addDays } from './dates';

afterEach(() => {
    vi.useRealTimers();
});

function setNowUtc(iso: string) {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(iso));
}

describe('todayKyiv', () => {
    it('взимку (UTC+2) ще повертає вчорашню дату за хвилину до півночі за Києвом', () => {
        setNowUtc('2026-11-20T21:59:59Z');
        expect(todayKyiv()).toBe('2026-11-20');
    });

    it('взимку (UTC+2) переходить на нову дату рівно о 22:00 UTC', () => {
        setNowUtc('2026-11-20T22:00:00Z');
        expect(todayKyiv()).toBe('2026-11-21');
    });

    it('влітку (UTC+3) ще повертає поточну дату о 20:59:59 UTC', () => {
        setNowUtc('2026-07-15T20:59:59Z');
        expect(todayKyiv()).toBe('2026-07-15');
    });

    it('влітку (UTC+3) переходить на нову дату рівно о 21:00 UTC', () => {
        setNowUtc('2026-07-15T21:00:00Z');
        expect(todayKyiv()).toBe('2026-07-16');
    });

    it('вночі за Києвом, коли за UTC ще вчора, повертає дату Києва, а не UTC', () => {
        setNowUtc('2026-11-20T23:30:00Z');
        expect(todayKyiv()).toBe('2026-11-21');
    });

    it('коректно працює через перехід на літній час', () => {
        setNowUtc('2026-03-28T21:59:59Z');
        expect(todayKyiv()).toBe('2026-03-28');
        setNowUtc('2026-03-28T22:00:00Z');
        expect(todayKyiv()).toBe('2026-03-29');
    });

    it('повертає формат YYYY-MM-DD з нулями', () => {
        setNowUtc('2026-01-05T12:00:00Z');
        expect(todayKyiv()).toBe('2026-01-05');
    });
});

describe('tomorrowDate', () => {
    it('повертає наступний день за Києвом', () => {
        setNowUtc('2026-11-20T12:00:00Z');
        expect(tomorrowDate()).toBe('2026-11-21');
    });

    it('враховує київську дату, а не UTC, біля півночі', () => {
        setNowUtc('2026-11-20T22:30:00Z');
        expect(tomorrowDate()).toBe('2026-11-22');
    });

    it('переходить через межу місяця', () => {
        setNowUtc('2026-11-30T12:00:00Z');
        expect(tomorrowDate()).toBe('2026-12-01');
    });

    it('переходить через межу року', () => {
        setNowUtc('2026-12-31T12:00:00Z');
        expect(tomorrowDate()).toBe('2027-01-01');
    });
});

describe('addDays', () => {
    it('додає один день', () => {
        expect(addDays('2026-11-20', 1)).toBe('2026-11-21');
    });

    it('з нулем повертає ту саму дату', () => {
        expect(addDays('2026-11-20', 0)).toBe('2026-11-20');
    });

    it('віднімає дні', () => {
        expect(addDays('2026-11-20', -1)).toBe('2026-11-19');
    });

    it('переходить через межу місяця вперед і назад', () => {
        expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
        expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    });

    it('переходить через межу року вперед і назад', () => {
        expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
        expect(addDays('2027-01-01', -1)).toBe('2026-12-31');
    });

    it('враховує 29 лютого у високосному році і не додає його в звичайному', () => {
        expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
        expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
    });

    it('правильно рахує строки з нагадувань: 26, 28, 45, 60 днів', () => {
        expect(addDays('2026-11-01', 26)).toBe('2026-11-27');
        expect(addDays('2026-11-01', 28)).toBe('2026-11-29');
        expect(addDays('2026-11-01', 45)).toBe('2026-12-16');
        expect(addDays('2026-11-01', 60)).toBe('2026-12-31');
    });

    it('не залежить від переходу на літній чи зимовий час', () => {
        expect(addDays('2026-03-28', 2)).toBe('2026-03-30');
        expect(addDays('2026-10-24', 2)).toBe('2026-10-26');
    });

    it('додає рівно рік днів', () => {
        expect(addDays('2026-11-20', 365)).toBe('2027-11-20');
    });
});
