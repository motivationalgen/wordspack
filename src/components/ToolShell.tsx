import { ReactNode, useEffect } from "react";
import { AdSlot } from "./AdSlot";
import { RecentActivity } from "./RecentActivity";
import { InternalLinks } from "./InternalLinks";
import { SEOHead } from "./SEOHead";
import { ToolMeta } from "@/lib/tools";
import { trackEvent } from "@/lib/analytics";

type Props = {
  tool: ToolMeta;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  inputSection: ReactNode;
  outputSection?: ReactNode;
  hasOutput?: boolean;
  seoContent: ReactNode;
  bottomSection?: ReactNode;
  fullWidth?: boolean;
};

export const ToolShell = ({
  tool,
  title,
  description,
  metaTitle,
  metaDescription,
  inputSection,
  outputSection,
  hasOutput = false,
  seoContent,
  bottomSection,
  fullWidth = false,
}: Props) => {
  useEffect(() => {
    trackEvent(tool.name);
  }, [tool.name]);

  return (
    <>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        path={tool.path}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          applicationCategory: "UtilityApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description: metaDescription,
        }}
      />
      <div className={`container grid ${fullWidth ? "lg:grid-cols-1" : "lg:grid-cols-[1fr_300px]"} gap-8 pt-4`}>
        <article className="min-w-0">
          <header className="mb-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl" aria-hidden>{tool.emoji}</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">{title}</h1>
            </div>
            <p className="text-muted-foreground">{description}</p>
          </header>

          {hasOutput && (
            <>
              <section className="rounded-[14px] border border-border bg-card p-5 shadow-sm animate-fade-in">
                {outputSection}
              </section>
              <AdSlot variant="after-results" />
            </>
          )}

          <section className="rounded-[14px] border border-border bg-card p-5 shadow-sm animate-fade-in">
            {inputSection}
          </section>

          {!hasOutput && <AdSlot variant="in-tool" />}

          <RecentActivity slug={tool.slug} />

          {bottomSection && (
            <section className="rounded-[14px] border border-border bg-card p-5 shadow-sm animate-fade-in mt-6">
              {bottomSection}
            </section>
          )}

          <section className="prose prose-sm sm:prose-base max-w-none mt-10 text-foreground">
            {seoContent}
          </section>

          <InternalLinks excludeSlug={tool.slug} />
        </article>

        {!fullWidth && (
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <AdSlot variant="sidebar" />
            </div>
          </aside>
        )}
      </div>
    </>
  );
};
