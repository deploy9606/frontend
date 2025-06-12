import React, { useState, useEffect } from "react";

interface DropdownSectionProps {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
	isOpen?: boolean; // État contrôlé
	onToggle?: (isOpen: boolean) => void;
	disabled?: boolean;
	className?: string;
	headerClassName?: string;
	contentClassName?: string;
	icon?: string;
}

const DropdownSection: React.FC<DropdownSectionProps> = ({
	title,
	children,
	defaultOpen = false,
	isOpen: controlledIsOpen,
	onToggle,
	disabled = false,
	className = "",
	headerClassName = "",
	contentClassName = "",
	icon = "",
}) => {
	const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

	// Utiliser l'état contrôlé si fourni, sinon l'état interne
	const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

	// Synchroniser l'état interne avec l'état contrôlé
	useEffect(() => {
		if (controlledIsOpen !== undefined) {
			setInternalIsOpen(controlledIsOpen);
		}
	}, [controlledIsOpen]);

	const handleToggle = () => {
		if (disabled) return;
		const newState = !isOpen;

		// Mettre à jour l'état interne si pas contrôlé
		if (controlledIsOpen === undefined) {
			setInternalIsOpen(newState);
		}

		// Toujours notifier le parent
		onToggle?.(newState);
	};

	return (
		<div className={`w-full bg-white rounded-lg shadow-md ${className}`}>
			<button
				onClick={handleToggle}
				disabled={disabled}
				className={`w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${headerClassName}`}
			>
				<div className="flex items-center space-x-2">
					{icon && <span className="text-lg">{icon}</span>}
					<h3 className="text-lg font-semibold text-left">{title}</h3>
				</div>
				<div className="flex items-center space-x-2">
					<span className="text-gray-400 text-sm">{isOpen ? "Hide" : "Show"}</span>
					<svg
						className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
							isOpen ? "rotate-180" : ""
						}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</div>
			</button>
			{isOpen && <div className={`p-4 pt-0 ${contentClassName}`}>{children}</div>}
		</div>
	);
};

export default DropdownSection;
