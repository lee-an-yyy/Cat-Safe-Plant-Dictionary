/**
 * Types for plant_db_v59_fixed.json
 */

export interface ParentInfo {
  name: string;
  isToxic?: boolean;
}

export interface PlantV22 {
  id: string;
  scientificName: string;
  namesKo: string[];
  namesEn: string[];
  isToxic: boolean;
  isCritical: boolean;
  clinicalSigns: string;
  clinicalSignsFormatted?: string;
  keywords?: string[];
  symptoms?: string[];
  groupId?: string;
  type?: 'species' | 'genus' | 'group';
  parentInfo?: ParentInfo | null;
  wikimediaImageUrl?: string;
  hasWikimediaImage?: boolean;
  imageAuthor?: string;
  imageSourceUrl?: string;
  imageLicense?: string;
  imageLicenseUrl?: string;
  clinicalSignsEn?: string;
  imageSearchName?: string;
}

export type SafetyLevelV22 = 'safe' | 'toxic' | 'critical';

export function getSafetyLevelV22(plant: PlantV22): SafetyLevelV22 {
  if (plant.isCritical) return 'critical';
  if (plant.isToxic) return 'toxic';
  return 'safe';
}

export function getDisplayNameV22(plant: PlantV22): string {
  return plant.namesKo?.[0] ?? plant.namesEn?.[0] ?? plant.scientificName ?? plant.id;
}

/** 한/영 이름: "한국명 (English name)" */
export function getDisplayNameBilingualV22(plant: PlantV22): string {
  const ko = plant.namesKo?.[0];
  const en = plant.namesEn?.[0];
  if (ko && en && ko !== en) return `${ko} (${en})`;
  return getDisplayNameV22(plant);
}

/** 이미지 URL: wikimediaImageUrl 또는 null (placeholder용) */
export function getImageUrlV22(plant: PlantV22): string | null {
  if (plant.wikimediaImageUrl?.trim()) return plant.wikimediaImageUrl;
  return null;
}

/** groupId 파싱: "acalypha_group" → "Acalypha 그룹" */
function getGroupDisplayName(groupId: string): string {
  const base = groupId.replace(/_group$/i, '');
  const capitalized = base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
  return `${capitalized} 그룹`;
}

/** 학명에서 속(genus) 추출: "Lilium longiflorum" → "Lilium" */
export function getGenusV22(plant: PlantV22): string {
  const genus = plant.scientificName?.split(/\s+/)[0];
  return genus ?? '';
}

/** 그룹 내 최고 위험도 */
export function getMaxSafetyLevelV22(plants: PlantV22[]): SafetyLevelV22 {
  if (plants.some((p) => p.isCritical)) return 'critical';
  if (plants.some((p) => p.isToxic)) return 'toxic';
  return 'safe';
}

/** 분류 계통 서브텍스트 */
export function getContextSubtitleV22(plant: PlantV22): string | null {
  if (plant.parentInfo?.name != null && plant.parentInfo.name.trim() !== '') {
    return `상위 분류: ${plant.parentInfo.name.trim()}`;
  }
  if (plant.groupId) return getGroupDisplayName(plant.groupId);
  return null;
}
