import React, { useState, useEffect, useRef } from "react";
import "./HeroSlideshow.css";

const SLIDES = [
  {
    sport: "BADMINTON",
    headline: "Smash the Limits",
    sub: "Book your court. Own the game.",
    color: "#4ade80",
    img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1400&q=80&auto=format&fit=crop",
  },
  {
    sport: "SQUASH",
    headline: "Walls Have No Exit",
    sub: "Fast. Fierce. Unforgiving.",
    color: "#fb923c",
    img: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1400&q=80&auto=format&fit=crop",
  },
  {
    sport: "TENNIS",
    headline: "Every Point Earned",
    sub: "Step on court. Leave nothing behind.",
    color: "#a78bfa",
    img: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&q=80&auto=format&fit=crop",
  },
];

const INTERVAL = 4500;

const HeroSlideshow: React.FC = () => {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    if (idx === active || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(idx);
      setAnimating(false);
    }, 300);
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const slide = SLIDES[active] ?? SLIDES[0];

  return (
    <div className="hero-slideshow">
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`hero-slide${i === active ? " hero-slide--active" : ""}`}
          style={{ backgroundImage: `url(${s.img})` }}
          aria-hidden={i !== active}
        />
      ))}

      <div className="hero-overlay" />

      <div className="hero-content">
        <span
          className="hero-sport-tag"
          style={{ color: slide.color, borderColor: slide.color }}
        >
          {slide.sport}
        </span>
        <h2 className={`hero-headline${animating ? " hero-headline--exit" : " hero-headline--enter"}`}>
          {slide.headline}
        </h2>
        <p className={`hero-sub${animating ? " hero-sub--exit" : " hero-sub--enter"}`}>
          {slide.sub}
        </p>
      </div>

      <div className="hero-dots">
        {SLIDES.map((s, i) => (
          <button
            key={i}
            className={`hero-dot${i === active ? " hero-dot--active" : ""}`}
            style={i === active ? { background: s.color, borderColor: s.color } : {}}
            onClick={() => { goTo(i); startTimer(); }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div
        className="hero-progress-bar"
        style={{ background: slide.color }}
        key={active}
      />
    </div>
  );
};

export default HeroSlideshow;
