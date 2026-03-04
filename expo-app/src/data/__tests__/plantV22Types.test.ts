import {
  getSafetyLevelV22,
  getDisplayNameV22,
  getDisplayNameBilingualV22,
  getGenusV22,
  getMaxSafetyLevelV22,
  getImageUrlV22,
} from '../plantV22Types';
import { type PlantV22 } from '../plantV22Types';

const mockSafePlant: PlantV22 = {
  id: 'test_safe',
  scientificName: 'Lilium longiflorum',
  namesKo: ['백합'],
  namesEn: ['Easter Lily'],
  isToxic: false,
  isCritical: false,
  clinicalSigns: '',
  clinicalSignsFormatted: '',
};

const mockToxicPlant: PlantV22 = {
  ...mockSafePlant,
  id: 'test_toxic',
  isToxic: true,
};

const mockCriticalPlant: PlantV22 = {
  ...mockSafePlant,
  id: 'test_critical',
  isToxic: true,
  isCritical: true,
};

describe('plantV22Types', () => {
  describe('getSafetyLevelV22', () => {
    it('returns safe for non-toxic plants', () => {
      expect(getSafetyLevelV22(mockSafePlant)).toBe('safe');
    });

    it('returns toxic for toxic but not critical plants', () => {
      expect(getSafetyLevelV22(mockToxicPlant)).toBe('toxic');
    });

    it('returns critical for critical plants', () => {
      expect(getSafetyLevelV22(mockCriticalPlant)).toBe('critical');
    });
  });

  describe('getDisplayNameV22', () => {
    it('returns Korean name when available', () => {
      expect(getDisplayNameV22(mockSafePlant)).toBe('백합');
    });

    it('falls back to English name when Korean is missing', () => {
      const plant = { ...mockSafePlant, namesKo: [] };
      expect(getDisplayNameV22(plant)).toBe('Easter Lily');
    });

    it('falls back to scientific name when no common names', () => {
      const plant = { ...mockSafePlant, namesKo: [], namesEn: [] };
      expect(getDisplayNameV22(plant)).toBe('Lilium longiflorum');
    });
  });

  describe('getDisplayNameBilingualV22', () => {
    it('returns "Korean (English)" when both exist and differ', () => {
      expect(getDisplayNameBilingualV22(mockSafePlant)).toBe('백합 (Easter Lily)');
    });

    it('returns single name when Korean and English are same', () => {
      const plant = { ...mockSafePlant, namesEn: ['백합'] };
      expect(getDisplayNameBilingualV22(plant)).toBe('백합');
    });
  });

  describe('getGenusV22', () => {
    it('extracts genus from scientific name', () => {
      expect(getGenusV22(mockSafePlant)).toBe('Lilium');
    });
  });

  describe('getMaxSafetyLevelV22', () => {
    it('returns critical when any plant is critical', () => {
      expect(getMaxSafetyLevelV22([mockSafePlant, mockCriticalPlant])).toBe('critical');
    });

    it('returns toxic when any plant is toxic but none critical', () => {
      expect(getMaxSafetyLevelV22([mockSafePlant, mockToxicPlant])).toBe('toxic');
    });

    it('returns safe when all plants are safe', () => {
      expect(getMaxSafetyLevelV22([mockSafePlant])).toBe('safe');
    });
  });

  describe('getImageUrlV22', () => {
    it('returns url when wikimediaImageUrl is set', () => {
      const plant = { ...mockSafePlant, wikimediaImageUrl: 'https://example.com/img.jpg' };
      expect(getImageUrlV22(plant)).toBe('https://example.com/img.jpg');
    });

    it('returns null when wikimediaImageUrl is empty', () => {
      expect(getImageUrlV22(mockSafePlant)).toBeNull();
    });
  });
});
