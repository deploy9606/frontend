import React from "react";
import type { CapRatePropertyData } from "../../types";
import { useDevelopmentData } from "../../hooks/useDevelopmentData";

interface MarketOverviewProps {
  propData: CapRatePropertyData | null;
}

type Impact = "positive" | "negative" | "neutral" | (string & {});
type GrowthStatus = "Growing" | "Declining" | "Stable" | (string & {});

interface DevelopmentItem {
  name: string;
  type: string;
  distanceFromSubject: string;
  description: string;
  impact: Impact;
  investmentValue: string;
  status: string;
  completionDate: string;
  source: string;
}

interface OffshoringEntry {
  company: string;
  activity: string;
  location: string;
  description: string;
  forecastImpact: Impact;
  timeline: string;
  source: string;
}

interface DevelopmentData {
  region: string;
  analysisDate: string;
  growthStatus: GrowthStatus;
  growthSummary: string;
  developments: DevelopmentItem[];
  offshoringActivity: OffshoringEntry[];
  developmentSummary: string;
}

interface UseDevelopmentDataResult {
  data: DevelopmentData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const Development: React.FC<MarketOverviewProps> = ({ propData }) => {
  const address = propData?.propertyAddress?.trim() ?? "";
  const propertyType = propData?.propertyType?.trim() ?? "";
  const buildingSize = propData?.buildingSize?.trim() ?? "";
  const hasPropData = Boolean(address && propertyType && buildingSize);

  // Match the hook's actual shape: { data, loading, error, refetch }
  const { data, loading, error /* refetch */ } =
    useDevelopmentData(address, propertyType, buildingSize) as UseDevelopmentDataResult;

  if (!hasPropData) {
    return (
      <div className="glass-effect rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">📈 Market Development Overview</h2>
        <div className="text-center py-8">
          <i className="fas fa-map-marked-alt text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">Please provide complete property data to view the market analysis.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-effect rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Market Development Overview</h2>
        <p className="text-gray-600">Analyzing the market…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-effect rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Market Development Overview</h2>
        <p className="text-red-600">Couldn’t load market data: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-effect rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Market Development Overview</h2>
        <p className="text-gray-600">No data returned for this property.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">📈 Market Development Overview</h2>
        <p className="text-sm text-gray-500">
          Region: {data.region} • Analyzed on {new Date(data.analysisDate).toLocaleDateString()}
        </p>
        <p className="mt-2 font-semibold">
          Market Status:{" "}
          <span
            className={`px-2 py-1 rounded text-white ${
              data.growthStatus === "Growing"
                ? "bg-green-600"
                : data.growthStatus === "Declining"
                ? "bg-red-600"
                : "bg-yellow-500"
            }`}
          >
            {data.growthStatus}
          </span>
        </p>
        <p className="mt-2 text-gray-700">{data.growthSummary}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">🏗️ Top 10 New Developments</h3>
        {data.developments.length > 0 ? (
          data.developments.slice(0, 10).map((dev, idx) => (
            <div key={`${dev.name}-${idx}`} className="border-t border-gray-200 pt-3 mt-3">
              <h4 className="text-lg font-bold text-blue-700">{dev.name}</h4>
              <p className="text-sm text-gray-600 italic">{dev.type} • {dev.distanceFromSubject}</p>
              <p className="mt-1 text-gray-700">{dev.description}</p>
              <div className="text-sm text-gray-600 mt-1">
                Impact:{" "}
                <span
                  className={`font-medium ${
                    dev.impact === "positive" ? "text-green-700"
                    : dev.impact === "negative" ? "text-red-700"
                    : "text-gray-700"
                  }`}
                >
                  {dev.impact}
                </span>{" "}
                • Investment: {dev.investmentValue} • Status: {dev.status} • Completion: {dev.completionDate}
              </div>
              <p className="text-xs text-gray-500 mt-1">Source: {dev.source}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No new developments found in the last 12 months.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">🌍 Offshoring Activity</h3>
        {data.offshoringActivity.length > 0 ? (
          data.offshoringActivity.map((entry, idx) => (
            <div key={`${entry.company}-${idx}`} className="border-t border-gray-200 pt-3 mt-3">
              <h4 className="text-lg font-bold text-blue-700">{entry.company}</h4>
              <p className="text-sm text-gray-600 italic">{entry.activity} • {entry.location}</p>
              <p className="mt-1 text-gray-700">{entry.description}</p>
              <div className="text-sm text-gray-600 mt-1">
                Forecast Impact:{" "}
                <span
                  className={`font-medium ${
                    entry.forecastImpact === "positive" ? "text-green-700"
                    : entry.forecastImpact === "negative" ? "text-red-700"
                    : "text-gray-700"
                  }`}
                >
                  {entry.forecastImpact}
                </span>{" "}
                • Timeline: {entry.timeline}
              </div>
              <p className="text-xs text-gray-500 mt-1">Source: {entry.source}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No offshoring activity found in the last 12 months.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">🧾 Summary</h3>
        <p className="text-gray-700">{data.developmentSummary}</p>
      </div>
    </div>
  );
};

export default Development;
