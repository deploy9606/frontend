import React from "react";
import type { AnalysisType, PropertyData } from "../../../types";

interface PropertyFormProps {
	propertyAddress: string;
	propertyType: PropertyData["type"];
	squareFootage: string;
	acreage: string;
	buildingFeatures: string;
	analysisType: AnalysisType;
	useAiScoring: boolean;
	loading: boolean;
	onPropertyAddressChange: (value: string) => void;
	onPropertyTypeChange: (value: PropertyData["type"]) => void;
	onSquareFootageChange: (value: string) => void;
	onAcreageChange: (value: string) => void;
	onBuildingFeaturesChange: (value: string) => void;
	onAnalysisTypeChange: (value: AnalysisType) => void;
	onUseAiScoringChange: (value: boolean) => void;
	onSubmit: (e: React.FormEvent) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
	propertyAddress,
	propertyType,
	squareFootage,
	acreage,
	buildingFeatures,
	analysisType,
	useAiScoring,
	loading,
	onPropertyAddressChange,
	onPropertyTypeChange,
	onSquareFootageChange,
	onAcreageChange,
	onBuildingFeaturesChange,
	onAnalysisTypeChange,
	onUseAiScoringChange,
	onSubmit,
}) => {
	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="md:col-span-2">
					<label
						htmlFor="propertyAddress"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Property Address
					</label>
					<input
						type="text"
						id="propertyAddress"
						value={propertyAddress}
						onChange={(e) => onPropertyAddressChange(e.target.value)}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
						placeholder="e.g., 123 Industrial Way, City, State ZIP"
						required
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
						value={propertyType}
						onChange={(e) => onPropertyTypeChange(e.target.value as PropertyData["type"])}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
					>
						<option value="warehouse">Warehouse/Distribution</option>
						<option value="manufacturing">Manufacturing</option>
						<option value="flex">Flex Space</option>
						<option value="cold-storage">Cold Storage</option>
						<option value="ios">Industrial Outdoor Storage (IOS)</option>
						<option value="rd">R&D Facility</option>
						<option value="data-center">Data Center</option>
					</select>
				</div>

				<div>
					<label
						htmlFor="analysisType"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Analysis Type
					</label>
					<select
						id="analysisType"
						value={analysisType}
						onChange={(e) => onAnalysisTypeChange(e.target.value as AnalysisType)}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
					>
						<option value="full">Full Analysis (Top 20 Tenants)</option>
						<option value="property-verification">Property Verification Only</option>
						<option value="market-analysis">Market Analysis</option>
						<option value="tenant-ranking">Tenant Ranking</option>
					</select>
				</div>

				<div>
					<label
						htmlFor="squareFootage"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Square Footage
					</label>
					<input
						type="number"
						id="squareFootage"
						value={squareFootage}
						onChange={(e) => onSquareFootageChange(e.target.value)}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
						placeholder="e.g., 50000"
					/>
				</div>

				<div>
					<label
						htmlFor="acreage"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Acreage
					</label>
					<input
						type="number"
						step="0.1"
						id="acreage"
						value={acreage}
						onChange={(e) => onAcreageChange(e.target.value)}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
						placeholder="e.g., 5.5"
					/>
				</div>

				<div className="md:col-span-2">
					<label
						htmlFor="buildingFeatures"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Building Features (separated by commas)
					</label>
					<textarea
						id="buildingFeatures"
						value={buildingFeatures}
						onChange={(e) => onBuildingFeaturesChange(e.target.value)}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
						rows={3}
						placeholder="e.g., 36ft clear height, rail access, 10 loading docks, highway proximity"
					/>
				</div>

				{/* AI Scoring Option */}
				<div className="md:col-span-2">
					<div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
						<div>
							<label className="text-sm font-medium text-blue-700">
								Enable AI Scoring
							</label>
							<p className="text-xs text-blue-600 mt-1">
								Use advanced AI analysis for more detailed tenant scoring and insights
							</p>
						</div>
						<button
							type="button"
							onClick={() => onUseAiScoringChange(!useAiScoring)}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								useAiScoring ? "bg-blue-600" : "bg-gray-300"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									useAiScoring ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>
				</div>
			</div>

			<button
				type="submit"
				disabled={loading}
				className="w-full bg-blue-600 text-white p-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold text-lg transition-colors"
			>
				{loading ? "Analyzing Property & Identifying Tenants..." : "Start AI Analysis"}
			</button>
		</form>
	);
};

export default PropertyForm;
