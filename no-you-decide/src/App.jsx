import React, { useState, useEffect } from "react";
import { db } from "./scripts/firebase";
import {
	ref,
	onValue,
	remove,
	push,
	set,
	onDisconnect,
} from "firebase/database";
import PartyShare from "./components/PartyShare";
import ChoicesForm from "./components/ChoicesForm";
import Wheel from "./components/Wheel";
import ChoiceList from "./components/ChoiceList";

export default function App() {
	const [partyCode, setPartyCode] = useState("");
	const [username, setUsername] = useState("");
	const [users, setUsers] = useState([]);
	const [category, setCategory] = useState("Films");
	const [items, setItems] = useState([]);
	const [isSpinning, setIsSpinning] = useState(false);
	const [winner, setWinner] = useState(null);
	const [rotationAngle, setRotationAngle] = useState(0);

	const dbPath = partyCode ? `parties/${partyCode}/ideas` : "ideas";

	const handleClear = () => {
		remove(ref(db, dbPath));
		if (partyCode) {
			remove(ref(db, `parties/${partyCode}/winner`));
			set(ref(db, `parties/${partyCode}/rotationAngle`), 0);
		} else {
			setWinner(null);
			setRotationAngle(0);
		}
	};

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const partyFromUrl = params.get("party");
		if (partyFromUrl) {
			setPartyCode(partyFromUrl.toUpperCase());
		}
	}, []);

	// Écoute des choix d'idées avec la récupération de l'imageUrl
	useEffect(() => {
		const ideasRef = ref(db, dbPath);
		const unsubscribe = onValue(ideasRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const list = Object.entries(data).map(([id, val]) => ({
					id,
					text: val.text,
					imageUrl: val.imageUrl || null,
				}));
				setItems(list);
			} else {
				setItems([]);
			}
		});

		return () => unsubscribe();
	}, [dbPath]);

	// Écoute de l'état du Spin, du Winner ET de l'Angle de Rotation en temps réel
	useEffect(() => {
		if (!partyCode) {
			setIsSpinning(false);
			setWinner(null);
			setRotationAngle(0);
			return;
		}

		const spinRef = ref(db, `parties/${partyCode}/isSpinning`);
		const unsubscribeSpin = onValue(spinRef, (snapshot) => {
			setIsSpinning(!!snapshot.val());
		});

		const winnerRef = ref(db, `parties/${partyCode}/winner`);
		const unsubscribeWinner = onValue(winnerRef, (snapshot) => {
			setWinner(snapshot.val() || null);
		});

		const rotationRef = ref(db, `parties/${partyCode}/rotationAngle`);
		const unsubscribeRotation = onValue(rotationRef, (snapshot) => {
			if (snapshot.val() !== null) {
				setRotationAngle(snapshot.val());
			}
		});

		return () => {
			unsubscribeSpin();
			unsubscribeWinner();
			unsubscribeRotation();
		};
	}, [partyCode]);

	// Gestion des utilisateurs et suppression totale du salon s'il devient vide
	useEffect(() => {
		if (!partyCode || !username) {
			setUsers([]);
			return;
		}

		const partyUsersRef = ref(db, `parties/${partyCode}/users`);
		const newUserRef = push(partyUsersRef);

		set(newUserRef, { name: username });
		onDisconnect(newUserRef).remove();

		const unsubscribeUsers = onValue(partyUsersRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const userList = Object.entries(data).map(([id, val]) => ({
					id,
					name: val.name,
				}));
				setUsers(userList);
			} else {
				setUsers([]);
				remove(ref(db, `parties/${partyCode}`));
			}
		});

		return () => {
			remove(newUserRef);
			unsubscribeUsers();
		};
	}, [partyCode, username]);

	const handleJoinParty = (code, name) => {
		setPartyCode(code);
		setUsername(name);
		window.history.pushState({}, "", `?party=${code}`);
	};

	const handleLeaveParty = () => {
		setPartyCode("");
		setUsername("");
		setUsers([]);
		setWinner(null);
		setRotationAngle(0);
		window.history.pushState({}, "", window.location.pathname);
	};

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
			<h1>NoYouDecide 🎡</h1>

			{partyCode && (
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
						disabled={isSpinning}
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
			)}

			<ChoicesForm
				category={category}
				partyCode={partyCode}
				isSpinning={isSpinning}
			/>
			<Wheel
				items={items}
				partyCode={partyCode}
				isSpinning={isSpinning}
				winner={winner}
				rotationAngle={rotationAngle}
			/>
			<ChoiceList items={items} handleClear={handleClear} />

			<PartyShare
				currentParty={partyCode}
				username={username}
				users={users}
				onJoinParty={handleJoinParty}
				onLeaveParty={handleLeaveParty}
			/>
		</div>
	);
}
