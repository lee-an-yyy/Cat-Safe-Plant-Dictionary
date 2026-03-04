import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../theme';

interface EnglishOriginalPreferenceContextType {
  /** 영어 원문 표시 여부. true = 열림(기본), false = 닫힘 */
  showEnglish: boolean;
  setShowEnglish: (value: boolean | ((prev: boolean) => boolean)) => void;
}

const EnglishOriginalPreferenceContext = createContext<
  EnglishOriginalPreferenceContextType | undefined
>(undefined);

export function EnglishOriginalPreferenceProvider({ children }: { children: ReactNode }) {
  const [showEnglish, setShowEnglishState] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.SHOW_ENGLISH_ORIGINAL)
      .then((stored) => {
        if (stored !== null) {
          setShowEnglishState(stored === 'true');
        }
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEYS.SHOW_ENGLISH_ORIGINAL, String(showEnglish));
  }, [showEnglish, isLoaded]);

  const setShowEnglish = (value: boolean | ((prev: boolean) => boolean)) => {
    setShowEnglishState((prev) => (typeof value === 'function' ? value(prev) : value));
  };

  return (
    <EnglishOriginalPreferenceContext.Provider value={{ showEnglish, setShowEnglish }}>
      {children}
    </EnglishOriginalPreferenceContext.Provider>
  );
}

export function useEnglishOriginalPreference() {
  const context = useContext(EnglishOriginalPreferenceContext);
  if (context === undefined) {
    throw new Error('useEnglishOriginalPreference must be used within EnglishOriginalPreferenceProvider');
  }
  return context;
}
