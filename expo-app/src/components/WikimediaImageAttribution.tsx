import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Linking, Pressable } from 'react-native';
import { Info } from 'lucide-react-native';
import { AppText } from './AppText';

export interface WikimediaImageAttributionProps {
  imageAuthor?: string;
  imageSourceUrl?: string;
  imageLicense?: string;
  imageLicenseUrl?: string;
}

/**
 * 위키미디어 이미지 출처 표기 컴포넌트.
 * 이미지 영역 우측 하단에 'ⓘ 출처' 버튼을 오버레이하고,
 * 탭 시 모달에서 출처 정보를 표시합니다.
 */
export function WikimediaImageAttribution({
  imageAuthor,
  imageSourceUrl,
  imageLicense,
  imageLicenseUrl,
}: WikimediaImageAttributionProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const hasAttribution = imageAuthor || imageSourceUrl || imageLicense || imageLicenseUrl;
  if (!hasAttribution) return null;

  const handleOpenSource = () => {
    if (imageSourceUrl?.trim()) {
      Linking.openURL(imageSourceUrl.trim());
    }
  };

  const handleOpenLicense = () => {
    if (imageLicenseUrl?.trim()) {
      Linking.openURL(imageLicenseUrl.trim());
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.attributionButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Info size={14} color="#fff" />
        <AppText style={styles.attributionButtonText}>이미지 출처</AppText>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <AppText style={styles.modalTitle}>이미지 출처</AppText>
            <View style={styles.attributionTextContainer}>
              <AppText style={styles.attributionText}>사진: </AppText>
              <AppText style={styles.attributionText}>{imageAuthor ?? '—'}</AppText>
              <AppText style={styles.attributionText}> / </AppText>
              {imageSourceUrl?.trim() ? (
                <AppText style={styles.attributionLink} onPress={handleOpenSource}>
                  위키미디어 커먼즈
                </AppText>
              ) : (
                <AppText style={styles.attributionText}>위키미디어 커먼즈</AppText>
              )}
              <AppText style={styles.attributionText}> / </AppText>
              {imageLicenseUrl?.trim() ? (
                <AppText style={styles.attributionLink} onPress={handleOpenLicense}>
                  {imageLicense ?? '라이선스'}
                </AppText>
              ) : (
                <AppText style={styles.attributionText}>{imageLicense ?? '—'}</AppText>
              )}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <AppText style={styles.closeButtonText}>닫기</AppText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  attributionButton: {
    position: 'absolute',
    bottom: 34,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  attributionButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  attributionTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 24,
  },
  attributionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  attributionLink: {
    fontSize: 14,
    color: '#3B82F6',
    textDecorationLine: 'underline',
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});
