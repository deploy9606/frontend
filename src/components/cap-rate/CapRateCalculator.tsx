import React, { useState } from "react";
import type { CapRatePropertyData, NOIData, Assumptions, CapRateAnalysis} from "../../types";
import { ManualEntry } from "./ManualEntry.tsx";
import { NOICalculator } from "./NOICalculator.tsx";
import { Assumptions as AssumptionsComponent } from "./Assumptions.tsx";
import { Results } from "./Results.tsx";
import { CustomCapRateCalculator } from "./CustomCapRateCalculator.tsx";
import { MarketStudy } from "./MarketStudy.tsx";
import CapRateAnalysisDisplay  from "./CapRateAnalysisDisplay.tsx";
import MarketOverview from "./MarketOverview.tsx";
import Development from "./Development.tsx";
import InvestmentRecommendation from "./InvestmentRecommendation.tsx";

const CapRateCalculator: React.FC = () => {
	// Property Data State
	const [propertyData, setPropertyData] = useState<CapRatePropertyData>({
		sellerAskingPrice: "",
		propertyAddress: "",
		propertyType: "",
		propertySize: "", // in acres
		buildingSize: "", // in sq ft
		geminiBuildingRate: undefined,
		geminiBuildingRateConfidence: undefined,
		buildingRateIsLoading: false,
		buildingRateError: undefined,
	});

	// NOI Data State
	const [noiData, setNoiData] = useState<NOIData>({
		monthlyPropertyNOI: "",
		monthlyAcreNOI: "",
		monthlySqFtNOI: "",
	});

	// Assumptions State
	const [assumptions, setAssumptions] = useState<Assumptions>({
		leaseCommission: "3",
		leaseCommissionYears: "5",
		closingCosts: "5",
		loanInterest: "7.0",
		ltc: "30",
		capex: "150000",
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [marketData, setMarketData] = useState<CapRateAnalysis>({
		region: "", // e.g., "Baltimore"
		year: 2024,
		marketAverages: [],
		subjectProperty: {
			locationNotes: "",
			classification: "",
			expectedCapRateRange: "",
		},
		marketContext: [],
		comparableSales: [],
		investmentRecommendation: {
			targetCapRateRange: "",
			justification: [],
		},
	});

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Industrial Property Cap Rate Calculator
					</h1>
					<p className="text-gray-600">
						Analyze investment returns and determine optimal pricing for industrial
						properties
					</p>
				</div>

				<div className="space-y-8">
					{/* Manual Entry Section */}
					<ManualEntry propertyData={propertyData} setPropertyData={setPropertyData} />

					{/* NOI Calculator Section */}
					<NOICalculator
						noiData={noiData}
						setNoiData={setNoiData}
						propertyData={propertyData}
					/>

					{/* Assumptions Section */}
					<AssumptionsComponent
						assumptions={assumptions}
						setAssumptions={setAssumptions}
					/>

					{/* Results Section */}
					{noiData.monthlyPropertyNOI && propertyData.sellerAskingPrice && (
						<Results
							propertyData={propertyData}
							noiData={noiData}
							assumptions={assumptions}
						/>
					)}

					{/* Custom Cap Rate Calculator */}
					{noiData.monthlyPropertyNOI && (
						<CustomCapRateCalculator noiData={noiData} assumptions={assumptions} />
					)}

					{/* Market Study Section */}
					<MarketStudy propertyData={propertyData} />
					{/* Market Data Estimation */}
					<CapRateAnalysisDisplay propData={propertyData} />
					<MarketOverview propData={propertyData} />

					{/* Cap Rate Analysis Display */}
					<Development propData={propertyData} />

					<InvestmentRecommendation propData={propertyData} />
					
					
				</div>

				{/* Footer */}
				<footer className="mt-16 py-8 border-t border-gray-200">
					<div className="text-center text-gray-600">
						<p className="mb-2">
							<strong>9606 Capital</strong> - Industrial Property Investment Analysis Tool
						</p>
						<p className="text-sm">
							This calculator provides estimates for investment analysis purposes. Consult
							with financial professionals for investment decisions.
						</p>
					</div>
				</footer>
			</div>
		</div>
	);
};

export default CapRateCalculator;
