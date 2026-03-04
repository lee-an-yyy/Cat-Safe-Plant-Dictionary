import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../theme';

export function AppText({ style, ...props }: TextProps) {
  return <Text style={StyleSheet.flatten([styles.default, style])} {...props} />;
}

const styles = StyleSheet.create({
  default: { fontFamily: FONT_FAMILY },
});
