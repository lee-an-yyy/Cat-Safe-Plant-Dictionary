import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShieldAlert, Check } from 'lucide-react-native';

import { AppText } from '../components/AppText';
import { STORAGE_KEYS } from '../theme';

const DISCLAIMER_ITEMS = [
  {
    label: '오류 가능성 및 이미지 참고',
    body: '번역, 식물 그룹화, 이미지 매칭 과정에서 오류가 있을 수 있으며, 제공되는 이미지는 식별을 위한 참고용입니다.',
  },
  {
    label: '수의학적 진단 대체 불가',
    body: '본 정보는 참고용 가이드일 뿐입니다. 반려동물이 식물을 섭취하고 이상 증상이 발생할 경우, 즉시 수의사와 상담하시기 바랍니다.',
  },
];

export function OnboardingDisclaimerScreen() {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();

  const handleStart = async () => {
    if (!agreed || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DISCLAIMER_AGREED, 'true');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단: 아이콘 + 제목 */}
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <ShieldAlert size={48} color="#27AE60" strokeWidth={2} />
          </View>
          <AppText style={styles.title}>서비스 이용 전 반드시 읽어주세요</AppText>

        </View>

        {/* 중앙: 면책 문구 */}
        <View style={styles.disclaimerBox}>
          <AppText style={styles.disclaimerIntro}>
            '묘생식물대사전'은 ASPCA 데이터를 기반으로 자체 가공한 식물 정보를 제공합니다. 서비스
            이용 전 아래 사항을 꼭 확인해 주세요.
          </AppText>
          {DISCLAIMER_ITEMS.map((item) => (
            <View key={item.label} style={styles.disclaimerItem}>
              <AppText style={styles.disclaimerLabel}>{item.label}:</AppText>
              <AppText style={styles.disclaimerBody}>{item.body}</AppText>
            </View>
          ))}
        </View>

        {/* 하단: 동의 체크박스 + 시작하기 버튼 */}
        <View style={styles.footer}>
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setAgreed((prev) => !prev)}
            hitSlop={8}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Check size={18} color="#fff" strokeWidth={3} />}
            </View>
            <AppText style={styles.checkboxLabel}>위 내용을 확인하였으며 동의합니다</AppText>
          </Pressable>

          <Pressable
            style={[styles.startButton, (!agreed || isSubmitting) && styles.startButtonDisabled]}
            onPress={handleStart}
            disabled={!agreed || isSubmitting}
          >
            <AppText
              style={[
                styles.startButtonText,
                (!agreed || isSubmitting) && styles.startButtonTextDisabled,
              ]}
            >
              {isSubmitting ? '처리 중...' : '시작하기'}
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(39, 174, 96, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 28,
  },
  disclaimerBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  disclaimerIntro: {
    fontSize: 17,
    lineHeight: 26,
    color: '#166534',
    fontWeight: '600',
    marginBottom: 18,
  },
  disclaimerItem: {
    marginBottom: 14,
  },
  disclaimerLabel: {
    fontSize: 15,
    lineHeight: 22,
    color: '#166534',
    fontWeight: '600',
    marginBottom: 4,
  },
  disclaimerBody: {
    fontSize: 15,
    lineHeight: 22,
    color: '#166534',
    opacity: 0.95,
  },
  footer: {
    marginTop: 'auto',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#27AE60',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  startButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
