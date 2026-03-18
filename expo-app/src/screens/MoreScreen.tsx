import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Info, Shield, HelpCircle, ChevronRight } from 'lucide-react-native';

import { AppText } from '../components/AppText';
import { AppBar } from '../components/AppBar';
import { colors } from '../theme';

const MENU_ITEMS = [
  { icon: Info, label: '서비스 정보' },
  { icon: Shield, label: '개인정보 처리방침' },
  { icon: HelpCircle, label: '고객지원' },
];

const ICON_COLOR = colors.primary;

export function MoreScreen() {
  const navigation = useNavigation();

  const handleMenuPress = (label: string) => {
    if (label === '서비스 정보') navigation.navigate('ServiceInfo');
    if (label === '개인정보 처리방침') navigation.navigate('PrivacyPolicy');
    if (label === '고객지원') navigation.navigate('CustomerSupport');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppBar title="더보기" />

      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Pressable
              key={item.label}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.label)}
            >
              <View style={styles.menuIcon}>
                <Icon size={24} color={ICON_COLOR} />
              </View>
              <AppText style={styles.menuLabel}>{item.label}</AppText>
              <ChevronRight size={20} color="#9CA3AF" />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <AppText style={styles.footerTitle}>묘생식물대사전</AppText>
        <AppText style={styles.footerVersion}>Version 1.0.0</AppText>
        <AppText style={styles.footerCopyright}>© 2026 All rights reserved</AppText>
        <Pressable onPress={() => navigation.navigate('CreatorStory')}>
          <AppText style={styles.footerCredit}>Built & Designed by Yuan Lee</AppText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { paddingBottom: 100 },
  menu: { paddingHorizontal: 24, paddingTop: 24 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '500' },
  footer: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginTop: 32,
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  footerTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  footerVersion: { fontSize: 14, color: '#6B7280', marginBottom: 6 },
  footerCopyright: { fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
  footerCredit: {
    fontSize: 12,
    color: colors.neutral,
    textDecorationLine: 'underline',
  },
});
