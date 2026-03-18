import React from 'react';
import { View, ScrollView, Pressable, StyleSheet, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../components/AppText';
import { AppBar } from '../components/AppBar';
import { colors } from '../theme';
import { SUPPORT_EMAIL } from '../constants/config';

const FAQ_ITEMS = [
  {
    q: '식물이 목록에 없어요. 추가 요청은 어떻게 하나요?',
    a: "확실하고 안전한 정보 제공을 위해 현재는 ASPCA(미국동물학대방지협회)의 공식 데이터만 다루고 있습니다. 찾으시는 식물을 '의견 보내기'로 남겨주시면, 향후 사전 데이터 업데이트 시 적극적으로 참고하여 더 풍성한 정보를 제공할 수 있도록 노력하겠습니다.",
  },
  {
    q: '저장한 식물 목록이 사라졌어요.',
    a: '저장 목록은 기기에만 저장됩니다. 앱을 삭제하시거나 기기 데이터를 초기화하면 복구할 수 없습니다. 중요한 식물은 따로 메모해 두시면 좋습니다. 문제가 반복되면 앱 버전과 기기명을 적어 문의해 주세요.',
  },
  {
    q: '안전/위험 표시가 실제와 다를 수 있나요?',
    a: '저희는 신뢰할 수 있는 자료를 바탕으로 정보를 제공하지만, 식물의 품종·재배 환경에 따라 반응이 달라질 수 있습니다. 반드시 수의사나 전문가 상담을 병행하시고, 반려묘가 식물을 먹었을 때는 즉시 병원에 연락하세요.',
  },
];

export function CustomerSupportScreen() {
  const navigation = useNavigation();

  const openMailto = (subject: string, body: string) => {
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailto).catch(() =>
      Alert.alert('안내', '이메일 앱을 열 수 없습니다. ' + SUPPORT_EMAIL + ' 로 직접 보내 주세요.')
    );
  };

  const sendEmail = () => {
    openMailto(
      '[묘-한 식물 사전] 문의',
      [
        '아래 항목을 채워 보내 주시면 빠른 답변에 도움이 됩니다.',
        '',
        '・앱 버전: (설정 > 더보기에서 확인)',
        '・기기명:',
        '・OS 버전:',
        '・문의 내용:',
      ].join('\n')
    );
  };

  const sendFeedback = () => {
    openMailto(
      '[묘-한 식물 사전] 의견 보내기',
      [
        '서비스 개선 제안이나 추가를 원하는 식물 정보를 적어 주세요.',
        '',
        '・앱 버전: (설정 > 더보기에서 확인)',
        '・의견 내용:',
      ].join('\n')
    );
  };

  return (
    <View style={styles.container}>
      <AppBar title="고객지원" showBack onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 자주 묻는 질문 */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>자주 묻는 질문</AppText>
          <View style={styles.card}>
            {FAQ_ITEMS.map((item, index) => (
              <View
                key={index}
                style={[styles.faqItem, index < FAQ_ITEMS.length - 1 && styles.faqItemBorder]}
              >
                <AppText style={styles.faqQ}>Q. {item.q}</AppText>
                <AppText style={styles.faqA}>{item.a}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* 이메일 문의 안내 */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>이메일 문의 안내</AppText>
          <AppText style={styles.body}>
            이메일로 문의를 받고 있습니다. 아래 주소로 보내 주시면 확인 후
            답변드립니다.
          </AppText>
          <AppText style={styles.body}>
            문의 시 다음 정보를 함께 적어 주시면 더 빠르게 도와드릴 수 있습니다.
          </AppText>
          <View style={styles.bulletList}>
            <Bullet text="앱 버전 (더보기 화면 하단에서 확인)" />
            <Bullet text="기기명 (예: iPhone 15, Galaxy S24)" />
            <Bullet text="문의 내용 (가능하면 구체적으로)" />
          </View>
          <Pressable style={styles.emailButton} onPress={sendEmail}>
            <AppText style={styles.emailButtonText}>문의하기</AppText>
          </Pressable>
        </View>

        {/* 의견 보내기 */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>의견 보내기</AppText>
          <AppText style={styles.body}>
            "이런 식물 정보를 추가해 주세요", "이런 기능이 있으면 좋겠어요" 같은 서비스 개선 제안을
            언제나 환영합니다. 아래 버튼을 눌러 이메일로 보내 주시면 검토 후 반영을 검토하겠습니다.
          </AppText>
          <Pressable style={styles.emailButton} onPress={sendFeedback}>
            <AppText style={styles.emailButtonText}>의견 보내기</AppText>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <AppText style={styles.bulletDot}>·</AppText>
      <AppText style={styles.bulletText}>{text}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 8 },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4B5563',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  faqItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  faqItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  faqQ: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  faqA: {
    fontSize: 14,
    lineHeight: 21,
    color: '#4B5563',
  },
  bulletList: {
    marginBottom: 16,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletDot: {
    fontSize: 15,
    color: '#4B5563',
    marginRight: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#4B5563',
  },
  emailButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  emailButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacer: { height: 100 },
});
