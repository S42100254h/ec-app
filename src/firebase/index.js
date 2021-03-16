import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import { firebaseConfig } from "./config";

firebase.initializeApp(firebaseConfig);
export const auth = firebase.firestore();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const functions = firebase.functions();
export const FirebaseTimeStamp = firebase.firestore.Timestamp;
