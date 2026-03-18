import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log("[Firebase] 설정 정보 로딩 결과:", {
  apiKey: firebaseConfig.apiKey ? "존재함 (길이: " + firebaseConfig.apiKey.length + ")" : "없음",
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

console.log("[Firebase] initializeApp 실행");
const app = initializeApp(firebaseConfig);
console.log("[Firebase] getAuth 실행");
export const auth = getAuth(app);
export default app;
