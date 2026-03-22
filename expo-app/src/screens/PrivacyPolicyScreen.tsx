import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppBar } from '../components/AppBar';
import { AppText } from '../components/AppText';

export function PrivacyPolicyScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppBar title="개인정보 처리방침" showBack onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppText style={styles.mainTitle}>[묘생식물대사전] 개인정보 처리방침</AppText>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>1. 개인정보의 수집 및 이용 목적</AppText>
          <AppText style={styles.body}>
            묘생식물대사전(이하 '본 서비스')은 사용자의 개인정보를 중요시하며, 어떠한 개인정보도
            수집, 저장, 이용하지 않습니다. 본 서비스는 회원가입 절차가 없으며, 앱 이용 시 사용자를
            식별할 수 있는 어떠한 정보도 요구하지 않습니다.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>2. 수집하는 개인정보 항목 및 수집 방법</AppText>
          <AppText style={styles.body}>
            본 서비스는 식물 독성 정보 및 이미지를 앱 내부에 포함하여 오프라인으로 제공합니다.
            따라서 서비스 제공을 위해 아래와 같은 개인정보를 포함한 어떠한 데이터도 수집하지
            않습니다.
          </AppText>
          <AppText style={styles.body}>
            • 이름, 전화번호, 이메일 주소 등 개인 식별 정보{'\n'}
            • 기기 고유 식별자(디바이스 ID), IP 주소, 위치 정보 등{'\n'}
            • 서비스 이용 기록 및 접속 로그
          </AppText>
          <AppText style={styles.body}>
            [예외적 수집 - 고객지원 이메일 문의] 본 앱 자체는 어떠한 개인정보도 수집하지 않으나,
            사용자가 고객지원을 위해 개발자 이메일로 직접 문의를 보내는 경우, 원활한 상담 및 답변
            제공을 위해 사용자의 '이메일 주소'가 자발적으로 제공될 수 있습니다. 이렇게 수집된
            이메일 주소는 문의 처리 목적으로만 사용되며, 목적 달성(답변 완료) 후 지체 없이
            파기됩니다.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>3. 스마트폰 앱 접근 권한</AppText>
          <AppText style={styles.body}>
            본 서비스는 카메라, 갤러리(사진), 마이크, 위치 정보 등 기기의 어떠한 민감한 접근 권한도
            요구하지 않습니다.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>4. 개인정보의 제3자 제공 및 위탁</AppText>
          <AppText style={styles.body}>
            본 서비스는 개인정보를 일절 수집하지 않으므로, 어떠한 정보도 제3자에게 제공하거나
            위탁하지 않습니다. 또한, 사용자 추적이나 통계 분석을 위한 외부 서드파티
            툴(Google Analytics, Crashlytics 등) 및 맞춤형 광고 모듈을 포함하고 있지 않습니다.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>5. 개인정보의 파기</AppText>
          <AppText style={styles.body}>
            본 서비스는 수집하는 개인정보가 없으므로 파기할 개인정보 또한 존재하지 않습니다. 사용자가
            기기에서 앱을 삭제하는 것만으로 본 서비스와 관련된 모든 이용 및 데이터 접근이 완전히
            종료됩니다.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>6. 문의처</AppText>
          <AppText style={styles.body}>
            본 개인정보 처리방침이나 앱 이용과 관련하여 문의 사항이 있으신 경우, 아래의 연락처로
            문의해 주시기 바랍니다.
          </AppText>
          <AppText style={styles.body}>이메일: [meoknyong@gmail.com]</AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>7. 부칙</AppText>
          <AppText style={styles.body}>본 개인정보 처리방침은 2026년 3월 22일부터 시행됩니다.</AppText>
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
  bottomSpacer: { height: 100 },
});
