import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AdSlot } from "./AdSlot";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="container pt-2">
        <AdSlot variant="top-banner" />
      </div>
      <main className="flex-1 pb-24 lg:pb-10">{children}</main>
      <Footer />
      <AdSlot variant="sticky-footer" />
    </div>
  );
};
