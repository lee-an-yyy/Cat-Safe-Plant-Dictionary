import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Bookmark, MoreHorizontal } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FONT_FAMILY, STORAGE_KEYS, colors } from '../theme';
import type {
  RootStackParamList,
  MainTabParamList,
  HomeStackParamList,
  SavedStackParamList,
} from './types';
import { OnboardingDisclaimerScreen } from '../screens/OnboardingDisclaimerScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { PlantDetailScreen } from '../screens/PlantDetailScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { ServiceInfoScreen } from '../screens/ServiceInfoScreen';
import { CustomerSupportScreen } from '../screens/CustomerSupportScreen';
import { WebViewScreen } from '../screens/WebViewScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';
import { TermsOfServiceScreen } from '../screens/TermsOfServiceScreen';
import { OpenSourceLicenseScreen } from '../screens/OpenSourceLicenseScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();
const SavedStackNav = createNativeStackNavigator<SavedStackParamList>();

const stackScreenOptions = { headerShown: false };

function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={stackScreenOptions}>
      <HomeStackNav.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStackNav.Screen name="PlantDetail" component={PlantDetailScreen} />
    </HomeStackNav.Navigator>
  );
}

function SavedStack() {
  return (
    <SavedStackNav.Navigator screenOptions={stackScreenOptions}>
      <SavedStackNav.Screen name="SavedScreen" component={SavedScreen} />
      <SavedStackNav.Screen name="PlantDetail" component={PlantDetailScreen} />
    </SavedStackNav.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.gray200 },
        tabBarLabelStyle: { fontFamily: FONT_FAMILY },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Home', {
              screen: 'HomeScreen',
              params: { resetSearch: true },
            });
          },
        })}
      />
      <Tab.Screen
        name="Saved"
        component={SavedStack}
        options={{
          tabBarLabel: '저장',
          tabBarIcon: ({ color, size }) => <Bookmark size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel: '더보기',
          tabBarIcon: ({ color, size }) => <MoreHorizontal size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const [hasAgreed, setHasAgreed] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.DISCLAIMER_AGREED)
      .then((val) => setHasAgreed(val === 'true'))
      .catch(() => setHasAgreed(false));
  }, []);

  if (hasAgreed === null) return null;

  const initialRoute = hasAgreed ? 'Main' : 'OnboardingDisclaimer';

  return (
    <RootStack.Navigator
      key={initialRoute}
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <RootStack.Screen name="OnboardingDisclaimer" component={OnboardingDisclaimerScreen} />
      <RootStack.Screen name="Main" component={MainTabs} />
      <RootStack.Screen name="ServiceInfo" component={ServiceInfoScreen} />
      <RootStack.Screen name="CustomerSupport" component={CustomerSupportScreen} />
      <RootStack.Screen name="WebView" component={WebViewScreen} />
      <RootStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <RootStack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <RootStack.Screen name="OpenSourceLicense" component={OpenSourceLicenseScreen} />
    </RootStack.Navigator>
  );
}
