import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./AuthPage.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

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
      setError(`Failed to ${isLogin ? "log in" : "create an account"}. ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button disabled={loading} type="submit" className="auth-button">
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
        <div className="auth-toggle">
          {isLogin ? "Need an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}
