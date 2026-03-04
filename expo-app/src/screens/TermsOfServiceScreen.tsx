import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

import { AppBar } from '../components/AppBar';

const TERMS_URL =
  'https://www.notion.so/Terms-of-Service-30f894bc9b408050bab4e46f89efd214?source=copy_link';

export function TermsOfServiceScreen() {
  const navigation = useNavigation();
  const webViewRef = useRef<WebView>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleBack = useCallback(() => {
    if (canGoBack) {
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

  return (
    <View style={styles.container}>
      <AppBar title="전체 약관" showBack onBack={handleBack} />
      <View style={styles.webviewWrapper}>
        <WebView
          ref={webViewRef}
          source={{ uri: TERMS_URL }}
          style={styles.webview}
          onLoadProgress={handleLoadProgress}
          onNavigationStateChange={handleNavigationStateChange}
        />
        {loadProgress < 1 && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#3B82F6" />
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
});
