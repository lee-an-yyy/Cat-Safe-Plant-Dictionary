import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../theme';

interface SavedPlantsContextType {
  savedPlantIds: string[];
  toggleSavedPlant: (plantId: string) => void;
  isPlantSaved: (plantId: string) => boolean;
}

const SavedPlantsContext = createContext<SavedPlantsContextType | undefined>(undefined);

export function SavedPlantsProvider({ children }: { children: ReactNode }) {
  const [savedPlantIds, setSavedPlantIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.SAVED_PLANTS)
      .then((saved) => {
        if (saved) {
          try {
            setSavedPlantIds(JSON.parse(saved));
          } catch {
            setSavedPlantIds([]);
          }
        }
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, []);

  // Persist to AsyncStorage whenever savedPlantIds changes (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEYS.SAVED_PLANTS, JSON.stringify(savedPlantIds));
  }, [savedPlantIds, isLoaded]);

  const toggleSavedPlant = (plantId: string) => {
    setSavedPlantIds((prev) =>
      prev.includes(plantId) ? prev.filter((id) => id !== plantId) : [...prev, plantId]
    );
  };

  const isPlantSaved = (plantId: string) => savedPlantIds.includes(plantId);

  return (
    <SavedPlantsContext.Provider value={{ savedPlantIds, toggleSavedPlant, isPlantSaved }}>
      {children}
    </SavedPlantsContext.Provider>
  );
}

export function useSavedPlants() {
  const context = useContext(SavedPlantsContext);
  if (context === undefined) {
    throw new Error('useSavedPlants must be used within a SavedPlantsProvider');
  }
  return context;
}
