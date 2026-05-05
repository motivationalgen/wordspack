import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { AdSlot } from '@/components/AdSlot';

const PrivacyPolicy = () => {
  const title = 'Privacy Policy - Wordspack';
  const description = 'Wordspack privacy policy: We respect your privacy. No accounts required, data stays in browser. Google AdSense uses cookies for ads.';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PrivacyPolicy',
    name: 'Wordspack Privacy Policy',
    description: description,
  };

  return (
    <>
      <SEOHead title={title} description={description} path="/privacy" jsonLd={jsonLd} />
      <div className="container max-w-4xl py-12 space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground">Last updated: October 2024</p>
        </header>

        <section className="prose prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary prose-strong:font-semibold max-w-none">
          <p>
            Wordspack ("we", "us", "our") respects your privacy and is committed to protecting it through our compliance with this policy.
          </p>

          <h2>What data we collect</h2>
          <p>No accounts or personal info required. Tool inputs stay in your browser session. No server storage.</p>

          <h2>Google AdSense</h2>
          <p>This site uses Google AdSense. Google may use cookies/DoubleClick cookie for ads based on visit history. You can opt-out via <a href="https://adssettings.google.com" target="_blank" rel="noopener">Google Ads Settings</a>.</p>
          <p>Publisher ID: pub-1979832052674759</p>

          <h2>Cookies</h2>
          <p>We use essential cookies for functionality. Ad partners use cookies for targeting. Browser settings control cookies.</p>

          <h2>Third parties</h2>
          <ul>
            <li>Google AdSense for ads</li>
            <li>Analytics (aggregate, anonymized)</li>
          </ul>

          <h2>Changes</h2>
          <p>We may update this policy. Check periodically.</p>

          <h2>Contact</h2>
          <p>Questions? Use our <Link to="/contact">Contact page</Link>.</p>
        </section>

        <AdSlot variant="mid-content" />
      </div>
    </>
  );
};

export default PrivacyPolicy;

