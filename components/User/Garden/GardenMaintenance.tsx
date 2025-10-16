import { Label } from "@/components/ui/label";
import { UserGardens, getFilterOptions } from "@/types/garden";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * GardenMaintenance Component - Whole Plant Traits
 *
 * Database field mapping:
 * - growthRateId -> growth_rate_id (bigint) in userGardens table
 * - maintenanceLevelId -> maintenance_level_id (bigint) in userGardens table
 * - texturePreferenceId -> texture_preference_id (bigint) in userGardens table
 * - habitFormIds -> habit_form_ids (jsonb array) in userGardens table
 * - plantTypeIds -> plant_type_ids (jsonb array) in userGardens table
 * - yearRoundInterest -> year_round_interest (boolean) in userGardens table
 */
interface GardenMaintenanceProps {
	settings: UserGardens;
	setSettings: React.Dispatch<React.SetStateAction<UserGardens>>;
}

const GardenMaintenance = ({
	settings,
	setSettings,
}: GardenMaintenanceProps) => {
	const growthRateOptions = getFilterOptions("growth-rate");
	const maintenanceOptions = getFilterOptions("maintenance");
	const textureOptions = getFilterOptions("texture");
	const habitFormOptions = getFilterOptions("habit-form");
	const plantTypeOptions = getFilterOptions("plant-type");

	const handleHabitFormChange = (form: string, checked: boolean) => {
		if (checked) {
			setSettings({
				...settings,
				habitFormIds: [...(settings.habitFormIds || []), form],
			});
		} else {
			setSettings({
				...settings,
				habitFormIds: (settings.habitFormIds || []).filter((f) => f !== form),
			});
		}
	};

	const handlePlantTypeChange = (type: string, checked: boolean) => {
		if (checked) {
			setSettings({
				...settings,
				plantTypeIds: [...(settings.plantTypeIds || []), type],
			});
		} else {
			setSettings({
				...settings,
				plantTypeIds: (settings.plantTypeIds || []).filter((t) => t !== type),
			});
		}
	};

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="space-y-6">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-lg font-paragraph-semibold">
								Growth Rate
							</Label>
							<p className="text-base text-primary font-paragraph-semibold">
								How quickly do you want your plants to grow?
							</p>
							<p className="text-sm text-muted-foreground">
								Select the preferred growth speed for your garden plants
							</p>
						</div>
						<Select
							value={settings.growthRateId?.toString() || ""}
							onValueChange={(value) =>
								setSettings({
									...settings,
									growthRateId: parseInt(value) || undefined,
								})
							}
						>
							<SelectTrigger
								id="growthRateId"
								className="border rounded-md bg-muted/20"
							>
								<SelectValue placeholder="Select growth rate" />
							</SelectTrigger>
							<SelectContent>
								{growthRateOptions.map((rate, index) => (
									<SelectItem key={rate} value={(index + 1).toString()}>
										{rate}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-lg font-paragraph-semibold">
								Maintenance Level
							</Label>
							<p className="text-base text-primary font-paragraph-semibold">
								How much time can you dedicate to garden maintenance?
							</p>
							<p className="text-sm text-muted-foreground">
								Select how much care you are willing to provide to your plants
							</p>
						</div>
						<Select
							value={settings.maintenanceLevelId?.toString() || ""}
							onValueChange={(value) =>
								setSettings({
									...settings,
									maintenanceLevelId: parseInt(value) || undefined,
								})
							}
						>
							<SelectTrigger
								id="maintenanceLevelId"
								className="border rounded-md bg-muted/20"
							>
								<SelectValue placeholder="Select maintenance level" />
							</SelectTrigger>
							<SelectContent>
								{maintenanceOptions.map((level, index) => (
									<SelectItem key={level} value={(index + 1).toString()}>
										{level}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-lg font-paragraph-semibold">
								Texture Preference
							</Label>
							<p className="text-base text-primary font-paragraph-semibold">
								What overall plant texture do you prefer?
							</p>
							<p className="text-sm text-muted-foreground">
								Select the general texture you want for your garden plants
							</p>
						</div>
						<Select
							value={settings.texturePreferenceId?.toString() || ""}
							onValueChange={(value) =>
								setSettings({
									...settings,
									texturePreferenceId: parseInt(value) || undefined,
								})
							}
						>
							<SelectTrigger
								id="texturePreferenceId"
								className="border rounded-md bg-muted/20"
							>
								<SelectValue placeholder="Select texture preference" />
							</SelectTrigger>
							<SelectContent>
								{textureOptions.map((texture, index) => (
									<SelectItem key={texture} value={(index + 1).toString()}>
										{texture}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-lg font-paragraph-semibold">
								Plant Form
							</Label>
							<p className="text-base text-primary font-paragraph-semibold">
								What growth forms would you like in your garden?
							</p>
							<p className="text-sm text-muted-foreground">
								Select the shapes or growth patterns you prefer for your plants
							</p>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
							{habitFormOptions.map((form) => (
								<div key={form} className="flex items-center space-x-2">
									<Checkbox
										id={`habit-form-${form}`}
										checked={(settings.habitFormIds || []).includes(form)}
										onCheckedChange={(checked) =>
											handleHabitFormChange(form, checked as boolean)
										}
									/>
									<Label
										htmlFor={`habit-form-${form}`}
										className="text-sm font-normal"
									>
										{form}
									</Label>
								</div>
							))}
						</div>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-lg font-paragraph-semibold">
								Plant Type
							</Label>
							<p className="text-base text-primary font-paragraph-semibold">
								What types of plants would you like to include?
							</p>
							<p className="text-sm text-muted-foreground">
								Select the categories of plants you want in your garden
							</p>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
							{plantTypeOptions.map((type) => (
								<div key={type} className="flex items-center space-x-2">
									<Checkbox
										id={`plant-type-${type}`}
										checked={(settings.plantTypeIds || []).includes(type)}
										onCheckedChange={(checked) =>
											handlePlantTypeChange(type, checked as boolean)
										}
									/>
									<Label
										htmlFor={`plant-type-${type}`}
										className="text-sm font-normal"
									>
										{type}
									</Label>
								</div>
							))}
						</div>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-lg font-paragraph-semibold">
								Year-Round Interest
							</Label>
							<p className="text-base text-primary font-paragraph-semibold">
								Do you want plants that look good all year?
							</p>
							<p className="text-sm text-muted-foreground">
								Toggle on if you want plants that provide visual interest
								throughout the year
							</p>
						</div>
						<div className="flex items-center justify-between border rounded-md p-3 bg-muted/20">
							<Label
								htmlFor="yearRoundInterest"
								className="text-sm font-normal"
							>
								Enable year-round visual interest
							</Label>
							<Switch
								id="yearRoundInterest"
								checked={settings.yearRoundInterest || false}
								onCheckedChange={(checked) =>
									setSettings({ ...settings, yearRoundInterest: checked })
								}
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default GardenMaintenance;
