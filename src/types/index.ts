// Types pour l'application 9606 Capital

export interface PropertyData {
	address: string;
	type:
		| "warehouse"
		| "manufacturing"
		| "flex"
		| "cold-storage"
		| "ios"
		| "rd"
		| "data-center";
	squareFootage: number;
	acreage: number;
	features: string[];
	use_ai_scoring?: boolean; // Option pour activer le scoring par IA
}

export interface TenantRanking {
	// Informations de base de l'entreprise (nouvelles données émergentes)
	company: string;
	operations: string;
	contact_info: string; // Informations de contact (email)
	score: number; // Score unifié (0-100) qui remplace likelihood et globalScore

	// Localisation et proximité (critères 9606 Capital)
	nearbyLocation: string; // Site spécifique à proximité
	distance: string; // Distance en miles

	// Adéquation avec la propriété (conservé seulement benefitType pour la logique interne)
	benefitType: "warehouse_space" | "office_space" | "mixed_use" | "other";

	// Type d'industrie et catégorisation
	industryType: "3PL" | "Manufacturing" | "Food" | "Tech" | "Retail" | "Other";

	// Scores détaillés pour l'analyse (optionnels à afficher)
	marketFit?: number; // Croissance zone + industrie
	propertyMatch?: number; // Adéquation opérationnelle + bâtiment
	growthPotential?: number; // Capacité + timing + pression concurrentielle

	// Scores générés par IA (nouveaux)
	aiReasoning?: string; // Explication du scoring par IA
	keyStrengths?: string[]; // Points forts identifiés par IA
	riskFactors?: string[]; // Facteurs de risque identifiés par IA

	// Paragraphe de bénéfices selon le format du prompt
	benefitParagraph: string;
}

export interface MarketAnalysis {
	// Données de base (legacy)
	localTrends: string;
	industryGrowth: string;
	areaGrowthScore: number;
	demandIndicators: string[];

	// Nouvelles propriétés spécifiques au prompt 9606 Capital
	areaGrowthTrends: string; // Tendances économiques de la zone
	nationalIndustryTrend: string; // Tendances industrielles nationales
	boomingIndustry: string; // Secteurs en forte croissance
	recentRealEstateNews: string; // Actualités immobilières récentes
	competitiveFactors: string[]; // Facteurs compétitifs de la zone
}

export interface PropertyAnalysis {
	// Données de base (legacy)
	configuration: string;
	marketFit: string;
	keyFeatures: string;

	// Nouvelles propriétés selon le format 9606 Capital
	propertyFeatures: string[]; // Liste des caractéristiques de la propriété
	briefPropertyInfo: string; // Informations brèves sur la propriété (zonage, proximité)

	// Spécifications techniques détaillées
	technicalSpecs: {
		buildingType: string;
		totalArea: number;
		landArea: number;
		loadingDocks: string; // Nombre estimé de quais de chargement
		clearHeight: string; // Hauteur sous plafond
		parkingSpaces: string; // Nombre de places de parking
	};

	// Types d'utilisation cibles
	targetUseTypes: string[]; // ["warehouse_space", "office_space", "mixed_use", "other"]
}

export interface AnalysisResults {
	propertyAnalysis?: PropertyAnalysis;
	tenantRanking?: TenantRanking[];
	marketContext?: MarketAnalysis;
	// Erreurs par section
	errors?: {
		propertyAnalysis?: string;
		marketAnalysis?: string;
		tenantRanking?: string;
	};
	// Nouvelles métadonnées pour l'analyse 9606 Capital
	metadata?: {
		analysisDate: string;
		promptVersion: string;
		focusStrategy: string;
		totalCandidatesAnalyzed?: number;
		rankingCriteria?: string[];
		contactInfo?: string;
		// Métadonnées scoring IA
		aiScoringEnabled?: boolean;
		aiScoringModel?: string;
		tenantsWithAIScoring?: number;
	};
}

export interface PromptConfig {
	focus: string;
	// Configuration pour locataires émergents
	discovery_strategy: string; // Fusion de discovery_strategy et growth_stage
	exclude_companies: string[];
	target_types: string[];
	search_radius_miles: number;
	preferred_company_size: string;
	focus_industries: string[];
	// Configuration commune
	result_count: number;
	ranking_criteria: string[];
	tone: string;
	// Note: use_ai_scoring retiré - maintenant dans PropertyData
}

// Types pour le calculateur Cap Rate
export interface CapRatePropertyData {
	sellerAskingPrice: string;
	propertyAddress: string;
	propertyType: string;
	propertySize: string; // en acres
	buildingSize: string; // en sq ft	// AI building rate estimation data
	geminiBuildingRate?: number; // AI estimated rate
	openAIBuildingRate?: number; // AI estimated rate
	geminiLowerEnd?: number; // Lower end of AI estimated rate
	openAILowerEnd?: number; // Lower end of AI estimated rate
	geminiUpperEnd?: number; // Upper end of AI estimated rate
	openAIUpperEnd?: number; // Upper end of AI estimated rate
	geminiBuildingRateConfidence?: "high" | "medium" | "low";
	openAIBuildingRateConfidence?: "high" | "medium" | "low";

