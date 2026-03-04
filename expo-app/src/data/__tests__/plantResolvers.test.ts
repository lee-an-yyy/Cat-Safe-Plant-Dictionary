import { getPlantById } from '../plantResolvers';

jest.mock('../plantsV22', () => ({
  plantsV22: [
    {
      id: 'gerbera_jamesonii',
      scientificName: 'Gerbera jamesonii',
      namesKo: ['거베라'],
      namesEn: ['Gerbera'],
      isToxic: false,
      isCritical: false,
      clinicalSigns: '',
      clinicalSignsFormatted: '',
    },
    {
      id: 'lilium_longiflorum',
      scientificName: 'Lilium longiflorum',
      namesKo: ['백합'],
      namesEn: ['Easter Lily'],
      isToxic: true,
      isCritical: true,
      clinicalSigns: '',
      clinicalSignsFormatted: '',
    },
  ],
}));

describe('plantResolvers', () => {
  describe('getPlantById', () => {
    it('returns plant when id exists', () => {
      const plant = getPlantById('gerbera_jamesonii');
      expect(plant).not.toBeNull();
      expect(plant?.id).toBe('gerbera_jamesonii');
      expect(plant?.namesKo?.[0]).toBe('거베라');
    });

    it('returns null when id does not exist', () => {
      expect(getPlantById('nonexistent_id')).toBeNull();
    });
  });
});
