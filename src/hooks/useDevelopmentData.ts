import { useState, useEffect, useCallback } from "react";
import { buildApiUrl } from "../config/api";
import type { DevelopmentData } from "../types";

export const useDevelopmentData = (
  propertyAddress: string,
  propertyType?: string,
  buildingSize?: string
) => {
  const [data, setData] = useState<DevelopmentData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!propertyAddress?.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(buildApiUrl("/api/developmentData/"), {
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

      const result = await response.json();

      if (!result.success) {
        throw new Error("Failed to analyse development data");
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      console.error("Development data fetch error:", err);
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [propertyAddress, propertyType, buildingSize]);

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
export default useDevelopmentData;