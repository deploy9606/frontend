import { useState, useCallback } from "react";
import { buildApiUrl } from "../config/api";

interface LandRateEstimation {
    averageMarketRate: number;
    confidence: "high" | "medium" | "low";
    estimatedLowerEnd?: number;
    estimatedUpperEnd?: number;
    error?: boolean;
}

interface LandRateResponse {
    success: boolean;
    data: LandRateEstimation;
    dataOpenAI: LandRateEstimation;
    timestamp: string;
}

export const useLandRateEstimation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const estimateLandRate = useCallback(
        async (
            propertyAddress: string,
            propertyType?: string,
            buildingSize?: string
        ): Promise<{geminiEstimate: LandRateEstimation;
            openAIEstimate: LandRateEstimation;} | null> => {
            if (!propertyAddress?.trim()) {
                return null;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(buildApiUrl("/api/land-rate/estimate-land"), {
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

                const result: LandRateResponse = await response.json();

                if (!result.success) {
                    throw new Error("Failed to estimate land rate");
                }
                console.log("Land rate estimation result:", result.data);

                return {geminiEstimate: result.data, openAIEstimate: result.dataOpenAI};
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An error occurred";
                setError(errorMessage);
                console.error("Land rate estimation error:", err);
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return {
        estimateLandRate,
        isLoading,
        error,
    };
};
