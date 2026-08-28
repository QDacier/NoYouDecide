import React, { useContext } from "react";
import { ThemeContext } from "../scripts/ThemeContext";

export default function Header({
	category,
	setCategory,
	partyCode,
	onLeaveParty,
}) {
	const { setTheme } = useContext(ThemeContext);

	const categories = [
		{ label: "Films/séries", key: "films" },
		{ label: "Resto", key: "restos" },
		{ label: "Repas", key: "repas" },
		{ label: "Activités", key: "activites" },
		{ label: "Autre", key: "autre" },
	];

	const handleCategoryClick = (cat) => {
		setCategory(cat.label);
		setTheme(cat.key);
	};

	return (
		<header className="app-header">
			<div className="header-logo">
				<h2>No You Decide</h2>
			</div>

			<nav className="header-nav">
				{categories.map((cat) => (
					<button
						key={cat.key}
						className={`nav-link ${category === cat.label ? "active" : ""}`}
						onClick={() => handleCategoryClick(cat)}
					>
						{cat.label}
					</button>
				))}
			</nav>

			<div className="header-action">
				{partyCode && (
					<button className="btn-leave" onClick={onLeaveParty}>
						Quitter le Party
					</button>
				)}
			</div>
		</header>
	);
}
