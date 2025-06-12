import React from "react";
import type { CapRatePropertyData } from "../../types";
import { formatCurrency } from "../../utils/calculations";
import { useDemographics } from "../../hooks/useDemographics";
import { useIndustrialData } from "../../hooks/useIndustrialData";

interface MarketStudyProps {
	propertyData: CapRatePropertyData;
}

interface LocationInfo {
	city: string;
	state: string;
	county: string;
}

export const MarketStudy: React.FC<MarketStudyProps> = ({ propertyData }) => {
	// Hook pour obtenir les vraies données démographiques
	const {
		data: demographicsData,
		loading: demographicsLoading,
		error: demographicsError,
	} = useDemographics(propertyData.propertyAddress);

	// Hook pour obtenir les vraies données industrielles
	const {
		data: industrialData,
		loading: industrialLoading,
		error: industrialError,
	} = useIndustrialData(propertyData.propertyAddress);

	// Extract location info
	const getLocationInfo = (address: string): LocationInfo => {
		if (!address) return { city: "", state: "", county: "" };

		const parts = address.split(",").map((part) => part.trim());
		if (parts.length >= 2) {
			const stateZip = parts[parts.length - 1].split(" ");
			const state = stateZip[0] || "";
			const city = parts[parts.length - 2] || "";

			// For demo purposes, we'll simulate county data
			const countyMap: Record<string, string> = {
				IL: "Cook County",
				TX: "Harris County",
				CA: "Los Angeles County",
				FL: "Miami-Dade County",
				NY: "New York County",
			};

			return {
				city,
				state,
				county: countyMap[state] || `${state} County`,
			};
		}

		return { city: "", state: "", county: "" };
	};

	const locationInfo = getLocationInfo(propertyData.propertyAddress);

	if (!propertyData.propertyAddress) {
		return (
			<div className="glass-effect rounded-lg p-6 shadow-lg">
				<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
					<i className="fas fa-map-marker-alt mr-3 text-red-600"></i>
					Market Study
				</h2>
				<div className="text-center py-8">
					<i className="fas fa-map-marked-alt text-4xl text-gray-400 mb-4"></i>
					<p className="text-gray-600">
						Enter a property address to view market analysis
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="glass-effect rounded-lg p-6 shadow-lg">
			<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
				<i className="fas fa-map-marker-alt mr-3 text-red-600"></i>
				Market Study
			</h2>

			{/* Location Info */}
			<div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
				<h3 className="font-semibold text-blue-800 mb-2">
					<i className="fas fa-map-marker-alt mr-2"></i>
					Location Analysis
				</h3>
				<div className="text-sm text-blue-700">
					<strong>City:</strong> {locationInfo.city || "Unknown"} |
					<strong> State:</strong> {locationInfo.state || "Unknown"} |
					<strong> County:</strong> {locationInfo.county || "Unknown"}
				</div>
			</div>

			{/* Data Scope Information */}
			<div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
				<h3 className="font-semibold text-amber-800 mb-2 flex items-center">
					<i className="fas fa-info-circle mr-2"></i>
					Data Coverage & Scope
				</h3>
				<div className="text-sm text-amber-700 space-y-1">
					<div>
						<strong>Demographics:</strong> State-level aggregated data from U.S. Census
						Bureau
					</div>
					<div>
						<strong>Industrial Statistics:</strong> State-level business patterns and
						employment data
					</div>
				</div>
			</div>

			{/* Demographics Section - Only Real Data */}
			{(demographicsData || demographicsLoading || demographicsError) && (
				<div className="mb-8">
					<h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
						<i className="fas fa-users mr-2 text-blue-600"></i>
						Demographics -{" "}
						{locationInfo.state ? `${locationInfo.state} State` : "Local Area"} (U.S.
						Census Bureau)
					</h3>

					{demographicsError && (
						<div className="p-6 bg-red-50 rounded-lg border border-red-200 mb-4">
							<h4 className="font-semibold text-red-800 mb-2 flex items-center">
								<i className="fas fa-exclamation-triangle mr-2"></i>
								Error Loading Demographics
							</h4>
							<p className="text-red-600 text-sm">{demographicsError}</p>
						</div>
					)}

					{demographicsLoading && (
						<div className="p-6 bg-gray-50 rounded-lg border mb-4">
							<div className="flex items-center">
								<i className="fas fa-spinner fa-spin mr-2 text-blue-600"></i>
								<span>Loading demographics data...</span>
							</div>
						</div>
					)}

					{demographicsData && (
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="p-6 bg-green-50 rounded-lg border border-green-200">
									<h4 className="font-semibold text-green-800 mb-4 flex items-center">
										<i className="fas fa-chart-line mr-2"></i>
										Population & Housing
									</h4>
									<div className="space-y-3">
										<div className="flex justify-between">
											<span>Population:</span>
											<span className="font-semibold">
												{Math.round(demographicsData.population).toLocaleString()}
											</span>
										</div>
										<div className="flex justify-between">
											<span>Median Age:</span>
											<span className="font-semibold">
												{demographicsData.medianAge.toFixed(1)} years
											</span>
										</div>
										<div className="flex justify-between">
											<span>Home Ownership Rate:</span>
											<span className="font-semibold text-green-600">
												{demographicsData.homeOwnershipRate.toFixed(1)}%
											</span>
										</div>
									</div>
								</div>

								<div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
									<h4 className="font-semibold text-blue-800 mb-4 flex items-center">
										<i className="fas fa-dollar-sign mr-2"></i>
										Economic Indicators
									</h4>
									<div className="space-y-3">
										<div className="flex justify-between">
											<span>Median Household Income:</span>
											<span className="font-semibold">
												{formatCurrency(demographicsData.medianIncome)}
											</span>
										</div>
										<div className="flex justify-between">
											<span>Unemployment Rate:</span>
											<span className="font-semibold">
												{demographicsData.unemploymentRate.toFixed(1)}%
											</span>
										</div>
										<div className="flex justify-between">
											<span>Long Commute Rate:</span>
											<span className="font-semibold text-blue-600">
												{demographicsData.longCommuteRate.toFixed(1)}%
											</span>
										</div>
									</div>
								</div>
							</div>

							{demographicsData.dataYear && (
								<div className="p-4 bg-gray-50 rounded-lg border">
									<p className="text-xs text-gray-500">
										<i className="fas fa-database mr-1"></i>
										{demographicsData.dataSource ||
											"U.S. Census Bureau - American Community Survey"}{" "}
										({locationInfo.state} State) | Data year:{" "}
										{demographicsData.dataYear ||
											new Date(demographicsData.dataYear).getFullYear()}{" "}
									</p>
								</div>
							)}
						</div>
					)}
				</div>
			)}

			{/* Industrial Data Section - Only Real Data */}
			{(industrialData || industrialLoading || industrialError) && (
				<div className="mb-8">
					<h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
						<i className="fas fa-industry mr-2 text-purple-600"></i>
						Industrial Analysis - {industrialData?.location?.state ||
							locationInfo.state}{" "}
						State (County Business Patterns)
					</h3>

					{/* State-level notice */}
					<div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
						<p className="text-sm text-purple-700">
							<i className="fas fa-info-circle mr-2"></i>
							<strong>Note:</strong> Industrial statistics shown below are aggregated at
							the state level and represent the overall industrial landscape for{" "}
							{industrialData?.location?.state || locationInfo.state} state.
						</p>
					</div>

					{industrialError && (
						<div className="p-6 bg-red-50 rounded-lg border border-red-200 mb-4">
							<h4 className="font-semibold text-red-800 mb-2 flex items-center">
								<i className="fas fa-exclamation-triangle mr-2"></i>
								Error Loading Industrial Data
							</h4>
							<p className="text-red-600 text-sm">{industrialError}</p>
						</div>
					)}

					{industrialLoading && (
						<div className="p-6 bg-gray-50 rounded-lg border mb-4">
							<div className="flex items-center">
								<i className="fas fa-spinner fa-spin mr-2 text-purple-600"></i>
								<span>Loading industrial data...</span>
							</div>
						</div>
					)}

					{industrialData && (
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{/* Transportation & Warehousing */}
								<div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
									<h4 className="font-semibold text-purple-800 mb-4">
										Transportation & Warehousing
									</h4>
									{industrialData.countryBusinessPatterns?.transportation && (
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span>Employees:</span>
												<span className="font-semibold">
													{industrialData.countryBusinessPatterns.transportation.employees.toLocaleString()}
												</span>
											</div>
											<div className="flex justify-between">
												<span>Establishments:</span>
												<span className="font-semibold">
													{industrialData.countryBusinessPatterns.transportation.establishments.toLocaleString()}
												</span>
											</div>
											<div className="flex justify-between">
												<span>Annual Payroll:</span>
												<span className="font-semibold">
													$
													{(
														industrialData.countryBusinessPatterns.transportation
															.payroll / 1000000
													).toFixed(1)}
													M
												</span>
											</div>
										</div>
									)}
								</div>

								{/* Manufacturing */}
								{industrialData.countryBusinessPatterns?.manufacturing && (
									<div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
										<h4 className="font-semibold text-orange-800 mb-4">Manufacturing</h4>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span>Employees:</span>
												<span className="font-semibold">
													{industrialData.countryBusinessPatterns.manufacturing.employees.toLocaleString()}
												</span>
											</div>
											<div className="flex justify-between">
												<span>Establishments:</span>
												<span className="font-semibold">
													{industrialData.countryBusinessPatterns.manufacturing.establishments.toLocaleString()}
												</span>
											</div>
											<div className="flex justify-between">
												<span>Annual Payroll:</span>
												<span className="font-semibold">
													$
													{(
														industrialData.countryBusinessPatterns.manufacturing.payroll /
														1000000
													).toFixed(1)}
													M
												</span>
											</div>
										</div>
									</div>
								)}

								{/* Warehousing Specific */}
								{industrialData.countryBusinessPatterns?.warehousing && (
									<div className="p-6 bg-teal-50 rounded-lg border border-teal-200">
										<h4 className="font-semibold text-teal-800 mb-4">
											Warehousing & Storage
										</h4>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span>Employees:</span>
												<span className="font-semibold">
													{industrialData.countryBusinessPatterns.warehousing.employees.toLocaleString()}
												</span>
											</div>
											<div className="flex justify-between">
												<span>Establishments:</span>
												<span className="font-semibold">
													{industrialData.countryBusinessPatterns.warehousing.establishments.toLocaleString()}
												</span>
											</div>
											<div className="flex justify-between">
												<span>Annual Payroll:</span>
												<span className="font-semibold">
													$
													{(
														industrialData.countryBusinessPatterns.warehousing.payroll /
														1000000
													).toFixed(1)}
													M
												</span>
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Employment Stability Data */}
							{industrialData.employmentData && (
								<div className="p-6 bg-gray-50 rounded-lg border">
									<h4 className="font-semibold text-gray-800 mb-4">
										Employment Stability
									</h4>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="text-center">
											<div className="text-2xl font-bold text-blue-600">
												{industrialData.employmentData.totalEmployment.toLocaleString()}
											</div>
											<div className="text-sm text-gray-600">Total Employment</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-green-600">
												{industrialData.employmentData.stableEmployment.toLocaleString()}
											</div>
											<div className="text-sm text-gray-600">Stable Jobs</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-purple-600">
												{industrialData.employmentData.employmentStabilityRate}%
											</div>
											<div className="text-sm text-gray-600">Stability Rate</div>
										</div>
									</div>
								</div>
							)}

							{industrialData.dataYear && (
								<div className="p-4 bg-gray-50 rounded-lg border">
									<p className="text-xs text-gray-500">
										<i className="fas fa-database mr-1"></i>
										Source: {industrialData.dataSource} (
										{industrialData.location?.state || locationInfo.state} State) | Data
										year:{" "}
										{industrialData.dataYear ||
											new Date(industrialData.dataYear).getFullYear()}{" "}
									</p>
								</div>
							)}
						</div>
					)}
				</div>
			)}

			{/* No Data Message */}
			{!demographicsData &&
				!demographicsLoading &&
				!demographicsError &&
				!industrialData &&
				!industrialLoading &&
				!industrialError && (
					<div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
						<h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
							<i className="fas fa-info-circle mr-2"></i>
							No Real Data Available
						</h4>
						<p className="text-yellow-700 text-sm">
							No Census Bureau data is currently available for this location. This could
							be due to an invalid address format or missing API key configuration.
						</p>
					</div>
				)}
		</div>
	);
};
