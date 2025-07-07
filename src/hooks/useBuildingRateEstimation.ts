import { useState, useCallback } from "react";
import { buildApiUrl } from "../config/api";

interface BuildingRateEstimation {
	estimatedRate: number;
	confidence: "high" | "medium" | "low";
	estimatedLowerEnd?: number;
	estimatedUpperEnd?: number;
	error?: boolean;
}

interface BuildingRateResponse {
	success: boolean;
	data: BuildingRateEstimation;
	dataOpenAI: BuildingRateEstimation;
	timestamp: string;
}

export const useBuildingRateEstimation = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const estimateBuildingRate = useCallback(
		async (
			propertyAddress: string,
			propertyType?: string,
			buildingSize?: string
		): Promise<{geminiEstimate: BuildingRateEstimation;
			openAIEstimate: BuildingRateEstimation;} | null> => {
			if (!propertyAddress?.trim()) {
				return null;
			}

			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(buildApiUrl("/api/building-rate/estimate-building"), {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						propertyAddress: propertyAddress.trim(),
						propertyType,
						buildingSize,
					}),
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const result: BuildingRateResponse = await response.json();

				if (!result.success) {
					throw new Error("Failed to estimate building rate");
				}
				console.log("Building rate estimation result:", result.data);

				return {geminiEstimate: result.data, openAIEstimate: result.dataOpenAI};
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "An error occurred";
				setError(errorMessage);
				console.error("Building rate estimation error:", err);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		estimateBuildingRate,
		isLoading,
		error,
	};
};
