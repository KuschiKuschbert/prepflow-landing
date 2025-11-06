// PrepFlow Personality System - Unit Tests

import {
  getShiftBucket,
  checkSeasonalMatch,
  isSilenced,
  silenceFor24h,
} from '../lib/personality/utils';
import { validateSettings, validateSpirit, getDefaultSettings } from '../lib/personality/schema';

describe('Personality Utils', () => {
  describe('getShiftBucket', () => {
    it('should return morning for hours < 8', () => {
      const morning = new Date('2024-01-01T06:00:00');
      expect(getShiftBucket(morning)).toBe('morning');
    });

    it('should return lunch for hours 8-14', () => {
      const lunch = new Date('2024-01-01T12:00:00');
      expect(getShiftBucket(lunch)).toBe('lunch');
    });

    it('should return evening for hours 15-20', () => {
      const evening = new Date('2024-01-01T18:00:00');
      expect(getShiftBucket(evening)).toBe('evening');
    });

    it('should return late for hours >= 21', () => {
      const late = new Date('2024-01-01T22:00:00');
      expect(getShiftBucket(late)).toBe('late');
    });
  });

  describe('checkSeasonalMatch', () => {
    beforeEach(() => {
      // Mock Date to control test dates
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return lightsaber for May 4', () => {
      jest.setSystemTime(new Date('2024-05-04T12:00:00'));
      expect(checkSeasonalMatch()).toBe('lightsaber');
    });

    it('should return toque for Oct 20', () => {
      jest.setSystemTime(new Date('2024-10-20T12:00:00'));
      expect(checkSeasonalMatch()).toBe('toque');
    });

    it('should return santaHat for Dec 24-26', () => {
      jest.setSystemTime(new Date('2024-12-24T12:00:00'));
      expect(checkSeasonalMatch()).toBe('santaHat');

      jest.setSystemTime(new Date('2024-12-25T12:00:00'));
      expect(checkSeasonalMatch()).toBe('santaHat');

      jest.setSystemTime(new Date('2024-12-26T12:00:00'));
      expect(checkSeasonalMatch()).toBe('santaHat');
    });

    it('should return null for non-seasonal dates', () => {
      jest.setSystemTime(new Date('2024-06-15T12:00:00'));
      expect(checkSeasonalMatch()).toBeNull();
    });
  });

  describe('isSilenced', () => {
    it('should return false when silencedUntil is undefined', () => {
      expect(isSilenced({})).toBe(false);
    });

    it('should return true when silencedUntil is in the future', () => {
      const future = Date.now() + 1000 * 60 * 60; // 1 hour from now
      expect(isSilenced({ silencedUntil: future })).toBe(true);
    });

    it('should return false when silencedUntil is in the past', () => {
      const past = Date.now() - 1000 * 60 * 60; // 1 hour ago
      expect(isSilenced({ silencedUntil: past })).toBe(false);
    });
  });

  describe('silenceFor24h', () => {
    it('should return a timestamp 24 hours in the future', () => {
      const now = Date.now();
      const silenced = silenceFor24h();
      const diff = silenced - now;
      const expectedDiff = 24 * 60 * 60 * 1000; // 24 hours in ms
      expect(diff).toBeGreaterThanOrEqual(expectedDiff - 1000); // Allow 1s tolerance
      expect(diff).toBeLessThanOrEqual(expectedDiff + 1000);
    });
  });
});

describe('Personality Schema', () => {
  describe('validateSpirit', () => {
    it('should return valid spirit for known values', () => {
      expect(validateSpirit('zen')).toBe('zen');
      expect(validateSpirit('spicy')).toBe('spicy');
      expect(validateSpirit('gremlin')).toBe('gremlin');
    });

    it('should return zen for invalid values', () => {
      expect(validateSpirit('invalid')).toBe('zen');
      expect(validateSpirit(null)).toBe('zen');
      expect(validateSpirit(123)).toBe('zen');
    });
  });

  describe('validateSettings', () => {
    it('should return default settings for invalid input', () => {
      const result = validateSettings(null);
      expect(result.enabled).toBe(true);
      expect(result.spirit).toBe('zen');
    });

    it('should validate and return partial settings', () => {
      const partial = { enabled: false, spirit: 'spicy' };
      const result = validateSettings(partial);
      expect(result.enabled).toBe(false);
      expect(result.spirit).toBe('spicy');
      expect(result.mindfulMoments).toBe(true); // Default value
    });

    it('should handle invalid spirit gracefully', () => {
      const invalid = { spirit: 'invalid' };
      const result = validateSettings(invalid);
      expect(result.spirit).toBe('zen');
    });
  });

  describe('getDefaultSettings', () => {
    it('should return all default values', () => {
      const defaults = getDefaultSettings();
      expect(defaults.enabled).toBe(true);
      expect(defaults.spirit).toBe('zen');
      expect(defaults.mindfulMoments).toBe(true);
      expect(defaults.voiceReactions).toBe(false);
    });
  });
});
