import type { Assumptions } from "../types";

export const formatCurrency = (amount: number, decimals?: number): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(amount);
};

export const formatPercentage = (value: number): string => {
	return `${value.toFixed(2)}%`;
};

export const formatNumber = (value: number, decimals?: number): string => {
	if (typeof decimals === "number") {
		return new Intl.NumberFormat("en-US", {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		}).format(value);
	}
	return new Intl.NumberFormat("en-US").format(value);
};

// Fonction pour formater depuis une string:
// 3500 --> "3,500"
// 3500.5 --> "3,500.5"
// 3500. --> "3,500."
export const formatStringValue = (value: string): string => {
	if (!value) return "0";
	const hasTrailingDot = value.endsWith(".");
	const numericPart = value.replace(/[^0-9.-]/g, "");
	if (numericPart === "" || numericPart === "-" || numericPart === ".") return value;
	const [intPart, decPart] = numericPart.split(".");
	let formatted = formatNumber(parseInt(intPart, 10));
	if (hasTrailingDot) {
		formatted += ".";
	} else if (decPart !== undefined) {
		formatted += "." + decPart;
	}
	return formatted;
};

export const parseFormattedNumber = (value: string): number => {
	if (!value) return 0;
	// Remove commas, dollar signs, and other formatting
	const cleanValue = value.toString().replace(/[^0-9.-]/g, "");
	return parseFloat(cleanValue) || 0;
};
export const calculateGoingInCapRate = (
	sellerPrice: number,
	annualNOI: number
): number => {
	if (sellerPrice === 0 || annualNOI === 0) return 0;
	return (annualNOI / sellerPrice) * 100;
};

export const calculateAllInCapRate = (
	sellerPrice: number,
	annualNOI: number,
	assumptions: Assumptions
): number => {
	const allInPrice = calculateAllInPrice(annualNOI, sellerPrice, assumptions);
	return (annualNOI / allInPrice) * 100;
};

export const calculateAllInPrice = (
	annualNOI: number,
	sellerPrice: number,
	assumptions: Assumptions
): number => {
	if (sellerPrice === 0 || annualNOI === 0) return 0;
	const capex = parseFormattedNumber(assumptions.capex);

	// Calculate lease commission
	const leaseCommission = parseFormattedNumber(assumptions.leaseCommission) / 100;
	const leaseCommissionYears = parseFormattedNumber(assumptions.leaseCommissionYears);
	const leaseCommissionTotal = leaseCommission * leaseCommissionYears * annualNOI;

	// Calculate closing costs
	const closingCostsPercent = parseFormattedNumber(assumptions.closingCosts) / 100;
	const closingCosts = sellerPrice * closingCostsPercent;

	// Calculate loan interest and reserve
	const loanInterest = parseFormattedNumber(assumptions.loanInterest) / 100;
	const ltc = parseFormattedNumber(assumptions.ltc) / 100;
	const loanInterestReserve =
		loanInterest * ltc * (sellerPrice + leaseCommissionTotal + closingCosts + capex);

	const expenses = leaseCommissionTotal + closingCosts + capex + loanInterestReserve;

	return sellerPrice + expenses;
};

export const calculateGoingInPrice = (
	annualNOI: number,
	targetCapRate: number
): number => {
	if (annualNOI === 0 || targetCapRate === 0) return 0;
	return annualNOI / (targetCapRate / 100);
};

// Retourne le sellerPrice à partir du cap rate stabilisé cible (incluant les dépenses)
export const calculateSellerPriceFromCapRateStabilized = (
	annualNOI: number,
	targetCapRate: number,
	assumptions: Assumptions
): number => {
	if (annualNOI === 0 || targetCapRate === 0) return 0;

	const capex = parseFormattedNumber(assumptions.capex);
	const leaseCommission = parseFormattedNumber(assumptions.leaseCommission) / 100;
	const leaseCommissionYears = parseFormattedNumber(assumptions.leaseCommissionYears);
	const closingCostsPercent = parseFormattedNumber(assumptions.closingCosts) / 100;
	const loanInterest = parseFormattedNumber(assumptions.loanInterest) / 100;
	const ltc = parseFormattedNumber(assumptions.ltc) / 100;

	// Calculate lease commission total
	const leaseCommissionTotal = leaseCommission * leaseCommissionYears * annualNOI;

	// Solve the equation algebraically:
	// targetCapRate/100 = NOI / (sellerPrice + expenses)
	// Where expenses = leaseCommissionTotal + closingCosts + capex + loanInterestReserve
	// closingCosts = sellerPrice × closingCostsPercent
	// loanInterestReserve = loanInterest × ltc × (sellerPrice + leaseCommissionTotal + closingCosts + capex)

	// Substituting:
	// targetCapRate/100 = NOI / (sellerPrice + leaseCommissionTotal + sellerPrice × closingCostsPercent + capex + loanInterest × ltc × (sellerPrice + leaseCommissionTotal + sellerPrice × closingCostsPercent + capex))

	// Let's define:
	// A = leaseCommissionTotal + capex
	// B = closingCostsPercent + loanInterest × ltc × (1 + closingCostsPercent)
	// C = loanInterest × ltc × A

	// The equation becomes:
	// targetCapRate/100 = NOI / (sellerPrice × (1 + B) + A + C)

	// Solving for sellerPrice:
	// sellerPrice × (1 + B) = (NOI / (targetCapRate/100)) - A - C
	// sellerPrice = ((NOI / (targetCapRate/100)) - A - C) / (1 + B)

	const A = leaseCommissionTotal + capex;
	const B = closingCostsPercent + loanInterest * ltc * (1 + closingCostsPercent);
	const C = loanInterest * ltc * A;

	const targetTotal = annualNOI / (targetCapRate / 100);
	const sellerPrice = (targetTotal - A - C) / (1 + B);

	return Math.max(0, sellerPrice);
};

export const getCapRateColor = (capRate: number): "green" | "orange" | "red" => {
	if (capRate >= 8.5) return "green";
	if (capRate >= 6.01) return "orange";
	return "red";
};

export const getCapRateColorClass = (capRate: number): string => {
	const color = getCapRateColor(capRate);
	switch (color) {
		case "green":
			return "bg-green-500";
		case "orange":
			return "bg-orange-500";
		case "red":
			return "bg-red-500";
		default:
			return "bg-gray-500";
	}
};
