import { relations } from "drizzle-orm/relations";
import { fireRiskLookup, mainPlantData, flowerSizeLookup, fruitLengthLookup, fruitWidthLookup, gardenSpacesLookup, growthRateLookup, leafHairsPresentLookup, leafLengthLookup, leafWidthLookup, poisonDermatitisLookup, poisonSeverityLookup, stemAromaticLookup, stemBudScalesLookup, stemBudTerminalLookup, stemBudsLookup, stemCrossSectionLookup, stemFormLookup, stemLeafScarShapeLookup, stemLenticelsLookup, stemPithLookup, stemSurfaceLookup, textureLookup, plantImages, cultivars, userGardens, maintenanceLookup, userPlants } from "./schema";

export const mainPlantDataRelations = relations(mainPlantData, ({one, many}) => ({
	fireRiskLookup: one(fireRiskLookup, {
		fields: [mainPlantData.fireRiskId],
		references: [fireRiskLookup.id]
	}),
	flowerSizeLookup: one(flowerSizeLookup, {
		fields: [mainPlantData.flowerSizeId],
		references: [flowerSizeLookup.id]
	}),
	fruitLengthLookup: one(fruitLengthLookup, {
		fields: [mainPlantData.fruitLengthId],
		references: [fruitLengthLookup.id]
	}),
	fruitWidthLookup: one(fruitWidthLookup, {
		fields: [mainPlantData.fruitWidthId],
		references: [fruitWidthLookup.id]
	}),
	gardenSpacesLookup: one(gardenSpacesLookup, {
		fields: [mainPlantData.gardenSpacesId],
		references: [gardenSpacesLookup.id]
	}),
	growthRateLookup: one(growthRateLookup, {
		fields: [mainPlantData.growthRateId],
		references: [growthRateLookup.id]
	}),
	leafHairsPresentLookup: one(leafHairsPresentLookup, {
		fields: [mainPlantData.leafHairsPresentId],
		references: [leafHairsPresentLookup.id]
	}),
	leafLengthLookup: one(leafLengthLookup, {
		fields: [mainPlantData.leafLengthId],
		references: [leafLengthLookup.id]
	}),
	leafWidthLookup: one(leafWidthLookup, {
		fields: [mainPlantData.leafWidthId],
		references: [leafWidthLookup.id]
	}),
	poisonDermatitisLookup: one(poisonDermatitisLookup, {
		fields: [mainPlantData.poisonDermatitisId],
		references: [poisonDermatitisLookup.id]
	}),
	poisonSeverityLookup: one(poisonSeverityLookup, {
		fields: [mainPlantData.poisonSeverityId],
		references: [poisonSeverityLookup.id]
	}),
	stemAromaticLookup: one(stemAromaticLookup, {
		fields: [mainPlantData.stemAromaticId],
		references: [stemAromaticLookup.id]
	}),
	stemBudScalesLookup: one(stemBudScalesLookup, {
		fields: [mainPlantData.stemBudScaleId],
		references: [stemBudScalesLookup.id]
	}),
	stemBudTerminalLookup: one(stemBudTerminalLookup, {
		fields: [mainPlantData.stemBudTerminalId],
		references: [stemBudTerminalLookup.id]
	}),
	stemBudsLookup: one(stemBudsLookup, {
		fields: [mainPlantData.stemBudsId],
		references: [stemBudsLookup.id]
	}),
	stemCrossSectionLookup: one(stemCrossSectionLookup, {
		fields: [mainPlantData.stemCrossSectionId],
		references: [stemCrossSectionLookup.id]
	}),
	stemFormLookup: one(stemFormLookup, {
		fields: [mainPlantData.stemFormId],
		references: [stemFormLookup.id]
	}),
	stemLeafScarShapeLookup: one(stemLeafScarShapeLookup, {
		fields: [mainPlantData.stemLeafScarShapeId],
		references: [stemLeafScarShapeLookup.id]
	}),
	stemLenticelsLookup: one(stemLenticelsLookup, {
		fields: [mainPlantData.stemLenticelsId],
		references: [stemLenticelsLookup.id]
	}),
	stemPithLookup: one(stemPithLookup, {
		fields: [mainPlantData.stemPithId],
		references: [stemPithLookup.id]
	}),
	stemSurfaceLookup: one(stemSurfaceLookup, {
		fields: [mainPlantData.stemSurfaceId],
		references: [stemSurfaceLookup.id]
	}),
	textureLookup: one(textureLookup, {
		fields: [mainPlantData.textureId],
		references: [textureLookup.id]
	}),
	plantImages: many(plantImages),
	cultivars: many(cultivars),
}));

export const fireRiskLookupRelations = relations(fireRiskLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const flowerSizeLookupRelations = relations(flowerSizeLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const fruitLengthLookupRelations = relations(fruitLengthLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const fruitWidthLookupRelations = relations(fruitWidthLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const gardenSpacesLookupRelations = relations(gardenSpacesLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const growthRateLookupRelations = relations(growthRateLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
	userGardens: many(userGardens),
}));

export const leafHairsPresentLookupRelations = relations(leafHairsPresentLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const leafLengthLookupRelations = relations(leafLengthLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const leafWidthLookupRelations = relations(leafWidthLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const poisonDermatitisLookupRelations = relations(poisonDermatitisLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const poisonSeverityLookupRelations = relations(poisonSeverityLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const stemAromaticLookupRelations = relations(stemAromaticLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const stemBudScalesLookupRelations = relations(stemBudScalesLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const stemBudTerminalLookupRelations = relations(stemBudTerminalLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const stemBudsLookupRelations = relations(stemBudsLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const stemCrossSectionLookupRelations = relations(stemCrossSectionLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const stemFormLookupRelations = relations(stemFormLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const stemLeafScarShapeLookupRelations = relations(stemLeafScarShapeLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const stemLenticelsLookupRelations = relations(stemLenticelsLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const stemPithLookupRelations = relations(stemPithLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const stemSurfaceLookupRelations = relations(stemSurfaceLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
}));

export const textureLookupRelations = relations(textureLookup, ({many}) => ({
	mainPlantData: many(mainPlantData),
	userGardens: many(userGardens),
}));

export const plantImagesRelations = relations(plantImages, ({one}) => ({
	mainPlantDatum: one(mainPlantData, {
		fields: [plantImages.plantId],
		references: [mainPlantData.id]
	}),
}));

export const cultivarsRelations = relations(cultivars, ({one}) => ({
	mainPlantDatum: one(mainPlantData, {
		fields: [cultivars.plantId],
		references: [mainPlantData.id]
	}),
}));

export const userGardensRelations = relations(userGardens, ({one, many}) => ({
	growthRateLookup: one(growthRateLookup, {
		fields: [userGardens.growthRateId],
		references: [growthRateLookup.id]
	}),
	maintenanceLookup: one(maintenanceLookup, {
		fields: [userGardens.maintenanceLevelId],
		references: [maintenanceLookup.id]
	}),
	textureLookup: one(textureLookup, {
		fields: [userGardens.texturePreferenceId],
		references: [textureLookup.id]
	}),
	userPlantss: many(userPlants),
}));

export const maintenanceLookupRelations = relations(maintenanceLookup, ({many}) => ({
	userGardens: many(userGardens),
}));

export const userPlantsRelations = relations(userPlants, ({one}) => ({
	userGarden: one(userGardens, {
		fields: [userPlants.gardenId],
		references: [userGardens.id]
	}),
}));