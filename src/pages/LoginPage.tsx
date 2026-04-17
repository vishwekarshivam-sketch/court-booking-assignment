import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

const TICKER_ITEMS = [
  "Badminton Court 1 · 5 slots open",
  "Tennis Court 1 · 7 slots open",
  "Squash Court 1 · 2 slots open",
  "Badminton Court 2 · Fully booked",
  "Squash Court 2 · Fully booked",
];

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!email) { setEmailError("Email is required."); valid = false; } else setEmailError("");
    if (!password) { setPasswordError("Password is required."); valid = false; } else setPasswordError("");
    if (!valid) return;

    setLoading(true);
    setAuthError("");
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setAuthError(error.message);
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setAuthError(err.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  const tickerContent = TICKER_ITEMS.join("   ·   ");

  return (
    <>
      {/* Live ticker */}
      <div className="auth-ticker">
        <div className="auth-ticker__inner">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="auth-ticker__text">{tickerContent}</span>
          ))}
        </div>
      </div>

      <div className="auth-page">
        {/* Ghost bg number */}
        <div className="auth-bg-number">01</div>

        <div className="auth-container">
          <div className="auth-card">
            {/* Logo */}
            <div className="auth-logo-block">
              <div className="auth-eyebrow">IIT Bombay Sports</div>
              <div className="auth-logo">
                COURT<span className="logo-accent">BOOK</span>
              </div>
            </div>

            {/* Headline */}
            <div className="auth-headline">SIGN<br />IN.</div>
            <p className="auth-tagline">Reserve your court, play your game.</p>

            {authError && <div className="auth-error">⚠ {authError}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className={`form-input${emailError ? " input-error" : ""}`}
                  placeholder="you@iitb.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                {emailError && <span className="form-error">⚠ {emailError}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className={`form-input${passwordError ? " input-error" : ""}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                {passwordError && <span className="form-error">⚠ {passwordError}</span>}
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <><span className="btn-spinner" />SIGNING IN</>
                ) : (
                  "SIGN IN →"
                )}
              </button>
            </form>

            <div className="auth-footer-link">
              No account?{" "}
              <Link to="/signup" className="auth-link">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
