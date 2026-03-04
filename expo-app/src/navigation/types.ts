export type PlantDetailParams = { plantId?: string; genus?: string };

export type DictionaryStackParamList = {
  PlantList: { status?: 'safe' | 'danger'; genus?: string; reset?: boolean };
  PlantDetail: PlantDetailParams;
};

export type MainTabParamList = {
  Home: undefined;
  Dictionary: {
    screen?: keyof DictionaryStackParamList;
    params?: DictionaryStackParamList[keyof DictionaryStackParamList];
    status?: 'safe' | 'danger';
    genus?: string;
    state?: { index: number; routes: Array<{ name: string; params?: object }> };
  };
  Saved: undefined;
  More: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  PlantDetail: PlantDetailParams;
};

export type SavedStackParamList = {
  SavedScreen: undefined;
  PlantDetail: PlantDetailParams;
};

export type RootStackParamList = {
  OnboardingDisclaimer: undefined;
  Main:
    | undefined
    | { screen: keyof MainTabParamList; params?: MainTabParamList[keyof MainTabParamList] };
  ServiceInfo: undefined;
  CustomerSupport: undefined;
  WebView: { url: string; title: string };
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  OpenSourceLicense: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
      // 중첩 탭/스택 화면 - useNavigation() 타입에 포함
      Dictionary: MainTabParamList['Dictionary'];
      PlantDetail: PlantDetailParams;
      PlantList: DictionaryStackParamList['PlantList'];
      Home: undefined;
      Saved: undefined;
      More: undefined;
    }
  }
}
