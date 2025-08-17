import { getDefaultSchedule, getCurrentPrice, getUpcomingChanges, daysUntil, formatAud } from './pricing';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function testDefaultScheduleOrder(): void {
  const now = new Date('2025-01-01T00:00:00.000Z');
  const sched = getDefaultSchedule(now);
  assert(sched.length === 3, 'default schedule length should be 3');
  assert(new Date(sched[0].start) <= new Date(sched[1].start), 'schedule should be sorted');
  assert(new Date(sched[1].start) <= new Date(sched[2].start), 'schedule should be sorted');
}

function testCurrentPriceRange(): void {
  const { price } = getCurrentPrice(new Date('2025-01-01T00:00:00.000Z'));
  assert([29, 39, 49].includes(price), 'price should be one of 29/39/49');
}

function testUpcomingChanges(): void {
  const base = new Date('2025-01-01T00:00:00.000Z');
  const ups = getUpcomingChanges(base);
  assert(ups.length >= 2, 'should have at least two upcoming changes at start');
}

function testDaysUntil(): void {
  const now = new Date('2025-01-01T00:00:00.000Z');
  const later = new Date('2025-01-03T00:00:00.000Z');
  assert(daysUntil(later, now) === 2, 'daysUntil should be 2');
  assert(daysUntil(now, now) === 0, 'daysUntil should floor at 0 for past');
}

function testFormatAud(): void {
  assert(formatAud(29) === 'AUD $29', 'AUD formatting wrong');
}

export function runPricingTests(): void {
  testDefaultScheduleOrder();
  testCurrentPriceRange();
  testUpcomingChanges();
  testDaysUntil();
  testFormatAud();
}

if (require.main === module) {
  try {
    runPricingTests();
    console.log('✅ pricing tests passed');
  } catch (e) {
    console.error('❌ pricing tests failed', e);
    process.exit(1);
  }
}


