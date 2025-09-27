"use client";

import { useState, useEffect, useCallback } from "react";

interface IdentificationResult {
  id: string;
  name: string;
  scientificName: string;
  confidence: number;
  description: string;
  image?: string;
  careInstructions?: string;
  commonNames?: string[];
  databaseMatch?: boolean;
  plantId?: number;
  slug?: string;
  fullDescription?: string;
  family?: string;
  genus?: string;
  species?: string;
  heightMin?: number;
  heightMax?: number;
  widthMin?: number;
  widthMax?: number;
  origin?: string;
  distribution?: string;
  uses?: string;
  wildlifeValue?: string;
  edibility?: string;
  flowerDescription?: string;
  leafDescription?: string;
  fruitDescription?: string;
  stemDescription?: string;
  barkDescription?: string;
  poisonSymptoms?: string;
  poisonToxicPrinciple?: string;
  fireRisk?: string;
  flowerSize?: string;
  fruitLength?: string;
  fruitWidth?: string;
  gardenSpaces?: string;
  growthRate?: string;
  leafHairsPresent?: string;
  leafLength?: string;
  leafWidth?: string;
  poisonDermatitis?: string;
  poisonSeverity?: string;
  stemAromatic?: string;
  stemBudScale?: string;
  stemBudTerminal?: string;
  stemBuds?: string;
  stemCrossSection?: string;
  stemForm?: string;
  stemLeafScarShape?: string;
  stemLenticels?: string;
  stemPith?: string;
  stemSurface?: string;
  texture?: string;
  attracts?: string[];
  availableSpaceToPlant?: string[];
  barkAttachment?: string[];
  barkColor?: string[];
  barkPlateShape?: string[];
  designFeatures?: string[];
  flowerBloomTime?: string[];
  flowerColor?: string[];
  flowerInflorescence?: string[];
  flowerPetals?: string[];
  flowerShape?: string[];
  flowerValueToGardener?: string[];
  fruitColor?: string[];
  fruitDisplayHarvestTime?: string[];
  fruitType?: string[];
  fruitValueToGardener?: string[];
  habit?: string[];
  landscapeLocation?: string[];
  landscapeTheme?: string[];
  leafArrangement?: string[];
  leafCharacteristics?: string[];
  leafColor?: string[];
  leafFallColor?: string[];
  leafFeel?: string[];
  leafMargin?: string[];
  leafShape?: string[];
  leafType?: string[];
  leafValueToGardener?: string[];
  lifeCycle?: string[];
  light?: string[];
  maintenance?: string[];
  ncRegion?: string[];
  plantTypes?: string[];
  poisonPart?: string[];
  problems?: string[];
  propagation?: string[];
  resistanceToChallenges?: string[];
  soilDrainage?: string[];
  soilPh?: string[];
  soilTexture?: string[];
  stemColor?: string[];
  tags?: string[];
  usdaZones?: string[];
  lightRequirements?: string;
  waterRequirements?: string;
  usdaHardinessZones?: string;
  images?: Array<{
    id: number | null;
    img: string | null;
    caption?: string | null;
    alt_text?: string | null;
    attribution?: string | null;
  }>;
  plantCardData?: any;
}

interface IdentificationState {
  results: IdentificationResult[] | null;
  uploadedImage: string | null;
  description: string;
  timestamp: number;
  hasImage: boolean; // Reason: Track if image was uploaded without storing the actual image data
}

const STORAGE_KEY = "plant-identification-state";
const STATE_EXPIRY = 30 * 60 * 1000; // 30 minutes

// Reason: Compress image to reduce size before processing
const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Reason: Calculate new dimensions while maintaining aspect ratio
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Reason: Draw and compress the image
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Reason: Custom hook to manage plant identification state persistence across navigation
export function usePlantIdentificationState() {
  const [results, setResults] = useState<IdentificationResult[] | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isRestoringState, setIsRestoringState] = useState(true);

  // Reason: Load state from localStorage on mount
  useEffect(() => {
    const loadState = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const state: IdentificationState = JSON.parse(stored);
          
          // Reason: Check if state is not expired
          if (Date.now() - state.timestamp < STATE_EXPIRY) {
            setResults(state.results);
            // Reason: Don't restore image data from localStorage to avoid quota issues
            setUploadedImage(null);
            setDescription(state.description);
          } else {
            // Reason: Clear expired state
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Error loading plant identification state:", error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsRestoringState(false);
      }
    };

    loadState();
  }, []);

  // Reason: Save state to localStorage whenever it changes, but exclude large image data
  const saveState = useCallback((
    newResults: IdentificationResult[] | null,
    newUploadedImage: string | null,
    newDescription: string
  ) => {
    try {
      const state: IdentificationState = {
        results: newResults,
        uploadedImage: null, // Reason: Don't store image data in localStorage to avoid quota issues
        description: newDescription,
        timestamp: Date.now(),
        hasImage: newUploadedImage !== null, // Reason: Track if image exists without storing it
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving plant identification state:", error);
      // Reason: If localStorage is full, try to clear old data and retry
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        try {
          localStorage.removeItem(STORAGE_KEY);
          // Reason: Retry with minimal data
          const minimalState: IdentificationState = {
            results: newResults,
            uploadedImage: null,
            description: newDescription,
            timestamp: Date.now(),
            hasImage: newUploadedImage !== null,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalState));
        } catch (retryError) {
          console.error("Failed to save state even after clearing localStorage:", retryError);
        }
      }
    }
  }, []);

  // Reason: Update results and persist state
  const updateResults = useCallback((newResults: IdentificationResult[] | null) => {
    setResults(newResults);
    saveState(newResults, uploadedImage, description);
  }, [uploadedImage, description, saveState]);

  // Reason: Update uploaded image and persist state
  const updateUploadedImage = useCallback((newImage: string | null) => {
    setUploadedImage(newImage);
    saveState(results, newImage, description);
  }, [results, description, saveState]);

  // Reason: Handle file upload with compression to reduce localStorage usage
  const handleFileUpload = useCallback(async (file: File) => {
    try {
      // Reason: Validate file type and size
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Image size must be less than 10MB");
      }

      // Reason: Compress image to reduce size
      const compressedImage = await compressImage(file);
      updateUploadedImage(compressedImage);
      return compressedImage;
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  }, [updateUploadedImage]);

  // Reason: Update description and persist state
  const updateDescription = useCallback((newDescription: string) => {
    setDescription(newDescription);
    saveState(results, uploadedImage, newDescription);
  }, [results, uploadedImage, saveState]);

  // Reason: Clear all state
  const clearState = useCallback(() => {
    setResults(null);
    setUploadedImage(null);
    setDescription("");
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Reason: Check if we have any persisted results
  const hasPersistedResults = results !== null && results.length > 0;

  return {
    results,
    uploadedImage,
    description,
    isRestoringState,
    hasPersistedResults,
    updateResults,
    updateUploadedImage,
    updateDescription,
    handleFileUpload,
    clearState,
  };
}
