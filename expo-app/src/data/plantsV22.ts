import type { PlantV22 } from './plantV22Types';

/**
 * 앱 식물 데이터 - plant_db_v62.2_final.json을 단일 소스로 사용
 * - 이미지 경로가 프로젝트 내부 로컬 경로(assets/plant_img)로 변경됨
 * - JSON 수정 시 앱 재실행/리로드 시 자동 반영됨
 */
const plantData = require('../../plant_db_v62.2_final.json') as PlantV22[];

export const plantsV22: PlantV22[] = plantData;
