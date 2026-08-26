import React, { useState } from "react";

export default function Wheel({ items }) {
	const [rotation, setRotation] = useState(0);
	const [winner, setWinner] = useState(null);

	const total = items.length;
	const sliceAngle = total > 0 ? 360 / total : 0;
	const colors = [
		"#FF6B6B",
		"#4ECDC4",
		"#FFE66D",
		"#1A535C",
		"#FF9F1C",
		"#9B5DE5",
		"#F15BB5",
	];

	const spin = () => {
		if (total === 0) return;
		setWinner(null);

		const randomIndex = Math.floor(Math.random() * total);
		// 5 tours (1800 deg) + décalage pour aligner la tranche gagnante sous le pointeur du haut
		const targetAngle =
			360 * 5 + (360 - randomIndex * sliceAngle - sliceAngle / 2);
		const newRotation = rotation + targetAngle;

		setRotation(newRotation);

		setTimeout(() => {
			setWinner(items[randomIndex].text);
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
						{/* Pointeur */}
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

						{/* Roue */}
						<svg
							viewBox="-100 -100 200 200"
							style={{
								width: "100%",
								height: "100%",
								transform: `rotate(${rotation}deg)`,
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
						onClick={spin}
						disabled={total === 0}
						style={{
							marginTop: "15px",
							padding: "10px 20px",
							fontSize: "16px",
							cursor: "pointer",
						}}
					>
						Lancer la roue !
					</button>

					{winner && (
						<h2 style={{ color: "#2ec4b6", marginTop: "15px" }}>
							Résultat : {winner} ! 🎉
						</h2>
					)}
				</div>
			) : null}
		</>
	);
}
