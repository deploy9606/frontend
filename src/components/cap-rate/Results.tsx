import React, { useState } from "react";
import type { CapRatePropertyData, NOIData, Assumptions } from "../../types";
import {
	parseFormattedNumber,
	formatCurrency,
	formatPercentage,
	calculateGoingInPrice,
	getCapRateColor,
	calculateGoingInCapRate,
	calculateAllInCapRate,
	calculateSellerPriceFromCapRateStabilized,
} from "../../utils/calculations";

interface ResultsProps {
	propertyData: CapRatePropertyData;
	noiData: NOIData;
	assumptions: Assumptions;
}

export const Results: React.FC<ResultsProps> = ({
	propertyData,
	noiData,
	assumptions,
}) => {
	const [activeTab, setActiveTab] = useState<"going-in" | "all-in">("going-in");

	// Calculate NOI
	const monthlyNOI = parseFormattedNumber(noiData.monthlyPropertyNOI);
	const annualNOI = monthlyNOI * 12;

	// Calculate cap rates
	const askingPrice = parseFormattedNumber(propertyData.sellerAskingPrice);

	const goingInCapRate = calculateGoingInCapRate(askingPrice, annualNOI);
	const allInCapRate = calculateAllInCapRate(askingPrice, annualNOI, assumptions);

	// Cap rate targets and corresponding prices
	const capRateTargets = [9, 8, 7, 6];

	interface CapRateDisplayProps {
		capRate: number;
		price: number;
	}

	const CapRateDisplay: React.FC<CapRateDisplayProps> = ({ capRate, price }) => {
		const color = getCapRateColor(capRate);
		const baseClasses = "cap-rate-display text-white p-4 rounded-lg shadow-lg";
		const colorClass = color === "orange" ? "orange" : color === "red" ? "red" : "";
		const finalClasses = `${baseClasses} ${colorClass}`.trim();

		return (
			<div className={finalClasses}>
				<div className="text-center">
					<div className="text-2xl font-bold">{capRate}% Cap</div>
					<div className="text-sm opacity-90">
						Seller price : {formatCurrency(price, 0)}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="glass-effect rounded-lg p-6 shadow-lg">
			<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
				<i className="fas fa-chart-line mr-3 text-indigo-600"></i>
				Results
			</h2>

			{/* Current Cap Rates */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				<div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
					<h3 className="text-lg font-semibold text-green-800 mb-2">Cap Going-In</h3>
					<div className="text-3xl font-bold text-green-600">
						{formatPercentage(goingInCapRate)} Cap
					</div>
					<div className="text-sm text-green-700 mt-1">
						Based on asking price of {formatCurrency(askingPrice)}, and annual NOI of{" "}
						{formatCurrency(annualNOI)}
					</div>
				</div>

				<div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
					<h3 className="text-lg font-semibold text-blue-800 mb-2">Cap All-In</h3>
					<div className="text-3xl font-bold text-blue-600">
						{formatPercentage(allInCapRate)} Cap
					</div>
					<div className="text-sm text-blue-700 mt-1">
						Based on asking price of {formatCurrency(askingPrice)}, annual NOI of{" "}
						{formatCurrency(annualNOI)}, and all assumptions.
					</div>
				</div>
			</div>

			{/* Tab Navigation */}
			<div className="flex space-x-4 mb-6">
				<button
					onClick={() => setActiveTab("going-in")}
					className={`tab-button px-6 py-3 rounded-lg font-medium transition-all ${
						activeTab === "going-in"
							? "active text-white bg-blue-600"
							: "bg-gray-200 text-gray-700 hover:bg-gray-300"
					}`}
				>
					Cap Going-In Prices
				</button>
				<button
					onClick={() => setActiveTab("all-in")}
					className={`tab-button px-6 py-3 rounded-lg font-medium transition-all ${
						activeTab === "all-in"
							? "active text-white bg-blue-600"
							: "bg-gray-200 text-gray-700 hover:bg-gray-300"
					}`}
				>
					Cap All-In Prices
				</button>
			</div>

			{/* Cap Rate Prices Grid */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
				{capRateTargets.map((capRate) => {
					if (activeTab === "going-in") {
						const price = calculateGoingInPrice(annualNOI, capRate);
						return (
							<CapRateDisplay
								key={`going-in-${capRate}`}
								capRate={capRate}
								price={price}
							/>
						);
					} else {
						const sellerPrice = calculateSellerPriceFromCapRateStabilized(
							annualNOI,
							capRate,
							assumptions
						);
						// Use allInPrice for All-In tab
						// const allInPrice = calculateAllInPrice(annualNOI, sellerPrice, assumptions);
						return (
							<CapRateDisplay
								key={`all-in-${capRate}`}
								capRate={capRate}
								price={sellerPrice}
							/>
						);
					}
				})}
			</div>

			{/* Color Legend */}
			<div className="flex justify-center space-x-6 text-sm">
				<div className="flex items-center">
					<span className="color-indicator red"></span>
					<span>&lt; 6% Cap (No Go)</span>
				</div>
				<div className="flex items-center">
					<span className="color-indicator orange"></span>
					<span>6.01% - 8.49% Cap (Submit)</span>
				</div>
				<div className="flex items-center">
					<span className="color-indicator green"></span>
					<span>&gt; 8.5% Cap (Submit)</span>
				</div>
			</div>
		</div>
	);
};
