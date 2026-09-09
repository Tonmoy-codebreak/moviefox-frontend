"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Film, Mail, Send, CheckCircle2, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const TRENDING_GENRES = [
  "Action",
  "Sci-Fi",
  "Thriller",
  "Drama",
  "Comedy",
  "Horror",
  "Romance",
  "Documentary",
  "Fantasy",
  "Mystery",
];

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Media", href: "/media" },
  { label: "Watchlist", href: "/watchlist" },
  { label: "Completed", href: "/completed" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire up to real newsletter endpoint
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">
      {/* Marquee bulb strip — like the light bulbs around a cinema marquee sign */}
      <div className="flex justify-center flex-wrap gap-2.5 px-6 py-3 bg-gradient-to-b from-white/[0.03] to-transparent">
        {Array.from({ length: 32 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "size-1.5 rounded-full",
              i % 6 === 0 ? "bg-[#E23636]" : "bg-[#F5C518]",
            )}
            style={{
              animation: "marqueeBulb 1.8s ease-in-out infinite",
              animationDelay: `${i * 0.07}s`,
            }}
          />
        ))}
      </div>

      {/* Scrolling genre ticker — like an LED marquee display */}
      <div className="relative border-y border-white/10 bg-white/[0.02] py-2.5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          className="flex w-max whitespace-nowrap gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white/25"
          style={{ animation: "marqueeScroll 26s linear infinite" }}
        >
          {[...TRENDING_GENRES, ...TRENDING_GENRES].map((genre, i) => (
            <span key={i} className="flex items-center gap-2.5">
              <span className="size-1 rounded-full bg-[#F5C518]" />
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="flex items-center justify-center size-9 rounded-xl bg-[#F5C518] shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Film className="size-4 text-black" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Moviefox
              </span>
            </Link>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed">
              Your next favorite story is always queued up. Stream, track, and
              never lose your place.
            </p>
          </div>

          {/* Explore */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/30">
              Explore
            </h4>
            <nav className="flex flex-col gap-2.5 text-sm">
              {EXPLORE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-white/60 hover:text-[#F5C518] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/30">
              Company
            </h4>
            <nav className="flex flex-col gap-2.5 text-sm">
              {COMPANY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-white/60 hover:text-[#F5C518] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/30">
              Stay in the loop
            </h4>
            <p className="text-sm text-white/40">
              New releases, straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/25" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-11 py-2.5 bg-white/[0.04] border-2 border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E23636] focus:bg-white/[0.06] focus:ring-4 focus:ring-[#E23636]/10 transition-all"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-lg bg-[#F5C518] text-black hover:bg-[#ffd84d] transition-colors"
              >
                <Send className="size-3.5" />
              </button>
            </form>
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium transition-opacity duration-300",
                subscribed
                  ? "text-green-400 opacity-100"
                  : "text-transparent opacity-0",
              )}
            >
              <CheckCircle2 className="size-3.5 flex-shrink-0" />
              You&apos;re on the list!
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto max-w-6xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Moviefox. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs">
            <Link
              href="/privacy"
              className="text-white/40 hover:text-white/70 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-white/40 hover:text-white/70 transition-colors"
            >
              Terms
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-white/40 hover:text-[#F5C518] transition-colors cursor-pointer"
            >
              Back to top
              <ArrowUp className="size-3" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marqueeBulb {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
