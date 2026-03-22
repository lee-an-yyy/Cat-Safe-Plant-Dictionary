import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppBar } from '../components/AppBar';
import { AppText } from '../components/AppText';

export function TermsOfServiceScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppBar title="이용약관" showBack onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppText style={styles.mainTitle}>
          [묘생식물대사전] 이용약관 (Terms of Service)
        </AppText>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>제1조 (목적)</AppText>
          <AppText style={styles.body}>
            본 약관은 묘생식물대사전(이하 '서비스')이 제공하는 식물 독성 정보 및 관련 서비스의 이용
            조건, 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다. 본 앱을 기기에 설치하고
            이용하는 것은 본 약관에 동의한 것으로 간주됩니다.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>제2조 (서비스의 성격 및 한계)</AppText>
          <AppText style={styles.body}>
            1. 본 앱은 ASPCA(미국동물학대방지협회) 등의 데이터를 인공지능(AI)을 활용해 번역 및
            재가공하여, 고양이 양육자에게 식물 독성에 관한 일반적인 정보를 오프라인 환경에서 무료로
            제공합니다.
          </AppText>
          <AppText style={styles.body}>
            2. 본 앱에서 제공하는 모든 정보는 참고용이며, 어떠한 경우에도{' '}
            <AppText style={styles.bold}>수의사의 전문적인 진단, 처방, 치료 또는 수의학적 조언을 대신할 수 없습니다.</AppText>
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>제3조 (저작권 및 지적재산권)</AppText>
          <AppText style={styles.body}>
            1. 본 앱의 기획, 디자인(UI/UX), 소스코드 등에 대한 지적재산권은 개발자에게 있습니다.
          </AppText>
          <AppText style={styles.body}>
            2. 본 앱 내에 포함된 식물 데이터(ASPCA 원문 기반)와 식물 이미지(위키미디어 커먼즈 등)는
            각각의 원작자 및 오픈소스/크리에이티브 커먼즈 라이선스(CC BY 등) 규정에 따라 제공되며,
            상세한 저작자 정보는 앱 내 개별 화면 및 오픈소스 라이선스 고지에서 확인할 수 있습니다.
          </AppText>
          <AppText style={styles.body}>
            3. 사용자는 본 앱을 개인적이고 비상업적인 목적으로만 이용할 수 있으며, 개발자의 사전
            승인이나 라이선스 규정을 위반하여 영리 목적으로 무단 복제, 배포, 수정할 수 없습니다.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>제4조 (서비스의 변경 및 중단)</AppText>
          <AppText style={styles.body}>
            1. 개발자는 앱의 품질 향상, 버그 수정, 데이터 업데이트 등을 위해 사전 통지 없이
            서비스를 변경하거나 업데이트할 수 있습니다.
          </AppText>
          <AppText style={styles.body}>
            2. 개발자의 사정이나 불가항력적인 사유로 인해 서비스 제공이 일시적 또는 영구적으로
            중단될 수 있으며, 이로 인해 사용자에게 발생한 불편에 대해 별도의 보상을 제공하지
            않습니다.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>제5조 (면책 조항)</AppText>
          <AppText style={styles.body}>
            1. 개발자는 본 앱에서 제공하는 AI 번역 데이터의 정확성, 완전성, 최신성을 100% 보증하지
            않으며, 데이터의 오류, 누락, 번역 지연 등으로 인해 발생하는 어떠한 직·간접적인 피해에
            대해서도 법적 책임을 지지 않습니다.
          </AppText>
          <AppText style={styles.body}>
            2. 반려묘의 건강 상태, 식물의 섭취량 및 섭취 부위 등에 따라 독성 반응은 다르게 나타날 수
            있습니다. <AppText style={styles.bold}>이상 증상 발생 시 즉시 수의사와 상담해야 하며</AppText>,{' '}
            <AppText style={styles.bold}>앱의 정보에 의존하여 발생한 결과에 대한 모든 책임은 사용자 본인에게 있습니다.</AppText>
          </AppText>
          <AppText style={styles.body}>
            3. 본 앱은 오프라인 기반으로 동작하며, 사용자의 기기 오류, 환경적 요인 등으로 인해 앱이
            정상적으로 작동하지 않아 발생한 문제에 대해 개발자는 책임을 지지 않습니다.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>제6조 (약관의 개정)</AppText>
          <AppText style={styles.body}>
            개발자는 관련 법령을 위배하지 않는 범위 내에서 본 약관을 개정할 수 있습니다. 약관이
            변경될 경우, 업데이트된 앱 버전을 통해 변경 사항을 공지합니다.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>부칙</AppText>
          <AppText style={styles.body}>본 약관은 2026년 3월 22일부터 시행됩니다.</AppText>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 8 },
  mainTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'left',
  },
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
    marginBottom: 12,
  },
  bold: {
    fontWeight: '600',
    color: '#111827',
  },
  bottomSpacer: { height: 100 },
});
