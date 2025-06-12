import React from "react";
import type { CapRatePropertyData } from "../../types";
import { parseFormattedNumber, formatNumber } from "../../utils/calculations";

interface ManualEntryProps {
	propertyData: CapRatePropertyData;
	setPropertyData: React.Dispatch<React.SetStateAction<CapRatePropertyData>>;
}

export const ManualEntry: React.FC<ManualEntryProps> = ({
	propertyData,
	setPropertyData,
}) => {
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
		</div>
	);
};
