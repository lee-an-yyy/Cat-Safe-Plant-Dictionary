export type PlantDetailParams = { plantId?: string; genus?: string };

export type MainTabParamList = {
  Home:
    | undefined
    | { screen: 'HomeScreen'; params?: { resetSearch?: boolean } };
  Saved: undefined;
  More: undefined;
};

export type HomeStackParamList = {
  HomeScreen: { resetSearch?: boolean };
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
      PlantDetail: PlantDetailParams;
      Home: undefined;
      Saved: undefined;
      More: undefined;
    }
  }
}
