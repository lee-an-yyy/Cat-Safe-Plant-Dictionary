import React from 'react';
import { View, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { ShieldCheck, AlertTriangle } from 'lucide-react-native';

import { plantsV22 } from '../data/plantsV22';
import { PlantCard } from '../components/PlantCard';
import { AppText } from '../components/AppText';
import { SearchBar } from '../components/SearchBar';

const CHARACTER_IMG = require('../../assets/character.png');
const LOGO_IMG = require('../../assets/logo.png');

export function HomeScreen() {
  const navigation = useNavigation();

  const safePlants = plantsV22.filter((p) => !p.isToxic);
  const dangerousPlants = plantsV22.filter((p) => p.isToxic);
  const weeklyPickIds = [
    'gerbera_jamesonii', // 거베라
    'gypsophila_elegans', // 안개꽃
    'sinningia_speciosa', // 글록시니아
    'impatiens_spp', // 봉선화
  ];
  const weeklyPicks = weeklyPickIds
    .map((id) => plantsV22.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p != null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Home 전용 헤더: 배경 + 고양이 일러스트 + 검색창 */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={LOGO_IMG} style={styles.headerLogo} resizeMode="contain" />
        </View>
        <SearchBar
          variant="pressable"
          placeholder="고양이에게 안전한 식물을 찾아보세요"
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'Main',
                    state: {
                      index: 1,
                      routes: [
                        { name: 'Home' },
                        {
                          name: 'Dictionary',
                          state: {
                            index: 0,
                            routes: [{ name: 'PlantList', params: { reset: true } }],
                          },
                        },
                        { name: 'Saved' },
                        { name: 'More' },
                      ],
                    },
                  },
                ],
              })
            );
          }}
          style={styles.searchBar}
        />
        <View style={styles.characterWrap} pointerEvents="none">
          <Image source={CHARACTER_IMG} style={styles.character} resizeMode="contain" />
        </View>
      </View>

      {/* Category Cards */}
      <View style={styles.categoryRow}>
        <Pressable
          style={[styles.categoryCard, styles.safeCard]}
          onPress={() =>
            navigation.navigate('Dictionary', {
              screen: 'PlantList',
              params: { status: 'safe' },
            })
          }
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
          onPress={() =>
            navigation.navigate('Dictionary', {
              screen: 'PlantList',
              params: { status: 'danger' },
            })
          }
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

      {/* Weekly Pick */}
      <AppText style={styles.sectionTitle}>집에서 키우기 좋은 안전한 꽃 추천</AppText>
      <View style={styles.weeklyPicksContainer}>
        {weeklyPicks.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onPress={() => navigation.navigate('PlantDetail', { plantId: plant.id })}
            style={styles.plantCard}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { paddingBottom: 100 },
  header: {
    backgroundColor: '#43AB7C',
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 40,
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
  searchBar: {
    marginTop: 16,
    zIndex: 1,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
  },
  weeklyPicksContainer: {
    paddingHorizontal: 24,
  },
  plantCard: {
    marginBottom: 12,
  },
});
