import { plantsV22 } from './plantsV22';
import type { PlantV22 } from './plantV22Types';

export function getPlantById(plantId: string): PlantV22 | null {
  return plantsV22.find((p) => p.id === plantId) ?? null;
}
