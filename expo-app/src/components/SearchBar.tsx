import React from 'react';
import { View, Pressable, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Search } from 'lucide-react-native';

import { AppText } from './AppText';
import { FONT_FAMILY } from '../theme';

export interface SearchBarPressableProps {
  variant: 'pressable';
  placeholder?: string;
  onPress: () => void;
  style?: ViewStyle;
}

export interface SearchBarInputProps {
  variant: 'input';
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  inputRef?: React.Ref<TextInput>;
  style?: ViewStyle;
}

export type SearchBarProps = SearchBarPressableProps | SearchBarInputProps;

export function SearchBar(props: SearchBarProps) {
  const { variant, placeholder = '검색어를 입력하세요.', style } = props;

  const barContent = (
    <>
      <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
      {variant === 'pressable' ? (
        <AppText style={styles.placeholder}>{placeholder}</AppText>
      ) : (
        <TextInput
          ref={props.inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={props.value}
          onChangeText={props.onChangeText}
        />
      )}
    </>
  );

  if (variant === 'pressable') {
    return (
      <Pressable style={[styles.container, style]} onPress={props.onPress}>
        {barContent}
      </Pressable>
    );
  }

  return <View style={[styles.container, style]}>{barContent}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: { marginRight: 12 },
  placeholder: { color: '#9CA3AF', fontSize: 16 },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
    fontFamily: FONT_FAMILY,
  },
});
