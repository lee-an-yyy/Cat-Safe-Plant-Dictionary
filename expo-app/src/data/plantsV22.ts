import type { PlantV22 } from './plantV22Types';

/**
 * 앱 식물 데이터 - plant_db_v59_fixed.json을 단일 소스로 사용
 * - JSON 수정 시 앱 재실행/리로드 시 자동 반영됨
 * - 별도 TS 동기화 작업 불필요
 */
const plantData = require('../../plant_db_v59_fixed.json') as PlantV22[];

export const plantsV22: PlantV22[] = plantData;
