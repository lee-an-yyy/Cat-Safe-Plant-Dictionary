import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Bookmark, Leaf, AlertTriangle, ChevronRight } from 'lucide-react-native';
import { getPlantById } from '../data/plantResolvers';
import { COPYRIGHT_TEXT } from '../constants/config';
import { plantsV22 } from '../data/plantsV22';
import {
  getSafetyLevelV22,
  getDisplayNameV22,
  getImageSourceV22,
  getGenusV22,
  getMaxSafetyLevelV22,
} from '../data/plantV22Types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { PlantCard } from '../components/PlantCard';
import { WikimediaImageAttribution } from '../components/WikimediaImageAttribution';
import { AppText } from '../components/AppText';
import { AppBar } from '../components/AppBar';
import { useSavedPlants } from '../context/SavedPlantsContext';
import { useEnglishOriginalPreference } from '../context/EnglishOriginalPreferenceContext';
import type { HomeStackParamList } from '../navigation/types';

type PlantDetailRouteProp = RouteProp<HomeStackParamList, 'PlantDetail'>;

function getPlantsByGenus(genus: string) {
  const g = genus.trim().toLowerCase();
  return plantsV22.filter((plant) => {
    if (plant.type === 'group') return false;
    const plantGenus = plant.scientificName?.split(/\s+/)[0]?.toLowerCase();
    return plantGenus === g || plant.scientificName?.toLowerCase().startsWith(g + ' ');
  });
}

