import { useState, useEffect } from "react";
import type { PropertyData, AnalysisResults, PromptConfig } from "../../../types";
import { useProgressPolling } from "./useProgressPolling";
import { buildApiUrl } from "../../../config/api";

export const useTenantResearch = () => {
	// Hook pour la gestion de progression
	const {
		progress,
		sessionId,
		generateSessionId,
		startPolling,
		resetProgress,
		setProgressError,
	} = useProgressPolling();

	// États pour le formulaire de propriété
	const [propertyAddress, setPropertyAddress] = useState("");
	const [propertyType, setPropertyType] = useState<PropertyData["type"]>("warehouse");
	const [squareFootage, setSquareFootage] = useState("");
	const [acreage, setAcreage] = useState("");
	const [buildingFeatures, setBuildingFeatures] = useState("");
	const [useAiScoring, setUseAiScoring] = useState(true); // Nouveau state pour AI scoring
	const [results, setResults] = useState<AnalysisResults | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// États pour la configuration du prompt IA
	const [showPromptConfig, setShowPromptConfig] = useState(false);
	const [promptConfig, setPromptConfig] = useState<PromptConfig | null>(null);
	const [configLoading, setConfigLoading] = useState(false);
	const [configError, setConfigError] = useState("");

	// États pour les dropdowns
	const [showPropertyForm, setShowPropertyForm] = useState(true);
	const [showPropertyAnalysis, setShowPropertyAnalysis] = useState(false);
	const [showMarketAnalysis, setShowMarketAnalysis] = useState(false);
	const [showTenantTable, setShowTenantTable] = useState(false);

	// Charger la configuration du prompt au démarrage
	useEffect(() => {
		loadPromptConfig();
	}, []);

	const loadPromptConfig = async () => {
		setConfigLoading(true);
		try {
			const response = await fetch(buildApiUrl("/api/config/prompt"));
			if (response.ok) {
				const config = await response.json();
				setPromptConfig(config);
			}
		} catch (err) {
			setConfigError("Erreur de chargement de la configuration");
			console.error("Load Prompt Config Error:", err);
		} finally {
			setConfigLoading(false);
		}
	};

	const savePromptConfig = async (config: PromptConfig) => {
		try {
			const response = await fetch(buildApiUrl("/api/config/prompt"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(config),
			});
			if (response.ok) {
				setPromptConfig(config);
				setShowPromptConfig(false);
			}
		} catch (err) {
			setConfigError("Erreur de sauvegarde");
			console.error("Save Prompt Config Error:", err);
		}
	};

	const resetPromptConfig = async () => {
		try {
			const response = await fetch(buildApiUrl("/api/config/prompt/reset"), {
				method: "POST",
			});
			if (response.ok) {
				const config = await response.json();
				setPromptConfig(config.config);
			}
		} catch (err) {
			setConfigError("Erreur de réinitialisation");
			console.error("Reset Prompt Config Error:", err);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setResults(null);
		resetProgress();

		// Fermer le formulaire de propriété quand la recherche commence
		setShowPropertyForm(false);

		// Générer un sessionId unique et démarrer le polling
		const newSessionId = generateSessionId();
		startPolling(newSessionId);

		try {
			const propertyData = {
				address: propertyAddress,
				type: propertyType,
				squareFootage: parseInt(squareFootage) || 0,
				acreage: parseFloat(acreage) || 0,
				features: buildingFeatures
					.split(",")
					.map((f) => f.trim())
					.filter((f) => f),
				use_ai_scoring: useAiScoring, // Ajouter l'option AI scoring
			};

			console.log("Starting analysis with sessionId:", newSessionId);

			// Utiliser le nouvel endpoint 9606 Capital avec suivi de progression
			const response = await fetch(buildApiUrl("/api/tenant-research/analyze-9606"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					propertyData,
					withProgress: true,
					sessionId: newSessionId,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || `HTTP ${response.status}`);
			}

			const result = await response.json();
			if (result.success && result.data) {
				setResults(result.data);
				// Ouvrir les sections de résultats par défaut
				setShowPropertyAnalysis(false); // fermé par défaut
				setShowMarketAnalysis(false); // fermé par défaut
				setShowTenantTable(false); // fermé par défaut
				console.log("Analysis completed successfully");
			} else {
				throw new Error("Invalid response format from server");
			}
		} catch (err) {
			const errorMessage = "Une erreur est survenue : " + (err as Error).message;
			setError(errorMessage);
			console.error("Analysis error:", err);
			setProgressError((err as Error).message);
		} finally {
			setLoading(false);
			// Le polling s'arrêtera automatiquement quand l'analyse sera terminée
		}
	};

	return {
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

		// États de progression (depuis useProgressPolling)
		progress,
		sessionId,

		// Fonctions
		loadPromptConfig,
		savePromptConfig,
		resetPromptConfig,
		handleSubmit,
	};
};
