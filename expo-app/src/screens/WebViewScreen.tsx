import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Pressable, BackHandler, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { ArrowLeft, X } from 'lucide-react-native';

import { AppText } from '../components/AppText';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type WebViewRouteProp = RouteProp<RootStackParamList, 'WebView'>;

function getOrigin(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

function isExternalOrSpecial(url: string, allowedOrigin: string | null): boolean {
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return true;
  try {
    const requestOrigin = new URL(url).origin;
    return allowedOrigin !== null && requestOrigin !== allowedOrigin;
  } catch {
    return false;
  }
}

export function WebViewScreen() {
  const navigation = useNavigation();
  const route = useRoute<WebViewRouteProp>();
  const { url, title } = route.params ?? { url: '', title: '' };

  const webViewRef = useRef<WebView>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const allowedOrigin = getOrigin(url);

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

  const onShouldStartLoadWithRequest = useCallback(
    (request: { url: string; navigationType?: string }) => {
      const { url: requestUrl } = request;
      if (isExternalOrSpecial(requestUrl, allowedOrigin)) {
        Linking.openURL(requestUrl).catch(() => {});
        return false;
      }
      return true;
    },
    [allowedOrigin]
  );

  const handleLoadProgress = useCallback(
    ({ nativeEvent }: { nativeEvent: { progress: number } }) => {
      setLoadProgress(nativeEvent.progress);
    },
    []
  );

  const handleNavigationStateChange = useCallback((navState: { canGoBack?: boolean }) => {
    setCanGoBack(Boolean(navState.canGoBack));
  }, []);

  if (!url) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.centered}>
          <AppText style={styles.errorText}>표시할 주소가 없습니다.</AppText>
          <Pressable style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <AppText style={styles.closeBtnText}>닫기</AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // React Native WebView는 웹 플랫폼을 지원하지 않음 → 새 탭에서 열기
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()} hitSlop={8}>
              <ArrowLeft size={24} color="#111827" />
            </Pressable>
            <AppText style={styles.headerTitle} numberOfLines={1}>
              {title || '웹 보기'}
            </AppText>
            <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()} hitSlop={8}>
              <X size={24} color="#111827" />
            </Pressable>
          </View>
          <View style={styles.centered}>
            <AppText style={styles.webFallbackText}>
              링크는 새 탭에서 열립니다.
            </AppText>
            <Pressable
              style={styles.webFallbackBtn}
              onPress={() => Linking.openURL(url)}
            >
              <AppText style={styles.webFallbackBtnText}>새 탭에서 열기</AppText>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* 커스텀 헤더 */}
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={handleBack} hitSlop={8}>
            <ArrowLeft size={24} color="#111827" />
          </Pressable>
          <AppText style={styles.headerTitle} numberOfLines={1}>
            {title || '웹 보기'}
          </AppText>
          <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()} hitSlop={8}>
            <X size={24} color="#111827" />
          </Pressable>
        </View>

        {/* 로딩 프로그레스 바 */}
        {loadProgress < 1 && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${loadProgress * 100}%` }]} />
          </View>
        )}

        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={styles.webview}
          onLoadProgress={handleLoadProgress}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          startInLoadingState
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  progressTrack: {
    height: 2,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
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
  closeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});
