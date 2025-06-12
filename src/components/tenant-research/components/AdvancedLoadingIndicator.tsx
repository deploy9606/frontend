import React from "react";

interface ProgressStep {
	step: number;
	totalSteps: number;
	currentTask: string;
	details: string;
	completed: boolean;
	error: string | null;
}

interface AdvancedLoadingIndicatorProps {
	show: boolean;
	progress?: ProgressStep | null;
	aiScoringEnabled?: boolean; // Nouvelle prop pour activer/désactiver la 5ème étape
}

const AdvancedLoadingIndicator: React.FC<AdvancedLoadingIndicatorProps> = ({
	show,
	progress,
	aiScoringEnabled = false,
}) => {
	if (!show) return null;

	// More precise progress percentage calculation
	// Divided by (totalSteps) so percentage ranges from 0 to 100
	const progressPercent = progress
		? Math.min(Math.round(((progress.step - 1) / progress.totalSteps) * 100), 100)
		: 0;

	// Définir les étapes selon la configuration
	const baseSteps = [
		{
			id: 1,
			title: "Building Configuration",
			description: "Property analysis via Gemini AI",
			icon: "🏭",
		},
		{
			id: 2,
			title: "Growth Trends",
			description: "Local market analysis via OpenAI",
			icon: "📈",
		},
		{
			id: 3,
			title: "Emerging Tenants",
			description: "Discovering emerging companies via OpenAI",
			icon: "💎",
		},
	];

	// Ajouter la 4ème étape seulement si le scoring IA est activé
	const steps = aiScoringEnabled
		? [
				...baseSteps,
				{
					id: 4,
					title: "AI Scoring",
					description: "Advanced tenant scoring via AI models",
					icon: "🤖",
				},
		  ]
		: baseSteps;

	return (
		<div className="w-full max-w-4xl mt-6 p-6 bg-white rounded-lg shadow-md border-l-4 border-indigo-500">
			{/* Header */}
			<div className="text-center mb-6">
				<h3 className="text-xl font-semibold text-gray-800 mb-2">
					AI Analysis in Progress...
				</h3>
				{progress && (
					<p className="text-sm text-gray-600">
						Step {progress.step} of {progress.totalSteps}
					</p>
				)}
			</div>

			{/* Global Progress Bar */}
			<div className="mb-6">
				<div className="flex justify-between text-sm text-gray-600 mb-2">
					<span>Overall Progress</span>
					<span>{Math.round(progressPercent)}%</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-3">
					<div
						className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
						style={{ width: `${progressPercent}%` }}
					></div>
				</div>
			</div>

			{/* Detailed Steps */}
			<div className="space-y-4">
				{steps.map((step) => {
					const isCompleted = progress ? progress.step > step.id : false;
					const isCurrent = progress ? progress.step === step.id : false;
					const isPending = progress ? progress.step < step.id : true;

					return (
						<div
							key={step.id}
							className={`flex items-center p-3 rounded-lg border transition-all duration-300 ${
								isCompleted
									? "bg-green-50 border-green-200"
									: isCurrent
									? "bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100"
									: isPending
									? "bg-gray-50 border-gray-200"
									: "bg-gray-50 border-gray-200"
							}`}
						>
							{/* Status Icon */}
							<div className="flex-shrink-0 mr-4">
								{isCompleted ? (
									<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
										<svg
											className="w-5 h-5 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
								) : isCurrent ? (
									<div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									</div>
								) : (
									<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
										<span className="text-sm text-gray-600">{step.id}</span>
									</div>
								)}
							</div>

							{/* Step Content */}
							<div className="flex-grow">
								<div className="flex items-center mb-1">
									<span className="text-lg mr-2">{step.icon}</span>
									<h4
										className={`font-medium ${
											isCompleted
												? "text-green-800"
												: isCurrent
												? "text-indigo-800"
												: "text-gray-600"
										}`}
									>
										{step.title}
									</h4>
								</div>
								<p
									className={`text-sm ${
										isCompleted
											? "text-green-600"
											: isCurrent
											? "text-indigo-600"
											: "text-gray-500"
									}`}
								>
									{step.description}
								</p>

								{/* Progress details for current step */}
								{isCurrent && progress && progress.details && (
									<p className="text-xs text-indigo-500 mt-1 italic">
										{progress.details}
									</p>
								)}
							</div>

							{/* Time estimate indicator */}
							<div className="flex-shrink-0 ml-4 text-right">
								{isCompleted ? (
									<span className="text-xs text-green-600 font-medium">Completed</span>
								) : isCurrent ? (
									<span className="text-xs text-indigo-600 font-medium">In Progress</span>
								) : (
									<span className="text-xs text-gray-400">Pending</span>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* Error Message */}
			{progress?.error && (
				<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
					<div className="flex items-center">
						<svg
							className="w-5 h-5 text-red-500 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span className="text-sm text-red-800 font-medium">
							Error: {progress.error}
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdvancedLoadingIndicator;
