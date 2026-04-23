import { Link } from "react-router-dom";
import { TOOLS } from "@/lib/tools";

import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="container py-10 grid gap-8 md:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-2 font-extrabold text-lg">
            <Logo className="h-8 w-8 text-primary" />
            Wordspack
          </Link>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Free, fast word tools for writers, students, gamers, and creators. No signup required — your activity stays
            in your browser.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3">All tools</h3>
          <ul className="grid grid-cols-1 gap-1.5 text-sm">
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <Link to={t.path} className="text-muted-foreground hover:text-primary transition-colors">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3">About</h3>
          <p className="text-sm text-muted-foreground">
            Wordspack brings together everyday word utilities in one clean, mobile-first interface. Bookmark it for your
            next puzzle, paper, or pitch deck.
          </p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-4 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 justify-between items-center">
          <span>© {new Date().getFullYear()} Wordspack. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Built for speed, privacy, and creativity.</span>
            <span className="opacity-60">|</span>
            <span>
              Designed By:{" "}
              <a 
                href="https://wa.link/ol59sm" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors underline decoration-dotted"
              >
                Elevated Designs
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
