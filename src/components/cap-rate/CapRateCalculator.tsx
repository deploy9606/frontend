import React, { useRef, useState } from "react";
import type { CapRatePropertyData, NOIData, Assumptions} from "../../types";
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
import { GenerateReportButton } from "./GenerateReportButton.tsx";

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
	const noiRef = useRef<HTMLDivElement>(null);
	const capRateRef = useRef<HTMLDivElement>(null);
	const marketStudyRef = useRef<HTMLDivElement>(null);
	const marketOverviewRef = useRef<HTMLDivElement>(null);
	const developmentRef = useRef<HTMLDivElement>(null);
	const capRateAnalysisDisplayRef = useRef<HTMLDivElement>(null);
	const investmentRecommendationRef = useRef<HTMLDivElement>(null);




	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Selective Acquisition
					</h1>
					<p className="text-gray-600">
						Analyze investment returns and determine optimal pricing for industrial
						properties
					</p>
				</div>

				<div className="space-y-8">
					<GenerateReportButton
						coverMeta={{
							logoSrc: new URL("/9606.png", window.location.origin).href,
							brandColor: "#c00000",
							title: "9606 Capital - Industrial Property Investment Analysis",
							date: new Date().toLocaleDateString(),
							propertyAddress: propertyData.propertyAddress,
							propertyType: propertyData.propertyType,
							propertySize: propertyData.propertySize,
							buildingSize: propertyData.buildingSize,
						}}
						sections={[
							{ ref: noiRef as unknown as React.RefObject<HTMLElement>, title: "NOI Calculator" },
							{ ref: capRateRef as unknown as React.RefObject<HTMLElement>, title: "Cap Rate Calculator" },
							{ ref: marketStudyRef as unknown as React.RefObject<HTMLElement>, title: "Market Study" },
							{ ref: marketOverviewRef as unknown as React.RefObject<HTMLElement>, title: "Market Overview" },
							{ ref: developmentRef as unknown as React.RefObject<HTMLElement>, title: "Development" },
							{ ref: capRateAnalysisDisplayRef as unknown as React.RefObject<HTMLElement>, title: "Cap Rate Analysis" },
							{ ref: investmentRecommendationRef as unknown as React.RefObject<HTMLElement>, title: "Investment Recommendation" },
						]}
						filename="Property_Analysis_Report.pdf"
						pageFormat="letter"
						includePageNumbers />


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
					<div ref={noiRef} className="bg-white">
					{/* Results Section */}
					{noiData.monthlyPropertyNOI && propertyData.sellerAskingPrice && (
						<Results
							propertyData={propertyData}
							noiData={noiData}
							assumptions={assumptions}
						/>
					)}
					</div>
					<div ref={capRateRef} className="bg-white">
					{/* Custom Cap Rate Calculator */}
					{noiData.monthlyPropertyNOI && (
						<CustomCapRateCalculator noiData={noiData} assumptions={assumptions} />
					)}
					</div>
					<div ref={marketStudyRef} className="bg-white">

					{/* Market Study Section */}
					<MarketStudy propertyData={propertyData} />
					</div>
					<div ref={capRateAnalysisDisplayRef} className="bg-white">
					{/* Market Data Estimation */}
					<CapRateAnalysisDisplay propData={propertyData} />
					</div>
					<div ref={marketOverviewRef} className="bg-white">
					<MarketOverview propData={propertyData} />
					</div>
					<div ref={developmentRef} className="bg-white">
					{/* Cap Rate Analysis Display */}
					<Development propData={propertyData} />
					</div>
					<div ref={investmentRecommendationRef} className="bg-white">

					<InvestmentRecommendation propData={propertyData} />
					</div>
					
					
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
