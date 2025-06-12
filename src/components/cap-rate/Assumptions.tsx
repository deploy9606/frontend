import React from "react";
import type { Assumptions as AssumptionsType } from "../../types";
import { formatNumber } from "../../utils/calculations";

interface AssumptionsProps {
	assumptions: AssumptionsType;
	setAssumptions: React.Dispatch<React.SetStateAction<AssumptionsType>>;
}

export const Assumptions: React.FC<AssumptionsProps> = ({
	assumptions,
	setAssumptions,
}) => {
	const handleInputChange = (field: keyof AssumptionsType, value: string) => {
		let processedValue = value;

		// Format numbers with commas for capex
		if (field === "capex") {
			const numericValue = value.replace(/[^\d]/g, "");
			if (numericValue) {
				processedValue = formatNumber(+numericValue);
			}
		}

		setAssumptions((prev) => ({
			...prev,
			[field]: processedValue,
		}));
	};

	const assumptionsData = [
		{
			key: "leaseCommission" as keyof AssumptionsType,
			label: "Lease Commission",
			value: assumptions.leaseCommission,
			suffix: "%",
			tooltip: "Commission paid for lease agreements",
		},
		{
			key: "leaseCommissionYears" as keyof AssumptionsType,
			label: "Lease Commission Years",
			value: assumptions.leaseCommissionYears,
			suffix: "years",
			tooltip: "Duration of lease commission period",
		},
		{
			key: "closingCosts" as keyof AssumptionsType,
			label: "Closing Costs",
			value: assumptions.closingCosts,
			suffix: "%",
			tooltip: "Transaction costs as percentage of purchase price",
		},
		{
			key: "loanInterest" as keyof AssumptionsType,
			label: "Loan Interest & Reserve",
			value: assumptions.loanInterest,
			suffix: "%",
			tooltip: "Interest rate and reserve requirements",
		},
		{
			key: "ltc" as keyof AssumptionsType,
			label: "LTC",
			value: assumptions.ltc,
			suffix: "%",
			tooltip: "Loan-to-cost ratio",
		},
		{
			key: "capex" as keyof AssumptionsType,
			label: "Capex",
			value: assumptions.capex,
			prefix: "$",
			tooltip: "Capital expenditures required",
		},
	];

	return (
		<div className="glass-effect rounded-lg p-6 shadow-lg">
			<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
				<i className="fas fa-cogs mr-3 text-purple-600"></i>
				Adjustable Assumptions
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{assumptionsData.map(({ key, label, value, prefix, suffix, tooltip }) => (
					<div key={key} className="relative group">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{label}
							<i
								className="fas fa-info-circle ml-2 text-gray-400 cursor-help"
								title={tooltip}
							></i>
						</label>
						<div className="relative">
							{prefix && (
								<span className="absolute left-3 top-3 text-gray-500">{prefix}</span>
							)}
							<input
								type={key === "capex" ? "text" : "number"}
								step={key === "capex" ? undefined : "0.1"}
								value={value}
								onChange={(e) => handleInputChange(key, e.target.value)}
								className="number-input block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								style={{ paddingLeft: prefix ? "2rem" : "0.75rem" }}
							/>
							{suffix && (
								<span className="absolute right-3 top-3 text-gray-500">{suffix}</span>
							)}
						</div>

						{/* Tooltip */}
						<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
							{tooltip}
						</div>
					</div>
				))}
			</div>

			<div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
				<div className="flex items-center text-purple-800 mb-2">
					<i className="fas fa-lightbulb mr-2"></i>
					<span className="font-medium">Affects Cap Rate (All-In)</span>
				</div>
				<p className="text-sm text-purple-700">
					These assumptions affect the All-In cap rate calculation by adding transaction
					costs to the total investment amount. The formula is: Cap Rate (All-In) = NOI /
					Total Investment
				</p>
			</div>
		</div>
	);
};
