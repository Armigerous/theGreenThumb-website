import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CareStatusBadge } from "../CareStatusBadge";
import { userPlants } from "@/types/garden";

// Reason: Factory function to create test plant data
const createTestPlant = (overrides: Partial<userPlants> = {}): userPlants => ({
	id: "1",
	plant_id: 1,
	customName: "Test Plant",
	nickname: "Testy",
	botanicalName: "Testus plantus",
	status: "healthy",
	lastWatered: new Date("2023-01-01"),
	lastFertilized: new Date("2023-01-01"),
	lastRepotted: new Date("2023-01-01"),
	images: [],
	careLogs: [
		{
			date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
			type: "water",
			notes: "Test care log",
		},
	],
	gardenId: 1,
	garden_id: 1,
	locationTags: [],
	createdAt: new Date("2023-01-01"),
	updatedAt: new Date("2023-01-01"),
	...overrides,
});

describe("CareStatusBadge", () => {
	test("given a healthy plant, should display healthy status with green styling", () => {
		const plant = createTestPlant({ status: "healthy" });

		render(<CareStatusBadge plant={plant} />);

		const badge = screen.getByText("Healthy");
		expect(badge).toBeInTheDocument();
		expect(badge.closest("div")).toHaveClass("bg-green-50", "text-green-600");
	});

	test("given a critical plant, should display critical status with red styling", () => {
		const plant = createTestPlant({ status: "critical" });

		render(<CareStatusBadge plant={plant} />);

		const badge = screen.getByText("Critical");
		expect(badge).toBeInTheDocument();
		expect(badge.closest("div")).toHaveClass("bg-red-50", "text-red-600");
	});

	test("given a warning plant, should display warning status with yellow styling", () => {
		const plant = createTestPlant({ status: "warning" });

		render(<CareStatusBadge plant={plant} />);

		const badge = screen.getByText("Warning");
		expect(badge).toBeInTheDocument();
		expect(badge.closest("div")).toHaveClass("bg-yellow-50", "text-yellow-600");
	});

	test("given a dormant plant, should display healthy status with green styling (dormant not implemented)", () => {
		const plant = createTestPlant({ status: "dormant" });

		render(<CareStatusBadge plant={plant} />);

		const badge = screen.getByText("Healthy");
		expect(badge).toBeInTheDocument();
		expect(badge.closest("div")).toHaveClass("bg-green-50", "text-green-600");
	});

	test("given showIcon is true, should display status icon", () => {
		const plant = createTestPlant({ status: "healthy" });

		render(<CareStatusBadge plant={plant} showIcon={true} />);

		const icon = screen.getByRole("img", { name: "Healthy status" });
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveTextContent("🌱");
	});

	test("given showIcon is false, should not display status icon", () => {
		const plant = createTestPlant({ status: "healthy" });

		render(<CareStatusBadge plant={plant} showIcon={false} />);

		const icon = screen.queryByRole("img", { name: "Healthy status" });
		expect(icon).not.toBeInTheDocument();
	});

	test("given size is sm, should apply small size classes", () => {
		const plant = createTestPlant({ status: "healthy" });

		render(<CareStatusBadge plant={plant} size="sm" />);

		const badge = screen.getByText("Healthy");
		expect(badge.closest("div")).toHaveClass("px-2", "py-1", "text-xs");
	});

	test("given size is md, should apply medium size classes", () => {
		const plant = createTestPlant({ status: "healthy" });

		render(<CareStatusBadge plant={plant} size="md" />);

		const badge = screen.getByText("Healthy");
		expect(badge.closest("div")).toHaveClass("px-3", "py-1.5", "text-sm");
	});

	test("given size is lg, should apply large size classes", () => {
		const plant = createTestPlant({ status: "healthy" });

		render(<CareStatusBadge plant={plant} size="lg" />);

		const badge = screen.getByText("Healthy");
		expect(badge.closest("div")).toHaveClass("px-4", "py-2", "text-base");
	});

	test("given custom className, should apply additional classes", () => {
		const plant = createTestPlant({ status: "healthy" });

		render(<CareStatusBadge plant={plant} className="custom-class" />);

		const badge = screen.getByText("Healthy");
		expect(badge.closest("div")).toHaveClass("custom-class");
	});

	test("given different plant statuses, should display correct icons", () => {
		const testCases = [
			{
				status: "critical" as const,
				expectedIcon: "🚨",
				expectedStatusText: "Critical",
			},
			{
				status: "warning" as const,
				expectedIcon: "⚠️",
				expectedStatusText: "Warning",
			},
			{
				status: "dormant" as const,
				expectedIcon: "😴",
				expectedStatusText: "Healthy",
			}, // dormant shows as healthy
			{
				status: "healthy" as const,
				expectedIcon: "🌱",
				expectedStatusText: "Healthy",
			},
		];

		testCases.forEach(({ status, expectedIcon, expectedStatusText }) => {
			const plant = createTestPlant({ status });
			const { unmount } = render(
				<CareStatusBadge plant={plant} showIcon={true} />
			);

			const icon = screen.getByRole("img", {
				name: `${expectedStatusText} status`,
			});
			expect(icon).toHaveTextContent(expectedIcon);

			unmount();
		});
	});
});
