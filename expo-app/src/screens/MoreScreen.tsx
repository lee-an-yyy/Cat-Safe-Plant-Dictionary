import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Info, FileText, Shield, HelpCircle, ChevronRight } from 'lucide-react-native';

import { AppText } from '../components/AppText';
import { AppBar } from '../components/AppBar';
import { colors } from '../theme';
import { APP_VERSION } from '../constants/config';
import type { RootStackParamList } from '../navigation/types';

type MenuRoute = 'ServiceInfo' | 'TermsOfService' | 'PrivacyPolicy' | 'CustomerSupport';

const MENU_ITEMS = [
  { icon: Info, label: '서비스 정보', route: 'ServiceInfo' as const },
  { icon: FileText, label: '이용약관', route: 'TermsOfService' as const },
  { icon: Shield, label: '개인정보 처리방침', route: 'PrivacyPolicy' as const },
  { icon: HelpCircle, label: '고객지원', route: 'CustomerSupport' as const },
] satisfies { icon: typeof Info; label: string; route: MenuRoute }[];

const ICON_COLOR = colors.primary;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function MoreScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleMenuPress = (route: MenuRoute) => {
    navigation.navigate(route);
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
              onPress={() => handleMenuPress(item.route)}
            >
              <View style={styles.menuIcon}>
                <Icon size={24} color={ICON_COLOR} />
              </View>
              <AppText style={styles.menuLabel}>{item.label}</AppText>
              <ChevronRight size={20} color={colors.gray400} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <AppText style={styles.footerTitle}>묘생식물대사전</AppText>
        <AppText style={styles.footerVersion}>Version {APP_VERSION}</AppText>
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
  menu: { paddingHorizontal: 16, paddingTop: 24 },
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
    marginHorizontal: 16,
    marginTop: 32,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  footerTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  footerVersion: { fontSize: 14, color: '#6B7280', marginBottom: 6 },
  footerCopyright: { fontSize: 12, color: colors.gray400, marginBottom: 2 },
  footerCredit: {
    fontSize: 12,
    color: colors.neutral,
    textDecorationLine: 'underline',
  },
});