export function PlantDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<PlantDetailRouteProp>();
  const { plantId, genus } = route.params;
  const { toggleSavedPlant, isPlantSaved } = useSavedPlants();
  const { showEnglish, setShowEnglish } = useEnglishOriginalPreference();
  const genusScrollRef = useRef<ScrollView>(null);
  const [showAITooltip, setShowAITooltip] = useState(false);

  // 속(genus) 상세 페이지 - 열릴 때 스크롤을 맨 위로
  useEffect(() => {
    if (genus?.trim()) {
      genusScrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [genus]);

  const toggleAITooltip = () => setShowAITooltip((prev) => !prev);

  // 속(genus) 상세 페이지
  if (genus?.trim()) {
    const genusPlants = getPlantsByGenus(genus);
    const maxLevel = getMaxSafetyLevelV22(genusPlants);
    const genusLabel = `${genus.trim()} 속`;

    const toxicityHeadline =
      maxLevel === 'critical'
        ? '고양이에게 매우 치명적인 식물이 포함되어 있어요'
        : maxLevel === 'toxic'
          ? '고양이에게 위험한 식물이 포함되어 있어요'
          : null;
    const toxicityDesc =
      maxLevel === 'critical'
        ? '이 속에 속한 일부 식물은 소량 섭취로도 신부전을 일으킬 수 있어요.'
        : maxLevel === 'toxic'
          ? '이 속에 속한 일부 식물은 섭취 시 증상이 나타날 수 있어요.'
          : null;

    return (
      <ScrollView
        ref={genusScrollRef}
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <AppBar showBack onBack={() => navigation.goBack()} transparent />
        <View style={[styles.body, styles.bodyNoHero]}>
          <View style={styles.card}>
            <View style={styles.speciesTag}>
              <Leaf size={14} color="#27AE60" />
              <AppText style={styles.speciesTagText}>속(Genus)</AppText>
            </View>
            <AppText style={styles.plantName}>{genusLabel}</AppText>
            <AppText style={styles.genusSubtext}>
              {genusPlants.length}종의 식물이 이 속에 포함되어 있어요
            </AppText>
          </View>

          {toxicityHeadline && toxicityDesc && (
            <View style={styles.toxicityCard}>
              <View style={styles.toxicityIconWrap}>
                <AlertTriangle size={24} color="#fff" />
              </View>
              <View style={styles.toxicityContent}>
                <AppText style={styles.toxicityHeadline}>{toxicityHeadline}</AppText>
                <AppText style={styles.toxicityDesc}>{toxicityDesc}</AppText>
              </View>
            </View>
          )}

          {maxLevel === 'safe' && (
            <View style={styles.safeInfoCard}>
              <View style={styles.safeIconWrap}>
                <Leaf size={24} color="#fff" />
              </View>
              <View style={styles.safeContent}>
                <AppText style={styles.safeHeadline}>이 속의 식물은 고양이에게 안전해요</AppText>
                <AppText style={styles.safeDesc}>
                  이 속에 속한 식물들은 고양이에게 독성이 없는 것으로 알려져 있습니다.
                </AppText>
              </View>
            </View>
          )}

          <View style={styles.card}>
            <AppText style={styles.sectionTitle}>관련 식물 ({genusPlants.length}종)</AppText>
            {genusPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onPress={() => navigation.navigate('PlantDetail', { plantId: plant.id })}
                style={styles.genusPlantCard}
              />
            ))}
          </View>

          <View style={styles.footer}>
            <AppText style={styles.footerDisclaimer}>
              본 정보는 <AppText style={styles.footerDisclaimerBold}>ASPCA</AppText>의 데이터를
              바탕으로 제공됩니다.
            </AppText>
            <AppText style={styles.footerCopyright}>{COPYRIGHT_TEXT}</AppText>
          </View>
        </View>
      </ScrollView>
    );
  }

  // 개별 식물 상세 페이지
  const isBookmarked = isPlantSaved(plantId ?? '');
  const resolved = getPlantById(plantId ?? '');

  if (!plantId || !resolved) {
    return (
      <View style={styles.centered}>
        <AppText style={styles.notFound}>식물을 찾을 수 없습니다</AppText>
      </View>
    );
  }

  const plant = resolved;
  const level = getSafetyLevelV22(plant);
  const displayName = getDisplayNameV22(plant);
  const imageSource = getImageSourceV22(plant);
  const plantGenus = getGenusV22(plant);
  const symptoms = plant.symptoms?.filter((s) => s?.trim()) ?? [];
  const namesKo = plant.namesKo?.filter((s) => s?.trim()) ?? [];
  const namesEn = plant.namesEn?.filter((s) => s?.trim()) ?? [];
  const clinicalDesc =
    plant.clinicalSignsFormatted?.trim() ||
    plant.clinicalSigns?.trim() ||
    (plant.isToxic ? '' : '이 식물은 고양이에게 독성이 없는 것으로 알려져 있습니다.');
  const clinicalSignsEn = plant.clinicalSignsEn?.trim();

  const toxicityHeadline =
    level === 'critical'
      ? '고양이에게 매우 치명적이에요'
      : level === 'toxic'
        ? '고양이에게 위험해요'
        : null;
  const toxicityDesc =
    level === 'critical'
      ? '소량 섭취로도 신부전을 일으킬 수 있어요. 식물의 어떤 부분이라도 섭취하면 치명적일 수 있습니다.'
      : level === 'toxic'
        ? '섭취 시 증상이 나타날 수 있어요. 접촉을 피해 주세요.'
        : null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.flex1} contentContainerStyle={styles.content}>
        <View style={styles.heroContainer}>
          {imageSource ? (
            <ImageWithFallback source={imageSource} style={styles.heroImage} />
          ) : (
            <View style={[styles.heroImage, styles.heroImagePlaceholder]} />
          )}
          <View style={styles.heroOverlay} />
          <WikimediaImageAttribution
            imageAuthor={plant.imageAuthor}
            imageSourceUrl={plant.imageSourceUrl}
            imageLicense={plant.imageLicense}
            imageLicenseUrl={plant.imageLicenseUrl}
          />
        </View>
        <View style={styles.body}>
          {/* 식물 식별: type 필드에 따른 태그 + 이름 + 학명 */}
          <View style={styles.card}>
            <View style={styles.speciesTag}>
              <Leaf size={14} color="#27AE60" />
              <AppText style={styles.speciesTagText}>
                {plant.type === 'genus' ? '속(Genus)' : '특정 종(Species)'}
              </AppText>
            </View>
            <AppText style={styles.plantName}>{displayName}</AppText>
            <AppText style={styles.scientificName}>{plant.scientificName}</AppText>
          </View>

          {/* 독성 경고 카드 (위험/치명적일 때) */}
          {toxicityHeadline && toxicityDesc && (
            <View style={styles.toxicityCard}>
              <View style={styles.toxicityIconWrap}>
                <AlertTriangle size={24} color="#fff" />
              </View>
              <View style={styles.toxicityContent}>
                <AppText style={styles.toxicityHeadline}>{toxicityHeadline}</AppText>
                <AppText style={styles.toxicityDesc}>{toxicityDesc}</AppText>
              </View>
            </View>
          )}

          {/* 안전 카드 (안전할 때) */}
          {level === 'safe' && (
            <View style={styles.safeInfoCard}>
              <View style={styles.safeIconWrap}>
                <Leaf size={24} color="#fff" />
              </View>
              <View style={styles.safeContent}>
                <AppText style={styles.safeHeadline}>고양이에게 안전해요</AppText>
                <AppText style={styles.safeDesc}>
                  이 식물은 고양이에게 독성이 없는 것으로 알려져 있습니다.
                </AppText>
              </View>
            </View>
          )}

          {/* 주요 증상 - 증상 칩 */}
          <View style={styles.card}>
            <TouchableOpacity
              style={[styles.titleWithIcon, styles.sectionTitleRow]}
              onPress={toggleAITooltip}
              activeOpacity={0.7}
            >
              <AppText style={[styles.sectionTitle, styles.sectionTitleInline]}>
                주요 증상
              </AppText>
              <View pointerEvents="none">
                <MaterialCommunityIcons name="information" size={18} color="#A3A3A3" />
              </View>
            </TouchableOpacity>
            {showAITooltip && (
              <View style={styles.tooltipBox}>
                <AppText style={styles.tooltipTitle}>AI 번역 안내</AppText>
                <AppText style={styles.tooltipMessage}>
                  식물의 이름과 주요 증상 등 일부 정보는 인공지능(AI)을 통해 번역 및 요약되었습니다.
                  원문과 미세한 차이가 있을 수 있으니 참고용으로만 확인해 주세요.
                </AppText>
              </View>
            )}
            {symptoms.length > 0 ? (
              <View style={styles.chipRow}>
                {symptoms.map((s, i) => (
                  <View key={i} style={styles.symptomChip}>
                    <AppText style={styles.symptomChipText}>{s}</AppText>
                  </View>
                ))}
              </View>
            ) : (
              <AppText style={styles.description}>
                {plant.isToxic ? '—' : '특별한 주의 증상이 없어요.'}
              </AppText>
            )}
          </View>

          {/* 불리는 이름들 */}
          <View style={styles.card}>
            <AppText style={styles.sectionTitle}>불리는 이름들</AppText>
            {namesKo.length > 0 && (
              <View style={styles.nameGroup}>
                <AppText style={styles.nameGroupLabel}>한국어</AppText>
                <View style={styles.chipRow}>
                  {namesKo.map((n, i) => (
                    <View key={i} style={styles.nameChip}>
                      <AppText style={styles.nameChipText}>{n}</AppText>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {namesEn.length > 0 && (
              <View style={styles.nameGroup}>
                <AppText style={styles.nameGroupLabel}>영어</AppText>
                <View style={styles.chipRow}>
                  {namesEn.map((n, i) => (
                    <View key={i} style={styles.nameChip}>
                      <AppText style={styles.nameChipText}>{n}</AppText>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* 상세 증상 설명 */}
          {clinicalDesc ? (
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <AppText style={[styles.sectionTitle, styles.sectionTitleInHeader]}>
                  상세 증상 설명
                </AppText>
                {clinicalSignsEn ? (
                  <Pressable
                    style={styles.englishToggleButton}
                    onPress={() => setShowEnglish((prev) => !prev)}
                  >
                    <AppText style={styles.englishToggleText}>
                      {showEnglish ? '영어 원문 닫기' : '영어 원문 보기'}
                    </AppText>
                  </Pressable>
                ) : null}
              </View>
              <AppText style={styles.description}>{clinicalDesc}</AppText>
              {showEnglish && clinicalSignsEn ? (
                <View style={styles.englishContainer}>
                  <AppText style={styles.englishText}>{clinicalSignsEn}</AppText>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* 분류 정보 */}
          {(plantGenus || plant.parentInfo?.name) && (
            <View style={styles.card}>
              <AppText style={styles.sectionTitle}>분류 정보</AppText>
              <Pressable
                style={styles.classificationChip}
                onPress={() => {
                  if (plantGenus?.trim()) {
                    navigation.navigate('PlantDetail', { genus: plantGenus.trim() });
                  }
                }}
              >
                <AppText style={styles.classificationText}>
                  {plant.parentInfo?.name ?? `${plantGenus} 속`}
                </AppText>
                <ChevronRight size={16} color="#9CA3AF" />
              </Pressable>
            </View>
          )}

          {/* 푸터 */}
          <View style={styles.footer}>
            <AppText style={styles.footerDisclaimer}>
              본 앱의 정보는 <AppText style={styles.footerDisclaimerBold}>ASPCA</AppText> 원문
              데이터를 바탕으로 제공됩니다. 식물명과 증상 등의 정보는 인공지능(AI)을 활용하여 번역 및
              요약되었으므로, 수의학적 진단이나 전문적인 의료 조언을 대신할 수 없습니다. 식물에 의한
              중독 증상은 건강 상태나 섭취량에 따라 다를 수 있으므로, 의심 증상 발생 시 즉시 수의사와
              상담하십시오. 정보의 번역 오류에 대해 당사는 법적 책임을 지지 않습니다.
            </AppText>
            <AppText style={styles.footerCopyright}>{COPYRIGHT_TEXT}</AppText>
          </View>
        </View>
      </ScrollView>
      <View style={styles.appBarOverlay}>
        <AppBar
          showBack
          onBack={() => navigation.goBack()}
          transparent
          right={
            <Pressable
              style={[
                styles.bookmarkButtonOverlay,
                isBookmarked && styles.bookmarkButtonOverlayActive,
              ]}
              onPress={() => toggleSavedPlant(plantId)}
            >
              <Bookmark size={24} color="#fff" fill={isBookmarked ? '#fff' : 'none'} />
            </Pressable>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  tooltipBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6B7280',
  },
  tooltipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  tooltipMessage: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4B5563',
  },
  flex1: { flex: 1 },
  content: { paddingBottom: 48 },
  appBarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: { color: '#6B7280', fontSize: 16 },
  heroContainer: { position: 'relative' },
  heroImage: { width: '100%', height: 320 },
  heroImagePlaceholder: {
    backgroundColor: '#E5E7EB',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  bookmarkButtonOverlay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkButtonOverlayActive: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  body: { paddingHorizontal: 16, marginTop: -24 },
  bodyNoHero: { marginTop: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  speciesTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(39,174,96,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
    marginBottom: 12,
  },
  speciesTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#27AE60',
  },
  plantName: { fontSize: 28, fontWeight: '700', marginBottom: 6 },
  genusSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  genusPlantCard: { marginBottom: 12 },
  scientificName: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  toxicityCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(231,76,60,0.08)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(231,76,60,0.2)',
    gap: 16,
  },
  toxicityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toxicityContent: { flex: 1 },
  toxicityHeadline: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 6,
  },
  toxicityDesc: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  safeInfoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(39,174,96,0.08)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(39,174,96,0.2)',
    gap: 16,
  },
  safeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#27AE60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeContent: { flex: 1 },
  safeHeadline: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B7D3A',
    marginBottom: 6,
  },
  safeDesc: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    backgroundColor: 'rgba(231,76,60,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(231,76,60,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  symptomChipText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  nameGroup: { marginBottom: 12 },
  nameGroupLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  nameChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  nameChipText: { fontSize: 14, color: '#374151' },
  classificationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  classificationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    marginTop: 8,
    marginBottom: 32,
    paddingTop: 24,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  footerDisclaimer: {
    fontSize: 12,
    color: '#708090',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  footerDisclaimerBold: {
    fontWeight: '700',
  },
  footerCopyright: {
    fontSize: 11,
    color: '#708090',
    textAlign: 'center',
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  sectionTitleInline: { marginBottom: 0 },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    marginLeft: 2,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleRow: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleInHeader: { marginBottom: 0 },
  englishToggleButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  englishToggleText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  englishContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#27AE60',
  },
  englishText: {
    fontSize: 14,
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  description: { fontSize: 16, color: '#6B7280', lineHeight: 24 },
});
