/**
 * Types for plant_db_v62.2_final.json
 */

import { plantImageMap } from './plantImageMap';

export interface ParentInfo {
  name: string;
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

/** 이미지 URL: wikimediaImageUrl 또는 null (placeholder용) - URL 기반 이미지용 */
export function getImageUrlV22(plant: PlantV22): string | null {
  const url = plant.wikimediaImageUrl?.trim();
  if (!url) return null;
  // 원격 URL만 반환 (http/https)
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return null;
}

/** 이미지 source: 로컬 require() 또는 { uri } (Image source 용) */
export type PlantImageSource = { uri: string } | number;

export function getImageSourceV22(plant: PlantV22): PlantImageSource | null {
  const url = plant.wikimediaImageUrl?.trim();
  if (!url) return null;
  // 로컬 경로: plantImageMap에서 require 결과 사용
  if (url.startsWith('.') || !url.startsWith('http')) {
    const local = plantImageMap[plant.id];
    return local ?? null;
  }
  return { uri: url };
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
