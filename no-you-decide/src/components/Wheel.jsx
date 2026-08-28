import React from "react";
import { db } from "../scripts/firebase";
import { ref, set, remove } from "firebase/database";

export default function Wheel({
	items,
	partyCode,
	isSpinning,
	winner,
	rotationAngle,
}) {
	const total = items.length;
	const sliceAngle = total > 0 ? 360 / total : 0;
	const colors = ["#FF0000", "#000000"];

	const spin = () => {
		if (total === 0 || isSpinning) return;

		const randomIndex = Math.floor(Math.random() * total);
		const winningSliceCenterAngle = randomIndex * sliceAngle + sliceAngle / 2;
		const degreesToTop = 270 - winningSliceCenterAngle;

		const currentModulus = rotationAngle % 360;
		const extraSpins = 360 * 5;
		const newRotation =
			rotationAngle +
			extraSpins +
			((degreesToTop - currentModulus + 360) % 360);

		if (partyCode) {
			set(ref(db, `parties/${partyCode}/isSpinning`), true);
			remove(ref(db, `parties/${partyCode}/winner`));
			set(ref(db, `parties/${partyCode}/rotationAngle`), newRotation);
		}

		setTimeout(() => {
			const selectedText = items[randomIndex].text;

			if (partyCode) {
				set(ref(db, `parties/${partyCode}/winner`), selectedText);
				set(ref(db, `parties/${partyCode}/isSpinning`), false);
			}
		}, 4000);
	};

	return (
		<>
			{items.length ? (
				<div style={{ textAlign: "center", margin: "20px 0" }}>
					<div
						style={{
							position: "relative",
							width: "300px",
							height: "300px",
							margin: "0 auto",
						}}
					>
						<div
							style={{
								position: "absolute",
								top: "-12px",
								left: "50%",
								transform: "translateX(-50%)",
								width: 0,
								height: 0,
								borderLeft: "12px solid transparent",
								borderRight: "12px solid transparent",
								borderTop: "20px solid #D90429",
								zIndex: 10,
							}}
						/>

						<svg
							viewBox="-100 -100 200 200"
							style={{
								width: "100%",
								height: "100%",
								transform: `rotate(${rotationAngle}deg)`,
								transition: "transform 4s cubic-bezier(0.15, 0.99, 0.35, 1)",
							}}
						>
							{items.map((item, index) => {
								const startAngle = (index * sliceAngle * Math.PI) / 180;
								const endAngle = ((index + 1) * sliceAngle * Math.PI) / 180;
								const x1 = 100 * Math.cos(startAngle);
								const y1 = 100 * Math.sin(startAngle);
								const x2 = 100 * Math.cos(endAngle);
								const y2 = 100 * Math.sin(endAngle);
								const largeArc = sliceAngle > 180 ? 1 : 0;

								const pathData =
									total === 1
										? "M -100 0 A 100 100 0 1 0 100 0 A 100 100 0 1 0 -100 0"
										: `M 0 0 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`;

								const textAngle = index * sliceAngle + sliceAngle / 2;

								return (
									<g key={item.id}>
										<path
											d={pathData}
											fill={colors[index % colors.length]}
											stroke="#fff"
											strokeWidth="1"
										/>
										<text
											x="55"
											y="4"
											fill="#fff"
											fontSize="9"
											fontWeight="bold"
											textAnchor="middle"
											transform={`rotate(${textAngle})`}
											style={{
												textShadow:
													"1px 1px 3px #000, -1px -1px 3px #000, 0px 0px 5px #000",
											}}
										>
											{item.text.length > 12
												? item.text.substring(0, 10) + "..."
												: item.text}
										</text>
									</g>
								);
							})}
						</svg>
					</div>

					<button
						id="BtnSpin"
						onClick={spin}
						disabled={total === 0 || isSpinning}
						style={{
							marginTop: "15px",
							padding: "10px 20px",
							fontSize: "16px",
							cursor: isSpinning ? "not-allowed" : "pointer",
							opacity: isSpinning ? 0.6 : 1,
						}}
					>
						{isSpinning ? "La roue tourne..." : "Tourner la roue"}
					</button>

					{winner && (
						<h2 style={{ color: "#2ec4b6", marginTop: "15px" }}>
							Résultat : {winner} !
						</h2>
					)}
				</div>
			) : null}
		</>
	);
}
