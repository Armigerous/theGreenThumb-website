import { db } from "@/lib/db";
import { plantFullData } from "@/lib/db/schema/resources";

// Prepare the database with query builder

// Create query builder
export const queries = {
  plants: {
    findFirst: async (where: any) => {
      return await db
        .select()
        .from(plantFullData)
        .where(where)
        .limit(1)
        .then((res) => res[0]);
    },
  },
};
