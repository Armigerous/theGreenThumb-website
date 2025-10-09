import { describe, it, expect } from 'vitest';
import { needsCare, getCareStatusColor, getCareStatusText, userPlants } from '../garden';

/**
 * Garden Helper Functions Test Suite
 * 
 * Reason: Test the helper functions for plant care status
 * to ensure they work correctly with different plant states
 */
describe('Garden Helper Functions', () => {
  describe('needsCare', () => {
    it('should return true for plants with no care logs', () => {
      // Reason: Test that plants without care logs are marked as needing care
      const plantWithoutCareLogs: userPlants = {
        id: 'plant-1',
        gardenId: 1,
        customName: 'Test Plant',
        botanicalName: 'Testus plantus',
        status: 'healthy',
        careLogs: [],
        images: [],
        locationTags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(needsCare(plantWithoutCareLogs)).toBe(true);
    });

    it('should return true for plants with old care logs', () => {
      // Reason: Test that plants with care logs older than 7 days need care
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10); // 10 days ago

      const plantWithOldCareLogs: userPlants = {
        id: 'plant-2',
        gardenId: 1,
        customName: 'Test Plant',
        botanicalName: 'Testus plantus',
        status: 'healthy',
        careLogs: [
          {
            date: oldDate,
            type: 'water',
            notes: 'Watered plant',
          },
        ],
        images: [],
        locationTags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(needsCare(plantWithOldCareLogs)).toBe(true);
    });

    it('should return false for plants with recent care logs', () => {
      // Reason: Test that plants with recent care logs don't need care
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 3); // 3 days ago

      const plantWithRecentCareLogs: userPlants = {
        id: 'plant-3',
        gardenId: 1,
        customName: 'Test Plant',
        botanicalName: 'Testus plantus',
        status: 'healthy',
        careLogs: [
          {
            date: recentDate,
            type: 'water',
            notes: 'Watered plant',
          },
        ],
        images: [],
        locationTags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(needsCare(plantWithRecentCareLogs)).toBe(false);
    });
  });

  describe('getCareStatusColor', () => {
    it('should return red color for critical plants', () => {
      // Reason: Test that critical plants get red status color
      const criticalPlant: userPlants = {
        id: 'plant-4',
        gardenId: 1,
        customName: 'Critical Plant',
        botanicalName: 'Criticalus plantus',
        status: 'critical',
        careLogs: [],
        images: [],
        locationTags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(getCareStatusColor(criticalPlant)).toBe('text-red-600 bg-red-50');
    });

    it('should return yellow color for warning plants', () => {
      // Reason: Test that warning plants get yellow status color
      const warningPlant: userPlants = {
        id: 'plant-5',
        gardenId: 1,
        customName: 'Warning Plant',
        botanicalName: 'Warningus plantus',
        status: 'warning',
        careLogs: [],
        images: [],
        locationTags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(getCareStatusColor(warningPlant)).toBe('text-yellow-600 bg-yellow-50');
    });

    it('should return green color for healthy plants', () => {
      // Reason: Test that healthy plants get green status color
      const healthyPlant: userPlants = {
        id: 'plant-6',
        gardenId: 1,
        customName: 'Healthy Plant',
        botanicalName: 'Healthyus plantus',
        status: 'healthy',
        careLogs: [
          {
            date: new Date(),
            type: 'water',
            notes: 'Recently watered',
          },
        ],
        images: [],
        locationTags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(getCareStatusColor(healthyPlant)).toBe('text-green-600 bg-green-50');
    });
  });

  describe('getCareStatusText', () => {
    it('should return correct status text for different plant states', () => {
      // Reason: Test that status text is correctly returned for different plant states
      const criticalPlant: userPlants = {
        id: 'plant-7',
        gardenId: 1,
        customName: 'Critical Plant',
        botanicalName: 'Criticalus plantus',
        status: 'critical',
        careLogs: [],
        images: [],
        locationTags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const warningPlant: userPlants = {
        id: 'plant-8',
        gardenId: 1,
        customName: 'Warning Plant',
        botanicalName: 'Warningus plantus',
        status: 'warning',
        careLogs: [],
        images: [],
        locationTags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const healthyPlant: userPlants = {
        id: 'plant-9',
        gardenId: 1,
        customName: 'Healthy Plant',
        botanicalName: 'Healthyus plantus',
        status: 'healthy',
        careLogs: [
          {
            date: new Date(),
            type: 'water',
            notes: 'Recently watered',
          },
        ],
        images: [],
        locationTags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(getCareStatusText(criticalPlant)).toBe('Critical');
      expect(getCareStatusText(warningPlant)).toBe('Warning');
      expect(getCareStatusText(healthyPlant)).toBe('Healthy');
    });
  });
});
