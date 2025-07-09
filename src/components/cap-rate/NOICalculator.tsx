import React, { useState } from "react";
import type { NOIData, CapRatePropertyData } from "../../types";
import {
	parseFormattedNumber,
	formatCurrency,
	formatStringValue,
	formatNumber,
} from "../../utils/calculations";

interface NOICalculatorProps {
	noiData: NOIData;
	setNoiData: React.Dispatch<React.SetStateAction<NOIData>>;
	propertyData: CapRatePropertyData;
}

export const NOICalculator: React.FC<NOICalculatorProps> = ({
	noiData,
	setNoiData,
	propertyData,
}) => {
	const [activeSection, setActiveSection] = useState<"monthly" | "acre" | "sqft">(
		"monthly"
	);

	const handleNOIChange = (section: "monthly" | "acre" | "sqft", value: string) => {
		// Validation : empêcher la modification si les données requises ne sont pas définies
		if (!propertyData.propertySize || !propertyData.buildingSize) {
			return; // Empêche la modification si une des propriétés n'est pas définie
		}

		const numericValue = parseFormattedNumber(value);

		if (section === "monthly") {
			setNoiData((prev) => ({
				...prev,
				monthlyPropertyNOI: formatStringValue(value), // Formatage intelligent pour le champ saisi
				monthlyAcreNOI: propertyData.propertySize
					? formatNumber(
							numericValue / parseFormattedNumber(propertyData.propertySize),
							2
					  )
					: "0.00",
				monthlySqFtNOI: propertyData.buildingSize
					? formatNumber(
							numericValue / parseFormattedNumber(propertyData.buildingSize),
							2
					  )
					: "0.00",
			}));
		} else if (section === "acre") {
			const totalMonthly = numericValue * parseFormattedNumber(propertyData.propertySize);
			setNoiData((prev) => ({
				...prev,
				monthlyPropertyNOI: totalMonthly > 0 ? formatNumber(totalMonthly, 2) : "0.00",
				monthlyAcreNOI: formatStringValue(value), // Formatage intelligent pour le champ saisi
				monthlySqFtNOI:
					propertyData.buildingSize && totalMonthly > 0
						? formatNumber(
								totalMonthly / parseFormattedNumber(propertyData.buildingSize),
								2
						  )
						: "0.00",
			}));
		} else if (section === "sqft") {
			const totalMonthly = numericValue * parseFormattedNumber(propertyData.buildingSize)*12;
			setNoiData((prev) => ({
				...prev,
				monthlyPropertyNOI: totalMonthly > 0 ? formatNumber(totalMonthly, 2) : "0.00",
				monthlyAcreNOI:
					propertyData.propertySize && totalMonthly > 0
						? formatNumber(
								totalMonthly / parseFormattedNumber(propertyData.propertySize),
								2
						  )
						: "0.00",
				monthlySqFtNOI: formatStringValue(value), // Formatage intelligent pour le champ saisi
			}));
		}

		setActiveSection(section);
	};

	const getSectionClass = (section: "monthly" | "acre" | "sqft") => {
		const isDisabled = isFieldDisabled();
		const baseClass = `noi-section p-6 rounded-lg border-2 transition-all ${
			isDisabled
				? "cursor-not-allowed opacity-50 border-gray-200 bg-gray-100"
				: "cursor-pointer"
		}`;

		if (isDisabled) {
			return baseClass;
		}

		return `${baseClass} ${
			activeSection === section
				? "active border-blue-500"
				: "border-gray-200 hover:border-gray-300"
		}`;
	};

	const isFieldDisabled = (): boolean => {
		return !propertyData.propertySize || !propertyData.buildingSize;
	};

	const getTooltipMessage = (): string => {
		if (!propertyData.propertySize && !propertyData.buildingSize) {
			return "Please enter both property size (acres) and building size (sq ft) first";
		}
		if (!propertyData.propertySize) {
			return "Please enter property size (acres) first";
		}
		if (!propertyData.buildingSize) {
			return "Please enter building size (sq ft) first";
		}
		return "";
	};

	return (
		<div className="glass-effect rounded-lg p-6 shadow-lg">
			<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
				<i className="fas fa-calculator mr-3 text-green-600"></i>
				Net Operating Income (Monthly)
			</h2>

			{/* Message informatif pour les champs manquants */}
			{(!propertyData.propertySize || !propertyData.buildingSize) && (
				<div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
					<div className="flex">
						<div className="flex-shrink-0">
							<i className="fas fa-exclamation-triangle text-yellow-400"></i>
						</div>
						<div className="ml-3">
							<p className="text-sm text-yellow-700">
								<strong>Required Information:</strong> To use the NOI calculator, please
								first enter:
							</p>
							<ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
								{!propertyData.propertySize && <li>Property size (acres)</li>}
								{!propertyData.buildingSize && <li>Building size (square feet)</li>}
							</ul>
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Monthly Property NOI */}
				<div
					className={getSectionClass("monthly")}
					onClick={() => !isFieldDisabled() && setActiveSection("monthly")}
					title={isFieldDisabled() ? getTooltipMessage() : ""}
				>
					<h3 className="text-lg font-semibold mb-3 flex items-center">
						<i className="fas fa-building mr-2"></i>
						Monthly Property NOI
						{isFieldDisabled() && (
							<i
								className="fas fa-lock ml-2 text-gray-400"
								title={getTooltipMessage()}
							></i>
						)}
					</h3>
					<div className="relative">
						<span className="absolute left-3 top-3 text-gray-500">$</span>
						<input
							type="text"
							value={noiData.monthlyPropertyNOI}
							onChange={(e) => handleNOIChange("monthly", e.target.value)}
							className={`block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								isFieldDisabled() ? "cursor-not-allowed bg-gray-100" : ""
							}`}
							placeholder="50,000"
							onFocus={() => !isFieldDisabled() && setActiveSection("monthly")}
							disabled={isFieldDisabled()}
							title={isFieldDisabled() ? getTooltipMessage() : ""}
						/>
					</div>
				</div>

				{/* Monthly NOI per Acre */}
				<div
					className={getSectionClass("acre")}
					onClick={() => !isFieldDisabled() && setActiveSection("acre")}
					title={isFieldDisabled() ? getTooltipMessage() : ""}
				>
					<h3 className="text-lg font-semibold mb-3 flex items-center">
						<i className="fas fa-map mr-2"></i>
						Monthly NOI per Acre
						{isFieldDisabled() && (
							<i
								className="fas fa-lock ml-2 text-gray-400"
								title={getTooltipMessage()}
							></i>
						)}
					</h3>
					<div className="relative">
						<span className="absolute left-3 top-3 text-gray-500">$</span>
						<input
							type="text"
							value={noiData.monthlyAcreNOI}
							onChange={(e) => handleNOIChange("acre", e.target.value)}
							className={`block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								isFieldDisabled() ? "cursor-not-allowed bg-gray-100" : ""
							}`}
							placeholder="10,000"
							onFocus={() => !isFieldDisabled() && setActiveSection("acre")}
							disabled={isFieldDisabled()}
							title={isFieldDisabled() ? getTooltipMessage() : ""}
						/>
					</div>
				</div>

				{/* Monthly NOI per Sq. Ft */}
				<div
					className={getSectionClass("sqft")}
					onClick={() => !isFieldDisabled() && setActiveSection("sqft")}
					title={isFieldDisabled() ? getTooltipMessage() : ""}
				>
					<h3 className="text-lg font-semibold mb-3 flex items-center">
						<i className="fas fa-ruler-combined mr-2"></i>
						Yearly NOI per Sq. Ft
						{isFieldDisabled() && (
							<i
								className="fas fa-lock ml-2 text-gray-400"
								title={getTooltipMessage()}
							></i>
						)}
					</h3>
					<div className="relative">
						<span className="absolute left-3 top-3 text-gray-500">$</span>
						<input
							type="text"
							value={noiData.monthlySqFtNOI}
							onChange={(e) => handleNOIChange("sqft", e.target.value)}
							className={`block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								isFieldDisabled() ? "cursor-not-allowed bg-gray-100" : ""
							}`}
							placeholder="2.50"
							onFocus={() => !isFieldDisabled() && setActiveSection("sqft")}
							disabled={isFieldDisabled()}
							title={isFieldDisabled() ? getTooltipMessage() : ""}
						/>
					</div>
				</div>
			</div>

			{/* Summary */}
			<div className="mt-6 p-4 bg-gray-50 rounded-lg">
				<h4 className="font-semibold text-gray-800 mb-2">Annual NOI Summary</h4>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
					<div>
						<span className="text-gray-600">Annual Property NOI:</span>
						<div className="font-semibold text-green-600">
							{formatCurrency(parseFormattedNumber(noiData.monthlyPropertyNOI) * 12)}
						</div>
					</div>
					<div>
						<span className="text-gray-600">Annual NOI per Acre:</span>
						<div className="font-semibold text-blue-600">
							{formatCurrency(parseFormattedNumber(noiData.monthlyAcreNOI) * 12)}
						</div>
					</div>
					<div>
						<span className="text-gray-600">Annual NOI per Sq. Ft:</span>
						<div className="font-semibold text-purple-600">
							{formatCurrency(parseFormattedNumber(noiData.monthlySqFtNOI) )}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
