import React from "react";
import {
	TenantResearchHeader,
	PromptConfigPanel,
	PropertyForm,
	AdvancedLoadingIndicator,
	AnalysisResultsDisplay,
	DropdownSection,
} from "./components";
import { useTenantResearch } from "./hooks/useTenantResearch";

const TenantResearch: React.FC = () => {
	const {
		// États du formulaire
		propertyAddress,
		setPropertyAddress,
		propertyType,
		setPropertyType,
		squareFootage,
		setSquareFootage,
		acreage,
		setAcreage,
		buildingFeatures,
		setBuildingFeatures,
		analysisType,
		setAnalysisType,
		useAiScoring,
		setUseAiScoring,
		results,
		loading,
		error,

		// États de configuration
		showPromptConfig,
		setShowPromptConfig,
		promptConfig,
		setPromptConfig,
		configLoading,
		configError,

		// États des dropdowns
		showPropertyForm,
		setShowPropertyForm,
		showPropertyAnalysis,
		setShowPropertyAnalysis,
		showMarketAnalysis,
		setShowMarketAnalysis,
		showTenantTable,
		setShowTenantTable,

		// États de progression
		progress,

		// Fonctions
		savePromptConfig,
		resetPromptConfig,
		handleSubmit,
	} = useTenantResearch();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="flex flex-col items-center justify-start min-h-screen py-8 px-4">
				{/* Header */}
				<TenantResearchHeader />

				{/* Configuration Dropdown */}
				<div className="w-full max-w-4xl mb-6">
					<DropdownSection
						title="AI Prompt Configuration"
						icon="⚙️"
						isOpen={showPromptConfig}
						onToggle={setShowPromptConfig}
					>
						<PromptConfigPanel
							config={promptConfig}
							loading={configLoading}
							error={configError}
							onSave={savePromptConfig}
							onClose={() => setShowPromptConfig(false)}
							onChange={setPromptConfig}
							onResetPromptConfig={resetPromptConfig}
						/>
					</DropdownSection>
				</div>

				{/* Property Form Dropdown */}
				<div className="w-full max-w-4xl mb-6">
					<DropdownSection
						title="Property Analysis Form"
						icon="🏢"
						isOpen={showPropertyForm}
						onToggle={setShowPropertyForm}
					>
						<PropertyForm
							propertyAddress={propertyAddress}
							propertyType={propertyType}
							squareFootage={squareFootage}
							acreage={acreage}
							buildingFeatures={buildingFeatures}
							analysisType={analysisType}
							useAiScoring={useAiScoring}
							loading={loading}
							onPropertyAddressChange={setPropertyAddress}
							onPropertyTypeChange={setPropertyType}
							onSquareFootageChange={setSquareFootage}
							onAcreageChange={setAcreage}
							onBuildingFeaturesChange={setBuildingFeatures}
							onAnalysisTypeChange={setAnalysisType}
							onUseAiScoringChange={setUseAiScoring}
							onSubmit={handleSubmit}
						/>
					</DropdownSection>
				</div>

				{/* Loading Indicator */}
				<AdvancedLoadingIndicator
					show={loading}
					progress={progress}
					aiScoringEnabled={useAiScoring}
				/>

				{/* Error Display */}
				{error && (
					<div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md max-w-4xl w-full">
						{error}
					</div>
				)}

				{/* Results */}
				{results && (
					<div className="w-full max-w-4xl space-y-6">
						<AnalysisResultsDisplay
							results={results}
							showPropertyAnalysis={showPropertyAnalysis}
							setShowPropertyAnalysis={setShowPropertyAnalysis}
							showMarketAnalysis={showMarketAnalysis}
							setShowMarketAnalysis={setShowMarketAnalysis}
							showTenantTable={showTenantTable}
							setShowTenantTable={setShowTenantTable}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default TenantResearch;
