import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet, ImageProps } from 'react-native';

import { colors } from '../theme';

export function ImageWithFallback({
  source,
  style,
  ...rest
}: ImageProps & { source: { uri: string } }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [source.uri]);

  if (hasError) {
    return <View style={[styles.placeholder, style]} />;
  }

  return <Image source={source} style={style} onError={() => setHasError(true)} {...rest} />;
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.gray200,
  },
});
