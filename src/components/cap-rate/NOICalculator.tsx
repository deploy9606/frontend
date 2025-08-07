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

  // Which per-unit rate should remain fixed when user edits total Monthly NOI?
  const [lastEditedRate, setLastEditedRate] = useState<"acre" | "sqft" | null>(null);

  const handleNOIChange = (
    section: "monthly" | "acre" | "sqft",
    value: string
  ) => {
    // Require both sizes to compute derived values
    if (!propertyData.propertySize || !propertyData.buildingSize) return;

    const acres = parseFormattedNumber(propertyData.propertySize);
    const sqft = parseFormattedNumber(propertyData.buildingSize);
    if (!acres || !sqft) return; // guard against zero/invalid sizes

    const v = parseFormattedNumber(value);

    // Current rates (monthly)
    const currentAcreRate = parseFormattedNumber(noiData.monthlyAcreNOI); // $/acre/mo
    const currentSqftRate = parseFormattedNumber(noiData.monthlySqFtNOI); // $/sf/mo

    if (section === "monthly") {
      const monthlyProp = v;

      // decide which rate is locked
      let locked: "acre" | "sqft" | null = lastEditedRate;
      if (!locked) {
        if (currentAcreRate > 0) locked = "acre";
        else if (currentSqftRate > 0) locked = "sqft";
      }

      if (locked === "acre" && currentAcreRate >= 0) {
        const remainder = monthlyProp - currentAcreRate * acres;
        const newSqftRate = remainder / sqft;
        setNoiData((prev) => ({
          ...prev,
          monthlyPropertyNOI: formatStringValue(value),
          monthlyAcreNOI: formatNumber(currentAcreRate, 2),
          monthlySqFtNOI: formatNumber(newSqftRate, 4),
        }));
      } else if (locked === "sqft" && currentSqftRate >= 0) {
        const remainder = monthlyProp - currentSqftRate * sqft;
        const newAcreRate = remainder / acres;
        setNoiData((prev) => ({
          ...prev,
          monthlyPropertyNOI: formatStringValue(value),
          monthlyAcreNOI: formatNumber(newAcreRate, 2),
          monthlySqFtNOI: formatNumber(currentSqftRate, 4),
        }));
      } else {
        // No locked rate yet → keep total, zero the per-unit rates until user sets one
        setNoiData((prev) => ({
          ...prev,
          monthlyPropertyNOI: formatStringValue(value),
          monthlyAcreNOI: "0.00",
          monthlySqFtNOI: "0.0000",
        }));
      }
    } else if (section === "acre") {
      const acreRate = v; // $/acre/mo
      const monthlyProp = acreRate * acres + currentSqftRate * sqft;
      setNoiData((prev) => ({
        ...prev,
        monthlyPropertyNOI: formatNumber(monthlyProp, 2),
        monthlyAcreNOI: formatStringValue(value),
        monthlySqFtNOI: formatNumber(currentSqftRate, 4),
      }));
      setLastEditedRate("acre");
    } else if (section === "sqft") {
      const sqftRate = v; // $/sf/mo
      const monthlyProp = currentAcreRate * acres + sqftRate * sqft;
      setNoiData((prev) => ({
        ...prev,
        monthlyPropertyNOI: formatNumber(monthlyProp, 2),
        monthlyAcreNOI: formatNumber(currentAcreRate, 2),
        monthlySqFtNOI: formatStringValue(value),
      }));
      setLastEditedRate("sqft");
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

      {/* Info message when sizes are missing */}
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
              <i className="fas fa-lock ml-2 text-gray-400" title={getTooltipMessage()}></i>
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

        {/* Monthly NOI per Acre ($/acre/mo) */}
        <div
          className={getSectionClass("acre")}
          onClick={() => !isFieldDisabled() && setActiveSection("acre")}
          title={isFieldDisabled() ? getTooltipMessage() : ""}
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-map mr-2"></i>
            Monthly NOI per Acre ($/acre/mo)
            {isFieldDisabled() && (
              <i className="fas fa-lock ml-2 text-gray-400" title={getTooltipMessage()}></i>
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

        {/* Monthly NOI per Sq. Ft ($/sf/mo) */}
        <div
          className={getSectionClass("sqft")}
          onClick={() => !isFieldDisabled() && setActiveSection("sqft")}
          title={isFieldDisabled() ? getTooltipMessage() : ""}
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-ruler-combined mr-2"></i>
            Monthly NOI per Sq. Ft ($/sf/mo)
            {isFieldDisabled() && (
              <i className="fas fa-lock ml-2 text-gray-400" title={getTooltipMessage()}></i>
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
              placeholder="0.25"
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
        <div className="grid grid-cols-1 md-grid-cols-3 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Annual Property NOI:</span>
            <div className="font-semibold text-green-600">
              {formatCurrency(parseFormattedNumber(noiData.monthlyPropertyNOI) * 12)}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Annual NOI per Acre:</span>
            <div className="font-semibold text-blue-600">
              {formatCurrency(parseFormattedNumber(noiData.monthlyAcreNOI) * 12)} / acre / yr
            </div>
          </div>
          <div>
            <span className="text-gray-600">Annual NOI per Sq. Ft:</span>
            <div className="font-semibold text-purple-600">
              {formatCurrency(parseFormattedNumber(noiData.monthlySqFtNOI) * 12)} / sf / yr
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
