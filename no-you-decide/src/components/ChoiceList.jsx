import React from "react";

export default function ChoiceList({ items, handleClear }) {
	return (
		<div style={{ marginTop: "20px" }}>
			{items.length > 0 && (
				<div>
					<button
						onClick={handleClear}
						style={{
							padding: "6px 12px",
							background: "#ff0000",
							color: "#fff",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
							marginBottom: "15px",
						}}
					>
						Tout effacer
					</button>
				</div>
			)}
		</div>
	);
}
