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
  const [activeSection, setActiveSection] = useState<"acre" | "sqft">("acre");

  const hasSizes =
    Boolean(propertyData.propertySize) && Boolean(propertyData.buildingSize);

  const ACRE_SF = 43560;

  const acres = hasSizes ? parseFormattedNumber(propertyData.propertySize as string) : 0;
  const buildingSqFt = hasSizes ? parseFormattedNumber(propertyData.buildingSize as string) : 0;
  const buildingAcres = buildingSqFt / ACRE_SF;

  const clampNonNegative = (n: number): number => (n < 0 ? 0 : n);

  /**
   * TOTAL (monthly) =
   *   (Monthly NOI per Acre × (Acres − Building Sq Ft in acres))
   * + ((Annual NOI per Sq Ft ÷ 12) × Building Sq Ft)
   *
   * NOTE: We store the annual $/sf value in `noiData.monthlySqFtNOI` for compatibility.
   */
  const computeMonthlyTotal = (acreRateStr: string, annualSqFtRateStr: string): number => {
    const acreRateMonthly = clampNonNegative(parseFormattedNumber(acreRateStr));
    const annualSqFtRate = clampNonNegative(parseFormattedNumber(annualSqFtRateStr));
    const monthlySqFtRate = annualSqFtRate / 12;

    const netLandAcres = clampNonNegative(acres - buildingAcres);

    const total =
      acreRateMonthly * netLandAcres + monthlySqFtRate * buildingSqFt;

    return clampNonNegative(total);
  };

  const handleRateChange = (section: "acre" | "sqft", rawValue: string) => {
    if (!hasSizes) return;

    const typedValueNum = parseFormattedNumber(rawValue);
    const safeValueStr =
      typedValueNum < 0 ? formatNumber(0, 2) : formatStringValue(rawValue);

    if (section === "acre") {
      const totalMonthly = computeMonthlyTotal(safeValueStr, noiData.monthlySqFtNOI);
      setNoiData((prev) => ({
        ...prev,
        monthlyAcreNOI: safeValueStr, // monthly $/acre
        monthlyPropertyNOI: formatNumber(totalMonthly, 2),
      }));
      setActiveSection("acre");
    } else {
      const totalMonthly = computeMonthlyTotal(noiData.monthlyAcreNOI, safeValueStr);
      setNoiData((prev) => ({
        ...prev,
        monthlySqFtNOI: safeValueStr, // ANNUAL $/sf (intentionally stored here)
        monthlyPropertyNOI: formatNumber(totalMonthly, 2),
      }));
      setActiveSection("sqft");
    }
  };

  const getSectionClass = (section: "monthly" | "acre" | "sqft") => {
    const isDisabled = !hasSizes || section === "monthly";
    const baseClass = `noi-section p-6 rounded-lg border-2 transition-all ${
      isDisabled
        ? "cursor-not-allowed opacity-50 border-gray-200 bg-gray-100"
        : "cursor-pointer"
    }`;
    if (isDisabled) return baseClass;
    const isActive =
      (section === "acre" && activeSection === "acre") ||
      (section === "sqft" && activeSection === "sqft");
    return `${baseClass} ${isActive ? "active border-blue-500" : "border-gray-200 hover:border-gray-300"}`;
  };

  const getTooltipMessage = (): string => {
    if (!propertyData.propertySize && !propertyData.buildingSize) {
      return "Please enter both property size (acres) and building size (sq ft) first";
    }
    if (!propertyData.propertySize) return "Please enter property size (acres) first";
    if (!propertyData.buildingSize) return "Please enter building size (sq ft) first";
    return "";
  };

  return (
    <div className="glass-effect rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i className="fas fa-calculator mr-3 text-green-600"></i>
        Net Operating Income (Monthly)
      </h2>

      {(!propertyData.propertySize || !propertyData.buildingSize) && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-triangle text-yellow-400"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Required Information:</strong> To use the NOI calculator, please first enter:
              </p>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                {!propertyData.propertySize && <li>Property size (acres)</li>}
                {!propertyData.buildingSize && <li>Building size (square feet)</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md-grid-cols-3 gap-6 md:grid-cols-3">
        {/* Monthly Property NOI (READ-ONLY, derived) */}
        <div className={getSectionClass("monthly")} title={getTooltipMessage()}>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-building mr-2"></i>
            Monthly Property NOI
            <i
              className="fas fa-lock ml-2 text-gray-400"
              title="Calculated from Monthly $/acre and (Annual $/sf ÷ 12)."
            ></i>
          </h3>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="text"
              value={noiData.monthlyPropertyNOI}
              className="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              placeholder="50,000"
              disabled
              readOnly
            />
          </div>
        </div>

        {/* Monthly NOI per Acre (editable) */}
        <div
          className={getSectionClass("acre")}
          onClick={() => hasSizes && setActiveSection("acre")}
          title={!hasSizes ? getTooltipMessage() : ""}
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-map mr-2"></i>
            Monthly NOI per Acre
            {!hasSizes && (
              <i className="fas fa-lock ml-2 text-gray-400" title={getTooltipMessage()}></i>
            )}
          </h3>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="text"
              value={noiData.monthlyAcreNOI}
              onChange={(e) => handleRateChange("acre", e.target.value)}
              className={`block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !hasSizes ? "cursor-not-allowed bg-gray-100" : ""
              }`}
              placeholder="10,000"
              onFocus={() => hasSizes && setActiveSection("acre")}
              disabled={!hasSizes}
              title={!hasSizes ? getTooltipMessage() : ""}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Land uses net area: acres − (building sq ft ÷ {ACRE_SF.toLocaleString()}).
          </p>
        </div>

        {/* Annual NOI per Sq. Ft (editable; divided by 12 in calc) */}
        <div
          className={getSectionClass("sqft")}
          onClick={() => hasSizes && setActiveSection("sqft")}
          title={!hasSizes ? getTooltipMessage() : ""}
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-ruler-combined mr-2"></i>
            Annual NOI per Sq. Ft
            {!hasSizes && (
              <i className="fas fa-lock ml-2 text-gray-400" title={getTooltipMessage()}></i>
            )}
          </h3>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="text"
              value={noiData.monthlySqFtNOI /* stores ANNUAL $/sf */}
              onChange={(e) => handleRateChange("sqft", e.target.value)}
              className={`block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !hasSizes ? "cursor-not-allowed bg-gray-100" : ""
              }`}
              placeholder="30.00"
              onFocus={() => hasSizes && setActiveSection("sqft")}
              disabled={!hasSizes}
              title={!hasSizes ? getTooltipMessage() : ""}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Building portion uses (annual ÷ 12) × building sq ft.
          </p>
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
            <span className="text-gray-600">Annual NOI per Acre (rate):</span>
            <div className="font-semibold text-blue-600">
              {formatCurrency(parseFormattedNumber(noiData.monthlyAcreNOI) * 12)}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Annual NOI per Sq. Ft (rate):</span>
            <div className="font-semibold text-purple-600">
              {formatCurrency(parseFormattedNumber(noiData.monthlySqFtNOI))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
