import { db } from "@/lib/db";
import { plantFullData } from "@/lib/db/schema/resources";
import { SQL } from "drizzle-orm";

// Create query builder
export const queries = {
  plants: {
    findFirst: async (where: SQL<unknown>) => {
      return await db
        .select()
        .from(plantFullData)
        .where(where)
        .limit(1)
        .then((res) => res[0]);
    },
  },
};
