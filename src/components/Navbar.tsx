import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { TOOLS } from "@/lib/tools";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  
  // Split tools into popular and others for desktop nav if needed, 
  // but for now let's just use a dropdown for all tools to keep it clean.
  
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight" onClick={() => setOpen(false)}>
          <Logo className="h-8 w-8 text-primary" />
          <span>Wordspack</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-4">
          <NavLink to="/" className={({ isActive }) => cn("text-sm font-medium transition-colors", isActive ? "text-primary" : "text-muted-foreground hover:text-primary")}>
            Home
          </NavLink>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors outline-none">
              Tools <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 grid grid-cols-1 gap-1 p-2">
              {TOOLS.map((t) => (
                <DropdownMenuItem key={t.slug} asChild>
                  <Link to={t.path} className="flex items-center gap-2 w-full cursor-pointer">
                    <span className="text-lg">{t.emoji}</span>
                    <span>{t.name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="lg:hidden p-2 rounded-md hover:bg-secondary"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-2 grid">
            {TOOLS.map((t) => (
              <NavLink
                key={t.slug}
                to={t.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-2 py-2.5 rounded-md text-sm font-medium",
                    isActive ? "bg-secondary text-primary" : "text-foreground hover:bg-secondary/60",
                  )
                }
              >
                <span className="mr-2">{t.emoji}</span>
                {t.name}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
