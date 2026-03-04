import React from 'react';
import { View, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { ImageWithFallback } from './ImageWithFallback';
import { AppText } from './AppText';
import { colors } from '../theme';
import type { PlantV22, SafetyLevelV22 } from '../data/plantV22Types';
import {
  getSafetyLevelV22,
  getDisplayNameV22,
  getDisplayNameBilingualV22,
  getContextSubtitleV22,
  getImageUrlV22,
} from '../data/plantV22Types';

export interface PlantCardProps {
  plant: PlantV22;
  onPress?: () => void;
  style?: ViewStyle;
}

function getStatusConfig(level: SafetyLevelV22) {
  switch (level) {
    case 'safe':
      return { color: colors.primary, label: '안전' };
    case 'toxic':
      return { color: colors.danger, label: '위험' };
    case 'critical':
      return { color: colors.dangerDark, label: '치명적' };
    default:
      return { color: colors.gray500, label: '알 수 없음' };
  }
}

export function PlantCard({ plant, onPress, style }: PlantCardProps) {
  const level = getSafetyLevelV22(plant);
  const statusConfig = getStatusConfig(level);
  const displayName = plant.groupId ? getDisplayNameV22(plant) : getDisplayNameBilingualV22(plant);
  const contextSubtitle = getContextSubtitleV22(plant);
  const imageUrl = getImageUrlV22(plant);

  return (
    <Pressable style={[styles.card, style]} onPress={onPress}>
      {imageUrl ? (
        <ImageWithFallback source={{ uri: imageUrl }} style={styles.plantImage} />
      ) : (
        <View style={[styles.plantImage, styles.plantImagePlaceholder]} />
      )}
      <View style={styles.plantInfo}>
        <AppText style={styles.plantName} numberOfLines={1}>
          {displayName}
        </AppText>
        <AppText style={styles.plantScientific} numberOfLines={1}>
          {plant.scientificName}
        </AppText>
        {contextSubtitle != null && (
          <AppText style={styles.contextSubtitle} numberOfLines={1}>
            [{contextSubtitle}]
          </AppText>
        )}
        <View style={[styles.statusChip, { backgroundColor: `${statusConfig.color}20` }]}>
          <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
          <AppText style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 24,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  plantImage: {
    width: 80,
    height: 80,
    margin: 12,
    borderRadius: 16,
  },
  plantImagePlaceholder: {
    backgroundColor: colors.gray200,
  },
  plantInfo: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    justifyContent: 'center',
    minWidth: 0,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    flexShrink: 1,
  },
  plantScientific: {
    fontSize: 14,
    color: colors.gray500,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  contextSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
