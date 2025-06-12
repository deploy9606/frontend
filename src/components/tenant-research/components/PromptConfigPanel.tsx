import React from "react";
import type { PromptConfig } from "../../../types";

interface PromptConfigPanelProps {
	config: PromptConfig | null;
	loading: boolean;
	error: string;
	onSave: (config: PromptConfig) => void;
	onClose: () => void;
	onChange: (config: PromptConfig) => void;
	onResetPromptConfig: () => void;
}

const PromptConfigPanel: React.FC<PromptConfigPanelProps> = ({
	config,
	loading,
	error,
	onSave,
	onClose,
	onChange,
	onResetPromptConfig,
}) => {
	const handleArrayChange = (field: keyof PromptConfig, value: string) => {
		if (!config) return;
		const arrayValue = value
			.split(",")
			.map((item) => item.trim())
			.filter((item) => item);
		onChange({ ...config, [field]: arrayValue });
	};

	return (
		<div className="w-full">
			{loading ? (
				<div className="text-center">
					<i className="fas fa-spinner fa-spin text-2xl text-indigo-600"></i>
				</div>
			) : config ? (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left pt-2">
					{/* Analysis Focus */}
					<div className="lg:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Analysis Focus
						</label>
						<textarea
							value={config.focus}
							onChange={(e) => onChange({ ...config, focus: e.target.value })}
							className="w-full p-3 border border-gray-300 rounded-md"
							rows={3}
							placeholder="AI analysis focus description..."
						/>
					</div>

					{/* Discovery Strategy */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Discovery Strategy
						</label>
						<select
							value={config.discovery_strategy}
							onChange={(e) =>
								onChange({ ...config, discovery_strategy: e.target.value })
							}
							className="w-full p-3 border border-gray-300 rounded-md"
						>
							<option value="emerging_scaling_companies">
								Emerging and Growing Companies
							</option>
							<option value="established_companies">Established Companies</option>
							<option value="mixed_strategy">Mixed Strategy</option>
						</select>
					</div>

					{/* Preferred Company Size */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Preferred Company Size
						</label>
						<select
							value={config.preferred_company_size}
							onChange={(e) =>
								onChange({ ...config, preferred_company_size: e.target.value })
							}
							className="w-full p-3 border border-gray-300 rounded-md"
						>
							<option value="emerging_to_midsize">Emerging to Mid-size</option>
							<option value="small_to_medium">Small to Medium</option>
							<option value="medium_to_large">Medium to Large</option>
							<option value="all_sizes">All Sizes</option>
						</select>
					</div>

					{/* Search Radius */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Search Radius (miles)
						</label>
						<input
							type="number"
							value={config.search_radius_miles}
							onChange={(e) =>
								onChange({
									...config,
									search_radius_miles: parseInt(e.target.value) || 100,
								})
							}
							className="w-full p-3 border border-gray-300 rounded-md"
							min="50"
							max="2000"
						/>
					</div>

					{/* Number of Results */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Number of Results
						</label>
						<input
							type="number"
							value={config.result_count}
							onChange={(e) =>
								onChange({
									...config,
									result_count: parseInt(e.target.value) || 20,
								})
							}
							className="w-full p-3 border border-gray-300 rounded-md"
							min="5"
							max="50"
						/>
					</div>

					{/* Analysis Tone */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Analysis Tone
						</label>
						<select
							value={config.tone}
							onChange={(e) => onChange({ ...config, tone: e.target.value })}
							className="w-full p-3 border border-gray-300 rounded-md"
						>
							<option value="analytical, data-driven, precise">
								Analytical and Precise
							</option>
							<option value="detailed, comprehensive, professional">
								Detailed and Professional
							</option>
							<option value="concise, strategic, focused">Concise and Strategic</option>
							<option value="technical, thorough, expert">Technical and Expert</option>
						</select>
					</div>

					{/* Companies to Exclude */}
					<div className="lg:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Companies to Exclude (comma separated)
						</label>
						<textarea
							value={config.exclude_companies?.join(", ") || ""}
							onChange={(e) => handleArrayChange("exclude_companies", e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-md"
							rows={2}
							placeholder="Amazon, Walmart, FedEx, UPS..."
						/>
					</div>

					{/* Target Tenant Types */}
					<div className="lg:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Target Tenant Types (comma separated)
						</label>
						<textarea
							value={config.target_types?.join(", ") || ""}
							onChange={(e) => handleArrayChange("target_types", e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-md"
							rows={3}
							placeholder="Regional 3PL providers, Growing food distributors..."
						/>
					</div>

					{/* Target Industries */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Target Industries (comma separated)
						</label>
						<textarea
							value={config.focus_industries?.join(", ") || ""}
							onChange={(e) => handleArrayChange("focus_industries", e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-md"
							rows={2}
							placeholder="3PL, Manufacturing, Food, Tech, Retail"
						/>
					</div>

					{/* Ranking Criteria */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Ranking Criteria (comma separated)
						</label>
						<textarea
							value={config.ranking_criteria?.join(", ") || ""}
							onChange={(e) => handleArrayChange("ranking_criteria", e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-md"
							rows={2}
							placeholder="area_growth_trends, operational_needs_match..."
						/>
					</div>

					{/* Action Buttons */}
					<div className="lg:col-span-2 flex space-x-4">
						<button
							onClick={() => onSave(config)}
							className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
						>
							<i className="fas fa-save mr-2"></i>
							Save
						</button>
						<button
							onClick={onResetPromptConfig}
							className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
						>
							<i className="fas fa-undo mr-2"></i>
							Reset Config
						</button>
						<button
							onClick={onClose}
							className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
						>
							<i className="fas fa-times mr-2"></i>
							Cancel
						</button>
					</div>
				</div>
			) : null}
			{error && (
				<div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
					<i className="fas fa-exclamation-circle mr-2"></i>
					{error}
				</div>
			)}
		</div>
	);
};

export default PromptConfigPanel;
