import React, { useState } from "react";
import { db } from "../scripts/firebase";
import { ref, push } from "firebase/database";

export default function ChoicesForm({ category }) {
	const [newItem, setNewItem] = useState("");

	const handleAdd = (e) => {
		e.preventDefault();
		if (!newItem.trim()) return;

		// Envoie toujours dans le même nœud "ideas"
		push(ref(db, "ideas"), {
			text: newItem.trim(),
		});

		setNewItem("");
	};

	return (
		<form onSubmit={handleAdd} style={{ marginBottom: "20px" }}>
			<input
				type="text"
				value={newItem}
				onChange={(e) => setNewItem(e.target.value)}
				placeholder={`Ajouter un choix (${category.toLowerCase()})...`}
				style={{ padding: "8px", width: "65%", marginRight: "5px" }}
			/>
			<button type="submit" style={{ padding: "8px 12px", cursor: "pointer" }}>
				Ajouter
			</button>
		</form>
	);
}
