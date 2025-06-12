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
	buildingSize: string; // en sq ft
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
