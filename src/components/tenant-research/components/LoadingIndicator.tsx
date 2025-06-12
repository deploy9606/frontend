import React from "react";

interface LoadingIndicatorProps {
	show: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ show }) => {
	if (!show) return null;

	return (
		<div className="mt-6 p-6 bg-white rounded-lg shadow-md">
			<div className="text-center">
				<div className="text-lg font-semibold text-gray-700 mb-4">
					Processing AI analysis...
				</div>
				<div className="flex justify-center items-center space-x-4">
					<i className="fas fa-spinner fa-spin text-2xl text-indigo-600"></i>
					<span className="text-gray-600">This may take a few moments</span>
				</div>
			</div>
		</div>
	);
};

export default LoadingIndicator;
