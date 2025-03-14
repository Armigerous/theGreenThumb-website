import { pgTable, pgPolicy, bigint, text, index, foreignKey, unique, serial, integer, jsonb, smallint, bigserial, timestamp, boolean, vector, varchar, pgMaterializedView } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const landscapeLocationLookup = pgTable("landscape_location_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const stemSurfaceLookup = pgTable("stem_surface_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const stemBudScalesLookup = pgTable("stem_bud_scales_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const flowerInflorescenceLookup = pgTable("flower_inflorescence_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const plantTypesLookup = pgTable("plant_types_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const tagsLookup = pgTable("tags_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const emails = pgTable("emails", {
	email: text().primaryKey().notNull(),
}, () => [
	pgPolicy("Allow insert for everyone", { as: "permissive", for: "insert", to: ["anon"], withCheck: sql`true`  }),
]);

export const leafColorLookup = pgTable("leaf_color_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const soilPhLookup = pgTable("soil_ph_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const leafMarginLookup = pgTable("leaf_margin_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const fruitLengthLookup = pgTable("fruit_length_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const leafFeelLookup = pgTable("leaf_feel_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const landscapeThemeLookup = pgTable("landscape_theme_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const barkColorLookup = pgTable("bark_color_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const growthRateLookup = pgTable("growth_rate_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const soilDrainageLookup = pgTable("soil_drainage_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const flowerValueToGardenerLookup = pgTable("flower_value_to_gardener_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const mainPlantData = pgTable("main_plant_data", {
	id: serial().primaryKey().notNull(),
	slug: text().notNull(),
	scientificName: text("scientific_name").notNull(),
	genus: text(),
	species: text(),
	family: text(),
	soundFile: text("sound_file"),
	phoneticSpelling: text("phonetic_spelling"),
	profileVideo: text("profile_video"),
	description: text(),
	origin: text(),
	distribution: text(),
	uses: text(),
	wildlifeValue: text("wildlife_value"),
	edibility: text(),
	flowerDescription: text("flower_description"),
	leafDescription: text("leaf_description"),
	fruitDescription: text("fruit_description"),
	stemDescription: text("stem_description"),
	barkDescription: text("bark_description"),
	poisonSymptoms: text("poison_symptoms"),
	poisonToxicPrinciple: text("poison_toxic_principle"),
	heightMax: integer("height_max"),
	heightMin: integer("height_min"),
	widthMax: integer("width_max"),
	widthMin: integer("width_min"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fireRiskId: bigint("fire_risk_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	flowerSizeId: bigint("flower_size_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fruitLengthId: bigint("fruit_length_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fruitWidthId: bigint("fruit_width_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gardenSpacesId: bigint("garden_spaces_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	growthRateId: bigint("growth_rate_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	leafHairsPresentId: bigint("leaf_hairs_present_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	leafLengthId: bigint("leaf_length_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	leafWidthId: bigint("leaf_width_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	poisonDermatitisId: bigint("poison_dermatitis_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	poisonSeverityId: bigint("poison_severity_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stemAromaticId: bigint("stem_aromatic_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stemBudScaleId: bigint("stem_bud_scale_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stemBudTerminalId: bigint("stem_bud_terminal_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stemBudsId: bigint("stem_buds_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stemCrossSectionId: bigint("stem_cross_section_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stemFormId: bigint("stem_form_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stemLeafScarShapeId: bigint("stem_leaf_scar_shape_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stemLenticelsId: bigint("stem_lenticels_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stemPithId: bigint("stem_pith_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stemSurfaceId: bigint("stem_surface_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	textureId: bigint("texture_id", { mode: "number" }),
	attractsIds: jsonb("attracts_ids").default([]),
	availableSpaceToPlantIds: jsonb("available_space_to_plant_ids").default([]),
	barkAttachmentIds: jsonb("bark_attachment_ids").default([]),
	barkColorIds: jsonb("bark_color_ids").default([]),
	barkPlateShapeIds: jsonb("bark_plate_shape_ids").default([]),
	designFeatureIds: jsonb("design_feature_ids").default([]),
	flowerBloomTimeIds: jsonb("flower_bloom_time_ids").default([]),
	flowerColorIds: jsonb("flower_color_ids").default([]),
	flowerInflorescenceIds: jsonb("flower_inflorescence_ids").default([]),
	flowerPetalsIds: jsonb("flower_petals_ids").default([]),
	flowerShapeIds: jsonb("flower_shape_ids").default([]),
	flowerValueToGardenerIds: jsonb("flower_value_to_gardener_ids").default([]),
	fruitColorIds: jsonb("fruit_color_ids").default([]),
	fruitDisplayHarvestTimeIds: jsonb("fruit_display_harvest_time_ids").default([]),
	fruitTypeIds: jsonb("fruit_type_ids").default([]),
	fruitValueToGardenerIds: jsonb("fruit_value_to_gardener_ids").default([]),
	habitIds: jsonb("habit_ids").default([]),
	landscapeLocationIds: jsonb("landscape_location_ids").default([]),
	landscapeThemeIds: jsonb("landscape_theme_ids").default([]),
	leafArrangementIds: jsonb("leaf_arrangement_ids").default([]),
	leafCharacteristicsIds: jsonb("leaf_characteristics_ids").default([]),
	leafColorIds: jsonb("leaf_color_ids").default([]),
	leafFallColorIds: jsonb("leaf_fall_color_ids").default([]),
	leafFeelIds: jsonb("leaf_feel_ids").default([]),
	leafMarginIds: jsonb("leaf_margin_ids").default([]),
	leafShapeIds: jsonb("leaf_shape_ids").default([]),
	leafTypeIds: jsonb("leaf_type_ids").default([]),
	leafValueToGardenerIds: jsonb("leaf_value_to_gardener_ids").default([]),
	lifeCycleIds: jsonb("life_cycle_ids").default([]),
	lightIds: jsonb("light_ids").default([]),
	maintenanceIds: jsonb("maintenance_ids").default([]),
	ncRegionIds: jsonb("nc_region_ids").default([]),
	plantTypesIds: jsonb("plant_types_ids").default([]),
	poisonPartIds: jsonb("poison_part_ids").default([]),
	problemsIds: jsonb("problems_ids").default([]),
	propagationIds: jsonb("propagation_ids").default([]),
	resistanceToChallengesIds: jsonb("resistance_to_challenges_ids").default([]),
	soilDrainageIds: jsonb("soil_drainage_ids").default([]),
	soilPhIds: jsonb("soil_ph_ids").default([]),
	soilTextureIds: jsonb("soil_texture_ids").default([]),
	stemColorIds: jsonb("stem_color_ids").default([]),
	tagsIds: jsonb("tags_ids").default([]),
	usdaZoneIds: jsonb("usda_zone_ids").default([]),
	commonNames: jsonb("common_names").default([]),
	synonyms: jsonb().default([]),
}, (table) => [
	index("idx_main_plant_data_fire_risk_id").using("btree", table.fireRiskId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.fireRiskId],
			foreignColumns: [fireRiskLookup.id],
			name: "main_plant_data_fire_risk_id_fkey"
		}),
	foreignKey({
			columns: [table.flowerSizeId],
			foreignColumns: [flowerSizeLookup.id],
			name: "main_plant_data_flower_size_id_fkey"
		}),
	foreignKey({
			columns: [table.fruitLengthId],
			foreignColumns: [fruitLengthLookup.id],
			name: "main_plant_data_fruit_length_id_fkey"
		}),
	foreignKey({
			columns: [table.fruitWidthId],
			foreignColumns: [fruitWidthLookup.id],
			name: "main_plant_data_fruit_width_id_fkey"
		}),
	foreignKey({
			columns: [table.gardenSpacesId],
			foreignColumns: [gardenSpacesLookup.id],
			name: "main_plant_data_garden_spaces_id_fkey"
		}),
	foreignKey({
			columns: [table.growthRateId],
			foreignColumns: [growthRateLookup.id],
			name: "main_plant_data_growth_rate_id_fkey"
		}),
	foreignKey({
			columns: [table.leafHairsPresentId],
			foreignColumns: [leafHairsPresentLookup.id],
			name: "main_plant_data_leaf_hairs_present_id_fkey"
		}),
	foreignKey({
			columns: [table.leafLengthId],
			foreignColumns: [leafLengthLookup.id],
			name: "main_plant_data_leaf_length_id_fkey"
		}),
	foreignKey({
			columns: [table.leafWidthId],
			foreignColumns: [leafWidthLookup.id],
			name: "main_plant_data_leaf_width_id_fkey"
		}),
	foreignKey({
			columns: [table.poisonDermatitisId],
			foreignColumns: [poisonDermatitisLookup.id],
			name: "main_plant_data_poison_dermatitis_id_fkey"
		}),
	foreignKey({
			columns: [table.poisonSeverityId],
			foreignColumns: [poisonSeverityLookup.id],
			name: "main_plant_data_poison_severity_id_fkey"
		}),
	foreignKey({
			columns: [table.stemAromaticId],
			foreignColumns: [stemAromaticLookup.id],
			name: "main_plant_data_stem_aromatic_id_fkey"
		}),
	foreignKey({
			columns: [table.stemBudScaleId],
			foreignColumns: [stemBudScalesLookup.id],
			name: "main_plant_data_stem_bud_scale_id_fkey"
		}),
	foreignKey({
			columns: [table.stemBudTerminalId],
			foreignColumns: [stemBudTerminalLookup.id],
			name: "main_plant_data_stem_bud_terminal_id_fkey"
		}),
	foreignKey({
			columns: [table.stemBudsId],
			foreignColumns: [stemBudsLookup.id],
			name: "main_plant_data_stem_buds_id_fkey"
		}),
	foreignKey({
			columns: [table.stemCrossSectionId],
			foreignColumns: [stemCrossSectionLookup.id],
			name: "main_plant_data_stem_cross_section_id_fkey"
		}),
	foreignKey({
			columns: [table.stemFormId],
			foreignColumns: [stemFormLookup.id],
			name: "main_plant_data_stem_form_id_fkey"
		}),
	foreignKey({
			columns: [table.stemLeafScarShapeId],
			foreignColumns: [stemLeafScarShapeLookup.id],
			name: "main_plant_data_stem_leaf_scar_shape_id_fkey"
		}),
	foreignKey({
			columns: [table.stemLenticelsId],
			foreignColumns: [stemLenticelsLookup.id],
			name: "main_plant_data_stem_lenticels_id_fkey"
		}),
	foreignKey({
			columns: [table.stemPithId],
			foreignColumns: [stemPithLookup.id],
			name: "main_plant_data_stem_pith_id_fkey"
		}),
	foreignKey({
			columns: [table.stemSurfaceId],
			foreignColumns: [stemSurfaceLookup.id],
			name: "main_plant_data_stem_surface_id_fkey"
		}),
	foreignKey({
			columns: [table.textureId],
			foreignColumns: [textureLookup.id],
			name: "main_plant_data_texture_id_fkey"
		}),
	unique("main_plant_data_slug_key").on(table.slug),
]);

export const propagationLookup = pgTable("propagation_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const posts = pgTable("posts", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "Posts_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807 }),
	title: text().notNull(),
	slug: text(),
	category: text(),
	description: text(),
	body: text(),
});

export const leafValueToGardenerLookup = pgTable("leaf_value_to_gardener_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const stemCrossSectionLookup = pgTable("stem_cross_section_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const fruitColorLookup = pgTable("fruit_color_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const fruitWidthLookup = pgTable("fruit_width_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const poisonSeverityLookup = pgTable("poison_severity_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const textureLookup = pgTable("texture_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const designFeatureLookup = pgTable("design_feature_lookup", {
	id: smallint().primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const barkAttachmentLookup = pgTable("bark_attachment_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const tipsTricks = pgTable("tips_tricks", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	title: text().notNull(),
	slug: text().notNull(),
	views: integer().default(0),
	authorId: text("author_id").notNull(),
	mainImageUrl: text("main_image_url"),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }),
	description: text(),
	body: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("blog_posts_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	unique("blog_posts_slug_key").on(table.slug),
	pgPolicy("enable all", { as: "permissive", for: "all", to: ["public"], using: sql`true` }),
]);

export const leafCharacteristicsLookup = pgTable("leaf_characteristics_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const flowerBloomTimeLookup = pgTable("flower_bloom_time_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const leafFallColorLookup = pgTable("leaf_fall_color_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const stemFormLookup = pgTable("stem_form_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const fruitValueToGardenerLookup = pgTable("fruit_value_to_gardener_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const fireRiskLookup = pgTable("fire_risk_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const poisonDermatitisLookup = pgTable("poison_dermatitis_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const flowerSizeLookup = pgTable("flower_size_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const availableSpaceToPlantLookup = pgTable("available_space_to_plant_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const barkPlateShapeLookup = pgTable("bark_plate_shape_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const flowerShapeLookup = pgTable("flower_shape_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const habitLookup = pgTable("habit_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const attractsLookup = pgTable("attracts_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const leafTypeLookup = pgTable("leaf_type_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const fruitDisplayHarvestTimeLookup = pgTable("fruit_display_harvest_time_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const stemLeafScarShapeLookup = pgTable("stem_leaf_scar_shape_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const plantImages = pgTable("plant_images", {
	plantId: smallint("plant_id"),
	img: text(),
	altText: text("alt_text"),
	caption: text(),
	attribution: text(),
	id: smallint().primaryKey().generatedByDefaultAsIdentity({ name: "plantImages_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 32767 }),
}, (table) => [
	index("idx_plantimages_plantid").using("btree", table.plantId.asc().nullsLast().op("int2_ops")),
	foreignKey({
			columns: [table.plantId],
			foreignColumns: [mainPlantData.id],
			name: "plant_images_plant_id_fkey"
		}),
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const stemAromaticLookup = pgTable("stem_aromatic_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const ncRegionLookup = pgTable("nc_region_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const leafHairsPresentLookup = pgTable("leaf_hairs_present_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const cultivars = pgTable("cultivars", {
	plantId: smallint("plant_id"),
	name: text(),
	description: text(),
	id: smallint().primaryKey().generatedByDefaultAsIdentity({ name: "cultivars_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 32767, cache: 1 }),
}, (table) => [
	index("idx_cultivars_plantid").using("btree", table.plantId.asc().nullsLast().op("int2_ops")),
	foreignKey({
			columns: [table.plantId],
			foreignColumns: [mainPlantData.id],
			name: "cultivars_plant_id_fkey"
		}),
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const gardenSpacesLookup = pgTable("garden_spaces_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const flowerPetalsLookup = pgTable("flower_petals_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const resistanceToChallengesLookup = pgTable("resistance_to_challenges_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const maintenanceLookup = pgTable("maintenance_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const fruitTypeLookup = pgTable("fruit_type_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const stemLenticelsLookup = pgTable("stem_lenticels_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const stemBudsLookup = pgTable("stem_buds_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const userGardens = pgTable("user_gardens", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	locationIds: jsonb("location_ids").default([]).notNull(),
	spaceAvailableIds: jsonb("space_available_ids").default([]).notNull(),
	sunlightIds: jsonb("sunlight_ids").default([]).notNull(),
	soilTextureIds: jsonb("soil_texture_ids").default([]).notNull(),
	soilDrainageIds: jsonb("soil_drainage_ids").default([]).notNull(),
	soilPhIds: jsonb("soil_ph_ids").default([]).notNull(),
	gardenThemeIds: jsonb("garden_theme_ids").default([]).notNull(),
	wildlifeAttractionIds: jsonb("wildlife_attraction_ids").default([]).notNull(),
	resistanceChallengeIds: jsonb("resistance_challenge_ids").default([]).notNull(),
	problemsToExcludeIds: jsonb("problems_to_exclude_ids").default([]).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	growthRateId: bigint("growth_rate_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	maintenanceLevelId: bigint("maintenance_level_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	texturePreferenceId: bigint("texture_preference_id", { mode: "number" }),
	userPlantsId: jsonb("user_plants_id").default([]).notNull(),
	wantsRecommendations: boolean("wants_recommendations").default(true),
	ncRegionsIds: jsonb("nc_regions_ids").default([]).notNull(),
	usdaZonesIds: jsonb("usda_zones_ids").default([]).notNull(),
	flowerColorIds: jsonb("flower_color_ids").default([]).notNull(),
	flowerBloomTimeIds: jsonb("flower_bloom_time_ids").default([]).notNull(),
	flowerValueIds: jsonb("flower_value_ids").default([]).notNull(),
	leafColorIds: jsonb("leaf_color_ids").default([]).notNull(),
	leafFeelIds: jsonb("leaf_feel_ids").default([]).notNull(),
	leafValueIds: jsonb("leaf_value_ids").default([]).notNull(),
	fallColorIds: jsonb("fall_color_ids").default([]).notNull(),
	habitFormIds: jsonb("habit_form_ids").default([]).notNull(),
	plantTypeIds: jsonb("plant_type_ids").default([]).notNull(),
	yearRoundInterest: boolean("year_round_interest").default(false),
	designFeatureIds: jsonb("design_feature_ids").default([]).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_user_gardens_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.growthRateId],
			foreignColumns: [growthRateLookup.id],
			name: "fk_user_gardens_growth_rate"
		}),
	foreignKey({
			columns: [table.maintenanceLevelId],
			foreignColumns: [maintenanceLookup.id],
			name: "fk_user_gardens_maintenance"
		}),
	foreignKey({
			columns: [table.texturePreferenceId],
			foreignColumns: [textureLookup.id],
			name: "fk_user_gardens_texture"
		}),
	pgPolicy("Users can only access their own gardens", { as: "permissive", for: "all", to: ["public"], using: sql`((auth.uid())::text = user_id)` }),
]);

export const usdaZoneLookup = pgTable("usda_zone_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const leafArrangementLookup = pgTable("leaf_arrangement_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const leafLengthLookup = pgTable("leaf_length_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const lifeCycleLookup = pgTable("life_cycle_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const cachedResponses = pgTable("cached_responses", {
	id: serial().primaryKey().notNull(),
	query: text().notNull(),
	response: text().notNull(),
	context: text(),
	embedding: vector({ dimensions: 1536 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const stemPithLookup = pgTable("stem_pith_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const problemsLookup = pgTable("problems_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const lightLookup = pgTable("light_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const embeddings = pgTable("embeddings", {
	id: varchar({ length: 191 }).primaryKey().notNull(),
	resourceId: varchar("resource_id", { length: 191 }),
	content: text().notNull(),
	embedding: vector({ dimensions: 1536 }).notNull(),
}, (table) => [
	index("embeddingIndex").using("hnsw", table.embedding.asc().nullsLast().op("vector_cosine_ops")),
]);

export const stemBudTerminalLookup = pgTable("stem_bud_terminal_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const userPlants = pgTable("user_plants", {
	id: text().primaryKey().notNull(),
	gardenId: integer("garden_id").notNull(),
	customName: text("custom_name").notNull(),
	botanicalName: text("botanical_name").notNull(),
	status: text().notNull(),
	careLogs: jsonb("care_logs").default([]).notNull(),
	images: jsonb().default([]).notNull(),
	locationTags: jsonb("location_tags").default([]).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_user_plants_garden_id").using("btree", table.gardenId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.gardenId],
			foreignColumns: [userGardens.id],
			name: "fk_user_plants_garden_id"
		}),
	pgPolicy("Users can only access their own plants", { as: "permissive", for: "all", to: ["public"], using: sql`(EXISTS ( SELECT 1
   FROM user_gardens
  WHERE ((user_gardens.id = user_plants.garden_id) AND (user_gardens.user_id = (auth.uid())::text))))` }),
]);

export const leafWidthLookup = pgTable("leaf_width_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const leafShapeLookup = pgTable("leaf_shape_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const flowerColorLookup = pgTable("flower_color_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const poisonPartLookup = pgTable("poison_part_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const stemColorLookup = pgTable("stem_color_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const soilTextureLookup = pgTable("soil_texture_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: text(),
}, () => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);
export const plantCardData = pgMaterializedView("plant_card_data", {	id: integer(),
	slug: text(),
	scientificName: text("scientific_name"),
	description: text(),
	commonName: text("common_name"),
	firstTag: text("first_tag"),
	firstImage: text("first_image"),
	firstImageAltText: text("first_image_alt_text"),
}).as(sql`SELECT p.id, p.slug, p.scientific_name, p.description, p.common_names ->> 0 AS common_name, COALESCE(t.name, NULL::text) AS first_tag, COALESCE(i.img, NULL::text) AS first_image, COALESCE(i.alt_text, NULL::text) AS first_image_alt_text FROM main_plant_data p LEFT JOIN ( SELECT DISTINCT ON (plant_images.plant_id) plant_images.plant_id, plant_images.img, plant_images.alt_text FROM plant_images ORDER BY plant_images.plant_id, plant_images.id) i ON p.id = i.plant_id LEFT JOIN tags_lookup t ON ((p.tags_ids ->> 0)::integer) = t.id`);

export const plantCommonNameData = pgMaterializedView("plant_common_name_data", {	id: integer(),
	slug: text(),
	scientificName: text("scientific_name"),
	genus: text(),
	species: text(),
	family: text(),
	soundFile: text("sound_file"),
	phoneticSpelling: text("phonetic_spelling"),
	profileVideo: text("profile_video"),
	description: text(),
	origin: text(),
	distribution: text(),
	uses: text(),
	wildlifeValue: text("wildlife_value"),
	edibility: text(),
	flowerDescription: text("flower_description"),
	leafDescription: text("leaf_description"),
	fruitDescription: text("fruit_description"),
	stemDescription: text("stem_description"),
	barkDescription: text("bark_description"),
	poisonSymptoms: text("poison_symptoms"),
	poisonToxicPrinciple: text("poison_toxic_principle"),
	heightMax: integer("height_max"),
	heightMin: integer("height_min"),
	widthMax: integer("width_max"),
	widthMin: integer("width_min"),
	fireRisk: text("fire_risk"),
	flowerSize: text("flower_size"),
	fruitLength: text("fruit_length"),
	fruitWidth: text("fruit_width"),
	gardenSpaces: text("garden_spaces"),
	growthRate: text("growth_rate"),
	leafHairsPresent: text("leaf_hairs_present"),
	leafLength: text("leaf_length"),
	leafWidth: text("leaf_width"),
	poisonDermatitis: text("poison_dermatitis"),
	poisonSeverity: text("poison_severity"),
	stemAromatic: text("stem_aromatic"),
	stemBudScale: text("stem_bud_scale"),
	stemBudTerminal: text("stem_bud_terminal"),
	stemBuds: text("stem_buds"),
	stemCrossSection: text("stem_cross_section"),
	stemForm: text("stem_form"),
	stemLeafScarShape: text("stem_leaf_scar_shape"),
	stemLenticels: text("stem_lenticels"),
	stemPith: text("stem_pith"),
	stemSurface: text("stem_surface"),
	texture: text(),
	attracts: jsonb(),
	availableSpaceToPlant: jsonb("available_space_to_plant"),
	barkAttachment: jsonb("bark_attachment"),
	barkColor: jsonb("bark_color"),
	barkPlateShape: jsonb("bark_plate_shape"),
	designFeature: jsonb("design_feature"),
	flowerBloomTime: jsonb("flower_bloom_time"),
	flowerColors: jsonb("flower_colors"),
	flowerInflorescence: jsonb("flower_inflorescence"),
	flowerPetals: jsonb("flower_petals"),
	flowerShape: jsonb("flower_shape"),
	flowerValueToGardener: jsonb("flower_value_to_gardener"),
	fruitColor: jsonb("fruit_color"),
	fruitDisplayHarvestTime: jsonb("fruit_display_harvest_time"),
	fruitType: jsonb("fruit_type"),
	fruitValueToGardener: jsonb("fruit_value_to_gardener"),
	plantHabit: jsonb("plant_habit"),
	landscapeLocation: jsonb("landscape_location"),
	landscapeTheme: jsonb("landscape_theme"),
	leafArrangement: jsonb("leaf_arrangement"),
	leafCharacteristics: jsonb("leaf_characteristics"),
	leafColor: jsonb("leaf_color"),
	leafFallColor: jsonb("leaf_fall_color"),
	leafFeel: jsonb("leaf_feel"),
	leafMargin: jsonb("leaf_margin"),
	leafShape: jsonb("leaf_shape"),
	leafType: jsonb("leaf_type"),
	leafValueToGardener: jsonb("leaf_value_to_gardener"),
	lifeCycle: jsonb("life_cycle"),
	lightRequirements: jsonb("light_requirements"),
	maintenance: jsonb(),
	ncRegions: jsonb("nc_regions"),
	plantTypes: jsonb("plant_types"),
	poisonParts: jsonb("poison_parts"),
	problems: jsonb(),
	propagation: jsonb(),
	resistanceToChallenges: jsonb("resistance_to_challenges"),
	soilDrainage: jsonb("soil_drainage"),
	soilPh: jsonb("soil_ph"),
	soilTexture: jsonb("soil_texture"),
	stemColor: jsonb("stem_color"),
	tags: jsonb(),
	usdaZones: jsonb("usda_zones"),
	commonNames: text("common_names"),
	synonyms: text(),
	images: jsonb(),
	cultivars: jsonb(),
	commonName: text("common_name"),
}).as(sql`WITH common_name_expanded AS ( SELECT pfd.id, pfd.slug, pfd.scientific_name, pfd.genus, pfd.species, pfd.family, pfd.sound_file, pfd.phonetic_spelling, pfd.profile_video, pfd.description, pfd.origin, pfd.distribution, pfd.uses, pfd.wildlife_value, pfd.edibility, pfd.flower_description, pfd.leaf_description, pfd.fruit_description, pfd.stem_description, pfd.bark_description, pfd.poison_symptoms, pfd.poison_toxic_principle, pfd.height_max, pfd.height_min, pfd.width_max, pfd.width_min, pfd.fire_risk, pfd.flower_size, pfd.fruit_length, pfd.fruit_width, pfd.garden_spaces, pfd.growth_rate, pfd.leaf_hairs_present, pfd.leaf_length, pfd.leaf_width, pfd.poison_dermatitis, pfd.poison_severity, pfd.stem_aromatic, pfd.stem_bud_scale, pfd.stem_bud_terminal, pfd.stem_buds, pfd.stem_cross_section, pfd.stem_form, pfd.stem_leaf_scar_shape, pfd.stem_lenticels, pfd.stem_pith, pfd.stem_surface, pfd.texture, pfd.attracts, pfd.available_space_to_plant, pfd.bark_attachment, pfd.bark_color, pfd.bark_plate_shape, pfd.design_feature, pfd.flower_bloom_time, pfd.flower_colors, pfd.flower_inflorescence, pfd.flower_petals, pfd.flower_shape, pfd.flower_value_to_gardener, pfd.fruit_color, pfd.fruit_display_harvest_time, pfd.fruit_type, pfd.fruit_value_to_gardener, pfd.plant_habit, pfd.landscape_location, pfd.landscape_theme, pfd.leaf_arrangement, pfd.leaf_characteristics, pfd.leaf_color, pfd.leaf_fall_color, pfd.leaf_feel, pfd.leaf_margin, pfd.leaf_shape, pfd.leaf_type, pfd.leaf_value_to_gardener, pfd.life_cycle, pfd.light_requirements, pfd.maintenance, pfd.nc_regions, pfd.plant_types, pfd.poison_parts, pfd.problems, pfd.propagation, pfd.resistance_to_challenges, pfd.soil_drainage, pfd.soil_ph, pfd.soil_texture, pfd.stem_color, pfd.tags, pfd.usda_zones, pfd.common_names, pfd.synonyms, pfd.images, pfd.cultivars, cn.common_name FROM plant_full_data pfd JOIN LATERAL unnest(pfd.common_names) cn(common_name) ON true ) SELECT common_name_expanded.id, common_name_expanded.slug, common_name_expanded.scientific_name, common_name_expanded.genus, common_name_expanded.species, common_name_expanded.family, common_name_expanded.sound_file, common_name_expanded.phonetic_spelling, common_name_expanded.profile_video, common_name_expanded.description, common_name_expanded.origin, common_name_expanded.distribution, common_name_expanded.uses, common_name_expanded.wildlife_value, common_name_expanded.edibility, common_name_expanded.flower_description, common_name_expanded.leaf_description, common_name_expanded.fruit_description, common_name_expanded.stem_description, common_name_expanded.bark_description, common_name_expanded.poison_symptoms, common_name_expanded.poison_toxic_principle, common_name_expanded.height_max, common_name_expanded.height_min, common_name_expanded.width_max, common_name_expanded.width_min, common_name_expanded.fire_risk, common_name_expanded.flower_size, common_name_expanded.fruit_length, common_name_expanded.fruit_width, common_name_expanded.garden_spaces, common_name_expanded.growth_rate, common_name_expanded.leaf_hairs_present, common_name_expanded.leaf_length, common_name_expanded.leaf_width, common_name_expanded.poison_dermatitis, common_name_expanded.poison_severity, common_name_expanded.stem_aromatic, common_name_expanded.stem_bud_scale, common_name_expanded.stem_bud_terminal, common_name_expanded.stem_buds, common_name_expanded.stem_cross_section, common_name_expanded.stem_form, common_name_expanded.stem_leaf_scar_shape, common_name_expanded.stem_lenticels, common_name_expanded.stem_pith, common_name_expanded.stem_surface, common_name_expanded.texture, common_name_expanded.attracts, common_name_expanded.available_space_to_plant, common_name_expanded.bark_attachment, common_name_expanded.bark_color, common_name_expanded.bark_plate_shape, common_name_expanded.design_feature, common_name_expanded.flower_bloom_time, common_name_expanded.flower_colors, common_name_expanded.flower_inflorescence, common_name_expanded.flower_petals, common_name_expanded.flower_shape, common_name_expanded.flower_value_to_gardener, common_name_expanded.fruit_color, common_name_expanded.fruit_display_harvest_time, common_name_expanded.fruit_type, common_name_expanded.fruit_value_to_gardener, common_name_expanded.plant_habit, common_name_expanded.landscape_location, common_name_expanded.landscape_theme, common_name_expanded.leaf_arrangement, common_name_expanded.leaf_characteristics, common_name_expanded.leaf_color, common_name_expanded.leaf_fall_color, common_name_expanded.leaf_feel, common_name_expanded.leaf_margin, common_name_expanded.leaf_shape, common_name_expanded.leaf_type, common_name_expanded.leaf_value_to_gardener, common_name_expanded.life_cycle, common_name_expanded.light_requirements, common_name_expanded.maintenance, common_name_expanded.nc_regions, common_name_expanded.plant_types, common_name_expanded.poison_parts, common_name_expanded.problems, common_name_expanded.propagation, common_name_expanded.resistance_to_challenges, common_name_expanded.soil_drainage, common_name_expanded.soil_ph, common_name_expanded.soil_texture, common_name_expanded.stem_color, common_name_expanded.tags, common_name_expanded.usda_zones, common_name_expanded.common_names, common_name_expanded.synonyms, common_name_expanded.images, common_name_expanded.cultivars, common_name_expanded.common_name FROM common_name_expanded`);

export const plantCommonCardData = pgMaterializedView("plant_common_card_data", {	id: integer(),
	slug: text(),
	scientificSlug: text("scientific_slug"),
	commonName: text("common_name"),
	description: text(),
	scientificName: text("scientific_name"),
	firstTag: text("first_tag"),
	firstImage: text("first_image"),
	firstImageAltText: text("first_image_alt_text"),
}).as(sql`WITH base AS ( SELECT pcd.id, pcd.slug AS scientific_slug, pcd.scientific_name, pcd.description, pcd.first_tag, pcd.first_image, pcd.first_image_alt_text, pfd.common_names FROM plant_card_data pcd JOIN plant_full_data pfd ON pcd.id = pfd.id ) SELECT base.id, lower(regexp_replace(cn.common_name, '[^a-zA-Z0-9]+'::text, '-'::text, 'g'::text)) AS slug, base.scientific_slug, cn.common_name, base.description, base.scientific_name, base.first_tag, base.first_image, base.first_image_alt_text FROM base JOIN LATERAL unnest(base.common_names) cn(common_name) ON true`);

export const plantAutocomplete = pgMaterializedView("plant_autocomplete", {	slug: text(),
	scientificName: text("scientific_name"),
}).as(sql`SELECT main_plant_data.slug, main_plant_data.scientific_name FROM main_plant_data`);

export const plantFullData = pgMaterializedView("plant_full_data", {	id: integer(),
	slug: text(),
	scientificName: text("scientific_name"),
	genus: text(),
	species: text(),
	family: text(),
	soundFile: text("sound_file"),
	phoneticSpelling: text("phonetic_spelling"),
	profileVideo: text("profile_video"),
	description: text(),
	origin: text(),
	distribution: text(),
	uses: text(),
	wildlifeValue: text("wildlife_value"),
	edibility: text(),
	flowerDescription: text("flower_description"),
	leafDescription: text("leaf_description"),
	fruitDescription: text("fruit_description"),
	stemDescription: text("stem_description"),
	barkDescription: text("bark_description"),
	poisonSymptoms: text("poison_symptoms"),
	poisonToxicPrinciple: text("poison_toxic_principle"),
	heightMax: integer("height_max"),
	heightMin: integer("height_min"),
	widthMax: integer("width_max"),
	widthMin: integer("width_min"),
	fireRisk: text("fire_risk"),
	flowerSize: text("flower_size"),
	fruitLength: text("fruit_length"),
	fruitWidth: text("fruit_width"),
	gardenSpaces: text("garden_spaces"),
	growthRate: text("growth_rate"),
	leafHairsPresent: text("leaf_hairs_present"),
	leafLength: text("leaf_length"),
	leafWidth: text("leaf_width"),
	poisonDermatitis: text("poison_dermatitis"),
	poisonSeverity: text("poison_severity"),
	stemAromatic: text("stem_aromatic"),
	stemBudScale: text("stem_bud_scale"),
	stemBudTerminal: text("stem_bud_terminal"),
	stemBuds: text("stem_buds"),
	stemCrossSection: text("stem_cross_section"),
	stemForm: text("stem_form"),
	stemLeafScarShape: text("stem_leaf_scar_shape"),
	stemLenticels: text("stem_lenticels"),
	stemPith: text("stem_pith"),
	stemSurface: text("stem_surface"),
	texture: text(),
	attracts: jsonb(),
	availableSpaceToPlant: jsonb("available_space_to_plant"),
	barkAttachment: jsonb("bark_attachment"),
	barkColor: jsonb("bark_color"),
	barkPlateShape: jsonb("bark_plate_shape"),
	designFeature: jsonb("design_feature"),
	flowerBloomTime: jsonb("flower_bloom_time"),
	flowerColors: jsonb("flower_colors"),
	flowerInflorescence: jsonb("flower_inflorescence"),
	flowerPetals: jsonb("flower_petals"),
	flowerShape: jsonb("flower_shape"),
	flowerValueToGardener: jsonb("flower_value_to_gardener"),
	fruitColor: jsonb("fruit_color"),
	fruitDisplayHarvestTime: jsonb("fruit_display_harvest_time"),
	fruitType: jsonb("fruit_type"),
	fruitValueToGardener: jsonb("fruit_value_to_gardener"),
	plantHabit: jsonb("plant_habit"),
	landscapeLocation: jsonb("landscape_location"),
	landscapeTheme: jsonb("landscape_theme"),
	leafArrangement: jsonb("leaf_arrangement"),
	leafCharacteristics: jsonb("leaf_characteristics"),
	leafColor: jsonb("leaf_color"),
	leafFallColor: jsonb("leaf_fall_color"),
	leafFeel: jsonb("leaf_feel"),
	leafMargin: jsonb("leaf_margin"),
	leafShape: jsonb("leaf_shape"),
	leafType: jsonb("leaf_type"),
	leafValueToGardener: jsonb("leaf_value_to_gardener"),
	lifeCycle: jsonb("life_cycle"),
	lightRequirements: jsonb("light_requirements"),
	maintenance: jsonb(),
	ncRegions: jsonb("nc_regions"),
	plantTypes: jsonb("plant_types"),
	poisonParts: jsonb("poison_parts"),
	problems: jsonb(),
	propagation: jsonb(),
	resistanceToChallenges: jsonb("resistance_to_challenges"),
	soilDrainage: jsonb("soil_drainage"),
	soilPh: jsonb("soil_ph"),
	soilTexture: jsonb("soil_texture"),
	stemColor: jsonb("stem_color"),
	tags: jsonb(),
	usdaZones: jsonb("usda_zones"),
	commonNames: text("common_names"),
	synonyms: text(),
	images: jsonb(),
	cultivars: jsonb(),
}).as(sql`WITH plant_data AS ( SELECT mpd.id, mpd.slug, mpd.scientific_name, mpd.genus, mpd.species, mpd.family, mpd.sound_file, mpd.phonetic_spelling, mpd.profile_video, mpd.description, mpd.origin, mpd.distribution, mpd.uses, mpd.wildlife_value, mpd.edibility, mpd.flower_description, mpd.leaf_description, mpd.fruit_description, mpd.stem_description, mpd.bark_description, mpd.poison_symptoms, mpd.poison_toxic_principle, mpd.height_max, mpd.height_min, mpd.width_max, mpd.width_min, fr.name AS fire_risk, fs.name AS flower_size, fl.name AS fruit_length, fw.name AS fruit_width, gs.name AS garden_spaces, gr.name AS growth_rate, lhp.name AS leaf_hairs_present, ll.name AS leaf_length, lw.name AS leaf_width, pd_1.name AS poison_dermatitis, ps.name AS poison_severity, sa.name AS stem_aromatic, sbsc.name AS stem_bud_scale, sbst.name AS stem_bud_terminal, sbs.name AS stem_buds, scs.name AS stem_cross_section, sf.name AS stem_form, slss.name AS stem_leaf_scar_shape, sl.name AS stem_lenticels, sp.name AS stem_pith, ss.name AS stem_surface, tx.name AS texture, ( SELECT jsonb_agg(attracts_lookup.name) AS jsonb_agg FROM attracts_lookup WHERE (attracts_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.attracts_ids)::bigint AS jsonb_array_elements_text))) AS attracts, ( SELECT jsonb_agg(available_space_to_plant_lookup.name) AS jsonb_agg FROM available_space_to_plant_lookup WHERE (available_space_to_plant_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.available_space_to_plant_ids)::bigint AS jsonb_array_elements_text))) AS available_space_to_plant, ( SELECT jsonb_agg(bark_attachment_lookup.name) AS jsonb_agg FROM bark_attachment_lookup WHERE (bark_attachment_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.bark_attachment_ids)::bigint AS jsonb_array_elements_text))) AS bark_attachment, ( SELECT jsonb_agg(bark_color_lookup.name) AS jsonb_agg FROM bark_color_lookup WHERE (bark_color_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.bark_color_ids)::bigint AS jsonb_array_elements_text))) AS bark_color, ( SELECT jsonb_agg(bark_plate_shape_lookup.name) AS jsonb_agg FROM bark_plate_shape_lookup WHERE (bark_plate_shape_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.bark_plate_shape_ids)::bigint AS jsonb_array_elements_text))) AS bark_plate_shape, ( SELECT jsonb_agg(design_feature_lookup.name) AS jsonb_agg FROM design_feature_lookup WHERE (design_feature_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.design_feature_ids)::bigint AS jsonb_array_elements_text))) AS design_feature, ( SELECT jsonb_agg(flower_bloom_time_lookup.name) AS jsonb_agg FROM flower_bloom_time_lookup WHERE (flower_bloom_time_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.flower_bloom_time_ids)::bigint AS jsonb_array_elements_text))) AS flower_bloom_time, ( SELECT jsonb_agg(flower_color_lookup.name) AS jsonb_agg FROM flower_color_lookup WHERE (flower_color_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.flower_color_ids)::bigint AS jsonb_array_elements_text))) AS flower_colors, ( SELECT jsonb_agg(flower_inflorescence_lookup.name) AS jsonb_agg FROM flower_inflorescence_lookup WHERE (flower_inflorescence_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.flower_inflorescence_ids)::bigint AS jsonb_array_elements_text))) AS flower_inflorescence, ( SELECT jsonb_agg(flower_petals_lookup.name) AS jsonb_agg FROM flower_petals_lookup WHERE (flower_petals_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.flower_petals_ids)::bigint AS jsonb_array_elements_text))) AS flower_petals, ( SELECT jsonb_agg(flower_shape_lookup.name) AS jsonb_agg FROM flower_shape_lookup WHERE (flower_shape_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.flower_shape_ids)::bigint AS jsonb_array_elements_text))) AS flower_shape, ( SELECT jsonb_agg(flower_value_to_gardener_lookup.name) AS jsonb_agg FROM flower_value_to_gardener_lookup WHERE (flower_value_to_gardener_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.flower_value_to_gardener_ids)::bigint AS jsonb_array_elements_text))) AS flower_value_to_gardener, ( SELECT jsonb_agg(fruit_color_lookup.name) AS jsonb_agg FROM fruit_color_lookup WHERE (fruit_color_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.fruit_color_ids)::bigint AS jsonb_array_elements_text))) AS fruit_color, ( SELECT jsonb_agg(fruit_display_harvest_time_lookup.name) AS jsonb_agg FROM fruit_display_harvest_time_lookup WHERE (fruit_display_harvest_time_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.fruit_display_harvest_time_ids)::bigint AS jsonb_array_elements_text))) AS fruit_display_harvest_time, ( SELECT jsonb_agg(fruit_type_lookup.name) AS jsonb_agg FROM fruit_type_lookup WHERE (fruit_type_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.fruit_type_ids)::bigint AS jsonb_array_elements_text))) AS fruit_type, ( SELECT jsonb_agg(fruit_value_to_gardener_lookup.name) AS jsonb_agg FROM fruit_value_to_gardener_lookup WHERE (fruit_value_to_gardener_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.fruit_value_to_gardener_ids)::bigint AS jsonb_array_elements_text))) AS fruit_value_to_gardener, ( SELECT jsonb_agg(habit_lookup.name) AS jsonb_agg FROM habit_lookup WHERE (habit_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.habit_ids)::bigint AS jsonb_array_elements_text))) AS plant_habit, ( SELECT jsonb_agg(landscape_location_lookup.name) AS jsonb_agg FROM landscape_location_lookup WHERE (landscape_location_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.landscape_location_ids)::bigint AS jsonb_array_elements_text))) AS landscape_location, ( SELECT jsonb_agg(landscape_theme_lookup.name) AS jsonb_agg FROM landscape_theme_lookup WHERE (landscape_theme_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.landscape_theme_ids)::bigint AS jsonb_array_elements_text))) AS landscape_theme, ( SELECT jsonb_agg(leaf_arrangement_lookup.name) AS jsonb_agg FROM leaf_arrangement_lookup WHERE (leaf_arrangement_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.leaf_arrangement_ids)::bigint AS jsonb_array_elements_text))) AS leaf_arrangement, ( SELECT jsonb_agg(leaf_characteristics_lookup.name) AS jsonb_agg FROM leaf_characteristics_lookup WHERE (leaf_characteristics_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.leaf_characteristics_ids)::bigint AS jsonb_array_elements_text))) AS leaf_characteristics, ( SELECT jsonb_agg(leaf_color_lookup.name) AS jsonb_agg FROM leaf_color_lookup WHERE (leaf_color_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.leaf_color_ids)::bigint AS jsonb_array_elements_text))) AS leaf_color, ( SELECT jsonb_agg(leaf_fall_color_lookup.name) AS jsonb_agg FROM leaf_fall_color_lookup WHERE (leaf_fall_color_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.leaf_fall_color_ids)::bigint AS jsonb_array_elements_text))) AS leaf_fall_color, ( SELECT jsonb_agg(leaf_feel_lookup.name) AS jsonb_agg FROM leaf_feel_lookup WHERE (leaf_feel_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.leaf_feel_ids)::bigint AS jsonb_array_elements_text))) AS leaf_feel, ( SELECT jsonb_agg(leaf_margin_lookup.name) AS jsonb_agg FROM leaf_margin_lookup WHERE (leaf_margin_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.leaf_margin_ids)::bigint AS jsonb_array_elements_text))) AS leaf_margin, ( SELECT jsonb_agg(leaf_shape_lookup.name) AS jsonb_agg FROM leaf_shape_lookup WHERE (leaf_shape_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.leaf_shape_ids)::bigint AS jsonb_array_elements_text))) AS leaf_shape, ( SELECT jsonb_agg(leaf_type_lookup.name) AS jsonb_agg FROM leaf_type_lookup WHERE (leaf_type_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.leaf_type_ids)::bigint AS jsonb_array_elements_text))) AS leaf_type, ( SELECT jsonb_agg(leaf_value_to_gardener_lookup.name) AS jsonb_agg FROM leaf_value_to_gardener_lookup WHERE (leaf_value_to_gardener_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.leaf_value_to_gardener_ids)::bigint AS jsonb_array_elements_text))) AS leaf_value_to_gardener, ( SELECT jsonb_agg(life_cycle_lookup.name) AS jsonb_agg FROM life_cycle_lookup WHERE (life_cycle_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.life_cycle_ids)::bigint AS jsonb_array_elements_text))) AS life_cycle, ( SELECT jsonb_agg(light_lookup.name) AS jsonb_agg FROM light_lookup WHERE (light_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.light_ids)::bigint AS jsonb_array_elements_text))) AS light_requirements, ( SELECT jsonb_agg(maintenance_lookup.name) AS jsonb_agg FROM maintenance_lookup WHERE (maintenance_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.maintenance_ids)::bigint AS jsonb_array_elements_text))) AS maintenance, ( SELECT jsonb_agg(nc_region_lookup.name) AS jsonb_agg FROM nc_region_lookup WHERE (nc_region_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.nc_region_ids)::bigint AS jsonb_array_elements_text))) AS nc_regions, ( SELECT jsonb_agg(plant_types_lookup.name) AS jsonb_agg FROM plant_types_lookup WHERE (plant_types_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.plant_types_ids)::bigint AS jsonb_array_elements_text))) AS plant_types, ( SELECT jsonb_agg(poison_part_lookup.name) AS jsonb_agg FROM poison_part_lookup WHERE (poison_part_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.poison_part_ids)::bigint AS jsonb_array_elements_text))) AS poison_parts, ( SELECT jsonb_agg(problems_lookup.name) AS jsonb_agg FROM problems_lookup WHERE (problems_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.problems_ids)::bigint AS jsonb_array_elements_text))) AS problems, ( SELECT jsonb_agg(propagation_lookup.name) AS jsonb_agg FROM propagation_lookup WHERE (propagation_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.propagation_ids)::bigint AS jsonb_array_elements_text))) AS propagation, ( SELECT jsonb_agg(resistance_to_challenges_lookup.name) AS jsonb_agg FROM resistance_to_challenges_lookup WHERE (resistance_to_challenges_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.resistance_to_challenges_ids)::bigint AS jsonb_array_elements_text))) AS resistance_to_challenges, ( SELECT jsonb_agg(soil_drainage_lookup.name) AS jsonb_agg FROM soil_drainage_lookup WHERE (soil_drainage_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.soil_drainage_ids)::bigint AS jsonb_array_elements_text))) AS soil_drainage, ( SELECT jsonb_agg(soil_ph_lookup.name) AS jsonb_agg FROM soil_ph_lookup WHERE (soil_ph_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.soil_ph_ids)::bigint AS jsonb_array_elements_text))) AS soil_ph, ( SELECT jsonb_agg(soil_texture_lookup.name) AS jsonb_agg FROM soil_texture_lookup WHERE (soil_texture_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.soil_texture_ids)::bigint AS jsonb_array_elements_text))) AS soil_texture, ( SELECT jsonb_agg(stem_color_lookup.name) AS jsonb_agg FROM stem_color_lookup WHERE (stem_color_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.stem_color_ids)::bigint AS jsonb_array_elements_text))) AS stem_color, ( SELECT jsonb_agg(tags_lookup.name) AS jsonb_agg FROM tags_lookup WHERE (tags_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.tags_ids)::bigint AS jsonb_array_elements_text))) AS tags, ( SELECT jsonb_agg(usda_zone_lookup.name) AS jsonb_agg FROM usda_zone_lookup WHERE (usda_zone_lookup.id IN ( SELECT jsonb_array_elements_text(mpd.usda_zone_ids)::bigint AS jsonb_array_elements_text))) AS usda_zones, ARRAY( SELECT jsonb_array_elements_text(mpd.common_names) AS jsonb_array_elements_text) AS common_names, ARRAY( SELECT jsonb_array_elements_text(mpd.synonyms) AS jsonb_array_elements_text) AS synonyms FROM main_plant_data mpd LEFT JOIN fire_risk_lookup fr ON mpd.fire_risk_id = fr.id LEFT JOIN flower_size_lookup fs ON mpd.flower_size_id = fs.id LEFT JOIN fruit_length_lookup fl ON mpd.fruit_length_id = fl.id LEFT JOIN fruit_width_lookup fw ON mpd.fruit_width_id = fw.id LEFT JOIN garden_spaces_lookup gs ON mpd.garden_spaces_id = gs.id LEFT JOIN growth_rate_lookup gr ON mpd.growth_rate_id = gr.id LEFT JOIN leaf_hairs_present_lookup lhp ON mpd.leaf_hairs_present_id = lhp.id LEFT JOIN leaf_length_lookup ll ON mpd.leaf_length_id = ll.id LEFT JOIN leaf_width_lookup lw ON mpd.leaf_width_id = lw.id LEFT JOIN poison_dermatitis_lookup pd_1 ON mpd.poison_dermatitis_id = pd_1.id LEFT JOIN poison_severity_lookup ps ON mpd.poison_severity_id = ps.id LEFT JOIN stem_aromatic_lookup sa ON mpd.stem_aromatic_id = sa.id LEFT JOIN stem_bud_scales_lookup sbsc ON mpd.stem_bud_scale_id = sbsc.id LEFT JOIN stem_bud_terminal_lookup sbst ON mpd.stem_bud_terminal_id = sbst.id LEFT JOIN stem_buds_lookup sbs ON mpd.stem_buds_id = sbs.id LEFT JOIN stem_cross_section_lookup scs ON mpd.stem_cross_section_id = scs.id LEFT JOIN stem_form_lookup sf ON mpd.stem_form_id = sf.id LEFT JOIN stem_leaf_scar_shape_lookup slss ON mpd.stem_leaf_scar_shape_id = slss.id LEFT JOIN stem_lenticels_lookup sl ON mpd.stem_lenticels_id = sl.id LEFT JOIN stem_pith_lookup sp ON mpd.stem_pith_id = sp.id LEFT JOIN stem_surface_lookup ss ON mpd.stem_surface_id = ss.id LEFT JOIN texture_lookup tx ON mpd.texture_id = tx.id ), image_data AS ( SELECT plant_images.plant_id, jsonb_agg(jsonb_build_object('id', plant_images.id, 'img', plant_images.img, 'alt_text', plant_images.alt_text, 'caption', plant_images.caption, 'attribution', plant_images.attribution)) AS images FROM plant_images GROUP BY plant_images.plant_id ), cultivar_data AS ( SELECT cultivars.plant_id, jsonb_agg(jsonb_build_object('id', cultivars.id, 'name', cultivars.name, 'description', cultivars.description)) AS cultivars FROM cultivars GROUP BY cultivars.plant_id ) SELECT pd.id, pd.slug, pd.scientific_name, pd.genus, pd.species, pd.family, pd.sound_file, pd.phonetic_spelling, pd.profile_video, pd.description, pd.origin, pd.distribution, pd.uses, pd.wildlife_value, pd.edibility, pd.flower_description, pd.leaf_description, pd.fruit_description, pd.stem_description, pd.bark_description, pd.poison_symptoms, pd.poison_toxic_principle, pd.height_max, pd.height_min, pd.width_max, pd.width_min, pd.fire_risk, pd.flower_size, pd.fruit_length, pd.fruit_width, pd.garden_spaces, pd.growth_rate, pd.leaf_hairs_present, pd.leaf_length, pd.leaf_width, pd.poison_dermatitis, pd.poison_severity, pd.stem_aromatic, pd.stem_bud_scale, pd.stem_bud_terminal, pd.stem_buds, pd.stem_cross_section, pd.stem_form, pd.stem_leaf_scar_shape, pd.stem_lenticels, pd.stem_pith, pd.stem_surface, pd.texture, pd.attracts, pd.available_space_to_plant, pd.bark_attachment, pd.bark_color, pd.bark_plate_shape, pd.design_feature, pd.flower_bloom_time, pd.flower_colors, pd.flower_inflorescence, pd.flower_petals, pd.flower_shape, pd.flower_value_to_gardener, pd.fruit_color, pd.fruit_display_harvest_time, pd.fruit_type, pd.fruit_value_to_gardener, pd.plant_habit, pd.landscape_location, pd.landscape_theme, pd.leaf_arrangement, pd.leaf_characteristics, pd.leaf_color, pd.leaf_fall_color, pd.leaf_feel, pd.leaf_margin, pd.leaf_shape, pd.leaf_type, pd.leaf_value_to_gardener, pd.life_cycle, pd.light_requirements, pd.maintenance, pd.nc_regions, pd.plant_types, pd.poison_parts, pd.problems, pd.propagation, pd.resistance_to_challenges, pd.soil_drainage, pd.soil_ph, pd.soil_texture, pd.stem_color, pd.tags, pd.usda_zones, pd.common_names, pd.synonyms, COALESCE(idata.images, '[]'::jsonb) AS images, COALESCE(cdata.cultivars, '[]'::jsonb) AS cultivars FROM plant_data pd LEFT JOIN image_data idata ON pd.id = idata.plant_id LEFT JOIN cultivar_data cdata ON pd.id = cdata.plant_id`);