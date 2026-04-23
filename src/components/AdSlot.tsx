import { cn } from "@/lib/utils";

type Variant = "top-banner" | "in-tool" | "after-results" | "sidebar" | "sticky-footer";

export const AdSlot = ({ variant, className }: { variant: Variant; className?: string }) => {
  return (
    <div
      className={cn("ad-slot", variant, className)}
      data-ad-slot={variant}
      aria-label="Advertisement"
      role="complementary"
    >
      <span>Advertisement</span>
    </div>
  );
};
