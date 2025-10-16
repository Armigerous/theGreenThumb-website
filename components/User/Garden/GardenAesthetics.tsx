import { Label } from "@/components/ui/label";
import { UserGardens, getFilterOptions } from "@/types/garden";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * GardenAesthetics Component - Flower & Foliage Details
 *
 * Database field mapping:
 * - flowerColorIds -> flower_color_ids (jsonb array) in userGardens table
 * - flowerBloomTimeIds -> flower_bloom_time_ids (jsonb array) in userGardens table
 * - flowerValueIds -> flower_value_ids (jsonb array) in userGardens table
 * - leafFeelIds -> leaf_feel_ids (jsonb array) in userGardens table
 * - leafColorIds -> leaf_color_ids (jsonb array) in userGardens table
 * - leafValueIds -> leaf_value_ids (jsonb array) in userGardens table
 * - fallColorIds -> fall_color_ids (jsonb array) in userGardens table
 */
interface GardenAestheticsProps {
	settings: UserGardens;
	setSettings: React.Dispatch<React.SetStateAction<UserGardens>>;
}

const GardenAesthetics = ({ settings, setSettings }: GardenAestheticsProps) => {
	const flowerColorOptions = getFilterOptions("flower-color");
	const flowerBloomTimeOptions = getFilterOptions("flower-bloom-time");
	const flowerValueOptions = getFilterOptions("flower-value-to-gardener");
	const leafFeelOptions = getFilterOptions("leaf-feel");
	const leafColorOptions = getFilterOptions("leaf-color");
	const leafValueOptions = getFilterOptions("leaf-value-to-gardener");
	const fallColorOptions = getFilterOptions("deciduous-leaf-fall-color");

	const handleFlowerColorChange = (color: string, checked: boolean) => {
		if (checked) {
			setSettings({
				...settings,
				flowerColorIds: [...(settings.flowerColorIds || []), color],
			});
		} else {
			setSettings({
				...settings,
				flowerColorIds: (settings.flowerColorIds || []).filter(
					(c) => c !== color
				),
			});
		}
	};

	const handleFlowerBloomTimeChange = (time: string, checked: boolean) => {
		if (checked) {
			setSettings({
				...settings,
				flowerBloomTimeIds: [...(settings.flowerBloomTimeIds || []), time],
			});
		} else {
			setSettings({
				...settings,
				flowerBloomTimeIds: (settings.flowerBloomTimeIds || []).filter(
					(t) => t !== time
				),
			});
		}
	};

	const handleFlowerValueChange = (value: string, checked: boolean) => {
		if (checked) {
			setSettings({
				...settings,
				flowerValueIds: [...(settings.flowerValueIds || []), value],
			});
		} else {
			setSettings({
				...settings,
				flowerValueIds: (settings.flowerValueIds || []).filter(
					(v) => v !== value
				),
			});
		}
	};

	const handleLeafColorChange = (color: string, checked: boolean) => {
		if (checked) {
			setSettings({
				...settings,
				leafColorIds: [...(settings.leafColorIds || []), color],
			});
		} else {
			setSettings({
				...settings,
				leafColorIds: (settings.leafColorIds || []).filter((c) => c !== color),
			});
		}
	};

	const handleLeafValueChange = (value: string, checked: boolean) => {
		if (checked) {
			setSettings({
				...settings,
				leafValueIds: [...(settings.leafValueIds || []), value],
			});
		} else {
			setSettings({
				...settings,
				leafValueIds: (settings.leafValueIds || []).filter((v) => v !== value),
			});
		}
	};

	const handleFallColorChange = (color: string, checked: boolean) => {
		if (checked) {
			setSettings({
				...settings,
				fallColorIds: [...(settings.fallColorIds || []), color],
			});
		} else {
			setSettings({
				...settings,
				fallColorIds: (settings.fallColorIds || []).filter((c) => c !== color),
			});
		}
	};

	const handleLeafFeelChange = (feel: string, checked: boolean) => {
		if (checked) {
			setSettings({
				...settings,
				leafFeelIds: [...(settings.leafFeelIds || []), feel],
			});
		} else {
			setSettings({
				...settings,
				leafFeelIds: (settings.leafFeelIds || []).filter((f) => f !== feel),
			});
		}
	};

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="space-y-8">
					<div>
						<h3 className="text-lg font-paragraph-semibold mb-4">
							Flower-Related
						</h3>

						<div className="space-y-4 mb-6">
							<div className="space-y-2">
								<Label className="text-lg font-paragraph-semibold">
									Flower Color
								</Label>
								<p className="text-base text-primary font-paragraph-semibold">
									What flower colors would you like in your garden?
								</p>
								<p className="text-sm text-muted-foreground">
									Select the flower colors you prefer for your garden plants
								</p>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
								{flowerColorOptions.map((color) => (
									<div key={color} className="flex items-center space-x-2">
										<Checkbox
											id={`flower-color-${color}`}
											checked={(settings.flowerColorIds || []).includes(color)}
											onCheckedChange={(checked) =>
												handleFlowerColorChange(color, checked as boolean)
											}
										/>
										<Label
											htmlFor={`flower-color-${color}`}
											className="text-sm font-normal"
										>
											{color}
										</Label>
									</div>
								))}
							</div>
						</div>

						<div className="space-y-4 mb-6">
							<div className="space-y-2">
								<Label className="text-lg font-paragraph-semibold">
									Bloom Time
								</Label>
								<p className="text-base text-primary font-paragraph-semibold">
									When would you like your flowers to bloom?
								</p>
								<p className="text-sm text-muted-foreground">
									Select the seasons when you want flowers in your garden
								</p>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
								{flowerBloomTimeOptions.map((time) => (
									<div key={time} className="flex items-center space-x-2">
										<Checkbox
											id={`flower-bloom-${time}`}
											checked={(settings.flowerBloomTimeIds || []).includes(
												time
											)}
											onCheckedChange={(checked) =>
												handleFlowerBloomTimeChange(time, checked as boolean)
											}
										/>
										<Label
											htmlFor={`flower-bloom-${time}`}
											className="text-sm font-normal"
										>
											{time}
										</Label>
									</div>
								))}
							</div>
						</div>

						<div className="space-y-4">
							<div className="space-y-2">
								<Label className="text-lg font-paragraph-semibold">
									Flower Value
								</Label>
								<p className="text-base text-primary font-paragraph-semibold">
									What flower characteristics are most important to you?
								</p>
								<p className="text-sm text-muted-foreground">
									Select the flower qualities you value most
								</p>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
								{flowerValueOptions.map((value) => (
									<div key={value} className="flex items-center space-x-2">
										<Checkbox
											id={`flower-value-${value}`}
											checked={(settings.flowerValueIds || []).includes(value)}
											onCheckedChange={(checked) =>
												handleFlowerValueChange(value, checked as boolean)
											}
										/>
										<Label
											htmlFor={`flower-value-${value}`}
											className="text-sm font-normal"
										>
											{value}
										</Label>
									</div>
								))}
							</div>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-paragraph-semibold mb-4">
							Leaf-Related
						</h3>

						<div className="space-y-4">
							<div className="space-y-4 mb-6">
								<div className="space-y-2">
									<Label className="text-lg font-paragraph-semibold">
										Leaf Feel
									</Label>
									<p className="text-base text-primary font-paragraph-semibold">
										What leaf textures would you like in your garden?
									</p>
									<p className="text-sm text-muted-foreground">
										Select the leaf textures you prefer for your garden plants
									</p>
								</div>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
									{leafFeelOptions.map((feel) => (
										<div key={feel} className="flex items-center space-x-2">
											<Checkbox
												id={`leaf-feel-${feel}`}
												checked={(settings.leafFeelIds || []).includes(feel)}
												onCheckedChange={(checked) =>
													handleLeafFeelChange(feel, checked as boolean)
												}
											/>
											<Label
												htmlFor={`leaf-feel-${feel}`}
												className="text-sm font-normal"
											>
												{feel}
											</Label>
										</div>
									))}
								</div>
							</div>
						</div>
						<div className="space-y-4 mb-6">
							<div className="space-y-2">
								<Label className="text-lg font-paragraph-semibold">
									Leaf Color
								</Label>
								<p className="text-base text-primary font-paragraph-semibold">
									What leaf colors would you like in your garden?
								</p>
								<p className="text-sm text-muted-foreground">
									Select the foliage colors you prefer for your garden plants
								</p>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
								{leafColorOptions.map((color) => (
									<div key={color} className="flex items-center space-x-2">
										<Checkbox
											id={`leaf-color-${color}`}
											checked={(settings.leafColorIds || []).includes(color)}
											onCheckedChange={(checked) =>
												handleLeafColorChange(color, checked as boolean)
											}
										/>
										<Label
											htmlFor={`leaf-color-${color}`}
											className="text-sm font-normal"
										>
											{color}
										</Label>
									</div>
								))}
							</div>
						</div>

						<div className="space-y-4 mb-6">
							<div className="space-y-2">
								<Label className="text-lg font-paragraph-semibold">
									Leaf Value
								</Label>
								<p className="text-base text-primary font-paragraph-semibold">
									What leaf characteristics are most important to you?
								</p>
								<p className="text-sm text-muted-foreground">
									Select the foliage qualities you value most
								</p>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
								{leafValueOptions.map((value) => (
									<div key={value} className="flex items-center space-x-2">
										<Checkbox
											id={`leaf-value-${value}`}
											checked={(settings.leafValueIds || []).includes(value)}
											onCheckedChange={(checked) =>
												handleLeafValueChange(value, checked as boolean)
											}
										/>
										<Label
											htmlFor={`leaf-value-${value}`}
											className="text-sm font-normal"
										>
											{value}
										</Label>
									</div>
								))}
							</div>
						</div>

						<div className="space-y-4">
							<div className="space-y-2">
								<Label className="text-lg font-paragraph-semibold">
									Fall Color
								</Label>
								<p className="text-base text-primary font-paragraph-semibold">
									What fall colors would you like in your garden?
								</p>
								<p className="text-sm text-muted-foreground">
									Select the autumn foliage colors you prefer for deciduous
									plants
								</p>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
								{fallColorOptions.map((color) => (
									<div key={color} className="flex items-center space-x-2">
										<Checkbox
											id={`fall-color-${color}`}
											checked={(settings.fallColorIds || []).includes(color)}
											onCheckedChange={(checked) =>
												handleFallColorChange(color, checked as boolean)
											}
										/>
										<Label
											htmlFor={`fall-color-${color}`}
											className="text-sm font-normal"
										>
											{color}
										</Label>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default GardenAesthetics;
