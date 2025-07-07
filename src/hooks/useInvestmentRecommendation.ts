import { useState, useEffect, useCallback } from "react";
import { buildApiUrl } from "../config/api";
import type { InvestmentRecommendationData } from "../types";

export const useInvestmentRecommendation = (
  propertyAddress: string,
  propertyType?: string,
  buildingSize?: string,
  askingPrice?: string,
) => {
  const [data, setData] = useState<InvestmentRecommendationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!propertyAddress?.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(buildApiUrl("/api/investment-recommendation/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyAddress: propertyAddress.trim(),
          propertyType,
          buildingSize,
          askingPrice,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error("Failed to analyse investment recommendation data");
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      console.error("Investment Recommendation fetch error:", err);
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [propertyAddress, propertyType, buildingSize, askingPrice]);

  // auto-fetch on mount or when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
export default useInvestmentRecommendation;