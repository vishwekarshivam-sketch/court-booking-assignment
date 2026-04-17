import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignUpPage.css";

const TICKER_ITEMS = [
  "Badminton Court 1 · 5 slots open",
  "Tennis Court 1 · 7 slots open",
  "Squash Court 1 · 2 slots open",
  "Badminton Court 2 · Fully booked",
  "Squash Court 2 · Fully booked",
];

const SignUpPage: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string; auth?: string }>({});
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const next: typeof errors = {};
    if (!fullName.trim()) next.fullName = "Full name is required.";
    if (!email.trim()) next.email = "Email is required.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 8) next.password = "Password must be at least 8 characters.";
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setErrors({ auth: error.message });
      } else {
        alert("Signup successful! Please login.");
        navigate("/login");
      }
    } catch (err: any) {
      setErrors({ auth: err.message || "An error occurred during sign up" });
    } finally {
      setLoading(false);
    }
  };

  const tickerContent = TICKER_ITEMS.join("   ·   ");

  return (
    <>
      <div className="auth-ticker">
        <div className="auth-ticker__inner">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="auth-ticker__text">{tickerContent}</span>
          ))}
        </div>
      </div>

      <div className="auth-page">
        <div className="auth-bg-number">02</div>

        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-logo-block">
              <div className="auth-eyebrow">IIT Bombay Sports</div>
              <div className="auth-logo">
                COURT<span className="logo-accent">BOOK</span>
              </div>
            </div>

            <div className="auth-headline">CREATE<br />ACCOUNT.</div>
            <p className="auth-tagline">Join CourtBook. Book courts. Play more.</p>

            {errors.auth && <div className="auth-error">⚠ {errors.auth}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  className={`form-input${errors.fullName ? " input-error" : ""}`}
                  placeholder="Aditya Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
                {errors.fullName && <span className="form-error">⚠ {errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className={`form-input${errors.email ? " input-error" : ""}`}
                  placeholder="you@iitb.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                {errors.email && <span className="form-error">⚠ {errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className={`form-input${errors.password ? " input-error" : ""}`}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                {errors.password && <span className="form-error">⚠ {errors.password}</span>}
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <><span className="btn-spinner" />CREATING ACCOUNT</>
                ) : (
                  "CREATE ACCOUNT →"
                )}
              </button>
            </form>

            <div className="auth-footer-link">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
