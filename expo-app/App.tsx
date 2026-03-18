import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';

import './src/navigation/types';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { SavedPlantsProvider } from './src/context/SavedPlantsContext';
import { EnglishOriginalPreferenceProvider } from './src/context/EnglishOriginalPreferenceContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { IBMPlexSansKR_400Regular } from '@expo-google-fonts/ibm-plex-sans-kr';

export default function App() {
  const [fontsLoaded] = useFonts({
    'IBM-Regular': IBMPlexSansKR_400Regular,
  });

  if (!fontsLoaded) return null; // 폰트 로딩 전까지 화면을 띄우지 않음

  return (
    <ErrorBoundary>
      <SavedPlantsProvider>
        <EnglishOriginalPreferenceProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </EnglishOriginalPreferenceProvider>
      </SavedPlantsProvider>
    </ErrorBoundary>
  );
}
