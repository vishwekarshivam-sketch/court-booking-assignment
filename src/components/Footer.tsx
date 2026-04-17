import React from "react";
import "./Footer.css";

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const NAV_LINKS = [
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy",     href: "#" },
  { label: "Contact Us",         href: "#" },
];

const SOCIALS = [
  { label: "Facebook",  href: "https://www.facebook.com/iitbombaysports/",                      Icon: FacebookIcon  },
  { label: "Instagram", href: "https://www.instagram.com/iitbombaysports",                      Icon: InstagramIcon },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/iit-bombay-sports/",            Icon: LinkedInIcon  },
];

const Footer: React.FC = () => (
  <footer className="site-footer">
    <div className="site-footer__top">
      <span className="site-footer__logo">
        COURT<span className="site-footer__logo-accent">BOOK</span>
      </span>

      <nav className="site-footer__nav">
        {NAV_LINKS.map(({ label, href }) => (
          <a key={label} href={href} className="site-footer__nav-link">{label}</a>
        ))}
      </nav>
    </div>

    <div className="site-footer__divider" />

    <div className="site-footer__bottom">
      <p className="site-footer__copy">
        By accessing this page, you confirm that you have read, understood, and agreed to our Terms of Service and Privacy Policy. All rights reserved. © {new Date().getFullYear()} IIT Bombay Sports.
      </p>

      <div className="site-footer__socials">
        {SOCIALS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer__social-icon"
            aria-label={label}
          >
            <Icon />
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
