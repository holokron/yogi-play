import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { config } from "../config";

initializeApp(config.firebase);

export const database = getDatabase();

export const auth = getAuth();
