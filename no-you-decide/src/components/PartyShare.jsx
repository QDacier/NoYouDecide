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
		<div id="Party">
			{currentParty ? (
				<div id="PartyController">
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
					</div>

					<button
						onClick={onLeaveParty}
						style={{
							padding: "8px 16px",
							background: "#ff0000",
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
				<div id="MenuParty">
					<h3>Rejoindre ou créer un Party</h3>
					<input
						type="text"
						value={nameInput}
						onChange={(e) => setNameInput(e.target.value)}
						placeholder="Ton surnom"
						style={{
							padding: "8px",
							width: "80%",
						}}
					/>

					<button onClick={handleCreate} id="BtnCreateParty">
						Créer un Party
					</button>

					<form
						onSubmit={handleJoin}
						style={{ borderTop: "1px solid gold", paddingTop: "12px" }}
					>
						<input
							type="text"
							value={codeInput}
							onChange={(e) => setCodeInput(e.target.value)}
							placeholder="Code"
							style={{ padding: "6px", width: "120px", marginRight: "5px" }}
						/>
						<button type="submit" id="BtnJoinParty">
							Rejoindre
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
