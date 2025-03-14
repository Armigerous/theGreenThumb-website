import { sql } from "drizzle-orm";
import {
  integer,
  json,
  pgTable,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";


// Define the materialized view schema
export const plantFullData = pgTable("plant_full_data", {
  id: integer("id").primaryKey(),
  scientific_name: text("scientific_name").notNull(),
  common_names: json("common_names").$type<string[]>(),
  description: text("description"),
  genus: text("genus"),
  species: text("species"),
  family: text("family"),
  height_max: integer("height_max"),
  height_min: integer("height_min"),
  width_max: integer("width_max"),
  width_min: integer("width_min"),
  slug: text("slug"),
});

export const plants = pgTable("main_plant_data", {
  id: integer("id").primaryKey(),
  slug: text("slug").notNull(),
  scientific_name: text("scientific_name").notNull(),
  common_names: json("common_names"),
  description: text("description"),
  genus: text("genus"),
  species: text("species"),
  family: text("family"),
  height_max: integer("height_max"),
  height_min: integer("height_min"),
  width_max: integer("width_max"),
  width_min: integer("width_min"),
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updated_at: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for plant data - used to validate API requests
export const insertPlantSchema = createSelectSchema(plants)
  .extend({
    scientific_name: z.string(),
    common_names: z.array(z.string().nullable()).nullable(),
    description: z.string().nullable(),
    genus: z.string().nullable(),
    species: z.string().nullable(),
    family: z.string().nullable(),
    height_max: z.number().nullable(),
    height_min: z.number().nullable(),
    width_max: z.number().nullable(),
    width_min: z.number().nullable(),
  })
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  });

// Type for resources - used to type API request params and within Components
export type NewPlantParams = z.infer<typeof insertPlantSchema>;
