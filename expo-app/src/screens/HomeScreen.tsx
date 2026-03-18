import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Keyboard,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { HomeStackParamList } from '../navigation/types';
import { ShieldCheck, AlertTriangle, LayoutGrid, Search } from 'lucide-react-native';

import { plantsV22 } from '../data/plantsV22';
import { colors } from '../theme';
import type { PlantV22 } from '../data/plantV22Types';
import { PlantCard } from '../components/PlantCard';
import { AppText } from '../components/AppText';
import { SearchBar } from '../components/SearchBar';

const CHARACTER_IMG = require('../../assets/character.png');
const LOGO_IMG = require('../../assets/logo.png');

const SCROLL_THRESHOLD = 80;
const HEADER_EXPANDED_HEIGHT = 220;
/** 버튼(48) + paddingBottom(12) + marginTop(8). HEADER_COLLAPSED_HEIGHT = inset + 이 값. 56px였을 때 overflow로 상단 잘림 */
const COLLAPSED_BAR_CONTENT_HEIGHT = 68;

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

const FILTER_TABS: { value: StatusFilterValue; label: string; icon: typeof LayoutGrid }[] = [
  { value: 'all', label: '전체', icon: LayoutGrid },
  { value: 'safe', label: '안전', icon: ShieldCheck },
  { value: 'danger', label: '위험', icon: AlertTriangle },
];

