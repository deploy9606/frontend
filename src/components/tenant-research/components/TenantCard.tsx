import React, { useState } from "react";
import type { TenantRanking } from "../../../types";

interface TenantCardProps {
	tenant: TenantRanking;
	index: number;
}

const TenantCard: React.FC<TenantCardProps> = ({ tenant, index }) => {
	const [showAIAnalysis, setShowAIAnalysis] = useState(false);
	return (
		<div className="border-2 border-gradient-to-r from-blue-200 to-purple-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-purple-50">
			<div className="flex justify-between items-start mb-3">
				<div>
					<div className="flex items-center space-x-2 mb-2">
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
							💎 #{index + 1}
						</span>
						{tenant.industryType && (
							<span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
								{tenant.industryType}
							</span>
						)}
					</div>
					<h4 className="text-lg font-semibold text-blue-700 mt-1">{tenant.company}</h4>
					{tenant.contact_info && (
						<p className="text-sm text-gray-600">
							📧 {tenant.contact_info}
						</p>	
					)}
					{tenant.nearbyLocation && tenant.distance && (
						<p className="text-xs text-gray-500">
							📍 {tenant.nearbyLocation} ({tenant.distance} miles)
						</p>
					)}
				</div>
				<div className="text-right">
					<div className="flex items-center mb-1">
						<div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
							<div
								className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
								style={{ width: `${tenant.score}%` }}
							></div>
						</div>
						<span className="text-sm font-bold text-green-600">{tenant.score}/100</span>
					</div>
				</div>
			</div>

			<div className="space-y-2 text-sm">
				<div>
					<span className="font-medium text-gray-700">Operations:</span>
					<p className="text-gray-600">{tenant.operations}</p>
				</div>

				{(tenant.benefitParagraph || tenant.aiReasoning) && (
					<div className="mt-3">
						<button
							onClick={() => setShowAIAnalysis(!showAIAnalysis)}
							className="flex items-center w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
						>
							<span className="font-medium text-blue-800 mr-2">
								{tenant.aiReasoning ? "🤖 AI Reasoning:" : "Value Proposition:"}
							</span>
							<span className="text-xs text-blue-600">
								{showAIAnalysis ? "Hide details" : "Show details"}
							</span>
							<span className="ml-auto text-blue-600">{showAIAnalysis ? "▼" : "▶"}</span>
						</button>
						{showAIAnalysis && (
							<div className="mt-2 space-y-3">
								<div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
									<p className="text-blue-700 text-sm">
										{tenant.aiReasoning || tenant.benefitParagraph}
									</p>
								</div>

								{/* Key Strengths and Risk Factors */}
								{((tenant.keyStrengths && tenant.keyStrengths.length > 0) ||
									(tenant.riskFactors && tenant.riskFactors.length > 0)) && (
									<div className="grid grid-cols-2 gap-3">
										{tenant.keyStrengths && tenant.keyStrengths.length > 0 && (
											<div className="p-2 bg-green-50 rounded border border-green-200">
												<div className="text-xs font-medium text-green-800 mb-1">
													✅ Key Strengths
												</div>
												<ul className="text-xs text-green-700 space-y-0.5">
													{tenant.keyStrengths.map((strength, idx) => (
														<li key={idx} className="flex items-start gap-1">
															<span className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
															<span>{strength}</span>
														</li>
													))}
												</ul>
											</div>
										)}

										{tenant.riskFactors && tenant.riskFactors.length > 0 && (
											<div className="p-2 bg-orange-50 rounded border border-orange-200">
												<div className="text-xs font-medium text-orange-800 mb-1">
													⚠️ Risk Factors
												</div>
												<ul className="text-xs text-orange-700 space-y-0.5">
													{tenant.riskFactors.map((risk, idx) => (
														<li key={idx} className="flex items-start gap-1">
															<span className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></span>
															<span>{risk}</span>
														</li>
													))}
												</ul>
											</div>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				)}

				{/* Scores simplifiés et pertinents (3 maximum) */}
				{(tenant.marketFit || tenant.propertyMatch || tenant.growthPotential) && (
					<div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
						{tenant.marketFit && (
							<div className="text-center bg-green-50 p-2 rounded">
								<div className="text-xs text-gray-500 mb-1">Market Fit</div>
								<div className="text-lg font-bold text-green-600">
									{tenant.marketFit}/10
								</div>
							</div>
						)}
						{tenant.propertyMatch && (
							<div className="text-center bg-blue-50 p-2 rounded">
								<div className="text-xs text-gray-500 mb-1">Property Match</div>
								<div className="text-lg font-bold text-blue-600">
									{tenant.propertyMatch}/10
								</div>
							</div>
						)}
						{tenant.growthPotential && (
							<div className="text-center bg-purple-50 p-2 rounded">
								<div className="text-xs text-gray-500 mb-1">Growth Potential</div>
								<div className="text-lg font-bold text-purple-600">
									{tenant.growthPotential}/10
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default TenantCard;
