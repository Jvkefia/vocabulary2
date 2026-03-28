import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./AuthPage.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup, loginAsGuest } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err) {
      console.error("Firebase Auth Error:", err);
      setError(`${isLogin ? "로그인" : "회원가입"}에 실패했습니다. ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "로그인" : "회원가입"}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="이메일을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          <button disabled={loading} type="submit" className="auth-button">
            {isLogin ? "로그인" : "회원가입"}
          </button>
        </form>
        
        <div className="auth-divider">또는</div>
        
        <button 
          onClick={loginAsGuest} 
          className="guest-button"
          disabled={loading}
        >
          로그인 없이 바로하기
        </button>

        <div className="auth-toggle">
          {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
            {isLogin ? "회원가입" : "로그인"}
          </button>
        </div>
      </div>
    </div>
  );
}
