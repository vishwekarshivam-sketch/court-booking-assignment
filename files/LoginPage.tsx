import React, { useState } from "react";

// ─── Raw Athletic Design System ─────────────────────────────────────────────
// Background:   #0d0d0d (page), #111111 (surface), #1a1a1a (elevated)
// Border:       #222222 (default), #2e2e2e (hover), #e5ff00 (active/focus)
// Text:         #f0f0f0 (primary), #888888 (secondary), #444444 (muted)
// Accent:       #e5ff00 (electric yellow-green)
// Error:        #ff4d4d
// Fonts:        Bebas Neue (display), DM Sans (body/labels), DM Mono (data)
// Radius:       2px (hard-edged, no rounded softness)
// ────────────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0d0d0d",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-body)",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
  },

  // Decorative background number
  bgNumber: {
    position: "absolute",
    fontFamily: "var(--font-display)",
    fontSize: "clamp(180px, 30vw, 360px)",
    color: "#f0f0f0",
    opacity: 0.025,
    letterSpacing: "-8px",
    userSelect: "none",
    pointerEvents: "none",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    lineHeight: 1,
    whiteSpace: "nowrap",
  },

  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "420px",
    border: "1px solid #222222",
    background: "#111111",
    padding: "40px",
  },

  logoBlock: {
    marginBottom: "36px",
  },

  logoEyebrow: {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    letterSpacing: "3px",
    textTransform: "uppercase" as const,
    color: "#444",
    marginBottom: "6px",
  },

  logoText: {
    fontFamily: "var(--font-display)",
    fontSize: "36px",
    letterSpacing: "4px",
    color: "#f0f0f0",
    lineHeight: 1,
  },

  logoAccent: {
    color: "#e5ff00",
  },

  headline: {
    fontFamily: "var(--font-display)",
    fontSize: "48px",
    letterSpacing: "2px",
    color: "#f0f0f0",
    lineHeight: 1,
    marginBottom: "8px",
  },

  subtext: {
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    color: "#888",
    marginBottom: "36px",
    lineHeight: 1.5,
  },

  formGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "#888",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    background: "#0d0d0d",
    border: "1px solid #222",
    color: "#f0f0f0",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    padding: "12px 14px",
    outline: "none",
    borderRadius: "2px",
    boxSizing: "border-box" as const,
    transition: "border-color 150ms",
  },

  inputError: {
    borderColor: "#ff4d4d",
  },

  errorMsg: {
    display: "block",
    fontFamily: "var(--font-data)",
    fontSize: "11px",
    color: "#ff4d4d",
    marginTop: "6px",
    letterSpacing: "0.5px",
  },

  submitBtn: {
    width: "100%",
    background: "#e5ff00",
    color: "#0d0d0d",
    fontFamily: "var(--font-display)",
    fontSize: "18px",
    letterSpacing: "3px",
    padding: "14px 24px",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "opacity 150ms",
  },

  submitBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid #0d0d0d",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },

  footer: {
    marginTop: "28px",
    paddingTop: "24px",
    borderTop: "1px solid #1a1a1a",
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    color: "#444",
    textAlign: "center" as const,
  },

  footerLink: {
    color: "#e5ff00",
    textDecoration: "none",
    fontWeight: 600,
  },

  // Ticker at top
  ticker: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    background: "#e5ff00",
    color: "#0d0d0d",
    fontFamily: "var(--font-data)",
    fontSize: "10px",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    padding: "5px 0",
    overflow: "hidden",
    zIndex: 100,
  },

  tickerInner: {
    display: "flex",
    gap: "80px",
    animation: "ticker 20s linear infinite",
    whiteSpace: "nowrap" as const,
  },
};

const TICKER_ITEMS = [
  "Badminton Court 1 · 5 slots open",
  "Tennis Court 1 · 7 slots open",
  "Squash Court 1 · 2 slots open",
  "Badminton Court 2 · Fully booked",
  "Squash Court 2 · Fully booked",
];

const LoginPage: React.FC = () => {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [emailError, setEmailError] = useState("");
  const [pwError, setPwError]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused, setPwFocused]   = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    if (!email)    { setEmailError("Email required"); valid = false; } else setEmailError("");
    if (!password) { setPwError("Password required"); valid = false; } else setPwError("");
    if (!valid) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const tickerContent = TICKER_ITEMS.join("   ·   ");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #0d0d0d inset !important;
          -webkit-text-fill-color: #f0f0f0 !important;
        }
        input:focus {
          border-color: #e5ff00 !important;
          box-shadow: 0 0 0 1px #e5ff0033;
        }
      `}</style>

      {/* Live ticker */}
      <div style={styles.ticker}>
        <div style={styles.tickerInner}>
          {[...Array(6)].map((_, i) => (
            <span key={i}>{tickerContent}</span>
          ))}
        </div>
      </div>

      <div style={{ ...styles.page, paddingTop: "48px" }}>
        {/* Giant background number */}
        <div style={styles.bgNumber}>01</div>

        <div style={styles.card}>
          {/* Logo */}
          <div style={styles.logoBlock}>
            <div style={styles.logoEyebrow}>IIT Bombay Sports</div>
            <div style={styles.logoText}>
              COURT<span style={styles.logoAccent}>BOOK</span>
            </div>
          </div>

          {/* Headline */}
          <div style={styles.headline}>SIGN<br />IN.</div>
          <p style={styles.subtext}>Reserve your court, play your game.</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                style={{
                  ...styles.input,
                  ...(emailError ? styles.inputError : {}),
                }}
                placeholder="you@iitb.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoComplete="email"
              />
              {emailError && <span style={styles.errorMsg}>⚠ {emailError}</span>}
            </div>

            {/* Password */}
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                style={{
                  ...styles.input,
                  ...(pwError ? styles.inputError : {}),
                }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPwFocused(true)}
                onBlur={() => setPwFocused(false)}
                autoComplete="current-password"
              />
              {pwError && <span style={styles.errorMsg}>⚠ {pwError}</span>}
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                ...(loading ? styles.submitBtnDisabled : {}),
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={styles.spinner} />
                  SIGNING IN
                </>
              ) : (
                "SIGN IN →"
              )}
            </button>
          </form>

          <div style={styles.footer}>
            No account?{" "}
            <a href="/signup" style={styles.footerLink}>Sign up</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
