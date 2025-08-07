import React, { useState } from "react";
import type { NOIData, CapRatePropertyData } from "../../types";
import {
  parseFormattedNumber,
  formatCurrency,
  
  formatNumber,
} from "../../utils/calculations";

interface NOICalculatorProps {
  noiData: NOIData;
  setNoiData: React.Dispatch<React.SetStateAction<NOIData>>;
  propertyData: CapRatePropertyData;
}

/**
 * Logic enforced:
 * Monthly NOI = ($/acre/mo × acres) + ($/sf/mo × building sf)
 *
 * - User enters Monthly NOI (editable).
 * - Then user can edit EITHER $/acre/mo OR $/sf/mo (selectable). The other is auto-calculated
 *   so the identity holds. Sizes come only from `propertyData`.
 */
export const NOICalculator: React.FC<NOICalculatorProps> = ({
  noiData,
  setNoiData,
  propertyData,
}) => {
  const [activeSection, setActiveSection] = useState<"monthly" | "acre" | "sqft">("monthly");
  const [inputMode, setInputMode] = useState<"acre" | "sqft">("acre"); // which per-unit rate is user-editable

  const acres = propertyData.propertySize ? parseFormattedNumber(propertyData.propertySize) : 0;
  const sqft = propertyData.buildingSize ? parseFormattedNumber(propertyData.buildingSize) : 0;

  const monthlyTotal = noiData.monthlyPropertyNOI
    ? parseFormattedNumber(noiData.monthlyPropertyNOI)
    : 0;

  const acreRate = noiData.monthlyAcreNOI
    ? parseFormattedNumber(noiData.monthlyAcreNOI)
    : 0;

  const sqftRate = noiData.monthlySqFtNOI
    ? parseFormattedNumber(noiData.monthlySqFtNOI)
    : 0;

  const missingAcres = !propertyData.propertySize || acres <= 0;
  const missingSqft = !propertyData.buildingSize || sqft <= 0;
  const sizesReady = !missingAcres && !missingSqft;

  // --- Helpers
  const fmtNum = (n: number, dp: number) => formatNumber(isFinite(n) ? n : 0, dp);

  const recomputeOtherRate = (
    locked: "acre" | "sqft",
    totalMonthly: number,
    lockedVal: number
  ) => {
    if (!sizesReady) {
      setNoiData((prev) => ({
        ...prev,
        monthlyPropertyNOI: fmtNum(totalMonthly, 2),
        monthlyAcreNOI: locked === "acre" ? fmtNum(lockedVal, 2) : "0.00",
        monthlySqFtNOI: locked === "sqft" ? fmtNum(lockedVal, 4) : "0.0000",
      }));
      return;
    }

    if (locked === "acre") {
      // total = acreRate*acres + sqftRate*sqft  =>  sqftRate = (total - acreRate*acres)/sqft
      const newSqftRate = (totalMonthly - lockedVal * acres) / sqft;
      setNoiData((prev) => ({
        ...prev,
        monthlyPropertyNOI: fmtNum(totalMonthly, 2),
        monthlyAcreNOI: fmtNum(lockedVal, 2),
        monthlySqFtNOI: fmtNum(newSqftRate, 4),
      }));
    } else {
      // locked === "sqft" => acreRate = (total - sqftRate*sqft)/acres
      const newAcreRate = (totalMonthly - lockedVal * sqft) / acres;
      setNoiData((prev) => ({
        ...prev,
        monthlyPropertyNOI: fmtNum(totalMonthly, 2),
        monthlyAcreNOI: fmtNum(newAcreRate, 2),
        monthlySqFtNOI: fmtNum(lockedVal, 4),
      }));
    }
  };

  // --- Handlers
  const handleMonthlyChange = (value: string) => {
    const v = parseFormattedNumber(value);
    // Keep the currently selected inputMode as the "locked" rate; recompute the other
    const lockedVal = inputMode === "acre" ? acreRate : sqftRate;
    recomputeOtherRate(inputMode, isNaN(v) ? 0 : v, lockedVal);
    setActiveSection("monthly");
  };

  const handleAcreRateChange = (value: string) => {
    setInputMode("acre");
    const v = parseFormattedNumber(value);
    // Recompute sqft rate to keep total constant
    recomputeOtherRate("acre", monthlyTotal, isNaN(v) ? 0 : v);
    setActiveSection("acre");
  };

  const handleSqftRateChange = (value: string) => {
    setInputMode("sqft");
    const v = parseFormattedNumber(value);
    // Recompute acre rate to keep total constant
    recomputeOtherRate("sqft", monthlyTotal, isNaN(v) ? 0 : v);
    setActiveSection("sqft");
  };

  const getSectionClass = (section: "monthly" | "acre" | "sqft") => {
    const base = "noi-section p-6 rounded-lg border-2 transition-all";
    return `${base} ${
      activeSection === section ? "active border-blue-500" : "border-gray-200 hover:border-gray-300"
    }`;
  };

  const perUnitDisabledReason = () => {
    if (!sizesReady) return "Enter property acres and building sq ft first";
    if (!noiData.monthlyPropertyNOI || monthlyTotal === 0) return "Enter Monthly NOI first";
    return "";
  };

  const perUnitInputsEnabled = sizesReady && monthlyTotal !== 0;

  return (
    <div className="glass-effect rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i className="fas fa-calculator mr-3 text-green-600"></i>
        Net Operating Income (Monthly)
      </h2>

      {/* Notices */}
      {(!sizesReady || monthlyTotal === 0) && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-triangle text-yellow-400"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Heads up:</strong> Per-unit values are calculated from Monthly NOI using the sizes in
                property data.
              </p>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                {!sizesReady && (
                  <>
                    {missingAcres && <li>Property size (acres) is missing.</li>}
                    {missingSqft && <li>Building size (sq ft) is missing.</li>}
                  </>
                )}
                {monthlyTotal === 0 && <li>Enter Monthly Property NOI to enable per-unit inputs.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Input mode toggle */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-gray-600">Per-unit input mode:</span>
        <div className="inline-flex rounded-md shadow-sm overflow-hidden border border-gray-200">
          <button
            type="button"
            className={`px-3 py-1 text-sm ${inputMode === "acre" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
            onClick={() => {
              setInputMode("acre");
              // When switching, recompute the *now disabled* field from the current locked one
              recomputeOtherRate("acre", monthlyTotal, acreRate);
            }}
            disabled={!perUnitInputsEnabled}
            title={!perUnitInputsEnabled ? perUnitDisabledReason() : ""}
          >
            $/acre/mo
          </button>
          <button
            type="button"
            className={`px-3 py-1 text-sm border-l border-gray-200 ${
              inputMode === "sqft" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            }`}
            onClick={() => {
              setInputMode("sqft");
              recomputeOtherRate("sqft", monthlyTotal, sqftRate);
            }}
            disabled={!perUnitInputsEnabled}
            title={!perUnitInputsEnabled ? perUnitDisabledReason() : ""}
          >
            $/sf/mo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Property NOI (editable) */}
        <div
          className={getSectionClass("monthly")}
          onClick={() => setActiveSection("monthly")}
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-building mr-2"></i>
            Monthly Property NOI
          </h3>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="text"
              value={noiData.monthlyPropertyNOI}
              onChange={(e) => handleMonthlyChange(e.target.value)}
              className="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="50,000"
              onFocus={() => setActiveSection("monthly")}
            />
          </div>
        </div>

        {/* Monthly NOI per Acre (editable if mode=acre; otherwise read-only) */}
        <div
          className={getSectionClass("acre")}
          onClick={() => setActiveSection("acre")}
          title={!perUnitInputsEnabled ? perUnitDisabledReason() : ""}
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-map mr-2"></i>
            Monthly NOI per Acre ($/acre/mo)
            {(!perUnitInputsEnabled || inputMode !== "acre") && (
              <i className="fas fa-lock ml-2 text-gray-400"></i>
            )}
          </h3>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="text"
              value={noiData.monthlyAcreNOI}
              onChange={(e) => handleAcreRateChange(e.target.value)}
              className={`block w-full pl-8 pr-3 py-3 border rounded-md focus:outline-none ${
                inputMode === "acre" && perUnitInputsEnabled
                  ? "border-gray-300 focus:ring-2 focus:ring-blue-500"
                  : "border-gray-200 bg-gray-50 cursor-not-allowed"
              }`}
              placeholder="e.g., 8,500"
              onFocus={() => setActiveSection("acre")}
              disabled={!perUnitInputsEnabled || inputMode !== "acre"}
            />
          </div>
        </div>

        {/* Monthly NOI per Sq. Ft (editable if mode=sqft; otherwise read-only) */}
        <div
          className={getSectionClass("sqft")}
          onClick={() => setActiveSection("sqft")}
          title={!perUnitInputsEnabled ? perUnitDisabledReason() : ""}
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-ruler-combined mr-2"></i>
            Monthly NOI per Sq. Ft ($/sf/mo)
            {(!perUnitInputsEnabled || inputMode !== "sqft") && (
              <i className="fas fa-lock ml-2 text-gray-400"></i>
            )}
          </h3>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="text"
              value={noiData.monthlySqFtNOI}
              onChange={(e) => handleSqftRateChange(e.target.value)}
              className={`block w-full pl-8 pr-3 py-3 border rounded-md focus:outline-none ${
                inputMode === "sqft" && perUnitInputsEnabled
                  ? "border-gray-300 focus:ring-2 focus:ring-blue-500"
                  : "border-gray-200 bg-gray-50 cursor-not-allowed"
              }`}
              placeholder="e.g., 0.35"
              onFocus={() => setActiveSection("sqft")}
              disabled={!perUnitInputsEnabled || inputMode !== "sqft"}
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