	buildingRateIsLoading?: boolean;
	buildingRateError?: string;


	geminiLandRate?: number; // AI estimated rate
	openAILandRate?: number; // AI estimated rate
	geminiLandLowerEnd?: number; // Lower end of AI estimated rate
	openAILandLowerEnd?: number; // Lower end of AI estimated rate
	geminiLandUpperEnd?: number; // Upper end of AI estimated rate
	openAILandUpperEnd?: number; // Upper end of AI estimated rate
	geminiLandRateConfidence?: "high" | "medium" | "low";
	openAILandRateConfidence?: "high" | "medium" | "low";

	landRateIsLoading?: boolean;
	landRateError?: string;
}

export interface NOIData {
	monthlyPropertyNOI: string;
	monthlyAcreNOI: string;
	monthlySqFtNOI: string;
}

export interface Assumptions {
	leaseCommission: string;
	leaseCommissionYears: string;
	closingCosts: string;
	loanInterest: string;
	ltc: string;
	capex: string;
}

export interface CalculationResults {
	monthlyNOI: number;
	annualNOI: number;
	goingInCapRate: number;
	allInCapRate: number;
	assumptions: {
		capex: number;
		closingCosts: number;
		leaseCommission: number;
		loanInterest: number;
		ltc: number;
	};
}

export interface MarketData {
	capRate: number;
	absorptionRate: number;
	vacancyRate: number;
	averageRent: number;
	pricePerSqFt: number;
	constructionVolume: number;
}

export interface CapRateAnalysis {
  region: string; // e.g., "Baltimore"
  year: number; // e.g., 2024
  marketAverages: MarketRange[];
  subjectProperty: SubjectProperty;
  marketContext: string[];
  comparableSales: ComparableSale[];
  investmentRecommendation: InvestmentRecommendation;
}

export interface MarketRange {
  label: string; // e.g., "Prime Locations (BWI/Port)"
  range: string; // e.g., "6.0% – 7.5%"
}

export interface SubjectProperty {
  locationNotes: string; // description of proximity to port, airport, etc.
  classification: string; // e.g., "Prime Industrial Location"
  expectedCapRateRange: string; // e.g., "7.0% – 8.0%"
}

export interface ComparableSale {
  name: string; // e.g., "Race Road Logistics Center"
  size: string; // e.g., "130,000 SF"
  location: string; // e.g., "Hanover"
  capRateRange: string; // e.g., "6.5% – 7.0%"
  source: string; // e.g., "CBRE", "REPORC"
}

export interface InvestmentRecommendation {
  targetCapRateRange: string; // e.g., "7.5% – 8.0%"
  justification: string[]; // bullet points of reasoning
}

export interface MarketOverviewData {
  region: string;
  year: number;
  economicOutlook: {
    status: 'Boom' | 'Growing' | 'Slowing' | 'Stagnant';
    description: string;
  };
  vacancyRate: {
    value: string;   // e.g. "6.2%"
    source: string;
  };
  absorptionRate: {
    value: string;   // e.g. "4.3 MSF net positive"
    source: string;
  };
  leaseRates: {
    buildingRate: {
      average: string; // e.g. "$8.25/sq ft/year"
      range: string;
      source: string;
    };
    iosLandRate: {
      average: string; // e.g. "$5,000/acre/month"
      range: string;
      source: string;
    };
  };
  capRates: {
    average: string;  // e.g. "6.5%"
    range: string;
    source: string;
  };
  taxIncentives: {
    name: string;
    description: string;
    source: string;
  }[];
  marketSummary: string;
}

export interface DevelopmentData {
	warning: string; // e.g. "Data is for illustrative purposes only"
  region: string;
  analysisDate: string; // ISO 8601 date string
  growthStatus: "Growing" | "Declining" | "Stagnant";
  growthSummary: string;

  developments: {
    name: string;
    type: string;
    distanceFromSubject: string;
    impact: "positive" | "negative" | "neutral";
    description: string;
    status: "Planned" | "Under Construction" | "Completed" | "Announced";
    investmentValue: string;
    completionDate: string; // "YYYY-MM"
    source: string;
  }[];

  offshoringActivity: {
    company: string;
    activity: string;
    location: string;
    forecastImpact: "positive" | "negative" | "neutral";
    description: string;
    timeline: string;
    source: string;
  }[];

  developmentSummary: string;
}

export interface InvestmentRecommendationData {
  propertyAnalysis: {
    strengths: string[];
    risks: string[];
  };
  marketAnalysis: {
    strengths: string[];
    risks: string[];
  };
  investmentSummary: {
    keyStrengths: string[];
    risksToMonitor: string[];
    timing: string;
    strategy: string;
    summary: string;
  };
}