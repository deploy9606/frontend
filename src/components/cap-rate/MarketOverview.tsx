import React from "react";
import type { CapRatePropertyData} from "../../types";
import { useMarketDataEstimation } from "../../hooks/useMarketOverview";

interface MarketOverviewProps {
  propData: CapRatePropertyData;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ propData }) => {

    if (!propData.propertyAddress) {
		return (
			<div className="glass-effect rounded-lg p-6 shadow-lg">
				<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
					
					📊 Market Overview 
				</h2>
				<div className="text-center py-8">
					<i className="fas fa-map-marked-alt text-4xl text-gray-400 mb-4"></i>
					<p className="text-gray-600">
						Enter a property address to view market analysis
					</p>
				</div>
			</div>
		);
	}
      const {  data,
        loading,
        error,
        
      // eslint-disable-next-line react-hooks/rules-of-hooks
      } = useMarketDataEstimation(propData.propertyAddress);
    
      if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div className="text-red-600">Error: {error}</div>;
      }
    
      if (!data) {
        return <div>No data available.</div>;
      }

      
  return (
   data.economicOutlook && <div className="p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📊 Market Overview ({data.year})</h2>

      <section>
        <h3 className="text-lg font-semibold text-blue-700 mb-1">📈 Economic Outlook</h3>
        <p className="text-gray-700">
          <span className="font-bold">Status:</span> {data.economicOutlook.status} <br />
          <span className="font-bold">Details:</span> {data.economicOutlook.description}
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-gray-700">🏢 Vacancy Rate</h4>
          <p>{data.vacancyRate.value} <span className="text-sm text-gray-500">({data.vacancyRate.source})</span></p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700">📦 Absorption Rate</h4>
          <p>{data.absorptionRate.value} <span className="text-sm text-gray-500">({data.absorptionRate.source})</span></p>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-blue-700 mb-1">💵 Lease Rates</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Building Rate</h4>
            <p>
              {data.leaseRates.buildingRate.average} ({data.leaseRates.buildingRate.range})<br />
              <span className="text-sm text-gray-500">{data.leaseRates.buildingRate.source}</span>
            </p>
          </div>
          <div>
            <h4 className="font-semibold">IOS Land Rate</h4>
            <p>
              {data.leaseRates.iosLandRate.average} ({data.leaseRates.iosLandRate.range})<br />
              <span className="text-sm text-gray-500">{data.leaseRates.iosLandRate.source}</span>
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-blue-700 mb-1">🏦 Cap Rates</h3>
        <p>
          <span className="font-bold">Average:</span> {data.capRates.average} ({data.capRates.range})<br />
          <span className="text-sm text-gray-500">{data.capRates.source}</span>
        </p>
      </section>

      {data.taxIncentives.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-blue-700 mb-1">🎁 Tax Incentives</h3>
          <ul className="list-disc list-inside">
            {data.taxIncentives.map((incentive, idx) => (
              <li key={idx}>
                <span className="font-medium text-gray-800">{incentive.name}:</span> {incentive.description} <br />
                <span className="text-sm text-gray-500">({incentive.source})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3 className="text-lg font-semibold text-blue-700 mb-1">🧾 Summary</h3>
        <p className="text-gray-700 whitespace-pre-line">{data.marketSummary}</p>
      </section>
    </div>
  );
};

export default MarketOverview;
