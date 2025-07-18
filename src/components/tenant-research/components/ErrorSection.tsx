import React from "react";

interface ErrorSectionProps {
	title: string;
	error: string;
	hasData?: boolean;
}

const ErrorSection: React.FC<ErrorSectionProps> = ({ title, error, hasData = false }) => {
	return (
		<div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
			<div className="flex items-center">
				<div className="flex-shrink-0">
					<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
				<div className="ml-3">
					<h3 className="text-sm font-medium text-red-800">{title}</h3>
					<div className="mt-2 text-sm text-red-700">
						<p>{error}</p>
						{hasData && (
							<p className="mt-1 text-xs text-red-600">
								Les données partielles disponibles sont affichées ci-dessus.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ErrorSection;
