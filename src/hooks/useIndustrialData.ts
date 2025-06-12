import { useState, useEffect } from "react";
import { buildApiUrl } from "../config/api";

interface IndustrialData {
	location: {
		state: string;
	};
	countryBusinessPatterns: {
		transportation: {
			employees: number;
			establishments: number;
			payroll: number;
		};
		manufacturing: {
			employees: number;
			establishments: number;
			payroll: number;
		};
		warehousing: {
			employees: number;
			establishments: number;
			payroll: number;
		};
		trucking: {
			employees: number;
			establishments: number;
			payroll: number;
		};
	};
	employmentData: {
		totalEmployment: number;
		stableEmployment: number;
		employmentStabilityRate: string;
	};
	dataSource: string;
	dataYear?: string;
}

interface UseIndustrialDataResult {
	data: IndustrialData | null;
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

export const useIndustrialData = (address: string): UseIndustrialDataResult => {
	const [data, setData] = useState<IndustrialData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchIndustrialData = async (address: string) => {
		if (!address.trim()) {
			setData(null);
			setError(null);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const encodedAddress = encodeURIComponent(address);
			const response = await fetch(buildApiUrl(`/api/industrial/${encodedAddress}`));

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error("No industrial data available for this location");
				}
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			if (result.success) {
				setData(result.data);
			} else {
				throw new Error(result.error || "Failed to fetch industrial data");
			}
		} catch (err) {
			console.error("Error fetching industrial data:", err);
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
				fetchIndustrialData(address);
			}, 500);

			return () => clearTimeout(timeoutId);
		} else {
			setData(null);
			setError(null);
		}
	}, [address]);

	const refetch = () => {
		if (address) {
			fetchIndustrialData(address);
		}
	};

	return {
		data,
		loading,
		error,
		refetch,
	};
};
