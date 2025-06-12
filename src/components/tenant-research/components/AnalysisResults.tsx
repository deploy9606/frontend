import React, { useState } from "react";
import type { AnalysisResults, TenantRanking } from "../../../types";
import TenantRankingTable from "./TenantRankingTable";
import TenantCard from "./TenantCard";
import DropdownSection from "./DropdownSection";
import ErrorSection from "./ErrorSection";

interface AnalysisResultsDisplayProps {
	results: AnalysisResults;
	showPropertyAnalysis: boolean;
	setShowPropertyAnalysis: (show: boolean) => void;
	showMarketAnalysis: boolean;
	setShowMarketAnalysis: (show: boolean) => void;
	showTenantTable: boolean;
	setShowTenantTable: (show: boolean) => void;
}

const AnalysisResultsDisplay: React.FC<AnalysisResultsDisplayProps> = ({
	results,
	showPropertyAnalysis,
	setShowPropertyAnalysis,
	showMarketAnalysis,
	setShowMarketAnalysis,
	showTenantTable,
	setShowTenantTable,
}) => {
	const [showPropertyDetails, setShowPropertyDetails] = useState(false);
	const [selectedTenant, setSelectedTenant] = useState<TenantRanking | null>(null);

	const displayMetadata = false;

	return (
		<div className="w-full max-w-6xl mt-8 space-y-6">
			{/* Analysis Summary Header */}
			<div className="bg-gradient-to-r from-blue-50 to-purple-50 p-2 rounded-lg border-l-4 border-blue-500">
				<div
					className={`grid grid-cols-1 md:grid-cols-${
						results.metadata?.aiScoringEnabled ? "3" : "2"
					} gap-4`}
				>
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600">
							{results.tenantRanking?.length || 0}
						</div>
						<div className="text-sm text-gray-600">Tenants Analyzed</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600">
							{results.marketContext?.areaGrowthScore || "N/A"}/10
						</div>
						<div className="text-sm text-gray-600">Market Score</div>
					</div>
					{results.metadata?.aiScoringEnabled ? (
						<div className="text-center">
							<div className="text-2xl font-bold text-purple-600">
								🤖 {results.metadata.tenantsWithAIScoring || 0}
								<div className="text-xs text-purple-500 mt-1">AI Scored</div>
							</div>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>

			{/* Property Analysis - Dropdown */}
			{(results.propertyAnalysis || results.errors?.propertyAnalysis) && (
				<DropdownSection
					title="🏡 Property Analysis"
					isOpen={showPropertyAnalysis}
					onToggle={setShowPropertyAnalysis}
				>
					{results.errors?.propertyAnalysis && (
						<div className="mb-4">
							<ErrorSection
								title="Erreur d'analyse de propriété"
								error={results.errors.propertyAnalysis}
								hasData={!!results.propertyAnalysis}
							/>
						</div>
					)}

					{results.propertyAnalysis && (
						<>
							{/* SHOW: Core Information */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
								<div className="bg-blue-50 p-4 rounded">
									<h3 className="font-semibold text-blue-800">🔧 Configuration</h3>
									<p className="text-sm text-blue-600">
										{results.propertyAnalysis.configuration}
									</p>
								</div>
								<div className="bg-green-50 p-4 rounded">
									<h3 className="font-semibold text-green-800">🌐 Market Fit</h3>
									<p className="text-sm text-green-600">
										{results.propertyAnalysis.marketFit}
									</p>
								</div>
								<div className="bg-purple-50 p-4 rounded">
									<h3 className="font-semibold text-purple-800">✨ Key Features</h3>
									<p className="text-sm text-purple-600">
										{results.propertyAnalysis.keyFeatures}
									</p>
								</div>
							</div>
						</>
					)}
					{/* Updated property detailed information */}
					{(results.propertyAnalysis?.propertyFeatures?.length ||
						results.propertyAnalysis?.briefPropertyInfo) && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
							{results.propertyAnalysis?.propertyFeatures?.length && (
								<div className="bg-indigo-50 p-4 rounded">
									<h3 className="font-semibold text-indigo-800 mb-2">
										🏗️ Property Features
									</h3>
									<ul className="text-sm text-indigo-600 space-y-1">
										{results.propertyAnalysis?.propertyFeatures
											.slice(0, 3)
											.map((feature, index) => (
												<li key={index}>• {feature}</li>
											))}
									</ul>
								</div>
							)}
							{results.propertyAnalysis?.briefPropertyInfo && (
								<div className="bg-cyan-50 p-4 rounded">
									<h3 className="font-semibold text-cyan-800 mb-2">🗺️ Location Info</h3>
									<p className="text-sm text-cyan-600">
										{results.propertyAnalysis?.briefPropertyInfo}
									</p>
								</div>
							)}
						</div>
					)}

					{/* COLLAPSE: Detailed Information */}
					<button
						onClick={() => setShowPropertyDetails(!showPropertyDetails)}
						className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mt-4"
					>
						{showPropertyDetails ? "▼" : "▶"} View detailed specifications
					</button>

					{showPropertyDetails && (
						<div className="mt-4 p-4 bg-gray-50 rounded border">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{results.propertyAnalysis?.propertyFeatures?.length && (
									<div>
										<h4 className="font-semibold text-gray-700 mb-2">
											📋 Full Specifications
										</h4>
										<ul className="text-sm text-gray-600 space-y-1">
											{results.propertyAnalysis?.propertyFeatures.map(
												(feature, index) => (
													<li key={index}>• {feature}</li>
												)
											)}
										</ul>
									</div>
								)}
								{results.propertyAnalysis?.targetUseTypes?.length && (
									<div>
										<h4 className="font-semibold text-gray-700 mb-2">Target Use Types</h4>
										<div className="flex flex-wrap gap-2">
											{results.propertyAnalysis?.targetUseTypes.map((type, index) => (
												<span
													key={index}
													className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
												>
													{type}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</DropdownSection>
			)}

			{/* Market Context Analysis - Dropdown */}
			{(results.marketContext || results.errors?.marketAnalysis) && (
				<DropdownSection
					title={`📊 Market Analysis ${
						results.marketContext
							? `(Score: ${results.marketContext.areaGrowthScore}/10)`
							: ""
					}`}
					isOpen={showMarketAnalysis}
					onToggle={setShowMarketAnalysis}
				>
					{results.errors?.marketAnalysis && (
						<div className="mb-4">
							<ErrorSection
								title="Erreur d'analyse de marché"
								error={results.errors.marketAnalysis}
								hasData={!!results.marketContext}
							/>
						</div>
					)}

					{results.marketContext && (
						<>
							{/* Basic Analysis */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
								<div className="bg-blue-50 p-4 rounded">
									<h3 className="font-semibold mb-2 text-blue-800">
										🏢 Local Economic Trends
									</h3>
									<p className="text-sm text-blue-700">
										{results.marketContext.localTrends}
									</p>
								</div>
								<div className="bg-green-50 p-4 rounded">
									<h3 className="font-semibold mb-2 text-green-800">
										📈 Industry Growth Indicators
									</h3>
									<p className="text-sm text-green-700">
										{results.marketContext.industryGrowth}
									</p>
								</div>
							</div>
						</>
					)}

					{/* Detailed 9606 Capital Analysis */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
						{results.marketContext?.areaGrowthTrends && (
							<div className="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
								<h4 className="font-semibold text-purple-800 mb-2">
									🚀 Area Growth Trends
								</h4>
								<p className="text-sm text-purple-700">
									{results.marketContext?.areaGrowthTrends}
								</p>
							</div>
						)}
						{results.marketContext?.nationalIndustryTrend && (
							<div className="bg-orange-50 p-4 rounded border-l-4 border-orange-400">
								<h4 className="font-semibold text-orange-800 mb-2">
									National Industry Trend
								</h4>
								<p className="text-sm text-orange-700">
									{results.marketContext?.nationalIndustryTrend}
								</p>
							</div>
						)}
						{results.marketContext?.boomingIndustry && (
							<div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
								<h4 className="font-semibold text-yellow-800 mb-2">
									💥 Booming Industry
								</h4>
								<p className="text-sm text-yellow-700">
									{results.marketContext?.boomingIndustry}
								</p>
							</div>
						)}
					</div>

					{/* Demand indicators and competitive factors */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t">
						{results.marketContext?.demandIndicators?.length && (
							<div className="bg-teal-50 p-4 rounded">
								<h4 className="font-semibold text-teal-800 mb-2">📊 Demand Indicators</h4>
								<ul className="text-sm text-teal-700 space-y-1">
									{results.marketContext?.demandIndicators.map((indicator, index) => (
										<li key={index}>• {indicator}</li>
									))}
								</ul>
							</div>
						)}
						{results.marketContext?.competitiveFactors?.length && (
							<div className="bg-rose-50 p-4 rounded">
								<h4 className="font-semibold text-rose-800 mb-2">
									🏆 Competitive Factors
								</h4>
								<ul className="text-sm text-rose-700 space-y-1">
									{results.marketContext?.competitiveFactors.map((factor, index) => (
										<li key={index}>• {factor}</li>
									))}
								</ul>
							</div>
						)}
					</div>

					{/* Recent real estate news */}
					{results.marketContext?.recentRealEstateNews && (
						<div className="mt-6 pt-4 border-t">
							<div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
								<h4 className="font-semibold text-gray-800 mb-2">
									📰 Recent Real Estate News
								</h4>
								<p className="text-sm text-gray-700">
									{results.marketContext?.recentRealEstateNews}
								</p>
							</div>
						</div>
					)}
				</DropdownSection>
			)}

			{/* Top Tenants Ranking with AI Insights - Dropdown */}
			{(results.tenantRanking || results.errors?.tenantRanking) && (
				<DropdownSection
					title="🎯 AI-Powered Tenant Analysis"
					isOpen={showTenantTable}
					onToggle={setShowTenantTable}
				>
					{results.errors?.tenantRanking && (
						<div className="mb-4">
							<ErrorSection
								title="Erreur de recherche de locataires"
								error={results.errors.tenantRanking}
								hasData={!!results.tenantRanking}
							/>
						</div>
					)}

					{results.tenantRanking && (
						<>
							{/* AI Scoring Status Indicator */}
							{results.tenantRanking.some((tenant) => tenant.aiReasoning) && (
								<div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
									<div className="flex items-center gap-2">
										<span className="text-green-600">🤖</span>
										<span className="text-sm font-medium text-green-800">
											AI-Generated Scoring Active
										</span>
										<span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
											Enhanced Analysis
										</span>
									</div>
									<p className="text-xs text-green-700 mt-1">
										Tenant scores generated using advanced AI analysis for market fit,
										property match, and growth potential.
									</p>
								</div>
							)}
						</>
					)}

					{/* Top 5 Emerging Companies */}
					<div className="mb-8">
						<h3 className="text-lg font-medium mb-4 text-gray-700">
							🏆 Top 5 Emerging Company Discoveries
						</h3>
						<div className="grid grid-cols-2 lg:grid-cols-2 gap-4 items-start">
							{results.tenantRanking?.slice(0, 5).map((tenant, index) => (
								<TenantCard key={index} tenant={tenant} index={index} />
							))}
						</div>
					</div>

					{/* Complete Ranking Table - Dropdown */}
					<DropdownSection title="📊 Complete Tenant Ranking" defaultOpen={false}>
						<TenantRankingTable
							tenants={results.tenantRanking!}
							onTenantClick={setSelectedTenant}
						/>
					</DropdownSection>

					{/* Selected Tenant Modal */}
					{selectedTenant && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
							<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
								<div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
									<h3 className="text-lg font-semibold text-gray-800">
										📋 Tenant Details
									</h3>
									<button
										onClick={() => setSelectedTenant(null)}
										className="text-gray-500 hover:text-gray-700 transition-colors text-xl"
									>
										✕
									</button>
								</div>
								<div className="p-6">
									<TenantCard
										tenant={selectedTenant}
										index={results.tenantRanking!.findIndex(
											(t) => t.company === selectedTenant.company
										)}
									/>
								</div>
							</div>
						</div>
					)}
				</DropdownSection>
			)}

			{/* Metadata - Fully Collapsed */}
			{results.metadata && displayMetadata && (
				<DropdownSection
					title="🔍 Analysis metadata & technical details"
					defaultOpen={false}
					className="bg-gray-50 shadow-sm border"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
						<div className="bg-white p-3 rounded border">
							<h4 className="font-semibold text-gray-700 mb-1">Analysis Date</h4>
							<p className="text-gray-600">
								{results.metadata.analysisDate
									? new Date(results.metadata.analysisDate).toLocaleString()
									: "N/A"}
							</p>
						</div>
						<div className="bg-white p-3 rounded border">
							<h4 className="font-semibold text-gray-700 mb-1">Strategy</h4>
							<p className="text-gray-600">{results.metadata.focusStrategy || "N/A"}</p>
						</div>
						<div className="bg-white p-3 rounded border">
							<h4 className="font-semibold text-gray-700 mb-1">Version</h4>
							<p className="text-gray-600">{results.metadata.promptVersion || "N/A"}</p>
						</div>
						{results.metadata.totalCandidatesAnalyzed && (
							<div className="bg-white p-3 rounded border">
								<h4 className="font-semibold text-gray-700 mb-1">Candidates Analyzed</h4>
								<p className="text-gray-600">
									{results.metadata.totalCandidatesAnalyzed}
								</p>
							</div>
						)}
						{results.metadata.contactInfo && (
							<div className="bg-white p-3 rounded border">
								<h4 className="font-semibold text-gray-700 mb-1">Contact</h4>
								<p className="text-gray-600">{results.metadata.contactInfo}</p>
							</div>
						)}
						{results.metadata.rankingCriteria &&
							results.metadata.rankingCriteria.length > 0 && (
								<div className="bg-white p-3 rounded border md:col-span-2 lg:col-span-3">
									<h4 className="font-semibold text-gray-700 mb-2">Ranking Criteria</h4>
									<div className="flex flex-wrap gap-2">
										{results.metadata.rankingCriteria.map(
											(criteria: string, index: number) => (
												<span
													key={index}
													className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
												>
													{criteria
														.replace(/_/g, " ")
														.replace(/\b\w/g, (l: string) => l.toUpperCase())}
												</span>
											)
										)}
									</div>
								</div>
							)}
					</div>
				</DropdownSection>
			)}
		</div>
	);
};

export default AnalysisResultsDisplay;
