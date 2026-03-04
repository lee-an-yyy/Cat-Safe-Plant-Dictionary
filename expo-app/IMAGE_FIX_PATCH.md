# 식물 이미지 수정 패치 제안

## 개요

일부 식물 이미지가 표시되지 않는 문제를 해결하기 위한 `plant_db_v59_fixed.json` 수정 패치입니다.

---

## 원인 분류

### 1. URL 경로 오류 (Wikimedia Commons 경로 변경)

Wikimedia Commons가 파일 저장 경로 체계를 변경함. DB에 저장된 경로(`e/e8`, `2/23` 등)가 현재 실제 경로와 불일치하여 404 발생.

### 2. 삭제된 이미지

해당 파일이 Commons에서 삭제되었거나 원본 업로드가 없음.

---

## 수정 내용

### A. URL 경로 수정 (5건)

| id | scientificName | 변경 전 | 변경 후 |
|----|----------------|--------|---------|
| `cordyline_terminalis` | Cordyline terminalis | `2/23/Ti_plant_...` | `0/05/Ti_plant_...` |
| `cucurbita_maxima_cv_buttercup` | Cucurbita maxima cv buttercup | `e/e8/Cucurbita_maxima_flower...` | `1/10/Cucurbita_maxima_flower...` |
| `cucurbita_maxima_cv_turbaniformis` | Cucurbita maxima cv turbaniformis | `e/e8/Cucurbita_maxima_flower...` | `1/10/Cucurbita_maxima_flower...` |
| `cucurbita_maxima_var_banana` | Cucurbita maxima var. banana | `e/e8/Cucurbita_maxima_flower...` | `1/10/Cucurbita_maxima_flower...` |
| `cucurbita_maxima_var_hubbard` | Cucurbita maxima var. hubbard | `e/e8/Cucurbita_maxima_flower...` | `1/10/Cucurbita_maxima_flower...` |

### B. 삭제된 이미지 대체 (1건)

| id | scientificName | 조치 |
|----|----------------|------|
| `haworthia_subfasciata` | Haworthia subfasciata | 근연종 Haworthia fasciata 이미지로 대체 (십이지권, 얼룩말 선인장으로 유사 외형) |

**대체 이미지 URL:**
```
https://upload.wikimedia.org/wikipedia/commons/9/99/1_Haworthia_fasciata_-_small_plant_in_cultivation_-_CT.jpg
```

### C. 이미지 제거 (플레이스홀더 사용) (1건)

| id | scientificName | 조치 |
|----|----------------|------|
| `aloe_retusa` | Aloe retusa | Commons에 적합한 Aloe retusa 사진 없음 → `wikimediaImageUrl` 제거, `hasWikimediaImage: false`로 설정하여 앱 placeholder 표시 |

---

## 구체적 JSON 변경 사항

### 1. cordyline_terminalis (라인 ~1656)

```diff
- "wikimediaImageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Ti_plant_%28Cordyline_fruticosa%29.jpg",
+ "wikimediaImageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/05/Ti_plant_%28Cordyline_fruticosa%29.jpg",
```

### 2. cucurbita_maxima_cv_turbaniformis (라인 ~2028)

```diff
- "wikimediaImageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Cucurbita_maxima_flower_W_IMG_3542.jpg",
+ "wikimediaImageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/10/Cucurbita_maxima_flower_W_IMG_3542.jpg",
```

### 3. cucurbita_maxima_var_hubbard (라인 ~2112)

```diff
- "wikimediaImageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Cucurbita_maxima_flower_W_IMG_3542.jpg",
+ "wikimediaImageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/10/Cucurbita_maxima_flower_W_IMG_3542.jpg",
```

### 4. aloe_retusa (라인 ~367-374)

```diff
- "wikimediaImageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/11/Aloe_retusa_03.jpg",
- "imageTitle": "Aloe retusa flower and leaves",
- "imageAuthor": "Consultaplantas",
- "imageSourceUrl": "https://commons.wikimedia.org/wiki/File:Haworthia_mutica_var_nigra_1e.jpg",
- "imageLicense": "CC BY-SA 4.0",
- "imageLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
- "hasWikimediaImage": true,
+ "wikimediaImageUrl": "",
+ "imageTitle": "",
+ "imageAuthor": "",
+ "imageSourceUrl": "",
+ "imageLicense": "",
+ "imageLicenseUrl": "",
+ "hasWikimediaImage": false,
```

### 5. haworthia_subfasciata (라인 ~3157-3161)

```diff
- "wikimediaImageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Haworthia_attenuata_var._subfasciata_1.jpg",
- "imageTitle": "Haworthia fasciata",
- "imageAuthor": "C T Johansson",
- "imageSourceUrl": "https://commons.wikimedia.org/wiki/File:1_Haworthia_fasciata_-_small_plant_in_cultivation_-_CT.jpg",
+ "wikimediaImageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/99/1_Haworthia_fasciata_-_small_plant_in_cultivation_-_CT.jpg",
+ "imageTitle": "Haworthia fasciata - small plant in cultivation",
+ "imageAuthor": "C T Johansson",
+ "imageSourceUrl": "https://commons.wikimedia.org/wiki/File:1_Haworthia_fasciata_-_small_plant_in_cultivation_-_CT.jpg",
```

---

## 2차 수정 (2025-03)

### A. URL 경로 수정 (1건)

| id | scientificName | 변경 전 | 변경 후 |
|----|----------------|--------|---------|
| `sophronitis_spp` | Sophronitis coccinea | `9/90/Sophronitis_coccinea1.jpg` | `b/b2/Sophronitis_coccinea1.jpg` |

### B. 삭제된 이미지 대체 (10건)

| id | scientificName | 대체 이미지 |
|----|----------------|-------------|
| `kalmia_augustifolia` | Kalmia angustifolia | Kalmia_angustifolia_Rubra.jpg |
| `lilium_asiatica` | Lilium asiatica | Asiatic_Lilium_7211.JPG |
| `aeschynanthus_humilis` | Aeschynanthus humilis | Lipstick plant (Aeschynanthus pulcher) |
| `bertolonia_mosaica` | Bertolonia mosaica | Bertolonia_maculata (근연종) |
| `bulbophyllum_appendiculatum` | Bulbophyllum appendiculatum | Bulbophyllum_echinolabium (동속) |
| `cucurbita_pepo_cv_zucchini` | Cucurbita pepo cv zucchini | Cucurbita_pepo_Vilarromaris |
| `galtonia_spp` | Galtonia candicans | Ornithogalum_candicans-IMG_9254 |
| `lampranthus_piquet` | Lampranthus piquet | Lampranthus_multiradiatus (동속) |
| `leucospermum_incisum` | Leucospermum incisum | Leucospermum_cultivar |
| `vinca_rosea` | Vinca rosea | Catharanthus_roseus_flower_bud |

---

## 참고: Aloe retusa 향후 개선

Aloe retusa(쿠션 알로에)는 Commons에서 적합한 사진을 찾지 못했습니다. 추후 아래 중 하나로 개선 가능합니다:
- Commons에 Aloe retusa 사진 업로드 후 URL 추가
- 다른 CC 라이선스 이미지 소스 활용
