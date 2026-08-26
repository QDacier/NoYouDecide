import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function PartyShare({
	currentParty,
	username,
	users = [],
	onJoinParty,
	onLeaveParty,
}) {
	const [nameInput, setNameInput] = useState(username || "");
	const [codeInput, setCodeInput] = useState("");
	const [partyUrl, setPartyUrl] = useState("");

	useEffect(() => {
		if (currentParty) {
			const url = `${window.location.origin}${window.location.pathname}?party=${currentParty}`;
			setPartyUrl(url);
		}
	}, [currentParty]);

	const handleCreate = () => {
		if (!nameInput.trim()) {
			alert("Veuillez entrer votre nom avant de créer un party !");
			return;
		}
		const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
		onJoinParty(newCode, nameInput.trim());
	};

	const handleJoin = (e) => {
		e.preventDefault();
		if (!nameInput.trim()) {
			alert("Veuillez entrer votre nom avant de rejoindre un party !");
			return;
		}
		if (!codeInput.trim()) return;

		onJoinParty(codeInput.trim().toUpperCase(), nameInput.trim());
		setCodeInput("");
	};

	return (
		<div
			style={{
				border: "1px solid #ccc",
				padding: "15px",
				borderRadius: "8px",
				marginBottom: "20px",
			}}
		>
			{currentParty ? (
				<div>
					<h3>
						Salon actuel :{" "}
						<span style={{ color: "#2ec4b6" }}>{currentParty}</span>
					</h3>

					<div style={{ margin: "10px 0" }}>
						<p
							style={{ margin: "5px 0", fontSize: "14px", fontWeight: "bold" }}
						>
							Membres dans le party ({users.length}) :
						</p>
						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
								justifyContent: "center",
								gap: "6px",
							}}
						>
							{users.map((u) => (
								<span
									key={u.id}
									style={{
										background: u.name === username ? "#2ec4b6" : "#e0e0e0",
										color: u.name === username ? "#fff" : "#333",
										padding: "4px 10px",
										borderRadius: "12px",
										fontSize: "13px",
										fontWeight: u.name === username ? "bold" : "normal",
									}}
								>
									{u.name} {u.name === username && "(moi)"}
								</span>
							))}
						</div>
					</div>

					<div style={{ margin: "15px 0" }}>
						<p style={{ fontSize: "13px", color: "#666", marginBottom: "5px" }}>
							Fais scanner ce code à tes amis :
						</p>
						<div
							style={{
								background: "#fff",
								padding: "10px",
								display: "inline-block",
								border: "1px solid #eee",
							}}
						>
							<QRCodeSVG value={partyUrl} size={140} />
						</div>
						<p style={{ fontSize: "11px", color: "#888" }}>{partyUrl}</p>
					</div>

					<button
						onClick={onLeaveParty}
						style={{
							padding: "8px 16px",
							background: "#ff4d4d",
							color: "#fff",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
						}}
					>
						Quitter le party
					</button>
				</div>
			) : (
				<div>
					<h3>Rejoindre ou créer un Party 🎉</h3>

					<div style={{ marginBottom: "12px" }}>
						<input
							type="text"
							value={nameInput}
							onChange={(e) => setNameInput(e.target.value)}
							placeholder="Ton nom..."
							style={{
								padding: "8px",
								width: "80%",
								borderRadius: "4px",
								border: "1px solid #ccc",
							}}
						/>
					</div>

					<button
						onClick={handleCreate}
						style={{
							padding: "8px 16px",
							background: "#2ec4b6",
							color: "#fff",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
							marginBottom: "15px",
						}}
					>
						Créer un Party
					</button>

					<form
						onSubmit={handleJoin}
						style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}
					>
						<input
							type="text"
							value={codeInput}
							onChange={(e) => setCodeInput(e.target.value)}
							placeholder="Code de party..."
							style={{ padding: "6px", width: "120px", marginRight: "5px" }}
						/>
						<button
							type="submit"
							style={{ padding: "6px 12px", cursor: "pointer" }}
						>
							Rejoindre
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
