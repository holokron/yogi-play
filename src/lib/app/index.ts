import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { config } from "@/lib/config";

initializeApp(config.firebase);

export const database = getDatabase();

export const auth = getAuth();
