import React from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AppText } from '../components/AppText';
import { AppBar } from '../components/AppBar';
import { colors } from '../theme';

const NOTION_URL = 'https://www.notion.so/323894bc9b4080aab703c163be413f92?source=copy_link';

export function CreatorStoryScreen() {
  const navigation = useNavigation();

  const handleOpenInNewTab = () => {
    Linking.openURL(NOTION_URL).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <AppBar title="제작 이야기" showBack onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <AppText style={styles.message}>
          묘생식물대사전 제작이야기는 새 탭에서 확인할 수 있습니다.
        </AppText>
        <Pressable style={styles.button} onPress={handleOpenInNewTab}>
          <AppText style={styles.buttonText}>새 탭에서 열기</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
