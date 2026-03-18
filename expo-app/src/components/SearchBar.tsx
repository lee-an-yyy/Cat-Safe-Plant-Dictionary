import React from 'react';
import { View, Pressable, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Search, CircleX } from 'lucide-react-native';

import { AppText } from './AppText';
import { FONT_FAMILY, colors } from '../theme';

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
  onFocus?: () => void;
  onBlur?: () => void;
  style?: ViewStyle;
}

export type SearchBarProps = SearchBarPressableProps | SearchBarInputProps;

export function SearchBar(props: SearchBarProps) {
  const { variant, placeholder = '검색어를 입력하세요.', style } = props;

  const barContent = (
    <>
      <Search size={20} color={colors.gray400} style={styles.searchIcon} />
      {variant === 'pressable' ? (
        <AppText style={styles.placeholder}>{placeholder}</AppText>
      ) : (
        <>
          <TextInput
            ref={props.inputRef}
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={colors.gray400}
            value={props.value}
            onChangeText={props.onChangeText}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
          />
          {props.value.length > 0 && (
            <Pressable
              onPress={() => props.onChangeText('')}
              hitSlop={8}
              style={styles.clearButton}
            >
              <CircleX size={18} color={colors.gray400} />
            </Pressable>
          )}
        </>
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
  placeholder: { color: colors.gray400, fontSize: 16 },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
    fontFamily: FONT_FAMILY,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
});
