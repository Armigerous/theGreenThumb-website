import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env.mjs";
import * as schema from "./migrations/schema";
import "./migrations/relations";

// Create postgres client with fallback for build time
const client = postgres(env.POSTGRES_URL || "postgresql://localhost:5432/dummy");

// Create drizzle database instance with schema
export const db = drizzle(client, { schema });
