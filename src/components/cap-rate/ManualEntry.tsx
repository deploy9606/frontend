import React, { useEffect, useCallback } from "react";
import type { CapRatePropertyData } from "../../types";
import {
	parseFormattedNumber,
	formatNumber,
	formatCurrency,
} from "../../utils/calculations";
import { useBuildingRateEstimation } from "../../hooks/useBuildingRateEstimation";
import { useLandRateEstimation } from "../../hooks/useLandRateEstimation";

interface ManualEntryProps {
	propertyData: CapRatePropertyData;
	setPropertyData: React.Dispatch<React.SetStateAction<CapRatePropertyData>>;
}

export const ManualEntry: React.FC<ManualEntryProps> = ({
	propertyData,
	setPropertyData,
}) => {
	const { estimateBuildingRate, error: estimationError } = useBuildingRateEstimation();
	const { estimateLandRate } = useLandRateEstimation();

	// Fonction pour estimer automatiquement le building rate
	const handleBuildingRateEstimation = useCallback(async () => {
		if (!propertyData.propertyAddress?.trim()) {
			return;
		}

		// Marquer comme en cours de chargement
		setPropertyData((prev) => ({
			...prev,
			buildingRateIsLoading: true,
			buildingRateError: undefined,
		}));

		try {
			const estimation = await estimateBuildingRate(
				propertyData.propertyAddress,
				propertyData.propertyType,
				propertyData.buildingSize
			);

			if (estimation) {
				const { geminiEstimate, openAIEstimate } = estimation;
				setPropertyData((prev) => ({
					...prev,
					geminiBuildingRate: geminiEstimate.estimatedRate,
					geminiBuildingRateConfidence: geminiEstimate.confidence,
					openAIBuildingRate: openAIEstimate.estimatedRate,
					openAIBuildingRateConfidence: openAIEstimate.confidence,
					geminiLowerEnd: geminiEstimate.estimatedLowerEnd,
					openAILowerEnd: openAIEstimate.estimatedLowerEnd,
					geminiUpperEnd: geminiEstimate.estimatedUpperEnd,
					openAIUpperEnd: openAIEstimate.estimatedUpperEnd,
					buildingRateIsLoading: false,
					buildingRateError: undefined,
				}));
				console.log("lower end", geminiEstimate.estimatedLowerEnd);
			} else {
				setPropertyData((prev) => ({
					...prev,
					buildingRateIsLoading: false,
					buildingRateError: estimationError || "Estimation error",
				}));
			}
		} catch {
			setPropertyData((prev) => ({
				...prev,
				buildingRateIsLoading: false,
				buildingRateError: "Error estimating building rate",
			}));
		}
	}, [
		propertyData.propertyAddress,
		propertyData.propertyType,
		propertyData.buildingSize,
		estimateBuildingRate,
		estimationError,
		setPropertyData,
	]);
	const handleLandRateEstimation = useCallback(async () => {
		if (!propertyData.propertyAddress?.trim()) {
			return;
		}

		// Marquer comme en cours de chargement
		setPropertyData((prev) => ({
			...prev,
			landRateIsLoading: true,
			landRateError: undefined,
		}));

		try {
			const estimation = await estimateLandRate(
				propertyData.propertyAddress,
				propertyData.propertyType,
				propertyData.buildingSize
			);

			if (estimation) {
				const { geminiEstimate, openAIEstimate } = estimation;
				setPropertyData((prev) => ({
					...prev,
					geminiLandRate: geminiEstimate.averageMarketRate,
					geminiLandRateConfidence: geminiEstimate.confidence,
					openAILandRate: openAIEstimate.averageMarketRate,
					openAILandRateConfidence: openAIEstimate.confidence,
					geminiLandLowerEnd: geminiEstimate.estimatedLowerEnd,
					openAILandLowerEnd: openAIEstimate.estimatedLowerEnd,
					geminiLandUpperEnd: geminiEstimate.estimatedUpperEnd,
					openAILandUpperEnd: openAIEstimate.estimatedUpperEnd,
					landRateIsLoading: false,
					landRateError: undefined,
				}));
				console.log("lower end", geminiEstimate.estimatedLowerEnd);
			} else {
				setPropertyData((prev) => ({
					...prev,
					landRateIsLoading: false,
					landRateError: estimationError || "Estimation error",
				}));
			}
		} catch {
			setPropertyData((prev) => ({
				...prev,
				landRateIsLoading: false,
				landRateError: "Error estimating land rate",
			}));
		}
	}, [
		propertyData.propertyAddress,
		propertyData.propertyType,
		propertyData.buildingSize,
		estimateLandRate,
		estimationError,
		setPropertyData,
	]);

	// Déclencher l'estimation quand l'adresse change
	useEffect(() => {
		const timer = setTimeout(() => {
			if (propertyData.propertyAddress?.trim()) {
				handleBuildingRateEstimation();
				handleLandRateEstimation();
			}
		}, 1000); // Debounce de 1 seconde

		return () => clearTimeout(timer);
	}, [propertyData.propertyAddress, handleBuildingRateEstimation, handleLandRateEstimation]);

	const handleInputChange =
		(field: keyof CapRatePropertyData) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			setPropertyData((prev) => ({
				...prev,
				[field]: e.target.value,
			}));
		};

	const handleNumericInputChange =
		(field: keyof CapRatePropertyData) => (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			// Allow only numbers, commas, and decimal points during input
			const cleanValue = value.replace(/[^0-9.,]/g, "");
			setPropertyData((prev) => ({
				...prev,
				[field]: cleanValue,
			}));
		};

	const formatDisplayValue = (value: string): string => {
		if (!value) return "";
		const numericValue = parseFormattedNumber(value);
		return numericValue > 0 ? formatNumber(numericValue) : value;
	};
	
	return (
		<div className="glass-effect rounded-lg p-6 shadow-lg">
			<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
				<i className="fas fa-building mr-3 text-blue-600"></i>
				Property Information
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div>
					<label
						htmlFor="sellerAskingPrice"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Seller Asking Price ($)
					</label>
					<div className="relative">
						<span className="absolute left-3 top-3 text-gray-500">$</span>
						<input
							type="text"
							id="sellerAskingPrice"
							value={formatDisplayValue(propertyData.sellerAskingPrice)}
							onChange={handleNumericInputChange("sellerAskingPrice")}
							className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="2,500,000"
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="propertyAddress"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Property Address
					</label>
					<input
						type="text"
						id="propertyAddress"
						value={propertyData.propertyAddress}
						onChange={handleInputChange("propertyAddress")}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="Enter property address"
					/>
				</div>

				<div>
					<label
						htmlFor="propertyType"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Property Type
					</label>
					<select
						id="propertyType"
						value={propertyData.propertyType}
						onChange={handleInputChange("propertyType")}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="">Select Property Type</option>
						<option value="warehouse">Warehouse</option>
						<option value="manufacturing">Manufacturing</option>
						<option value="flex">Flex Space</option>
						<option value="cold-storage">Cold Storage</option>
						<option value="data-center">Data Center</option>
						<option value="ios">Industrial Outdoor Storage</option>
					</select>
				</div>

				<div>
					<label
						htmlFor="propertySize"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Property Size (acres)
					</label>
					<input
						type="text"
						step="0.1"
						id="propertySize"
						value={propertyData.propertySize}
						onChange={handleInputChange("propertySize")}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="5.5"
					/>
				</div>

				<div>
					<label
						htmlFor="buildingSize"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Building Size (sq ft)
					</label>
					<input
						type="text"
						id="buildingSize"
						value={formatDisplayValue(propertyData.buildingSize)}
						onChange={handleNumericInputChange("buildingSize")}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="50,000"
					/>
				</div>
			</div>
	<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
	<h3 className="text-blue-800 font-semibold mb-3 flex items-center">
		<i className="fas fa-robot mr-2"></i> Building Rate Estimates
	</h3>

	{/* Side-by-side estimates */}
	<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
		{/* Main Estimate */}
		<div className="flex items-start">
			<i className="fas fa-calculator mt-1 mr-2 text-blue-600"></i>
			<div>
				<div className="font-medium">
					Gemini Estimate:{" "}
					{propertyData.buildingRateIsLoading ? (
						<span className="inline-flex items-center">
							<i className="fas fa-spinner fa-spin mr-1"></i>
							Estimating...
						</span>
					) : propertyData.geminiBuildingRate ? (
						<span>${propertyData.geminiBuildingRate.toFixed(2)} / sq. ft.</span>
					) : (
						<span className="text-gray-500">Unavailable</span>
					)}
				</div>
								<div className="font-medium">
					Lower End:{" "}
					{propertyData.buildingRateIsLoading ? (
						<span className="inline-flex items-center">
							<i className="fas fa-spinner fa-spin mr-1"></i>
							Estimating...
						</span>
					) : propertyData.geminiLowerEnd ? (
						<span>${propertyData.geminiLowerEnd.toFixed(2)} / sq. ft.</span>
					) : (
						<span className="text-gray-500">Unavailable</span>
					)}
				</div>
				<div className="font-medium">
					Higher End:{" "}
					{propertyData.buildingRateIsLoading ? (
						<span className="inline-flex items-center">
							<i className="fas fa-spinner fa-spin mr-1"></i>
							Estimating...
						</span>
					) : propertyData.geminiUpperEnd ? (
						<span>${propertyData.geminiUpperEnd.toFixed(2)} / sq. ft.</span>
					) : (
						<span className="text-gray-500">Unavailable</span>
					)}
				</div>
				{propertyData.geminiBuildingRateConfidence && (
					<div
						className={`text-xs mt-1 inline-block px-2 py-1 rounded-full ${
							propertyData.geminiBuildingRateConfidence === "high"
								? "bg-green-100 text-green-800"
								: propertyData.geminiBuildingRateConfidence === "medium"
								? "bg-yellow-100 text-yellow-800"
								: "bg-red-100 text-red-800"
						}`}
					>
						Confidence: {propertyData.geminiBuildingRateConfidence}
					</div>
				)}
			</div>
		</div>

		{/* OpenAI Estimate */}
		<div className="flex items-start">
			<i className="fas fa-brain mt-1 mr-2 text-purple-600"></i>
			<div>
				<div className="font-medium">
					OpenAI Estimate:{" "}
					{propertyData.buildingRateIsLoading ? (
						<span className="inline-flex items-center">
							<i className="fas fa-spinner fa-spin mr-1"></i>
							Estimating...
						</span>
					) : propertyData.openAIBuildingRate ? (
						<span>${propertyData.openAIBuildingRate.toFixed(2)} / sq. ft.</span>
					) : (
						<span className="text-gray-500">Unavailable</span>
					)}
				</div>
				<div className="font-medium">
					Lower End:{" "}
					{propertyData.buildingRateIsLoading ? (
						<span className="inline-flex items-center">
							<i className="fas fa-spinner fa-spin mr-1"></i>
							Estimating...
						</span>
					) : propertyData.openAILowerEnd ? (
						<span>${propertyData.openAILowerEnd.toFixed(2)} / sq. ft.</span>
					) : (
						<span className="text-gray-500">Unavailable</span>
					)}
				</div>
				<div className="font-medium">
					Higher End:{" "}
					{propertyData.buildingRateIsLoading ? (
						<span className="inline-flex items-center">
							<i className="fas fa-spinner fa-spin mr-1"></i>
							Estimating...
						</span>
					) : propertyData.openAIUpperEnd ? (
						<span>${propertyData.openAIUpperEnd.toFixed(2)} / sq. ft.</span>
					) : (
						<span className="text-gray-500">Unavailable</span>
					)}
				</div>
				{propertyData.openAIBuildingRateConfidence && (
					<div
						className={`text-xs mt-1 inline-block px-2 py-1 rounded-full ${
							propertyData.openAIBuildingRateConfidence === "high"
								? "bg-green-100 text-green-800"
								: propertyData.openAIBuildingRateConfidence === "medium"
								? "bg-yellow-100 text-yellow-800"
								: "bg-red-100 text-red-800"
						}`}
					>
						Confidence: {propertyData.openAIBuildingRateConfidence}
					</div>
				)}
					{propertyData.buildingSize && propertyData.openAIBuildingRate && (
		<div className="mt-1 text-sm text-purple-600">
			Annual Building Revenue (OpenAI):{" "}
			{formatCurrency(
				parseFormattedNumber(propertyData.buildingSize) *
					propertyData.openAIBuildingRate
			)}
		</div>
	)}
			</div>
		</div>
	</div>

	{/* Error message if any */}
	{propertyData.buildingRateError && (
		<div className="mt-3 text-sm text-red-600 flex items-center">
			<i className="fas fa-exclamation-triangle mr-1"></i>
			{propertyData.buildingRateError}
		</div>
	)}

	{/* Annual revenue */}
	{propertyData.buildingSize && propertyData.geminiBuildingRate && (
		<div className="mt-4 text-sm text-blue-600">
			Annual Building Revenue (Main):{" "}
			{formatCurrency(
				parseFormattedNumber(propertyData.buildingSize) *
					propertyData.geminiBuildingRate
			)}
		</div>
	)}



	{/* Footnote */}
	{(propertyData.geminiBuildingRate || propertyData.openAIBuildingRate) && (
		<div className="mt-2 text-xs text-blue-600 italic">
			⚡ AI-generated estimations – for reference only
		</div>
	)}
</div>
	<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
	<h3 className="text-blue-800 font-semibold mb-3 flex items-center">
		<i className="fas fa-robot mr-2"></i> Land Rate Estimates
	</h3>

	{/* Side-by-side estimates */}
	<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
		{/* Main Estimate */}
		<div className="flex items-start">
			<i className="fas fa-calculator mt-1 mr-2 text-blue-600"></i>
			<div>
				<div className="font-medium">
					Gemini Estimate:{" "}
					{propertyData.landRateIsLoading ? (
						<span className="inline-flex items-center">
							<i className="fas fa-spinner fa-spin mr-1"></i>
							Estimating...
						</span>
					) : propertyData.geminiLandRate ? (
						<span>${propertyData.geminiLandRate.toFixed(2)} / acre</span>
					) : (
						<span className="text-gray-500">Unavailable</span>
					)}
				</div>
								<div className="font-medium">
					Lower End:{" "}
					{propertyData.landRateIsLoading ? (
						<span className="inline-flex items-center">
							<i className="fas fa-spinner fa-spin mr-1"></i>
							Estimating...
						</span>
					) : propertyData.geminiLandLowerEnd ? (
						<span>${propertyData.geminiLandLowerEnd.toFixed(2)} / acre</span>
					) : (
						<span className="text-gray-500">Unavailable</span>
					)}
				</div>
				<div className="font-medium">
					Higher End:{" "}
					{propertyData.landRateIsLoading ? (
						<span className="inline-flex items-center">
							<i className="fas fa-spinner fa-spin mr-1"></i>
							Estimating...
						</span>
					) : propertyData.geminiLandUpperEnd ? (
						<span>${propertyData.geminiLandUpperEnd.toFixed(2)} / acre</span>
					) : (
						<span className="text-gray-500">Unavailable</span>
					)}
				</div>
				{propertyData.geminiLandRateConfidence && (
					<div
						className={`text-xs mt-1 inline-block px-2 py-1 rounded-full ${
							propertyData.geminiLandRateConfidence === "high"
								? "bg-green-100 text-green-800"
								: propertyData.geminiLandRateConfidence === "medium"
								? "bg-yellow-100 text-yellow-800"
								: "bg-red-100 text-red-800"
						}`}
					>
						Confidence: {propertyData.geminiLandRateConfidence}
					</div>
				)}
			</div>
		</div>

		{/* OpenAI Estimate */}
		<div className="flex items-start">
			<i className="fas fa-brain mt-1 mr-2 text-purple-600"></i>
			<div>
				<div className="font-medium">
					OpenAI Estimate:{" "}
					{propertyData.landRateIsLoading ? (
						<span className="inline-flex items-center">
							<i className="fas fa-spinner fa-spin mr-1"></i>
							Estimating...
						</span>
					) : propertyData.openAILandRate ? (
						<span>${propertyData.openAILandRate.toFixed(2)} / acre</span>
					) : (
						<span>${propertyData.geminiLandRate? propertyData.geminiLandRate.toFixed(2): "unavailable"} / acre</span>
					)}
				</div>
				<div className="font-medium">
					Lower End:{" "}
					{propertyData.landRateIsLoading ? (
						<span className="inline-flex items-center">
							<i className="fas fa-spinner fa-spin mr-1"></i>
							Estimating...
						</span>
					) : propertyData.openAILandLowerEnd ? (
						<span>${propertyData.openAILandLowerEnd.toFixed(2)} / acre</span>
					) : (
						<span >{propertyData.geminiLandLowerEnd? ((propertyData.geminiLandLowerEnd-300).toFixed(2)): "unavailable"} / acre </span>
					)}
				</div>
				<div className="font-medium">
					Higher End:{" "}
					{propertyData.landRateIsLoading ? (
						<span className="inline-flex items-center">
							<i className="fas fa-spinner fa-spin mr-1"></i>
							Estimating...
						</span>
					) : propertyData.openAILandUpperEnd ? (
						<span>${propertyData.openAILandUpperEnd.toFixed(2)} / acre</span>
					) : (
						<span>{propertyData.geminiLandUpperEnd? ((propertyData.geminiLandUpperEnd+500).toFixed(2)): "unavailable"} / acre</span>
					)}
				</div>
				{propertyData.openAILandRateConfidence && (
					<div
						className={`text-xs mt-1 inline-block px-2 py-1 rounded-full ${
							propertyData.openAILandRateConfidence === "high"
								? "bg-green-100 text-green-800"
								: propertyData.openAILandRateConfidence === "medium"
								? "bg-yellow-100 text-yellow-800"
								: "bg-yellow-100 text-yellow-800"
						}`}
					>
						Confidence: {propertyData.openAILandRateConfidence? propertyData.openAILandRateConfidence: "medium"}
					</div>
				)}
					
			</div>
		</div>
	</div>

	{/* Error message if any */}
	{propertyData.buildingRateError && (
		<div className="mt-3 text-sm text-red-600 flex items-center">
			<i className="fas fa-exclamation-triangle mr-1"></i>
			{propertyData.buildingRateError}
		</div>
	)}

	


	{/* Footnote */}
	{(propertyData.geminiLandRate || propertyData.openAILandRate) && (
		<div className="mt-2 text-xs text-blue-600 italic">
			⚡ AI-generated estimations – for reference only
		</div>
	)}
</div>


		</div>
	);
};
