import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env.mjs";
import * as schema from "./migrations/schema";
import "./migrations/relations";

// Create postgres client
const client = postgres(env.POSTGRES_URL!);

// Create drizzle database instance with schema
export const db = drizzle(client, { schema });
