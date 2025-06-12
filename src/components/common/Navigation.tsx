import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavigationProps {
	title?: string;
	subtitle?: string;
}

const Navigation: React.FC<NavigationProps> = ({
	title = "9606 Capital",
	subtitle = "Industrial Property Investment Suite",
}) => {
	const location = useLocation();

	return (
		<nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<h1 className="text-2xl font-bold text-white">{title}</h1>
						</div>
						<div className="ml-10 flex items-center space-x-8">
							<Link
								to="/"
								className={`${
									location.pathname === "/"
										? "bg-white bg-opacity-20"
										: "hover:text-gray-200"
								} text-white px-3 py-2 rounded-md text-sm font-medium transition-colors`}
							>
								<i className="fas fa-search mr-2"></i>
								Tenant Research
							</Link>
							<Link
								to="/cap-rate"
								className={`${
									location.pathname === "/cap-rate"
										? "bg-white bg-opacity-20"
										: "hover:text-gray-200"
								} text-white px-3 py-2 rounded-md text-sm font-medium transition-colors`}
							>
								<i className="fas fa-calculator mr-2"></i>
								Cap Rate Calculator
							</Link>
						</div>
					</div>
					<div className="flex items-center">
						<span className="text-white text-sm">{subtitle}</span>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navigation;
