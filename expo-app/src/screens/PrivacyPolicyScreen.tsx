import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, BackHandler, Platform, Pressable, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

import { AppBar } from '../components/AppBar';
import { AppText } from '../components/AppText';
import { colors } from '../theme';
import { PRIVACY_POLICY_URL } from '../constants/config';

export function PrivacyPolicyScreen() {
  const navigation = useNavigation();
  const webViewRef = useRef<WebView | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleBack = useCallback(() => {
    if (canGoBack && Platform.OS !== 'web') {
      webViewRef.current?.goBack();
      return true;
    }
    navigation.goBack();
    return true;
  }, [canGoBack, navigation]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => sub.remove();
  }, [handleBack]);

  // Notion 등 SPA에서 onLoadProgress가 1에 도달하지 않는 경우를 위한 타임아웃 폴백
  useEffect(() => {
    const timer = setTimeout(() => setLoadProgress(1), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoadProgress = useCallback(
    ({ nativeEvent }: { nativeEvent: { progress: number } }) => {
      setLoadProgress(nativeEvent.progress);
    },
    []
  );

  const handleNavigationStateChange = useCallback((navState: { canGoBack?: boolean }) => {
    setCanGoBack(Boolean(navState.canGoBack));
  }, []);

  const handleOpenInBrowser = useCallback(() => {
    Linking.openURL(PRIVACY_POLICY_URL);
  }, []);

  // React Native WebView는 웹 플랫폼을 지원하지 않음 → 새 탭에서 열기
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <AppBar title="개인정보 처리방침" showBack onBack={() => navigation.goBack()} />
        <View style={styles.webFallback}>
          <AppText style={styles.webFallbackText}>
            개인정보 처리방침은 새 탭에서 확인할 수 있습니다.
          </AppText>
          <Pressable style={styles.webFallbackBtn} onPress={handleOpenInBrowser}>
            <AppText style={styles.webFallbackBtnText}>새 탭에서 열기</AppText>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar title="개인정보 처리방침" showBack onBack={handleBack} />
      <View style={styles.webviewWrapper}>
        <WebView
          ref={webViewRef as React.RefObject<WebView>}
          source={{ uri: PRIVACY_POLICY_URL }}
          style={styles.webview}
          onLoadProgress={handleLoadProgress}
          onNavigationStateChange={handleNavigationStateChange}
        />
        {loadProgress < 1 && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webviewWrapper: {
    flex: 1,
    position: 'relative',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webFallback: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webFallbackText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  webFallbackBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  webFallbackBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
