import { Label } from "@/components/ui/label";
import { UserGardens } from "@/types/garden";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

/**
 * GardenCustomization Component - Recommendations
 *
 * Database field mapping:
 * - wantsRecommendations -> wants_recommendations (boolean) in userGardens table
 */
interface GardenCustomizationProps {
	settings: UserGardens;
	setSettings: React.Dispatch<React.SetStateAction<UserGardens>>;
}

const GardenCustomization = ({
	settings,
	setSettings,
}: GardenCustomizationProps) => {
	// Ensure values exist
	const wantsRecommendations = settings?.wantsRecommendations ?? true;

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="space-y-6">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-lg font-paragraph-semibold">
								Recommendations
							</Label>
							<p className="text-base text-primary font-paragraph-semibold">
								Would you like to receive personalized plant recommendations?
							</p>
							<p className="text-sm text-muted-foreground">
								Toggle on to get suggestions based on your garden preferences
							</p>
						</div>
						<div className="flex items-center justify-between border rounded-md p-3 bg-muted/20">
							<Label
								htmlFor="wantsRecommendations"
								className="text-sm font-normal"
							>
								Enable personalized recommendations
							</Label>
							<Switch
								id="wantsRecommendations"
								checked={wantsRecommendations}
								onCheckedChange={(checked) =>
									setSettings({ ...settings, wantsRecommendations: checked })
								}
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default GardenCustomization;
