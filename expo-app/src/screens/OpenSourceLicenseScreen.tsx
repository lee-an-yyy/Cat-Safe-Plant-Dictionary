import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronDown, ChevronUp, Search } from 'lucide-react-native';

import { AppText } from '../components/AppText';
import { AppBar } from '../components/AppBar';
import { colors } from '../theme';

// Android에서 LayoutAnimation 활성화
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type LicenseEntry = {
  name: string;
  version: string;
  licenses: string;
  copyright?: string;
  publisher?: string;
  licenseText?: string;
  repository?: string;
};

type LicenseItem = {
  id: string;
  data: LicenseEntry;
};

const LICENSES_DATA = require('../../licenses.json') as Record<string, LicenseEntry>;

function parseLicensesData(): LicenseItem[] {
  return Object.entries(LICENSES_DATA)
    .map(([id, data]) => ({
      id,
      data: {
        name: data.name || id.split('@').slice(0, -1).join('@') || id,
        version: data.version || '',
        licenses: data.licenses || 'Unknown',
        copyright: data.copyright,
        publisher: data.publisher,
        licenseText: data.licenseText,
        repository: data.repository,
      },
    }))
    .sort((a, b) => a.data.name.localeCompare(b.data.name, undefined, { sensitivity: 'base' }));
}

const ALL_LICENSE_ITEMS = parseLicensesData();

function LicenseAccordionItem({
  item,
  isExpanded,
  onPress,
}: {
  item: LicenseItem;
  isExpanded: boolean;
  onPress: () => void;
}) {
  const { name, licenses, copyright, publisher, licenseText } = item.data;

  const handlePress = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onPress();
  }, [onPress]);

  const authorInfo = copyright || publisher || null;

  return (
    <View style={styles.accordionItem}>
      <Pressable
        style={({ pressed }) => [styles.accordionHeader, pressed && styles.accordionHeaderPressed]}
        onPress={handlePress}
        android_ripple={{ color: colors.gray200 }}
      >
        <View style={styles.accordionHeaderContent}>
          <AppText style={styles.packageName} numberOfLines={2}>
            {name}
          </AppText>
          <AppText style={styles.licenseType}>{licenses}</AppText>
        </View>
        <View style={styles.chevron}>
          {isExpanded ? (
            <ChevronUp size={22} color={colors.gray500} />
          ) : (
            <ChevronDown size={22} color={colors.gray500} />
          )}
        </View>
      </Pressable>

      {isExpanded && (
        <View style={styles.accordionBody}>
          {authorInfo ? (
            <View style={styles.section}>
              <AppText style={styles.sectionLabel}>저작권자 (Copyright / Publisher)</AppText>
              <AppText style={styles.sectionText}>{authorInfo}</AppText>
            </View>
          ) : null}
          {licenseText ? (
            <View style={styles.section}>
              <AppText style={styles.sectionLabel}>라이선스 전문</AppText>
              <ScrollView
                style={styles.licenseTextScroll}
                nestedScrollEnabled
                showsVerticalScrollIndicator={true}
              >
                <AppText style={styles.licenseText}>{licenseText}</AppText>
              </ScrollView>
            </View>
          ) : (
            <AppText style={styles.noLicenseText}>라이선스 전문을 불러올 수 없습니다.</AppText>
          )}
        </View>
      )}
    </View>
  );
}

export function OpenSourceLicenseScreen() {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ALL_LICENSE_ITEMS;
    return ALL_LICENSE_ITEMS.filter((item) =>
      item.data.name.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleItemPress = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: LicenseItem }) => (
      <LicenseAccordionItem
        item={item}
        isExpanded={expandedId === item.id}
        onPress={() => handleItemPress(item.id)}
      />
    ),
    [expandedId, handleItemPress]
  );

  const keyExtractor = useCallback((item: LicenseItem) => item.id, []);

  const ListHeaderComponent = useMemo(
    () => (
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.gray400} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="패키지 이름으로 검색..."
            placeholderTextColor={colors.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
        <AppText style={styles.resultCount}>
          {filteredItems.length}개 패키지
        </AppText>
      </View>
    ),
    [searchQuery, filteredItems.length]
  );

  const ListFooterComponent = useMemo(() => <View style={styles.footer} />, []);

  return (
    <View style={styles.container}>
      <AppBar title="오픈소스 라이선스" showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        maxToRenderPerBatch={15}
        windowSize={8}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.gray900,
    padding: 0,
  },
  resultCount: {
    fontSize: 13,
    color: colors.gray500,
  },
  accordionItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  accordionHeaderPressed: {
    backgroundColor: colors.gray100,
  },
  accordionHeaderContent: {
    flex: 1,
    marginRight: 12,
  },
  packageName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray900,
    marginBottom: 4,
  },
  licenseType: {
    fontSize: 13,
    color: colors.gray500,
  },
  chevron: {
    marginLeft: 8,
  },
  accordionBody: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingHorizontal: 18,
    paddingVertical: 14,
    paddingBottom: 18,
  },
  section: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray500,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.gray700,
  },
  licenseTextScroll: {
    maxHeight: 220,
  },
  licenseText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.gray700,
    paddingRight: 8,
  },
  noLicenseText: {
    fontSize: 14,
    color: colors.gray500,
    fontStyle: 'italic',
  },
  footer: {
    height: 24,
  },
});
