import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CHARACTER_NONE_IMG = require('../../assets/character_none.png');

import { getPlantById } from '../data/plantResolvers';
import { PlantCard } from '../components/PlantCard';
import { AppText } from '../components/AppText';
import { AppBar } from '../components/AppBar';
import { useSavedPlants } from '../context/SavedPlantsContext';

export function SavedScreen() {
  const navigation = useNavigation();
  const { savedPlantIds } = useSavedPlants();

  const savedPlants = useMemo(() => {
    return savedPlantIds
      .map((id) => getPlantById(id))
      .filter((r): r is NonNullable<typeof r> => r != null);
  }, [savedPlantIds]);

  if (savedPlants.length === 0) {
    return (
      <View style={styles.container}>
        <AppBar title="저장된 식물" />
        <View style={styles.empty}>
          <Image source={CHARACTER_NONE_IMG} style={styles.emptyIcon} resizeMode="contain" />
          <AppText style={styles.emptyTitle}>아직 저장된 식물이 없어요</AppText>
          <AppText style={styles.emptyText}>
            북마크하여 보관함에 저장하고 빠르게 찾아보세요.
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar title="저장된 식물" subtitle={`${savedPlants.length}개의 식물 저장됨`} />
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {savedPlants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onPress={() => navigation.navigate('PlantDetail', { plantId: plant.id })}
            style={styles.plantCardMargin}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    marginTop: -64,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  plantCardMargin: { marginBottom: 12 },
});
