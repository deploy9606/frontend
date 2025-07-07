import React from "react";
import type { CapRatePropertyData } from "../../types";
import { useMarketDataEstimation } from "../../hooks/useMarketDataEstimation";
interface CapRateProps {
  propData: CapRatePropertyData;
}

const CapRateAnalysisDisplay: React.FC<CapRateProps> = ({ propData }) => {

  const {  data,
    loading,
    error  } = useMarketDataEstimation(propData.propertyAddress);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (!data) {
    return <div></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800">
        📊 Cap Rate Market Analysis – {data.region} ({data.year})
      </h2>

      {/* Market Averages */}
      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">📍 Market Averages</h3>
          <ul className="space-y-1 list-disc list-inside">
            {data.marketAverages.map((item, idx) => (
              <li key={idx}>
                {item.label}: <strong>{item.range}</strong>
              </li>
            ))}
          </ul>
        </div>

        {/* Subject Property */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">📌 Subject Property</h3>
          <p>{data.subjectProperty.locationNotes}</p>
          <p className="mt-1 text-green-700 font-medium">
            Classification: {data.subjectProperty.classification}
          </p>
          <p className="mt-2">
            🏷️ Expected Cap Rate Range: <strong className="text-blue-700">{data.subjectProperty.expectedCapRateRange}</strong>
          </p>
        </div>
      </div>

      {/* Market Context */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">🔍 Market Context</h3>
        <ul className="space-y-1 list-disc list-inside text-gray-700 text-sm">
          {data.marketContext.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Comparable Sales */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">🏡 Comparable Sales</h3>
        <ul className="space-y-1 list-disc list-inside text-sm">
          {data.comparableSales.map((comp, idx) => (
            <li key={idx}>
              <strong>{comp.name}</strong> ({comp.size}, {comp.location}): <strong>{comp.capRateRange}</strong> <span className="text-gray-500 text-xs">[{comp.source}]</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Investment Recommendation */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-1">📈 Investment Recommendation</h3>
        <p className="text-sm text-gray-800">
          Target Cap Rate: <strong className="text-yellow-900">{data.investmentRecommendation.targetCapRateRange}</strong>
        </p>
        <ul className="list-disc list-inside text-sm mt-2 text-gray-700">
          {data.investmentRecommendation.justification.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CapRateAnalysisDisplay;
