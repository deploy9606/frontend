import React, { useState } from "react";
import type { NOIData, Assumptions } from "../../types";
import {
	parseFormattedNumber,
	formatCurrency,
	calculateAllInPrice,
	getCapRateColor,
	calculateSellerPriceFromCapRateStabilized,
} from "../../utils/calculations";

interface CustomCapRateCalculatorProps {
	noiData: NOIData;
	assumptions: Assumptions;
}

interface CalculationResult {
	capRate: number;
	goingInPrice: number;
	allInPrice: number;
	color: "green" | "orange" | "red";
}

export const CustomCapRateCalculator: React.FC<CustomCapRateCalculatorProps> = ({
	noiData,
	assumptions,
}) => {
	const [customCapRate, setCustomCapRate] = useState<string>("");
	const [result, setResult] = useState<CalculationResult | null>(null);

	// Calculate NOI
	const monthlyNOI = parseFormattedNumber(noiData.monthlyPropertyNOI);
	const annualNOI = monthlyNOI * 12;

	const calculateCustomPrice = (targetCapRate: string): CalculationResult | null => {
		const capRate = parseFloat(targetCapRate);
		if (!capRate || capRate <= 0 || !annualNOI) return null;

		// const goingInPrice = calculateGoingInPrice(annualNOI, capRate);
		// const allInPrice = calculateAllInPrice(annualNOI, capRate, assumptions);

		const goingInPrice = calculateSellerPriceFromCapRateStabilized(
			annualNOI,
			capRate,
			assumptions
		);
		const allInPrice = calculateAllInPrice(annualNOI, goingInPrice, assumptions);

		return {
			capRate,
			goingInPrice,
			allInPrice,
			color: getCapRateColor(capRate),
		};
	};

	const handleCalculate = () => {
		const result = calculateCustomPrice(customCapRate);
		setResult(result);
	};

	const handlePresetCapRate = (capRate: number) => {
		setCustomCapRate(capRate.toString());
		const result = calculateCustomPrice(capRate.toString());
		setResult(result);
	};

	const getColorClass = (color: "green" | "orange" | "red") => {
		switch (color) {
			case "green":
				return "bg-green-500 text-white";
			case "orange":
				return "bg-orange-500 text-white";
			case "red":
				return "bg-red-500 text-white";
			default:
				return "bg-gray-500 text-white";
		}
	};

	return (
		<div className="glass-effect rounded-lg p-6 shadow-lg">
			<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
				<i className="fas fa-search-dollar mr-3 text-yellow-600"></i>
				Custom Cap Rate Calculator
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Input Section */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Target Cap Rate
					</label>
					<div className="flex space-x-2">
						<div className="relative flex-1">
							<input
								type="number"
								step="0.1"
								min="0"
								max="100"
								value={customCapRate}
								onChange={(e) => setCustomCapRate(e.target.value)}
								className="number-input block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
								placeholder="8.5"
							/>
							<span className="absolute right-3 top-3 text-gray-500">%</span>
						</div>
						<button
							onClick={handleCalculate}
							className="px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
						>
							Calculate
						</button>
					</div>

					{/* Preset Buttons */}
					<div className="mt-4">
						<p className="text-sm text-gray-600 mb-2">Quick calculations:</p>
						<div className="flex space-x-2">
							{[6, 7, 8, 9, 10].map((rate) => (
								<button
									key={rate}
									onClick={() => handlePresetCapRate(rate)}
									className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
								>
									{rate}%
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Result Section */}
				<div>
					{result && (
						<div className={`p-4 rounded-lg ${getColorClass(result.color)}`}>
							<h3 className="text-lg font-semibold mb-3">
								{result.capRate}% Cap Rate Results
							</h3>

							<div className="space-y-2">
								<div className="flex justify-between">
									<span>Going-In Price:</span>
									<span className="font-semibold">
										{formatCurrency(result.goingInPrice)}
									</span>
								</div>
								<div className="flex justify-between">
									<span>All-In Price:</span>
									<span className="font-semibold">
										{formatCurrency(result.allInPrice)}
									</span>
								</div>
								<div className="border-t border-white border-opacity-30 pt-2">
									<div className="flex justify-between text-sm">
										<span>Annual NOI:</span>
										<span>{formatCurrency(annualNOI)}</span>
									</div>
								</div>
							</div>

							<div className="mt-3 text-sm opacity-90">
								<strong>Investment Recommendation:</strong>
								{result.color === "green" && " Excellent opportunity - Submit offer"}
								{result.color === "orange" && " Acceptable return - Consider submitting"}
								{result.color === "red" && " Below target - No Go"}
							</div>
						</div>
					)}

					{!result && (
						<div className="p-4 bg-gray-100 rounded-lg text-center text-gray-600">
							<i className="fas fa-calculator text-2xl mb-2"></i>
							<p>Enter a cap rate to see the corresponding property value</p>
						</div>
					)}
				</div>
			</div>

			{/* Summary Information */}
			<div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
				<h4 className="font-semibold text-yellow-800 mb-2">How It Works</h4>
				<p className="text-sm text-yellow-700">
					Enter your desired cap rate to see what price you should pay to achieve that
					return. The calculator shows both Going-In price (based on purchase price only)
					and All-In price (including capex and closing costs).
				</p>
			</div>
		</div>
	);
};
