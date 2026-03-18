import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../components/AppText';
import { AppBar } from '../components/AppBar';

export function ServiceInfoScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppBar title="서비스 정보" showBack onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 오픈소스 라이선스 고지 */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>오픈소스 라이선스 고지</AppText>
          <AppText style={styles.body}>
            본 앱은 오픈소스 소프트웨어를 활용하여 제작되었습니다. 사용된 오픈소스 목록 및 각
            라이선스 내용은 아래에서 확인하실 수 있습니다.
          </AppText>
          <Pressable
            style={styles.linkButton}
            onPress={() => navigation.navigate('OpenSourceLicense')}
          >
            <AppText style={styles.linkButtonText}>상세 목록 보기</AppText>
          </Pressable>
        </View>

        {/* 데이터 및 이미지 출처 */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>데이터 및 이미지 출처</AppText>
          <AppText style={styles.body}>
            <AppText style={styles.bold}>식물 데이터:</AppText> 본 앱이 제공하는 식물 독성 정보는
            ASPCA(미국동물학대방지협회)의 데이터를 기반으로 번역 및 재가공되었습니다.
          </AppText>
          <AppText style={styles.body}>
            <AppText style={styles.bold}>식물 이미지:</AppText> 본 앱에서 제공하는 식물 이미지의
            대부분은 위키미디어 커먼즈(Wikimedia Commons)의 자료를 활용하여 구성되었습니다. 단,
            원본 데이터의 식물명과 오픈소스 이미지를 매칭하는 작업은 자체적으로 진행되었으므로,
            오픈소스 이미지의 특성상 실제 식물의 특정 품종이나 성장 상태와 외형이 일부 다를 수 있으므로, 정확한 식별은 전문가의 도움을 받으시길 권장합니다. 개별 이미지의 원본 출처,
            저작자 정보 및 상세 라이선스 조항은 각 식물 상세 화면의 이미지에 위치한 'ⓘ 이미지
            출처' 버튼을 탭하여 개별적으로 확인할 수 있습니다.
          </AppText>
        </View>

        {/* 서비스 이용 주의사항 (면책 조항) */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>서비스 이용 주의사항 (면책 조항)</AppText>
          <AppText style={styles.body}>
            본 앱은 ASPCA 데이터를 원본으로 하여 자체적인 데이터 정제(학명·속명 기준 그룹화, 증상
            키워드 요약 등) 과정을 거쳐 정보를 제공합니다. 특히 식물명과 독성 증상 등 일부 정보는
            인공지능(AI)을 활용하여 번역 및 요약되었습니다. AI 번역 및 이미지 매칭 과정에서 기술적
            한계로 인한 오류나 오역이 발생할 수 있으며, 동일 속(Genus)으로 묶인 식물이라도 개별 종에
            따라 독성 여부가 다를 수 있습니다. 제공되는 정보와 이미지는 수의학적 진단 및 전문적인
            식물 식별을 대신할 수 없으므로, 반려동물에게 이상 증상이 발생할 경우 즉시 수의사와
            상담하시기 바랍니다.
          </AppText>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    marginBottom: 12,
  },
  bold: {
    fontWeight: '600',
    color: '#111827',
  },
  linkButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  bottomSpacer: { height: 100 },
});
