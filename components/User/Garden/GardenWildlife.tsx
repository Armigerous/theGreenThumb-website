import { Label } from "@/components/ui/label";
import { UserGardens, getFilterOptions } from "@/types/garden";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * GardenWildlife Component
 *
 * Database field mapping:
 * - wildlifeAttractionIds -> wildlife_attraction_ids (jsonb array) in userGardens table
 * - resistanceChallengeIds -> resistance_challenge_ids (jsonb array) in userGardens table
 * - problemsToExcludeIds -> problems_to_exclude_ids (jsonb array) in userGardens table
 */
interface GardenWildlifeProps {
	settings: UserGardens;
	setSettings: React.Dispatch<React.SetStateAction<UserGardens>>;
}

const GardenWildlife = ({ settings, setSettings }: GardenWildlifeProps) => {
	const attractsOptions = getFilterOptions("attracts");
	const resistanceOptions = getFilterOptions("resistance-to-challenges");
	const problemsOptions = getFilterOptions("problems-to-exclude");

	const handleAttractsChange = (wildlife: string, checked: boolean) => {
		if (checked) {
			setSettings({
				...settings,
				wildlifeAttractionIds: [
					...(settings.wildlifeAttractionIds || []),
					wildlife,
				],
			});
		} else {
			setSettings({
				...settings,
				wildlifeAttractionIds: (settings.wildlifeAttractionIds || []).filter(
					(w) => w !== wildlife
				),
			});
		}
	};

	const handleResistanceChange = (resistance: string, checked: boolean) => {
		if (checked) {
			setSettings({
				...settings,
				resistanceChallengeIds: [
					...(settings.resistanceChallengeIds || []),
					resistance,
				],
			});
		} else {
			setSettings({
				...settings,
				resistanceChallengeIds: (settings.resistanceChallengeIds || []).filter(
					(r) => r !== resistance
				),
			});
		}
	};

	const handleProblemsChange = (problem: string, checked: boolean) => {
		if (checked) {
			setSettings({
				...settings,
				problemsToExcludeIds: [
					...(settings.problemsToExcludeIds || []),
					problem,
				],
			});
		} else {
			setSettings({
				...settings,
				problemsToExcludeIds: (settings.problemsToExcludeIds || []).filter(
					(p) => p !== problem
				),
			});
		}
	};

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="space-y-8">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-lg font-paragraph-semibold">
								Wildlife Attraction
							</Label>
							<p className="text-base text-primary font-paragraph-semibold">
								What wildlife would you like to attract to your garden?
							</p>
							<p className="text-sm text-muted-foreground">
								Select the types of wildlife you want your garden to attract
							</p>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
							{attractsOptions.map((wildlife) => (
								<div key={wildlife} className="flex items-center space-x-2">
									<Checkbox
										id={`wildlife-${wildlife}`}
										checked={(settings.wildlifeAttractionIds || []).includes(
											wildlife
										)}
										onCheckedChange={(checked) =>
											handleAttractsChange(wildlife, checked as boolean)
										}
									/>
									<Label
										htmlFor={`wildlife-${wildlife}`}
										className="text-sm font-normal"
									>
										{wildlife}
									</Label>
								</div>
							))}
						</div>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-lg font-paragraph-semibold">
								Plant Resistance
							</Label>
							<p className="text-base text-primary font-paragraph-semibold">
								What challenges should your plants be resistant to?
							</p>
							<p className="text-sm text-muted-foreground">
								Select environmental challenges or pests your plants need to
								resist
							</p>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
							{resistanceOptions.map((resistance) => (
								<div key={resistance} className="flex items-center space-x-2">
									<Checkbox
										id={`resistance-${resistance}`}
										checked={(settings.resistanceChallengeIds || []).includes(
											resistance
										)}
										onCheckedChange={(checked) =>
											handleResistanceChange(resistance, checked as boolean)
										}
									/>
									<Label
										htmlFor={`resistance-${resistance}`}
										className="text-sm font-normal"
									>
										{resistance}
									</Label>
								</div>
							))}
						</div>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-lg font-paragraph-semibold">
								Problems to Avoid
							</Label>
							<p className="text-base text-primary font-paragraph-semibold">
								What plant problems would you like to avoid?
							</p>
							<p className="text-sm text-muted-foreground">
								Select plant characteristics you explicitly want to exclude from
								your garden
							</p>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 border rounded-md p-3 bg-muted/20">
							{problemsOptions.map((problem) => (
								<div key={problem} className="flex items-center space-x-2">
									<Checkbox
										id={`problem-${problem}`}
										checked={(settings.problemsToExcludeIds || []).includes(
											problem
										)}
										onCheckedChange={(checked) =>
											handleProblemsChange(problem, checked as boolean)
										}
									/>
									<Label
										htmlFor={`problem-${problem}`}
										className="text-sm font-normal"
									>
										{problem}
									</Label>
								</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default GardenWildlife;
