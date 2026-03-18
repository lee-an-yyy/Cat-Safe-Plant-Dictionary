/** 앱 전역 폰트 (App.tsx에서 useFonts로 로드한 이름과 동일해야 함) */
export const FONT_FAMILY = 'IBM-Regular';

/** 앱 전역 색상 */
export const colors = {
  // Primary
  primary: '#27AE60',
  /** 헤더/버튼용 (primary보다 약간 밝은 톤) */
  primaryHeader: '#43AB7C',

  // Danger
  danger: '#E74C3C',
  dangerDark: '#941919', // 치명적: 위험보다 더 어두운 레드로 구분

  // Neutral (초록 계열과 조화로운 웜 그레이-그린)
  neutral: '#5F6B5D',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',

  // Semantic
  white: '#fff',
} as const;

/** AsyncStorage 키 */
export const STORAGE_KEYS = {
  DISCLAIMER_AGREED: 'DISCLAIMER_AGREED',
  SAVED_PLANTS: 'savedPlants',
  SHOW_ENGLISH_ORIGINAL: 'showEnglishOriginal',
} as const;
