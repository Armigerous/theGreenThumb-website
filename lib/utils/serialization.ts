/**
 * serializeForClient
 *
 * Reason: Converts Prisma data types (Decimal, BigInt, Date) to plain JavaScript
 * types that can be safely passed to client components
 */
export const serializeForClient = <T>(data: T): T => {
	return JSON.parse(
		JSON.stringify(data, (key, value) => {
			// Reason: Convert BigInt to string to prevent serialization errors
			if (typeof value === "bigint") {
				return value.toString();
			}
			// Reason: Convert Decimal objects to numbers
			if (value && typeof value === "object" && value.constructor?.name === "Decimal") {
				return Number(value);
			}
			return value;
		})
	);
};
