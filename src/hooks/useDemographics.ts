import { useState, useEffect } from "react";
import { buildApiUrl } from "../config/api";

interface DemographicsData {
	population: number;
	medianIncome: number;
	medianAge: number;
	homeOwnershipRate: number;
	unemploymentRate: number;
	longCommuteRate: number;
	location: {
		city: string;
		state: string;
		zipCode: string;
	};
	dataYear?: string;
	dataSource?: string;
}

interface UseDemographicsResult {
	data: DemographicsData | null;
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

export const useDemographics = (address: string): UseDemographicsResult => {
	const [data, setData] = useState<DemographicsData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchDemographics = async (address: string) => {
		if (!address.trim()) {
			setData(null);
			setError(null);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const encodedAddress = encodeURIComponent(address);
			const response = await fetch(buildApiUrl(`/api/demographics/${encodedAddress}`));

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			if (result.success) {
				setData(result.data);
			} else {
				throw new Error(result.error || "Failed to fetch demographics data");
			}
		} catch (err) {
			console.error("Error fetching demographics:", err);
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
				fetchDemographics(address);
			}, 500);

			return () => clearTimeout(timeoutId);
		} else {
			setData(null);
			setError(null);
		}
	}, [address]);

	const refetch = () => {
		if (address) {
			fetchDemographics(address);
		}
	};

	return {
		data,
		loading,
		error,
		refetch,
	};
};
