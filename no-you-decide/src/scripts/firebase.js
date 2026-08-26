import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDa1-4udwfWy-EXMjHzIEBZuFHE90XVlaU",
	authDomain: "noyoudecide-5c8ad.firebaseapp.com",
	databaseURL: "https://noyoudecide-5c8ad-default-rtdb.firebaseio.com",
	projectId: "noyoudecide-5c8ad",
	storageBucket: "noyoudecide-5c8ad.firebasestorage.app",
	messagingSenderId: "812281150355",
	appId: "1:812281150355:web:8d7ea65798c3667b060666",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
