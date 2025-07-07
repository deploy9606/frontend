import { useState, useCallback, useEffect } from "react";
import { buildApiUrl } from "../config/api";
import type { CapRateAnalysis } from "../types";

interface MarketDataResponse {
    data: CapRateAnalysis | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;

}

export const useMarketDataEstimation = (address: string): MarketDataResponse => {
    const [data, setData] = useState<CapRateAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMarketData = async (address: string) => {
        if (!address.trim()) {
            setData(null);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const encodedAddress = encodeURIComponent(address);
            const response = await fetch(buildApiUrl(`/api/marketData/${encodedAddress}`));

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("No market data available for this location");
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setData(result.data);
            } else {
                throw new Error(result.error || "Failed to fetch market data");
            }
        } catch (err) {
            console.error("Error fetching market data:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (address) {
            // Debounce les appels API
            const timeoutId = setTimeout(() => {
                fetchMarketData(address);
            }, 500);

            return () => clearTimeout(timeoutId);
        } else {
            setData(null);
            setError(null);
        }
    }, [address]);

    const refetch = () => {
        if (address) {
            fetchMarketData(address);
        }
    };

    return {
        data,
        loading,
        error,
        refetch,
    };
};
