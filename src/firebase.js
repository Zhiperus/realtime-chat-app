import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC0o7hSN-hcGKU80ouwa9wXMOU2gKKWKBc",
  authDomain: "realtime-chat-app-82aed.firebaseapp.com",
  projectId: "realtime-chat-app-82aed",
  storageBucket: "realtime-chat-app-82aed.appspot.com",
  messagingSenderId: "131150746598",
  appId: "1:131150746598:web:eecba04f8611af4300fc27",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
