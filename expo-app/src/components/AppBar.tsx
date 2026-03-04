import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { AppText } from './AppText';

const PADDING_TOP = 48;
const PADDING_BOTTOM = 24;
const PADDING_H = 24;

export interface AppBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
}

export function AppBar({
  title,
  subtitle,
  showBack,
  onBack,
  right,
  transparent,
  style,
}: AppBarProps) {
  const barStyle = transparent ? [styles.bar, styles.barTransparent, style] : [styles.bar, style];
  const backButtonStyle = transparent
    ? [styles.backButton, styles.backButtonOverlay]
    : styles.backButton;
  const backIconColor = transparent ? '#fff' : '#111';

  return (
    <View style={barStyle}>
      {showBack && (
        <Pressable style={backButtonStyle} onPress={onBack} hitSlop={8}>
          <ArrowLeft size={22} color={backIconColor} />
        </Pressable>
      )}
      {title ? (
        <View style={styles.titleWrap}>
          <AppText style={styles.title} numberOfLines={1}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
      ) : (
        <View style={styles.titleWrap} />
      )}
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: PADDING_H,
    paddingTop: PADDING_TOP,
    paddingBottom: PADDING_BOTTOM,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  barTransparent: {
    backgroundColor: 'rgba(0,0,0,0)',
    shadowOpacity: 0,
    elevation: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backButtonOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  right: {
    marginLeft: 8,
  },
});
