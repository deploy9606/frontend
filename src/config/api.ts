/**
 * Configuration de l'API pour 9606 Capital
 * Gère l'URL de base de l'API selon l'environnement
 */

// URL de base de l'API depuis les variables d'environnement
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Helper pour construire des URLs d'API
export const buildApiUrl = (endpoint: string): string => {
	// S'assurer que l'endpoint commence par un slash
	const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

	// Retourner l'URL complète
	return `${API_BASE_URL}${cleanEndpoint}`;
};

// Export par défaut de l'objet de configuration
export default {
	BASE_URL: API_BASE_URL,
	buildUrl: buildApiUrl,
};
