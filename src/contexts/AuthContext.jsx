import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  async function signup(email, password) {
    console.log("[AuthContext - signup] 시작", { email });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("[AuthContext - signup] 성공:", userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error("[AuthContext - signup] 에러코드:", error.code, " / 에러메시지:", error.message);
      throw error;
    }
  }

  async function login(email, password) {
    console.log("[AuthContext - login] 시작", { email });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("[AuthContext - login] 성공:", userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error("[AuthContext - login] 에러코드:", error.code, " / 에러메시지:", error.message);
      throw error;
    }
  }

  async function logout() {
    console.log("[AuthContext - logout] 시작");
    try {
      await signOut(auth);
      console.log("[AuthContext - logout] 완료");
    } catch (error) {
      console.error("[AuthContext - logout] 에러:", error);
      throw error;
    }
  }

  useEffect(() => {
    console.log("[AuthContext] onAuthStateChanged 리스너 등록...");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("[AuthContext] 인증 상태 변경 감지. 사용자 정보:", user ? `UID: ${user.uid}` : "없음 (로그아웃됨)");
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      console.log("[AuthContext] onAuthStateChanged 리스너 해제");
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