/** 꽃다발·실내식물 등 자주 사용하는 식물 우선순위 (앞일수록 상단 노출) */
const POPULAR_PLANT_ORDER: string[] = [
  'rosa_spp', // 장미 (Rosa spp.)
  'dianthus_caryophyllus', // 카네이션 (Dianthus caryophyllus)
  'gypsophila_elegans', // 안개꽃 (Gypsophila elegans)
  'hydrangea_arborescens', // 수국 / 나무수국 (Hydrangea arborescens)
  'epipremnum_aureum', // 골든 포토스 / 스킨답서스 (Scindapsus aureus)
  'scindapsus_pictus', // 스킨답서스 (Scindapsus spp)
  'spathiphyllum', // 스파티필름 (Spathiphyllum)
  'lilium_longiflorum', // 백합 (Lilium longiflorum)
  'dracaena_fragrans', // 행운목 (Dracaena fragrans)
  'pachira_aquatica', // 파키라 / 머니트리 (Pachira aquatica)
  'crassula_argentea', // 염좌 / 돈나무 (Crassula argentea)
  'aloe_barbadensis', // 알로에 베라 (Aloe barbadensis)
  'coleus_amboinicus', // 장미허브 (Coleus amboinicus)
  'brassaia_actinophylla', // 대엽홍콩야자 / 쉐플레라 (Brassaia actinophylla)
  'philodendron_hederaceum', // 하트잎 필로덴드론 (Philodendron hederaceum)
  'syngonium_podophyllum', // 싱고니움 (Syngonium podophyllum)
  'narcissus_jonquilla', // 수선화 (Narcissus jonquilla)
  'hyacinthus_orientalis', // 히아신스 (Hyacinthus orientalis)
  'dracaena_marginata', // 마지나타 (Dracaena marginata)
  'aglaonema_modestum', // 아글라오네마 (Aglaonema modestum)
  'cyclamen_spp', // 시클라멘 (Cyclamen spp)
  'dahlia_species', // 다알리아 (Dahlia species)
  'lilium_asiatica', // 아시아틱 백합 (Lilium asiatica)
  'lilium_orientalis', // 스타게이저 백합 (Lilium orientalis)
  'dieffenbachia_amoena', // 디펜바키아 아모에나 (Dieffenbachia amoena)
  'dieffenbachia_picta', // 디펜바키아 픽타 (Dieffenbachia picta)
  'philodendron_selloum', // 셀로움 (Philodendron selloum)
  'strelitzia_reginae', // 극락조화 (Strelitzia reginae)
  'clivia_miniata', // 군자란 (Clivia miniata)
  'haworthia_fasciata', // 십이지권 (Haworthia fasciata)
  'echeveria_elegans', // 멕시코 돌나물 (Echeveria elegans)
  'haworthia_subfasciata', // 얼룩말 하월시아 (Haworthia subfasciata)
  'kalanchoe_tubiflora', // 칼랑코에 튜비플로라 (Kalanchoe tubiflora)
  'adenium_obesum', // 사막장미 (Adenium obesum)
  'dracaena_deremensis', // 자넷 크레이그 (Dracaena deremensis)
  'dracaena_reflexa', // 송 오브 인디아 (Dracaena reflexa)
  'cordyline_australis', // 뉴질랜드드라세나 (Cordyline australis)
  'cordyline_terminalis', // 티플랜트 (Cordyline terminalis)
  'begonia_semperflorens_cultivar', // 왁스 베고니아 (Begonia semperflorens cultivar)
  'begonia_rex', // 렉스 베고니아 (Begonia rex)
  'asparagus_densiflorus', // 아스파라거스 / 메이리 (Asparagus densiflorus)
  'hypoestes_phyllostachya', // 하이포에스테스 / 폴카닷 식물 (Hypoestes phyllostachya)
  'hosta_plantaginea', // 비비추 / 호스타 (Hosta plantaginea)
  'aspidistra_elatior', // 엽란 (Aspidistra elatior)
  'davallia_fejeensis', // 토끼발고사리 (Davallia fejeensis)
  'asplenium_bulbiferum', // 어미고사리 (Asplenium bulbiferum)
  'clematis_spp', // 클레마티스 (Clematis spp.)
  'petunia_species', // 페튜니아 (Petunia species)
  'alcea_rosea', // 접시꽃 (Alcea rosea)
  'hemerocallis_graminea', // 원추리 (Hemerocallis graminea)
  'lilium_tigrinum', // 참나리 (Lilium tigrinum)
  'lilium_speciosum', // 산나리 (Lilium speciosum)
  'anthemis_nobilis', // 로만 캐모마일 (Anthemis nobilis)
  'stephanotis_floribunda', // 마다가스카르 자스민 (Stephanotis floribunda)
  'hylocereus_undatus', // 용과 / 드래곤 프루트 (Hylocereus undatus)
  'euphorbia_tirucalli', // 청산호 / 연필선인장 (Euphorbia tirucalli)
  'beaucarnea_recurvata', // 덕구리난 / 코끼리발나무 (Beaucarnea recurvata)
  'nolina_tuberculata', // 노리나 / 포니테일 플랜트 (Nolina tuberculata)
  'calathea_insignis', // 칼라데아 란시폴리아 / 부부초 (Calathea insignis)
  'calathea_micans', // 칼라데아 미칸스 (Calathea micans)
  'philodendron_bipennifolium', // 바이올린 필로덴드론 (Philodendron bipennifolium)
  'philodendron_oxycardium', // 필로덴드론 옥시카르디움 (Philodendron oxycardium)
  'dracaena_surculosa', // 골드 더스트 드라세나 (Dracaena surculosa)
  'cordyline_rubra', // 코르딜리네 루브라 (Cordyline rubra)
  'aloe_retusa', // 쿠션 알로에 (Aloe retusa)
  'crassula_arborescens', // 은전나무 / 실버달러 (Crassula arborescens)
  'haworthia_margaritifera', // 월동자 (Haworthia margaritifera)
  'echeveria_derenbergii', // 데렌베르기 에케베리아 (Echeveria derenbergii)
  'echeveria_pulvinata', // 에케베리아 풀비나타 (Echeveria pulvinata)
  'echeveria_gilva', // 에케베리아 길바 (Echeveria gilva)
  'echeveria_glauca', // 에케베리아 글라우카 (Echeveria glauca)
  'echeveria_multicaulis', // 에케베리아 멀티카울리스 (Echeveria multicaulis)
  'echeveria_pulv_oliver', // 에케베리아 풀 올리버 (Echeveria 'Pulv-Oliver')
  'portulaca_oleracea', // 쇠비름 (Portulaca oleracea)
  'clusia_major', // 클루시아 (Clusia major)
  'asparagus_densiflorus_cv_sprengeri', // 스프렌게리 (Asparagus densiflorus cv sprengeri)
  'hypocyrta_nummularia', // 금붕어꽃 / 네마탄서스 (Hypocyrta nummularia)
  'aeschynanthus_humilis', // 립스틱 식물 (Aeschynanthus humilis)
  'iris_spuria', // 나비붓꽃 / 아이리스 (Iris spuria)
  'colchicum_autumnale', // 가을크로커스 (Colchicum autumnale)
  'digitalis_purpurea', // 폭스글러브 / 디기탈리스 (Digitalis purpurea)
  'gloriosa_superba', // 글로리오사 (Gloriosa rothschildiana)
  'lilium_umbellatum', // 솔나리 (Lilium umbellatum)
  'anthemis_cotula', // 개꽃마리 / 독성 카모마일 (Anthemis cotula)
  'begonia_cleopatra', // 클레오파트라 베고니아 (Begonia cleopatra)
  'begonia_masoniana', // 아이언 크로스 베고니아 (Begonia masoniana)
  'begonia_metallica', // 메탈릭카 베고니아 (Begonia metallica)
  'begonia_scharffii', // 베고니아 샤르피 (Begonia scharffii)
  'adonidia_merrillii', // 마닐라 야자 / 크리스마스 야자 (Adonidia merrillii)
  'zamia_furfuracea', // 카드보드 사이카드 (Zamia furfuracea)
  'zamia_pumila', // 쿤티야자 (Zamia pumila)
  'gynura_aurantiaca', // 벨벳식물 (Gynura aurantiaca)
  'iresine_herbstii', // 블러드리프 / 아이레신 (Iresine herbstii)
  'hemigraphis_exotica', // 와플식물 (Hemigraphis exotica)
  'pellionia_daveauana', // 펠리오니아 다베아우아나 (Pellionia daveauana)
  'pellionia_pulchra', // 사틴 펠리오니아 (Pellionia pulchra)
  'bertolonia_maculata', // 모자이크 식물 (Bertolonia mosaica)
  'tolmiea_menziesii', // 피기백플랜트 (Tolmiea menziesii)
  'frithia_pulchra', // 프리티아 (Frithia pulchra)
];

