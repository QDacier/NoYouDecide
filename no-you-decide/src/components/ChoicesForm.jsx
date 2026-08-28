import React, { useState } from "react";
import { db } from "../scripts/firebase";
import { ref, push } from "firebase/database";

export default function ChoicesForm({ category, partyCode, isSpinning }) {
	const [newItem, setNewItem] = useState("");

	if (!partyCode) return null;

	const handleAdd = (e) => {
		e.preventDefault();
		if (!newItem.trim() || isSpinning) return;

		const dbPath = `parties/${partyCode}/ideas`;
		push(ref(db, dbPath), {
			text: newItem.trim(),
		});

		setNewItem("");
	};

	return (
		<form onSubmit={handleAdd} style={{ marginBottom: "20px" }}>
			<input
				type="text"
				value={newItem}
				disabled={isSpinning}
				onChange={(e) => setNewItem(e.target.value)}
				placeholder={"Ajouter un choix"}
				style={{
					padding: "8px",
					width: "65%",
					marginRight: "5px",
					cursor: isSpinning ? "not-allowed" : "text",
				}}
			/>
			<button
				type="submit"
				disabled={isSpinning}
				id="BtnAjouterChoix"
				style={{
					padding: "8px 12px",
					cursor: isSpinning ? "not-allowed" : "pointer",
					opacity: isSpinning ? 0.6 : 1,
				}}
			>
				Ajouter
			</button>
		</form>
	);
}
