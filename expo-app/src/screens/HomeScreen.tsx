import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { HomeStackParamList } from '../navigation/types';
import { ShieldCheck, AlertTriangle } from 'lucide-react-native';

import { plantsV22 } from '../data/plantsV22';
import type { PlantV22 } from '../data/plantV22Types';
import { PlantCard } from '../components/PlantCard';
import { AppText } from '../components/AppText';
import { SearchBar } from '../components/SearchBar';

const CHARACTER_IMG = require('../../assets/character.png');
const LOGO_IMG = require('../../assets/logo.png');

function matchSearchQuery(plant: PlantV22, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase().trim();
  const fields = [
    plant.scientificName,
    ...(plant.namesKo ?? []),
    ...(plant.namesEn ?? []),
    ...(plant.keywords ?? []),
    plant.id,
  ];
  return fields.some((s) => typeof s === 'string' && s.toLowerCase().includes(q));
}

type StatusFilterValue = 'all' | 'safe' | 'danger';

function matchStatusFilter(plant: PlantV22, statusFilter: StatusFilterValue): boolean {
  if (statusFilter === 'all') return true;
  if (statusFilter === 'safe') return !plant.isToxic;
  return plant.isToxic;
}

const FILTER_TABS: { value: StatusFilterValue; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'safe', label: '안전' },
  { value: 'danger', label: '위험' },
];

/** 꽃다발·실내식물 등 자주 사용하는 식물 우선순위 (앞일수록 상단 노출) */
const POPULAR_PLANT_ORDER: string[] = [
  // 꽃다발·절화
  'chrysanthemum_spp', // 국화
  'dianthus_caryophyllus', // 카네이션
  'rosa_species', // 장미
  'tulipa_spp', // 튤립
  'gypsophila_elegans', // 안개꽃
  'alstroemeria', // 알스트로메리아
  'lilium_longiflorum', // 부활절백합
  'lilium_orientalis', // 스타게이저 백합
  'lilium_asiatica', // 아시아백합
  'hydrangea_arborescens', // 수국
  'gerbera_jamesonii', // 거베라
  'dahlia_species', // 다알리아
  'gladiolus_species', // 글라디올러스
  'delphinium_species', // 델피니움
  'stephanotis_floribunda', // 스테파노티스
  'eucalyptus_species', // 유칼립투스
  'lavandula_angustifolia', // 라벤더
  'hyacinthus_orientalis', // 히아신스
  'narcissus_jonquilla', // 나르시스
  'muscari_armeniacum', // 무스카리
  'helianthus_angustifolius', // 해바라기
  'zinnia_species', // 백일초
  'callistephus_chinensis', // 과꽃
  'calendula_officinalis', // 금잔화
  'sinningia_speciosa', // 글록시니아
  'impatiens_spp', // 봉선화
  'cyclamen_spp', // 시클라멘
  'amaryllis_spp', // 아마릴리스
  // 실내식물
  'epipremnum_aureum', // 스킨답서스(골든포토스)
  'scindapsus_pictus', // 스킨답서스(실버팟)
  'monstera_deliciosa', // 몬스테라
  'sansevieria_trifasciata', // 산세베리아
  'philodendron_hederaceum', // 필로덴드론
  'philodendron_oxycardium', // 필로덴드론
  'spathiphyllum', // 스파티필럼
  'ficus_benjamina', // 벤자민 고무나무
  'dracaena_fragrans', // 행운목
  'dracaena_marginata', // 마진나타
  'chamaedorea_elegans', // 테이블야자
  'beaucarnea_recurvata', // 대나무야자
  'pachira_aquatica', // 파키라
  'aspidistra_elatior', // 관음죽
  'tradescantia_fluminensis', // 트라데스칸티아
  'fittonia_verschaffeltii', // 피토니아
  'hypoestes_phyllostachya', // 침실식물
  'calathea_insignis', // 칼라테아
  'calathea_micans', // 칼라테아
  'syngonium_podophyllum', // 싱고니움
  'anthurium_scherzeranum', // 안스리움
  'saintpaulia_confusa', // 아프리칸 바이올렛
  'aglaonema_modestum', // 아글라오네마
  'brassaia_actinophylla', // 스케팔레라(브라사이아)
  'dieffenbachia_picta', // 디펜바키아
  'dieffenbachia_amoena', // 디펜바키아
  // 선인장·다육
  'opuntia_species', // 선인장
  'haworthia_fasciata', // 하월시아
  'echeveria_elegans', // 에케베리아
  'crassula_argentea', // 금전수
  'rhipsalis_cassutha', // 겨우살이 선인장
  'mammillaria_fragilis', // 맘밀라리아
];

function getPlantSortOrder(id: string): number {
  const idx = POPULAR_PLANT_ORDER.indexOf(id);
  return idx >= 0 ? idx : POPULAR_PLANT_ORDER.length;
}