function getPlantSortOrder(id: string): number {
  const idx = POPULAR_PLANT_ORDER.indexOf(id);
  return idx >= 0 ? idx : POPULAR_PLANT_ORDER.length;
}

function getTabCount(value: StatusFilterValue, all: number, safe: number, danger: number): string {
  if (value === 'all') return String(all);
  if (value === 'safe') return String(safe);
  return String(danger);
}

export function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<HomeStackParamList, 'HomeScreen'>>();
  const insets = useSafeAreaInsets();
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);
  const listRef = useRef<FlatList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  /** SafeArea + marginTop(8) + 버튼(48) + paddingBottom(12). 노치/동적아일랜드 대응 */
  const headerCollapsedHeight = insets.top + COLLAPSED_BAR_CONTENT_HEIGHT;

  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      setIsHeaderCollapsed(value > SCROLL_THRESHOLD);
    });
    return () => scrollY.removeListener(listener);
  }, [scrollY]);

  useEffect(() => {
    if (route.params?.resetSearch) {
      setSearchQuery('');
      setStatusFilter('all');
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
      (navigation as any).setParams({ resetSearch: undefined });
    }
  }, [route.params?.resetSearch, navigation]);

  const basePlants = useMemo(
    () => plantsV22.filter((p) => p.type === 'species' || p.type === 'genus'),
    []
  );
  const allCount = basePlants.length;
  const safeCount = basePlants.filter((p) => !p.isToxic).length;
  const dangerCount = basePlants.filter((p) => p.isToxic).length;

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

  const handleFloatingSearchPress = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    setTimeout(() => searchInputRef.current?.focus(), 400);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const collapsedOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const headerHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [HEADER_EXPANDED_HEIGHT, headerCollapsedHeight],
    extrapolate: 'clamp',
  });

  const renderPlant = ({ item: plant }: { item: PlantV22 }) => (
    <PlantCard
      plant={plant}
      onPress={() => navigation.navigate('PlantDetail', { plantId: plant.id })}
      style={styles.plantCard}
    />
  );

  const fixedHeader = (
    <>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={LOGO_IMG} style={styles.headerLogo} resizeMode="contain" />
        </View>
      </View>
      <View style={styles.searchColumn}>
        <View style={styles.characterWrap} pointerEvents="none">
          <Image source={CHARACTER_IMG} style={styles.character} resizeMode="contain" />
        </View>
        <View style={styles.searchWrap}>
          <SearchBar
            variant="input"
            placeholder="고양이에게 안전한 식물을 찾아보세요"
            value={searchQuery}
            onChangeText={setSearchQuery}
            inputRef={searchInputRef as React.Ref<TextInput>}
            style={styles.searchBar}
          />
        </View>
      </View>
    </>
  );

  const filterTabsHeader = (
    <View style={styles.filterHeader}>
      <View style={styles.tabRow}>
        {FILTER_TABS.map((tab) => {
          const isActive = statusFilter === tab.value;
          const TabIcon = tab.icon;
          const count = getTabCount(tab.value, allCount, safeCount, dangerCount);
          const label = tab.value === 'all' ? '전체' : `${tab.label} (${count})`;
          const iconColor = isActive
            ? colors.white
            : tab.value === 'safe'
              ? colors.primary
              : tab.value === 'danger'
                ? colors.danger
                : colors.neutral;
          return (
            <Pressable
              key={tab.value}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setStatusFilter(tab.value)}
            >
              <TabIcon
                size={14}
                color={iconColor}
                style={styles.tabIcon}
              />
              <AppText style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={listRef as any}
        data={filteredPlants}
        renderItem={renderPlant}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: HEADER_EXPANDED_HEIGHT },
        ]}
        ListHeaderComponent={filterTabsHeader}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText style={styles.emptyText}>식물을 찾을 수 없습니다</AppText>
          </View>
        }
      />
      <Animated.View
        style={[
          styles.fixedHeaderOverlay,
          { height: headerHeight, overflow: 'hidden' as const },
        ]}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: headerOpacity }]}
          pointerEvents={isHeaderCollapsed ? 'none' : 'box-none'}
        >
          <View style={styles.headerGreenBg}>{fixedHeader}</View>
        </Animated.View>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.collapsedBar,
            { opacity: collapsedOpacity, paddingTop: insets.top + 8 },
          ]}
          pointerEvents={isHeaderCollapsed ? 'box-none' : 'none'}
        >
          <Pressable
            style={({ pressed }) => [
              styles.floatingSearchBtn,
              pressed && styles.floatingSearchBtnPressed,
            ]}
            onPress={handleFloatingSearchPress}
          >
            <Search size={22} color="#fff" />
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  fixedHeader: {
    backgroundColor: '#43AB7C',
    paddingHorizontal: 24,
  },
  fixedHeaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
  },
  headerGreenBg: {
    flex: 1,
    backgroundColor: '#43AB7C',
    paddingHorizontal: 24,
  },
  collapsedBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingBottom: 12,
    /* paddingTop: insets.top + 8 → collapsedBar 인라인에서 적용 (노치/동적아일랜드 대응, 버튼 하단 배치) */
  },
  floatingSearchBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#43AB7C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingSearchBtnPressed: {
    opacity: 0.85,
  },
  list: { flex: 1 },
  listContent: { paddingBottom: 100, paddingHorizontal: 24 },
  header: {
    paddingTop: 48,
    paddingBottom: 20,
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
  searchColumn: {
    position: 'relative',
    paddingBottom: 16,
  },
  characterWrap: {
    position: 'absolute',
    right: 0,
    bottom: 42,
    zIndex: 10,
  },
  character: {
    width: 100,
    height: 100,
  },
  searchWrap: {
    paddingTop: 0,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  filterHeader: {
    backgroundColor: 'transparent',
    paddingTop: 24,
    paddingBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  tabActive: {
    backgroundColor: colors.gray600,
    borderColor: colors.gray600,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  tabIcon: {
    marginRight: 0,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.neutral,
  },
  tabLabelActive: {
    color: colors.white,
    fontWeight: '600',
  },
  plantCard: {
    marginHorizontal: 0,
    marginBottom: 12,
  },
  empty: { paddingVertical: 48, alignItems: 'center' },
  emptyText: { color: '#6B7280', fontSize: 16 },
});
