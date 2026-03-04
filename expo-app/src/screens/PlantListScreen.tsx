import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  InteractionManager,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { DictionaryStackParamList } from '../navigation/types';

import { plantsV22 } from '../data/plantsV22';
import type { PlantV22 } from '../data/plantV22Types';
import { PlantCard } from '../components/PlantCard';
import { AppText } from '../components/AppText';
import { AppBar } from '../components/AppBar';
import { SearchBar } from '../components/SearchBar';

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

function getInitialStatusFilter(
  params: DictionaryStackParamList['PlantList'] | undefined
): StatusFilterValue {
  const s = params?.status;
  return s === 'safe' || s === 'danger' ? s : 'all';
}

export function PlantListScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<DictionaryStackParamList, 'PlantList'>>();
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>(() =>
    getInitialStatusFilter(route.params)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);

  const genusParam = route.params?.genus;

  useEffect(() => {
    const paramStatus = route.params?.status;
    if (paramStatus === 'safe' || paramStatus === 'danger') {
      setStatusFilter(paramStatus);
    }
  }, [route.params?.status]);

  useEffect(() => {
    if (genusParam?.trim()) {
      setSearchQuery(genusParam.trim());
    }
  }, [genusParam]);

  useEffect(() => {
    if (route.params?.reset) {
      setSearchQuery('');
      setStatusFilter('all');
      navigation.setParams({ reset: undefined });
      const task = InteractionManager.runAfterInteractions(() => {
        searchInputRef.current?.focus();
      });
      return () => task.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- navigation ref is stable
  }, [route.params?.reset]);

  const filteredPlants = useMemo(() => {
    let list = plantsV22
      .filter((plant) => plant.type === 'species' || plant.type === 'genus')
      .filter(
        (plant) => matchSearchQuery(plant, searchQuery) && matchStatusFilter(plant, statusFilter)
      );
    if (genusParam?.trim()) {
      const g = genusParam.trim().toLowerCase();
      list = list.filter((plant) => {
        const genus = plant.scientificName?.split(/\s+/)[0]?.toLowerCase();
        return genus === g || plant.scientificName?.toLowerCase().startsWith(g + ' ');
      });
    }
    return list;
  }, [searchQuery, statusFilter, genusParam]);

  const listTitle = genusParam?.trim() ? `${genusParam} 속 관련 식물` : '식물 사전';

  return (
    <View style={styles.container}>
      <AppBar title={listTitle} />

      <SearchBar
        variant="input"
        placeholder="고양이에게 안전한 식물을 찾아보세요"
        value={searchQuery}
        onChangeText={setSearchQuery}
        inputRef={searchInputRef as React.Ref<TextInput>}
        style={styles.searchBar}
      />

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
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
  searchBar: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabRow: {
    flexDirection: 'row',
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
  list: { flex: 1 },
  listContent: { paddingHorizontal: 24, paddingBottom: 100 },
  plantCard: { marginBottom: 12 },
  empty: { paddingVertical: 48, alignItems: 'center' },
  emptyText: { color: '#6B7280', fontSize: 16 },
});
