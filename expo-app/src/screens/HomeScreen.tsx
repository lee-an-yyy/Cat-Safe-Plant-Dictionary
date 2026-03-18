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
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { HomeStackParamList } from '../navigation/types';
import { ShieldCheck, AlertTriangle, LayoutGrid, Search } from 'lucide-react-native';

import { plantsV22 } from '../data/plantsV22';
import { POPULAR_PLANT_ORDER } from '../data/popularPlantOrder';
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

function getPlantSortOrder(id: string): number {
  const idx = POPULAR_PLANT_ORDER.indexOf(id);
  return idx >= 0 ? idx : POPULAR_PLANT_ORDER.length;
}

function getTabCount(value: StatusFilterValue, all: number, safe: number, danger: number): string {
  if (value === 'all') return String(all);
  if (value === 'safe') return String(safe);
  return String(danger);
}

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
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
      navigation.setParams({ resetSearch: undefined });
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
        ref={listRef}
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
            <Search size={22} color={colors.white} />
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  fixedHeader: {
    backgroundColor: colors.primaryHeader,
    paddingHorizontal: 16,
  },
  fixedHeaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
  headerGreenBg: {
    flex: 1,
    backgroundColor: colors.primaryHeader,
    paddingHorizontal: 16,
  },
  collapsedBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingBottom: 12,
    /* paddingTop: insets.top + 8 → collapsedBar 인라인에서 적용 (노치/동적아일랜드 대응, 버튼 하단 배치) */
  },
  floatingSearchBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryHeader,
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
  listContent: { paddingBottom: 100, paddingHorizontal: 16 },
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
  emptyText: { color: colors.gray500, fontSize: 16 },
});