export function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<HomeStackParamList, 'HomeScreen'>>();
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (route.params?.resetSearch) {
      setSearchQuery('');
      setStatusFilter('all');
      setIsSearchFocused(false);
      // Clear param to avoid repeated resets
      (navigation as any).setParams({ resetSearch: undefined });
    }
  }, [route.params?.resetSearch, navigation]);

  const safePlants = plantsV22.filter((p) => !p.isToxic);
  const dangerousPlants = plantsV22.filter((p) => p.isToxic);

  const filteredPlants = useMemo(() => {
    const filtered = plantsV22
      .filter((plant) => plant.type === 'species' || plant.type === 'genus')
      .filter(
        (plant) =>
          matchSearchQuery(plant, searchQuery) && matchStatusFilter(plant, statusFilter)
      );
    return [...filtered].sort(
      (a, b) => getPlantSortOrder(a.id) - getPlantSortOrder(b.id)
    );
  }, [searchQuery, statusFilter]);

  const showDecorativeElements = !isSearchFocused;

  const handleSearchFocus = () => setIsSearchFocused(true);
  const handleSearchBlur = () => setIsSearchFocused(false);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => Keyboard.dismiss()}
      >
        {/* Header: logo, search, character - hidden when search focused */}
        {showDecorativeElements && (
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image source={LOGO_IMG} style={styles.headerLogo} resizeMode="contain" />
            </View>
            <View style={styles.characterWrap} pointerEvents="none">
              <Image source={CHARACTER_IMG} style={styles.character} resizeMode="contain" />
            </View>
          </View>
        )}

        <View style={[styles.searchWrap, !showDecorativeElements && styles.searchWrapCompact]}>
          <SearchBar
            variant="input"
            placeholder="고양이에게 안전한 식물을 찾아보세요"
            value={searchQuery}
            onChangeText={setSearchQuery}
            inputRef={searchInputRef as React.Ref<TextInput>}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            style={styles.searchBar}
          />
        </View>

        {/* Category Cards - hidden when search focused */}
        {showDecorativeElements && (
          <View style={styles.categoryRow}>
            <Pressable
              style={[styles.categoryCard, styles.safeCard]}
              onPress={() => setStatusFilter('safe')}
            >
              <View style={[styles.cardIcon, styles.safeCardIcon]}>
                <ShieldCheck size={20} color="#1B7D3A" />
              </View>
              <AppText style={[styles.cardTitle, styles.safeCardTitle]}>안전한 식물</AppText>
              <AppText style={[styles.cardCount, styles.safeCardCount]}>
                {safePlants.length} 개의 식물
              </AppText>
            </Pressable>
            <Pressable
              style={[styles.categoryCard, styles.dangerCard]}
              onPress={() => setStatusFilter('danger')}
            >
              <View style={[styles.cardIcon, styles.dangerCardIcon]}>
                <AlertTriangle size={20} color="#C62828" />
              </View>
              <AppText style={[styles.cardTitle, styles.dangerCardTitle]}>위험한 식물</AppText>
              <AppText style={[styles.cardCount, styles.dangerCardCount]}>
                {dangerousPlants.length} 개의 식물
              </AppText>
            </Pressable>
          </View>
        )}

        {/* Filter tabs */}
        <View style={styles.tabRow}>
          {FILTER_TABS.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <Pressable
                key={tab.value}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setStatusFilter(tab.value)}
              >
                <AppText style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {/* Plant list */}
        {filteredPlants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onPress={() => navigation.navigate('PlantDetail', { plantId: plant.id })}
            style={styles.plantCard}
          />
        ))}
        {filteredPlants.length === 0 && (
          <View style={styles.empty}>
            <AppText style={styles.emptyText}>식물을 찾을 수 없습니다</AppText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: {
    backgroundColor: '#43AB7C',
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLogo: {
    height: 40,
    width: 200,
    marginTop: 12,
  },
  characterWrap: {
    position: 'absolute',
    right: 24,
    top: 48,
    zIndex: 10,
  },
  character: {
    width: 100,
    height: 100,
  },
  searchWrap: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 20,
    backgroundColor: '#43AB7C',
  },
  searchWrapCompact: {
    paddingTop: 38,
    backgroundColor: '#43AB7C',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  categoryCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    minHeight: 100,
  },
  safeCard: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#27AE60',
  },
  dangerCard: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E74C3C',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  safeCardIcon: {
    backgroundColor: 'rgba(39, 174, 96, 0.2)',
  },
  dangerCardIcon: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  cardCount: { fontSize: 13 },
  safeCardTitle: { color: '#27AE60' },
  safeCardCount: { color: '#27AE60', opacity: 0.9 },
  dangerCardTitle: { color: '#E74C3C' },
  dangerCardCount: { color: '#E74C3C', opacity: 0.9 },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
    gap: 8,
    alignItems: 'center',
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabActive: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabLabelActive: {
    color: '#fff',
    fontWeight: '600',
  },
  plantCard: {
    marginHorizontal: 24,
    marginBottom: 12,
  },
  empty: { paddingVertical: 48, alignItems: 'center' },
  emptyText: { color: '#6B7280', fontSize: 16 },
});
