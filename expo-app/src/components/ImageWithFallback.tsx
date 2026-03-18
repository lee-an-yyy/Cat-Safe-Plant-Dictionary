import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet, ImageProps } from 'react-native';

import { colors } from '../theme';
import type { PlantImageSource } from '../data/plantV22Types';

/** source: { uri: string } | number (require 결과) - 원격 URL 또는 로컬 번들 이미지 */
type ImageWithFallbackProps = Omit<ImageProps, 'source'> & { source: PlantImageSource };

export function ImageWithFallback({
  source,
  style,
  ...rest
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const sourceKey = typeof source === 'number' ? source : source?.uri ?? '';

  useEffect(() => {
    setHasError(false);
  }, [sourceKey]);

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
