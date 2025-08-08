import React, { useEffect, useState } from "react";
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
 * Monthly NOI (derived, read-only) =
 *   ($/acre/mo × acres) + ($/sf/mo × building sf)
 * - Only $/acre/mo and $/sf/mo are editable.
 * - Any negative input or derived value clamps to 0.
 * - Sizes come from propertyData.
 */
export const NOICalculator: React.FC<NOICalculatorProps> = ({
  noiData,
  setNoiData,
  propertyData,
}) => {
  const [activeSection, setActiveSection] = useState<"monthly" | "acre" | "sqft">("monthly");

  // Helpers (no `any`)
  const toNum = (v: string | number | null | undefined): number =>
    parseFormattedNumber(String(v ?? ""));
  const fmtNum = (n: number, dp: number) =>
    formatNumber(Number.isFinite(n) ? n : 0, dp);
  const clamp0 = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);

  // Sizes (clamped non-negative)
  const acres = clamp0(propertyData.propertySize ? toNum(propertyData.propertySize) : 0);
  const sqft  = clamp0(propertyData.buildingSize ? toNum(propertyData.buildingSize) : 0);

  // Current rates
  const acreRate = clamp0(noiData.monthlyAcreNOI ? toNum(noiData.monthlyAcreNOI) : 0);
  const sqftRate = clamp0(noiData.monthlySqFtNOI ? toNum(noiData.monthlySqFtNOI) : 0);

  const sizesReady = acres > 0 && sqft > 0;

  // Recompute monthly NOI from current rates + sizes
  const computeMonthly = (acreR: number, sqftR: number, ac: number, sf: number) =>
    clamp0(acreR * ac + sqftR * sf);

  // Keep monthly NOI in sync if sizes change
  useEffect(() => {
    const newMonthly = computeMonthly(acreRate, sqftRate, acres, sqft);
    setNoiData((prev) => ({
      ...prev,
      monthlyPropertyNOI: fmtNum(newMonthly, 2),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acres, sqft]);

  // Handlers: edit $/acre/mo or $/sf/mo; monthly updates automatically
  const handleAcreRateChange = (value: string) => {
    const newAcre = clamp0(parseFormattedNumber(value));
    const newMonthly = computeMonthly(newAcre, sqftRate, acres, sqft);
    setNoiData((prev) => ({
      ...prev,
      monthlyAcreNOI: fmtNum(newAcre, 2),
      monthlyPropertyNOI: fmtNum(newMonthly, 2),
    }));
    setActiveSection("acre");
  };

  const handleSqftRateChange = (value: string) => {
    const newSqft = clamp0(parseFormattedNumber(value));
    const newMonthly = computeMonthly(acreRate, newSqft, acres, sqft);
    setNoiData((prev) => ({
      ...prev,
      monthlySqFtNOI: fmtNum(newSqft, 4),
      monthlyPropertyNOI: fmtNum(newMonthly, 2),
    }));
    setActiveSection("sqft");
  };

  const getSectionClass = (section: "monthly" | "acre" | "sqft") => {
    const base = "noi-section p-6 rounded-lg border-2 transition-all";
    return `${base} ${
      activeSection === section ? "active border-blue-500" : "border-gray-200 hover:border-gray-300"
    }`;
  };

  return (
    <div className="glass-effect rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i className="fas fa-calculator mr-3 text-green-600"></i>
        Net Operating Income (Monthly)
      </h2>

      {!sizesReady && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-triangle text-yellow-400"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Heads up:</strong> Monthly NOI is derived from per-unit values and the sizes in property data.
              </p>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                {acres === 0 && <li>Property size (acres) is missing.</li>}
                {sqft === 0 && <li>Building size (sq ft) is missing.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Property NOI (read-only) */}
        <div className={getSectionClass("monthly")} onClick={() => setActiveSection("monthly")}>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-building mr-2"></i>
            Monthly Property NOI (derived)
          </h3>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="text"
              value={noiData.monthlyPropertyNOI}
              readOnly
              className="block w-full pl-8 pr-3 py-3 border border-gray-200 bg-gray-50 rounded-md cursor-not-allowed"
              placeholder="0.00"
              onFocus={() => setActiveSection("monthly")}
            />
          </div>
        </div>

        {/* Monthly NOI per Acre (editable) */}
        <div className={getSectionClass("acre")} onClick={() => setActiveSection("acre")}>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-map mr-2"></i>
            Monthly NOI per Acre ($/acre/mo)
          </h3>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="text"
              value={noiData.monthlyAcreNOI}
              onChange={(e) => handleAcreRateChange(e.target.value)}
              className="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 8,500"
              onFocus={() => setActiveSection("acre")}
            />
          </div>
        </div>

        {/* Monthly NOI per Sq. Ft (editable) */}
        <div className={getSectionClass("sqft")} onClick={() => setActiveSection("sqft")}>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-ruler-combined mr-2"></i>
            Monthly NOI per Sq. Ft ($/sf/mo)
          </h3>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="text"
              value={noiData.monthlySqFtNOI}
              onChange={(e) => handleSqftRateChange(e.target.value)}
              className="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 0.35"
              onFocus={() => setActiveSection("sqft")}
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
              {formatCurrency(toNum(noiData.monthlyPropertyNOI) * 12)}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Annual NOI per Acre:</span>
            <div className="font-semibold text-blue-600">
              {formatCurrency(toNum(noiData.monthlyAcreNOI) * 12)} / acre / yr
            </div>
          </div>
          <div>
            <span className="text-gray-600">Annual NOI per Sq. Ft:</span>
            <div className="font-semibold text-purple-600">
              {formatCurrency(toNum(noiData.monthlySqFtNOI) * 12)} / sf / yr
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
