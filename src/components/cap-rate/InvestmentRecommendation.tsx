import React from "react";
import type { CapRatePropertyData } from "../../types";
import { useInvestmentRecommendation } from "../../hooks/useInvestmentRecommendation";

interface InvestmentProps {
  propData: CapRatePropertyData;
}



const InvestmentRecommendation: React.FC<InvestmentProps> = ({ propData }) => {
  if (
    !propData ||
    !propData.propertyAddress?.trim() ||
    !propData.propertyType?.trim() ||
    !propData.buildingSize?.trim() ||
    !propData.sellerAskingPrice?.trim()
  ) {
    return (
      <div className="glass-effect rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          📊 Investment Recommendation
        </h2>
        <div className="text-center py-8">
          <i className="fas fa-warehouse text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">
            Please provide complete property data to evaluate investment strategy.
          </p>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useInvestmentRecommendation(
    propData.propertyAddress,
    propData.propertyType,
    propData.buildingSize,
    propData.sellerAskingPrice
  );

  if (!data) {
    return (
      <div className="glass-effect rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          📊 Investment Recommendation
        </h2>
        <div className="text-center py-8">
          <i className="fas fa-warehouse text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">
            Enter a property address to evaluate investment opportunities.
          </p>
        </div>
      </div>
    );
  }
  if(data.propertyAnalysis === null || data.marketAnalysis === null || data.investmentSummary === null) {
    return (
      <div className="glass-effect rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          📊 Investment Recommendation
        </h2>
        <div className="text-center py-8">
          <i className="fas fa-warehouse text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">
            Failed to retrieve investment recommendation data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📊 Investment Recommendation</h2>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">🏢 Property Strengths & Risks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-700 mb-1">Strengths</h4>
            <ul className="list-disc ml-6 text-gray-700">
              {data.propertyAnalysis ? data.propertyAnalysis.strengths.map((point, i) => <li key={i}>{point}</li>): <li>No strengths data available</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-700 mb-1">Risks</h4>
            <ul className="list-disc ml-6 text-gray-700">
              {data.propertyAnalysis.risks.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">🌍 Market Strengths & Risks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-700 mb-1">Strengths</h4>
            <ul className="list-disc ml-6 text-gray-700">
              {data.marketAnalysis.strengths.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-700 mb-1">Risks</h4>
            <ul className="list-disc ml-6 text-gray-700">
              {data.marketAnalysis.risks.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">💼 Strategic Investment Summary</h3>
        <p className="mb-2"><span className="font-semibold">Timing:</span> {data.investmentSummary.timing}</p>
        <p className="mb-2"><span className="font-semibold">Strategy:</span> {data.investmentSummary.strategy}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
          <div>
            <h4 className="font-medium text-green-700 mb-1">Key Strengths</h4>
            <ul className="list-disc ml-6 text-gray-700">
              {data.investmentSummary.keyStrengths.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-700 mb-1">Risks to Monitor</h4>
            <ul className="list-disc ml-6 text-gray-700">
              {data.investmentSummary.risksToMonitor.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-4 bg-gray-50 p-4 rounded border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">🧾 Summary</h4>
          <p className="text-gray-700">{data.investmentSummary.summary}</p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentRecommendation;
