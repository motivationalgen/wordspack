import { ReactNode } from 'react';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';

interface PageLayoutProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, any>;
  children: ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
}

export const PageLayout = ({
  title,
  description,
  path,
  jsonLd,
  children,
  headerTitle,
  headerSubtitle,
}: PageLayoutProps) => {
  return (
    <Layout>
      <SEOHead title={title} description={description} path={path} jsonLd={jsonLd} />
      <div className="container max-w-4xl py-12 space-y-8">
        {headerTitle && (
          <header className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              {headerTitle}
            </h1>
            {headerSubtitle && (
              <p className="text-xl text-muted-foreground">{headerSubtitle}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </Layout>
  );
};
