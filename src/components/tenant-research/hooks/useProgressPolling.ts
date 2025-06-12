import { useState, useCallback, useRef } from "react";
import { buildApiUrl } from "../../../config/api";

interface ProgressStep {
	step: number;
	totalSteps: number;
	currentTask: string;
	details: string;
	completed: boolean;
	error: string | null;
}

export const useProgressPolling = () => {
	const [progress, setProgress] = useState<ProgressStep | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(null);
	const pollIntervalRef = useRef<number | null>(null);

	const stopPolling = useCallback(() => {
		if (pollIntervalRef.current) {
			clearInterval(pollIntervalRef.current);
			pollIntervalRef.current = null;
			console.log("Polling stopped");
		}
	}, []);

	const generateSessionId = useCallback(() => {
		const newSessionId = `session_${Date.now()}_${Math.random()
			.toString(36)
			.substr(2, 9)}`;
		setSessionId(newSessionId);
		console.log("Generated sessionId for polling:", newSessionId);
		return newSessionId;
	}, []);

	const startPolling = useCallback(
		(sessionId: string) => {
			console.log("Starting progress polling for session:", sessionId);

			// Arrêter un polling existant
			if (pollIntervalRef.current) {
				clearInterval(pollIntervalRef.current);
			}

			let consecutiveNotFound = 0;

			pollIntervalRef.current = setInterval(async () => {
				try {
					const response = await fetch(
						buildApiUrl(`/api/tenant-research/progress/${sessionId}`)
					);

					if (response.ok) {
						const data = await response.json();
						console.log("Progress update received:", data.progress);
						setProgress(data.progress);
						consecutiveNotFound = 0; // Reset counter

						// Si l'analyse est terminée, arrêter le polling
						if (data.progress.completed || data.progress.error) {
							console.log("Analysis completed, stopping polling");
							stopPolling();
						}
					} else if (response.status === 404) {
						consecutiveNotFound++;
						// Si la session n'est pas trouvée après 30 secondes, arrêter le polling
						if (consecutiveNotFound > 10) {
							// 10 * 3 secondes = 30 secondes
							console.log("Session not found for too long, stopping polling");
							stopPolling();
						} else {
							console.log("Session not found yet, continuing polling...");
						}
					} else {
						console.error("Error polling progress:", response.status);
					}
				} catch (err) {
					console.error("Error polling progress:", err);
				}
			}, 4000) as unknown as number; // Polling toutes les 4 secondes
		},
		[stopPolling]
	);

	const resetProgress = useCallback(() => {
		setProgress(null);
		setSessionId(null);
		stopPolling();
	}, [stopPolling]);

	const setProgressError = useCallback(
		(error: string) => {
			setProgress((prev) =>
				prev
					? {
							...prev,
							error,
							currentTask: "Erreur dans l'analyse",
							completed: true,
					  }
					: null
			);
			stopPolling();
		},
		[stopPolling]
	);

	return {
		// États
		progress,
		sessionId,

		// Fonctions
		generateSessionId,
		startPolling,
		stopPolling,
		resetProgress,
		setProgress,
		setProgressError,
	};
};
