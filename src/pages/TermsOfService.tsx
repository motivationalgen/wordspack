import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { AdSlot } from '@/components/AdSlot';

const TermsOfService = () => {
  const title = 'Terms of Service - Wordspack';
  const description = 'Wordspack terms: Free tools for personal use. No warranty, comply with laws.';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TermsOfService',
    name: 'Wordspack Terms of Service',
    description: description,
  };

  return (
    <>
      <SEOHead title={title} description={description} path="/terms" jsonLd={jsonLd} />
      <div className="container max-w-4xl py-12 space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground">Last updated: October 2024</p>
        </header>

        <section className="prose prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary prose-strong:font-semibold max-w-none">
          <p>By using Wordspack, you agree to these terms.</p>

          <h2>Use of service</h2>
          <p>Free for personal, non-commercial use. Do not abuse tools or violate laws.</p>

          <h2>Content</h2>
          <p>Your inputs are yours. We don't claim ownership. AI tools may have limits/accuracy issues.</p>

          <h2>No warranty</h2>
          <p>Tools provided "as is". No liability for errors or damages.</p>

          <h2>Termination</h2>
          <p>We may restrict access for violations.</p>

          <h2>Privacy</h2>
          <p>See our <Link to="/privacy">Privacy Policy</Link>.</p>

          <h2>Changes</h2>
          <p>Terms may change. Continued use = acceptance.</p>
        </section>

        <AdSlot variant="mid-content" />
      </div>
    </>
  );
};

export default TermsOfService;

