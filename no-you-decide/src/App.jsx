import React, { useState, useEffect } from "react";
import { db } from "./scripts/firebase";
import { ref, onValue, remove } from "firebase/database";
	useEffect(() => {
		const ideasRef = ref(db, "ideas");
		const unsubscribe = onValue(ideasRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const list = Object.entries(data).map(([id, val]) => ({
					id,
					text: val.text,
				}));
				setItems(list);
			} else {
				setItems([]);
			}
		});

		return () => unsubscribe();
	}, []);

	return (
		<div
			style={{
				fontFamily: "sans-serif",
				textAlign: "center",
				padding: "20px",
				maxWidth: "500px",
				margin: "0 auto",
			}}
		>
			<h1>NoYouDecide</h1>

			{/* Categorie */}
			<div style={{ marginBottom: "20px" }}>
				<label
					htmlFor="cat-select"
					style={{ marginRight: "10px", fontWeight: "bold" }}
				>
					Mode :
				</label>
				<select
					id="cat-select"
					value={category}
					onChange={(e) => {
						setCategory(e.target.value);
						handleClear();
					}}
					style={{ padding: "8px", fontSize: "16px", borderRadius: "4px" }}
				>
					<option value="Films">Films / Séries</option>
					<option value="Restos">Restos</option>
					<option value="Repas">Repas</option>
					<option value="Activités">Activités</option>
					<option value="Autre">Autres</option>
				</select>
			</div>

			{/* composants */}
			<ChoicesForm category={category} />
			<Wheel items={items} />
			<ChoiceList items={items} handleClear={handleClear} />
		</div>
	);
}
